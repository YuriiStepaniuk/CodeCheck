import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskService } from '../../task/task.service';
import { ExecutionResult, SubmissionResult } from './dtos/submission-result';
import { TestCaseResult } from './dtos/test-case-result.dto';
import { RESULT_TOKEN } from './constants/tokens';
import { DockerSandboxService } from './services/docker-sandbox.service';
import { TestCaseDto } from '../../task/dto/create-task.dto';
import { ExecutionError } from './enums/execution-error.enum';

@Injectable()
export class CodeService {
  constructor(
    private readonly taskService: TaskService,
    private readonly sandbox: DockerSandboxService,
  ) {}
  async submitSolution(
    userCode: string,
    taskId: string,
  ): Promise<SubmissionResult> {
    const task = await this.taskService.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const testCases: TestCaseDto[] = task.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput as unknown,
    }));

    const script = this.buildScript(
      userCode,
      testCases,
      task.entryFunctionName || 'solution',
    );

    const execution = await this.sandbox.runInSandbox(script);

    try {
      const results = this.extractResult(execution);

      const passed = results.filter((r) => r.passed).length;
      return {
        success: true,
        allPassed: passed === results.length,
        totalTests: results.length,
        passedTests: passed,
        results,
      };
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);

      return {
        success: false,
        error: ExecutionError.RUNTIME_ERROR,
        details: execution.error || errorMessage,
      };
    }
  }

  private buildScript(
    userCode: string,
    testCases: TestCaseDto[],
    funcName: string,
  ) {
    return `
  ${userCode}

  (async () => {
    const testCases = ${JSON.stringify(testCases)};
    const results = [];

    // Deep equality helper
    function deepEqual(a, b) {
      if (a === b) return true;

      if (typeof a !== typeof b) return false;

      if (a && b && typeof a === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) return false;

        if (Array.isArray(a)) {
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
          }
          return true;
        } else {
          const keysA = Object.keys(a);
          const keysB = Object.keys(b);
          if (keysA.length !== keysB.length) return false;
          for (const key of keysA) {
            if (!deepEqual(a[key], b[key])) return false;
          }
          return true;
        }
      }

      return false;
    }

    if (typeof ${funcName} !== 'function') {
      console.log('${RESULT_TOKEN}' + JSON.stringify({ error: 'Function ${funcName} is not defined' }));
      return;
    }

    for (let i = 0; i < testCases.length; i++) {
      const t = testCases[i];
      try {
        const actual = await ${funcName}(...t.input);
        const passed = deepEqual(actual, t.expectedOutput);

        results.push({ ...t, actual, passed });
      } catch (e) {
        results.push({ ...t, actual: null, passed: false, error: e.message });
      }
    }

    console.log('${RESULT_TOKEN}' + JSON.stringify(results));
  })();
`;
  }

  private extractResult(execution: ExecutionResult): TestCaseResult[] {
    const logs = execution.logs || [];
    const raw = logs.find((l) => l.includes(RESULT_TOKEN));
    if (!raw) throw new Error('Missing execution results');

    try {
      return JSON.parse(raw.replace(RESULT_TOKEN, '')) as TestCaseResult[];
    } catch {
      throw new Error('Failed to parse execution results');
    }
  }
}

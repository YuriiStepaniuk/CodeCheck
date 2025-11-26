import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskService } from '../../task/task.service';
import { DockerSandboxService } from './services/docker-sandbox.service';
import { TestCaseDto } from '../../task/dto/create-task.dto';
import { ExecutionError } from './enums/execution-error.enum';
import { Language } from '../../task/types/language';
import { ScriptBuilderService } from './services/script-builder.service';
import { SubmissionResult } from './dtos/submission-result';

@Injectable()
export class CodeService {
  constructor(
    private readonly taskService: TaskService,
    private readonly sandbox: DockerSandboxService,
    private readonly scriptBuiledService: ScriptBuilderService,
  ) {}
  async submitSolution(
    userCode: string,
    taskId: string,
    language: Language,
  ): Promise<SubmissionResult> {
    const task = await this.taskService.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const testCases: TestCaseDto[] = task.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput as unknown,
    }));

    const script = this.scriptBuiledService.buildScript(
      language,
      userCode,
      testCases,
      task.entryFunctionName || 'solution',
    );

    const execution = await this.sandbox.runInSandbox(script, language);
    if (execution.error) {
      return {
        success: false,
        error: ExecutionError.RUNTIME_ERROR,
        details: execution.error,
        logs: execution.logs,
      };
    }

    const results = execution.result || [];
    const passedCount = results.filter((r) => r.passed).length;

    return {
      success: true,
      allPassed: results.length > 0 && passedCount === results.length,
      totalTests: results.length,
      passedTests: passedCount,
      results: results,
      logs: execution.logs || [],
    };
  }
}

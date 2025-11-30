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

    let script: string;

    if (language === Language.CSharp) {
      // C# needs the complex builder we created (Base64, Reflection, etc.)
      script = this.scriptBuiledService.buildCSharpScript(
        userCode,
        testCases,
        task.entryFunctionName || 'solution',
      );
    } else {
      // JS/Python use the standard builder
      script = this.scriptBuiledService.buildScript(
        language,
        userCode,
        testCases,
        task.entryFunctionName || 'solution',
      );
    }

    console.log(`[CodeService] Generated Script for ${language}`);

    // 2. Execute (The Sandbox service now handles the Strategy: File vs STDIN)
    const execution = await this.sandbox.runInSandbox(script, language);

    if (execution.error) {
      console.error('C# Execution Failed:', execution.error);

      return {
        success: false,
        error: ExecutionError.RUNTIME_ERROR,
        details: execution.error,
        logs: execution.logs,
      };
    }

    // 3. Process Results
    // Note: C# runner returns an array of results directly in 'execution.result'
    // JS/Python runners usually return the same structure based on your previous code
    const results = Array.isArray(execution.result) ? execution.result : [];
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

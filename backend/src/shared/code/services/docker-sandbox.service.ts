import { Injectable } from '@nestjs/common';
import { ExecutionResult } from '../dtos/submission-result';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { ExecutionError } from '../enums/execution-error.enum';
import { Language } from '../../../task/types/language';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';

const execPromise = promisify(execCallback);

@Injectable()
export class DockerSandboxService {
  private readonly config = {
    memoryLimit: '100m',
    network: '--net=none',
    timeoutMs: 5000,
    hostScriptPath: path.join(process.cwd(), 'temp_scripts'),
    containerScriptPath: '/app/scripts',
    csharpContainerName: 'csharp-sandbox',
  };

  constructor() {
    fs.mkdir(this.config.hostScriptPath, { recursive: true }).catch(
      console.error,
    );
  }

  /**
   * Main Entry Point
   */
  async runInSandbox(
    code: string,
    language: Language,
  ): Promise<ExecutionResult> {
    if (language === Language.CSharp) {
      return this.runCSharpStrategy(code);
    }
    return this.runStandardStrategy(code, language);
  }

  // ==========================================================
  // STRATEGY A: Standard (JS, Python) via STDIN & Ephemeral Container
  // ==========================================================
  private runStandardStrategy(
    code: string,
    language: Language,
  ): Promise<ExecutionResult> {
    return new Promise((resolve) => {
      const image = this.getImageForLanguage(language);
      console.log(`[Sandbox] Starting ${language} via STDIN on image ${image}`);

      const dockerProcess: ChildProcessWithoutNullStreams = spawn('docker', [
        'run',
        '--rm',
        '-i',
        this.config.network,
        `--memory=${this.config.memoryLimit}`,
        image,
      ]);

      let output = '';
      let errorBuffer = '';

      dockerProcess.stdout.setEncoding('utf8');
      dockerProcess.stderr.setEncoding('utf8');

      dockerProcess.stdout.on(
        'data',
        (data: Buffer) => (output += data.toString()),
      );
      dockerProcess.stderr.on(
        'data',
        (data: Buffer) => (errorBuffer += data.toString()),
      );

      dockerProcess.on('close', () => {
        if (!output && errorBuffer) {
          return resolve(this.createErrorResult(errorBuffer));
        }
        resolve(this.parseOutput(output, errorBuffer));
      });

      dockerProcess.on('error', (err: Error) => {
        resolve(
          this.createErrorResult(
            `${ExecutionError.START_FAIL}: ${err.message}`,
          ),
        );
      });

      dockerProcess.stdin.write(code);
      dockerProcess.stdin.end();
    });
  }

  // ==========================================================
  // STRATEGY B: C# via File Mapping & Persistent Container
  // ==========================================================
  private async runCSharpStrategy(code: string): Promise<ExecutionResult> {
    const fileId = uuidv4();
    const fileName = `${fileId}.csx`;
    const hostFilePath = path.join(this.config.hostScriptPath, fileName);
    const containerFilePath = `${this.config.containerScriptPath}/${fileName}`;

    try {
      console.log(`[Sandbox C#] Writing file to ${hostFilePath}`);

      // 1. Write the code to the shared volume folder on Host
      await fs.writeFile(hostFilePath, code);

      // 2. Execute dotnet-script inside the running container
      const command = `docker exec ${this.config.csharpContainerName} dotnet-script ${containerFilePath}`;

      console.log(`[Sandbox C#] Executing: ${command}`);

      const { stdout, stderr } = await execPromise(command, {
        timeout: this.config.timeoutMs,
      });

      // 3. Parse results
      if (stderr && !stdout) {
        return this.createErrorResult(stderr);
      }

      return this.parseOutput(stdout, stderr);
    } catch (e: unknown) {
      console.error('[Sandbox C# Error]', e);

      // Proper type-safe error handling
      let message: string;
      if (e instanceof Error) {
        message = e.message;
      } else if (typeof e === 'object' && e !== null && 'stderr' in e) {
        const maybeError = e as { stderr?: string };
        message = maybeError.stderr ?? 'Unknown C# Execution Error';
      } else {
        message = 'Unknown C# Execution Error';
      }

      return this.createErrorResult(message);
    } finally {
      // 4. Cleanup: Delete the temp file to save space
      await fs
        .unlink(hostFilePath)
        .catch((err) =>
          console.error(`Failed to delete temp file ${hostFilePath}`, err),
        );
    }
  }

  // ==========================================================
  // Helpers
  // ==========================================================
  private getImageForLanguage(language: Language): string {
    switch (language) {
      case Language.JS:
        return 'js-sandbox';
      case Language.Python:
        return 'python-sandbox';
      default:
        throw new Error(
          `Unsupported language for standard strategy: ${language}`,
        );
    }
  }

  private parseOutput(stdout: string, stderr: string): ExecutionResult {
    try {
      const lines = stdout.trim().split('\n');

      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (!line) continue;
        try {
          const json: unknown = JSON.parse(line);

          if (this.isExecutionResult(json)) return json;

          if (Array.isArray(json)) {
            return { result: json, logs: [], error: null };
          }
        } catch {
          // Ignore non-JSON lines
        }
      }

      throw new Error('No valid JSON output found');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(message);
      return {
        result: null,
        error: `${ExecutionError.PARSE_ERROR}. Output: ${stdout}`,
        logs: stderr ? [stderr] : [],
      };
    }
  }

  private createErrorResult(message: string): ExecutionResult {
    return {
      result: null,
      error: message,
      logs: [],
    };
  }

  private isExecutionResult(obj: unknown): obj is ExecutionResult {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      ('result' in obj || 'error' in obj)
    );
  }
}

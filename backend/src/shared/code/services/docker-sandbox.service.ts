import { Injectable } from '@nestjs/common';
import { ExecutionResult } from '../dtos/submission-result';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { ExecutionError } from '../enums/execution-error.enum';
import { Language } from '../../../task/types/language';

@Injectable()
export class DockerSandboxService {
  private readonly config = {
    memoryLimit: '100m',
    network: '--net=none',
    timeoutMs: 5000,
  };

  private getImageForLanguage(language: Language): string {
    switch (language) {
      case Language.JS:
        return 'js-sandbox';
      case Language.Python:
        return 'python-sandbox';
      case Language.CSharp:
        return 'csharp-sandbox';
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  runInSandbox(code: string, language: Language): Promise<ExecutionResult> {
    return new Promise((resolve) => {
      const image = this.getImageForLanguage(language);
      let isFinished = false;

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

      dockerProcess.on('error', (err) => {
        if (isFinished) return;
        isFinished = true;

        resolve({
          result: null,
          error: `${ExecutionError.START_FAIL}: ${err.message}`,
          logs: [],
        });
      });

      dockerProcess.on('close', () => {
        if (isFinished) return;
        isFinished = true;

        if (!output && errorBuffer) {
          return resolve({
            result: null,
            error: errorBuffer,
            logs: [],
          });
        }

        try {
          const lines = output.trim().split('\n');
          let parsed: ExecutionResult | null = null;

          for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (!line) continue;
            try {
              const potentialJson: unknown = JSON.parse(line);

              if (this.isExecutionResult(potentialJson)) {
                if (
                  Array.isArray(potentialJson.result) ||
                  potentialJson.error
                ) {
                  parsed = potentialJson;
                  break;
                }
              }
            } catch (e: unknown) {
              console.error(e);
              resolve({ result: null, error: 'Parse Error', logs: [] });
            }
          }

          if (parsed) {
            resolve(parsed);
          } else {
            throw new Error('No valid JSON structure found in output');
          }
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : String(e);
          resolve({
            result: null,
            error: `${ExecutionError.PARSE_ERROR}: ${message}. \nRAW STDOUT: ${output}\nRAW STDERR: ${errorBuffer}`,
            logs: [],
          });
        }
      });

      // --- 3. INPUT CODE ---
      dockerProcess.stdin.write(code);
      dockerProcess.stdin.end();
    });
  }

  private isExecutionResult(obj: unknown): obj is ExecutionResult {
    if (typeof obj !== 'object' || obj === null) return false;

    return 'result' in obj || 'error' in obj;
  }
}

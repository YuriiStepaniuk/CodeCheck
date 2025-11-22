import { Injectable } from '@nestjs/common';
import { DockerSandboxConfig } from '../constants/docker-sandbox.config';
import { ExecutionResult } from '../dtos/submission-result';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { ExecutionError } from '../enums/execution-error.enum';

@Injectable()
export class DockerSandboxService {
  private readonly config: DockerSandboxConfig = {
    image: 'my-js-sandbox',
    memoryLimit: '100m',
    network: '--net=none',
    timeoutMs: 5000,
  };

  runInSandbox(code: string): Promise<ExecutionResult> {
    return new Promise((resolve) => {
      const dockerProcess: ChildProcessWithoutNullStreams = spawn('docker', [
        'run',
        '--rm',
        '-i',
        this.config.network,
        `--memory=${this.config.memoryLimit}`,
        this.config.image,
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
        resolve({
          result: null,
          error: `${ExecutionError.START_FAIL}: ${err.message}`,
          logs: [],
        });
      });

      dockerProcess.on('close', () => {
        if (!output) {
          return resolve({
            result: null,
            error: errorBuffer || ExecutionError.NO_OUTPUT,
            logs: [],
          });
        }

        try {
          const parsed: ExecutionResult = JSON.parse(output) as ExecutionResult;
          resolve(parsed);
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : String(e);
          resolve({
            result: null,
            error: `${ExecutionError.PARSE_ERROR}: ${message}. Raw output: ${output}`,
            logs: [],
          });
        }
      });

      dockerProcess.stdin.write(code);
      dockerProcess.stdin.end();

      setTimeout(() => {
        dockerProcess.kill();
        resolve({
          result: null,
          error: ExecutionError.TIMEOUT,
          logs: [],
        });
      }, this.config.timeoutMs);
    });
  }
}

export enum ExecutionError {
  PARSE_ERROR = 'Failed to parse runner output',
  NO_OUTPUT = 'Container execution failed (No Output)',
  TIMEOUT = 'Execution timed out.',
  START_FAIL = 'Failed to start container',
  RUNTIME_ERROR = 'Runtime Error',
}

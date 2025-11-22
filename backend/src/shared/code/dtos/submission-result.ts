import { TestCaseResult } from './test-case-result.dto';

export type SubmissionResult =
  | {
      success: true;
      allPassed: boolean;
      totalTests: number;
      passedTests: number;
      results: TestCaseResult[];
    }
  | {
      success: false;
      error: string;
      details: string;
    };

export interface ExecutionResult {
  result: string | null;
  error: string | null;
  logs: string[];
}

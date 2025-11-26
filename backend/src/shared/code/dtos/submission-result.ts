import { TestCaseResult } from './test-case-result.dto';

export type SubmissionResult =
  | {
      success: true;
      allPassed: boolean;
      totalTests: number;
      passedTests: number;
      results: TestCaseResult[];
      logs: string[]; // <--- ADD THIS so users can see their print outputs
    }
  | {
      success: false;
      error: string;
      details: string;
      logs?: string[]; // <--- ADD THIS (Optional, helpful for debugging runtime errors)
    };

export interface ExecutionResult {
  // CHANGED: result is TestCaseResult[], NOT string
  result: TestCaseResult[] | null;
  error: string | null;
  logs: string[];
}

export interface TestCaseResult {
  caseIndex: number;
  passed: boolean;
  input: any[];
  expected: any;
  actual: any;
  error?: string;
}

import { TaskDifficulty } from '@/app/(roles)/teacher/tasks/create/create-task-schema';

export interface Task {
  id: string;
  title: string;
  description: string;
  entryFunctionName: string;
  starterCode: Record<string, string>;
  language: string;
  difficulty: TaskDifficulty;
  points: number;
  createdAt: Date;
  updatedAt: Date;
  testCases: { input: string; expectedOutput: string }[];
}

export interface ExecutionSuccess {
  success: boolean;
  allPassed: boolean;
  totalTests: number;
  passedTests: number;
  results: TestCaseResult[];
  error?: string;
}

export interface ExecutionError {
  success: false;
  error: string;
  details?: string;
}

export interface TestCaseResult {
  input: any[];
  expectedOutput: any;
  actual: any;
  passed: boolean;
  error?: string;
}

export interface FailureContext {
  input?: any;
  expected?: any;
  actual?: any;
  error?: string;
}

export type ExecutionResult = ExecutionSuccess | ExecutionError;

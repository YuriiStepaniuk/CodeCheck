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

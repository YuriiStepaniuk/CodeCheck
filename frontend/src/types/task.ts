import { TaskDifficulty } from '@/app/(roles)/teacher/tasks/create/create-task-schema';

export interface Task {
  id: string;
  starterCode: string;
  difficulty: TaskDifficulty;
  points: number;
  createdAt: Date;
  updatedAt: Date;
  testCases: { input: string; expectedOutput: string }[];
}

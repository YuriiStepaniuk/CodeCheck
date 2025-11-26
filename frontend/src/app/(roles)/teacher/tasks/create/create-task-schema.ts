import z from 'zod';

export enum TaskDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum Language {
  JS = 'JS',
  TS = 'TS',
  C = 'C',
  CSharp = 'C#',
  Python = 'Python',
}

export type Hint = {
  message: string;
  cost: number;
};

const validJson = z.string().refine(
  (val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Must be valid JSON (e.g., [1, 2] or "answer")' }
);

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  difficulty: z.enum(TaskDifficulty),
  points: z.number().min(0),
  starterCode: z.string().optional(),
  language: z.enum(Language),
  entryFunctionName: z.string(),
  testCases: z
    .array(
      z.object({
        input: validJson,
        expectedOutput: validJson,
      })
    )
    .min(1, 'At least one test case is required'),

  hints: z
    .array(
      z.object({
        message: z.string().min(1, 'Hint message is required'),
        cost: z.coerce.number().min(0),
      })
    )
    .default([]),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

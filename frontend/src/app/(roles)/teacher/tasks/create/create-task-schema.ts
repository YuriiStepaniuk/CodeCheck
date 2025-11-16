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
}

export const createTaskSchema = z.object({
  difficulty: z.enum(TaskDifficulty),
  points: z.number().min(0),
  starterCode: z.string().optional(),
  language: z.enum(Language),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
      })
    )
    .min(1),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

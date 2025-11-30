import {
  IsEnum,
  IsInt,
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsNotEmpty,
  Min,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Transform, Type, TransformFnParams } from 'class-transformer';
import { TaskDifficulty } from '../types/task-difficulty';
import { Language } from '../types/language';

export class TestCaseDto {
  @IsArray()
  @Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      return JSON.parse(value) as unknown;
    }
    return value as unknown;
  })
  input: any[];

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      return JSON.parse(value) as unknown;
    }
    return value as unknown;
  })
  expectedOutput: any;
}

export class HintDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsInt()
  @Min(0)
  cost: number;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskDifficulty)
  difficulty: TaskDifficulty;

  @IsInt()
  points: number;

  @IsString()
  starterCode: string;

  @IsString()
  entryFunctionName: string;

  @IsEnum(Language)
  language: Language;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  testCases: TestCaseDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HintDto)
  hints?: HintDto[];

  @IsUUID()
  groupId: string;
}

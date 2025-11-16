import {
  IsEnum,
  IsInt,
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskDifficulty } from '../types/task-difficulty';
import { Language } from '../types/language';

class TestCaseDto {
  @IsString()
  input: string;

  @IsString()
  expectedOutput: string;
}

export class CreateTaskDto {
  @IsEnum(TaskDifficulty)
  difficulty: TaskDifficulty;

  @IsInt()
  points: number;

  @IsString()
  starterCode: string;

  @IsEnum(Language)
  language: Language;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  testCases: TestCaseDto[];
}

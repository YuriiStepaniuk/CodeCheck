import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class EvaluateCodeDto {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  userCode: string;

  @IsString()
  @IsNotEmpty()
  language: string;
}

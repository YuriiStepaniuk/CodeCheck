import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RunCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsUUID()
  @IsNotEmpty()
  taskId: string;
}

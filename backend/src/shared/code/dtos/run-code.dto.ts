import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Language } from '../../../task/types/language';

export class RunCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  language: Language;

  @IsUUID()
  @IsNotEmpty()
  taskId: string;
}

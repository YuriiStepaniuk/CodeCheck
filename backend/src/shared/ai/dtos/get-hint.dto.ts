import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class GetHintDto {
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  userCode: string;

  @IsObject()
  failureContext: {
    input?: any;
    expected?: any;
    actual?: any;
    error?: string;
  };
}

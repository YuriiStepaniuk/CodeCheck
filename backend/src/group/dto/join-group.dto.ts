import { IsString, Length } from 'class-validator';

export class JoinGroupDto {
  @IsString()
  @Length(6, 6, { message: 'Code must be exactly 6 characters' })
  inviteCode: string;
}

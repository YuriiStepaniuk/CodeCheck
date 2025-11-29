import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Current password is required' })
  oldPassword: string;

  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;
}

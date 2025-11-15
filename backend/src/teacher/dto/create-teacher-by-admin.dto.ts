import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTeacherByAdminDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}

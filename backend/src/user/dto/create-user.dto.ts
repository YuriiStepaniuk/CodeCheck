import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../types/role.enum';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

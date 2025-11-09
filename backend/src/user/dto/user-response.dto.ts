import { Expose } from 'class-transformer';
import { Role } from '../types/role.enum';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;
}

import { Role } from '../../user/types/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}

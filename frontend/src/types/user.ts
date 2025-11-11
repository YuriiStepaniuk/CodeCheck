import { ROLE } from './role';

export type UserResponse = {
  user: User;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: keyof typeof ROLE;
};

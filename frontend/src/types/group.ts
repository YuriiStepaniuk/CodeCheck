import { Role } from './role';

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherResponse {
  id: string;
  userId: string;
  joinedAt: string;
  user: UserResponse;
}

export interface GroupResponse {
  id: string;
  name: string;
  inviteCode: string;
  teacher: TeacherResponse;
}

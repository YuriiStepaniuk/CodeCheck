import { User } from './user';

export interface Teacher {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherResponse {
  user: User;
  teacher: Teacher;
}

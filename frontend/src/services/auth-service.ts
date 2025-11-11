import { API_URL } from '@/lib/constants/api-urls';
import axiosClient from '../config/axios-config';
import { RegisterUserSchema } from '@/app/(auth)/register/register-user-schema';
import { LoginUserSchema } from '@/app/(auth)/login/login-schema';
import { UserResponse } from '@/types/user';
import { LogoutResponse } from '@/types/auth';

class AuthService {
  constructor() {}

  async register(data: RegisterUserSchema) {
    const response = await axiosClient.post<UserResponse>(
      API_URL.AUTH.REGISTER,
      data
    );

    return response.data.user;
  }

  async login(data: LoginUserSchema) {
    const response = await axiosClient.post<UserResponse>(
      API_URL.AUTH.LOGIN,
      data
    );
    console.log(response.data);
    return response.data.user;
  }

  async logout() {
    const response = await axiosClient.post<LogoutResponse>(
      API_URL.AUTH.LOGOUT
    );

    return response.data;
  }
}

export const authService = new AuthService();

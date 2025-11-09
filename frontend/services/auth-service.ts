import { API_URL } from '@/lib/constants/api-urls';
import axiosClient from '../config/axios-config';
import { RegisterUserSchema } from '@/app/register/register-user-schema';

class AuthService {
  constructor() {}

  async register(data: RegisterUserSchema) {
    const response = await axiosClient.post(API_URL.AUTH.REGISTER, data);

    return response.data;
  }
}

export const authService = new AuthService();

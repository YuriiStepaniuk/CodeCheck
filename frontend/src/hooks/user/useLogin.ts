import { useMutation } from '@tanstack/react-query';
import { LoginUserSchema } from '@/app/(auth)/login/login-schema';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/lib/stores/auth-store';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginUserSchema) => authService.login(data),
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data);
      toast.success('Logged in successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

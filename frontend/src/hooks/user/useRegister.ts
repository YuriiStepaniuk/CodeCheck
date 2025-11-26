import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth-service';
import { RegisterUserSchema } from '@/app/(auth)/register/register-user-schema';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { useAuthStore } from '@/lib/stores/auth-store';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: Omit<RegisterUserSchema, 'confirmPassword'>) =>
      authService.register(data),
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data);
      toast.success('Registered successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

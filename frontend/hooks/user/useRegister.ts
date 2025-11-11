import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth-service';
import { RegisterUserSchema } from '@/app/(auth)/register/register-user-schema';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterUserSchema) => authService.register(data),
    onSuccess: () => {
      toast.success('Registered successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

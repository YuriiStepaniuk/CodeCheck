import { useMutation } from '@tanstack/react-query';
import { LoginUserSchema } from '@/app/(auth)/login/login-schema';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginUserSchema) => authService.login(data),
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data);
      toast.success('Logged in successfully!');

      if (data.role === 'ADMIN') router.push('/admin/dashboard');
      else if (data.role === 'TEACHER') router.push('/teacher/dashboard');
      else router.push('/student/dashboard');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

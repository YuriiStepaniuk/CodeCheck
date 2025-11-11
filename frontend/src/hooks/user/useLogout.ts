import { useAuthStore } from '@/lib/stores/auth-store';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { authService } from '@/services/auth-service';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logoutStore();
      toast.success('Logged out successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

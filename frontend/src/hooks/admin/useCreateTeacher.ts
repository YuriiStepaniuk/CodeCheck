import { CreateTeacherSchema } from '@/app/admin/teachers/new/create-teacher.schema';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { adminService } from '@/services/admin-service';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useCreateTeacher = () => {
  return useMutation({
    mutationFn: (data: CreateTeacherSchema) => adminService.createTeacher(data),
    onSuccess: () => {
      toast.success('Teacher created successfully!');
    },

    onError: (error) => {
      getErrorMessage(error);
    },
  });
};

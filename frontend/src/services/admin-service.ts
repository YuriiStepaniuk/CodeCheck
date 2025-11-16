import { CreateTeacherSchema } from '@/app/(roles)/admin/teachers/new/create-teacher.schema';
import axiosClient from '@/config/axios-config';
import { API_URL } from '@/lib/constants/api-urls';
import { CreateTeacherResponse } from '@/types/teacher';

class AdminService {
  async createTeacher(
    data: CreateTeacherSchema
  ): Promise<CreateTeacherResponse> {
    const response = await axiosClient.post(API_URL.ADMIN.CREATE_TEACHER, data);

    return response.data;
  }
}

export const adminService = new AdminService();

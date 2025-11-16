import { CreateTaskSchema } from '@/app/(roles)/teacher/tasks/create/create-task-schema';
import axiosClient from '@/config/axios-config';
import { API_URL } from '@/lib/constants/api-urls';

class TeacherService {
  async createTask(data: CreateTaskSchema) {
    const response = await axiosClient.post(API_URL.TASKS.CREATE_TASK, data);

    return response.data;
  }
}

export const teacherService = new TeacherService();

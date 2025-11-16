import { CreateTaskSchema } from '@/app/(roles)/teacher/tasks/create/create-task-schema';
import axiosClient from '@/config/axios-config';
import { API_URL } from '@/lib/constants/api-urls';
import { Task } from '@/types/task';

class TeacherService {
  async createTask(data: CreateTaskSchema): Promise<Task> {
    const response = await axiosClient.post(API_URL.TASKS.CREATE_TASK, data);

    return response.data;
  }

  async getMyTasks(): Promise<Task[]> {
    const response = await axiosClient.get(API_URL.TASKS.MY_TASKS);

    return response.data;
  }
}

export const teacherService = new TeacherService();

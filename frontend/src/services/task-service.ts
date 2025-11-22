import axiosClient from '@/config/axios-config';
import { Task } from '@/types/task';

class TaskService {
  async getAvailableTasks(): Promise<Task[]> {
    const res = await axiosClient.get('/tasks/available-tasks');
    return res.data;
  }

  async getTaskById(id: string): Promise<Task> {
    const res = await axiosClient.get(`/tasks/${id}`);
    return res.data;
  }
}

export const taskService = new TaskService();

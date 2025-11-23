import axiosClient from '@/config/axios-config';
import { ExecutionResult, FailureContext, Task } from '@/types/task';

class TaskService {
  async getAvailableTasks(): Promise<Task[]> {
    const res = await axiosClient.get('/tasks/available-tasks');
    return res.data;
  }

  async getTaskById(id: string): Promise<Task> {
    const res = await axiosClient.get(`/tasks/${id}`);
    return res.data;
  }

  async submitSolution(
    taskId: string,
    code: string,
    language: string
  ): Promise<ExecutionResult> {
    const res = await axiosClient.post<ExecutionResult>('/code/submit', {
      taskId,
      code,
      language,
    });
    return res.data;
  }

  async getAiHint(
    taskId: string,
    userCode: string,
    failureContext: FailureContext
  ): Promise<string> {
    const res = await axiosClient.post<{ hint: string } | string>('/ai/hint', {
      taskId,
      userCode,
      failureContext,
    });

    if (typeof res.data === 'string') {
      return res.data;
    }
    return res.data.hint;
  }
}

export const taskService = new TaskService();

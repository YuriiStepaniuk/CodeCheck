import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/task-service';
import { Task } from '@/types/task';

export const useGetTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['availableTasks'],
    queryFn: taskService.getAvailableTasks,
  });
};

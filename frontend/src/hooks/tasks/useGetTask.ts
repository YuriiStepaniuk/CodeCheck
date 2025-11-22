import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/task-service';
import { Task } from '@/types/task';

export const useGetTask = (id: string) => {
  return useQuery<Task, Error>({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  });
};

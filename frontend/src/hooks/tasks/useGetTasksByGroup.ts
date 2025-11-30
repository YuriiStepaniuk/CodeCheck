import axiosClient from '@/config/axios-config';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/constants/api-urls';

export const useGetTasksByGroup = (groupId?: string) => {
  return useQuery({
    queryKey: ['tasks-by-group', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      const res = await axiosClient.get(
        `${API_URL.TASKS.AVAILABLE_TASKS}?groupId=${groupId}`
      );
      return res.data;
    },
    enabled: !!groupId,
  });
};

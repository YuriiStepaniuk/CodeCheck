import axiosClient from '@/config/axios-config';
import { API_URL } from '@/lib/constants/api-urls';
import { SingleGroup } from '@/types/group';
import { useQuery } from '@tanstack/react-query';

export const useGetGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await axiosClient.get<SingleGroup[]>(API_URL.TEACHER.GROUPS);
      return res.data;
    },
  });
};

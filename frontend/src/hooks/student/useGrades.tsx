import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/config/axios-config';

export interface StudentTask {
  id: string;
  status: 'ASSIGNED' | 'GRADED';
  grade: number;
  hintsUsed: number;
  feedback: string;
  attempts: number;
  updatedAt: string;
  task: {
    id: string;
    title: string;
    difficulty: string;
    points: number;
    language: string;
  };
}

export function useGrades() {
  const { data: grades, isLoading } = useQuery<StudentTask[]>({
    queryKey: ['my-grades'],
    queryFn: async () => (await axiosClient.get('/grades/my-grades')).data,
  });

  const completed = grades?.filter((g) => g.status === 'GRADED') || [];

  const totalPoints = completed.reduce(
    (acc, curr) => acc + (curr.grade || 0),
    0
  );
  const maxPossible = completed.reduce(
    (acc, curr) => acc + curr.task.points,
    0
  );

  const averageScore =
    maxPossible > 0 ? Math.round((totalPoints / maxPossible) * 100) : 0;

  return {
    grades,
    isLoading,
    stats: {
      completedCount: completed.length,
      totalCount: grades?.length || 0,
      totalPoints,
      averageScore,
    },
  };
}

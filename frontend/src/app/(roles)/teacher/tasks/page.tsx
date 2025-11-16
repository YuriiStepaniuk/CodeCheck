'use client';

import { useQuery } from '@tanstack/react-query';
import { teacherService } from '@/services/teacher-service';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function TeacherTasksPage() {
  const router = useRouter();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['myTasks'],
    queryFn: async () => {
      return await teacherService.getMyTasks();
    },
  });

  if (isLoading) return <p className="text-center mt-12">Loading tasks...</p>;
  if (isError)
    return (
      <p className="text-center mt-12 text-red-500">Error loading tasks.</p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-12 space-y-4">
      <h1 className="text-2xl font-bold">My Tasks</h1>

      <Button onClick={() => router.push('/teacher/tasks/create')}>
        Create New Task
      </Button>

      {tasks?.length === 0 && <p>No tasks created yet.</p>}

      <div className="space-y-2">
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="p-4 border rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Difficulty:</strong> {task.difficulty}
              </p>
              <p>
                <strong>Points:</strong> {task.points}
              </p>
              <p>
                <strong>Test Cases:</strong> {task.testCases.length}
              </p>
            </div>
            <Button onClick={() => router.push(`/teacher/tasks/${task.id}`)}>
              View / Edit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

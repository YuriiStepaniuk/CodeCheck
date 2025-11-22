'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useGetTasks } from '@/hooks/tasks/useGetTasks';

export default function StudentTasksPage() {
  const router = useRouter();
  const { data: tasks = [], isLoading } = useGetTasks();

  if (isLoading) return <p className="text-center mt-12">Loading tasks...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Available Tasks</h1>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="border p-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <p>
              <strong>Task Name:</strong> {task.title}
            </p>

            <p>
              <strong>Difficulty:</strong> {task.difficulty}
            </p>
            <p>
              <strong>Points:</strong> {task.points}
            </p>
          </div>
          <Button onClick={() => router.push(`/student/task/${task.id}/ide`)}>
            Open in IDE
          </Button>
        </div>
      ))}
    </div>
  );
}

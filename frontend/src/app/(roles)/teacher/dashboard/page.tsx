'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TeacherDashboardPage() {
  const router = useRouter();
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>
      <p>Manage tasks and assign them to students.</p>

      <div className="space-x-4">
        <Button onClick={() => router.push('/teacher/tasks/create')}>
          Create Task
        </Button>
        <Button onClick={() => router.push('/teacher/tasks')}>
          View All Tasks
        </Button>
      </div>
    </div>
  );
}

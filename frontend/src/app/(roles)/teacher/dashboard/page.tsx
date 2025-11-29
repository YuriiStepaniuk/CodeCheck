'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Users, FileCode, ArrowRight, Plus } from 'lucide-react'; // Icons for better UI
import { CreateGroupDialog } from '../_components/create-group-dialog';

export default function TeacherDashboardPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-8 max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Teacher Dashboard
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Welcome back. Manage your student groups and coding assignments here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Class Management Card */}
        <div className="p-6 border rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold">Classes</h2>
          </div>

          <p className="text-gray-500 mb-8 min-h-[3rem]">
            Create new student groups, generate invite codes, and track student
            roster.
          </p>

          <div className="flex flex-wrap gap-3">
            {/* The Create Class Modal */}
            <CreateGroupDialog />

            {/* Navigation to View Classes (We haven't built this page yet, but it's good to have the link) */}
            <Button
              variant="outline"
              onClick={() => router.push('/teacher/classes')}
            >
              View My Classes
            </Button>
          </div>
        </div>

        {/* 2. Task Management Card */}
        <div className="p-6 border rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
              <FileCode className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold">Tasks</h2>
          </div>

          <p className="text-gray-500 mb-8 min-h-[3rem]">
            Create coding challenges, set test cases, and grade student
            submissions.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.push('/teacher/tasks/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/teacher/tasks')}
            >
              View All Tasks <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

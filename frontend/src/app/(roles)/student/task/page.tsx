'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useGetTasksByGroup } from '@/hooks/tasks/useGetTasksByGroup';
import { useGetGroups } from '@/hooks/teacher/useGetGroups';
import { SingleGroup } from '@/types/group';
import { Task } from '@/types/task';

export default function StudentTasksPage() {
  const router = useRouter();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchGroupId, setSearchGroupId] = useState<string | null>(null);

  const { data: groups = [], isLoading: groupsLoading } = useGetGroups();

  const { data: tasks = [], isLoading: tasksLoading } = useGetTasksByGroup(
    searchGroupId || undefined
  );
  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      <h1 className="text-2xl font-bold mb-2">Tasks by Group</h1>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium">Select Group</label>
          <Select
            value={selectedGroupId ?? undefined}
            onValueChange={(val) => setSelectedGroupId(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose group..." />
            </SelectTrigger>
            <SelectContent>
              {groups.map((g: SingleGroup) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          disabled={!selectedGroupId}
          onClick={() => setSearchGroupId(selectedGroupId)}
        >
          Find Tasks
        </Button>
      </div>

      {/* --- LOADING STATES --- */}
      {groupsLoading && <p>Loading groups...</p>}
      {tasksLoading && <p>Loading tasks...</p>}

      {/* --- TASK RESULTS --- */}
      <div className="space-y-4 mt-4">
        {tasks.length === 0 && searchGroupId && !tasksLoading && (
          <p>No tasks found for this group.</p>
        )}

        {tasks.map((task: Task) => (
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
    </div>
  );
}

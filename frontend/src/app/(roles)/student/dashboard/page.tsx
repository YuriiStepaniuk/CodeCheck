'use client';

import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/config/axios-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, GraduationCap } from 'lucide-react';
import { JoinClassDialog } from '../_components/join-class-dialog';
import { GroupResponse } from '@/types/group';

export default function StudentDashboardPage() {
  const {
    data: myGroups,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['studentGroups'],
    queryFn: async () => {
      const { data } = await axiosClient.get<GroupResponse[]>(
        '/students/my-groups'
      );
      return data;
    },
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-red-500">
        Failed to load classes. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Student Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Here you can see your tasks and enrolled classes.
          </p>
        </div>

        <JoinClassDialog onJoinSuccess={refetch} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Enrolled Classes
        </h2>

        {!myGroups || myGroups.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-12 text-center bg-gray-50 dark:bg-gray-800/50">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No classes yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              You haven&apos;t joined any classes yet. Ask your teacher for an
              invite code.
            </p>
            <JoinClassDialog onJoinSuccess={refetch} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((group) => (
              <Card
                key={group.id}
                className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold">
                    {group.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Teacher:{' '}
                    {group.teacher
                      ? `${group.teacher.user.firstName} ${group.teacher.user.lastName}`
                      : 'Unknown'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-400 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded w-fit">
                    <Calendar className="w-3 h-3" />
                    <span>Active Student</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

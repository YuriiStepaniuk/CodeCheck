'use client';

import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/config/axios-config';
import {
  Loader2,
  CheckCircle,
  Circle,
  Trophy,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// 1. Define the shape of data coming from your new backend endpoint
interface StudentTask {
  id: string;
  status: 'ASSIGNED' | 'GRADED';
  grade: number;
  hintsUsed: number;
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

export default function GradesPage() {
  // 2. Fetch data using React Query
  const { data: grades, isLoading } = useQuery<StudentTask[]>({
    queryKey: ['my-grades'],
    queryFn: async () => (await axiosClient.get('/grades/my-grades')).data,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="animate-spin text-primary" /> Loading gradebook...
      </div>
    );
  }

  // 3. Calculate Summary Statistics (Client-side math is fine here)
  const completed = grades?.filter((g) => g.status === 'GRADED') || [];
  const totalPoints = completed.reduce(
    (acc, curr) => acc + (curr.grade || 0),
    0
  );
  const maxPossible = completed.reduce(
    (acc, curr) => acc + curr.task.points,
    0
  );

  // Avoid division by zero
  const averageScore =
    maxPossible > 0 ? Math.round((totalPoints / maxPossible) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
        <p className="text-gray-500 mt-1">
          Track your progress, scores, and hint usage.
        </p>
      </div>

      {/* 4. Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Completion */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tasks Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {completed.length}
            </div>
            <p className="text-xs text-muted-foreground">
              out of {grades?.length || 0} assigned
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Total Score */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Points
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalPoints}
            </div>
            <p className="text-xs text-muted-foreground">accumulated score</p>
          </CardContent>
        </Card>

        {/* Card 3: Average */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Score
            </CardTitle>
            <div
              className={`text-sm font-bold ${
                averageScore >= 80 ? 'text-green-600' : 'text-blue-600'
              }`}
            >
              {averageScore}%
            </div>
          </CardHeader>
          <CardContent>
            {/* Simple Progress Bar */}
            <div className="h-2 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  averageScore >= 80 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${averageScore}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Detailed Assignments List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Assignments</h2>

        {grades?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed">
            <p className="text-gray-500">No assignments found yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {grades?.map((item) => {
              const isGraded = item.status === 'GRADED';

              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow group"
                >
                  {/* LEFT: Task Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 p-2 rounded-full shrink-0 ${
                        isGraded ? 'bg-green-50' : 'bg-gray-100'
                      }`}
                    >
                      {isGraded ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary transition-colors">
                        {item.task.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {item.task.difficulty}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {item.task.language}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          • {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* THESIS FEATURE: Hint Penalty Visual */}
                      {isGraded && item.hintsUsed > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-orange-700 mt-2 bg-orange-50 px-2 py-1 rounded w-fit border border-orange-100">
                          <AlertTriangle className="w-3 h-3" />
                          <span>
                            Penalty: -{item.hintsUsed * 5} pts ({item.hintsUsed}{' '}
                            hint used)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Score & Button */}
                  <div className="flex items-center gap-6 pl-4 md:pl-0 border-l md:border-l-0 border-gray-100">
                    <div className="text-right min-w-[80px]">
                      {isGraded ? (
                        <>
                          <div className="text-2xl font-bold text-gray-800">
                            {item.grade}{' '}
                            <span className="text-sm text-gray-400 font-normal">
                              / {item.task.points}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            Final Score
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400 italic">
                          Not submitted
                        </div>
                      )}
                    </div>

                    <Button
                      asChild
                      variant={isGraded ? 'outline' : 'default'}
                      className="min-w-[120px]"
                    >
                      <Link href={`/student/tasks/${item.task.id}`}>
                        {isGraded ? 'Review' : 'Start Task'}
                        {!isGraded && <ArrowRight className="ml-2 w-4 h-4" />}
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

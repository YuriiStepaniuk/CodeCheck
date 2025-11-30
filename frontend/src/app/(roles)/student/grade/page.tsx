'use client';

import { Loader2, CheckCircle, Trophy, BarChart3 } from 'lucide-react';
import { StatCard } from './_components/stat-card';
import { GradeRow } from './_components/grade-row';
import { StudentTask, useGrades } from '@/hooks/student/useGrades';
import { GradeDetailsModal } from './_components/grade-details-modal';
import { useState } from 'react';

export default function GradesPage() {
  const { grades, isLoading, stats } = useGrades();

  const [selectedGrade, setSelectedGrade] = useState<StudentTask | null>(null);
  console.log(grades);
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="animate-spin text-primary" /> Loading gradebook...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
        <p className="text-gray-500 mt-1">
          Track your progress, scores, and hint usage.
        </p>
      </div>

      {/* Stats Grid - Clean & Declarative */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Tasks Completed"
          value={stats.completedCount}
          subtitle={`out of ${stats.totalCount} assigned`}
          icon={CheckCircle}
          iconColor="text-green-500"
        />

        <StatCard
          title="Total Points"
          value={stats.totalPoints}
          subtitle="accumulated score"
          icon={Trophy}
          iconColor="text-yellow-500"
        />

        <StatCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={BarChart3}
          iconColor={
            stats.averageScore >= 80 ? 'text-green-600' : 'text-blue-600'
          }
        >
          {/* Progress Bar Injection */}
          <div className="h-2 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                stats.averageScore >= 80 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${stats.averageScore}%` }}
            />
          </div>
        </StatCard>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Assignments</h2>

        {!grades?.length ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed">
            <p className="text-gray-500">No assignments found yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {grades.map((task) => (
              <GradeRow
                key={task.id}
                item={task}
                onClick={() => setSelectedGrade(task)}
              />
            ))}
          </div>
        )}
      </div>

      <GradeDetailsModal
        isOpen={!!selectedGrade}
        grade={selectedGrade}
        onClose={() => setSelectedGrade(null)}
      />
    </div>
  );
}

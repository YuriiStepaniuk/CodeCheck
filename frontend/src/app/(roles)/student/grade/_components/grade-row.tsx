'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 1. Import useRouter
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Circle,
  AlertTriangle,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { StudentTask } from '@/hooks/student/useGrades';

interface Props {
  item: StudentTask;
  onClick: () => void;
}

export function GradeRow({ item, onClick }: Props) {
  const router = useRouter(); // 2. Initialize router
  const isGraded = item.status === 'GRADED';
  const penaltyPoints = item.hintsUsed * 5;
  console.log(isGraded);
  // 3. Define the split logic
  const handleRowClick = () => {
    if (isGraded) {
      onClick(); // Open Modal
    } else {
      router.push(`/student/tasks/${item.task.id}`); // Navigate to Start Task
    }
  };

  return (
    <div
      onClick={handleRowClick} // 4. Use the new handler
      className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow group cursor-pointer hover:border-primary/50"
    >
      {/* LEFT: Info */}
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

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="text-xs font-normal">
              {item.task.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              {item.task.language}
            </Badge>
            <span className="text-xs text-gray-400">
              • {new Date(item.updatedAt).toLocaleDateString()}
            </span>
          </div>

          {isGraded && item.hintsUsed > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-orange-700 mt-2 bg-orange-50 px-2 py-1 rounded w-fit border border-orange-100">
              <AlertTriangle className="w-3 h-3" />
              <span>
                Penalty: -{penaltyPoints} pts ({item.hintsUsed} hint used)
              </span>
            </div>
          )}
        </div>
      </div>

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
            <div className="text-sm text-gray-400 italic">Not submitted</div>
          )}
        </div>

        {isGraded ? (
          <Button
            variant="outline"
            className="min-w-[120px]"
            onClick={(e) => {
              e.stopPropagation(); // Stop row click
              onClick(); // Open Modal
            }}
          >
            <Eye className="mr-2 w-4 h-4" />
            Details
          </Button>
        ) : (
          <Button
            asChild
            className="min-w-[120px]"
            onClick={(e) => e.stopPropagation()} // Stop row click so Link handles it
          >
            <Link href={`/student/tasks/${item.task.id}`}>
              Start Task
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

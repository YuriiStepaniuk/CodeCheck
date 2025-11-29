import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, AlertTriangle, ArrowRight } from 'lucide-react';
import { StudentTask } from '@/hooks/student/useGrades';

export function GradeRow({ item }: { item: StudentTask }) {
  const isGraded = item.status === 'GRADED';
  const penaltyPoints = item.hintsUsed * 5;

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow group">
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
}

import {
  X,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
  Clock,
  Trophy,
} from 'lucide-react';
import { StudentTask } from '@/hooks/student/useGrades'; // Import your type

interface GradeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: StudentTask | null;
}

export function GradeDetailsModal({
  isOpen,
  onClose,
  grade,
}: GradeDetailsModalProps) {
  if (!isOpen || !grade) return null;

  const passed = grade.grade > 0; // Simple check, or compare with grade.task.points
  const percentage = Math.round((grade.grade / grade.task.points) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                {grade.task.language}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded border border-gray-200 text-gray-600">
                {grade.task.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {grade.task.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Score Card */}
          <div
            className={`p-6 rounded-xl border ${
              passed
                ? 'bg-green-50 border-green-100'
                : 'bg-red-50 border-red-100'
            } flex items-center justify-between`}
          >
            <div>
              <p
                className={`text-sm font-medium mb-1 ${
                  passed ? 'text-green-600' : 'text-red-600'
                }`}
              >
                Final Result
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-4xl font-extrabold ${
                    passed ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {grade.grade}
                </span>
                <span className="text-gray-500 font-medium">
                  / {grade.task.points} pts
                </span>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border ${
                  passed
                    ? 'text-green-700 border-green-200'
                    : 'text-red-700 border-red-200'
                }`}
              >
                {passed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
                <span className="font-bold">
                  {passed ? 'Passed' : 'Failed'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {percentage}% Score Efficiency
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-semibold mb-1">
                <Lightbulb className="w-3.5 h-3.5" /> Hints Used
              </div>
              <p className="text-xl font-bold text-gray-900">
                {grade.hintsUsed}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-semibold mb-1">
                <Trophy className="w-3.5 h-3.5" /> Attempts
              </div>
              <p className="text-xl font-bold text-gray-900">
                {grade.attempts}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-semibold mb-1">
                <Clock className="w-3.5 h-3.5" /> Submitted
              </div>
              <p className="text-sm font-bold text-gray-900 pt-1">
                {new Date(grade.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* AI/Teacher Feedback Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Detailed Feedback
            </div>

            {/* Render Markdown Feedback */}
            <div className="prose prose-sm max-w-none bg-white p-5 rounded-xl border border-gray-200 text-gray-700 shadow-sm">
              {/* If you don't want to install react-markdown, just use whitespace-pre-wrap */}
              {grade.feedback ? (
                <div className="whitespace-pre-wrap font-sans">
                  {grade.feedback}
                </div>
              ) : (
                <p className="text-gray-400 italic">No feedback provided.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

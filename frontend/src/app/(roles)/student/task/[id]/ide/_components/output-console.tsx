import { CheckCircle2, XCircle, X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutputConsoleProps {
  output: any;
  isRunning: boolean;
  aiHint: string | null;
  onDismissHint: () => void;
}

export function OutputConsole({
  output,
  isRunning,
  aiHint,
  onDismissHint,
}: OutputConsoleProps) {
  return (
    <div className="w-1/4 bg-white flex flex-col h-full">
      <div className="p-2 border-b bg-gray-50 font-medium text-sm text-gray-500 px-4">
        Output Console
      </div>

      <div className="flex-1 p-4 overflow-auto font-mono text-sm">
        {/* 1. Empty State */}
        {!output && !isRunning && (
          <p className="text-gray-400 italic text-center mt-10">
            Click "Run Code" to execute tests.
          </p>
        )}

        {/* 2. AI Hint Box (Shows at top if exists) */}
        {aiHint && (
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-indigo-700 flex items-center gap-2 text-xs uppercase tracking-wide">
                <Lightbulb className="w-4 h-4" /> AI Tutor
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-indigo-400 hover:text-indigo-700"
                onClick={onDismissHint}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-indigo-900 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {aiHint}
            </p>
          </div>
        )}

        {/* 3. Critical Runtime Error */}
        {output?.error && (
          <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200 mb-4">
            <h4 className="font-bold mb-1">Runtime Error</h4>
            <div className="whitespace-pre-wrap">
              {output.details || output.error}
            </div>
          </div>
        )}

        {/* 4. Test Results */}
        {output?.results && (
          <div className="space-y-3">
            <div
              className={`flex items-center gap-2 ${
                output.allPassed ? 'text-green-600' : 'text-red-600'
              } font-bold mb-4`}
            >
              {output.allPassed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span>
                {output.allPassed ? 'All Tests Passed!' : 'Tests Failed'}
              </span>
              <span className="text-xs font-normal ml-auto text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {output.passedTests} / {output.totalTests}
              </span>
            </div>

            {output.results.map((res: any, i: number) => (
              <div
                key={i}
                className={`p-3 rounded border text-xs ${
                  res.passed
                    ? 'bg-green-50 border-green-100'
                    : 'bg-red-50 border-red-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {res.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                  )}
                  <span className="font-semibold text-gray-700">
                    Test Case #{i + 1}
                  </span>
                </div>

                {!res.passed && (
                  <div className="space-y-1.5 pl-5">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase">
                        Expected
                      </span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-800 font-medium inline-block">
                        {JSON.stringify(res.expectedOutput)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase">
                        Actual
                      </span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-800 font-medium inline-block">
                        {JSON.stringify(res.actual)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

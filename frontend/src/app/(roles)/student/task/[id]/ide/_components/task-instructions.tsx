interface TaskInstructionsProps {
  description: string;
  testCases: any[];
}

export function TaskInstructions({
  description,
  testCases,
}: TaskInstructionsProps) {
  return (
    <div className="w-1/3 border-r bg-white overflow-y-auto p-6 flex flex-col h-full">
      <h2 className="font-semibold text-lg mb-4 text-gray-900">Description</h2>

      <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap flex-1">
        {description}
      </div>

      <div className="mt-8 pt-6 border-t">
        <h3 className="font-medium mb-3 text-gray-900">Example Cases:</h3>
        <div className="space-y-3">
          {testCases?.slice(0, 2).map((tc, i) => (
            <div
              key={i}
              className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs font-mono"
            >
              <div className="mb-1">
                <span className="text-slate-500 select-none">Input: </span>
                <span className="text-slate-800">
                  {JSON.stringify(tc.input)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 select-none">Output: </span>
                <span className="text-slate-800">
                  {JSON.stringify(tc.expectedOutput)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

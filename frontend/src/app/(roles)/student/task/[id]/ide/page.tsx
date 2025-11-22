'use client';
import { use, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { useGetTask } from '@/hooks/tasks/useGetTask';
import { Language } from '@/app/(roles)/teacher/tasks/create/create-task-schema';
import axiosClient from '@/config/axios-config';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface IdePageProps {
  params: Promise<{ id: string }>;
}

export default function IdePage({ params }: IdePageProps) {
  const { id } = use(params);
  const { data: taskData, isLoading } = useGetTask(id);

  const [code, setCode] = useState('');
  const [output, setOutput] = useState<any>(null); // Store the full result object
  const [isRunning, setIsRunning] = useState(false);

  // 1. FIX: Use useEffect to set starter code only once when data loads
  useEffect(() => {
    if (taskData && !code) {
      const lang = taskData.language as Language;
      // Fallback to starter code or a default message
      const starter =
        taskData.starterCode?.[lang] || '// Write your solution here...';
      setCode(starter);
    }
  }, [taskData, code]);

  if (isLoading || !taskData) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loader2 className="animate-spin" /> Loading task...
      </div>
    );
  }

  const language = taskData.language || 'JS';

  const runCode = async () => {
    setIsRunning(true);
    setOutput(null); // Clear previous output

    try {
      const res = await axiosClient.post('/code/submit', {
        code,
        language: taskData.language, // Send the explicit language from DB
        taskId: taskData.id,
      });

      console.log(res.data);
      setOutput(res.data);
    } catch (error: unknown) {
      setOutput({ error: error.response?.data?.message || 'Execution failed' });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-14 px-4 bg-white border-b flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-800">{taskData.title}</h1>
          <Badge variant="outline">{taskData.difficulty}</Badge>
          <Badge variant="secondary">{taskData.points} pts</Badge>
        </div>

        <Button onClick={runCode} disabled={isRunning}>
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isRunning ? 'Running...' : 'Run Code'}
        </Button>
      </header>

      {/* Main Content - Split Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Instructions */}
        <div className="w-1/3 border-r bg-white overflow-y-auto p-6">
          <h2 className="font-semibold text-lg mb-4">Description</h2>
          {/* If you support Markdown later, use a renderer here. For now, whitespace-pre-wrap helps */}
          <div className="prose text-sm text-gray-700 whitespace-pre-wrap">
            {taskData.description}
          </div>

          {/* Example Test Cases display (Optional) */}
          <div className="mt-8">
            <h3 className="font-medium mb-2">Example Cases:</h3>
            {taskData.testCases?.slice(0, 2).map((tc: any, i: number) => (
              <div
                key={i}
                className="bg-gray-100 p-2 rounded mb-2 text-xs font-mono"
              >
                <p>Input: {JSON.stringify(tc.input)}</p>
                <p>Output: {JSON.stringify(tc.expectedOutput)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE: Editor */}
        <div className="flex-1 border-r relative">
          <Editor
            height="100%"
            defaultLanguage={
              language.toLowerCase() === 'js'
                ? 'javascript'
                : language.toLowerCase()
            }
            language={
              language.toLowerCase() === 'js'
                ? 'javascript'
                : language.toLowerCase()
            }
            value={code}
            onChange={(v) => setCode(v || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* RIGHT: Output / Console */}
        <div className="w-1/4 bg-white flex flex-col">
          <div className="p-2 border-b bg-gray-50 font-medium text-sm text-gray-500">
            Output Console
          </div>

          <div className="flex-1 p-4 overflow-auto font-mono text-sm">
            {!output && !isRunning && (
              <p className="text-gray-400 italic">
                Click "Run Code" to see results.
              </p>
            )}

            {/* Case 1: Critical Error (Syntax/Runtime) */}
            {output?.error && (
              <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
                <h4 className="font-bold mb-1">Runtime Error</h4>
                {output.details || output.error}
              </div>
            )}

            {/* Case 2: Test Results */}
            {output?.results && (
              <div className="space-y-3">
                <div
                  className={
                    output.allPassed
                      ? 'text-green-600 font-bold'
                      : 'text-red-600 font-bold'
                  }
                >
                  {output.allPassed
                    ? '🎉 All Tests Passed!'
                    : '❌ Some Tests Failed'}
                  <span className="text-xs font-normal ml-2 text-gray-500">
                    ({output.passedTests}/{output.totalTests})
                  </span>
                </div>

                {output.results.map((res: any, i: number) => (
                  <div
                    key={i}
                    className={`p-2 rounded border ${
                      res.passed
                        ? 'bg-green-50 border-green-100'
                        : 'bg-red-50 border-red-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {res.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-semibold">Test Case #{i + 1}</span>
                    </div>

                    {!res.passed && (
                      <div className="text-xs ml-6 space-y-1 text-gray-700">
                        <p>
                          Expected:{' '}
                          <span className="bg-white px-1 rounded">
                            {JSON.stringify(res.expectedOutput)}
                          </span>
                        </p>
                        <p>
                          Actual:{' '}
                          <span className="bg-white px-1 rounded">
                            {JSON.stringify(res.actual)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { use, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useGetTask } from '@/hooks/tasks/useGetTask';
import { Loader2 } from 'lucide-react';
import { Language } from '@/app/(roles)/teacher/tasks/create/create-task-schema';

// 1. Import Components
import { IdeHeader } from './_components/ide-header';
import { TaskInstructions } from './_components/task-instructions';
import { OutputConsole } from './_components/output-console';

// 2. Import Custom Hooks
import { useExecuteCode } from '@/hooks/ide/useExecuteCode';
import { useGetAiHint } from '@/hooks/ide/useGetAiHint';

interface IdePageProps {
  params: Promise<{ id: string }>;
}

export default function IdePage({ params }: IdePageProps) {
  const { id } = use(params);
  const { data: taskData, isLoading } = useGetTask(id);

  const [code, setCode] = useState('');

  const { execute, output, isRunning } = useExecuteCode({
    taskId: id,
    language: taskData?.language || 'JS',
  });

  const { askAi, hint, isAiLoading, dismissHint } = useGetAiHint({
    taskId: id,
  });

  useEffect(() => {
    if (taskData && !code) {
      const lang = (taskData.language as Language) || Language.JS;
      const starter =
        taskData.starterCode?.[lang] || '// Write your solution here...';
      setCode(starter);
    }
  }, [taskData, code]);

  const handleRunCode = () => {
    dismissHint();
    execute(code);
  };

  const handleAskAi = () => {
    askAi(code, output);
  };

  if (isLoading || !taskData) {
    return (
      <div className="flex items-center justify-center h-screen gap-2 text-gray-500">
        <Loader2 className="animate-spin text-primary" /> Loading task...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <IdeHeader
        title={taskData.title}
        difficulty={taskData.difficulty}
        points={taskData.points}
        onRun={handleRunCode}
        isRunning={isRunning}
        onAskAi={handleAskAi}
        isAiLoading={isAiLoading}
        hasOutput={!!output}
      />

      <main className="flex-1 flex overflow-hidden">
        <TaskInstructions
          description={taskData.description}
          testCases={taskData.testCases}
        />

        <div className="flex-1 border-r relative bg-[#1e1e1e]">
          <Editor
            height="100%"
            defaultLanguage={
              taskData.language?.toLowerCase() === 'js'
                ? 'javascript'
                : taskData.language?.toLowerCase()
            }
            value={code}
            onChange={(v) => setCode(v || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 20 },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <OutputConsole
          output={output}
          isRunning={isRunning}
          aiHint={hint}
          onDismissHint={dismissHint}
        />
      </main>
    </div>
  );
}

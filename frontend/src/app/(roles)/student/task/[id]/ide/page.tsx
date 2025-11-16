'use client';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';

export default function IdePage({ params }: { params: { id: string } }) {
  const [code, setCode] = useState('// Start coding...');
  const [output, setOutput] = useState('');

  const runCode = async () => {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language: 'python', taskId: params.id }),
    });
    const data = await res.json();
    setOutput(data.output || data.error);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="p-4 bg-white shadow-md flex justify-between items-center">
        <h1 className="text-xl font-semibold">Task #{params.id}</h1>
        <Button onClick={runCode}>Run Code</Button>
      </header>

      <main className="flex-1 flex">
        <div className="w-2/3 border-r">
          <Editor
            height="calc(100vh - 80px)"
            defaultLanguage="python"
            value={code}
            onChange={(v) => setCode(v || '')}
            theme="vs-dark"
          />
        </div>

        <div className="w-1/3 p-4 bg-white">
          <h2 className="font-medium mb-2">Output</h2>
          <pre className="bg-gray-50 p-2 rounded-md h-[calc(100vh-120px)] overflow-auto">
            {output}
          </pre>
        </div>
      </main>
    </div>
  );
}

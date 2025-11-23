import { useState } from 'react';
import { taskService } from '@/services/task-service';
import toast from 'react-hot-toast';
import { ExecutionResult } from '@/types/task';
import { AxiosError } from 'axios';

interface UseExecuteCodeProps {
  taskId: string;
  language: string;
}

export function useExecuteCode({ taskId, language }: UseExecuteCodeProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<ExecutionResult | null>(null);

  const execute = async (code: string) => {
    setIsRunning(true);
    setOutput(null);

    try {
      const data = await taskService.submitSolution(taskId, code, language);

      setOutput(data);

      if (data.success) {
        if (data.allPassed) {
          toast.success('🎉 All tests passed!', { id: 'exec-status' });
        } else {
          const failedCount = data.totalTests - data.passedTests;
          toast.error(`Failed ${failedCount} test(s). Check the console.`, {
            id: 'exec-status',
          });
        }
      } else {
        toast.error('Runtime Error occurred.', { id: 'exec-status' });
      }
    } catch (error: unknown) {
      let errorMsg = 'Execution failed';

      if (error instanceof AxiosError) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }

      setOutput({
        success: false,
        error: 'System Error',
        details: errorMsg,
      });
      toast.error(errorMsg, { id: 'exec-status' });
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => setOutput(null);

  return {
    execute,
    output,
    isRunning,
    clearOutput,
  };
}

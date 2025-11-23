import { useState } from 'react';
import { taskService } from '@/services/task-service';
import toast from 'react-hot-toast';
import { ExecutionResult, FailureContext } from '@/types/task';

interface UseGetAiHintProps {
  taskId: string;
}

export function useGetAiHint({ taskId }: UseGetAiHintProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const askAi = async (code: string, output: ExecutionResult | null) => {
    if (!output) {
      toast.error('Please run your code first so the AI can see the error.');
      return;
    }

    if (output.success && output.allPassed) {
      setHint("Your code is correct! You don't need help anymore. 🎉");
      return;
    }

    setIsAiLoading(true);
    setHint(null);

    let failureContext: FailureContext;

    if (!output.success) {
      failureContext = {
        error: output.error,
      };
    } else {
      const firstFail = output.results.find((r) => !r.passed);

      if (firstFail) {
        failureContext = {
          input: firstFail.input,
          actual: firstFail.actual,
        };
      } else {
        toast.error('Could not identify the specific error.');
        setIsAiLoading(false);
        return;
      }
    }

    try {
      const hintText = await taskService.getAiHint(
        taskId,
        code,
        failureContext
      );
      setHint(hintText);
    } catch (error) {
      console.error(error);
      toast.error('AI Tutor is taking a break. Try again later.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const dismissHint = () => setHint(null);

  return {
    askAi,
    hint,
    isAiLoading,
    dismissHint,
  };
}

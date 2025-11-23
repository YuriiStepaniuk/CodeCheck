import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Bot } from 'lucide-react';

interface IdeHeaderProps {
  title: string;
  difficulty: string;
  points: number;
  onRun: () => void;
  isRunning: boolean;
  onAskAi: () => void;
  isAiLoading: boolean;
  hasOutput: boolean;
}

export function IdeHeader({
  title,
  difficulty,
  points,
  onRun,
  isRunning,
  onAskAi,
  isAiLoading,
  hasOutput,
}: IdeHeaderProps) {
  return (
    <header className="h-14 px-4 bg-white border-b flex justify-between items-center shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        <Badge
          variant="outline"
          className={
            difficulty === 'EASY'
              ? 'text-green-600 border-green-200 bg-green-50'
              : difficulty === 'HARD'
              ? 'text-red-600 border-red-200 bg-red-50'
              : 'text-yellow-600 border-yellow-200 bg-yellow-50'
          }
        >
          {difficulty}
        </Badge>
        <Badge variant="secondary">{points} pts</Badge>
      </div>

      <div className="flex items-center gap-2">
        {/* AI BUTTON */}
        <Button
          variant="secondary"
          onClick={onAskAi}
          disabled={isAiLoading || isRunning || !hasOutput}
          className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
        >
          {isAiLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bot className="w-4 h-4 mr-2" />
          )}
          AI Hint
        </Button>

        {/* RUN BUTTON */}
        <Button onClick={onRun} disabled={isRunning}>
          {isRunning ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2 fill-current" />
          )}
          {isRunning ? 'Running...' : 'Run Code'}
        </Button>
      </div>
    </header>
  );
}

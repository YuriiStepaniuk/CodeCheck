'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import toast from 'react-hot-toast';
import {
  createTaskSchema,
  CreateTaskSchema,
  Language,
  TaskDifficulty,
} from './create-task-schema';
import { teacherService } from '@/services/teacher-service';

export default function CreateTaskPage() {
  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      difficulty: TaskDifficulty.EASY,
      points: 0,
      starterCode: '',
      language: Language.JS,
      testCases: [{ input: '', expectedOutput: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'testCases',
    control: form.control,
  });

  const mutation = useMutation({
    mutationFn: (data: CreateTaskSchema) => teacherService.createTask(data),
    onSuccess: () => {
      toast.success('Task created successfully');
      form.reset();
    },
    onError: (err) => {
      getErrorMessage(err);
    },
  });

  const onSubmit = (data: CreateTaskSchema) => mutation.mutate(data);

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label>Difficulty</label>
        <Controller
          name="difficulty"
          control={form.control}
          defaultValue={TaskDifficulty.MEDIUM}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>

              <SelectContent>
                {Object.values(TaskDifficulty).map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <label>Points</label>
        <Input
          type="number"
          {...form.register('points', { valueAsNumber: true })}
        />
      </div>

      <div>
        <label>Language</label>
        <Controller
          name="language"
          control={form.control}
          defaultValue={Language.JS}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Language).map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <label>Starter Code</label>
        <textarea
          {...form.register('starterCode')}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="space-y-2">
        <h4>Test Cases</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              placeholder="Input"
              {...form.register(`testCases.${index}.input`)}
            />
            <Input
              placeholder="Expected Output"
              {...form.register(`testCases.${index}.expectedOutput`)}
            />
            <Button type="button" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => append({ input: '', expectedOutput: '' })}
        >
          Add Test Case
        </Button>
      </div>

      <Button type="submit" className="mt-4">
        Create Task
      </Button>
    </form>
  );
}

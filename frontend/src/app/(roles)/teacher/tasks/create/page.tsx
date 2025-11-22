'use client';

import {
  useForm,
  useFieldArray,
  Controller,
  DefaultValues,
} from 'react-hook-form';
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
  Hint,
  Language,
  TaskDifficulty,
} from './create-task-schema';
import { teacherService } from '@/services/teacher-service';
import { Textarea } from '@/components/ui/textarea';

export default function CreateTaskPage() {
  const defaultValues: DefaultValues<CreateTaskSchema> = {
    title: '',
    description: '',
    difficulty: TaskDifficulty.MEDIUM,
    points: 0,
    starterCode: '',
    entryFunctionName: 'solution',
    language: Language.JS,
    testCases: [{ input: '[]', expectedOutput: '' }],
    hints: [] as Hint[],
  };

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues,
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({
    name: 'testCases',
    control: form.control,
  });

  const {
    fields: hintFields,
    append: appendHint,
    remove: removeHint,
  } = useFieldArray({
    name: 'hints',
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

  const onSubmit = (data: CreateTaskSchema) => {
    console.log(data);
    return mutation.mutate(data);
  };

  const onError = (errors: any) => {
    console.log('Form Errors:', errors);
  };

  return (
    <form
      className="space-y-6 max-w-2xl mx-auto py-8"
      onSubmit={form.handleSubmit(onSubmit, onError)}
    >
      {/* --- Basic Info --- */}
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            placeholder="e.g. Sum of Two Numbers"
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Description (Markdown supported)
          </label>
          <Textarea
            placeholder="Explain the problem here..."
            className="h-32"
            {...form.register('description')}
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* --- Settings Row --- */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Language</label>
          <Controller
            name="language"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
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
          <label className="text-sm font-medium">Difficulty</label>
          <Controller
            name="difficulty"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Points</label>
          <Input
            type="number"
            {...form.register('points', { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Entry Function Name</label>
          <Input
            placeholder="solution"
            {...form.register('entryFunctionName')}
          />
          <p className="text-xs text-gray-500 mt-1">Default: solution</p>
        </div>
      </div>

      {/* --- Starter Code --- */}
      <div>
        <label className="text-sm font-medium">Starter Code (Optional)</label>
        <Textarea
          className="font-mono text-sm h-32"
          placeholder="// Leave empty to generate default code"
          {...form.register('starterCode')}
        />
      </div>

      {/* --- Test Cases --- */}
      <div className="space-y-2 border p-4 rounded-md bg-slate-50">
        <h4 className="font-semibold">Test Cases</h4>
        <p className="text-xs text-gray-500 mb-2">
          Inputs must be valid JSON. Example for numbers: <code>[1, 2]</code>.
          Example for strings: <code>[&quot;hello&quot;]</code>.
        </p>

        {testCaseFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                placeholder="Input args (e.g. [1, 5])"
                {...form.register(`testCases.${index}.input`)}
              />
              {form.formState.errors.testCases?.[index]?.input && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.testCases[index]?.input?.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Input
                placeholder="Expected (e.g. 6)"
                {...form.register(`testCases.${index}.expectedOutput`)}
              />
              {form.formState.errors.testCases?.[index]?.expectedOutput && (
                <p className="text-red-500 text-xs">
                  {
                    form.formState.errors.testCases[index]?.expectedOutput
                      ?.message
                  }
                </p>
              )}
            </div>
            <Button
              variant="destructive"
              size="icon"
              type="button"
              onClick={() => removeTestCase(index)}
            >
              X
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => appendTestCase({ input: '[]', expectedOutput: '' })}
        >
          + Add Test Case
        </Button>
      </div>

      {/* --- Hints (New Section) --- */}
      <div className="space-y-2 border p-4 rounded-md bg-slate-50">
        <h4 className="font-semibold">Hints</h4>
        {hintFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            <div className="flex-[3]">
              <Input
                placeholder="Hint message..."
                {...form.register(`hints.${index}.message`)}
              />
              {form.formState.errors.hints?.[index]?.message && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.hints[index]?.message?.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Cost"
                {...form.register(`hints.${index}.cost`)}
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              type="button"
              onClick={() => removeHint(index)}
            >
              X
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => appendHint({ message: '', cost: 5 })}
        >
          + Add Hint
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Task'}
      </Button>
    </form>
  );
}

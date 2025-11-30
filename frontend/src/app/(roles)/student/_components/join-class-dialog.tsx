'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import axiosClient from '@/config/axios-config';

const formSchema = z.object({
  inviteCode: z.string().length(6, 'Code must be exactly 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface JoinClassDialogProps {
  onJoinSuccess?: () => void;
}

export function JoinClassDialog({ onJoinSuccess }: JoinClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/groups/join', values);

      toast.success(`Successfully joined ${response.data.groupName}!`);

      setOpen(false);
      reset();
      onJoinSuccess?.();
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Join Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a Class</DialogTitle>
          <DialogDescription>
            Enter the 6-character invite code provided by your teacher.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Input
              placeholder="e.g. A9X2B1"
              className="text-center text-2xl tracking-[0.5em] font-mono uppercase h-14"
              maxLength={6}
              disabled={isLoading}
              {...register('inviteCode')}
            />
            {errors.inviteCode && (
              <p className="text-sm text-red-500 text-center">
                {errors.inviteCode.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Join Class
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

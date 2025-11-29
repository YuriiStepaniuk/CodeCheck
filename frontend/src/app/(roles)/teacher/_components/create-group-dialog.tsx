'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import axiosClient from '@/config/axios-config';
import { API_URL } from '@/lib/constants/api-urls';

// Validation Schema
const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateGroupDialog({
  onGroupCreated,
}: {
  onGroupCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const res = await axiosClient.post(
        API_URL.TEACHER.CREATE_INVITE_LINK,
        data
      );

      const newGroup = await res.data;
      console.log(res.data);
      // 1. Show Success State inside Modal
      setCreatedCode(newGroup.inviteCode);

      // 2. Refresh parent list if needed
      if (onGroupCreated) onGroupCreated();

      toast.success('Share the code with your students.');
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (createdCode) {
      navigator.clipboard.writeText(createdCode);
      toast.success('Invite code copied to clipboard.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCreatedCode(null); // Reset for next time
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Class</DialogTitle>
          <DialogDescription>
            Create a group to organize your students and assign tasks.
          </DialogDescription>
        </DialogHeader>

        {/* CONDITION: If created, show the CODE. If not, show the FORM. */}
        {createdCode ? (
          <div className="space-y-6 py-4 text-center">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Invite Code</h3>
              <div className="flex items-center justify-center gap-4">
                <div className="text-4xl font-mono font-bold tracking-widest text-blue-600">
                  {createdCode}
                </div>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Share this code with your students so they can join.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name</Label>
              <Input
                id="name"
                placeholder="e.g. Algorithms 101"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { PasswordFormValues, passwordSchema } from './password-change-schema';
import axiosClient from '@/config/axios-config';
import { API_URL } from '@/lib/constants/api-urls';

export default function TeacherProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      // 2. Make the request
      await axiosClient.patch(API_URL.TEACHER.CHANGE_PASSWORD, {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success('Your password has been updated successfully.');

      reset();
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Account Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Teacher Identity (Read Only) */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4">
                <Avatar className="w-24 h-24 border-2 border-gray-100 shadow-sm">
                  <AvatarImage src="" />{' '}
                  {/* Add user.avatarUrl if you have it */}
                  <AvatarFallback className="text-2xl bg-slate-900 text-white">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <p className="text-sm text-gray-500 font-medium">{user.email}</p>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="font-semibold capitalize">
                    {user.role.toLowerCase()}
                  </span>
                </div>
                {/* Using data from your Teacher entity */}
                <div className="flex justify-between">
                  <span className="text-gray-500">Joined</span>
                  {/* Assuming user.teacher.joinedAt exists in your store, or create a date form user.createdAt */}
                  <span className="font-semibold">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-4 pt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    As a teacher, you have access to create tasks and view
                    student analytics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Security / Change Password */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-500" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>
                Since your account was created by an admin, please update your
                password to something secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...register('currentPassword')}
                  />
                  {errors.currentPassword && (
                    <p className="text-xs text-red-500">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <Separator className="my-2" />

                {/* New Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Min 6 characters"
                      {...register('newPassword')}
                    />
                    {errors.newPassword && (
                      <p className="text-xs text-red-500">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

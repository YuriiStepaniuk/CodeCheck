'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { ROLE } from '@/types/role';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const RedirectPage = () => {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role === ROLE.ADMIN) {
      router.replace('/admin/dashboard');
    } else if (user.role === ROLE.TEACHER) {
      router.replace('/teacher/dashboard');
    } else if (user.role === ROLE.STUDENT) {
      router.replace('/student/dashboard');
    }
  }, [_hasHydrated, user, router]);

  return <p className="text-center mt-10">Redirecting...</p>;
};

export default RedirectPage;

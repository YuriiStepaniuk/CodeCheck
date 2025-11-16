'use client';

import { ROLE } from '@/types/role';
import { useAuthStore } from '@/lib/stores/auth-store';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/login');
  }

  if (user.role !== ROLE.ADMIN) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}

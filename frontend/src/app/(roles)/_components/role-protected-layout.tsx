'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Role } from '@/types/role';

interface RoleProtectedLayoutProps {
  children: ReactNode;
  allowedRole: Role;
}

export function RoleProtectedLayout({
  children,
  allowedRole,
}: RoleProtectedLayoutProps) {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!user) {
      router.replace('/login');
    } else if (user.role !== allowedRole) {
      router.replace('/redirect');
    }
  }, [_hasHydrated, user, allowedRole, router]);

  if (!_hasHydrated || !user || user.role !== allowedRole) {
    return <p className="text-center mt-12">Checking permissions...</p>;
  }

  return <div className="mt-8 max-w-4xl mx-auto px-4">{children}</div>;
}

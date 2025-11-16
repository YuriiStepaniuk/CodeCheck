import { ReactNode } from 'react';
import { ROLE } from '@/types/role';
import { RoleProtectedLayout } from '../_components/role-protected-layout';

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <RoleProtectedLayout allowedRole={ROLE.TEACHER}>
      {children}
    </RoleProtectedLayout>
  );
}

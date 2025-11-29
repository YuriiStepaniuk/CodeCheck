'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks/user/useLogout';
import { useAuthStore } from '@/lib/stores/auth-store';

const ROLE_NAVIGATION = {
  STUDENT: [
    { label: 'Home', href: '/' },
    { label: 'My Grades', href: '/student/grade' },
    { label: 'Tasks', href: '/student/task' },
  ],
  TEACHER: [
    { label: 'Home', href: '/' },
    { label: 'Create Task', href: '/teacher/tasks/create' },
    { label: 'My Profile', href: '/teacher/profile' },
    { label: 'Gradebook', href: '/teacher/grades' },
  ],
  ADMIN: [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Users', href: '/admin/users' },
  ],
};

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const currentNavItems =
    user && user.role
      ? ROLE_NAVIGATION[user.role as keyof typeof ROLE_NAVIGATION] || []
      : [];

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image src="/globe.svg" alt="Logo" width={32} height={32} />
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              MyApp
            </span>
          </div>

          {/* Navigation - Dynamic Rendering */}
          <nav className="hidden md:flex space-x-4">
            {currentNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 outline-none">
                    <Avatar className="w-10 h-10 border border-gray-200">
                      {/* Optional: Use a specific image based on role or user data */}
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {user.firstName}
                      </span>
                      {/* Optional: Display the role under the name */}
                      <span className="text-xs text-gray-500 capitalize">
                        {user.role?.toLowerCase()}
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
                    {isPending ? 'Logging out...' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="default" onClick={() => router.push('/login')}>
                  Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

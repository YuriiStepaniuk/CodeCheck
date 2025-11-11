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

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

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

          {/* Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              Dashboard
            </Link>
            <Link
              href="/tasks"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              Tasks
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700 dark:text-gray-200">
                      {user.firstName}
                    </span>
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

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import { toast } from 'react-hot-toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        toast.error('Please login to access this page', {
          duration: 4000
        });
        router.push('/auth/login');
        return;
      }

      if (!isAdmin()) {
        toast.error('Unauthorized access. Redirecting to dashboard...', {
          duration: 4000
        });
        router.push('/dashboard');
        return;
      }

      setLoading(false);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-indigo-600">Admin Dashboard</span>
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                Dashboard
              </Link>
              <Link href="/admin/books" className="text-gray-500 hover:text-gray-700">
                Books
              </Link>
              <Link href="/admin/users" className="text-gray-500 hover:text-gray-700">
                Users
              </Link>
              <Link href="/admin/borrowings" className="text-gray-500 hover:text-gray-700">
                Borrowings
              </Link>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

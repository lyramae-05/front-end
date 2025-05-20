'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth'; // Your auth check

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/login'); // Redirect if not admin
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
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

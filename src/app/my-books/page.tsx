'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import api from '@/lib/api';
import { BorrowingRecord } from '@/types/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function MyBooksPage() {
  const router = useRouter();
  const [borrowings, setBorrowings] = useState<BorrowingRecord[]>([]);
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
      fetchBorrowings();
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [router]);

  const fetchBorrowings = async () => {
    const loadingToast = toast.loading('Loading your borrowed books...');
    try {
      const response = await api.get<{ data: BorrowingRecord[] }>('/borrowings');
      setBorrowings(response.data.data || []);
    } catch (error: any) {
      console.error('Failed to fetch borrowed books:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to fetch borrowed books. Please try again later.',
        { duration: 4000 }
      );
      setBorrowings([]);
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleReturn = async (borrowingId: number, bookTitle: string) => {
    const loadingToast = toast.loading(`Returning "${bookTitle}"...`);
    try {
      await api.post(`/return/${borrowingId}`);
      toast.success(`Successfully returned "${bookTitle}"`, {
        duration: 4000
      });
      fetchBorrowings();
    } catch (error: any) {
      console.error('Failed to return book:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to return book. Please try again later.',
        { duration: 4000 }
      );
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Borrowed Books</h1>
          <p className="mt-2 text-gray-600">Manage your borrowed books and returns</p>
        </div>

        {borrowings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">You haven't borrowed any books yet.</p>
            <Link
              href="/books"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Available Books
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowings.map((borrowing) => (
                  <tr key={borrowing.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {borrowing.book?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          by {borrowing.book?.author}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(borrowing.borrowed_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(borrowing.due_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {borrowing.returned_at ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Returned
                        </span>
                      ) : isOverdue(borrowing.due_date) ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Borrowed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-4">
                        <Link
                          href={`/books/${borrowing.book.id}?from=my-books`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </Link>
                        {!borrowing.returned_at && (
                          <button
                            onClick={() => handleReturn(borrowing.id, borrowing.book.title)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Return
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 
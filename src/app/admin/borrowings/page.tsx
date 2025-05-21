'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { BorrowingRecord } from '@/types/api';
import { isAdmin } from '@/lib/auth';

export default function AdminBorrowings() {
  const router = useRouter();
  const [borrowings, setBorrowings] = useState<BorrowingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/dashboard');
      return;
    }
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const response = await api.get('/admin/transactions');
      setBorrowings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching borrowings:', error);
      toast.error('Failed to load borrowings');
      setBorrowings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowingId: number, bookTitle: string) => {
    const loadingToastId = toast.loading(`Processing return for "${bookTitle}"...`);
    try {
      await api.post(`/return/${borrowingId}`);
      await fetchBorrowings();
      toast.success(`Successfully returned "${bookTitle}"`);
    } catch (error) {
      console.error('Error returning book:', error);
      toast.error('Failed to return book');
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Borrowings</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {borrowings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No borrowings found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowings.map((borrowing) => (
                <tr key={borrowing.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{borrowing.book.title}</div>
                      <div className="text-sm text-gray-500">{borrowing.book.author}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(borrowing.borrowed_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(borrowing.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${borrowing.status === 'borrowed' ? 'bg-green-100 text-green-800' : 
                        borrowing.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {borrowing.status.charAt(0).toUpperCase() + borrowing.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {borrowing.status === 'borrowed' && (
                      <button
                        onClick={() => handleReturn(borrowing.id, borrowing.book.title)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 
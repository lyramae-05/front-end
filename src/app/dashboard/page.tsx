'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import api from '@/lib/api';
import { Book } from '@/types/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Fetch recent books
    const fetchRecentBooks = async () => {
      try {
        const response = await api.get<{ data: Book[] }>('/books?limit=3');
        // Ensure we're setting an array, even if empty
        setRecentBooks(response.data.data || []);
      } catch (error: any) {
        console.error('Error fetching books:', error);
        setError('Failed to load recent books');
        toast.error('Failed to load recent books');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold">Welcome to Your Library</h1>
          <p className="mt-4 text-xl">Discover, borrow, and manage your books all in one place.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/books" className="transform hover:scale-105 transition-transform duration-200">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl">
              <div className="text-indigo-600 text-4xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900">Browse Books</h3>
              <p className="mt-2 text-gray-500">Explore our extensive collection of books.</p>
            </div>
          </Link>

          <Link href="/my-books" className="transform hover:scale-105 transition-transform duration-200">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl">
              <div className="text-indigo-600 text-4xl mb-4">📖</div>
              <h3 className="text-lg font-medium text-gray-900">My Books</h3>
              <p className="mt-2 text-gray-500">View and manage your borrowed books.</p>
            </div>
          </Link>

          <Link href="/profile" className="transform hover:scale-105 transition-transform duration-200">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl">
              <div className="text-indigo-600 text-4xl mb-4">👤</div>
              <h3 className="text-lg font-medium text-gray-900">Profile</h3>
              <p className="mt-2 text-gray-500">Manage your account settings.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Books */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Added Books</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading books...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              Try again
            </button>
          </div>
        ) : recentBooks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No books available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recentBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                <p className="mt-2 text-gray-500">{book.author}</p>
                <p className="mt-2 text-sm text-gray-400">{book.genre}</p>
                <div className="mt-4">
                  <Link
                    href={`/books/${book.id}`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600">1000+</div>
              <div className="mt-2 text-gray-500">Books Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600">24/7</div>
              <div className="mt-2 text-gray-500">Digital Access</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600">Free</div>
              <div className="mt-2 text-gray-500">Library Membership</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
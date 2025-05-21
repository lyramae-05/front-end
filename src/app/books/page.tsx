'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import api from '@/lib/api';
import { Book, ApiResponse } from '@/types/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Please login to access this page');
      router.push('/login');
      return;
    }
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get<ApiResponse<Book[]>>('/books');
      const books = response.data.data || [];
      setBooks(books);
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId: number) => {
    try {
      await api.post('/borrow', { book_id: bookId });
      toast.success('Book borrowed successfully');
      fetchBooks(); // Refresh the book list
    } catch (error: any) {
      console.error('Borrow error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        toast.error('You have reached your maximum borrowing limit (2 books). Please return some books before borrowing more.');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || 'Unable to borrow this book at the moment.');
      } else if (error.response?.status === 404) {
        toast.error('Book not found or no longer available.');
      } else {
        toast.error('Failed to borrow book. Please try again later.');
      }
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Browse Books</h1>
          <p className="mt-2 text-gray-600">Discover and borrow from our collection</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No books found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{book.title}</h3>
                  <p className="mt-2 text-gray-600">{book.author}</p>
                  <p className="mt-2 text-sm text-gray-500">ISBN: {book.isbn}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className={`text-sm ${
                      book.available_copies > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {book.available_copies} of {book.total_copies} available
                    </span>
                    <div className="flex space-x-2">
                      <Link
                        href={`/books/${book.id}?from=browse`}
                        className="px-4 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleBorrow(book.id)}
                        disabled={!book.available_copies}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          book.available_copies
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {book.available_copies ? 'Borrow' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
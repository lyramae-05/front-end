'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import api from '@/lib/api';
import { Book } from '@/types/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState<string[]>([]);

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
      const response = await api.get<{ data: Book[] }>('/books');
      const books = response.data.data || [];
      setBooks(books);
      
      // Extract unique genres
      const uniqueGenres = Array.from(new Set(books.map(book => book.genre)));
      setGenres(uniqueGenres);
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
      const errorMessage = error.response?.data?.message || 'Failed to borrow book';
      toast.error(errorMessage);
      
      // If the user has reached their limit, we might want to show a different message
      if (error.response?.status === 403) {
        toast.error('You have reached your borrowing limit (3 books)');
      }
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

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

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
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
                  <p className="mt-1 text-sm text-gray-500">{book.genre}</p>
                  {book.description && (
                    <p className="mt-4 text-gray-600 line-clamp-3">{book.description}</p>
                  )}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
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
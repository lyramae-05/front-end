'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Book } from '@/types/api';

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    quantity: 1
  });

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      const booksData = response.data.data || response.data || [];
      setBooks(Array.isArray(booksData) ? booksData : []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books. Please try again later.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToastId = toast.loading('Adding new book...');
    try {
      const response = await api.post('/books', newBook);
      const newBookData = response.data.data || response.data;
      if (newBookData) {
        setBooks(prevBooks => [...prevBooks, newBookData]);
        setNewBook({ title: '', author: '', isbn: '', quantity: 1 });
        toast.success(`Successfully added "${newBook.title}" to the library!`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error adding book:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to add book. Please check the details and try again.'
      );
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  const handleDeleteBook = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    const loadingToastId = toast.loading('Deleting book...');
    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
      toast.success(`Successfully deleted "${title}"`);
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book. Please try again later.');
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
      <h1 className="text-3xl font-bold mb-8">Manage Books</h1>

      {/* Add New Book Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
        <form onSubmit={handleAddBook} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                required
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ISBN</label>
              <input
                type="text"
                required
                value={newBook.isbn}
                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                required
                min="1"
                value={newBook.quantity}
                onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>

      {/* Books List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {books.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No books available. Add your first book using the form above.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{book.isbn}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{book.available_copies}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{book.total_copies}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteBook(book.id, book.title)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
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
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast, { Toast } from 'react-hot-toast';
import { Book, ApiError, ApiResponse } from '@/types/api';

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  total_copies: number;
}

export default function CreateBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    total_copies: 1
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof BookFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (!/^[\d-]{10,17}$/.test(formData.isbn.trim())) {
      newErrors.isbn = 'Invalid ISBN format';
    }
    
    if (formData.total_copies < 1) {
      newErrors.total_copies = 'Must have at least one copy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        available_copies: formData.total_copies
      };
      const response = await api.post<ApiResponse<Book>>('/books', submitData);
      toast.success('Book added successfully');
      router.push('/admin/books');
    } catch (error) {
      if (error instanceof Error) {
        const apiError = error as ApiError;
        if (apiError.errors) {
          const formattedErrors: Partial<Record<keyof BookFormData, string>> = {};
          Object.entries(apiError.errors).forEach(([key, messages]) => {
            if (key in formData && Array.isArray(messages)) {
              formattedErrors[key as keyof BookFormData] = messages[0];
            }
          });
          setErrors(formattedErrors);
          toast.error('Please fix the form errors');
        } else {
          toast.error(apiError.message || 'Failed to add book');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numValue = parseInt(rawValue, 10);
    
    if (rawValue === '') {
      setFormData(prev => ({ ...prev, total_copies: 1 }));
    } else if (!isNaN(numValue)) {
      setFormData(prev => ({ ...prev, total_copies: Math.max(1, numValue) }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Add New Book</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                      Author *
                    </label>
                    <input
                      type="text"
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.author ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.author && (
                      <p className="mt-1 text-sm text-red-600">{errors.author}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                      ISBN *
                    </label>
                    <input
                      type="text"
                      id="isbn"
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.isbn ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.isbn && (
                      <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="total_copies" className="block text-sm font-medium text-gray-700">
                      Total Copies *
                    </label>
                    <input
                      type="number"
                      id="total_copies"
                      min="1"
                      value={formData.total_copies}
                      onChange={handleCopiesChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.total_copies ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.total_copies && (
                      <p className="mt-1 text-sm text-red-600">{errors.total_copies}</p>
                    )}
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <Link
                        href="/admin/books"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Adding...' : 'Add Book'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
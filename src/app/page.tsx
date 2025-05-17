'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Welcome to Our Library
        </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-indigo-100 sm:text-xl md:mt-5 md:max-w-3xl">
            Discover thousands of books, manage your borrowings, and join our growing community of readers.
        </p>
          <div className="mt-10 flex flex-col items-center space-y-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 md:py-4 md:text-lg md:px-10"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Library Features
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Everything you need to manage your reading journey
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  📚
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Extensive Collection</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Access thousands of books across various genres and categories
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  🔄
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Easy Borrowing</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Borrow books with just a few clicks and manage your loans online
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  👤
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Personal Dashboard</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Track your reading history and manage your account
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to start reading?</span>
            <span className="block text-indigo-600">Join our library today.</span>
          </h2>
          <div className="mt-8 flex flex-col space-y-4 lg:mt-0 lg:flex-shrink-0">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

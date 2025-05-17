'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            About Our Library System
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A modern digital library management system designed to make book borrowing and management effortless.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl text-indigo-600 mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900">Extensive Collection</h3>
              <p className="mt-2 text-gray-500">
                Access thousands of books across various genres, from classic literature to modern publications.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl text-indigo-600 mb-4">🔄</div>
              <h3 className="text-lg font-medium text-gray-900">Easy Borrowing</h3>
              <p className="mt-2 text-gray-500">
                Simple and efficient borrowing process with automatic return reminders and history tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl text-indigo-600 mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
              <p className="mt-2 text-gray-500">
                Personalized user accounts with borrowing history and preferences management.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We strive to make knowledge accessible to everyone by providing a modern, efficient, and user-friendly library management system. 
            Our platform helps libraries streamline their operations while offering readers an enhanced borrowing experience.
          </p>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-indigo-600">1.</div>
              <p className="ml-3 text-gray-600">Create your account or sign in to access the library system.</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-indigo-600">2.</div>
              <p className="ml-3 text-gray-600">Browse our extensive collection of books.</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-indigo-600">3.</div>
              <p className="ml-3 text-gray-600">Borrow books with just a few clicks.</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-indigo-600">4.</div>
              <p className="ml-3 text-gray-600">Manage your borrowings and returns through your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
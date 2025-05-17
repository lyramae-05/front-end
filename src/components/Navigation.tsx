'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, isAdmin, logout, getUser } from '@/lib/auth';
import { User } from '@/types/api';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedInNow = isAuthenticated();
      setIsLoggedIn(isLoggedInNow);
      setIsAdminUser(isAdmin());
      setUser(getUser());
      
      // Allow access to public pages and auth pages when logged out
      const publicPaths = ['/', '/about', '/auth/login', '/auth/register'];
      if (!isLoggedInNow && !publicPaths.some(path => pathname?.startsWith(path))) {
        router.push('/');
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsAdminUser(false);
    setUser(null);
    setIsOpen(false);
    router.push('/');
  };

  const isActivePath = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname?.startsWith(path);
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-indigo-100 text-indigo-900";
    const inactiveClasses = "text-gray-500 hover:text-gray-700 hover:bg-gray-50";
    return `${baseClasses} ${isActivePath(path) ? activeClasses : inactiveClasses}`;
  };

  // Allow rendering on public pages and auth pages when logged out
  const publicPaths = ['/', '/about', '/auth/login', '/auth/register'];
  if (!isLoggedIn && !publicPaths.some(path => pathname?.startsWith(path))) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              {isLoggedIn ? (
                <span className="text-xl font-bold text-indigo-600">
                  Library System
                </span>
              ) : (
                <Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
                  Library System
                </Link>
              )}
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {isLoggedIn ? (
                <>
                  {/* Logged-in user navigation */}
                  <Link
                    href="/dashboard"
                    className={getLinkClassName('/dashboard')}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/books"
                    className={getLinkClassName('/books')}
                  >
                    Browse Books
                  </Link>
                  <Link
                    href="/my-books"
                    className={getLinkClassName('/my-books')}
                  >
                    My Books
                  </Link>
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      className={getLinkClassName('/admin')}
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {/* Public navigation */}
                  <Link
                    href="/"
                    className={getLinkClassName('/')}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className={getLinkClassName('/about')}
                  >
                    About
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  <span className="text-sm font-medium">{user?.name}</span>
                  <svg
                    className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block ${getLinkClassName('/dashboard')}`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/books"
                  className={`block ${getLinkClassName('/books')}`}
                  onClick={() => setIsOpen(false)}
                >
                  Browse Books
                </Link>
                <Link
                  href="/my-books"
                  className={`block ${getLinkClassName('/my-books')}`}
                  onClick={() => setIsOpen(false)}
                >
                  My Books
                </Link>
                {isAdminUser && (
                  <Link
                    href="/admin"
                    className={`block ${getLinkClassName('/admin')}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`block ${getLinkClassName('/')}`}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={`block ${getLinkClassName('/about')}`}
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 
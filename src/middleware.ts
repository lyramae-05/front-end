import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add routes that require authentication
const protectedRoutes = [
  '/books',
  '/my-books',
  '/profile',
  '/dashboard',
];

// Add routes that require admin access
const adminRoutes = [
  '/admin',
  '/admin/books',
  '/admin/users',
  '/admin/borrowings',
];

// Add routes that should redirect to dashboard if already logged in
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/login',
  '/register',
];

// Add public routes that don't need any checks
const publicRoutes = [
  '/',
  '/api',
  '/_next',
  '/favicon.ico',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userStr = request.cookies.get('user')?.value;
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';
  const path = request.nextUrl.pathname;

  // Allow public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (token && authRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check protected routes
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.set({
        name: 'redirect',
        value: path,
        path: '/',
      });
      return response;
    }
  }

  // Check admin routes
  if (adminRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.set({
        name: 'redirect',
        value: path,
        path: '/',
      });
      return response;
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    '/((?!_next/static|_next/image).*)',
  ],
}; 
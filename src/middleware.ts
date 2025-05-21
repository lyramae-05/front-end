import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG } from './config';

// Add routes that require authentication
const protectedRoutes = [
  '/books',
  '/my-books',
  '/profile',
  '/dashboard',
  '/borrowed-books',
];

// Add routes that require admin access
const adminRoutes = [
  '/admin',
  '/admin/books',
  '/admin/users',
  '/admin/borrowings',
  '/admin/reports',
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
  '/about',
  '/api',
  '/_next',
  '/favicon.ico',
  '/assets',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_CONFIG.TOKEN_KEY)?.value;
  const userStr = request.cookies.get(AUTH_CONFIG.USER_KEY)?.value;
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';
  const path = request.nextUrl.pathname;

  // Helper function to create redirect response
  const createRedirectResponse = (url: string, redirectPath?: string) => {
    const response = NextResponse.redirect(new URL(url, request.url));
    if (redirectPath) {
      const cookieOptions = {
        name: 'redirect',
        value: redirectPath,
        ...AUTH_CONFIG.COOKIE_OPTIONS,
      };
      response.cookies.set(cookieOptions);
    }
    return response;
  };

  try {
    // Allow public routes and static assets
    if (publicRoutes.some(route => path.startsWith(route))) {
      return NextResponse.next();
    }

    // Handle auth routes (login/register)
    if (authRoutes.some(route => path.startsWith(route))) {
      // If user is already logged in, redirect to dashboard
      if (token && user) {
        return createRedirectResponse('/dashboard');
      }
      return NextResponse.next();
    }

    // Check protected routes
    if (protectedRoutes.some(route => path.startsWith(route))) {
      if (!token || !user) {
        return createRedirectResponse('/auth/login', path);
      }
    }

    // Check admin routes
    if (adminRoutes.some(route => path.startsWith(route))) {
      if (!token || !user) {
        return createRedirectResponse('/auth/login', path);
      }
      if (!isAdmin) {
        return createRedirectResponse('/dashboard');
      }
    }

    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login for protected routes
    if (!publicRoutes.some(route => path.startsWith(route))) {
      return createRedirectResponse('/auth/login');
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 
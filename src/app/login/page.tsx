'use client';

import dynamic from 'next/dynamic';

// Import LoginForm with no SSR to prevent hydration issues
const LoginForm = dynamic(() => import('@/components/LoginForm'), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
} 
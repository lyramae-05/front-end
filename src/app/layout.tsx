// app/layout.tsx
'use client';

import './globals.css'; // Your global styles
import { Navbar } from '@/components/layout/Navbar';
import BackendWakeup from '@/components/BackendWakeup';
import { NotificationProvider } from '@/components/Notification';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-white">
        <NotificationProvider>
          <BackendWakeup />
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </NotificationProvider>
      </body>
    </html>
  );
}

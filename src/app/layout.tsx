// app/layout.tsx
import './globals.css'; // Your global styles
import { Navbar } from '@/components/layout/Navbar';
import { Toaster } from 'react-hot-toast';
import BackendWakeup from '@/components/BackendWakeup';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-white">
        <Toaster position="top-right" />
        <BackendWakeup />
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HNP Tech Flow - Workflow & HR Platform',
  description: 'Hệ thống quản lý quy trình và nhân sự thông minh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 md:ml-72 transition-all duration-300">
              <Header />
              <main className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
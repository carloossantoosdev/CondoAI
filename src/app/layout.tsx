import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast-container';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Finanças Pro - Sua plataforma para simular investimentos',
  description: 'Plataforma completa para simular investimentos e ganhar dinheiro com investimentos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


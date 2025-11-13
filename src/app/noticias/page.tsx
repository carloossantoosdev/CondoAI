'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import MarketNews from '@/components/MarketNews';
import { Loading } from '@/components/ui/loading';
import { Newspaper } from 'lucide-react';

export default function NoticiasPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loading size="lg" fullscreen />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-brand-orange" />
            Notícias do Mercado
          </h1>
          <p className="text-slate-600">
            Fique por dentro das principais notícias e acontecimentos do mercado financeiro
          </p>
        </div>

        {/* Componente de Notícias */}
        <MarketNews />
      </div>
    </MainLayout>
  );
}


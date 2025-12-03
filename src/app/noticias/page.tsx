'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import MarketNews from '@/components/MarketNews';
import { Loading } from '@/components/ui/loading';
import { PageHeader } from '@/components/ui/page-header';

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
        <PageHeader 
          title="Notícias do Mercado"
          description="Fique por dentro das principais notícias e acontecimentos do mercado financeiro"
          icon="📰"
        />

        {/* Componente de Notícias */}
        <MarketNews />
      </div>
    </MainLayout>
  );
}


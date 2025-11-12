'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona direto para o dashboard (sem autenticação)
    router.push('/dashboard');
    
    /* VERSÃO ORIGINAL COM AUTENTICAÇÃO (COMENTADA)
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
    */
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loading size="lg" />
    </div>
  );
}

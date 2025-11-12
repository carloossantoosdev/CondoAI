'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/ui/loading';

export default function LoginPage() {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-orange-600 to-rose-700">
        <Loading size="lg" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-orange-600 to-rose-700">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-orange-600 to-rose-700 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="flex justify-center mb-2">
            <div className="text-6xl">💰</div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Finanças Pro
          </CardTitle>
          <CardDescription className="text-base">
            Sua plataforma completa de investimentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <p className="text-sm text-slate-600 text-center leading-relaxed">
            Gerencie seus investimentos, aprenda sobre o mercado financeiro e tome decisões
            inteligentes com nossa plataforma.
          </p>
          <Button
            onClick={handleGoogleSignIn}
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          >
            <Chrome className="w-5 h-5" />
            Entrar com Google
          </Button>
          <p className="text-xs text-center text-slate-500">
            🔒 Seus dados estão seguros e protegidos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ========================================
   VERSÃO ORIGINAL COM FIREBASE (COMENTADA)
   ========================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/ui/loading';

export default function LoginPage() {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="flex justify-center mb-2">
            <div className="text-6xl">💰</div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Finanças Pro
          </CardTitle>
          <CardDescription className="text-base">
            Sua plataforma completa de investimentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <p className="text-sm text-slate-600 text-center leading-relaxed">
            Gerencie seus investimentos, aprenda sobre o mercado financeiro e tome decisões
            inteligentes com nossa plataforma.
          </p>
          <Button
            onClick={handleGoogleSignIn}
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-blue-700 hover:to-violet-700"
          >
            <Chrome className="w-5 h-5" />
            Entrar com Google
          </Button>
          <p className="text-xs text-center text-slate-500">
            🔒 Seus dados estão seguros e protegidos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
========================================
*/

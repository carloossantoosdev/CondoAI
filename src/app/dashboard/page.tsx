'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@/lib/supabase/client';
import { Investment, PortfolioSummary } from '@/types';
import { getAssetQuote } from '@/services/api/investmentService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Target,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

// Criar instância única do cliente Supabase
const supabaseClient = createClient();

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary>({
    valorTotal: 0,
    totalInvestido: 0,
    lucroOuPrejuizo: 0,
    percentualRetorno: 0,
    numeroInvestimentos: 0,
  });
  const [loadingData, setLoadingData] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadInvestments();
    }
  }, [user]);

  const loadInvestments = async () => {
    if (!user) return;

    try {
      setLoadingData(true);
      
      const { data: investmentsData, error } = await supabaseClient
        .from('investments')
        .select('*')
        .eq('user_id', user.uid);

      if (error) {
        console.error('Erro ao buscar investimentos:', error);
        return;
      }

      const investmentsList: Investment[] = [];
      let totalInvestido = 0;
      let valorTotal = 0;

      for (const data of investmentsData || []) {
        const investment: Investment = {
          id: data.id,
          userId: data.user_id,
          type: data.type,
          ticker: data.ticker,
          nome: data.nome,
          quantidade: data.quantidade,
          precoMedio: data.preco_medio,
          dataCompra: new Date(data.data_compra),
          valorTotal: data.valor_total,
        };

        investmentsList.push(investment);
        totalInvestido += investment.valorTotal;

        const quote = await getAssetQuote(investment.ticker, investment.type);
        if (quote) {
          valorTotal += quote.preco * investment.quantidade;
        } else {
          valorTotal += investment.valorTotal;
        }
      }

      const lucroOuPrejuizo = valorTotal - totalInvestido;
      const percentualRetorno = totalInvestido > 0 ? (lucroOuPrejuizo / totalInvestido) * 100 : 0;

      setSummary({
        valorTotal,
        totalInvestido,
        lucroOuPrejuizo,
        percentualRetorno,
        numeroInvestimentos: investmentsList.length,
      });

      setInvestments(investmentsList);
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getDistributionData = () => {
    const distribution: Record<string, number> = {
      acao: 0,
      fundo: 0,
      rendaFixa: 0,
      cripto: 0,
    };

    investments.forEach((inv) => {
      distribution[inv.type] += inv.valorTotal;
    });

    return Object.entries(distribution)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        name: key === 'acao' ? 'Ações' : key === 'fundo' ? 'Fundos' : key === 'rendaFixa' ? 'Renda Fixa' : 'Cripto',
        value,
      }));
  };

  if (loading || !user) {
    return <Loading size="lg" />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bem-vindo, {user.displayName}! 👋
          </h1>
          <p className="text-slate-600">
            Aqui está um resumo dos seus investimentos
          </p>
        </div>

        {loadingData ? (
          <Loading size="lg" />
        ) : (
          <>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Valor Total */}
              <Card className="bg-gradient-to-br from-orange-500 to-amber-500 text-white border-0 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Valor Total</p>
                      <p className="text-3xl font-bold">{formatCurrency(summary.valorTotal)}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Wallet className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Investido */}
              <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-0 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Total Investido</p>
                      <p className="text-3xl font-bold">{formatCurrency(summary.totalInvestido)}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <PiggyBank className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lucro/Prejuízo */}
              <Card 
                className={cn(
                  "text-white border-0 hover:shadow-lg transition-shadow",
                  summary.lucroOuPrejuizo >= 0
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                    : "bg-gradient-to-br from-orange-400 to-orange-600"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Lucro/Prejuízo</p>
                      <p className="text-3xl font-bold">{formatCurrency(summary.lucroOuPrejuizo)}</p>
                      <p className="text-sm mt-1 font-semibold">
                        {summary.percentualRetorno >= 0 ? '+' : ''}{summary.percentualRetorno.toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      {summary.lucroOuPrejuizo >= 0 ? (
                        <TrendingUp className="w-6 h-6" />
                      ) : (
                        <TrendingDown className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Número de Investimentos */}
              <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Investimentos</p>
                      <p className="text-3xl font-bold">{summary.numeroInvestimentos}</p>
                      <p className="text-sm mt-1">
                        {summary.numeroInvestimentos === 1 ? 'ativo' : 'ativos'}
                      </p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Briefcase className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos e Lista */}
            {investments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribuição do Portfólio */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Distribuição do Portfólio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getDistributionData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.name}: ${((entry.value / summary.totalInvestido) * 100).toFixed(1)}%`}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Investimentos Recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Investimentos Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {investments.slice(0, 5).map((inv) => (
                        <div
                          key={inv.id}
                          className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-slate-900">{inv.ticker}</p>
                            <p className="text-sm text-slate-600">{inv.nome}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">
                              {formatCurrency(inv.valorTotal)}
                            </p>
                            <p className="text-sm text-slate-600">
                              {inv.quantidade} {inv.quantidade === 1 ? 'unidade' : 'unidades'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <Target className="w-10 h-10 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Você ainda não tem investimentos
                  </h3>
                  <p className="text-slate-600 text-center max-w-md">
                    Comece sua jornada de investimentos explorando nossos ativos disponíveis
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

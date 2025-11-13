'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { DividendsSummary } from '@/components/DividendsSummary';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loading } from '@/components/ui/loading';
import { Info, AlertCircle } from 'lucide-react';

// Criar instância única do cliente Supabase
const supabaseClient = createClient();

interface PortfolioDividend {
  ticker: string;
  quantidade: number;
  dividends: any[];
  yield: number;
  dataCompra: Date;
  precoAtual: number;
  valorInvestido: number;
}

interface ProjecaoDividendo {
  ticker: string;
  dataEstimada: Date;
  valorPorCota: number;
  quantidade: number;
  totalEstimado: number;
}

export default function DividendosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [portfolioDividends, setPortfolioDividends] = useState<PortfolioDividend[]>([]);
  const [loadingDividends, setLoadingDividends] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || hasLoadedRef.current) return;

    hasLoadedRef.current = true;

    async function loadPortfolioDividends() {
      try {
        setLoadingDividends(true);
        setError(null);

        if (!user) return;

        const { data: investments, error: investmentsError } = await supabaseClient
          .from('investments')
          .select('*')
          .eq('user_id', user.uid);

        if (investmentsError) {
          console.error('Erro ao buscar investimentos:', investmentsError);
          setError(investmentsError.message);
          setLoadingDividends(false);
          return;
        }

        if (investments.length === 0) {
          setPortfolioDividends([]);
          setLoadingDividends(false);
          return;
        }

        const dividendsPromises = investments.map(async (inv: any) => {
          try {
            const response = await fetch(`/api/dividends/${inv.ticker}`);
            const data = await response.json();

            const dataCompra = new Date(inv.data_compra);

            const dividendsFiltrados = (data.dividends || []).filter((div: any) => {
              const dataPagamento = new Date(div.date);
              return dataPagamento >= dataCompra;
            });

            const precoAtual = data.summary?.currentPrice || inv.preco_medio || 0;
            const valorInvestido = (inv.quantidade || 0) * (inv.preco_medio || 0);

            return {
              ticker: inv.ticker,
              quantidade: inv.quantidade || 0,
              dividends: dividendsFiltrados,
              yield: data.summary?.dividendYield || 0,
              dataCompra: dataCompra,
              precoAtual: precoAtual,
              valorInvestido: valorInvestido
            };
          } catch (err) {
            console.error(`Erro ao buscar dividendos de ${inv.ticker}:`, err);
            const dataCompra = new Date(inv.data_compra);
            const valorInvestido = (inv.quantidade || 0) * (inv.preco_medio || 0);
            
            return {
              ticker: inv.ticker,
              quantidade: inv.quantidade || 0,
              dividends: [],
              yield: 0,
              dataCompra: dataCompra,
              precoAtual: inv.preco_medio || 0,
              valorInvestido: valorInvestido
            };
          }
        });

        const allDividends = await Promise.all(dividendsPromises);
        setPortfolioDividends(allDividends);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dividendos');
        console.error('Erro:', err);
      } finally {
        setLoadingDividends(false);
      }
    }

    loadPortfolioDividends();
    
    // Cleanup: resetar para permitir reload quando voltar à página
    return () => {
      hasLoadedRef.current = false;
    };
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  };

  const calcularProjecoes = (): ProjecaoDividendo[] => {
    const projecoes: ProjecaoDividendo[] = [];
    const hoje = new Date();

    portfolioDividends.forEach(asset => {
      if (asset.yield > 0 && asset.quantidade > 0) {
        const dividendoAnualPorCota = (asset.precoAtual * asset.yield) / 100;
        const valorPorPagamento = dividendoAnualPorCota / 4;
        
        for (let i = 1; i <= 4; i++) {
          const dataEstimada = new Date(hoje);
          dataEstimada.setMonth(hoje.getMonth() + (i * 3));
          
          projecoes.push({
            ticker: asset.ticker,
            dataEstimada: dataEstimada,
            valorPorCota: valorPorPagamento,
            quantidade: asset.quantidade,
            totalEstimado: valorPorPagamento * asset.quantidade
          });
        }
      }
    });

    return projecoes.sort((a, b) => a.dataEstimada.getTime() - b.dataEstimada.getTime());
  };

  const calculateReceived = () => {
    return portfolioDividends.flatMap(asset =>
      asset.dividends.map((div: any) => ({
        ...div,
        date: new Date(div.date),
        ticker: asset.ticker,
        received: div.value * asset.quantidade
      }))
    ).sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const received = calculateReceived();
  const projecoes = calcularProjecoes();
  
  const totalReceived = received.reduce((sum, div) => sum + div.received, 0);
  const totalProjetado = projecoes.reduce((sum, proj) => sum + proj.totalEstimado, 0);
  const totalInvestido = portfolioDividends.reduce((sum, asset) => sum + asset.valorInvestido, 0);
  
  const totalYield = portfolioDividends.length > 0
    ? portfolioDividends.reduce((sum, asset) => sum + asset.yield, 0) / portfolioDividends.length
    : 0;
  
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const last12MonthsPayments = received.filter(d => d.date >= twelveMonthsAgo);

  if (loading || !user) {
    return <Loading size="lg" />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Dividendos da Carteira 💰
          </h1>
          <p className="text-slate-600">
            Acompanhe os proventos recebidos dos seus investimentos
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loadingDividends ? (
          <Loading size="lg" />
        ) : portfolioDividends.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Você ainda não possui investimentos na carteira. Adicione investimentos para acompanhar os dividendos.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Cards de Resumo */}
            <DividendsSummary
              totalReceived={totalReceived}
              averageYield={totalYield}
              totalPayments={last12MonthsPayments.length}
              totalProjetado={totalProjetado}
              totalInvestido={totalInvestido}
            />

            {/* Tabela de Projeções */}
            {projecoes.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>Próximos Pagamentos Estimados 📅</CardTitle>
                    <Badge variant="secondary">Projeções</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Como calculamos:</strong> As projeções são baseadas no Dividend Yield histórico de cada ativo. 
                      Valores e datas são estimativas e podem variar conforme as decisões das empresas.
                    </AlertDescription>
                  </Alert>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data Estimada</TableHead>
                        <TableHead>Ativo</TableHead>
                        <TableHead className="text-right">Valor/Cota</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Total Estimado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projecoes.slice(0, 8).map((proj, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(proj.dataEstimada)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{proj.ticker}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(proj.valorPorCota)}</TableCell>
                          <TableCell className="text-right">{proj.quantidade}</TableCell>
                          <TableCell className="text-right">
                            <span className="font-bold text-brand-orange">
                              {formatCurrency(proj.totalEstimado)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <p className="text-xs text-slate-500">
                    💡 Dica: Esses valores são estimativas baseadas em histórico. 
                    Os dividendos reais podem ser maiores ou menores.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tabela de Histórico */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Proventos Recebidos 💰</CardTitle>
              </CardHeader>
              <CardContent>
                {received.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="space-y-2">
                      <p className="font-semibold">Nenhum dividendo recebido ainda</p>
                      <p>
                        Os dividendos aparecem aqui apenas após a data de pagamento e quando você já possuía o ativo na data COM.
                        Acompanhe as projeções acima para saber quando receberá! 📊
                      </p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Ativo</TableHead>
                        <TableHead className="text-right">Valor Unitário</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Total Recebido</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {received.slice(0, 100).map((div, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(div.date)}</TableCell>
                          <TableCell>
                            <Badge>{div.ticker}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(div.value)}</TableCell>
                          <TableCell className="text-right">
                            {portfolioDividends.find(a => a.ticker === div.ticker)?.quantidade || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-bold text-green-600">
                              {formatCurrency(div.received)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loading } from '@/components/ui/loading';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Info, History, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DividendData {
  date: string;
  value: number;
  type?: string;
}

interface AssetWithDividends {
  ticker: string;
  quantidade: number;
  dataCompra: Date;
  valorInvestido: number;
  dividends: DividendData[];
  totalRecebido: number;
  dividendYield: number;
}

interface DividendHistoryItem {
  ticker: string;
  date: string;
  valorPorCota: number;
  quantidade: number;
  totalRecebido: number;
  dataCompra?: Date;
}

// Criar instância única do cliente Supabase
const supabaseClient = createClient();

export default function DividendosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assets, setAssets] = useState<AssetWithDividends[]>([]);
  const [loadingDividends, setLoadingDividends] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadDividends();
    }
  }, [user, loading, router]);

  const loadDividends = async () => {
    if (!user) return;

    try {
      setLoadingDividends(true);
      setError(null);

      // Buscar investimentos do usuário (apenas ações pagam dividendos)
      const { data: investmentsData, error: investError } = await supabaseClient
        .from('investments')
        .select('*')
        .eq('user_id', user.uid)
        .eq('type', 'acao');

      if (investError) {
        console.error('Erro ao buscar investimentos:', investError);
        setError('Erro ao carregar investimentos');
        return;
      }

      if (!investmentsData || investmentsData.length === 0) {
        setAssets([]);
        return;
      }

      // Buscar dividendos para cada ação
      const assetsWithDividends = await Promise.all(
        investmentsData.map(async (inv) => {
          try {
            const response = await fetch(`/api/dividends/${inv.ticker}`);
            const data = await response.json();

            const dataCompra = new Date(inv.data_compra);
            const umAnoAtras = new Date();
            umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);

            // Filtrar apenas dividendos em dinheiro dos últimos 12 meses
            const dividendsLast12Months = (data.dividends || [])
              .filter((d: DividendData) => d.type === 'cash')
              .filter((d: DividendData) => {
                const divDate = new Date(d.date);
                return divDate >= umAnoAtras && divDate <= new Date();
              });

            // Calcular total recebido (apenas após a compra)
            const totalRecebido = dividendsLast12Months
              .filter((d: DividendData) => new Date(d.date) >= dataCompra)
              .reduce((sum: number, d: DividendData) => sum + (d.value * inv.quantidade), 0);

            return {
              ticker: inv.ticker,
              quantidade: inv.quantidade,
              dataCompra: dataCompra,
              valorInvestido: inv.valor_total,
              dividends: dividendsLast12Months,
              totalRecebido: totalRecebido,
              dividendYield: data.summary?.dividendYield || 0,
            };
          } catch (err) {
            console.error(`Erro ao buscar dividendos de ${inv.ticker}:`, err);
            return {
              ticker: inv.ticker,
              quantidade: inv.quantidade,
              dataCompra: new Date(inv.data_compra),
              valorInvestido: inv.valor_total,
              dividends: [],
              totalRecebido: 0,
              dividendYield: 0,
            };
          }
        })
      );

      setAssets(assetsWithDividends);
    } catch (err) {
      console.error('Erro ao carregar dividendos:', err);
      setError('Erro ao carregar dados de dividendos');
    } finally {
      setLoadingDividends(false);
    }
  };

  // Construir histórico completo de dividendos
  const buildDividendHistory = (): (DividendHistoryItem & { dataCompra: Date })[] => {
    const history: (DividendHistoryItem & { dataCompra: Date })[] = [];

    assets.forEach((asset) => {
      asset.dividends.forEach((div) => {
        history.push({
          ticker: asset.ticker,
          date: div.date,
          valorPorCota: div.value,
          quantidade: asset.quantidade,
          totalRecebido: div.value * asset.quantidade,
          dataCompra: asset.dataCompra,
        });
      });
    });

    // Ordenar do mais recente para o mais antigo
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const history = buildDividendHistory();

  // Cálculos de resumo
  const totalRecebido = assets.reduce((sum, asset) => sum + asset.totalRecebido, 0);
  const totalDividendos = history.length;
  const averageYield = assets.length > 0
    ? assets.reduce((sum, asset) => sum + asset.dividendYield, 0) / assets.length
    : 0;

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

  if (loading || loadingDividends) {
    return <Loading size="lg" fullscreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            💰 Histórico de Dividendos
          </h1>
          <p className="text-slate-600">
            Acompanhe os proventos dos últimos 12 meses das ações que você possui
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Carteira Vazia */}
        {assets.length === 0 && !loadingDividends && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Você ainda não possui ações na carteira. Compre ações na página de{' '}
              <span
                className="font-semibold text-orange-600 cursor-pointer hover:underline"
                onClick={() => router.push('/investimentos')}
              >
                Investimentos
              </span>{' '}
              para acompanhar os dividendos pagos.
            </AlertDescription>
          </Alert>
        )}

        {/* Conteúdo Principal */}
        {assets.length > 0 && (
          <>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Recebido */}
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-700">
                      Total Recebido
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-green-100">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">
                    {formatCurrency(totalRecebido)}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Nos últimos 12 meses
                  </p>
                </CardContent>
              </Card>

              {/* Número de Pagamentos */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-700">
                      Pagamentos
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">
                    {totalDividendos}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Proventos recebidos
                  </p>
                </CardContent>
              </Card>

              {/* Yield Médio */}
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-700">
                      Yield Médio
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-orange-100">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-700">
                    {averageYield.toFixed(2)}%
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Dividend Yield médio
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Informação sobre seus ativos */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-900">
                <div className="space-y-2">
                  <p className="font-semibold">Seus Ativos que Pagam Dividendos</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    {assets.map((asset, index) => (
                      <div key={index} className="bg-white/60 p-3 rounded-lg border border-blue-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-bold">{asset.ticker}</Badge>
                            <span className="text-sm">{asset.quantidade} cotas</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-green-600">
                              {formatCurrency(asset.totalRecebido)}
                            </p>
                            <p className="text-xs text-slate-600">
                              DY: {asset.dividendYield.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 border-t border-blue-100 pt-2">
                          📅 Comprado em: <strong>{formatDate(asset.dataCompra)}</strong>
                        </div>
                        {asset.totalRecebido === 0 && (
                          <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                            Você comprou após os últimos pagamentos. Aguarde o próximo dividendo!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-blue-700 mt-3 italic">
                    Mostramos todos os dividendos dos <strong>últimos 12 meses</strong>. 
                    Você só recebe dividendos pagos <strong>após</strong> a data que você comprou cada ação.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            {/* Histórico Detalhado de Dividendos */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-green-600" />
                  <CardTitle>Histórico de Proventos (Últimos 12 Meses)</CardTitle>
                </div>
                <div className="text-sm text-slate-600 mt-2">
                  Todos os dividendos pagos pelas suas ações nos últimos 12 meses. 
                  Os marcados com <Badge variant="success" className="text-xs mx-1">✓ Recebido</Badge> você realmente recebeu. 
                  Os marcados com <Badge variant="secondary" className="text-xs mx-1">Não recebeu</Badge> foram pagos antes de você comprar a ação.
                </div>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold">Nenhum dividendo registrado</p>
                        <p className="text-sm">
                          As ações que você comprou ainda não pagaram dividendos nos últimos 12 meses,
                          ou você as comprou muito recentemente.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Ativo</TableHead>
                          <TableHead className="text-right">Valor por Cota</TableHead>
                          <TableHead className="text-right">Suas Cotas</TableHead>
                          <TableHead className="text-right">Você Recebeu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((item, index) => {
                          const divDate = new Date(item.date);
                          const recebeu = item.dataCompra ? divDate >= item.dataCompra : false;
                          
                          return (
                            <TableRow 
                              key={index} 
                              className={cn(
                                "transition-colors",
                                recebeu ? "hover:bg-green-50" : "hover:bg-slate-50 opacity-60"
                              )}
                            >
                              <TableCell className="font-medium">
                                {formatDate(item.date)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-bold">
                                  {item.ticker}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div>
                                  <span className="text-blue-600 font-semibold">
                                    {formatCurrency(item.valorPorCota)}
                                  </span>
                                  <span className="text-xs text-slate-500 block">por cota</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {item.quantidade}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="space-y-1">
                                  <span className="text-xs text-slate-500 block">
                                    {formatCurrency(item.valorPorCota)} × {item.quantidade}
                                  </span>
                                  {recebeu ? (
                                    <div className="flex items-center justify-end gap-1">
                                      <span className="font-bold text-green-600 text-lg">
                                        {formatCurrency(item.totalRecebido)}
                                      </span>
                                      <Badge variant="success" className="text-xs ml-1">✓ Recebido</Badge>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-1">
                                      <span className="font-bold text-slate-400 text-lg line-through">
                                        {formatCurrency(item.totalRecebido)}
                                      </span>
                                      <Badge variant="secondary" className="text-xs ml-1">Não recebeu</Badge>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}


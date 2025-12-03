'use client';

import { useRouter } from 'next/navigation';
import { DollarSign, Calendar, History, Info, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { AssetWithDividends, DividendHistoryItem } from '@/types/dividends';
import { cn } from '@/lib/utils';

interface DividendsSectionProps {
  assets: AssetWithDividends[];
  loading: boolean;
  error: string | null;
}

export function DividendsSection({ assets, loading, error }: DividendsSectionProps) {
  const router = useRouter();

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

  return (
    <div className="mt-12 pt-8 border-t-2 border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Histórico de Dividendos
        </h2>
        <p className="text-slate-600">
          Acompanhe os proventos dos últimos 12 meses das ações que você possui
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Loading size="md" />
      ) : assets.length === 0 ? (
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
      ) : (
        <>
          {/* Informação sobre seus ativos */}
          <Alert className="bg-blue-50 border-blue-200 mb-6">
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
  );
}


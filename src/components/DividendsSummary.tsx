import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Target } from 'lucide-react';

interface DividendsSummaryProps {
  totalReceived: number;
  averageYield: number;
  totalPayments: number;
  totalProjetado: number;
  totalInvestido: number;
}

export function DividendsSummary({ 
  totalReceived, 
  averageYield, 
  totalPayments,
  totalProjetado,
  totalInvestido
}: DividendsSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Investido */}
      <Card className="!bg-gradient-to-br !from-[#ff6b2d] !to-[#b91c1c] text-white border-0 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90 mb-2">Total Investido</p>
              <p className="text-3xl font-bold">{formatCurrency(totalInvestido)}</p>
              <p className="text-xs opacity-80 mt-2">Valor total da carteira</p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-70" />
          </div>
        </CardContent>
      </Card>

      {/* Projeção 12 Meses */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-600 mb-2">Projeção 12 Meses</p>
              <p className="text-3xl font-bold text-[#10b981]">{formatCurrency(totalProjetado)}</p>
              <Badge variant="success" className="mt-2 text-xs">
                Estimativa
              </Badge>
            </div>
            <DollarSign className="w-10 h-10 text-[#10b981] opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Dividend Yield Médio */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-600 mb-2">Dividend Yield Médio</p>
              <p className="text-3xl font-bold text-[#f59e0b]">{averageYield.toFixed(2)}%</p>
              <p className="text-xs text-slate-500 mt-2">Retorno anual estimado</p>
            </div>
            <Target className="w-10 h-10 text-[#f59e0b] opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { DividendsSummary } from '@/components/DividendsSummary';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    async function loadPortfolioDividends() {
      try {
        setLoadingDividends(true);
        setError(null);

        if (!user) return;

        // Buscar investimentos do usuário
        const investmentsRef = collection(db, 'portfolios', user.uid, 'investments');
        const snapshot = await getDocs(investmentsRef);
        const investments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (investments.length === 0) {
          setPortfolioDividends([]);
          setLoadingDividends(false);
          return;
        }

        // Buscar dividendos de cada ativo
        const dividendsPromises = investments.map(async (inv: any) => {
          try {
            const response = await fetch(`/api/dividends/${inv.ticker}`);
            const data = await response.json();

            // Converter dataCompra para Date
            const dataCompra = inv.dataCompra?.toDate ? inv.dataCompra.toDate() : new Date(inv.dataCompra);

            // Filtrar apenas dividendos pagos APÓS a data de compra
            const dividendsFiltrados = (data.dividends || []).filter((div: any) => {
              const dataPagamento = new Date(div.date);
              return dataPagamento >= dataCompra;
            });

            // Buscar preço atual
            const precoAtual = data.summary?.currentPrice || inv.precoMedio || 0;
            const valorInvestido = (inv.quantidade || 0) * (inv.precoMedio || 0);

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
            const dataCompra = inv.dataCompra?.toDate ? inv.dataCompra.toDate() : new Date(inv.dataCompra);
            const valorInvestido = (inv.quantidade || 0) * (inv.precoMedio || 0);
            
            return {
              ticker: inv.ticker,
              quantidade: inv.quantidade || 0,
              dividends: [],
              yield: 0,
              dataCompra: dataCompra,
              precoAtual: inv.precoMedio || 0,
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

  // Calcular projeções de dividendos futuros
  const calcularProjecoes = (): ProjecaoDividendo[] => {
    const projecoes: ProjecaoDividendo[] = [];
    const hoje = new Date();

    portfolioDividends.forEach(asset => {
      if (asset.yield > 0 && asset.quantidade > 0) {
        // Calcular dividend yield anual em reais
        const dividendoAnualPorCota = (asset.precoAtual * asset.yield) / 100;
        
        // Estimar frequência de pagamento (geralmente trimestral para ações brasileiras)
        // Assumir 4 pagamentos por ano
        const valorPorPagamento = dividendoAnualPorCota / 4;
        
        // Gerar projeções para os próximos 12 meses (4 pagamentos trimestrais)
        for (let i = 1; i <= 4; i++) {
          const dataEstimada = new Date(hoje);
          dataEstimada.setMonth(hoje.getMonth() + (i * 3)); // A cada 3 meses
          
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

    // Ordenar por data
    return projecoes.sort((a, b) => a.dataEstimada.getTime() - b.dataEstimada.getTime());
  };

  // Calcular proventos recebidos
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
  
  // Dividendos dos últimos 12 meses
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const last12MonthsPayments = received.filter(d => d.date >= twelveMonthsAgo);

  if (loading || loadingDividends) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            Dividendos da Carteira 💰
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Acompanhe os proventos recebidos dos seus investimentos
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {portfolioDividends.length === 0 ? (
          <Alert severity="info">
            Você ainda não possui investimentos na carteira. Adicione investimentos para acompanhar os dividendos.
          </Alert>
        ) : (
          <>
            {/* Cards de Resumo */}
            <Box sx={{ mb: 4 }}>
              <DividendsSummary
                totalReceived={totalReceived}
                averageYield={totalYield}
                totalPayments={last12MonthsPayments.length}
                totalProjetado={totalProjetado}
                totalInvestido={totalInvestido}
              />
            </Box>

            {/* Tabela de Projeções */}
            {projecoes.length > 0 && (
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  mb: 4
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Próximos Pagamentos Estimados 📅
                    </Typography>
                    <Chip 
                      label="Projeções" 
                      size="small" 
                      color="info" 
                      variant="outlined"
                    />
                  </Box>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>Como calculamos:</strong> As projeções são baseadas no Dividend Yield histórico de cada ativo. 
                      Valores e datas são estimativas e podem variar conforme as decisões das empresas.
                    </Typography>
                  </Alert>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Data Estimada</strong></TableCell>
                          <TableCell><strong>Ativo</strong></TableCell>
                          <TableCell align="right"><strong>Valor/Cota</strong></TableCell>
                          <TableCell align="right"><strong>Quantidade</strong></TableCell>
                          <TableCell align="right"><strong>Total Estimado</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projecoes.slice(0, 8).map((proj, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{formatDate(proj.dataEstimada)}</TableCell>
                            <TableCell>
                              <Chip label={proj.ticker} size="small" color="info" variant="outlined" />
                            </TableCell>
                            <TableCell align="right">{formatCurrency(proj.valorPorCota)}</TableCell>
                            <TableCell align="right">{proj.quantidade}</TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="bold" color="info.main">
                                {formatCurrency(proj.totalEstimado)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    💡 Dica: Esses valores são estimativas baseadas em histórico. 
                    Os dividendos reais podem ser maiores ou menores.
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Tabela de Histórico */}
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={700}>
                  Histórico de Proventos Recebidos 💰
                </Typography>

                {received.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom fontWeight={600}>
                      Nenhum dividendo recebido ainda
                    </Typography>
                    <Typography variant="body2">
                      Os dividendos aparecem aqui apenas após a data de pagamento e quando você já possuía o ativo na data COM.
                      Acompanhe as projeções acima para saber quando receberá! 📊
                    </Typography>
                  </Alert>
                ) : (
                  <TableContainer sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Data</strong></TableCell>
                          <TableCell><strong>Ativo</strong></TableCell>
                          <TableCell align="right"><strong>Valor Unitário</strong></TableCell>
                          <TableCell align="right"><strong>Quantidade</strong></TableCell>
                          <TableCell align="right"><strong>Total Recebido</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {received.slice(0, 100).map((div, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{formatDate(div.date)}</TableCell>
                            <TableCell>
                              <Chip label={div.ticker} size="small" color="primary" variant="outlined" />
                            </TableCell>
                            <TableCell align="right">{formatCurrency(div.value)}</TableCell>
                            <TableCell align="right">
                              {portfolioDividends.find(a => a.ticker === div.ticker)?.quantidade || 0}
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="bold" color="success.main">
                                {formatCurrency(div.received)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </MainLayout>
  );
}


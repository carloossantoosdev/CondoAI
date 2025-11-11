'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Savings,
  ShowChart,
  Assessment,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { Investment, PortfolioSummary } from '@/types';
import { getAssetQuote } from '@/services/api/investmentService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

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
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadInvestments();
      loadNews();
    }
  }, [user]);

  const loadNews = async () => {
    try {
      setLoadingNews(true);
      const response = await fetch('/api/news');
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setLoadingNews(false);
    }
  };

  const loadInvestments = async () => {
    if (!user) return;

    try {
      setLoadingData(true);
      const investmentsRef = collection(db, 'portfolios', user.uid, 'investments');
      const q = query(investmentsRef);
      const snapshot = await getDocs(q);

      const investmentsList: Investment[] = [];
      let totalInvestido = 0;
      let valorTotal = 0;

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const investment: Investment = {
          id: doc.id,
          userId: user.uid,
          type: data.type,
          ticker: data.ticker,
          nome: data.nome,
          quantidade: data.quantidade,
          precoMedio: data.precoMedio,
          dataCompra: data.dataCompra,
          valorTotal: data.valorTotal,
        };

        investmentsList.push(investment);
        totalInvestido += investment.valorTotal;

        // Buscar cotação atual
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header com melhor espaçamento */}
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            Bem-vindo, {user.displayName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aqui está um resumo dos seus investimentos
          </Typography>
        </Box>

        {loadingData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress size={50} />
          </Box>
        ) : (
          <>
            {/* Cards de Resumo com design melhorado */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 5 }}>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card 
                  elevation={0}
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white',
                    borderRadius: 3,
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontSize: '0.875rem' }}>
                          Valor Total
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {formatCurrency(summary.valorTotal)}
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          borderRadius: 2, 
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <AccountBalance sx={{ fontSize: 28 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card 
                  elevation={0}
                  sx={{ 
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                    color: 'white',
                    borderRadius: 3,
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(240, 147, 251, 0.3)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontSize: '0.875rem' }}>
                          Total Investido
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {formatCurrency(summary.totalInvestido)}
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          borderRadius: 2, 
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Savings sx={{ fontSize: 28 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  elevation={0}
                  sx={{
                    background: summary.lucroOuPrejuizo >= 0
                      ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                      : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: 'white',
                    borderRadius: 3,
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: summary.lucroOuPrejuizo >= 0 
                        ? '0 12px 24px rgba(79, 172, 254, 0.3)'
                        : '0 12px 24px rgba(250, 112, 154, 0.3)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontSize: '0.875rem' }}>
                          Lucro/Prejuízo
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {formatCurrency(summary.lucroOuPrejuizo)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9, fontWeight: 600 }}>
                          {summary.percentualRetorno >= 0 ? '+' : ''}{summary.percentualRetorno.toFixed(2)}%
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          borderRadius: 2, 
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {summary.lucroOuPrejuizo >= 0 ? (
                          <TrendingUp sx={{ fontSize: 28 }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: 28 }} />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card 
                  elevation={0}
                  sx={{ 
                    background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)', 
                    color: '#2d3436',
                    borderRadius: 3,
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(253, 203, 110, 0.3)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                          Investimentos
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {summary.numeroInvestimentos}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8, fontWeight: 500 }}>
                          {summary.numeroInvestimentos === 1 ? 'ativo' : 'ativos'}
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          bgcolor: 'rgba(45,52,54,0.1)', 
                          borderRadius: 2, 
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Assessment sx={{ fontSize: 28 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Gráficos e Lista com design melhorado */}
            {investments.length > 0 ? (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3, 
                      border: '1px solid',
                      borderColor: 'divider',
                      height: '100%'
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 3,
                          fontSize: '1.125rem'
                        }}
                      >
                        Distribuição do Portfólio
                      </Typography>
                      <ResponsiveContainer width="100%" height={320}>
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
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3, 
                      border: '1px solid',
                      borderColor: 'divider',
                      height: '100%'
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 3,
                          fontSize: '1.125rem'
                        }}
                      >
                        Investimentos Recentes
                      </Typography>
                      <Box>
                        {investments.slice(0, 5).map((inv, index) => (
                          <Box
                            key={inv.id}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 2,
                              px: 2,
                              borderRadius: 2,
                              mb: 1,
                              bgcolor: index % 2 === 0 ? 'grey.50' : 'transparent',
                              transition: 'background-color 0.2s',
                              '&:hover': {
                                bgcolor: 'primary.light',
                                '& .MuiTypography-root': {
                                  color: 'white',
                                }
                              }
                            }}
                          >
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                {inv.ticker}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                                {inv.nome}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                {formatCurrency(inv.valorTotal)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                                {inv.quantidade} {inv.quantidade === 1 ? 'unidade' : 'unidades'}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 3, 
                  border: '2px dashed',
                  borderColor: 'divider',
                  bgcolor: 'grey.50'
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 10, px: 4 }}>
                  <Box 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.light', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3
                    }}
                  >
                    <ShowChart sx={{ fontSize: 50, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                    Você ainda não tem investimentos
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                    Comece sua jornada de investimentos explorando nossos ativos disponíveis
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Seção de Notícias do Mercado */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                📰 Notícias do Mercado
              </Typography>
              
              {loadingNews ? (
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={40} />
                  </CardContent>
                </Card>
              ) : news.length > 0 ? (
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 3 }}>
                    {news.slice(0, 5).map((item, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          pb: 2, 
                          mb: 2, 
                          borderBottom: index < 4 ? '1px solid' : 'none',
                          borderColor: 'divider'
                        }}
                      >
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600, 
                              mb: 0.5,
                              '&:hover': { color: 'primary.main' }
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                              {item.source}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(item.pubDate).toLocaleDateString('pt-BR')}
                            </Typography>
                          </Box>
                        </a>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhuma notícia disponível no momento
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Seção Educativa */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                💡 Dica de Investimento
              </Typography>
              
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3, 
                  border: '1px solid',
                  borderColor: 'divider',
                  background: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    O que é Preço Teto (Método Bazin)?
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                    O <strong>Preço Teto</strong> é o preço máximo que você deveria pagar por uma ação segundo o método Bazin. 
                    Ele é calculado com base no <strong>Dividend Yield</strong> (DY) da ação.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                    <strong>Regra:</strong> Só compre ações que pagam pelo menos <strong>6% de DY ao ano</strong>. 
                    Se a ação paga menos que isso, o preço está caro. Se paga mais, está barato!
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Exemplo:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                      • Ação custa R$ 40,00<br />
                      • Paga R$ 3,00 de dividendos/ano<br />
                      • DY = 3,00 ÷ 40 = 7,5%<br />
                      • <strong>Preço Teto = R$ 50,00</strong> (baseado em 6% DY)<br />
                      • ✅ <strong>COMPRA!</strong> Está abaixo do teto
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                    💡 Na página de Investimentos, veja o Preço Teto calculado automaticamente para cada ação!
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </>
        )}
      </Box>
    </MainLayout>
  );
}


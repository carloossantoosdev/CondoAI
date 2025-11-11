'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
  Typography,
  Avatar,
  Alert,
  Pagination,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  TrendingUp,
  TrendingDown,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Asset, InvestmentType } from '@/types';
import { getAllAssets, getAssetsByType, PaginatedAssets } from '@/services/api/investmentService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

interface AssetWithAnalysis extends Asset {
  precoTeto?: number;
  recomendacao?: string;
}

export default function InvestmentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<'todos' | InvestmentType>('todos');
  const [assets, setAssets] = useState<AssetWithAnalysis[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<AssetWithAnalysis | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [investing, setInvesting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [analisePrecoTeto, setAnalisePrecoTeto] = useState<{
    precoTeto: number;
    recomendacao: string;
    explicacao: string;
  } | null>(null);
  const [loadingAnalise, setLoadingAnalise] = useState(false);
  const [page, setPage] = useState(1);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadAssets();
  }, [currentTab]);

  const loadAssets = async (pageNumber: number = 1) => {
    try {
      setLoadingAssets(true);
      let data: PaginatedAssets;

      if (currentTab === 'todos') {
        data = await getAllAssets(pageNumber);
      } else {
        data = await getAssetsByType(currentTab, pageNumber);
      }

      setAssets(data.assets);
      setServerTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setPage(pageNumber);
    } catch (error) {
      console.error('Erro ao carregar ativos:', error);
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'todos' | InvestmentType) => {
    setCurrentTab(newValue);
    setPage(1);
  };

  const handleOpenModal = async (asset: Asset) => {
    setSelectedAsset(asset);
    setQuantidade(1);
    setModalOpen(true);
    setAnalisePrecoTeto(null);
    
    // Buscar análise de preço teto apenas para ações
    if (asset.tipo === 'acao') {
      try {
        setLoadingAnalise(true);
        const response = await fetch(`/api/fundamentals/${asset.ticker}`);
        const data = await response.json();
        
        console.log(`[MODAL] Análise recebida para ${asset.ticker}:`, data);
        
        // Sempre mostrar análise, mesmo se for "SEM DADOS"
        if (data && data.recomendacao) {
          setAnalisePrecoTeto({
            precoTeto: data.precoTeto || 0,
            recomendacao: data.recomendacao,
            explicacao: data.explicacao || 'Análise de preço'
          });
        }
      } catch (error) {
        console.error('Erro ao buscar análise:', error);
      } finally {
        setLoadingAnalise(false);
      }
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAsset(null);
    setQuantidade(1);
    setAnalisePrecoTeto(null);
  };

  const handleInvest = async () => {
    if (!user || !selectedAsset) return;

    try {
      setInvesting(true);
      
      const valorTotal = selectedAsset.preco * quantidade;
      
      const investmentsRef = collection(db, 'portfolios', user.uid, 'investments');
      await addDoc(investmentsRef, {
        type: selectedAsset.tipo,
        ticker: selectedAsset.ticker,
        nome: selectedAsset.nome,
        quantidade,
        precoMedio: selectedAsset.preco,
        dataCompra: serverTimestamp(),
        valorTotal,
      });

      setSuccessMessage(`Investimento em ${selectedAsset.ticker} realizado com sucesso!`);
      handleCloseModal();

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Erro ao investir:', error);
      alert('Erro ao realizar investimento. Tente novamente.');
    } finally {
      setInvesting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Paginação - usar servidor para ações, local para outros
  const useServerPagination = currentTab === 'acao' || currentTab === 'todos';
  
  let paginatedAssets: AssetWithAnalysis[];
  let totalPages: number;

  if (useServerPagination) {
    // Para ações: os dados já vêm paginados do servidor (50 por página)
    // Vamos dividir esses 50 em 5 páginas locais de 10 itens
    const localPage = ((page - 1) % 5) + 1; // Página local de 1 a 5
    paginatedAssets = assets.slice(
      (localPage - 1) * itemsPerPage,
      localPage * itemsPerPage
    );
    // Total de páginas = (páginas do servidor * 5)
    totalPages = serverTotalPages * 5;
  } else {
    // Para outros tipos: paginação local simples
    paginatedAssets = assets.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
    totalPages = Math.ceil(assets.length / itemsPerPage);
  }

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    if (useServerPagination) {
      // Calcular qual página do servidor buscar
      const serverPage = Math.ceil(value / 5);
      const currentServerPage = Math.ceil(page / 5);
      
      // Se mudou de página no servidor, buscar novos dados
      if (serverPage !== currentServerPage) {
        await loadAssets(serverPage);
        setPage(value);
      } else {
        // Apenas mudança local
        setPage(value);
      }
    } else {
      setPage(value);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            Explorar Investimentos 📊
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Descubra as melhores oportunidades de investimento para seu perfil
          </Typography>
        </Box>

        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontSize: '0.95rem'
              }
            }} 
            onClose={() => setSuccessMessage('')}
          >
            {successMessage}
          </Alert>
        )}

        {/* Tabs com design melhorado */}
        <Card 
          elevation={0} 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                minHeight: 56,
              },
              '& .Mui-selected': {
                color: 'primary.main',
              }
            }}
          >
            <Tab label="Todos" value="todos" />
            <Tab label="Ações" value="acao" />
            <Tab label="Fundos" value="fundo" />
            <Tab label="Renda Fixa" value="rendaFixa" />
            <Tab label="Cripto" value="cripto" />
          </Tabs>
        </Card>

        {loadingAssets ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress size={50} />
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {paginatedAssets.map((asset) => (
              <Grid key={`${asset.tipo}-${asset.ticker}`} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Header do Card com Avatar e Info */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      {asset.logo ? (
                        <Avatar 
                          src={asset.logo} 
                          sx={{ 
                            mr: 2, 
                            width: 56, 
                            height: 56,
                            border: '2px solid',
                            borderColor: 'divider',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }} 
                        />
                      ) : (
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            width: 56, 
                            height: 56, 
                            bgcolor: 'primary.main',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          {asset.ticker.substring(0, 2)}
                        </Avatar>
                      )}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {asset.ticker}
                        </Typography>
                        <Chip
                          label={
                            asset.tipo === 'acao' ? 'Ação' :
                            asset.tipo === 'fundo' ? 'Fundo' :
                            asset.tipo === 'rendaFixa' ? 'Renda Fixa' :
                            'Cripto'
                          }
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 24,
                            borderRadius: 1.5,
                            bgcolor: 'primary.light',
                            color: 'white',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Nome do Ativo */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 3, 
                        minHeight: 42,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {asset.nome}
                    </Typography>

                    {/* Preço e Variação */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 2,
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Preço Atual
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1 }}>
                          {formatCurrency(asset.preco)}
                        </Typography>
                      </Box>
                      {asset.variacao !== undefined && (
                        <Chip
                          icon={asset.variacao >= 0 ? <TrendingUp /> : <TrendingDown />}
                          label={`${asset.variacao >= 0 ? '+' : ''}${asset.variacao.toFixed(2)}%`}
                          color={asset.variacao >= 0 ? 'success' : 'error'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            '& .MuiChip-icon': {
                              fontSize: 18
                            }
                          }}
                        />
                      )}
                    </Box>

                    {/* Botão Investir */}
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenModal(asset)}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        }
                      }}
                    >
                      Investir
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Paginação */}
        {!loadingAssets && totalPages > 1 && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              mt: 6,
              mb: 4,
              gap: 2
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Mostrando {((page - 1) * itemsPerPage) + 1}-{Math.min(page * itemsPerPage, totalCount)} de {totalCount.toLocaleString('pt-BR')} investimentos
            </Typography>
            <Pagination 
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
            />
          </Box>
        )}

        {/* Modal de Investimento com design melhorado */}
        <Dialog 
          open={modalOpen} 
          onClose={handleCloseModal} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Investir em {selectedAsset?.ticker}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {selectedAsset && (
              <Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  {selectedAsset.nome}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      bgcolor: 'grey.50', 
                      borderRadius: 2,
                      p: 2,
                      mb: 2
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Preço Atual
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {formatCurrency(selectedAsset.preco)}
                    </Typography>
                  </Card>

                  {/* Análise de Preço Teto (só para ações) */}
                  {selectedAsset.tipo === 'acao' && (
                    <Box sx={{ mb: 3 }}>
                      {loadingAnalise ? (
                        <Card elevation={0} sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={16} />
                            <Typography variant="caption" color="text.secondary">
                              Analisando preço...
                            </Typography>
                          </Box>
                        </Card>
                      ) : analisePrecoTeto ? (
                        <Card 
                          elevation={0}
                          sx={{ 
                            bgcolor: 
                              analisePrecoTeto.recomendacao === 'SEM DADOS' ? '#f5f5f5' :
                              analisePrecoTeto.recomendacao.includes('COMPRA') ? '#e8f5e9' : 
                              analisePrecoTeto.recomendacao === 'MANTER' ? '#fff3e0' : 
                              analisePrecoTeto.recomendacao === 'NEUTRO' ? '#e3f2fd' : '#ffebee',
                            borderRadius: 2,
                            p: 2,
                            border: '1px solid',
                            borderColor: 
                              analisePrecoTeto.recomendacao === 'SEM DADOS' ? 'grey.300' :
                              analisePrecoTeto.recomendacao.includes('COMPRA') ? 'success.light' : 
                              analisePrecoTeto.recomendacao === 'MANTER' ? 'warning.light' : 
                              analisePrecoTeto.recomendacao === 'NEUTRO' ? 'info.light' : 'error.light'
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                            📊 Análise de Preço Teto (Método Bazin)
                          </Typography>
                          
                          {analisePrecoTeto.recomendacao !== 'SEM DADOS' && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Preço Teto Calculado
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {formatCurrency(analisePrecoTeto.precoTeto)}
                              </Typography>
                            </Box>
                          )}
                          
                          <Chip
                            label={analisePrecoTeto.recomendacao}
                            size="small"
                            color={
                              analisePrecoTeto.recomendacao === 'SEM DADOS' ? 'default' :
                              analisePrecoTeto.recomendacao.includes('COMPRA') ? 'success' :
                              analisePrecoTeto.recomendacao === 'MANTER' ? 'warning' : 
                              analisePrecoTeto.recomendacao === 'NEUTRO' ? 'info' : 'error'
                            }
                            sx={{ fontWeight: 700, width: '100%', mb: 1 }}
                          />
                          
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {analisePrecoTeto.explicacao}
                          </Typography>
                        </Card>
                      ) : null}
                    </Box>
                  )}

                  <TextField
                    label="Quantidade"
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                    fullWidth
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    inputProps={{ min: 1 }}
                  />
                  
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 2,
                      color: 'white',
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total a Investir
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {formatCurrency(selectedAsset.preco * quantidade)}
                    </Typography>
                  </Card>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
            <Button 
              onClick={handleCloseModal} 
              disabled={investing}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 3
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleInvest}
              disabled={investing}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                }
              }}
            >
              {investing ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Investimento'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}


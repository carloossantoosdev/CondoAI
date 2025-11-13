'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Asset, InvestmentType, RiskProfile } from '@/types';
import { getAllAssets, getAssetsByType, PaginatedAssets } from '@/services/api/investmentService';
import { createClient } from '@/lib/supabase/client';
import { TrendingUp, TrendingDown, Plus, Loader2, CheckCircle2, DollarSign, TrendingUpIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getInvestmentTypeName,
  getInvestmentTypeEmoji,
  getAvailableInvestmentTypes,
  getEffectiveProfile,
  profileInfo,
} from '@/lib/investmentHelpers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Loading } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

// Criar instância única do cliente Supabase
const supabaseClient = createClient();

interface AssetWithAnalysis extends Asset {
  precoTeto?: number;
  recomendacao?: string;
}

export default function InvestmentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<'recomendados' | 'todos' | InvestmentType>('recomendados');
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

      if (currentTab === 'recomendados') {
        // Carrega apenas ativos compatíveis com o perfil do usuário
        const availableTypes = getAvailableInvestmentTypes(user?.riskProfile as RiskProfile | null || null, false);
        data = await getAllAssets(pageNumber);
        
        // Filtra apenas ativos compatíveis
        data.assets = data.assets.filter(asset => 
          availableTypes.includes(asset.tipo)
        );
      } else if (currentTab === 'todos') {
        // Na aba "Todos", também filtra por perfil
        const availableTypes = getAvailableInvestmentTypes(user?.riskProfile as RiskProfile | null || null, false);
        data = await getAllAssets(pageNumber);
        data.assets = data.assets.filter(asset => 
          availableTypes.includes(asset.tipo)
        );
      } else {
        // Tabs específicas já filtram pelo tipo
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

  const handleTabChange = (newValue: string) => {
    setCurrentTab(newValue as 'recomendados' | 'todos' | InvestmentType);
    setPage(1);
  };

  const handleOpenModal = async (asset: Asset) => {
    // Todos os ativos mostrados já são compatíveis, então pode abrir direto
    setSelectedAsset(asset);
    setQuantidade(1);
    setModalOpen(true);
    setAnalisePrecoTeto(null);
    
    if (asset.tipo === 'acao') {
      try {
        setLoadingAnalise(true);
        const response = await fetch(`/api/fundamentals/${asset.ticker}`);
        const data = await response.json();
        
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
      
      const { error } = await supabaseClient
        .from('investments')
        .insert({
          user_id: user.uid,
          type: selectedAsset.tipo,
          ticker: selectedAsset.ticker,
          nome: selectedAsset.nome,
          quantidade,
          preco_medio: selectedAsset.preco,
          data_compra: new Date().toISOString(),
          valor_total: valorTotal,
        });

      if (error) {
        console.error('Erro ao investir:', error);
        alert(`Erro ao realizar investimento: ${error.message}`);
        return;
      }

      setSuccessMessage(`Investimento em ${selectedAsset.ticker} realizado com sucesso!`);
      handleCloseModal();
      
      // Limpar mensagem após 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
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
    return <Loading size="lg" fullscreen />;
  }

  // Paginação
  const useServerPagination = currentTab === 'acao' || currentTab === 'todos';
  
  let paginatedAssets: AssetWithAnalysis[];
  let totalPages: number;

  if (useServerPagination) {
    const localPage = ((page - 1) % 5) + 1;
    paginatedAssets = assets.slice(
      (localPage - 1) * itemsPerPage,
      localPage * itemsPerPage
    );
    totalPages = serverTotalPages * 5;
  } else {
    paginatedAssets = assets.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
    totalPages = Math.ceil(assets.length / itemsPerPage);
  }

  const handlePageChange = async (value: number) => {
    if (useServerPagination) {
      const serverPage = Math.ceil(value / 5);
      const currentServerPage = Math.ceil(page / 5);
      
      if (serverPage !== currentServerPage) {
        await loadAssets(serverPage);
        setPage(value);
      } else {
        setPage(value);
      }
    } else {
      setPage(value);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Explorar Investimentos 📊
          </h1>
          <p className="text-slate-600">
            Descubra as melhores oportunidades de investimento para seu perfil
          </p>
        </div>

        {successMessage && (
          <Alert variant="success" className="border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Banner de Incentivo - Perfil Não Definido */}
        {!user?.riskProfile && (
          <Card className="border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {/* Título */}
                <div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">
                    🎯 Descubra Seu Perfil de Investidor!
                  </h3>
                  <p className="text-amber-800 mb-3">
                    Você está navegando com perfil <strong>Conservador (padrão)</strong>. 
                    Complete nosso quiz rápido para desbloquear investimentos personalizados para você!
                  </p>
                </div>
                
                {/* Benefícios */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Recomendações IA personalizadas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Desbloqueie mais categorias</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Apenas 2 minutos</span>
                  </div>
                </div>
                
                {/* Botão */}
                <div>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[#ff6b2d] to-[#b91c1c] hover:from-[#ff6b2d]/90 hover:to-[#b91c1c]/90 shadow-md"
                    onClick={() => router.push('/perfil')}
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Fazer Quiz Agora (2 min)
                  </Button>
                </div>
                
                {/* Info Box */}
                <Alert className="bg-white/50 border-amber-200">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-sm text-amber-800">
                    <strong>Por que isso importa?</strong> Seu perfil nos ajuda a filtrar apenas investimentos adequados 
                    ao seu nível de conhecimento e tolerância ao risco, protegendo você de decisões inadequadas.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Tabs de Filtro por Perfil */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Badge do Perfil */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold">
                    ⭐ Investimentos Recomendados para seu Perfil
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">
                    Mostrando apenas ativos compatíveis com o seu nível de risco
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const effectiveProfile = getEffectiveProfile(user?.riskProfile as RiskProfile | null);
                    return (
                      <Badge variant="secondary" className="text-sm">
                        {profileInfo[effectiveProfile]?.emoji} {profileInfo[effectiveProfile]?.title}
                      </Badge>
                    );
                  })()}
                  {!user?.riskProfile && (
                    <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">
                      Padrão
                    </Badge>
                  )}
                </div>
              </div>

              {/* Tabs Dinâmicas baseadas no Perfil Efetivo */}
              <Tabs value={currentTab} onValueChange={handleTabChange}>
                <TabsList className={cn(
                  "grid w-full",
                  getEffectiveProfile(user?.riskProfile as RiskProfile | null) === 'conservador' ? 'grid-cols-1' :
                  getEffectiveProfile(user?.riskProfile as RiskProfile | null) === 'moderado' ? 'grid-cols-4' :
                  getEffectiveProfile(user?.riskProfile as RiskProfile | null) === 'arrojado' ? 'grid-cols-6' :
                  'grid-cols-1'
                )}>
           
                  {/* Todos - apenas arrojado */}
                  {getEffectiveProfile(user?.riskProfile as RiskProfile | null) === 'arrojado' && (
                    <TabsTrigger value="todos">
                      Todos
                    </TabsTrigger>
                  )}
                  
                  <TabsTrigger value="rendaFixa">
                    🏦 Renda Fixa
                  </TabsTrigger>
                  
                  {/* Fundos - apenas moderado e arrojado */}
                  {getEffectiveProfile(user?.riskProfile as RiskProfile | null) !== 'conservador' && (
                    <TabsTrigger value="fundo">
                      📈 Fundos
                    </TabsTrigger>
                  )}
                  
                  {/* Ações - apenas moderado e arrojado */}
                  {getEffectiveProfile(user?.riskProfile as RiskProfile | null) !== 'conservador' && (
                    <TabsTrigger value="acao">
                      📊 Ações
                    </TabsTrigger>
                  )}
                  
                  {/* Cripto - apenas arrojado */}
                  {getEffectiveProfile(user?.riskProfile as RiskProfile | null) === 'arrojado' && (
                    <TabsTrigger value="cripto">
                      ₿ Cripto
                    </TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Assets Grid */}
        {loadingAssets ? (
          <Loading size="lg" fullscreen />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedAssets.map((asset) => {
                // Todos os ativos aqui já são compatíveis (filtrados no loadAssets)
                return (
                  <Card 
                    key={`${asset.tipo}-${asset.ticker}`}
                    className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-brand-orange/50 relative"
                  >
                    {/* Badge de Compatibilidade - sempre verde */}
                    <Badge 
                      variant="success"
                      className="absolute top-2 right-2 z-10 text-xs"
                    >
                      ✓ Recomendado
                    </Badge>

                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar className="h-12 w-12 border-2 border-slate-200">
                          {asset.logo ? (
                            <AvatarImage src={asset.logo} alt={asset.ticker} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-brand-orange to-brand-red text-white font-bold text-sm">
                              {asset.ticker.substring(0, 2)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 truncate">
                            {asset.ticker}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className="mt-1 text-xs"
                          >
                            {getInvestmentTypeEmoji(asset.tipo)} {getInvestmentTypeName(asset.tipo)}
                          </Badge>
                        </div>
                      </div>

                    {/* Nome */}
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                      {asset.nome}
                    </p>

                    {/* Preço e Variação */}
                    <div className="bg-slate-50 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs text-slate-500 block mb-1">
                            Preço Atual
                          </span>
                          <span className="text-xl font-bold text-slate-900">
                            {formatCurrency(asset.preco)}
                          </span>
                        </div>
                        {asset.variacao !== undefined && (
                          <Badge
                            variant={asset.variacao >= 0 ? "success" : "destructive"}
                            className="gap-1"
                          >
                            {asset.variacao >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {asset.variacao >= 0 ? '+' : ''}{asset.variacao.toFixed(2)}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Botão Investir */}
                    <Button
                      onClick={() => handleOpenModal(asset)}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Plus className="w-4 h-4" />
                      Investir
                    </Button>
                  </CardContent>
                </Card>
              );
              })}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-8">
                <p className="text-sm text-slate-600">
                  Mostrando {((page - 1) * itemsPerPage) + 1}-{Math.min(page * itemsPerPage, totalCount)} de {totalCount.toLocaleString('pt-BR')} investimentos
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => page > 1 && handlePageChange(page - 1)}
                        className={cn(page === 1 && "pointer-events-none opacity-50")}
                      />
                    </PaginationItem>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={page === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => page < totalPages && handlePageChange(page + 1)}
                        className={cn(page === totalPages && "pointer-events-none opacity-50")}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {/* Modal de Investimento - Design Melhorado */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border-2 border-brand-orange/30">
                  {selectedAsset?.logo ? (
                    <AvatarImage src={selectedAsset.logo} alt={selectedAsset.ticker} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-brand-orange to-brand-red text-white font-bold">
                      {selectedAsset?.ticker.substring(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-brand-orange to-brand-red bg-clip-text text-transparent">
                    {selectedAsset?.ticker}
                  </DialogTitle>
                  <DialogDescription className="text-base text-slate-600">
                    {selectedAsset?.nome}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {selectedAsset && (
              <div className="space-y-5 py-4">
                {/* Preço Atual - Destaque */}
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-brand-orange/30 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-slate-500 block mb-1 uppercase tracking-wide">
                          💰 Preço Atual
                        </span>
                        <span className="text-3xl font-bold text-slate-900">
                          {formatCurrency(selectedAsset.preco)}
                        </span>
                      </div>
                      {selectedAsset.variacao !== undefined && (
                        <Badge
                          variant={selectedAsset.variacao >= 0 ? "success" : "destructive"}
                          className="gap-1 px-3 py-1"
                        >
                          {selectedAsset.variacao >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {selectedAsset.variacao >= 0 ? '+' : ''}{selectedAsset.variacao.toFixed(2)}%
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Análise de Preço Teto */}
                {selectedAsset.tipo === 'acao' && (
                  <div>
                    {loadingAnalise ? (
                      <Card className="bg-slate-50 border-0">
                        <CardContent className="p-4 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-slate-600">Analisando preço...</span>
                        </CardContent>
                      </Card>
                    ) : analisePrecoTeto ? (
                      <Card 
                        className={cn(
                          "border-2",
                          analisePrecoTeto.recomendacao === 'SEM DADOS' ? 'bg-slate-50 border-slate-200' :
                          analisePrecoTeto.recomendacao.includes('COMPRA') ? 'bg-green-50 border-green-300' : 
                          analisePrecoTeto.recomendacao === 'MANTER' ? 'bg-yellow-50 border-yellow-300' : 
                          analisePrecoTeto.recomendacao === 'NEUTRO' ? 'bg-sky-50 border-sky-300' : 
                          'bg-orange-50 border-orange-300'
                        )}
                      >
                        <CardContent className="p-4 space-y-3">
                          <span className="text-sm font-semibold text-slate-700 block">
                            📊 Análise de Preço Teto (Método Bazin)
                          </span>
                          
                          {analisePrecoTeto.recomendacao !== 'SEM DADOS' && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">Preço Teto Calculado</span>
                              <span className="text-sm font-bold text-slate-900">
                                {formatCurrency(analisePrecoTeto.precoTeto)}
                              </span>
                            </div>
                          )}
                          
                          <Badge
                            variant={
                              analisePrecoTeto.recomendacao === 'SEM DADOS' ? 'secondary' :
                              analisePrecoTeto.recomendacao.includes('COMPRA') ? 'success' :
                              analisePrecoTeto.recomendacao === 'MANTER' ? 'warning' : 
                              'destructive'
                            }
                            className="w-full justify-center py-2"
                          >
                            {analisePrecoTeto.recomendacao}
                          </Badge>
                          
                          <p className="text-xs text-slate-600">
                            {analisePrecoTeto.explicacao}
                          </p>
                        </CardContent>
                      </Card>
                    ) : null}
                  </div>
                )}

                {/* Quantidade */}
                <div className="space-y-3">
                  <Label htmlFor="quantidade" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    📊 Quantidade
                  </Label>
                  <div className="relative">
                    <Input
                      id="quantidade"
                      type="number"
                      min="1"
                      value={quantidade}
                      onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-xl font-semibold h-14 pl-4 pr-12 border-2 border-slate-200 focus:border-brand-orange"
                      placeholder="1"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                      {quantidade > 1 ? 'cotas' : 'cota'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Preço unitário: {formatCurrency(selectedAsset.preco)}
                  </p>
                </div>

                {/* Resumo do Investimento */}
                <Card className="bg-gradient-to-br from-brand-orange via-red-600 to-brand-red border-0 text-white shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium opacity-90 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Total a Investir
                      </span>
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                        {quantidade} {quantidade > 1 ? 'cotas' : 'cota'}
                      </Badge>
                    </div>
                    <span className="text-4xl font-bold block">
                      {formatCurrency(selectedAsset.preco * quantidade)}
                    </span>
                    <p className="text-xs opacity-75 mt-2">
                      Este valor será debitado da sua conta
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                disabled={investing}
                className="flex-1 h-12"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleInvest}
                disabled={investing}
                className="flex-1 gap-2 h-12 bg-gradient-to-r from-brand-orange to-brand-red hover:from-brand-orange/90 hover:to-brand-red/90 text-white font-semibold shadow-lg"
              >
                {investing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <TrendingUpIcon className="w-5 h-5" />
                    Confirmar Investimento
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

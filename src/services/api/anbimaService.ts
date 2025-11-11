import { Asset } from '@/types';

const BRAPI_BASE_URL = 'https://brapi.dev/api';
const BRAPI_API_KEY = process.env.BRAPI_API_KEY || process.env.NEXT_PUBLIC_BRAPI_API_KEY || '';

// API de Fundos Imobiliários (FIIs) via brapi.dev
// Nota: Para fundos de investimento tradicionais (multimercado, renda fixa, etc.),
// seria necessário integrar com a CVM (arquivos CSV) ou ANBIMA (requer credenciais)

interface BrapiFII {
  stock: string;
  name: string;
  close: number;
  change: number;
  volume: number;
  logo?: string;
}

// Cache para otimizar performance
let cachedFunds: Asset[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

export const getAnbimaFunds = async (): Promise<Asset[]> => {
  try {
    // Verificar cache
    const now = Date.now();
    if (cachedFunds && (now - cacheTimestamp) < CACHE_DURATION) {
      return cachedFunds;
    }

    // Buscar FIIs da brapi
    const url = BRAPI_API_KEY 
      ? `${BRAPI_BASE_URL}/quote/list?limit=100&sortBy=volume&sortOrder=desc&type=fund&token=${BRAPI_API_KEY}`
      : `${BRAPI_BASE_URL}/quote/list?limit=100&sortBy=volume&sortOrder=desc&type=fund`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar fundos imobiliários');
    }

    const data = await response.json();
    const funds: BrapiFII[] = data.stocks || [];

    // Filtrar apenas FIIs (terminam com 11)
    const fiis = funds
      .filter(fund => fund.stock.endsWith('11'))
      .slice(0, 30) // Limitar a 30 FIIs mais negociados
      .map(fund => ({
        ticker: fund.stock,
        nome: fund.name,
        preco: fund.close,
        variacao: fund.change,
        tipo: 'fundo' as const,
        logo: fund.logo,
      }));

    // Atualizar cache
    cachedFunds = fiis;
    cacheTimestamp = now;

    return fiis;
  } catch (error) {
    console.error('Erro ao buscar fundos imobiliários:', error);
    
    // Fallback: retornar dados de referência
    return getFallbackFunds();
  }
};

export const getAnbimaFundQuote = async (ticker: string): Promise<Asset | null> => {
  try {
    // Verificar se é um FII (termina com 11)
    if (!ticker.endsWith('11')) {
      // Tentar buscar nos fundos em cache
      if (cachedFunds) {
        const fund = cachedFunds.find(f => f.ticker === ticker);
        if (fund) return fund;
      }
      return null;
    }

    // Buscar cotação específica do FII
    const url = BRAPI_API_KEY 
      ? `${BRAPI_BASE_URL}/quote/${ticker}?token=${BRAPI_API_KEY}`
      : `${BRAPI_BASE_URL}/quote/${ticker}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar cotação de ${ticker}`);
    }

    const data = await response.json();
    const result = data.results?.[0];

    if (!result) return null;

    return {
      ticker: result.symbol,
      nome: result.shortName || result.longName,
      preco: result.regularMarketPrice,
      variacao: result.regularMarketChangePercent,
      tipo: 'fundo',
      logo: result.logourl,
    };
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${ticker}:`, error);
    return null;
  }
};

// Fallback com FIIs populares para quando a API falhar
const getFallbackFunds = (): Asset[] => {
  const popularFIIs = [
    { ticker: 'HGLG11', nome: 'CSHG Logística FII', preco: 160.00, variacao: 0.5 },
    { ticker: 'VISC11', nome: 'Vinci Shopping Centers FII', preco: 115.00, variacao: 0.3 },
    { ticker: 'KNRI11', nome: 'Kinea Renda Imobiliária FII', preco: 145.00, variacao: -0.2 },
    { ticker: 'XPML11', nome: 'XP Malls FII', preco: 105.00, variacao: 0.8 },
    { ticker: 'BTLG11', nome: 'BTG Pactual Logística FII', preco: 98.00, variacao: 0.4 },
    { ticker: 'MXRF11', nome: 'Maxi Renda FII', preco: 10.50, variacao: 0.1 },
    { ticker: 'HGRE11', nome: 'CSHG Real Estate FII', preco: 125.00, variacao: 0.6 },
    { ticker: 'RECT11', nome: 'Recebíveis Imobiliários FII', preco: 95.00, variacao: -0.1 },
  ];

  return popularFIIs.map(fii => ({
    ticker: fii.ticker,
    nome: fii.nome,
    preco: fii.preco,
    variacao: fii.variacao,
    tipo: 'fundo' as const,
  }));
};


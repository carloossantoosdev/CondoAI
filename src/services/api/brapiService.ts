import { Asset } from '@/types';

const BRAPI_BASE_URL = 'https://brapi.dev/api';
const BRAPI_API_KEY = process.env.BRAPI_API_KEY || process.env.NEXT_PUBLIC_BRAPI_API_KEY || '';

export interface BrapiQuote {
  stock: string;
  name: string;
  close: number;
  change: number;
  logo: string;
}

export interface BrapiPaginatedResponse {
  stocks: BrapiQuote[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalCount: number;
  hasNextPage: boolean;
}

export const getBrapiAssets = async (
  type: 'stock' | 'fii' | 'all' = 'all',
  page: number = 1,
  limit: number = 50
): Promise<{ assets: Asset[]; totalPages: number; totalCount: number }> => {
  try {
    const url = BRAPI_API_KEY 
      ? `${BRAPI_BASE_URL}/quote/list?page=${page}&limit=${limit}&sortBy=volume&sortOrder=desc&token=${BRAPI_API_KEY}`
      : `${BRAPI_BASE_URL}/quote/list?page=${page}&limit=${limit}&sortBy=volume&sortOrder=desc`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar ativos da brapi');
    }

    const data: BrapiPaginatedResponse = await response.json();
    const stocks: BrapiQuote[] = data.stocks || [];

    let filtered = stocks;
    
    if (type === 'stock') {
      filtered = stocks.filter(s => !s.stock.includes('11')); // Filtro simples para ações
    } else if (type === 'fii') {
      filtered = stocks.filter(s => s.stock.includes('11')); // FIIs geralmente terminam com 11
    }

    const assets = filtered.map(stock => ({
      ticker: stock.stock,
      nome: stock.name,
      preco: stock.close,
      variacao: stock.change,
      tipo: stock.stock.includes('11') ? 'fundo' as const : 'acao' as const,
      logo: stock.logo,
    }));

    return {
      assets,
      totalPages: data.totalPages || 1,
      totalCount: data.totalCount || assets.length,
    };
  } catch (error) {
    console.error('Erro ao buscar ativos da brapi:', error);
    return { assets: [], totalPages: 1, totalCount: 0 };
  }
};

export const getBrapiQuote = async (ticker: string): Promise<Asset | null> => {
  try {
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
      tipo: result.symbol.includes('11') ? 'fundo' : 'acao',
      logo: result.logourl,
    };
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${ticker}:`, error);
    return null;
  }
};


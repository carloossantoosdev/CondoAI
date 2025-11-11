import { Asset, InvestmentType } from '@/types';
import { getBrapiAssets, getBrapiQuote } from './brapiService';
import { getBinanceAssets, getBinanceQuote } from './binanceService';
import { getAnbimaFunds, getAnbimaFundQuote } from './anbimaService';
import { getRendaFixaAssets, getRendaFixaQuote } from './openFinanceService';

export interface PaginatedAssets {
  assets: Asset[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

export const getAllAssets = async (page: number = 1): Promise<PaginatedAssets> => {
  try {
    // Para "Todos", vamos buscar múltiplas páginas de cada tipo
    // e combinar os resultados
    const itemsPerPage = 50;
    
    const [acoesData, cripto, fundos, rendaFixa] = await Promise.all([
      getBrapiAssets('all', page, itemsPerPage),
      getBinanceAssets(),
      getAnbimaFunds(),
      getRendaFixaAssets(),
    ]);

    const allAssets = [...acoesData.assets, ...cripto, ...fundos, ...rendaFixa];

    return {
      assets: allAssets,
      totalPages: acoesData.totalPages,
      totalCount: acoesData.totalCount + cripto.length + fundos.length + rendaFixa.length,
      currentPage: page,
    };
  } catch (error) {
    console.error('Erro ao buscar todos os ativos:', error);
    return { assets: [], totalPages: 1, totalCount: 0, currentPage: 1 };
  }
};

export const getAssetsByType = async (
  type: InvestmentType,
  page: number = 1
): Promise<PaginatedAssets> => {
  try {
    switch (type) {
      case 'acao': {
        const data = await getBrapiAssets('stock', page, 50);
        return {
          assets: data.assets,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
          currentPage: page,
        };
      }
      case 'fundo': {
        const fundos = await getAnbimaFunds();
        return {
          assets: fundos,
          totalPages: 1,
          totalCount: fundos.length,
          currentPage: 1,
        };
      }
      case 'rendaFixa': {
        const rendaFixa = await getRendaFixaAssets();
        return {
          assets: rendaFixa,
          totalPages: 1,
          totalCount: rendaFixa.length,
          currentPage: 1,
        };
      }
      case 'cripto': {
        const cripto = await getBinanceAssets();
        return {
          assets: cripto,
          totalPages: 1,
          totalCount: cripto.length,
          currentPage: 1,
        };
      }
      default:
        return { assets: [], totalPages: 1, totalCount: 0, currentPage: 1 };
    }
  } catch (error) {
    console.error(`Erro ao buscar ativos do tipo ${type}:`, error);
    return { assets: [], totalPages: 1, totalCount: 0, currentPage: 1 };
  }
};

export const getAssetQuote = async (ticker: string, type: InvestmentType): Promise<Asset | null> => {
  try {
    switch (type) {
      case 'acao':
        return await getBrapiQuote(ticker);
      case 'fundo':
        return await getAnbimaFundQuote(ticker);
      case 'rendaFixa':
        return await getRendaFixaQuote(ticker);
      case 'cripto':
        return await getBinanceQuote(ticker);
      default:
        return null;
    }
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${ticker}:`, error);
    return null;
  }
};


import { getAssetByTicker } from './investmentMockService';

export interface QuoteData {
  price: number;
  variation: number;
  ticker: string;
  name: string;
}

/**
 * Busca cotação de um ativo específico
 * Retorna dados mockados com pequena variação simulada
 */
export const getQuote = async (ticker: string): Promise<QuoteData | null> => {
  const asset = await getAssetByTicker(ticker);
  
  if (!asset) {
    return null;
  }
  
  return {
    price: asset.preco,
    variation: asset.variacao ?? 0,
    ticker: asset.ticker,
    name: asset.nome,
  };
};

/**
 * Busca múltiplas cotações de uma vez
 */
export const getMultipleQuotes = async (tickers: string[]): Promise<Record<string, QuoteData>> => {
  const quotes: Record<string, QuoteData> = {};
  
  for (const ticker of tickers) {
    const quote = await getQuote(ticker);
    if (quote) {
      quotes[ticker] = quote;
    }
  }
  
  return quotes;
};


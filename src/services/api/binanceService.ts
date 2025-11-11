import { Asset } from '@/types';

const BINANCE_BASE_URL = 'https://api.binance.com/api/v3';

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

const POPULAR_CRYPTOS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT',
  'XRPUSDT', 'DOTUSDT', 'UNIUSDT', 'LTCUSDT', 'LINKUSDT',
  'MATICUSDT', 'SOLUSDT', 'AVAXUSDT', 'ATOMUSDT'
];

export const getBinanceAssets = async (): Promise<Asset[]> => {
  try {
    const response = await fetch(`${BINANCE_BASE_URL}/ticker/24hr`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar criptomoedas da Binance');
    }

    const data: BinanceTicker[] = await response.json();
    
    // Filtrar apenas criptos populares em USDT
    const filtered = data
      .filter(ticker => POPULAR_CRYPTOS.includes(ticker.symbol))
      .map(ticker => ({
        ticker: ticker.symbol.replace('USDT', ''),
        nome: ticker.symbol.replace('USDT', ''),
        preco: parseFloat(ticker.lastPrice),
        variacao: parseFloat(ticker.priceChangePercent),
        tipo: 'cripto' as const,
      }));

    return filtered;
  } catch (error) {
    console.error('Erro ao buscar criptomoedas da Binance:', error);
    return [];
  }
};

export const getBinanceQuote = async (symbol: string): Promise<Asset | null> => {
  try {
    const ticker = symbol.includes('USDT') ? symbol : `${symbol}USDT`;
    const response = await fetch(`${BINANCE_BASE_URL}/ticker/24hr?symbol=${ticker}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar cotação de ${symbol}`);
    }

    const data: BinanceTicker = await response.json();

    return {
      ticker: data.symbol.replace('USDT', ''),
      nome: data.symbol.replace('USDT', ''),
      preco: parseFloat(data.lastPrice),
      variacao: parseFloat(data.priceChangePercent),
      tipo: 'cripto',
    };
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${symbol}:`, error);
    return null;
  }
};


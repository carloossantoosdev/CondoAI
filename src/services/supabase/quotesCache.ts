import { createClient } from '@/lib/supabase/client';

interface QuoteData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  lastUpdate: string;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

export async function getCachedQuote(ticker: string): Promise<QuoteData | null> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('quotes_cache')
      .select('*')
      .eq('ticker', ticker)
      .single();

    if (error || !data) {
      return null;
    }

    // Verificar se o cache ainda é válido
    const now = Date.now();
    if (now - data.timestamp > CACHE_DURATION) {
      return null;
    }

    return {
      ticker: data.ticker,
      price: data.price,
      change: data.change,
      changePercent: data.change_percent,
      volume: data.volume,
      lastUpdate: data.last_update,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error('Erro ao buscar cotação em cache:', error);
    return null;
  }
}

export async function setCachedQuote(ticker: string, quoteData: QuoteData): Promise<void> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('quotes_cache')
      .upsert({
        ticker: quoteData.ticker,
        price: quoteData.price,
        change: quoteData.change,
        change_percent: quoteData.changePercent,
        volume: quoteData.volume,
        last_update: quoteData.lastUpdate,
        timestamp: quoteData.timestamp,
      });

    if (error) {
      console.error('Erro ao salvar cotação em cache:', error);
    }
  } catch (error) {
    console.error('Erro ao salvar cotação em cache:', error);
  }
}


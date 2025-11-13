import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { getCachedQuote, setCachedQuote } from '@/services/supabase/quotesCache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  // Next.js 15+ requer await em params
  const { ticker } = await params;
  
  try {
    // Verificar cache primeiro
    const cached = await getCachedQuote(ticker);
    if (cached) {
      return NextResponse.json({
        ...cached,
        source: 'cache'
      });
    }

    // Tentar Yahoo Finance
    try {
      const tickerWithSuffix = ticker.endsWith('.SA') ? ticker : `${ticker}.SA`;
      // @ts-ignore - yahoo-finance2 types issue
      const quote = await yahooFinance.quote(tickerWithSuffix, {}, { validateResult: false });
      
      if (quote && quote.regularMarketPrice) {
        const quoteData = {
          ticker: ticker,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange || 0,
          changePercent: quote.regularMarketChangePercent || 0,
          volume: quote.regularMarketVolume,
          lastUpdate: new Date().toISOString(),
          timestamp: Date.now()
        };
        
        // Salvar no cache
        await setCachedQuote(ticker, quoteData);
        
        return NextResponse.json({
          ...quoteData,
          source: 'yahoo-finance'
        });
      }
    } catch (yahooError) {
      console.error(`Yahoo Finance falhou para ${ticker}:`, yahooError);
    }

    // Fallback: brapi.dev
    try {
      const apiKey = process.env.BRAPI_API_KEY || process.env.NEXT_PUBLIC_BRAPI_API_KEY || '';
      const brapiUrl = apiKey 
        ? `https://brapi.dev/api/quote/${ticker}?token=${apiKey}`
        : `https://brapi.dev/api/quote/${ticker}`;
      
      const response = await fetch(brapiUrl);
      
      if (response.ok) {
        const data = await response.json();
        const result = data.results?.[0];
        
        if (result) {
          const quoteData = {
            ticker: ticker,
            price: result.regularMarketPrice,
            change: result.regularMarketChange || 0,
            changePercent: result.regularMarketChangePercent || 0,
            volume: result.regularMarketVolume,
            lastUpdate: new Date().toISOString(),
            timestamp: Date.now()
          };
          
          // Salvar no cache
          await setCachedQuote(ticker, quoteData);
          
          return NextResponse.json({
            ...quoteData,
            source: 'brapi'
          });
        }
      }
    } catch (brapiError) {
      console.error(`brapi.dev falhou para ${ticker}:`, brapiError);
    }

    return NextResponse.json(
      { error: 'Cotação não encontrada' },
      { status: 404 }
    );
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${ticker}:`, error);
    return NextResponse.json(
      { error: 'Erro ao buscar cotação' },
      { status: 500 }
    );
  }
}


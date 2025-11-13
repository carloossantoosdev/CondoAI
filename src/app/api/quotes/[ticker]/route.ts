import { NextRequest, NextResponse } from 'next/server';
import { getCachedQuote, setCachedQuote } from '@/services/supabase/quotesCache';

const BRAPI_BASE_URL = 'https://brapi.dev/api';
const BRAPI_API_KEY = process.env.BRAPI_API_KEY || process.env.NEXT_PUBLIC_BRAPI_API_KEY || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  // Next.js 15+ requer await em params
  const { ticker } = await params;
  
  try {
    // 1. Verificar cache primeiro (validade: 5 minutos)
    const cached = await getCachedQuote(ticker);
    if (cached) {
      return NextResponse.json({
        ...cached,
        source: 'cache'
      });
    }

    // 2. Buscar da Brapi
    const brapiUrl = BRAPI_API_KEY 
      ? `${BRAPI_BASE_URL}/quote/${ticker}?token=${BRAPI_API_KEY}`
      : `${BRAPI_BASE_URL}/quote/${ticker}`;
    
    const response = await fetch(brapiUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Cotação não encontrada' },
        { status: 404 }
      );
    }

    const data = await response.json();
    const result = data.results?.[0];
    
    if (!result) {
      return NextResponse.json(
        { error: 'Cotação não encontrada' },
        { status: 404 }
      );
    }

    const quoteData = {
      ticker: ticker,
      price: result.regularMarketPrice || result.close || 0,
      change: result.regularMarketChange || 0,
      changePercent: result.regularMarketChangePercent || 0,
      volume: result.regularMarketVolume || 0,
      lastUpdate: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    // 3. Salvar no cache
    await setCachedQuote(ticker, quoteData);
    
    return NextResponse.json({
      ...quoteData,
      source: 'brapi'
    });

  } catch (error) {
    console.error(`Erro ao buscar cotação de ${ticker}:`, error);
    return NextResponse.json(
      { error: 'Erro ao buscar cotação' },
      { status: 500 }
    );
  }
}


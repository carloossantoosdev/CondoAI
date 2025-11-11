import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

interface Dividend {
  date: Date;
  value: number;
  ticker: string;
}

interface BrapiDividend {
  assetIssued: string;
  paymentDate: string;
  rate: number;
  relatedTo: string;
  approvedOn: string;
}

interface BrapiResponse {
  results: Array<{
    symbol: string;
    regularMarketPrice: number;
    dividendsData?: {
      cashDividends?: BrapiDividend[];
      subscriptions?: BrapiDividend[];
    };
  }>;
}

// Agente HTTPS que aceita certificados auto-assinados (para brapi.dev)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Cliente axios configurado
const axiosClient = axios.create({
  httpsAgent,
  timeout: 10000
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  // Next.js 15+ requer await em params
  const { ticker } = await params;
  
  try {
    // Buscar dados da brapi.dev (API brasileira especializada em B3)
    const apiKey = process.env.BRAPI_API_KEY || '';
    const url = apiKey 
      ? `https://brapi.dev/api/quote/${ticker}?dividends=true&token=${apiKey}`
      : `https://brapi.dev/api/quote/${ticker}?dividends=true`;
    
    // Log para debug
    console.log(`[DIVIDENDS API] Ticker: ${ticker}, API Key presente: ${apiKey ? 'Sim' : 'Não'}`);
    
    const response = await axiosClient.get<BrapiResponse>(url);
    
    if (!response.data) {
      throw new Error('Resposta vazia da brapi.dev');
    }
    
    const data = response.data;
    const result = data.results?.[0];
    
    if (!result) {
      throw new Error('Ativo não encontrado');
    }
    
    const currentPrice = result.regularMarketPrice || 0;
    const cashDividends = result.dividendsData?.cashDividends || [];
    const subscriptions = result.dividendsData?.subscriptions || [];
    
    // Combinar dividendos em dinheiro e subscrições
    const allDividends = [...cashDividends, ...subscriptions];
    
    // Mapear para formato interno
    const dividends: Dividend[] = allDividends
      .map(div => ({
        date: new Date(div.paymentDate),
        value: div.rate,
        ticker: ticker
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Mais recentes primeiro
    
    // Calcular yield dos últimos 12 meses
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const last12MonthsDividends = dividends.filter(
      d => d.date >= twelveMonthsAgo
    );
    
    const last12Months = last12MonthsDividends.reduce(
      (sum, d) => sum + d.value, 
      0
    );
    
    const dividendYield = currentPrice > 0 
      ? (last12Months / currentPrice) * 100 
      : 0;
    
    // Calcular total histórico
    const totalHistorical = dividends.reduce(
      (sum, d) => sum + d.value, 
      0
    );
    
    // Calcular média mensal
    const monthlyAverage = dividends.length > 0
      ? totalHistorical / Math.min(12, dividends.length)
      : 0;
    
    return NextResponse.json({
      ticker,
      dividends,
      summary: {
        last12Months,
        currentPrice,
        dividendYield,
        totalDividends: dividends.length,
        lastDividend: dividends[0] || null,
        monthlyAverage,
        totalHistorical
      },
      lastUpdate: new Date().toISOString(),
      message: dividends.length === 0 
        ? 'Nenhum dividendo encontrado para este ativo'
        : `${dividends.length} dividendo(s) encontrado(s)`
    });
    
  } catch (error) {
    console.error(`Erro ao buscar dividendos de ${ticker}:`, error);
    
    // Retornar 200 com dados vazios ao invés de 500
    return NextResponse.json({
      ticker,
      dividends: [],
      summary: {
        last12Months: 0,
        currentPrice: 0,
        dividendYield: 0,
        totalDividends: 0,
        lastDividend: null,
        monthlyAverage: 0,
        totalHistorical: 0
      },
      lastUpdate: new Date().toISOString(),
      message: error instanceof Error 
        ? error.message 
        : 'Erro ao buscar dados de dividendos'
    });
  }
}


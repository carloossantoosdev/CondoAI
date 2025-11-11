import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

interface Dividend {
  date: string;
  value: number;
}

interface BrapiQuoteResult {
  results?: Array<{
    symbol: string;
    regularMarketPrice: number;
    dividendsData?: {
      cashDividends?: Dividend[];
      stockDividends?: Dividend[];
    };
  }>;
}

// Cliente axios configurado para ignorar erros de SSL
const axiosClient = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

// Calcular Dividend Yield a partir dos dividendos dos últimos 12 meses
function calcularDividendYield(dividends: Dividend[], precoAtual: number): number {
  if (!dividends || dividends.length === 0 || precoAtual === 0) {
    return 0;
  }

  const umAnoAtras = new Date();
  umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);

  // Somar dividendos dos últimos 12 meses
  const totalDividendos = dividends
    .filter(div => new Date(div.date) >= umAnoAtras)
    .reduce((sum, div) => sum + div.value, 0);

  // DY = (Total Dividendos / Preço Atual) * 100
  return (totalDividendos / precoAtual) * 100;
}

// Função simples para calcular preço teto (método Bazin simplificado)
function calcularPrecoTeto(precoAtual: number, dividendYield: number): {
  precoTeto: number;
  recomendacao: string;
  desconto: number;
} {
  // Método Bazin: DY de 6% é ideal
  // Preço Teto = (DY atual / 6%) * Preço Atual
  const precoTeto = dividendYield > 0 
    ? (dividendYield / 6) * precoAtual 
    : precoAtual * 1.15; // Se não tem DY, usar 15% de margem
  
  const desconto = ((precoTeto - precoAtual) / precoTeto) * 100;
  
  let recomendacao = 'NEUTRO';
  if (desconto >= 20) recomendacao = 'COMPRA FORTE';
  else if (desconto >= 10) recomendacao = 'COMPRA';
  else if (desconto >= -10) recomendacao = 'MANTER';
  else recomendacao = 'VENDA';
  
  return { precoTeto, recomendacao, desconto };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  
  try {
    const apiKey = process.env.BRAPI_API_KEY || '';
    const url = apiKey
      ? `https://brapi.dev/api/quote/${ticker}?dividends=true&token=${apiKey}`
      : `https://brapi.dev/api/quote/${ticker}?dividends=true`;


    const response = await axiosClient.get(url);
    

    const data: BrapiQuoteResult = response.data;
    
    
    if (!data.results || data.results.length === 0) {
      throw new Error('Dados não encontrados na resposta');
    }

    const quote = data.results[0];
    const precoAtual = quote.regularMarketPrice || 0;
    
    
    // Calcular DY manualmente a partir dos dividendos históricos
    const cashDividends = quote.dividendsData?.cashDividends || [];
    
    const dividendYield = calcularDividendYield(cashDividends, precoAtual);
    const analise = calcularPrecoTeto(precoAtual, dividendYield);
    
    return NextResponse.json({
      ticker,
      precoAtual,
      dividendYield,
      ...analise,
      explicacao: `Baseado no método Bazin com DY calculado dos últimos 12 meses`
    });
    
  } catch (error) {
    return NextResponse.json({
      ticker,
      precoAtual: 0,
      dividendYield: 0,
      precoTeto: 0,
      recomendacao: 'SEM DADOS',
      desconto: 0,
      explicacao: 'Dados não disponíveis para este ativo'
    }, { status: 200 }); // Status 200 para não quebrar a UI
  }
}


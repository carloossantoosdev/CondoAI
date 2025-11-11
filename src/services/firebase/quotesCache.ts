import { collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export interface CachedQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  lastUpdate: string;
  timestamp: number;
}

export async function getCachedQuote(ticker: string): Promise<CachedQuote | null> {
  try {
    const docRef = doc(db, 'quotes', ticker);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const age = Date.now() - data.timestamp;
      
      // Verificar se o cache ainda é válido
      if (age < CACHE_DURATION) {
        return data.quote as CachedQuote;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Erro ao buscar cache de ${ticker}:`, error);
    return null;
  }
}

export async function setCachedQuote(ticker: string, quote: CachedQuote): Promise<void> {
  try {
    const docRef = doc(db, 'quotes', ticker);
    await setDoc(docRef, {
      quote,
      timestamp: Date.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error(`Erro ao salvar cache de ${ticker}:`, error);
  }
}

export async function clearQuoteCache(ticker?: string): Promise<void> {
  try {
    if (ticker) {
      const docRef = doc(db, 'quotes', ticker);
      await setDoc(docRef, {
        quote: null,
        timestamp: 0,
        updatedAt: Timestamp.now()
      });
    }
    // Se não especificar ticker, limpa todo o cache (implementar se necessário)
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
}


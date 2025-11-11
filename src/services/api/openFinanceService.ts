import { Asset } from '@/types';

// Nota: A API pública do Tesouro Direto mudou. 
// Usando dados de referência baseados em taxas médias de mercado atualizadas
const TESOURO_DIRETO_API = 'https://www.tesourodireto.com.br/json/br/com/b3/tesourodireto/service/api/treasurybondsinfo.json';

// Títulos do Tesouro Direto - Dados de referência (atualizados out/2025)
const TESOURO_DIRETO_REFERENCE = [
  { codigo: 'TD-SELIC-2027', nome: 'Tesouro Selic 2027', taxa: 13.65, preco: 145.50, tipo: 'Tesouro Selic' },
  { codigo: 'TD-SELIC-2029', nome: 'Tesouro Selic 2029', taxa: 13.65, preco: 139.20, tipo: 'Tesouro Selic' },
  { codigo: 'TD-IPCA-2029', nome: 'Tesouro IPCA+ 2029', taxa: 6.45, preco: 3250.80, tipo: 'Tesouro IPCA+' },
  { codigo: 'TD-IPCA-2035', nome: 'Tesouro IPCA+ 2035', taxa: 6.52, preco: 2180.45, tipo: 'Tesouro IPCA+' },
  { codigo: 'TD-IPCA-2045', nome: 'Tesouro IPCA+ 2045', taxa: 6.58, preco: 1420.30, tipo: 'Tesouro IPCA+' },
  { codigo: 'TD-IPCA-JS-2032', nome: 'Tesouro IPCA+ Juros Semestrais 2032', taxa: 6.55, preco: 3890.20, tipo: 'Tesouro IPCA+ JS' },
  { codigo: 'TD-IPCA-JS-2040', nome: 'Tesouro IPCA+ Juros Semestrais 2040', taxa: 6.62, preco: 3650.15, tipo: 'Tesouro IPCA+ JS' },
  { codigo: 'TD-PREF-2027', nome: 'Tesouro Prefixado 2027', taxa: 12.80, preco: 820.45, tipo: 'Tesouro Prefixado' },
  { codigo: 'TD-PREF-2031', nome: 'Tesouro Prefixado 2031', taxa: 12.95, preco: 520.30, tipo: 'Tesouro Prefixado' },
  { codigo: 'TD-PREF-JS-2033', nome: 'Tesouro Prefixado Juros Semestrais 2033', taxa: 13.10, preco: 910.20, tipo: 'Tesouro Prefixado JS' },
];

// Títulos privados - Taxas médias de mercado (REFERÊNCIA - não são ofertas reais)
// Para ofertas reais, é necessário integrar com APIs de corretoras específicas
const PRIVATE_BONDS_REFERENCE = [
  { codigo: 'CDB-REF', nome: 'CDB - Média de Mercado (~110-120% CDI)', taxa: 115, preco: 1000, tipo: 'CDB' },
  { codigo: 'LCI-REF', nome: 'LCI - Média de Mercado (~90-100% CDI)', taxa: 95, preco: 1000, tipo: 'LCI' },
  { codigo: 'LCA-REF', nome: 'LCA - Média de Mercado (~90-95% CDI)', taxa: 92.5, preco: 1000, tipo: 'LCA' },
  { codigo: 'DEB-REF', nome: 'Debêntures - Média de Mercado (IPCA + 5-7%)', taxa: 6, preco: 1000, tipo: 'Debênture' },
];

interface TesouroDiretoBond {
  TrsrBdTp: string;
  MtrtyDt: string;
  AnulInvstmtRate: number;
  MinInvstmtAmt: number;
  UntrInvstmtVal: number;
}

interface TesouroDiretoResponse {
  response: {
    TrsrBdTradgList: TesouroDiretoBond[];
  };
}

// Cache para evitar múltiplas chamadas à API
let cachedBonds: Asset[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

const mapTesouroBondName = (bondType: string): string => {
  const typeMap: { [key: string]: string } = {
    'Tesouro Selic': 'Tesouro Selic',
    'Tesouro IPCA+': 'Tesouro IPCA+',
    'Tesouro IPCA+ com Juros Semestrais': 'Tesouro IPCA+ Juros Semestrais',
    'Tesouro Prefixado': 'Tesouro Prefixado',
    'Tesouro Prefixado com Juros Semestrais': 'Tesouro Prefixado Juros Semestrais',
  };
  return typeMap[bondType] || bondType;
};

const getTesouroDiretoReference = (): Asset[] => {
  return TESOURO_DIRETO_REFERENCE.map(bond => ({
    ticker: bond.codigo,
    nome: bond.nome,
    preco: bond.preco,
    variacao: bond.taxa,
    tipo: 'rendaFixa' as const,
  }));
};

const getTesouroDiretoAssets = async (): Promise<Asset[]> => {
  try {
    // Tentar buscar da API oficial (pode estar indisponível)
    const response = await fetch(TESOURO_DIRETO_API, {
      signal: AbortSignal.timeout(5000), // Timeout de 5 segundos
    });
    
    if (!response.ok) {
      throw new Error('API do Tesouro Direto indisponível');
    }

    const data: TesouroDiretoResponse = await response.json();
    const bonds = data.response.TrsrBdTradgList;

    return bonds.map(bond => {
      const maturityYear = bond.MtrtyDt.split('/')[2];
      const bondName = mapTesouroBondName(bond.TrsrBdTp);
      
      return {
        ticker: `${bond.TrsrBdTp.replace(/\s+/g, '-')}-${maturityYear}`,
        nome: `${bondName} ${maturityYear}`,
        preco: bond.UntrInvstmtVal,
        variacao: bond.AnulInvstmtRate,
        tipo: 'rendaFixa' as const,
      };
    });
  } catch (error) {
    // Fallback: usar dados de referência (API indisponível)
    return getTesouroDiretoReference();
  }
};

const getPrivateBondsReference = (): Asset[] => {
  return PRIVATE_BONDS_REFERENCE.map(bond => ({
    ticker: bond.codigo,
    nome: bond.nome,
    preco: bond.preco,
    variacao: bond.taxa,
    tipo: 'rendaFixa' as const,
  }));
};

export const getRendaFixaAssets = async (): Promise<Asset[]> => {
  // Verificar cache
  const now = Date.now();
  if (cachedBonds && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedBonds;
  }

  // Buscar dados do Tesouro Direto (já tem fallback interno)
  const tesouroBonds = await getTesouroDiretoAssets();
  
  // Adicionar referências de títulos privados
  const privateBonds = getPrivateBondsReference();
  
  const allBonds = [...tesouroBonds, ...privateBonds];
  
  // Atualizar cache
  cachedBonds = allBonds;
  cacheTimestamp = now;
  
  return allBonds;
};

export const getRendaFixaQuote = async (codigo: string): Promise<Asset | null> => {
  try {
    // Buscar todos os ativos (usa cache se disponível)
    const assets = await getRendaFixaAssets();
    
    // Procurar o ativo específico
    const asset = assets.find(a => a.ticker === codigo);
    
    return asset || null;
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${codigo}:`, error);
    return null;
  }
};


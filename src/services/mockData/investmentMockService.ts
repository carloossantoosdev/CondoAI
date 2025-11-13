import { Asset, InvestmentType } from '@/types';

export interface PaginatedAssets {
  assets: Asset[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

// Dados mockados de ações brasileiras
const acoesData: Asset[] = [
  { ticker: 'PETR4', nome: 'Petrobras PN', preco: 38.45, variacao: 1.2, tipo: 'acao', logo: '' },
  { ticker: 'VALE3', nome: 'Vale ON', preco: 65.80, variacao: -0.8, tipo: 'acao', logo: '' },
  { ticker: 'ITUB4', nome: 'Itaú Unibanco PN', preco: 28.90, variacao: 0.5, tipo: 'acao', logo: '' },
  { ticker: 'BBDC4', nome: 'Bradesco PN', preco: 14.25, variacao: -1.3, tipo: 'acao', logo: '' },
  { ticker: 'ABEV3', nome: 'Ambev ON', preco: 12.55, variacao: 0.3, tipo: 'acao', logo: '' },
  { ticker: 'WEGE3', nome: 'WEG ON', preco: 42.30, variacao: 2.1, tipo: 'acao', logo: '' },
  { ticker: 'RENT3', nome: 'Localiza ON', preco: 56.70, variacao: 1.8, tipo: 'acao', logo: '' },
  { ticker: 'MGLU3', nome: 'Magazine Luiza ON', preco: 8.45, variacao: -2.5, tipo: 'acao', logo: '' },
  { ticker: 'BBAS3', nome: 'Banco do Brasil ON', preco: 25.80, variacao: 0.7, tipo: 'acao', logo: '' },
  { ticker: 'SUZB3', nome: 'Suzano ON', preco: 52.30, variacao: -0.9, tipo: 'acao', logo: '' },
  { ticker: 'B3SA3', nome: 'B3 ON', preco: 11.95, variacao: 1.5, tipo: 'acao', logo: '' },
  { ticker: 'VIVT3', nome: 'Telefônica Brasil ON', preco: 48.20, variacao: 0.4, tipo: 'acao', logo: '' },
  { ticker: 'ELET3', nome: 'Eletrobras ON', preco: 39.75, variacao: 1.1, tipo: 'acao', logo: '' },
  { ticker: 'RADL3', nome: 'Raia Drogasil ON', preco: 26.40, variacao: -0.6, tipo: 'acao', logo: '' },
  { ticker: 'RAIL3', nome: 'Rumo ON', preco: 19.85, variacao: 2.3, tipo: 'acao', logo: '' },
  { ticker: 'JBSS3', nome: 'JBS ON', preco: 32.10, variacao: -1.2, tipo: 'acao', logo: '' },
  { ticker: 'EMBR3', nome: 'Embraer ON', preco: 43.50, variacao: 3.2, tipo: 'acao', logo: '' },
  { ticker: 'CSAN3', nome: 'Cosan ON', preco: 18.75, variacao: 0.9, tipo: 'acao', logo: '' },
  { ticker: 'GGBR4', nome: 'Gerdau PN', preco: 22.60, variacao: -0.4, tipo: 'acao', logo: '' },
  { ticker: 'CIEL3', nome: 'Cielo ON', preco: 5.32, variacao: -1.8, tipo: 'acao', logo: '' },
  { ticker: 'CSNA3', nome: 'CSN ON', preco: 13.45, variacao: 1.6, tipo: 'acao', logo: '' },
  { ticker: 'KLBN11', nome: 'Klabin Units', preco: 24.30, variacao: 0.8, tipo: 'acao', logo: '' },
  { ticker: 'UGPA3', nome: 'Ultrapar ON', preco: 19.20, variacao: -0.5, tipo: 'acao', logo: '' },
  { ticker: 'LREN3', nome: 'Lojas Renner ON', preco: 15.80, variacao: 1.4, tipo: 'acao', logo: '' },
  { ticker: 'TOTS3', nome: 'TOTVS ON', preco: 29.50, variacao: 2.7, tipo: 'acao', logo: '' },
  { ticker: 'PETR3', nome: 'Petrobras ON', preco: 40.20, variacao: 1.0, tipo: 'acao', logo: '' },
  { ticker: 'CPFE3', nome: 'CPFL Energia ON', preco: 33.85, variacao: 0.6, tipo: 'acao', logo: '' },
  { ticker: 'EQTL3', nome: 'Equatorial ON', preco: 36.70, variacao: -0.3, tipo: 'acao', logo: '' },
  { ticker: 'TAEE11', nome: 'Taesa Units', preco: 35.40, variacao: 0.9, tipo: 'acao', logo: '' },
  { ticker: 'SANB11', nome: 'Santander Units', preco: 26.35, variacao: -0.7, tipo: 'acao', logo: '' },
  { ticker: 'PRIO3', nome: 'PRIO ON', preco: 44.80, variacao: 1.9, tipo: 'acao', logo: '' },
  { ticker: 'HAPV3', nome: 'Hapvida ON', preco: 3.85, variacao: -2.1, tipo: 'acao', logo: '' },
  { ticker: 'FLRY3', nome: 'Fleury ON', preco: 14.20, variacao: 0.2, tipo: 'acao', logo: '' },
  { ticker: 'QUAL3', nome: 'Qualicorp ON', preco: 7.45, variacao: -1.5, tipo: 'acao', logo: '' },
  { ticker: 'MULT3', nome: 'Multiplan ON', preco: 24.90, variacao: 1.3, tipo: 'acao', logo: '' },
  { ticker: 'YDUQ3', nome: 'Yduqs ON', preco: 16.55, variacao: 0.7, tipo: 'acao', logo: '' },
  { ticker: 'COGN3', nome: 'Cogna ON', preco: 1.95, variacao: -3.2, tipo: 'acao', logo: '' },
  { ticker: 'SBSP3', nome: 'Sabesp ON', preco: 89.30, variacao: 2.5, tipo: 'acao', logo: '' },
  { ticker: 'RECV3', nome: 'PetroReconcavo ON', preco: 21.70, variacao: 1.8, tipo: 'acao', logo: '' },
  { ticker: 'CYRE3', nome: 'Cyrela ON', preco: 19.40, variacao: -0.8, tipo: 'acao', logo: '' },
  { ticker: 'MRFG3', nome: 'Marfrig ON', preco: 8.90, variacao: 0.6, tipo: 'acao', logo: '' },
  { ticker: 'PCAR3', nome: 'GPA ON', preco: 4.55, variacao: -1.9, tipo: 'acao', logo: '' },
  { ticker: 'BPAC11', nome: 'BTG Pactual Units', preco: 34.20, variacao: 1.7, tipo: 'acao', logo: '' },
  { ticker: 'AZUL4', nome: 'Azul PN', preco: 6.75, variacao: -2.8, tipo: 'acao', logo: '' },
  { ticker: 'GOLL4', nome: 'Gol PN', preco: 3.20, variacao: -4.5, tipo: 'acao', logo: '' },
  { ticker: 'BRFS3', nome: 'BRF ON', preco: 17.85, variacao: 0.5, tipo: 'acao', logo: '' },
  { ticker: 'NTCO3', nome: 'Natura ON', preco: 14.30, variacao: -1.4, tipo: 'acao', logo: '' },
  { ticker: 'SULA11', nome: 'Sul América Units', preco: 28.60, variacao: 0.8, tipo: 'acao', logo: '' },
  { ticker: 'ENEV3', nome: 'Eneva ON', preco: 12.40, variacao: 1.2, tipo: 'acao', logo: '' },
  { ticker: 'SOMA3', nome: 'Grupo Soma ON', preco: 7.20, variacao: -0.9, tipo: 'acao', logo: '' },
];

// Dados mockados de FIIs
const fundosData: Asset[] = [
  { ticker: 'MXRF11', nome: 'Maxi Renda FII', preco: 10.25, variacao: 0.3, tipo: 'fundo', logo: '' },
  { ticker: 'HGLG11', nome: 'CSHG Logística FII', preco: 182.50, variacao: -0.5, tipo: 'fundo', logo: '' },
  { ticker: 'VISC11', nome: 'Vinci Shopping Centers FII', preco: 9.80, variacao: 0.7, tipo: 'fundo', logo: '' },
  { ticker: 'KNRI11', nome: 'Kinea Renda Imobiliária FII', preco: 145.30, variacao: 0.4, tipo: 'fundo', logo: '' },
  { ticker: 'XPML11', nome: 'XP Malls FII', preco: 108.75, variacao: -0.2, tipo: 'fundo', logo: '' },
  { ticker: 'BCFF11', nome: 'BTG Pactual Fundo de Fundos FII', preco: 82.40, variacao: 0.6, tipo: 'fundo', logo: '' },
  { ticker: 'HGRE11', nome: 'CSHG Real Estate FII', preco: 130.90, variacao: 0.8, tipo: 'fundo', logo: '' },
  { ticker: 'KNCR11', nome: 'Kinea Rendimentos Imobiliários FII', preco: 96.20, variacao: -0.3, tipo: 'fundo', logo: '' },
  { ticker: 'BRCO11', nome: 'Bresco Logística FII', preco: 74.85, variacao: 0.5, tipo: 'fundo', logo: '' },
  { ticker: 'PVBI11', nome: 'Vbi Prime Properties FII', preco: 98.50, variacao: 0.2, tipo: 'fundo', logo: '' },
  { ticker: 'BTLG11', nome: 'BTG Pactual Logística FII', preco: 105.30, variacao: -0.4, tipo: 'fundo', logo: '' },
  { ticker: 'TRXF11', nome: 'TRX Real Estate FII', preco: 89.70, variacao: 0.9, tipo: 'fundo', logo: '' },
  { ticker: 'RZTR11', nome: 'Riza Terrax FII', preco: 78.20, variacao: -0.6, tipo: 'fundo', logo: '' },
  { ticker: 'GGRC11', nome: 'GGR Covepi Renda FII', preco: 92.45, variacao: 0.3, tipo: 'fundo', logo: '' },
  { ticker: 'RECT11', nome: 'Recebíveis Imobiliários FII', preco: 97.80, variacao: 0.1, tipo: 'fundo', logo: '' },
];

// Dados mockados de criptomoedas
const criptoData: Asset[] = [
  { ticker: 'BTC', nome: 'Bitcoin', preco: 485000, variacao: 2.4, tipo: 'cripto', logo: '' },
  { ticker: 'ETH', nome: 'Ethereum', preco: 18200, variacao: 3.1, tipo: 'cripto', logo: '' },
  { ticker: 'BNB', nome: 'Binance Coin', preco: 3150, variacao: 1.8, tipo: 'cripto', logo: '' },
  { ticker: 'ADA', nome: 'Cardano', preco: 2.85, variacao: -0.9, tipo: 'cripto', logo: '' },
  { ticker: 'SOL', nome: 'Solana', preco: 1025, variacao: 4.2, tipo: 'cripto', logo: '' },
  { ticker: 'XRP', nome: 'Ripple', preco: 3.20, variacao: -1.5, tipo: 'cripto', logo: '' },
  { ticker: 'DOT', nome: 'Polkadot', preco: 38.50, variacao: 2.7, tipo: 'cripto', logo: '' },
  { ticker: 'DOGE', nome: 'Dogecoin', preco: 0.52, variacao: -2.3, tipo: 'cripto', logo: '' },
  { ticker: 'MATIC', nome: 'Polygon', preco: 4.15, variacao: 1.6, tipo: 'cripto', logo: '' },
  { ticker: 'AVAX', nome: 'Avalanche', preco: 195, variacao: 3.8, tipo: 'cripto', logo: '' },
  { ticker: 'UNI', nome: 'Uniswap', preco: 52.30, variacao: 0.7, tipo: 'cripto', logo: '' },
  { ticker: 'LINK', nome: 'Chainlink', preco: 78.90, variacao: -0.4, tipo: 'cripto', logo: '' },
  { ticker: 'ATOM', nome: 'Cosmos', preco: 42.60, variacao: 1.2, tipo: 'cripto', logo: '' },
  { ticker: 'LTC', nome: 'Litecoin', preco: 465, variacao: -0.8, tipo: 'cripto', logo: '' },
];

// Dados mockados de Renda Fixa
const rendaFixaData: Asset[] = [
  { ticker: 'SELIC', nome: 'Tesouro Selic 2027', preco: 15240.50, variacao: 0.1, tipo: 'rendaFixa', logo: '' },
  { ticker: 'IPCA26', nome: 'Tesouro IPCA+ 2026', preco: 3820.75, variacao: 0.2, tipo: 'rendaFixa', logo: '' },
  { ticker: 'IPCA29', nome: 'Tesouro IPCA+ 2029', preco: 3565.30, variacao: 0.3, tipo: 'rendaFixa', logo: '' },
  { ticker: 'IPCA35', nome: 'Tesouro IPCA+ 2035', preco: 2890.40, variacao: 0.2, tipo: 'rendaFixa', logo: '' },
  { ticker: 'IPCA45', nome: 'Tesouro IPCA+ 2045', preco: 1650.20, variacao: 0.4, tipo: 'rendaFixa', logo: '' },
  { ticker: 'PRE26', nome: 'Tesouro Prefixado 2026', preco: 8920.60, variacao: 0.1, tipo: 'rendaFixa', logo: '' },
  { ticker: 'PRE29', nome: 'Tesouro Prefixado 2029', preco: 7540.30, variacao: 0.2, tipo: 'rendaFixa', logo: '' },
  { ticker: 'IPCAJ29', nome: 'Tesouro IPCA+ com Juros Semestrais 2029', preco: 3780.90, variacao: 0.3, tipo: 'rendaFixa', logo: '' },
  { ticker: 'IPCAJ35', nome: 'Tesouro IPCA+ com Juros Semestrais 2035', preco: 3420.50, variacao: 0.2, tipo: 'rendaFixa', logo: '' },
  { ticker: 'IPCAJ40', nome: 'Tesouro IPCA+ com Juros Semestrais 2040', preco: 3120.75, variacao: 0.4, tipo: 'rendaFixa', logo: '' },
];

// Função para adicionar variação aleatória aos preços (simular mercado)
const addRandomVariation = (price: number, currentVariation?: number): { preco: number; variacao: number } => {
  const randomChange = (Math.random() - 0.5) * 0.02; // -1% a +1%
  const newPrice = price * (1 + randomChange);
  const baseVariation = currentVariation ?? 0;
  const newVariation = baseVariation + (randomChange * 100);
  
  return {
    preco: Number(newPrice.toFixed(2)),
    variacao: Number(newVariation.toFixed(2))
  };
};

/**
 * Busca todos os ativos (simulado com dados mockados)
 */
export const getAllAssets = async (page: number = 1): Promise<PaginatedAssets> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const itemsPerPage = 50;
  const allAssets = [...acoesData, ...fundosData, ...criptoData, ...rendaFixaData];
  
  // Adicionar pequena variação aos preços
  const assetsWithVariation = allAssets.map(asset => {
    const variation = addRandomVariation(asset.preco, asset.variacao);
    return { ...asset, ...variation };
  });
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = assetsWithVariation.slice(startIndex, endIndex);
  
  return {
    assets: paginatedAssets,
    totalPages: Math.ceil(allAssets.length / itemsPerPage),
    totalCount: allAssets.length,
    currentPage: page,
  };
};

/**
 * Busca ativos por tipo
 */
export const getAssetsByType = async (
  type: InvestmentType,
  page: number = 1
): Promise<PaginatedAssets> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const itemsPerPage = 50;
  let assets: Asset[] = [];
  
  switch (type) {
    case 'acao':
      assets = [...acoesData];
      break;
    case 'fundo':
      assets = [...fundosData];
      break;
    case 'cripto':
      assets = [...criptoData];
      break;
    case 'rendaFixa':
      assets = [...rendaFixaData];
      break;
    default:
      assets = [];
  }
  
  // Adicionar pequena variação aos preços
  const assetsWithVariation = assets.map(asset => {
    const variation = addRandomVariation(asset.preco, asset.variacao);
    return { ...asset, ...variation };
  });
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = assetsWithVariation.slice(startIndex, endIndex);
  
  return {
    assets: paginatedAssets,
    totalPages: Math.ceil(assets.length / itemsPerPage),
    totalCount: assets.length,
    currentPage: page,
  };
};

/**
 * Busca um ativo específico por ticker
 */
export const getAssetByTicker = async (ticker: string): Promise<Asset | null> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allAssets = [...acoesData, ...fundosData, ...criptoData, ...rendaFixaData];
  const asset = allAssets.find(a => a.ticker.toLowerCase() === ticker.toLowerCase());
  
  if (!asset) return null;
  
  // Adicionar pequena variação ao preço
  const variation = addRandomVariation(asset.preco, asset.variacao);
  return { ...asset, ...variation };
};


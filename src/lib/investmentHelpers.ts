import { RiskProfile, RiskProfileValue, InvestmentType } from '@/types';

/**
 * Mapeamento de perfis de risco para tipos de investimento compatíveis
 */
export const PERFIL_INVESTIMENTOS: Record<RiskProfileValue, InvestmentType[]> = {
  conservador: ['rendaFixa'],
  moderado: ['rendaFixa', 'fundo', 'acao'],
  arrojado: ['rendaFixa', 'fundo', 'acao', 'cripto'],
};

/**
 * Informações sobre cada perfil de risco
 */
export const profileInfo: Record<RiskProfileValue, { title: string; color: string; description: string; emoji: string }> = {
  conservador: {
    title: 'Conservador',
    color: 'blue',
    description: 'Você prioriza segurança e prefere investimentos de baixo risco como renda fixa.',
    emoji: '🛡️',
  },
  moderado: {
    title: 'Moderado',
    color: 'orange',
    description: 'Você busca equilíbrio entre segurança e rentabilidade, aceitando riscos moderados.',
    emoji: '📈',
  },
  arrojado: {
    title: 'Arrojado',
    color: 'red',
    description: 'Você busca máxima rentabilidade e aceita riscos elevados em busca de maiores retornos.',
    emoji: '⚡',
  },
};

/**
 * Retorna o perfil efetivo do usuário (usa 'conservador' como padrão se null)
 */
export function getEffectiveProfile(userProfile: RiskProfile): RiskProfileValue {
  return userProfile || 'conservador';
}

/**
 * Verifica se um tipo de investimento é compatível com o perfil de risco do usuário
 */
export function isInvestmentCompatible(
  investmentType: InvestmentType,
  userProfile: RiskProfile
): boolean {
  const effectiveProfile = getEffectiveProfile(userProfile);
  const allowedTypes = PERFIL_INVESTIMENTOS[effectiveProfile];
  return allowedTypes.includes(investmentType);
}


/**
 * Retorna o nome legível do tipo de investimento
 */
export function getInvestmentTypeName(type: InvestmentType): string {
  const names: Record<InvestmentType, string> = {
    acao: 'Ação',
    fundo: 'Fundo',
    rendaFixa: 'Renda Fixa',
    cripto: 'Criptomoeda',
  };
  return names[type];
}

/**
 * Retorna o emoji correspondente ao tipo de investimento
 */
export function getInvestmentTypeEmoji(type: InvestmentType): string {
  const emojis: Record<InvestmentType, string> = {
    acao: '📊',
    fundo: '📈',
    rendaFixa: '🏦',
    cripto: '₿',
  };
  return emojis[type];
}

/**
 * Filtra tipos de investimento disponíveis baseado no perfil
 */
export function getAvailableInvestmentTypes(
  userProfile: RiskProfile,
  includeAll: boolean = false
): InvestmentType[] {
  if (includeAll) {
    return ['acao', 'fundo', 'rendaFixa', 'cripto'];
  }
  
  const effectiveProfile = getEffectiveProfile(userProfile);
  return PERFIL_INVESTIMENTOS[effectiveProfile];
}

/**
 * Gera recomendações mockadas baseadas no perfil (será substituído por IA real)
 */
export function getMockedRecommendations(userProfile: RiskProfile) {
  const effectiveProfile = getEffectiveProfile(userProfile);
  const recommendations: Record<RiskProfileValue, Array<{ ticker: string; tipo: InvestmentType; razao: string; confianca: string; preco: number }>> = {
    conservador: [
      {
        ticker: 'TESOURO SELIC 2027',
        tipo: 'rendaFixa' as InvestmentType,
        razao: 'Baixo risco, liquidez diária, rendimento de 13,65% a.a.',
        confianca: 'alta',
        preco: 100,
      },
      {
        ticker: 'CDB XP 120% CDI',
        tipo: 'rendaFixa' as InvestmentType,
        razao: 'Rendimento garantido, proteção FGC até R$ 250 mil',
        confianca: 'alta',
        preco: 1000,
      },
      {
        ticker: 'LCA ITAÚ',
        tipo: 'rendaFixa' as InvestmentType,
        razao: 'Isento de IR, liquidez em 90 dias, 110% CDI',
        confianca: 'média',
        preco: 5000,
      },
    ],
    moderado: [
      {
        ticker: 'VALE3',
        tipo: 'acao' as InvestmentType,
        razao: 'Empresa sólida, bom histórico de dividendos, preço atrativo',
        confianca: 'alta',
        preco: 62.5,
      },
      {
        ticker: 'ITSA4',
        tipo: 'acao' as InvestmentType,
        razao: 'Holding diversificada, dividendos consistentes',
        confianca: 'alta',
        preco: 9.8,
      },
      {
        ticker: 'HGLG11',
        tipo: 'fundo' as InvestmentType,
        razao: 'FII com bom dividend yield e gestão reconhecida',
        confianca: 'média',
        preco: 158.0,
      },
    ],
    arrojado: [
      {
        ticker: 'BTC',
        tipo: 'cripto' as InvestmentType,
        razao: 'Principal criptomoeda, momento de consolidação após halving',
        confianca: 'média',
        preco: 350000,
      },
      {
        ticker: 'MGLU3',
        tipo: 'acao' as InvestmentType,
        razao: 'Growth stock em recuperação, potencial de valorização',
        confianca: 'média',
        preco: 8.45,
      },
      {
        ticker: 'ETH',
        tipo: 'cripto' as InvestmentType,
        razao: 'Ethereum com staking, ecossistema DeFi em crescimento',
        confianca: 'alta',
        preco: 19000,
      },
    ],
  };

  return recommendations[effectiveProfile] || recommendations.conservador;
}


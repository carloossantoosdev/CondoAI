'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { Lightbulb, TrendingUp, Shield, Target, BookOpen, Calculator } from 'lucide-react';

const tips = [
  {
    icon: Calculator,
    title: 'O que é Preço Teto (Método Bazin)?',
    category: 'Análise de Ações',
    content: [
      'O Preço Teto é o preço máximo que você deveria pagar por uma ação segundo o método Bazin. Ele é calculado com base no Dividend Yield (DY) da ação.',
      'Regra: Só compre ações que pagam pelo menos 6% de DY ao ano. Se a ação paga menos que isso, o preço está caro. Se paga mais, está barato!'
    ],
    example: {
      title: 'Exemplo Prático:',
      items: [
        'Ação custa R$ 40,00',
        'Paga R$ 3,00 de dividendos/ano',
        'DY = 3,00 ÷ 40 = 7,5%',
        'Preço Teto = R$ 50,00 (baseado em 6% DY)',
        '✅ COMPRA! Está abaixo do teto'
      ]
    },
    tip: 'Na página de Investimentos, veja o Preço Teto calculado automaticamente para cada ação!'
  },
  {
    icon: TrendingUp,
    title: 'Diversificação: A Regra de Ouro',
    category: 'Estratégia',
    content: [
      'Nunca coloque todos os ovos na mesma cesta! A diversificação é essencial para reduzir riscos.',
      'Distribua seus investimentos entre diferentes tipos de ativos: ações, fundos imobiliários, renda fixa e até criptomoedas.'
    ],
    example: {
      title: 'Exemplo de Portfólio Equilibrado:',
      items: [
        '40% - Renda Fixa (Tesouro, CDB)',
        '30% - Ações',
        '20% - Fundos Imobiliários',
        '10% - Reserva de Emergência'
      ]
    },
    tip: 'Reavalie sua carteira a cada 3-6 meses para manter o equilíbrio!'
  },
  {
    icon: Shield,
    title: 'Reserva de Emergência',
    category: 'Fundamentos',
    content: [
      'Antes de investir, tenha uma reserva de emergência equivalente a 6-12 meses das suas despesas mensais.',
      'Essa reserva deve estar em aplicações de alta liquidez, como poupança ou CDB com liquidez diária.'
    ],
    example: {
      title: 'Calculando sua Reserva:',
      items: [
        'Despesas mensais: R$ 3.000',
        'Reserva ideal (6 meses): R$ 18.000',
        'Reserva conservadora (12 meses): R$ 36.000'
      ]
    },
    tip: 'Só comece a investir em renda variável depois de ter sua reserva completa!'
  },
  {
    icon: Target,
    title: 'Juros Compostos: O Poder do Tempo',
    category: 'Conceitos',
    content: [
      'Albert Einstein chamou os juros compostos de "a oitava maravilha do mundo". É o juro sobre juro!',
      'Quanto mais cedo você começar a investir, mais seus rendimentos vão se multiplicar ao longo do tempo.'
    ],
    example: {
      title: 'O Impacto do Tempo:',
      items: [
        'Investindo R$ 500/mês por 30 anos a 10% a.a.',
        'Valor investido: R$ 180.000',
        'Valor final: R$ 1.130.000+',
        'Lucro: R$ 950.000+ (apenas com juros compostos!)'
      ]
    },
    tip: 'Comece hoje, mesmo que seja com pouco. O tempo é seu maior aliado!'
  },
  {
    icon: BookOpen,
    title: 'Estude Antes de Investir',
    category: 'Educação',
    content: [
      'Nunca invista em algo que você não entende. Dedique tempo para estudar sobre os ativos que você deseja investir.',
      'Leia livros, assista vídeos educativos, acompanhe analistas sérios e aprenda constantemente.'
    ],
    example: {
      title: 'Livros Recomendados:',
      items: [
        '📚 "Pai Rico, Pai Pobre" - Robert Kiyosaki',
        '📚 "O Investidor Inteligente" - Benjamin Graham',
        '📚 "Os Segredos da Mente Milionária" - T. Harv Eker',
        '📚 "Faça Fortuna com Ações" - Décio Bazin'
      ]
    },
    tip: 'Invista em educação financeira antes de investir em ativos!'
  }
];

export default function DicasPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loading size="lg" />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-orange-500" />
            Dicas Educativas
          </h1>
          <p className="text-slate-600">
            Aprenda conceitos importantes para investir com segurança e inteligência
          </p>
        </div>

        {/* Dicas */}
        <div className="grid gap-6">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <Card 
                key={index} 
                className="border-orange-200 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                          {tip.category}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{tip.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Conteúdo */}
                  <div className="space-y-3">
                    {tip.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-slate-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Exemplo */}
                  <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-4">
                      <p className="text-sm font-semibold text-slate-900 mb-3">
                        {tip.example.title}
                      </p>
                      <div className="text-sm text-slate-700 space-y-1.5">
                        {tip.example.items.map((item, iIndex) => (
                          <p key={iIndex} className="flex items-start gap-2">
                            <span className="text-orange-500 font-bold shrink-0">•</span>
                            <span>{item}</span>
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dica Extra */}
                  <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-900">
                      <strong>Dica:</strong> {tip.tip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-br from-orange-500 to-amber-500 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">
              Continue Aprendendo! 📚
            </h3>
            <p className="text-white/90 mb-4 max-w-2xl mx-auto">
              O conhecimento é o seu maior ativo. Quanto mais você aprende sobre investimentos, 
              melhores decisões você toma e maiores são seus retornos!
            </p>
            <p className="text-sm text-white/80 italic">
              "O investimento em conhecimento rende sempre os melhores juros" - Benjamin Franklin
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}


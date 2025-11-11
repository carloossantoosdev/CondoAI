# 💰 Investment Platform

Uma plataforma simplificada de investimentos construída com Next.js 16, Firebase e Material UI para fins educacionais.

> **📚 Projeto Acadêmico**: Este projeto foi simplificado para facilitar apresentações e explicações em ambiente acadêmico.

## 🚀 Funcionalidades Core

- ✅ **Autenticação** - Login seguro via Firebase Auth
- ✅ **Dashboard** - Visão geral do portfólio com métricas
- ✅ **Investimentos** - Compra/venda de ações, FIIs, cripto e renda fixa
- ✅ **Dividendos** - Projeções e histórico de proventos
- ✅ **APIs Reais** - Dados em tempo real do mercado brasileiro
- ✅ **Planos** - Sistema de monetização com Stripe
- ✅ **Contato** - Agendamento com gestora

## 🛠️ Tecnologias

- **Frontend**: Next.js 16 + TypeScript + React 19
- **UI**: Material UI v6
- **Autenticação**: Firebase Auth
- **Banco de Dados**: Firebase Firestore
- **Pagamentos**: Stripe
- **Gráficos**: Recharts
- **APIs**: brapi.dev (ações), Binance (cripto)

## 📦 Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>

# Instale as dependências
npm install

# Configure as variáveis de ambiente (veja SETUP.md)
cp .env.example .env.local

# Execute em desenvolvimento
npm run dev
```

## 🔧 Configuração

Consulte o arquivo [SETUP.md](./SETUP.md) para instruções detalhadas de configuração do Firebase e Stripe.

## 📁 Estrutura Simplificada

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── dashboard/         # Dashboard principal
│   ├── investimentos/     # Compra/venda de ativos
│   ├── dividendos/        # Projeções de dividendos
│   ├── planos/            # Planos e assinatura
│   ├── contato/           # Contato com gestora
│   ├── login/             # Autenticação
│   └── api/               # API routes
│       ├── dividends/     # API de dividendos
│       ├── quotes/        # API de cotações
│       └── stripe/        # API de pagamentos
├── components/            # Componentes React
│   ├── layout/           # Layout e navegação
│   └── DividendsSummary.tsx
├── context/              # Contextos React
│   └── AuthContext.tsx   # Autenticação global
├── services/             # Serviços e integrações
│   ├── firebase/        # Firebase (auth + firestore)
│   ├── stripe/          # Stripe (pagamentos)
│   └── api/             # APIs externas
│       ├── brapiService.ts      # Ações BR
│       ├── binanceService.ts    # Criptomoedas
│       ├── anbimaService.ts     # FIIs
│       └── openFinanceService.ts # Renda fixa
└── types/               # TypeScript types
```

> **📖 Documentação Completa**: Veja [ARQUITETURA.md](./ARQUITETURA.md) para explicação detalhada

## 🎨 Páginas

### Públicas
- `/` - Homepage
- `/login` - Autenticação via Firebase

### Protegidas (requer login)
- `/dashboard` - Visão geral da carteira
- `/investimentos` - Compra/venda de ativos
- `/dividendos` - Projeções e histórico
- `/planos` - Assinaturas PRO

### Exclusivas PRO
- `/contato` - Agendamento com gestora

## 🔐 Segurança

- Autenticação via Firebase Auth
- Regras de segurança no Firestore
- Rotas protegidas por middleware
- Validação de assinatura em tempo real
- Webhooks seguros do Stripe

## 📊 APIs Utilizadas

- **brapi.dev** - Ações e FIIs brasileiros (B3) + Dividendos
- **Binance API** - Criptomoedas em tempo real
- **Tesouro Direto** - Títulos públicos (renda fixa)

> **💡 Dica**: Configure a variável `BRAPI_API_KEY` no `.env.local` para dados completos de dividendos

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada commit

### Outras plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- AWS Amplify
- Google Cloud Run
- Railway
- Fly.io

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📚 Documentação Adicional

- **[ARQUITETURA.md](./ARQUITETURA.md)** - Explicação detalhada da arquitetura e conceitos
- **[GUIA_APRESENTACAO.md](./GUIA_APRESENTACAO.md)** - Roteiro completo para apresentação
- **[CHANGELOG_SIMPLIFICACAO.md](./CHANGELOG_SIMPLIFICACAO.md)** - Histórico de simplificações
- **[BRAPI_API_KEY.md](./BRAPI_API_KEY.md)** - Como obter chave da API brapi.dev

## 📧 Recursos de Aprendizado

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Firebase](https://firebase.google.com/docs)
- [Documentação do Stripe](https://stripe.com/docs)
- [Material UI Docs](https://mui.com/)
- [brapi.dev Docs](https://brapi.dev/docs)

---

**Desenvolvido para fins educacionais** 🎓

Projeto simplificado para facilitar apresentações acadêmicas mantendo todas as funcionalidades essenciais.


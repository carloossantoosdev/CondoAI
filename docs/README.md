# 📚 Documentação - Plataforma de Investimentos

Bem-vindo à documentação completa da **Plataforma de Investimentos**! Esta documentação foi criada para ajudar iniciantes a entender como o projeto funciona, desde o básico do Next.js até cada tela da aplicação.

---

## 🎯 Objetivo

Explicar de forma simples e didática como funciona cada parte da aplicação, com foco especial no sistema de rotas do Next.js 15 (App Router) e nas funcionalidades de cada tela.

---

## 📖 Índice da Documentação

### 🔰 Comece aqui!

#### [00 - Introdução ao Next.js App Router](./00-INTRODUCAO-NEXTJS.md)
**O que você vai aprender:**
- O que é Next.js e por que usamos
- Como funciona o sistema de rotas baseado em pastas
- Diferença entre páginas (`page.tsx`) e rotas de API (`route.ts`)
- Server Components vs Client Components (`'use client'`)
- Parâmetros dinâmicos em rotas `[ticker]`
- Como as rotas se transformam em URLs

**📌 Leia este primeiro se você é iniciante!**

---

### 🔐 Telas da Aplicação

#### [01 - Tela de Login](./01-LOGIN.md)
**Funcionalidade:** Autenticação de usuários

**O que você vai aprender:**
- Como funciona a autenticação com Google/Firebase
- Fluxo de login e redirecionamento
- Context API para gerenciar estado do usuário
- Proteção de rotas
- Componentes Material-UI

**Rota:** `/login`

---

#### [02 - Tela de Investimentos](./02-INVESTIMENTOS.md)
**Funcionalidade:** Explorar e investir em ativos

**O que você vai aprender:**
- Listar e filtrar ativos (Ações, Fundos, Renda Fixa, Cripto)
- Sistema de paginação híbrida (servidor + cliente)
- API de análise fundamentalista (Método Bazin)
- Cálculo de preço teto baseado em dividendos
- Modal de investimento
- Integração com Firebase para salvar investimentos

**Rota:** `/investimentos`

**APIs utilizadas:**
- `/api/fundamentals/[ticker]` - Análise de preço teto

---

#### [03 - Tela de Dividendos](./03-DIVIDENDOS.md)
**Funcionalidade:** Acompanhar proventos recebidos e projeções

**O que você vai aprender:**
- Histórico de dividendos recebidos
- Projeções de dividendos futuros
- Cálculo de Dividend Yield
- Filtro por data de compra
- Cards de resumo e tabelas

**Rota:** `/dividendos`

**APIs utilizadas:**
- `/api/dividends/[ticker]` - Histórico de dividendos

---

#### [04 - Tela de Dashboard](./04-DASHBOARD.md)
**Funcionalidade:** Visão geral da carteira

**O que você vai aprender:**
- Cálculo de valor total da carteira
- Lucro/Prejuízo e rentabilidade
- Gráfico de distribuição (Recharts)
- Busca de cotações atualizadas
- Sistema de cache
- Feed de notícias do mercado
- Seção educativa

**Rota:** `/dashboard`

**APIs utilizadas:**
- `/api/quotes/[ticker]` - Cotações atualizadas
- `/api/news` - Notícias do mercado

---

## 🗺️ Mapa de Navegação

```
/login (Tela de Login)
   ↓
   [Usuário faz login com Google]
   ↓
/dashboard (Dashboard) ← Página inicial após login
   │
   ├─→ /investimentos (Tela de Investimentos)
   │      │
   │      └─→ Investir em ativo → Salvo no Firebase
   │
   ├─→ /dividendos (Tela de Dividendos)
   │      │
   │      └─→ Ver proventos recebidos e projeções
   │
   └─→ /dashboard (Voltar para visão geral)
```

---

## 🏗️ Estrutura do Projeto

```
src/
├── app/                          # Rotas do Next.js (App Router)
│   ├── page.tsx                  # Página inicial (/)
│   ├── login/
│   │   └── page.tsx              # Tela de login (/login)
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard (/dashboard)
│   ├── investimentos/
│   │   └── page.tsx              # Investimentos (/investimentos)
│   ├── dividendos/
│   │   └── page.tsx              # Dividendos (/dividendos)
│   │
│   └── api/                      # Rotas de API (Backend)
│       ├── fundamentals/
│       │   └── [ticker]/
│       │       └── route.ts      # Análise fundamentalista
│       ├── dividends/
│       │   └── [ticker]/
│       │       └── route.ts      # Dividendos históricos
│       ├── quotes/
│       │   └── [ticker]/
│       │       └── route.ts      # Cotações
│       └── news/
│           └── route.ts          # Notícias
│
├── components/                   # Componentes reutilizáveis
│   ├── layout/
│   │   └── MainLayout.tsx        # Layout principal
│   └── DividendsSummary.tsx      # Cards de resumo
│
├── context/
│   └── AuthContext.tsx           # Gerenciamento de autenticação
│
├── services/
│   ├── api/                      # Serviços de APIs
│   │   ├── brapiService.ts
│   │   └── investmentService.ts
│   └── firebase/                 # Configuração Firebase
│       ├── auth.ts
│       ├── config.ts
│       └── quotesCache.ts
│
└── types/
    └── index.ts                  # TypeScript types
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| **Next.js 15** | Framework React com App Router |
| **TypeScript** | Tipagem e segurança no código |
| **Firebase** | Autenticação e banco de dados (Firestore) |
| **Material-UI** | Biblioteca de componentes visuais |
| **Recharts** | Gráficos e visualização de dados |
| **Yahoo Finance** | API de cotações |
| **brapi.dev** | API brasileira de mercado financeiro |
| **RSS Parser** | Feed de notícias |

---

## 🎓 Conceitos Importantes

### 1. Next.js App Router
Sistema de rotas baseado em pastas onde cada pasta vira uma URL automaticamente.

### 2. Client Components (`'use client'`)
Componentes que rodam no navegador e podem ter interatividade (cliques, formulários).

### 3. Server Components
Componentes que rodam no servidor, mais rápidos e sem interatividade.

### 4. API Routes (`route.ts`)
Endpoints de backend que retornam dados em JSON.

### 5. Parâmetros Dinâmicos `[ticker]`
Rotas que aceitam valores variáveis na URL.

### 6. Firebase Firestore
Banco de dados NoSQL em tempo real.

### 7. Context API
Sistema do React para compartilhar dados entre componentes.

---

## 🚀 Como Usar Esta Documentação

### Se você é iniciante:
1. ✅ Comece pela [Introdução ao Next.js](./00-INTRODUCAO-NEXTJS.md)
2. ✅ Leia sobre a [Tela de Login](./01-LOGIN.md)
3. ✅ Explore as outras telas na sequência

### Se você já conhece Next.js:
- Vá direto para a documentação da tela que te interessa
- Cada documento é independente e completo

---

## 📝 Formato da Documentação

Cada documento segue esta estrutura:

1. **Introdução** - O que a tela faz
2. **Localização no Projeto** - Onde estão os arquivos
3. **Rotas Envolvidas** - Como as URLs funcionam
4. **Fluxo Completo** - Passo a passo do funcionamento
5. **Principais Componentes** - Código e explicações
6. **APIs Utilizadas** - Endpoints e retornos
7. **Conceitos Importantes** - Explicações para iniciantes
8. **Exemplos Práticos** - Casos de uso reais

---

## 🎯 Objetivo Educacional

Esta documentação foi criada para que você possa:

✅ **Entender** como funciona cada parte da aplicação  
✅ **Aprender** conceitos de Next.js, React e Firebase  
✅ **Explicar** o projeto para outras pessoas  
✅ **Modificar** e expandir funcionalidades  
✅ **Ensinar** outros desenvolvedores iniciantes  

---

## 💡 Dicas para Melhor Aproveitamento

1. **Leia com calma** - Cada conceito é explicado de forma detalhada
2. **Teste na prática** - Rode o projeto e veja funcionando
3. **Explore o código** - Compare a documentação com os arquivos
4. **Faça anotações** - Anote dúvidas e pontos importantes
5. **Compartilhe** - Ensine outros e solidifique seu conhecimento

---

## 🤝 Contribuindo

Se encontrar erros ou tiver sugestões de melhoria na documentação, sinta-se à vontade para:
- Reportar issues
- Sugerir melhorias
- Adicionar exemplos
- Corrigir erros

---

## 📞 Suporte

Se tiver dúvidas após ler a documentação:
1. Revise a seção de **Conceitos Importantes**
2. Consulte os exemplos práticos
3. Teste o código localmente
4. Entre em contato com o time de desenvolvimento

---

## 🎉 Comece Agora!

Pronto para começar? Clique no link abaixo:

### 👉 [00 - Introdução ao Next.js App Router](./00-INTRODUCAO-NEXTJS.md)

---

**Boa leitura e bons estudos! 🚀**


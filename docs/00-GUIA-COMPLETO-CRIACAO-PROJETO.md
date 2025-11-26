# 📚 Guia Completo - Criação do Projeto CondoAI do Zero

Este guia foi criado para equipes iniciantes recriarem o projeto CondoAI passo a passo, desde a instalação até o primeiro commit no GitHub.

---

## 📋 Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Instalação das Ferramentas](#2-instalação-das-ferramentas)
3. [Criação do Projeto Next.js](#3-criação-do-projeto-nextjs)
4. [Configuração Inicial](#4-configuração-inicial)
5. [Instalação de Dependências](#5-instalação-de-dependências)
6. [Configuração do Tailwind CSS](#6-configuração-do-tailwind-css)
7. [Configuração do shadcn/ui](#7-configuração-do-shadcnui)
8. [Configuração do Supabase](#8-configuração-do-supabase)
9. [Configuração do Stripe](#9-configuração-do-stripe)
10. [Estrutura de Pastas](#10-estrutura-de-pastas)
11. [Iniciando o Desenvolvimento](#11-iniciando-o-desenvolvimento)
12. [Primeiro Commit no GitHub](#12-primeiro-commit-no-github)

---

## 1. Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** versão 18.x ou superior
- **Git** para controle de versão
- **Editor de código** (recomendado: VS Code)
- **Conta no GitHub** (para hospedar o código)
- **Conta no Supabase** (gratuita, para banco de dados)
- **Conta no Stripe** (gratuita, para pagamentos)

### Verificando Instalações

Abra o terminal (PowerShell no Windows, Terminal no Mac/Linux) e execute:

```bash
# Verificar versão do Node.js
node -v
# Deve mostrar algo como: v18.17.0 ou superior

# Verificar versão do npm (vem com Node.js)
npm -v
# Deve mostrar algo como: 9.6.7 ou superior

# Verificar se Git está instalado
git --version
# Deve mostrar algo como: git version 2.40.0
```

Se algum comando não funcionar, você precisa instalar a ferramenta correspondente.

---

## 2. Instalação das Ferramentas

### 2.1 Instalar Node.js

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (Long Term Support)
3. Execute o instalador e siga as instruções
4. Reinicie o terminal após a instalação

### 2.2 Instalar Git

**Windows:**
1. Acesse: https://git-scm.com/download/win
2. Baixe e execute o instalador
3. Durante a instalação, escolha "Git from the command line and also from 3rd-party software"

**Mac:**
```bash
# Se tiver Homebrew instalado
brew install git

# Ou baixe direto de: https://git-scm.com/download/mac
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git
```

### 2.3 Configurar Git (Primeira vez)

```bash
# Configure seu nome
git config --global user.name "Seu Nome"

# Configure seu email (use o mesmo do GitHub)
git config --global user.email "seu.email@exemplo.com"

# Verificar configuração
git config --list
```

### 2.4 Instalar VS Code (Opcional, mas recomendado)

1. Acesse: https://code.visualstudio.com/
2. Baixe e instale
3. Extensões recomendadas (instale pelo VS Code):
   - **ESLint** (Microsoft)
   - **Prettier** (Prettier)
   - **Tailwind CSS IntelliSense** (Tailwind Labs)
   - **TypeScript and JavaScript Language Features** (já vem instalado)

---

## 3. Criação do Projeto Next.js

### 3.1 Criar Diretório do Projeto

Abra o terminal e navegue até onde você quer criar o projeto:

```bash
# Exemplo: criar na pasta Documentos
cd ~/Documents

# Ou no Windows
cd C:\Users\SeuUsuario\Documents
```

### 3.2 Criar Projeto com Next.js

Execute o comando para criar o projeto:

```bash
npx create-next-app@latest condoai \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm
```

**Explicação das opções:**
- `condoai` - Nome do projeto (pasta que será criada)
- `--typescript` - Usa TypeScript
- `--tailwind` - Instala e configura Tailwind CSS
- `--eslint` - Configura ESLint para verificar código
- `--app` - Usa o App Router (mais moderno)
- `--src-dir` - Cria pasta `src/` para organizar código
- `--import-alias "@/*"` - Permite usar `@/` nos imports
- `--use-npm` - Usa npm (você pode usar `--use-yarn` se preferir)

**Durante a instalação, você pode responder:**
- Would you like to use `src/` directory? → **Yes** (já está configurado)
- Would you like to use App Router? → **Yes** (já está configurado)
- Would you like to customize the default import alias? → **No** (já está configurado)

### 3.3 Entrar na Pasta do Projeto

```bash
cd condoai
```

### 3.4 Verificar se Funcionou

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

Abra o navegador em: **http://localhost:3000**

Você deve ver a página inicial do Next.js. Se aparecer, está funcionando! ✅

Pare o servidor pressionando `Ctrl + C` no terminal.

---

## 4. Configuração Inicial

### 4.1 Atualizar package.json

Abra o arquivo `package.json` e atualize com as informações do projeto:

```json
{
  "name": "condoai",
  "version": "1.0.0",
  "description": "Plataforma de investimentos com Next.js, Supabase e Stripe",
  "author": "Seu Nome",
  "license": "ISC"
}
```

### 4.2 Criar Arquivo .gitignore

O Next.js já cria um `.gitignore`, mas verifique se contém:

```
# Dependências
node_modules/
/.pnp
.pnp.js

# Testes
/coverage

# Next.js
/.next/
/out/

# Produção
/build

# Variáveis de ambiente
.env*.local
.env

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Sistema
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local
.vercel
```

---

## 5. Instalação de Dependências

### 5.1 Instalar Dependências Principais

Execute os comandos abaixo um por um:

```bash
# Supabase (autenticação e banco de dados)
npm install @supabase/supabase-js

# Stripe (pagamentos)
npm install stripe @stripe/stripe-js

# UI Components (Radix UI)
npm install @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs

# Utilitários
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate

# Ícones
npm install lucide-react

# Gráficos
npm install recharts

# Data/Locale (para calendário em português)
npm install date-fns

# RSS Parser (opcional - apenas se usar feeds RSS para notícias)
# Se você não vai usar feeds RSS, pode fazer parse manual do XML ou usar uma API de notícias
# npm install rss-parser
```

### 5.2 Instalar Dependências de Desenvolvimento

```bash
npm install -D @types/node @types/react @types/react-dom autoprefixer postcss
```

### 5.3 Verificar Instalação

```bash
# Ver todas as dependências instaladas
npm list --depth=0
```

---

## 6. Configuração do Tailwind CSS

### 6.1 Atualizar tailwind.config.ts

Substitua o conteúdo do arquivo `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#ff6b2d",
          red: "#b91c1c",
          dark: "#3d1f1f",
          "dark-deep": "#1a0f0f",
          yellow: "#f59e0b",
          green: "#10b981",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 6.2 Atualizar postcss.config.js

Verifique se o arquivo `postcss.config.js` está assim:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 6.3 Atualizar globals.css

Abra `src/app/globals.css` e adicione as variáveis CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 16 100% 59%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 16 100% 59%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 16 100% 59%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 16 100% 59%;
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

---

## 7. Configuração do shadcn/ui

### 7.1 Inicializar shadcn/ui

```bash
npx shadcn@latest init
```

**Responda as perguntas:**
- Would you like to use TypeScript? → **Yes**
- Which style would you like to use? → **Default**
- Which color would you like to use as base color? → **Slate**
- Where is your global CSS file? → **src/app/globals.css**
- Would you like to use CSS variables for colors? → **Yes**
- Where is your tailwind.config.js located? → **tailwind.config.ts**
- Configure the import alias for components? → **@/components**
- Configure the import alias for utils? → **@/lib/utils**

### 7.2 Criar Arquivo de Utilitários

Crie o arquivo `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 7.3 Instalar Componentes shadcn/ui

Instale os componentes que serão usados:

```bash
# Componentes básicos
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add alert
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add table
npx shadcn@latest add pagination
npx shadcn@latest add calendar
```

**Nota:** O componente `calendar` do shadcn/ui substitui o `react-calendar`, mantendo consistência visual com o resto do projeto.

### 7.4 Verificar components.json

O arquivo `components.json` deve estar assim:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## 8. Configuração do Supabase

### 8.1 Criar Conta no Supabase

1. Acesse: https://supabase.com/
2. Clique em **Start your project**
3. Faça login com GitHub (recomendado) ou crie conta com email
4. Clique em **New Project**

### 8.2 Criar Novo Projeto

1. **Name**: `condoai` (ou outro nome)
2. **Database Password**: Crie uma senha forte (anote em local seguro!)
3. **Region**: Escolha a mais próxima (ex: South America - São Paulo)
4. Clique em **Create new project**
5. Aguarde alguns minutos enquanto o projeto é criado

### 8.3 Obter Credenciais

1. No dashboard do Supabase, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (começa com `https://`)
   - **anon public** key (chave longa)
   - **service_role** key (chave longa - mantenha secreta!)

### 8.4 Criar Arquivo .env.local

Na raiz do projeto, crie o arquivo `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

# Stripe (vamos configurar depois)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** 
- Nunca commite o arquivo `.env.local` no Git!
- Ele já está no `.gitignore`

### 8.5 Criar Cliente Supabase

Crie o arquivo `src/lib/supabase/client.ts`:

```typescript
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null;

export function createClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltam credenciais do Supabase. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey);
  
  return supabaseInstance;
}
```

### 8.6 Criar Tabelas no Supabase

No dashboard do Supabase, vá em **SQL Editor** e execute:

```sql
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscription_status TEXT DEFAULT 'free',
  customer_id TEXT,
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de investimentos
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  total_value NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (usuários só veem seus próprios dados)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own investments" ON investments
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own investments" ON investments
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
```

---

## 9. Configuração do Stripe

### 9.1 Criar Conta no Stripe

1. Acesse: https://dashboard.stripe.com/register
2. Crie sua conta (grátis)
3. Ative o **Modo de Teste** (Toggle no canto superior direito)

### 9.2 Criar Produto

1. No dashboard: **Products** → **Add Product**
2. Preencha:
   - **Name**: `Plano PRO - CondoAI`
   - **Description**: `Acesso completo à plataforma`
   - **Pricing**: 
     - **Recurring**: Mensal
     - **Price**: `29.90`
     - **Currency**: `BRL`
3. Clique em **Save product**
4. **Copie o Price ID** (começa com `price_...`)

### 9.3 Obter Chaves da API

1. **Developers** → **API keys**
2. Copie:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...) - clique em "Reveal test key"

### 9.4 Atualizar .env.local

Adicione as chaves do Stripe no arquivo `.env.local`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=
```

### 9.5 Configurar Stripe no Código

Crie o arquivo `src/services/stripe/config.ts`:

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});
```

**Para mais detalhes sobre Stripe, consulte:** `STRIPE_CONFIG.md`

---

## 10. Estrutura de Pastas

Crie a seguinte estrutura de pastas:

```
condoai/
├── src/
│   ├── app/                    # Páginas Next.js (App Router)
│   │   ├── api/                # API Routes
│   │   │   ├── news/
│   │   │   └── stripe/
│   │   ├── dashboard/
│   │   ├── investimentos/
│   │   ├── dividendos/
│   │   ├── planos/
│   │   ├── login/
│   │   ├── contato/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/             # Componentes React
│   │   ├── layout/
│   │   │   └── MainLayout.tsx
│   │   └── ui/                 # Componentes shadcn/ui
│   ├── context/                # Contextos React
│   │   └── AuthContext.tsx
│   ├── lib/                    # Utilitários
│   │   ├── supabase/
│   │   │   └── client.ts
│   │   └── utils.ts
│   ├── services/               # Serviços e integrações
│   │   ├── stripe/
│   │   │   └── config.ts
│   │   └── mockData/
│   └── types/                  # TypeScript types
│       └── index.ts
├── public/                     # Arquivos estáticos
├── .env.local                  # Variáveis de ambiente (não commitar!)
├── .gitignore
├── components.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

### Criar Pastas Vazias

```bash
# No terminal, dentro da pasta do projeto
mkdir -p src/app/api/news
mkdir -p src/app/api/stripe
mkdir -p src/app/dashboard
mkdir -p src/app/investimentos
mkdir -p src/app/dividendos
mkdir -p src/app/planos
mkdir -p src/app/login
mkdir -p src/app/contato
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/context
mkdir -p src/lib/supabase
mkdir -p src/services/stripe
mkdir -p src/services/mockData
mkdir -p src/types
```

---

## 11. Iniciando o Desenvolvimento

### 11.1 Verificar Configuração

Antes de começar, verifique:

- [ ] Node.js instalado (`node -v`)
- [ ] Dependências instaladas (`npm list`)
- [ ] Arquivo `.env.local` criado com todas as variáveis
- [ ] Estrutura de pastas criada

### 11.2 Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em: **http://localhost:3000**

### 11.3 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade de código
npm run lint         # Verifica erros no código
```

### 11.4 Estrutura Básica de uma Página

Crie `src/app/page.tsx` como exemplo:

```typescript
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-brand-orange">
        Bem-vindo ao CondoAI
      </h1>
      <p className="mt-4 text-gray-600">
        Sua plataforma de investimentos
      </p>
    </div>
  );
}
```

---

## 12. Primeiro Commit no GitHub

### 12.1 Criar Repositório no GitHub

1. Acesse: https://github.com/
2. Faça login
3. Clique no botão **+** (canto superior direito) → **New repository**
4. Preencha:
   - **Repository name**: `condoai` (ou outro nome)
   - **Description**: `Plataforma de investimentos com Next.js`
   - **Visibility**: Escolha **Public** ou **Private**
   - **NÃO marque** "Initialize with README" (já temos arquivos)
5. Clique em **Create repository**

### 12.2 Inicializar Git no Projeto

No terminal, dentro da pasta do projeto:

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos (exceto os do .gitignore)
git add .

# Fazer primeiro commit
git commit -m "feat: configuração inicial do projeto CondoAI"
```

### 12.3 Conectar com GitHub

```bash
# Adicionar repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/condoai.git

# Verificar se foi adicionado
git remote -v
```

### 12.4 Enviar Código para GitHub

```bash
# Renomear branch principal para main (se necessário)
git branch -M main

# Enviar código para GitHub
git push -u origin main
```

**Se pedir autenticação:**
- Use **Personal Access Token** (não senha)
- Para criar token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
- Dê permissão `repo`
- Copie o token e use como senha

### 12.5 Verificar no GitHub

1. Acesse seu repositório no GitHub
2. Você deve ver todos os arquivos do projeto
3. ✅ Pronto! Seu código está no GitHub!

### 12.6 Próximos Commits

Para fazer commits futuros:

```bash
# Ver status dos arquivos modificados
git status

# Adicionar arquivos específicos
git add src/app/page.tsx

# Ou adicionar todos os arquivos modificados
git add .

# Fazer commit
git commit -m "feat: adiciona página inicial"

# Enviar para GitHub
git push
```

### 12.7 Convenções de Commit

Use mensagens descritivas seguindo o padrão:

```
feat: adiciona nova funcionalidade
fix: corrige um bug
style: mudanças de formatação (não afeta código)
docs: atualiza documentação
refactor: refatora código sem mudar funcionalidade
test: adiciona ou corrige testes
chore: tarefas de manutenção
```

**Exemplos:**
```bash
git commit -m "feat: adiciona página de login"
git commit -m "fix: corrige erro de autenticação"
git commit -m "docs: atualiza README com instruções"
```

---

## ✅ Checklist Final

Antes de considerar o projeto configurado, verifique:

- [ ] Node.js instalado e funcionando
- [ ] Git configurado com nome e email
- [ ] Projeto Next.js criado e funcionando (`npm run dev`)
- [ ] Todas as dependências instaladas
- [ ] Tailwind CSS configurado
- [ ] shadcn/ui inicializado
- [ ] Supabase configurado e credenciais no `.env.local`
- [ ] Stripe configurado e credenciais no `.env.local`
- [ ] Estrutura de pastas criada
- [ ] Código enviado para GitHub
- [ ] `.env.local` está no `.gitignore` (não foi commitado)

---

## 🎉 Parabéns!

Seu projeto está configurado e pronto para desenvolvimento! 

### Próximos Passos:

1. **Criar páginas**: Comece criando as páginas principais (login, dashboard, etc.)
2. **Implementar autenticação**: Configure o sistema de login com Supabase
3. **Criar componentes**: Desenvolva os componentes reutilizáveis
4. **Integrar APIs**: Conecte com APIs externas (brapi.dev, etc.)
5. **Testar**: Teste todas as funcionalidades antes de fazer deploy

### Recursos Úteis:

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Stripe](https://stripe.com/docs)
- [Documentação shadcn/ui](https://ui.shadcn.com)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)

---

## ❓ Problemas Comuns

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 already in use"
```bash
# Usar outra porta
npm run dev -- -p 3001
```

### Erro ao fazer push no GitHub
- Verifique se está autenticado
- Use Personal Access Token em vez de senha
- Verifique se o repositório existe no GitHub

### Variáveis de ambiente não funcionam
- Certifique-se que o arquivo é `.env.local` (não `.env`)
- Reinicie o servidor (`npm run dev`)
- Verifique se as variáveis começam com `NEXT_PUBLIC_` para serem públicas

---

**Boa sorte com o desenvolvimento! 🚀**


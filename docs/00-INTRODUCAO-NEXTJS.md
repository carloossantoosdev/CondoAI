# 📚 Introdução - Entendendo o Next.js App Router

## O que é Next.js?

**Next.js** é um framework (estrutura) de desenvolvimento web construído em cima do React. Ele facilita a criação de aplicações web modernas, rápidas e otimizadas.

### Por que usamos Next.js?

1. **Sistema de rotas automático** - Não precisamos configurar rotas manualmente
2. **Performance otimizada** - Carregamento mais rápido das páginas
3. **SEO amigável** - Melhor posicionamento no Google
4. **API Routes integradas** - Backend e frontend no mesmo projeto
5. **TypeScript nativo** - Código mais seguro e com menos erros

---

## 🗂️ Sistema de Rotas Baseado em Pastas (App Router)

O Next.js 13+ usa um sistema chamado **App Router**, onde a estrutura de pastas define automaticamente as URLs da aplicação.

### Como funciona?

A pasta `src/app/` é a raiz do nosso projeto. Cada subpasta dentro dela se torna uma rota (URL).

**Exemplo:**

```
src/app/
  ├── page.tsx              → URL: /
  ├── login/
  │   └── page.tsx          → URL: /login
  ├── dashboard/
  │   └── page.tsx          → URL: /dashboard
  ├── investimentos/
  │   └── page.tsx          → URL: /investimentos
  └── dividendos/
      └── page.tsx          → URL: /dividendos
```

### Regra Simples:
- **O nome da pasta** = **o caminho na URL**
- **O arquivo `page.tsx`** = **o conteúdo que aparece na tela**

---

## 📄 Diferença entre `page.tsx` e `route.ts`

### `page.tsx` - Páginas Visuais

Arquivos chamados `page.tsx` representam **páginas que o usuário vê** no navegador.

**Exemplo:**
```
src/app/login/page.tsx  →  Tela de login visual (formulário, botões, etc.)
```

### `route.ts` - Rotas de API (Backend)

Arquivos chamados `route.ts` representam **endpoints de API** (backend) que retornam dados em JSON.

**Exemplo:**
```
src/app/api/quotes/[ticker]/route.ts  →  API que retorna cotações
```

Quando você acessa `/api/quotes/PETR4`, essa rota busca dados e retorna JSON, não HTML.

---

## 🔧 Parâmetros Dinâmicos - Colchetes `[nome]`

Quando queremos criar uma rota que aceita valores variáveis, usamos **colchetes**.

### Exemplo Prático:

```
src/app/api/quotes/[ticker]/route.ts
```

- `[ticker]` é um **parâmetro dinâmico**
- Ele pode receber qualquer valor na URL

**URLs Possíveis:**
- `/api/quotes/PETR4` → ticker = "PETR4"
- `/api/quotes/VALE3` → ticker = "VALE3"
- `/api/quotes/ITUB4` → ticker = "ITUB4"

No código, acessamos esse valor assim:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;  // Pega o valor da URL
  // Agora podemos usar 'ticker' para buscar dados
}
```

---

## 🖥️ Server Components vs Client Components

### Server Components (Padrão)

Por padrão, todo componente no Next.js 15 é um **Server Component**.

**Características:**
- Executado no **servidor**
- Não pode usar `useState`, `useEffect`, eventos de clique
- Mais rápido e leve
- Bom para buscar dados do backend

```typescript
// Componente de Servidor (padrão)
export default async function MeuComponente() {
  const dados = await buscarDados(); // Pode fazer isso!
  return <div>{dados}</div>;
}
```

### Client Components (`'use client'`)

Quando precisamos de **interatividade** (cliques, formulários, estados), usamos Client Components.

**Características:**
- Executado no **navegador** (cliente)
- Pode usar `useState`, `useEffect`, eventos
- Precisa da diretiva `'use client'` no topo do arquivo

```typescript
'use client';  // ← Indica que é um Client Component

import { useState } from 'react';

export default function MeuComponente() {
  const [contador, setContador] = useState(0);
  
  return (
    <button onClick={() => setContador(contador + 1)}>
      Clicado {contador} vezes
    </button>
  );
}
```

---

## 🌐 Como as Rotas se Transformam em URLs

### Páginas (Frontend)

| Arquivo | URL Gerada | Descrição |
|---------|-----------|-----------|
| `src/app/page.tsx` | `/` | Página inicial |
| `src/app/login/page.tsx` | `/login` | Tela de login |
| `src/app/dashboard/page.tsx` | `/dashboard` | Painel do usuário |
| `src/app/investimentos/page.tsx` | `/investimentos` | Lista de ativos |
| `src/app/dividendos/page.tsx` | `/dividendos` | Histórico de dividendos |

### APIs (Backend)

| Arquivo | URL da API | Uso |
|---------|-----------|-----|
| `src/app/api/quotes/[ticker]/route.ts` | `/api/quotes/PETR4` | Buscar cotação |
| `src/app/api/dividends/[ticker]/route.ts` | `/api/dividends/VALE3` | Buscar dividendos |
| `src/app/api/fundamentals/[ticker]/route.ts` | `/api/fundamentals/ITUB4` | Análise fundamentalista |
| `src/app/api/news/route.ts` | `/api/news` | Notícias do mercado |

---

## 📝 Exemplo Completo - Fluxo de uma Requisição

### Cenário: Usuário acessa a página de investimentos

1. **Usuário digita no navegador:** `https://seusite.com/investimentos`

2. **Next.js encontra o arquivo:** `src/app/investimentos/page.tsx`

3. **A página carrega e faz uma requisição para a API:**
   ```typescript
   fetch('/api/fundamentals/PETR4')
   ```

4. **Next.js encontra o arquivo:** `src/app/api/fundamentals/[ticker]/route.ts`

5. **A API busca dados externos (brapi.dev) e retorna JSON:**
   ```json
   {
     "ticker": "PETR4",
     "precoAtual": 38.50,
     "precoTeto": 45.00,
     "recomendacao": "COMPRA"
   }
   ```

6. **A página recebe os dados e exibe na tela** para o usuário

---

## 🎯 Resumo para Iniciantes

| Conceito | Explicação Simples |
|----------|-------------------|
| **App Router** | Sistema de pastas que viram URLs automaticamente |
| **page.tsx** | Arquivo que define o que aparece na tela |
| **route.ts** | Arquivo que cria uma API (retorna dados JSON) |
| **[nome]** | Parâmetro dinâmico na URL (valor variável) |
| **'use client'** | Indica que o componente roda no navegador e pode ter interatividade |
| **Server Component** | Componente que roda no servidor (mais rápido, sem interatividade) |

---

## 📌 Próximos Passos

Agora que você entende o básico do Next.js App Router, vamos explorar cada tela da aplicação:

1. **[Tela de Login](./01-LOGIN.md)** - Autenticação com Google
2. **[Tela de Investimentos](./02-INVESTIMENTOS.md)** - Explorar e investir em ativos
3. **[Tela de Dividendos](./03-DIVIDENDOS.md)** - Acompanhar proventos
4. **[Tela de Dashboard](./04-DASHBOARD.md)** - Visão geral da carteira

---

**🚀 Dica:** Sempre que estiver em dúvida sobre uma rota, olhe a estrutura de pastas dentro de `src/app/`. O nome da pasta é exatamente o caminho da URL!


# Documentação do Fluxo da Aplicação CondoAI

## 🗄️ Estrutura do Banco de Dados (Supabase)

### Tabelas Principais

#### 1. **Tabela: `users`**

Localização: Supabase → Schema `public` → Tabela `users`

**Colunas:**

- `id` (UUID) - ID do usuário (mesmo do auth.users)
- `email` (TEXT) - Email do usuário
- `display_name` (TEXT) - Nome de exibição
- `photo_url` (TEXT) - URL da foto de perfil
- `subscription_status` (TEXT) - Status da assinatura ('free' ou 'paid')
- `risk_profile` (TEXT) - Perfil de risco ('conservador', 'moderado', 'arrojado')
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

#### 2. **Tabela: `investments`**

Localização: Supabase → Schema `public` → Tabela `investments`

**Colunas:**

- `id` (UUID) - ID único do investimento
- `user_id` (UUID) - ID do usuário (FK para users.id)
- `type` (TEXT) - Tipo de investimento ('acao', 'fundo', 'rendaFixa', 'cripto')
- `ticker` (TEXT) - Código do ativo (ex: PETR4, VALE3)
- `nome` (TEXT) - Nome do ativo
- `quantidade` (NUMERIC) - Quantidade de cotas/ações
- `preco_medio` (NUMERIC) - Preço médio de compra
- `data_compra` (TIMESTAMP) - Data da compra
- `valor_total` (NUMERIC) - Valor total investido

---

## 🔐 Fluxo de Autenticação (Login/Cadastro)

### Arquivos Envolvidos:

- **Frontend:** `src/app/login/page.tsx`
- **Context:** `src/context/AuthContext.tsx`
- **Cliente Supabase:** `src/lib/supabase/client.ts`

### Fluxo Detalhado:

**1. Usuário acessa a tela de Login**

```
Usuário → /login (page.tsx)
```

**2. Usuário preenche Email e Senha**

- Se for cadastro: também preenche Nome (opcional)
- Validações no frontend:
    - Email deve conter '@'
    - Senha mínimo 6 caracteres

**3. Clica em "Entrar" ou "Criar Conta"**

**LOGIN (signIn):**

```
page.tsx → useAuth().signIn(email, password)
  ↓
AuthContext.signIn()
  ↓
supabaseClient.auth.signInWithPassword({ email, password })
  ↓
Supabase Auth verifica credenciais
  ↓
Retorna session com user data
  ↓
AuthContext.fetchUserData(supabaseUser)
  ↓
Busca dados na tabela 'users' usando user.id
  ↓
SELECT * FROM users WHERE id = supabaseUser.id
  ↓
Retorna dados do usuário (display_name, subscription_status, risk_profile, etc)
  ↓
Salva no state do AuthContext
  ↓
Redireciona para /dashboard
```

**CADASTRO (signUp):**

```
page.tsx → useAuth().signUp(email, password, name)
  ↓
AuthContext.signUp()
  ↓
supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
})
  ↓
Supabase Auth cria usuário em auth.users
  ↓
AuthContext.ensureUserExists(supabaseUser)
  ↓
Verifica se usuário já existe na tabela 'users':
SELECT id FROM users WHERE id = supabaseUser.id
  ↓
Se NÃO existir, cria registro:
INSERT INTO users (
    id, email, display_name, photo_url, subscription_status
) VALUES (
    supabaseUser.id,
    supabaseUser.email,
    name || email.split('@')[0],
    null,
    'free'
)
  ↓
AuthContext.fetchUserData(supabaseUser)
  ↓
Busca dados completos da tabela 'users'
  ↓
Salva no state do AuthContext
  ↓
Redireciona para /dashboard
```

---

## 📊 Fluxo do Dashboard

### Arquivos Envolvidos:

- **Frontend:** `src/app/dashboard/page.tsx`
- **Context:** `src/context/AuthContext.tsx`
- **API Routes:** `src/app/api/quotes/[ticker]/route.ts`

### Fluxo Detalhado:

**1. Usuário autenticado acessa /dashboard**

```
Dashboard verifica useAuth().user
  ↓
Se NÃO autenticado → redireciona para /login
  ↓
Se autenticado → loadInvestments()
```

**2. Carregamento dos Investimentos:**

```
loadInvestments()
  ↓
SELECT * FROM investments WHERE user_id = user.uid
  ↓
Retorna lista de investimentos do usuário
  ↓
Para cada investimento:
  ↓
  fetch(`/api/quotes/${investment.ticker}`)
    ↓
    API Route chama BRAPI (servidor)
    ↓
    GET https://brapi.dev/api/quote/${ticker}
    ↓
    Retorna cotação atual { price, change, ... }
  ↓
  Calcula valorAtual = price × quantidade
  ↓
Acumula todos os valores:
  - totalInvestido = soma de todos valor_total
  - valorTotal = soma de todos valorAtual
  - lucroOuPrejuizo = valorTotal - totalInvestido
  - percentualRetorno = (lucroOuPrejuizo / totalInvestido) × 100
  ↓
Atualiza estado com summary e investments
```

**3. Exibição no Dashboard:**

- **Cards de Resumo:** Valor Total, Total Investido, Lucro/Prejuízo, Nº Investimentos
- **Gráfico Pizza:** Distribuição por tipo (acao, fundo, rendaFixa, cripto)
- **Lista:** 5 investimentos mais recentes

---

## 💼 Fluxo de Investimentos

### Arquivos Envolvidos:

- **Frontend:** `src/app/investimentos/page.tsx`
- **Services:** `src/services/api/investmentService.ts`

### Fluxo Detalhado:

**1. Usuário acessa /investimentos**

```
Verifica perfil do usuário (user.riskProfile)
  ↓
Se NÃO tem perfil → usa 'conservador' como padrão
  ↓
Mostra banner incentivando fazer quiz de perfil
```

**2. Filtro de Ativos por Perfil:**

```
getAvailableInvestmentTypes(user.riskProfile)
  ↓
Conservador: apenas 'rendaFixa'
Moderado: 'rendaFixa', 'fundo', 'acao'
Arrojado: 'rendaFixa', 'fundo', 'acao', 'cripto'
  ↓
loadAssets() com filtro
  ↓
Chama API BRAPI para buscar ativos:
  - Ações: GET brapi.dev/api/quote/list
  - Fundos, Renda Fixa, Cripto: dados mockados localmente
  ↓
Filtra apenas ativos compatíveis com perfil
  ↓
Exibe grid de cards com ativos disponíveis
```

**3. Realizar Investimento:**

```
Usuário clica em "Investir" no card do ativo
  ↓
Abre modal com detalhes do ativo
  ↓
Usuário define quantidade
  ↓
Calcula valorTotal = preco × quantidade
  ↓
Usuário confirma investimento
  ↓
INSERT INTO investments (
    user_id,
    type,
    ticker,
    nome,
    quantidade,
    preco_medio,
    data_compra,
    valor_total
) VALUES (
    user.uid,
    asset.tipo,
    asset.ticker,
    asset.nome,
    quantidade,
    asset.preco,
    NOW(),
    valorTotal
)
  ↓
Fecha modal e mostra mensagem de sucesso
```

---

## 👤 Fluxo de Perfil de Investidor

### Arquivos Envolvidos:

- **Frontend:** `src/app/perfil/page.tsx`

### Fluxo Detalhado:

**1. Usuário acessa /perfil**

```
Verifica se user.riskProfile já existe
  ↓
Se SIM → mostra perfil atual e permite refazer
  ↓
Se NÃO → mostra questionário
```

**2. Responde Questionário (5 perguntas):**

```
Cada resposta tem score 1-3:
  - 1: Conservador
  - 2: Moderado
  - 3: Arrojado
  ↓
Usuário responde pergunta 1 → adiciona score ao array
  ↓
... pergunta 2, 3, 4, 5
  ↓
Última pergunta respondida → calcula perfil automaticamente
```

**3. Cálculo e Salvamento Automático:**

```
calculateAndSaveResult(answers)
  ↓
Calcula média dos scores:
  average = soma(scores) / 5
  ↓
Define perfil:
  - average <= 1.5 → 'conservador'
  - average <= 2.5 → 'moderado'
  - average > 2.5 → 'arrojado'
  ↓
UPDATE users 
SET risk_profile = perfil, updated_at = NOW()
WHERE id = user.uid
  ↓
Atualiza contexto AuthContext.refreshUser()
  ↓
Mostra resultado com recomendações
```

---

## 💰 Fluxo de Dividendos

### Arquivos Envolvidos:

- **Frontend:** `src/app/dividendos/page.tsx`
- **API Route:** `src/app/api/dividends/[ticker]/route.ts`

### Fluxo Detalhado:

**1. Usuário acessa /dividendos**

```
SELECT * FROM investments 
WHERE user_id = user.uid AND type = 'acao'
  ↓
Retorna apenas ações (só ações pagam dividendos)
```

**2. Para cada ação do usuário:**

```
fetch(`/api/dividends/${ticker}`)
  ↓
  API Route chama BRAPI:
  GET brapi.dev/api/quote/${ticker}/dividends
  ↓
  Retorna:
    - dividends: [{ date, value, type }]
    - summary: { dividendYield }
  ↓
Filtra apenas dividendos em dinheiro (type = 'cash')
  ↓
Filtra últimos 12 meses:
  divDate >= (hoje - 1 ano) AND divDate <= hoje
  ↓
Separa dividendos recebidos vs não recebidos:
  - Recebido: divDate >= dataCompra do usuário
  - Não recebido: divDate < dataCompra
  ↓
Calcula totalRecebido = soma(dividendos recebidos × quantidade)
```

**3. Exibição:**

- **Cards Resumo:** Total Recebido, Número de Pagamentos, Yield Médio
- **Cards por Ativo:** Mostra cada ação com seus dividendos
- **Tabela Histórico:** Todos os dividendos dos últimos 12 meses
    - Verde com "✓ Recebido": pagos após compra
    - Cinza com "Não recebeu": pagos antes da compra

---

## 🌐 APIs Externas Utilizadas

### 1. **BRAPI (brapi.dev)**

- **Cotações de Ações:** `GET /api/quote/{ticker}`
- **Lista de Ações:** `GET /api/quote/list`
- **Dividendos:** `GET /api/quote/{ticker}/dividends`
- **Uso:** Todas as chamadas são feitas via API Routes (server-side) para proteger a API key

### 2. **Supabase Auth**

- **Login:** `supabaseClient.auth.signInWithPassword()`
- **Cadastro:** `supabaseClient.auth.signUp()`
- **Logout:** `supabaseClient.auth.signOut()`
- **Verificar Sessão:** `supabaseClient.auth.getSession()`

### 3. **Supabase Database**

- **Queries:** `supabaseClient.from('tabela').select()` / `.insert()` / `.update()`

---

## 🎨 Componentes Principais

### Layout

- **MainLayout:** `src/components/layout/MainLayout.tsx` - Sidebar + Header

### Context

- **AuthContext:** `src/context/AuthContext.tsx` - Gerencia autenticação global

### Páginas

1. **Login:** `src/app/login/page.tsx`
2. **Dashboard:** `src/app/dashboard/page.tsx`
3. **Investimentos:** `src/app/investimentos/page.tsx`
4. **Perfil:** `src/app/perfil/page.tsx`
5. **Dividendos:** `src/app/dividendos/page.tsx`

---

## 📋 Fluxo Completo Resumido

```
1. LOGIN/CADASTRO
   ├─ Usuário entra email/senha
   ├─ Supabase Auth valida credenciais
   ├─ Cria/busca registro na tabela 'users'
   └─ Redireciona para /dashboard

2. DASHBOARD
   ├─ Busca investimentos do usuário (tabela 'investments')
   ├─ Para cada investimento, busca cotação atual (API BRAPI)
   ├─ Calcula resumo: valor total, lucro, retorno
   └─ Exibe cards, gráfico e lista

3. PERFIL DE INVESTIDOR
   ├─ Usuário responde 5 perguntas
   ├─ Calcula perfil (conservador/moderado/arrojado)
   ├─ Salva na tabela 'users' (campo risk_profile)
   └─ Mostra recomendações

4. INVESTIMENTOS
   ├─ Filtra ativos por perfil do usuário
   ├─ Busca lista de ativos (API BRAPI + dados locais)
   ├─ Usuário seleciona ativo e quantidade
   ├─ Salva investimento na tabela 'investments'
   └─ Mostra confirmação

5. DIVIDENDOS
   ├─ Busca apenas ações do usuário (tabela 'investments')
   ├─ Para cada ação, busca histórico de dividendos (API BRAPI)
   ├─ Filtra últimos 12 meses
   ├─ Separa dividendos recebidos (após data de compra)
   └─ Exibe resumo e histórico detalhado
```

---

## 🗂️ Estrutura de Dados Principais

### User (AuthContext)

```typescript
{
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  subscriptionStatus: 'free' | 'paid'
  riskProfile: 'conservador' | 'moderado' | 'arrojado' | null
}
```

### Investment

```typescript
{
  id: string
  userId: string
  type: 'acao' | 'fundo' | 'rendaFixa' | 'cripto'
  ticker: string
  nome: string
  quantidade: number
  precoMedio: number
  dataCompra: Date
  valorTotal: number
}
```

### PortfolioSummary

```typescript
{
  valorTotal: number
  totalInvestido: number
  lucroOuPrejuizo: number
  percentualRetorno: number
  numeroInvestimentos: number
}
```

---

## 🎯 Diagrama Simplificado para Excalidraw

### Sugestão de Elementos para o Desenho:

#### 1. **Camadas da Aplicação:**
- **Frontend (Next.js)** - Retângulo no topo
- **API Routes (Next.js)** - Retângulo no meio
- **Supabase (Backend)** - Retângulo embaixo
  - Auth (Autenticação)
  - Database (Banco de Dados)
- **BRAPI (API Externa)** - Retângulo ao lado

#### 2. **Fluxo de Login:**
```
[Tela Login] 
    → [AuthContext] 
    → [Supabase Auth] 
    → [Tabela users]
    → [Dashboard]
```

#### 3. **Fluxo de Dashboard:**
```
[Dashboard] 
    → [Query: SELECT investments] 
    → [Tabela investments]
    → [Para cada ticker: API /quotes/[ticker]]
    → [BRAPI: cotação]
    → [Calcula resumo]
    → [Exibe cards + gráfico]
```

#### 4. **Fluxo de Investimentos:**
```
[Página Investimentos]
    → [Verifica perfil do usuário]
    → [Filtra ativos por perfil]
    → [BRAPI: lista de ações]
    → [Usuário seleciona ativo]
    → [INSERT INTO investments]
    → [Sucesso]
```

#### 5. **Fluxo de Perfil:**
```
[Página Perfil]
    → [Questionário 5 perguntas]
    → [Calcula média dos scores]
    → [UPDATE users SET risk_profile]
    → [Mostra resultado]
```

#### 6. **Fluxo de Dividendos:**
```
[Página Dividendos]
    → [SELECT investments WHERE type='acao']
    → [Para cada ação: API /dividends/[ticker]]
    → [BRAPI: histórico dividendos]
    → [Filtra últimos 12 meses]
    → [Separa recebidos vs não recebidos]
    → [Exibe tabela]
```

---

## 🔄 Relacionamentos Entre Tabelas

```
auth.users (Supabase Auth)
    ↓ (id)
    |
public.users
    ↓ (id → user_id)
    |
public.investments
```

---

## 📱 Navegação da Aplicação

```
/ (Home/Landing)
    ↓
/login
    ↓ (após autenticação)
    |
/dashboard ←→ MainLayout (com Sidebar)
    ↓
    ├── /investimentos
    ├── /dividendos
    ├── /perfil
    ├── /planos
    └── /contato
```

---

## ✅ Checklist para o Desenho no Excalidraw

### Elementos a Incluir:

- [ ] Retângulo para Frontend (Next.js)
- [ ] Retângulo para API Routes
- [ ] Retângulo para Supabase (Auth + Database)
- [ ] Retângulo para BRAPI
- [ ] Cilindro/Tabela para `users`
- [ ] Cilindro/Tabela para `investments`
- [ ] Setas conectando Login → Auth → users
- [ ] Setas conectando Dashboard → investments → BRAPI
- [ ] Setas conectando Investimentos → INSERT investments
- [ ] Setas conectando Perfil → UPDATE users
- [ ] Setas conectando Dividendos → investments → BRAPI
- [ ] Legenda com cores diferentes para cada fluxo
- [ ] Notas explicativas nos principais pontos

### Dicas de Organização:

1. **Camadas Horizontais:**
   - Topo: Frontend (páginas do usuário)
   - Meio: Lógica/Context/API Routes
   - Base: Banco de Dados + APIs Externas

2. **Cores Sugeridas:**
   - 🟦 Azul: Autenticação
   - 🟩 Verde: Investimentos
   - 🟨 Amarelo: Perfil de Risco
   - 🟧 Laranja: Dividendos
   - ⚪ Cinza: Componentes compartilhados

3. **Anotações Importantes:**
   - Marcar onde os dados são salvos (INSERT, UPDATE)
   - Marcar onde os dados são lidos (SELECT)
   - Indicar chamadas a APIs externas
   - Destacar redirecionamentos de páginas

---

**Criado em:** Dezembro 2025  
**Versão:** 1.0  
**Aplicação:** CondoAI - Plataforma de Investimentos





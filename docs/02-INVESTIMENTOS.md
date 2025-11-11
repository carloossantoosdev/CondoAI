# 📊 Tela de Investimentos

## 📋 Introdução

A tela de investimentos é onde o usuário **explora e investe** em diferentes tipos de ativos financeiros. É o coração da plataforma!

**Funcionalidades principais:**
- Visualizar lista de ativos disponíveis (Ações, Fundos, Renda Fixa, Cripto)
- Filtrar por tipo de investimento
- Ver análise de preço teto (Método Bazin) para ações
- Realizar investimentos simulados
- Paginação para navegação entre milhares de ativos

---

## 📂 Localização no Projeto

```
src/
  ├── app/
  │   ├── investimentos/
  │   │   └── page.tsx              ← Tela de Investimentos
  │   │
  │   └── api/
  │       └── fundamentals/
  │           └── [ticker]/
  │               └── route.ts      ← API de análise fundamentalista
  │
  ├── services/
  │   └── api/
  │       └── investmentService.ts  ← Serviço de busca de ativos
  │
  └── components/
      └── layout/
          └── MainLayout.tsx        ← Layout principal (menu, header)
```

---

## 🌐 Rotas Envolvidas

### 1. Página de Investimentos (Frontend)
```
Arquivo: src/app/investimentos/page.tsx
URL:     https://seusite.com/investimentos
```

### 2. API de Análise Fundamentalista (Backend)
```
Arquivo: src/app/api/fundamentals/[ticker]/route.ts
URL:     /api/fundamentals/PETR4
```

**Exemplo de uso:**
- Quando o usuário clica em "Investir" em uma ação (ex: PETR4)
- A página faz uma requisição: `fetch('/api/fundamentals/PETR4')`
- A API retorna análise de preço teto e recomendação

---

## 🔄 Fluxo Completo (Passo a Passo)

```
1. Usuário acessa /investimentos
   ↓
2. Página carrega lista de ativos (10 por página)
   ↓
3. Usuário filtra por tipo (ex: "Ações")
   ↓
4. Lista é atualizada mostrando apenas ações
   ↓
5. Usuário clica em "Investir" em uma ação
   ↓
6. Modal abre mostrando detalhes do ativo
   ↓
7. Sistema busca análise de preço teto (API)
   ↓
8. Análise é exibida no modal (COMPRA, VENDA, etc.)
   ↓
9. Usuário define quantidade e confirma
   ↓
10. Investimento é salvo no Firebase
   ↓
11. Mensagem de sucesso é exibida
```

---

## 🎨 Interface da Tela

### Estrutura Visual

```
┌──────────────────────────────────────────────────┐
│  MainLayout (Menu lateral + Header)             │
├──────────────────────────────────────────────────┤
│                                                  │
│  📊 Explorar Investimentos                       │
│  Descubra as melhores oportunidades...          │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ [Todos] [Ações] [Fundos] [Renda Fixa]   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ PETR4   │  │ VALE3   │  │ ITUB4   │        │
│  │ [Logo]  │  │ [Logo]  │  │ [Logo]  │        │
│  │ R$ 38.50│  │ R$ 65.20│  │ R$ 28.90│        │
│  │ +2.3%   │  │ -1.5%   │  │ +0.8%   │        │
│  │[Investir]│ │[Investir]│ │[Investir]│        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                  │
│  [◀ 1 2 3 ... 10 ▶]  (Paginação)               │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🧩 Principais Componentes

### 1. Tabs de Filtro

```typescript
<Tabs value={currentTab} onChange={handleTabChange}>
  <Tab label="Todos" value="todos" />
  <Tab label="Ações" value="acao" />
  <Tab label="Fundos" value="fundo" />
  <Tab label="Renda Fixa" value="rendaFixa" />
  <Tab label="Cripto" value="cripto" />
</Tabs>
```

**Função:** Filtrar ativos por categoria.

### 2. Card de Ativo

Cada ativo é exibido em um card com:
- **Avatar/Logo** do ativo
- **Ticker** (código do ativo)
- **Nome completo**
- **Preço atual**
- **Variação percentual** (positiva em verde, negativa em vermelho)
- **Botão "Investir"**

```typescript
<Card>
  <Avatar src={asset.logo} />
  <Typography variant="h6">{asset.ticker}</Typography>
  <Typography>{asset.nome}</Typography>
  <Typography variant="h5">{formatCurrency(asset.preco)}</Typography>
  <Chip label={`+${asset.variacao}%`} color="success" />
  <Button onClick={() => handleOpenModal(asset)}>Investir</Button>
</Card>
```

### 3. Modal de Investimento

Quando o usuário clica em "Investir", um modal (janela popup) é aberto mostrando:
- Preço atual do ativo
- **Análise de Preço Teto** (só para ações)
- Campo para quantidade
- Valor total do investimento
- Botões "Cancelar" e "Confirmar"

---

## 📊 API de Análise Fundamentalista

### Rota da API
```
src/app/api/fundamentals/[ticker]/route.ts
```

### Como funciona?

#### 1. Parâmetro Dinâmico `[ticker]`

O `[ticker]` entre colchetes significa que a rota aceita valores dinâmicos:

```
/api/fundamentals/PETR4  → ticker = "PETR4"
/api/fundamentals/VALE3  → ticker = "VALE3"
```

#### 2. Função GET

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;  // Pega o ticker da URL
  
  // Busca dados da API externa (brapi.dev)
  const response = await axiosClient.get(
    `https://brapi.dev/api/quote/${ticker}?dividends=true`
  );
  
  // Calcula dividend yield e preço teto
  const dividendYield = calcularDividendYield(cashDividends, precoAtual);
  const analise = calcularPrecoTeto(precoAtual, dividendYield);
  
  return NextResponse.json({
    ticker,
    precoAtual,
    dividendYield,
    precoTeto: analise.precoTeto,
    recomendacao: analise.recomendacao,
    explicacao: 'Baseado no método Bazin...'
  });
}
```

### 3. Método Bazin (Preço Teto)

O **Método Bazin** é uma estratégia de investimento que usa o **Dividend Yield (DY)** para calcular o preço máximo que você deveria pagar por uma ação.

#### Fórmula Simplificada:

```
Preço Teto = (DY atual / 6%) × Preço Atual
```

**Regra:** Só compre ações que pagam pelo menos **6% de DY ao ano**.

#### Exemplo Prático:

```
Ação: PETR4
Preço Atual: R$ 40,00
Dividendos pagos no ano: R$ 3,00
DY = (3,00 / 40,00) × 100 = 7,5%

Preço Teto = (7,5 / 6) × 40 = R$ 50,00

Como o preço está em R$ 40 e o teto é R$ 50:
→ Recomendação: COMPRA ✅
```

#### Recomendações Possíveis:

```typescript
if (desconto >= 20) recomendacao = 'COMPRA FORTE';
else if (desconto >= 10) recomendacao = 'COMPRA';
else if (desconto >= -10) recomendacao = 'MANTER';
else recomendacao = 'VENDA';
```

---

## 💾 Salvando Investimentos no Firebase

Quando o usuário confirma o investimento:

```typescript
const handleInvest = async () => {
  const valorTotal = selectedAsset.preco * quantidade;
  
  // Referência à coleção do usuário no Firestore
  const investmentsRef = collection(db, 'portfolios', user.uid, 'investments');
  
  // Adiciona documento com os dados
  await addDoc(investmentsRef, {
    type: selectedAsset.tipo,
    ticker: selectedAsset.ticker,
    nome: selectedAsset.nome,
    quantidade,
    precoMedio: selectedAsset.preco,
    dataCompra: serverTimestamp(),
    valorTotal,
  });
  
  setSuccessMessage('Investimento realizado com sucesso!');
};
```

### Estrutura no Firestore:

```
Firestore Database:
  └── portfolios/
      └── [userId]/
          └── investments/
              ├── [investmentId1]/
              │   ├── type: "acao"
              │   ├── ticker: "PETR4"
              │   ├── nome: "Petrobras"
              │   ├── quantidade: 10
              │   ├── precoMedio: 38.50
              │   ├── dataCompra: 2025-01-15
              │   └── valorTotal: 385.00
              │
              └── [investmentId2]/
                  └── ...
```

---

## 📄 Paginação Híbrida (Servidor + Cliente)

A paginação usa uma estratégia **híbrida** para otimizar performance:

### Para Ações (muitos dados):
- **Servidor:** Busca 50 ações por vez
- **Cliente:** Divide esses 50 em 5 páginas de 10 itens cada

### Para outros tipos (poucos dados):
- **Cliente:** Paginação local simples (todos os dados de uma vez)

```typescript
const useServerPagination = currentTab === 'acao' || currentTab === 'todos';

if (useServerPagination) {
  // Buscar do servidor quando mudar de grupo de 50
  const serverPage = Math.ceil(value / 5);
  await loadAssets(serverPage);
} else {
  // Apenas mudar página localmente
  setPage(value);
}
```

**Por que assim?** 
- Ações na B3: ~500 ativos → muitos dados
- Fundos/Cripto: ~50 ativos → poucos dados

---

## 🎯 Estados Gerenciados

```typescript
const [currentTab, setCurrentTab] = useState<'todos' | InvestmentType>('todos');
const [assets, setAssets] = useState<AssetWithAnalysis[]>([]);
const [loadingAssets, setLoadingAssets] = useState(true);
const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
const [quantidade, setQuantidade] = useState<number>(1);
const [modalOpen, setModalOpen] = useState(false);
const [investing, setInvesting] = useState(false);
const [successMessage, setSuccessMessage] = useState('');
const [analisePrecoTeto, setAnalisePrecoTeto] = useState(null);
const [page, setPage] = useState(1);
```

### O que cada estado faz:

| Estado | Função |
|--------|--------|
| `currentTab` | Aba selecionada (Todos, Ações, etc.) |
| `assets` | Lista de ativos carregados |
| `loadingAssets` | Indica se está carregando ativos |
| `selectedAsset` | Ativo selecionado no modal |
| `quantidade` | Quantidade a investir |
| `modalOpen` | Controla abertura do modal |
| `investing` | Indica se está processando investimento |
| `successMessage` | Mensagem de sucesso após investir |
| `analisePrecoTeto` | Análise do método Bazin |
| `page` | Página atual da paginação |

---

## 🔍 Fluxo de Análise de Preço Teto

```
1. Usuário clica em "Investir" em PETR4
   ↓
   handleOpenModal(asset) é chamado
   ↓
2. Modal abre
   ↓
3. Verifica se é uma ação
   ↓
4. Se sim, faz requisição:
   fetch('/api/fundamentals/PETR4')
   ↓
5. API busca dados da brapi.dev
   ↓
6. API calcula:
   - Dividend Yield dos últimos 12 meses
   - Preço Teto (método Bazin)
   - Recomendação (COMPRA, VENDA, etc.)
   ↓
7. Retorna JSON:
   {
     precoAtual: 38.50,
     dividendYield: 7.5,
     precoTeto: 50.00,
     recomendacao: 'COMPRA',
     explicacao: '...'
   }
   ↓
8. Modal exibe análise com cores:
   - Verde: COMPRA FORTE / COMPRA
   - Amarelo: MANTER
   - Azul: NEUTRO
   - Vermelho: VENDA
```

---

## 🧩 Serviço de Investimentos

### Localização
```
src/services/api/investmentService.ts
```

### Funções Principais

#### 1. Buscar Todos os Ativos
```typescript
export async function getAllAssets(page: number = 1): Promise<PaginatedAssets> {
  const response = await fetch(`/api/investments?page=${page}`);
  const data = await response.json();
  return data;
}
```

#### 2. Buscar por Tipo
```typescript
export async function getAssetsByType(
  type: InvestmentType, 
  page: number = 1
): Promise<PaginatedAssets> {
  const response = await fetch(`/api/investments?type=${type}&page=${page}`);
  const data = await response.json();
  return data;
}
```

---

## 💡 Conceitos Importantes

### 1. Async/Await

Usado para operações que levam tempo (buscar dados, salvar no banco):

```typescript
const loadAssets = async () => {
  setLoadingAssets(true);
  const data = await getAllAssets(page);  // Espera terminar
  setAssets(data.assets);
  setLoadingAssets(false);
};
```

### 2. useEffect

Executa código quando algo muda:

```typescript
useEffect(() => {
  loadAssets();  // Recarrega quando mudar a aba
}, [currentTab]);
```

### 3. Modal (Dialog)

Janela popup que abre sobre a página:

```typescript
<Dialog open={modalOpen} onClose={handleCloseModal}>
  <DialogTitle>Investir em {selectedAsset?.ticker}</DialogTitle>
  <DialogContent>
    {/* Conteúdo do modal */}
  </DialogContent>
</Dialog>
```

### 4. Formatação de Moeda

```typescript
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

formatCurrency(38.50);  // "R$ 38,50"
```

---

## 🔐 Proteção de Rota

A página verifica se o usuário está logado:

```typescript
useEffect(() => {
  if (!loading && !user) {
    router.push('/login');  // Redireciona para login
  }
}, [user, loading, router]);
```

---

## 🧪 Testando a Funcionalidade

### 1. Filtrar por Tipo
```
Clicar em "Ações" → Lista atualiza mostrando apenas ações
```

### 2. Visualizar Análise
```
Clicar em "Investir" em PETR4 → Ver preço teto e recomendação
```

### 3. Fazer Investimento
```
Definir quantidade: 10 cotas
Clicar em "Confirmar Investimento"
Ver mensagem de sucesso
```

### 4. Verificar no Firebase
```
Firestore → portfolios → [seu userId] → investments
Deve aparecer o novo investimento
```

---

## 📊 Exemplo de Resposta da API

### Requisição:
```
GET /api/fundamentals/PETR4
```

### Resposta:
```json
{
  "ticker": "PETR4",
  "precoAtual": 38.50,
  "dividendYield": 7.5,
  "precoTeto": 50.00,
  "recomendacao": "COMPRA",
  "desconto": 23,
  "explicacao": "Baseado no método Bazin com DY calculado dos últimos 12 meses"
}
```

---

## 🎓 Resumo para Iniciantes

| Conceito | Explicação |
|----------|------------|
| **Client Component** | Usa `'use client'` porque tem interatividade |
| **useState** | Armazena dados que mudam (lista, modal, etc.) |
| **useEffect** | Reage a mudanças (ex: mudar aba recarrega lista) |
| **Modal** | Janela popup para investir |
| **API Route** | `/api/fundamentals/[ticker]` busca análise |
| **Firebase** | Salva investimentos na nuvem |
| **Paginação** | Divide lista em páginas de 10 itens |
| **Método Bazin** | Calcula preço máximo baseado em dividendos |

---

## 📌 Arquivos Relacionados

- `src/app/investimentos/page.tsx` - Página principal
- `src/app/api/fundamentals/[ticker]/route.ts` - API de análise
- `src/services/api/investmentService.ts` - Serviço de busca
- `src/services/api/brapiService.ts` - Integração com brapi.dev
- `src/components/layout/MainLayout.tsx` - Layout da página

---

## 🔗 Próximas Telas

- **[Tela de Dividendos](./03-DIVIDENDOS.md)** - Acompanhar proventos recebidos
- **[Tela de Dashboard](./04-DASHBOARD.md)** - Visão geral da carteira


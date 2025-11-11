# 💰 Tela de Dividendos

## 📋 Introdução

A tela de dividendos é onde o usuário **acompanha os proventos** (dividendos e rendimentos) recebidos dos seus investimentos e visualiza **projeções futuras**.

**Funcionalidades principais:**
- Visualizar dividendos históricos recebidos
- Ver projeções de dividendos futuros
- Acompanhar Dividend Yield da carteira
- Calcular totais recebidos e projetados

---

## 📂 Localização no Projeto

```
src/
  ├── app/
  │   ├── dividendos/
  │   │   └── page.tsx              ← Tela de Dividendos
  │   │
  │   └── api/
  │       └── dividends/
  │           └── [ticker]/
  │               └── route.ts      ← API de dividendos
  │
  └── components/
      └── DividendsSummary.tsx      ← Cards de resumo
```

---

## 🌐 Rotas Envolvidas

### 1. Página de Dividendos (Frontend)
```
Arquivo: src/app/dividendos/page.tsx
URL:     https://seusite.com/dividendos
```

### 2. API de Dividendos (Backend)
```
Arquivo: src/app/api/dividends/[ticker]/route.ts
URL:     /api/dividends/PETR4
```

**Exemplo de uso:**
- Para cada ativo na carteira do usuário
- A página faz uma requisição: `fetch('/api/dividends/PETR4')`
- A API retorna histórico de dividendos e Dividend Yield

---

## 🔄 Fluxo Completo (Passo a Passo)

```
1. Usuário acessa /dividendos
   ↓
2. Sistema busca investimentos do usuário no Firebase
   ↓
3. Para cada investimento, busca dividendos via API
   fetch('/api/dividends/PETR4')
   fetch('/api/dividends/VALE3')
   etc...
   ↓
4. Filtra apenas dividendos pagos APÓS a data de compra
   ↓
5. Calcula projeções futuras baseadas no Dividend Yield
   ↓
6. Exibe:
   - Cards de resumo (total recebido, yield médio, etc.)
   - Tabela de projeções futuras
   - Tabela de histórico recebido
```

---

## 🎨 Interface da Tela

### Estrutura Visual

```
┌──────────────────────────────────────────────────┐
│  💰 Dividendos da Carteira                       │
│  Acompanhe os proventos recebidos...            │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  📊 Cards de Resumo                      │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐       │  │
│  │  │ Total  │ │ Yield  │ │Projetado│      │  │
│  │  │Recebido│ │ Médio  │ │12 meses │      │  │
│  │  └────────┘ └────────┘ └────────┘       │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  📅 Próximos Pagamentos Estimados               │
│  ┌──────────────────────────────────────────┐  │
│  │ Data     | Ativo | Valor/Cota | Total   │  │
│  │ 15/04/25 | PETR4 | R$ 0,75    | R$ 7,50 │  │
│  │ 15/07/25 | VALE3 | R$ 1,20    | R$ 12,00│  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  💰 Histórico de Proventos Recebidos            │
│  ┌──────────────────────────────────────────┐  │
│  │ Data     | Ativo | Valor Unit | Total   │  │
│  │ 15/01/25 | PETR4 | R$ 0,75    | R$ 7,50 │  │
│  │ 10/01/25 | VALE3 | R$ 1,20    | R$ 12,00│  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 💾 Como os Dados são Carregados

### Etapa 1: Buscar Investimentos do Usuário

```typescript
const investmentsRef = collection(db, 'portfolios', user.uid, 'investments');
const snapshot = await getDocs(investmentsRef);
const investments = snapshot.docs.map(doc => ({ 
  id: doc.id, 
  ...doc.data() 
}));
```

**O que faz:** Busca todos os investimentos que o usuário já realizou no Firebase.

**Estrutura no Firestore:**
```
portfolios/
  └── [userId]/
      └── investments/
          ├── inv1: { ticker: "PETR4", quantidade: 10, dataCompra: ... }
          ├── inv2: { ticker: "VALE3", quantidade: 5, dataCompra: ... }
          └── inv3: { ticker: "ITUB4", quantidade: 20, dataCompra: ... }
```

### Etapa 2: Buscar Dividendos de Cada Ativo

```typescript
const dividendsPromises = investments.map(async (inv) => {
  const response = await fetch(`/api/dividends/${inv.ticker}`);
  const data = await response.json();
  
  return {
    ticker: inv.ticker,
    quantidade: inv.quantidade,
    dividends: data.dividends,
    yield: data.summary.dividendYield,
    dataCompra: inv.dataCompra
  };
});

const allDividends = await Promise.all(dividendsPromises);
```

**O que faz:** Para cada ativo da carteira, busca o histórico de dividendos via API.

### Etapa 3: Filtrar Dividendos Válidos

```typescript
const dividendsFiltrados = data.dividends.filter((div) => {
  const dataPagamento = new Date(div.date);
  return dataPagamento >= dataCompra;  // Apenas após a compra
});
```

**Importante:** Só contamos dividendos pagos **depois** que o usuário comprou o ativo!

---

## 📊 API de Dividendos

### Rota da API
```
src/app/api/dividends/[ticker]/route.ts
```

### Parâmetro Dinâmico `[ticker]`

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;  // "PETR4", "VALE3", etc.
  
  // Busca dividendos da API externa (brapi.dev)
  const response = await axiosClient.get(
    `https://brapi.dev/api/quote/${ticker}?dividends=true`
  );
  
  // Processa e retorna dados
}
```

### O que a API retorna?

```json
{
  "ticker": "PETR4",
  "dividends": [
    { "date": "2025-01-15", "value": 0.75 },
    { "date": "2024-10-15", "value": 0.68 },
    { "date": "2024-07-15", "value": 0.72 }
  ],
  "summary": {
    "last12Months": 2.88,
    "currentPrice": 38.50,
    "dividendYield": 7.48,
    "totalDividends": 24,
    "lastDividend": { "date": "2025-01-15", "value": 0.75 },
    "monthlyAverage": 0.24
  }
}
```

### Cálculos Realizados

#### 1. Dividend Yield (DY)

```typescript
const twelveMonthsAgo = new Date();
twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

const last12Months = dividends
  .filter(d => d.date >= twelveMonthsAgo)
  .reduce((sum, d) => sum + d.value, 0);

const dividendYield = (last12Months / currentPrice) * 100;
```

**Fórmula:** `DY = (Dividendos 12 meses / Preço Atual) × 100`

**Exemplo:**
- Dividendos pagos no ano: R$ 2,88
- Preço atual: R$ 38,50
- DY = (2,88 / 38,50) × 100 = **7,48%**

---

## 📈 Projeções de Dividendos Futuros

### Como as Projeções são Calculadas?

```typescript
const calcularProjecoes = () => {
  const projecoes = [];
  
  portfolioDividends.forEach(asset => {
    if (asset.yield > 0 && asset.quantidade > 0) {
      // Calcular dividend yield anual em reais
      const dividendoAnualPorCota = (asset.precoAtual * asset.yield) / 100;
      
      // Assumir 4 pagamentos por ano (trimestral)
      const valorPorPagamento = dividendoAnualPorCota / 4;
      
      // Gerar projeções para os próximos 12 meses
      for (let i = 1; i <= 4; i++) {
        const dataEstimada = new Date();
        dataEstimada.setMonth(dataEstimada.getMonth() + (i * 3));
        
        projecoes.push({
          ticker: asset.ticker,
          dataEstimada: dataEstimada,
          valorPorCota: valorPorPagamento,
          quantidade: asset.quantidade,
          totalEstimado: valorPorPagamento * asset.quantidade
        });
      }
    }
  });
  
  return projecoes;
};
```

### Exemplo de Projeção

```
Ativo: PETR4
Quantidade na carteira: 10 cotas
Preço Atual: R$ 38,50
Dividend Yield: 7,5%

Dividendos anuais por cota = 38,50 × 7,5% = R$ 2,89
Dividendos trimestrais = 2,89 / 4 = R$ 0,72

Projeções:
- 15/04/2025: R$ 0,72 × 10 = R$ 7,20
- 15/07/2025: R$ 0,72 × 10 = R$ 7,20
- 15/10/2025: R$ 0,72 × 10 = R$ 7,20
- 15/01/2026: R$ 0,72 × 10 = R$ 7,20

Total projetado (12 meses): R$ 28,80
```

**Importante:** São **estimativas** baseadas em histórico. Os valores reais podem variar!

---

## 📊 Componente DividendsSummary

### Localização
```
src/components/DividendsSummary.tsx
```

### Props (Dados Recebidos)

```typescript
interface DividendsSummaryProps {
  totalReceived: number;      // Total recebido até hoje
  averageYield: number;        // Dividend Yield médio da carteira
  totalPayments: number;       // Número de pagamentos recebidos
  totalProjetado: number;      // Projeção para próximos 12 meses
  totalInvestido: number;      // Valor total investido
}
```

### Cards Exibidos

```typescript
<Grid container spacing={3}>
  {/* Card 1: Total Recebido */}
  <Card>
    <Typography>Total Recebido</Typography>
    <Typography variant="h4">{formatCurrency(totalReceived)}</Typography>
  </Card>
  
  {/* Card 2: Yield Médio */}
  <Card>
    <Typography>Yield Médio</Typography>
    <Typography variant="h4">{averageYield.toFixed(2)}%</Typography>
  </Card>
  
  {/* Card 3: Projeção 12 Meses */}
  <Card>
    <Typography>Projetado (12 meses)</Typography>
    <Typography variant="h4">{formatCurrency(totalProjetado)}</Typography>
  </Card>
  
  {/* Card 4: Número de Pagamentos */}
  <Card>
    <Typography>Pagamentos Recebidos</Typography>
    <Typography variant="h4">{totalPayments}</Typography>
  </Card>
</Grid>
```

---

## 📋 Tabelas de Dados

### 1. Tabela de Projeções

Mostra os **próximos pagamentos estimados** (até 8 projeções):

```typescript
<Table>
  <TableHead>
    <TableRow>
      <TableCell>Data Estimada</TableCell>
      <TableCell>Ativo</TableCell>
      <TableCell>Valor/Cota</TableCell>
      <TableCell>Quantidade</TableCell>
      <TableCell>Total Estimado</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {projecoes.slice(0, 8).map((proj, index) => (
      <TableRow key={index}>
        <TableCell>{formatDate(proj.dataEstimada)}</TableCell>
        <TableCell>{proj.ticker}</TableCell>
        <TableCell>{formatCurrency(proj.valorPorCota)}</TableCell>
        <TableCell>{proj.quantidade}</TableCell>
        <TableCell>{formatCurrency(proj.totalEstimado)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 2. Tabela de Histórico

Mostra os **dividendos já recebidos** (até 100 mais recentes):

```typescript
<Table>
  <TableHead>
    <TableRow>
      <TableCell>Data</TableCell>
      <TableCell>Ativo</TableCell>
      <TableCell>Valor Unitário</TableCell>
      <TableCell>Quantidade</TableCell>
      <TableCell>Total Recebido</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {received.slice(0, 100).map((div, index) => (
      <TableRow key={index}>
        <TableCell>{formatDate(div.date)}</TableCell>
        <TableCell>{div.ticker}</TableCell>
        <TableCell>{formatCurrency(div.value)}</TableCell>
        <TableCell>{div.quantidade}</TableCell>
        <TableCell>{formatCurrency(div.received)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 🎯 Estados Gerenciados

```typescript
const [portfolioDividends, setPortfolioDividends] = useState<PortfolioDividend[]>([]);
const [loadingDividends, setLoadingDividends] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Interface PortfolioDividend

```typescript
interface PortfolioDividend {
  ticker: string;           // Código do ativo
  quantidade: number;       // Quantidade na carteira
  dividends: any[];         // Array de dividendos históricos
  yield: number;            // Dividend Yield
  dataCompra: Date;         // Quando o usuário comprou
  precoAtual: number;       // Cotação atual
  valorInvestido: number;   // Quanto foi investido
}
```

---

## 📊 Cálculos de Resumo

### Total Recebido

```typescript
const calculateReceived = () => {
  return portfolioDividends.flatMap(asset =>
    asset.dividends.map(div => ({
      ...div,
      ticker: asset.ticker,
      received: div.value * asset.quantidade  // Valor × Quantidade
    }))
  ).sort((a, b) => b.date.getTime() - a.date.getTime());
};

const received = calculateReceived();
const totalReceived = received.reduce((sum, div) => sum + div.received, 0);
```

### Yield Médio da Carteira

```typescript
const totalYield = portfolioDividends.length > 0
  ? portfolioDividends.reduce((sum, asset) => sum + asset.yield, 0) / portfolioDividends.length
  : 0;
```

**Fórmula:** Média simples dos DYs de todos os ativos.

### Total Projetado (12 meses)

```typescript
const projecoes = calcularProjecoes();
const totalProjetado = projecoes.reduce((sum, proj) => sum + proj.totalEstimado, 0);
```

---

## 🔍 Exemplo Completo de Fluxo

### Cenário: Usuário com 2 investimentos

**Carteira:**
- PETR4: 10 cotas, comprado em 01/01/2024
- VALE3: 5 cotas, comprado em 15/06/2024

**Passo 1:** Buscar investimentos do Firebase
```
✓ PETR4 (10 cotas)
✓ VALE3 (5 cotas)
```

**Passo 2:** Buscar dividendos de cada ativo
```
fetch('/api/dividends/PETR4')
fetch('/api/dividends/VALE3')
```

**Passo 3:** Filtrar por data de compra
```
PETR4: 12 dividendos após 01/01/2024
VALE3: 4 dividendos após 15/06/2024
```

**Passo 4:** Calcular totais
```
Total recebido:
- PETR4: R$ 0,75 × 10 × 3 pagamentos = R$ 22,50
- VALE3: R$ 1,20 × 5 × 2 pagamentos = R$ 12,00
- TOTAL: R$ 34,50
```

**Passo 5:** Gerar projeções
```
Próximos 12 meses:
- PETR4: ~R$ 28,80 estimados
- VALE3: ~R$ 24,00 estimados
- TOTAL: R$ 52,80 projetados
```

**Passo 6:** Exibir na tela
```
[Card] Total Recebido: R$ 34,50
[Card] Yield Médio: 7,8%
[Card] Projetado (12m): R$ 52,80
[Tabela] Projeções futuras
[Tabela] Histórico recebido
```

---

## 🚨 Tratamento de Casos Especiais

### 1. Carteira Vazia

```typescript
if (portfolioDividends.length === 0) {
  return (
    <Alert severity="info">
      Você ainda não possui investimentos na carteira.
      Adicione investimentos para acompanhar os dividendos.
    </Alert>
  );
}
```

### 2. Nenhum Dividendo Recebido

```typescript
if (received.length === 0) {
  return (
    <Alert severity="info">
      <Typography variant="body1">Nenhum dividendo recebido ainda</Typography>
      <Typography variant="body2">
        Os dividendos aparecem aqui apenas após a data de pagamento
        e quando você já possuía o ativo na data COM.
      </Typography>
    </Alert>
  );
}
```

### 3. Erro ao Buscar Dividendos

```typescript
try {
  const response = await fetch(`/api/dividends/${inv.ticker}`);
  const data = await response.json();
  // ...
} catch (err) {
  console.error(`Erro ao buscar dividendos de ${inv.ticker}:`, err);
  return {
    ticker: inv.ticker,
    dividends: [],  // Array vazio se der erro
    yield: 0
  };
}
```

---

## 💡 Conceitos Importantes

### 1. Dividend Yield (DY)

É a **rentabilidade em dividendos** que um ativo paga anualmente:

```
DY = (Dividendos Anuais / Preço do Ativo) × 100
```

**Exemplo:**
- Ativo custa R$ 40,00
- Paga R$ 3,00 de dividendos por ano
- DY = (3 / 40) × 100 = **7,5%**

### 2. Data COM

É a data em que você precisa **já ter o ativo** para receber o dividendo. Por isso filtramos apenas dividendos após a data de compra.

### 3. Promise.all()

Executa múltiplas requisições **em paralelo** (ao mesmo tempo):

```typescript
const dividendsPromises = investments.map(async (inv) => {
  return await fetch(`/api/dividends/${inv.ticker}`);
});

const allDividends = await Promise.all(dividendsPromises);
```

**Vantagem:** Mais rápido que fazer uma requisição de cada vez.

---

## 🔐 Proteção de Rota

```typescript
useEffect(() => {
  if (!loading && !user) {
    router.push('/login');
  }
}, [user, loading, router]);
```

Redireciona para login se o usuário não estiver autenticado.

---

## 🧪 Testando a Funcionalidade

### 1. Adicionar Investimentos
```
1. Ir em /investimentos
2. Investir em PETR4 (10 cotas)
3. Investir em VALE3 (5 cotas)
```

### 2. Visualizar Dividendos
```
1. Ir em /dividendos
2. Aguardar carregamento
3. Ver cards de resumo
4. Ver projeções futuras
5. Ver histórico (se houver dividendos após a compra)
```

---

## 📊 Exemplo de Dados Exibidos

### Cards de Resumo
```
┌─────────────────┐  ┌─────────────────┐
│ Total Recebido  │  │   Yield Médio   │
│    R$ 34,50     │  │      7,8%       │
└─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐
│ Projetado (12m) │  │   Pagamentos    │
│    R$ 52,80     │  │       16        │
└─────────────────┘  └─────────────────┘
```

### Tabela de Projeções
```
| Data       | Ativo | Valor/Cota | Qtd | Total    |
|------------|-------|------------|-----|----------|
| 15/04/2025 | PETR4 | R$ 0,72    | 10  | R$ 7,20  |
| 20/04/2025 | VALE3 | R$ 1,20    | 5   | R$ 6,00  |
| 15/07/2025 | PETR4 | R$ 0,72    | 10  | R$ 7,20  |
```

---

## 🎓 Resumo para Iniciantes

| Conceito | Explicação |
|----------|------------|
| **Dividendos** | Parte do lucro que empresas distribuem aos acionistas |
| **Dividend Yield** | Rentabilidade anual em dividendos (%) |
| **Projeções** | Estimativas de dividendos futuros baseadas em histórico |
| **Data COM** | Data limite para ter o ativo e receber dividendo |
| **Promise.all()** | Executa múltiplas requisições em paralelo |
| **API Route** | `/api/dividends/[ticker]` busca histórico de dividendos |

---

## 📌 Arquivos Relacionados

- `src/app/dividendos/page.tsx` - Página principal
- `src/app/api/dividends/[ticker]/route.ts` - API de dividendos
- `src/components/DividendsSummary.tsx` - Cards de resumo
- `src/services/firebase/config.ts` - Configuração Firestore

---

## 🔗 Próxima Tela

- **[Tela de Dashboard](./04-DASHBOARD.md)** - Visão geral completa da carteira


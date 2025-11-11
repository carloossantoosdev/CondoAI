# 📈 Tela de Dashboard

## 📋 Introdução

O dashboard é a **visão geral da carteira** do usuário. É a primeira tela que aparece após o login e mostra um resumo completo dos investimentos, performance, distribuição e notícias do mercado.

**Funcionalidades principais:**
- Visão geral financeira (valor total, lucro/prejuízo, rentabilidade)
- Gráfico de distribuição da carteira por tipo de ativo
- Lista de investimentos recentes
- Notícias do mercado financeiro
- Seção educativa sobre investimentos

---

## 📂 Localização no Projeto

```
src/
  ├── app/
  │   ├── dashboard/
  │   │   └── page.tsx              ← Tela do Dashboard
  │   │
  │   └── api/
  │       ├── quotes/
  │       │   └── [ticker]/
  │       │       └── route.ts      ← API de cotações
  │       │
  │       └── news/
  │           └── route.ts          ← API de notícias
  │
  ├── services/
  │   └── api/
  │       └── investmentService.ts  ← Serviço de cotações
  │
  └── components/
      └── layout/
          └── MainLayout.tsx        ← Layout principal
```

---

## 🌐 Rotas Envolvidas

### 1. Página do Dashboard (Frontend)
```
Arquivo: src/app/dashboard/page.tsx
URL:     https://seusite.com/dashboard
```

### 2. API de Cotações (Backend)
```
Arquivo: src/app/api/quotes/[ticker]/route.ts
URL:     /api/quotes/PETR4
```

**Uso:** Buscar preço atualizado de cada ativo da carteira.

### 3. API de Notícias (Backend)
```
Arquivo: src/app/api/news/route.ts
URL:     /api/news
```

**Uso:** Buscar notícias recentes do mercado financeiro.

---

## 🔄 Fluxo Completo (Passo a Passo)

```
1. Usuário faz login
   ↓
2. É redirecionado para /dashboard
   ↓
3. Sistema busca investimentos do Firebase
   ↓
4. Para cada investimento, busca cotação atual:
   fetch('/api/quotes/PETR4')
   fetch('/api/quotes/VALE3')
   ↓
5. Calcula métricas:
   - Valor total da carteira
   - Total investido
   - Lucro/Prejuízo
   - Rentabilidade (%)
   ↓
6. Busca notícias do mercado:
   fetch('/api/news')
   ↓
7. Exibe tudo na tela:
   - Cards de resumo
   - Gráfico de pizza (distribuição)
   - Lista de investimentos
   - Notícias
   - Dica educativa
```

---

## 🎨 Interface da Tela

### Estrutura Visual

```
┌──────────────────────────────────────────────────┐
│  📈 Bem-vindo, João! 👋                          │
│  Aqui está um resumo dos seus investimentos     │
│                                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │Valor │  │Total │  │Lucro/│  │Nº de │       │
│  │Total │  │Invest│  │Prejuí│  │Ativos│       │
│  │R$15k │  │R$10k │  │+R$5k │  │  5   │       │
│  └──────┘  └──────┘  └──────┘  └──────┘       │
│                                                  │
│  ┌─────────────────┐  ┌─────────────────┐      │
│  │ 📊 Distribuição │  │ 📋 Investimentos│      │
│  │                 │  │                 │      │
│  │   [Gráfico]     │  │ • PETR4 R$5k   │      │
│  │   [de Pizza]    │  │ • VALE3 R$4k   │      │
│  │                 │  │ • ITUB4 R$3k   │      │
│  └─────────────────┘  └─────────────────┘      │
│                                                  │
│  📰 Notícias do Mercado                         │
│  • Ibovespa fecha em alta de 2%...             │
│  • Petrobras anuncia dividendos...             │
│                                                  │
│  💡 Dica de Investimento                        │
│  O que é Preço Teto (Método Bazin)?            │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 💾 Carregamento de Dados

### Etapa 1: Buscar Investimentos do Firebase

```typescript
const loadInvestments = async () => {
  const investmentsRef = collection(db, 'portfolios', user.uid, 'investments');
  const snapshot = await getDocs(investmentsRef);
  
  const investmentsList = [];
  let totalInvestido = 0;
  let valorTotal = 0;
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const investment = {
      id: doc.id,
      ticker: data.ticker,
      nome: data.nome,
      quantidade: data.quantidade,
      precoMedio: data.precoMedio,
      valorTotal: data.valorTotal
    };
    
    investmentsList.push(investment);
    totalInvestido += investment.valorTotal;
    
    // Buscar cotação atual para calcular valor presente
    const quote = await getAssetQuote(investment.ticker, investment.type);
    if (quote) {
      valorTotal += quote.preco * investment.quantidade;
    }
  }
  
  // Calcular lucro/prejuízo e rentabilidade
  const lucroOuPrejuizo = valorTotal - totalInvestido;
  const percentualRetorno = (lucroOuPrejuizo / totalInvestido) * 100;
  
  setSummary({
    valorTotal,
    totalInvestido,
    lucroOuPrejuizo,
    percentualRetorno,
    numeroInvestimentos: investmentsList.length
  });
};
```

### Etapa 2: Buscar Notícias

```typescript
const loadNews = async () => {
  const response = await fetch('/api/news');
  const data = await response.json();
  setNews(data.news || []);
};
```

---

## 📊 Cards de Resumo

### 1. Valor Total da Carteira

```typescript
<Card sx={{ 
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white'
}}>
  <Typography variant="body2">Valor Total</Typography>
  <Typography variant="h4">
    {formatCurrency(summary.valorTotal)}
  </Typography>
</Card>
```

**Cálculo:**
```
Valor Total = Soma de (Cotação Atual × Quantidade) de todos os ativos
```

**Exemplo:**
```
PETR4: R$ 38,50 × 10 = R$ 385,00
VALE3: R$ 65,00 × 5  = R$ 325,00
ITUB4: R$ 28,00 × 20 = R$ 560,00
-------------------------
Total: R$ 1.270,00
```

### 2. Total Investido

```typescript
<Card sx={{ 
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  color: 'white'
}}>
  <Typography variant="body2">Total Investido</Typography>
  <Typography variant="h4">
    {formatCurrency(summary.totalInvestido)}
  </Typography>
</Card>
```

**Cálculo:**
```
Total Investido = Soma de (Preço de Compra × Quantidade)
```

### 3. Lucro ou Prejuízo

```typescript
<Card sx={{ 
  background: summary.lucroOuPrejuizo >= 0
    ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'  // Azul (lucro)
    : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'  // Rosa (prejuízo)
}}>
  <Typography variant="body2">Lucro/Prejuízo</Typography>
  <Typography variant="h4">
    {formatCurrency(summary.lucroOuPrejuizo)}
  </Typography>
  <Typography>
    {summary.percentualRetorno.toFixed(2)}%
  </Typography>
</Card>
```

**Cálculo:**
```
Lucro/Prejuízo = Valor Total - Total Investido
Rentabilidade (%) = (Lucro / Total Investido) × 100
```

**Exemplo:**
```
Valor Total: R$ 1.270,00
Total Investido: R$ 1.000,00
Lucro: R$ 270,00
Rentabilidade: 27%
```

### 4. Número de Investimentos

```typescript
<Card sx={{ 
  background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
  color: '#2d3436'
}}>
  <Typography variant="body2">Investimentos</Typography>
  <Typography variant="h4">
    {summary.numeroInvestimentos}
  </Typography>
  <Typography>
    {summary.numeroInvestimentos === 1 ? 'ativo' : 'ativos'}
  </Typography>
</Card>
```

---

## 📊 Gráfico de Distribuição

### Biblioteca Utilizada: Recharts

```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
```

### Preparação dos Dados

```typescript
const getDistributionData = () => {
  const distribution: Record<string, number> = {
    acao: 0,
    fundo: 0,
    rendaFixa: 0,
    cripto: 0
  };
  
  investments.forEach((inv) => {
    distribution[inv.type] += inv.valorTotal;
  });
  
  return Object.entries(distribution)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: key === 'acao' ? 'Ações' : 
            key === 'fundo' ? 'Fundos' : 
            key === 'rendaFixa' ? 'Renda Fixa' : 'Cripto',
      value
    }));
};
```

**Exemplo de dados gerados:**
```javascript
[
  { name: 'Ações', value: 710 },      // 56% da carteira
  { name: 'Fundos', value: 325 },     // 25%
  { name: 'Renda Fixa', value: 235 }  // 19%
]
```

### Renderização do Gráfico

```typescript
<PieChart>
  <Pie
    data={getDistributionData()}
    cx="50%"
    cy="50%"
    labelLine={false}
    label={(entry) => `${entry.name}: ${((entry.value / summary.totalInvestido) * 100).toFixed(1)}%`}
    outerRadius={90}
    dataKey="value"
  >
    {getDistributionData().map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip formatter={(value: number) => formatCurrency(value)} />
  <Legend />
</PieChart>
```

**Cores Utilizadas:**
```typescript
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
```

---

## 📋 Lista de Investimentos Recentes

```typescript
<Box>
  {investments.slice(0, 5).map((inv, index) => (
    <Box
      key={inv.id}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        py: 2,
        px: 2,
        bgcolor: index % 2 === 0 ? 'grey.50' : 'transparent',
        '&:hover': {
          bgcolor: 'primary.light'
        }
      }}
    >
      <Box>
        <Typography variant="body1" fontWeight={600}>
          {inv.ticker}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {inv.nome}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body1" fontWeight={600}>
          {formatCurrency(inv.valorTotal)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {inv.quantidade} {inv.quantidade === 1 ? 'unidade' : 'unidades'}
        </Typography>
      </Box>
    </Box>
  ))}
</Box>
```

Mostra os **5 investimentos mais recentes** com hover effect.

---

## 📰 API de Notícias

### Rota da API
```
src/app/api/news/route.ts
```

### Como Funciona?

```typescript
export async function GET() {
  const parser = new Parser();  // RSS Parser
  
  const feeds = [
    { url: 'https://www.infomoney.com.br/mercados/feed/', source: 'InfoMoney' },
    { url: 'https://www.infomoney.com.br/onde-investir/feed/', source: 'InfoMoney' },
    { url: 'https://valor.globo.com/financas/rss', source: 'Valor Econômico' }
  ];
  
  const allNews = [];
  
  for (const feed of feeds) {
    const feedData = await parser.parseURL(feed.url);
    feedData.items?.slice(0, 10).forEach(item => {
      // Filtrar por palavras-chave relevantes
      if (isRelevantNews(item)) {
        allNews.push({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: feed.source
        });
      }
    });
  }
  
  return NextResponse.json({
    news: allNews.slice(0, 10)
  });
}
```

### Filtro de Relevância

```typescript
const palavrasChaveRelevantes = [
  'bolsa', 'ações', 'ibovespa', 'investimento', 'fundos',
  'dividendo', 'mercado', 'cotação', 'dólar', 'juros',
  'selic', 'petrobras', 'vale', 'itaú', 'b3', 'bovespa'
];

const palavrasChaveExcluir = [
  'futebol', 'esporte', 'novela', 'crime', 'entretenimento'
];
```

**Lógica:** Só incluir notícias que contenham palavras relevantes e não contenham palavras irrelevantes.

### Exibição das Notícias

```typescript
{news.slice(0, 5).map((item, index) => (
  <Box key={index}>
    <a href={item.link} target="_blank" rel="noopener noreferrer">
      <Typography variant="body1" fontWeight={600}>
        {item.title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="caption" color="primary.main">
          {item.source}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(item.pubDate).toLocaleDateString('pt-BR')}
        </Typography>
      </Box>
    </a>
  </Box>
))}
```

---

## 📚 API de Cotações

### Rota da API
```
src/app/api/quotes/[ticker]/route.ts
```

### Estratégia de Caching

A API usa uma estratégia de **cache + fallback** para otimizar performance:

```
1. Verificar cache do Firebase
   ↓
   Se encontrou → Retornar do cache
   ↓
2. Se não, buscar do Yahoo Finance
   ↓
   Se encontrou → Salvar no cache + Retornar
   ↓
3. Se falhou, buscar da brapi.dev (fallback)
   ↓
   Se encontrou → Salvar no cache + Retornar
   ↓
4. Se tudo falhou → Erro 404
```

### Código Simplificado

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  
  // 1. Verificar cache
  const cached = await getCachedQuote(ticker);
  if (cached) {
    return NextResponse.json({ ...cached, source: 'cache' });
  }
  
  // 2. Tentar Yahoo Finance
  try {
    const quote = await yahooFinance.quote(`${ticker}.SA`);
    if (quote) {
      const quoteData = {
        ticker,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent
      };
      await setCachedQuote(ticker, quoteData);
      return NextResponse.json({ ...quoteData, source: 'yahoo-finance' });
    }
  } catch (error) {
    // 3. Fallback: brapi.dev
    const response = await fetch(`https://brapi.dev/api/quote/${ticker}`);
    const data = await response.json();
    // ... salvar e retornar
  }
}
```

### Por que Cache?

- **Performance:** Não precisa buscar dados externos toda vez
- **Economia:** Reduz chamadas a APIs externas (que podem ter limites)
- **Confiabilidade:** Se a API externa falhar, ainda temos dados em cache

---

## 🎨 Seção Educativa

### Dica sobre Preço Teto

```typescript
<Card sx={{ 
  background: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)'
}}>
  <Typography variant="h6">
    O que é Preço Teto (Método Bazin)?
  </Typography>
  
  <Typography variant="body1">
    O Preço Teto é o preço máximo que você deveria pagar 
    por uma ação segundo o método Bazin. Ele é calculado 
    com base no Dividend Yield (DY) da ação.
  </Typography>
  
  <Typography variant="body1">
    <strong>Regra:</strong> Só compre ações que pagam pelo 
    menos 6% de DY ao ano. Se a ação paga menos que isso, 
    o preço está caro. Se paga mais, está barato!
  </Typography>
  
  <Box sx={{ p: 2, bgcolor: 'white' }}>
    <Typography variant="body2">
      <strong>Exemplo:</strong>
      <br />
      • Ação custa R$ 40,00
      <br />
      • Paga R$ 3,00 de dividendos/ano
      <br />
      • DY = 3,00 ÷ 40 = 7,5%
      <br />
      • Preço Teto = R$ 50,00 (baseado em 6% DY)
      <br />
      • ✅ COMPRA! Está abaixo do teto
    </Typography>
  </Box>
</Card>
```

---

## 🎯 Estados Gerenciados

```typescript
const [investments, setInvestments] = useState<Investment[]>([]);
const [summary, setSummary] = useState<PortfolioSummary>({
  valorTotal: 0,
  totalInvestido: 0,
  lucroOuPrejuizo: 0,
  percentualRetorno: 0,
  numeroInvestimentos: 0
});
const [loadingData, setLoadingData] = useState(true);
const [news, setNews] = useState<NewsItem[]>([]);
const [loadingNews, setLoadingNews] = useState(true);
```

### Interface PortfolioSummary

```typescript
interface PortfolioSummary {
  valorTotal: number;           // Valor atual da carteira
  totalInvestido: number;       // Quanto foi investido
  lucroOuPrejuizo: number;      // Diferença (lucro ou prejuízo)
  percentualRetorno: number;    // Rentabilidade em %
  numeroInvestimentos: number;  // Quantidade de ativos
}
```

---

## 🔍 Fluxo Completo de Cálculos

### Exemplo Prático

**Carteira do Usuário:**
```
1. PETR4: 10 cotas compradas a R$ 35,00 = R$ 350,00
2. VALE3: 5 cotas compradas a R$ 60,00 = R$ 300,00
3. ITUB4: 20 cotas compradas a R$ 25,00 = R$ 500,00
```

**Total Investido:** R$ 1.150,00

**Cotações Atuais (buscadas via API):**
```
PETR4: R$ 38,50
VALE3: R$ 65,00
ITUB4: R$ 28,00
```

**Valor Atual da Carteira:**
```
PETR4: 10 × R$ 38,50 = R$ 385,00
VALE3: 5 × R$ 65,00 = R$ 325,00
ITUB4: 20 × R$ 28,00 = R$ 560,00
Total: R$ 1.270,00
```

**Resultado:**
```
Valor Total: R$ 1.270,00
Total Investido: R$ 1.150,00
Lucro: R$ 120,00
Rentabilidade: 10,43%
```

**Distribuição por Tipo:**
```
Ações: R$ 1.270,00 (100%)
```

---

## 🚨 Tratamento de Casos Especiais

### 1. Carteira Vazia

```typescript
{investments.length === 0 ? (
  <Card>
    <CardContent sx={{ textAlign: 'center', py: 10 }}>
      <Box sx={{ 
        width: 100, 
        height: 100, 
        bgcolor: 'primary.light',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 3
      }}>
        <ShowChart sx={{ fontSize: 50, color: 'white' }} />
      </Box>
      <Typography variant="h5">
        Você ainda não tem investimentos
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Comece sua jornada de investimentos explorando nossos 
        ativos disponíveis
      </Typography>
    </CardContent>
  </Card>
) : (
  // Mostrar gráficos e dados...
)}
```

### 2. Erro ao Buscar Cotação

Se uma cotação falhar, usa o preço de compra:

```typescript
const quote = await getAssetQuote(investment.ticker, investment.type);
if (quote) {
  valorTotal += quote.preco * investment.quantidade;
} else {
  valorTotal += investment.valorTotal;  // Usa valor de compra
}
```

### 3. Notícias Indisponíveis

```typescript
{news.length === 0 ? (
  <Card>
    <CardContent sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="body2" color="text.secondary">
        Nenhuma notícia disponível no momento
      </Typography>
    </CardContent>
  </Card>
) : (
  // Mostrar notícias...
)}
```

---

## 💡 Conceitos Importantes

### 1. useEffect com Dependências

```typescript
useEffect(() => {
  if (user) {
    loadInvestments();
    loadNews();
  }
}, [user]);  // Executa quando 'user' mudar
```

**Explicação:** Quando o usuário faz login, `user` muda de `null` para um objeto. Isso dispara o `useEffect` que carrega os dados.

### 2. Async em Loop

```typescript
for (const doc of snapshot.docs) {
  const quote = await getAssetQuote(ticker, type);
  // ...
}
```

**Atenção:** Isso executa **sequencialmente** (um de cada vez). Para otimizar, poderia usar `Promise.all()`.

### 3. Gradientes CSS

```typescript
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
```

**Explicação:** Cria um fundo com transição suave entre duas cores (azul → roxo) em diagonal.

### 4. Conditional Rendering

```typescript
{loadingData ? (
  <CircularProgress />
) : (
  <DadosDaCarteira />
)}
```

**Explicação:** Se estiver carregando, mostra spinner. Caso contrário, mostra os dados.

---

## 🔐 Proteção de Rota

```typescript
useEffect(() => {
  if (!loading && !user) {
    router.push('/login');
  }
}, [user, loading, router]);
```

Se não houver usuário autenticado, redireciona para `/login`.

---

## 🧪 Testando o Dashboard

### 1. Fazer Login
```
Acessar /login → Entrar com Google
```

### 2. Adicionar Investimentos
```
Ir em /investimentos → Investir em alguns ativos
```

### 3. Visualizar Dashboard
```
Voltar para /dashboard (ou será redirecionado automaticamente)
```

### 4. Verificar Dados
```
✓ Cards de resumo atualizados
✓ Gráfico de distribuição
✓ Lista de investimentos
✓ Notícias do mercado
```

---

## 📊 Exemplo de Dashboard Completo

### Cards
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Valor Total  │  │   Total      │  │    Lucro     │  │    Ativos    │
│  R$ 1.270    │  │  Investido   │  │  R$ 120,00   │  │      3       │
│              │  │  R$ 1.150    │  │   +10,43%    │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### Gráfico
```
       Ações: 56%
      /────────\
     /          \
    |   Gráfico  |
    |  de Pizza  |
     \          /
      \────────/
Fundos: 25%       Renda Fixa: 19%
```

### Investimentos
```
• PETR4 - Petrobras ........................ R$ 385,00
• VALE3 - Vale S.A. ........................ R$ 325,00
• ITUB4 - Itaú Unibanco ................... R$ 560,00
```

### Notícias
```
📰 InfoMoney - 26/10/2025
   "Ibovespa fecha em alta de 2% impulsionado por..."

📰 Valor Econômico - 26/10/2025
   "Petrobras anuncia dividendos extraordinários..."
```

---

## 🎓 Resumo para Iniciantes

| Conceito | Explicação |
|----------|------------|
| **Dashboard** | Painel de visão geral da carteira |
| **Valor Total** | Quanto vale sua carteira hoje |
| **Lucro/Prejuízo** | Diferença entre valor atual e investido |
| **Rentabilidade (%)** | Quanto você ganhou ou perdeu em % |
| **Gráfico de Pizza** | Distribuição visual dos tipos de ativos |
| **API de Cotações** | Busca preços atualizados dos ativos |
| **API de Notícias** | Busca notícias do mercado via RSS |
| **Cache** | Armazena dados para evitar buscas repetidas |

---

## 📌 Arquivos Relacionados

- `src/app/dashboard/page.tsx` - Página principal do dashboard
- `src/app/api/quotes/[ticker]/route.ts` - API de cotações
- `src/app/api/news/route.ts` - API de notícias
- `src/services/api/investmentService.ts` - Serviço de busca de cotações
- `src/services/firebase/quotesCache.ts` - Sistema de cache

---

## 🎯 Fluxo Completo Resumido

```
Login → Dashboard
   ↓
Buscar investimentos (Firebase)
   ↓
Para cada investimento:
   → Buscar cotação atual (API)
   → Calcular valor presente
   ↓
Calcular métricas:
   → Valor total
   → Lucro/Prejuízo
   → Rentabilidade %
   ↓
Buscar notícias (API)
   ↓
Renderizar:
   → 4 Cards de resumo
   → Gráfico de pizza
   → Lista de investimentos
   → 5 Notícias recentes
   → Dica educativa
```

---

## 🔗 Outras Telas da Aplicação

- **[Tela de Login](./01-LOGIN.md)** - Autenticação com Google
- **[Tela de Investimentos](./02-INVESTIMENTOS.md)** - Explorar e investir
- **[Tela de Dividendos](./03-DIVIDENDOS.md)** - Acompanhar proventos

---

## 🎉 Conclusão

O Dashboard é o **centro de controle** da aplicação, oferecendo uma visão completa e em tempo real da carteira de investimentos do usuário. Ele integra múltiplas fontes de dados (Firebase, APIs externas, notícias) e apresenta tudo de forma visual e intuitiva.

**Tecnologias principais:**
- Next.js 15 (App Router)
- Firebase (Firestore)
- Material-UI
- Recharts (gráficos)
- RSS Parser (notícias)
- Yahoo Finance + brapi.dev (cotações)


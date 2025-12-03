# ⚡ Referência Rápida - Fluxos CondoAI

Guia de consulta rápida para ter ao lado enquanto desenha no Excalidraw.

---

## 🎨 PALETA DE CORES

```
🟦 AZUL #3B82F6     → Login/Cadastro
🟩 VERDE #10B981    → Dashboard
🟧 LARANJA #FF6B2D  → Investimentos
🟨 AMARELO #F59E0B  → Perfil
🟪 ROXO #8B5CF6     → Dividendos
```

---

## 📊 TABELAS DO BANCO

### `users`
```
• id (UUID)
• email
• display_name
• subscription_status ('free'/'paid')
• risk_profile ('conservador'/'moderado'/'arrojado')
```

### `investments`
```
• id (UUID)
• user_id (FK → users.id)
• type ('acao'/'fundo'/'rendaFixa'/'cripto')
• ticker
• nome
• quantidade
• preco_medio
• data_compra
• valor_total
```

---

## 🔐 FLUXO: LOGIN (AZUL)

```
[Login Page]
    ↓ signIn(email, password)
[AuthContext]
    ↓ supabaseClient.auth.signInWithPassword()
[Supabase Auth] ✓ Valida
    ↓ fetchUserData()
[Tabela: users] 📖 SELECT
    ↓ Retorna dados
[AuthContext] 💾 Salva no state
    ↓ router.push()
[Dashboard] ✅
```

**Operações:**
- 📖 SELECT * FROM users WHERE id = ?
- 📝 INSERT (só no cadastro, se não existir)

---

## 📊 FLUXO: DASHBOARD (VERDE)

```
[Dashboard Page]
    ↓ loadInvestments()
[Tabela: investments] 📖 SELECT WHERE user_id = ?
    ↓ Para cada investment
[API /quotes/[ticker]] → [BRAPI] GET cotação
    ↓ Retorna price
[Cálculos]
    • valorAtual = price × quantidade
    • lucro = valorTotal - totalInvestido
    ↓
[Exibe] Cards + Gráfico + Lista
```

**Operações:**
- 📖 SELECT * FROM investments WHERE user_id = ?
- 🌐 API: GET brapi.dev/api/quote/{ticker}

---

## 💼 FLUXO: INVESTIMENTOS (LARANJA)

```
[Investimentos Page]
    ↓ loadAssets()
[Verifica] user.riskProfile?
    • Conservador → rendaFixa
    • Moderado → rendaFixa, fundo, acao
    • Arrojado → todos
    ↓
[BRAPI] GET lista de ativos
    ↓ Filtra por perfil
[Exibe] Grid de cards
    ↓ Usuário clica "Investir"
[Modal] Define quantidade
    ↓ Confirma
[Tabela: investments] 📝 INSERT
    ↓
[Sucesso] ✅
```

**Operações:**
- 📝 INSERT INTO investments VALUES (...)
- 🌐 API: GET brapi.dev/api/quote/list

---

## 👤 FLUXO: PERFIL (AMARELO)

```
[Perfil Page]
    ↓ user.riskProfile? 
    NÃO → [Questionário] 5 perguntas
    ↓ Cada resposta = score 1-3
[Cálculo]
    average = Σ scores / 5
    • ≤1.5 → conservador
    • ≤2.5 → moderado
    • >2.5 → arrojado
    ↓
[Tabela: users] ✏️ UPDATE risk_profile
    ↓
[AuthContext] refreshUser()
    ↓
[Exibe] Resultado + Recomendações
```

**Operações:**
- ✏️ UPDATE users SET risk_profile = ? WHERE id = ?

---

## 💰 FLUXO: DIVIDENDOS (ROXO)

```
[Dividendos Page]
    ↓ loadDividends()
[Tabela: investments] 📖 SELECT WHERE type = 'acao'
    ↓ Para cada ação
[API /dividends/[ticker]] → [BRAPI]
    ↓ Retorna dividends[]
[Filtra]
    • type = 'cash'
    • Últimos 12 meses
    • divDate >= dataCompra? RECEBEU ✓ : NÃO
    ↓
[Cálculos]
    totalRecebido = Σ (valor × quantidade)
    ↓
[Exibe] Cards + Tabela
```

**Operações:**
- 📖 SELECT * FROM investments WHERE user_id = ? AND type = 'acao'
- 🌐 API: GET brapi.dev/api/quote/{ticker}/dividends

---

## 🔤 ÍCONES PARA USAR

### Páginas/Componentes:
```
□ Retângulo          → Páginas, componentes
◊ Losango           → Decisões (if/else)
⬭ Cilindro          → Tabelas (BD)
☁ Nuvem             → APIs externas
○ Círculo           → Início/fim
```

### Operações:
```
📝 INSERT           → Criar registro
📖 SELECT (READ)    → Ler dados
✏️ UPDATE           → Atualizar
❌ DELETE           → Não usado
🌐 API CALL         → Chamada externa
```

### Status:
```
✅ Sucesso
❌ Erro
⚠️ Atenção
🔐 Autenticação
💾 Salvar no state
```

---

## 📏 ESTRUTURA EM CAMADAS

```
┌─────────────────────────────────┐
│  CAMADA 1: FRONTEND             │ #F8FAFC (claro)
│  [Páginas React]                │
└─────────────────────────────────┘
          ↓
┌─────────────────────────────────┐
│  CAMADA 2: CONTEXT/API          │ #E2E8F0 (médio)
│  [AuthContext] [API Routes]     │
└─────────────────────────────────┘
          ↓
┌─────────────────────────────────┐
│  CAMADA 3: BACKEND              │ #CBD5E1 (escuro)
│  [Supabase] [BRAPI]             │
└─────────────────────────────────┘
          ↓
┌─────────────────────────────────┐
│  CAMADA 4: BANCO DE DADOS       │ #64748B (sólido)
│  [users] [investments]          │
└─────────────────────────────────┘
```

---

## 🎯 ELEMENTOS-CHAVE

### AuthContext (use em todos os fluxos):
```
• user (estado global)
• signIn()
• signUp()
• signOut()
• refreshUser()
```

### Supabase Client:
```
• auth.signInWithPassword()
• auth.signUp()
• from('tabela').select()
• from('tabela').insert()
• from('tabela').update()
```

### APIs Externas:
```
BRAPI:
• GET /api/quote/{ticker}        → Cotação
• GET /api/quote/list            → Lista ações
• GET /api/quote/{ticker}/dividends → Dividendos
```

---

## 📋 CHECKLIST DE ELEMENTOS

### Para cada fluxo, incluir:

- [ ] **Página inicial** (retângulo)
- [ ] **Seta para baixo** com nome da função
- [ ] **Componente intermediário** (AuthContext/API)
- [ ] **Seta para serviço** (Supabase/BRAPI)
- [ ] **Operação no banco** (SELECT/INSERT/UPDATE)
- [ ] **Tabela envolvida** (cilindro)
- [ ] **Seta de retorno** com dados
- [ ] **Página final** com resultado
- [ ] **Anotações importantes** (laterais)

### Decisões (Losangos):

- [ ] "Credenciais válidas?" (Login)
- [ ] "User tem risk_profile?" (Investimentos/Perfil)
- [ ] Setas SIM/NÃO bem definidas

### Cores consistentes:

- [ ] Mesmo fluxo = mesma cor
- [ ] Setas na cor do fluxo
- [ ] Camadas com gradiente de cinza

---

## 🔍 DADOS QUE FLUEM

### Login → Dashboard:
```
User data:
  uid, email, displayName,
  subscriptionStatus, riskProfile
```

### Dashboard → Componentes:
```
Investments array:
  [ { id, ticker, quantidade, preco_medio, ... } ]
  
Summary:
  { valorTotal, totalInvestido, lucroOuPrejuizo,
    percentualRetorno, numeroInvestimentos }
```

### Investimentos → Modal:
```
Asset:
  { ticker, nome, preco, tipo, variacao }
  
User input:
  quantidade
  
Calculated:
  valorTotal = preco × quantidade
```

### Perfil → Usuário:
```
Quiz answers:
  [score1, score2, score3, score4, score5]
  
Calculated:
  riskProfile = 'conservador' | 'moderado' | 'arrojado'
```

### Dividendos → Tabela:
```
Dividends:
  [ { date, value, type } ]
  
Filtered & Calculated:
  [ { ticker, date, valorPorCota, quantidade,
      totalRecebido, recebeu: boolean } ]
```

---

## ⚡ ATALHOS VISUAIS

### Quando usar cada forma:

| Elemento | Forma | Exemplo |
|----------|-------|---------|
| Página/Tela | □ Retângulo | Login Page |
| Função/Método | □ Retângulo arredondado | signIn() |
| Decisão | ◊ Losango | Válido? |
| Tabela BD | ⬭ Cilindro | users |
| API Externa | ☁ Nuvem | BRAPI |
| Dados | ▭ Paralelogramo | { user } |

### Anotações importantes:

Coloque sempre ao lado dos elementos principais:
- Queries SQL específicas
- Dados que retornam
- Cálculos realizados
- Redirecionamentos

---

## 🎨 TEMPLATE DE LEGENDA

```
┌────────────────────────────────────┐
│          LEGENDA                   │
├────────────────────────────────────┤
│ Cores dos Fluxos:                  │
│ 🟦 Login/Cadastro                  │
│ 🟩 Dashboard                       │
│ 🟧 Investimentos                   │
│ 🟨 Perfil                          │
│ 🟪 Dividendos                      │
│                                    │
│ Operações:                         │
│ 📝 INSERT  📖 SELECT  ✏️ UPDATE    │
│                                    │
│ Tabelas:                           │
│ ⬭ users        ⬭ investments      │
│                                    │
│ APIs:                              │
│ ☁ BRAPI (Cotações + Dividendos)   │
│ ☁ Supabase (Auth + Database)      │
└────────────────────────────────────┘
```

---

## 📏 PROPORÇÕES RECOMENDADAS

### Tamanhos dos elementos:
```
Páginas principais:     Grande (200×100px)
Componentes/Context:    Médio (150×80px)
Tabelas:               Médio (150×80px)
APIs:                  Médio (150×80px)
Funções:               Pequeno (100×50px)
Decisões:              Médio (120×80px)
```

### Espaçamento:
```
Entre camadas:          80px vertical
Entre elementos:        40px horizontal
Margem do canvas:       50px
```

---

## ✅ VALIDAÇÃO FINAL

Antes de finalizar o desenho, verifique:

### Clareza:
- [ ] Todas as setas têm direção clara
- [ ] Textos legíveis (tamanho mínimo 12pt)
- [ ] Cores não confundem elementos
- [ ] Legenda está presente

### Completude:
- [ ] Todos os 5 fluxos estão representados
- [ ] Tabelas do BD estão incluídas
- [ ] APIs externas estão marcadas
- [ ] Operações estão anotadas

### Precisão:
- [ ] Queries SQL estão corretas
- [ ] Nomes de tabelas/campos corretos
- [ ] Fluxo faz sentido tecnicamente
- [ ] Não há elementos duplicados

---

**Imprima ou mantenha este documento ao lado enquanto desenha! 🎨**



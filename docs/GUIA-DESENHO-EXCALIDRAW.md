# Guia para Desenho no Excalidraw - CondoAI

## 🎨 Guia Visual para Criar o Diagrama

Este documento fornece instruções específicas para criar o diagrama da aplicação CondoAI no Excalidraw.

---

## 📐 Layout Geral Sugerido

### Estrutura em Camadas (de cima para baixo):

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA FRONTEND                          │
│  [Login] [Dashboard] [Investimentos] [Perfil] [Dividendos] │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  CAMADA DE CONTEXTO                         │
│              [AuthContext] [API Routes]                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA BACKEND                           │
│         [Supabase Auth] [Supabase DB] [BRAPI API]          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  BANCO DE DADOS                             │
│              [Tabela: users] [Tabela: investments]          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Fluxo 1: LOGIN/CADASTRO (Use cor AZUL)

### Elementos no Excalidraw:

1. **Retângulo "Tela de Login"** (Frontend)
   - Texto: "Login/Cadastro"
   - Adicionar campos: "Email", "Senha", "Nome (opcional)"

2. **Seta para baixo** → "useAuth().signIn() ou signUp()"

3. **Retângulo "AuthContext"** (Context)
   - Texto: "AuthContext"
   - Função: "signIn() / signUp()"

4. **Seta para baixo** → "Supabase Auth"

5. **Retângulo "Supabase Auth"** (Backend)
   - Texto: "Supabase Auth"
   - Operação: "signInWithPassword()" ou "signUp()"

6. **Seta para baixo** → "Valida credenciais"

7. **Losango de Decisão**: "Credenciais válidas?"
   - SIM → Continua
   - NÃO → Retorna erro para Login

8. **Seta para baixo** → "Busca/Cria usuário na tabela users"

9. **Cilindro "Tabela users"** (Banco de Dados)
   - Texto: "Tabela: users"
   - Operações:
     - SELECT: Busca usuário existente
     - INSERT: Se não existir, cria novo (apenas cadastro)
   - Campos retornados: id, email, display_name, subscription_status, risk_profile

10. **Seta para cima** → "Retorna dados do usuário"

11. **Retângulo "AuthContext"** novamente
    - Texto: "Salva user no state"

12. **Seta para direita** → "Redireciona para /dashboard"

13. **Retângulo "Dashboard"** (Frontend)
    - Texto: "Dashboard"

### Anotações importantes:
- Adicionar nota: "Senha é validada pelo Supabase Auth (não armazenada no app)"
- Adicionar nota: "ID do usuário vem do auth.users (Supabase)"
- Adicionar nota: "subscription_status = 'free' por padrão"

---

## 📊 Fluxo 2: DASHBOARD (Use cor VERDE)

### Elementos no Excalidraw:

1. **Retângulo "Dashboard"** (Frontend)
   - Texto: "Dashboard"
   - Trigger: "useEffect(() => loadInvestments())"

2. **Seta para baixo** → "Query: SELECT investments"

3. **Cilindro "Tabela investments"** (Banco de Dados)
   - Texto: "Tabela: investments"
   - Query: "SELECT * FROM investments WHERE user_id = ?"
   - Retorna: Array de investimentos do usuário

4. **Seta para direita** → "Para cada investimento"

5. **Retângulo "API Route"** (API)
   - Texto: "/api/quotes/[ticker]"
   - Operação: "fetch()"

6. **Seta para direita** → "Chama API Externa"

7. **Retângulo "BRAPI"** (API Externa)
   - Texto: "BRAPI API"
   - Endpoint: "GET /api/quote/{ticker}"
   - Retorna: { price, change, ... }

8. **Seta de volta** → "Retorna cotação"

9. **Retângulo "Cálculos"** (Lógica)
   - Texto: "Calcula Resumo"
   - Operações:
     - valorAtual = price × quantidade
     - totalInvestido = Σ valor_total
     - valorTotal = Σ valorAtual
     - lucroOuPrejuizo = valorTotal - totalInvestido
     - percentualRetorno = (lucro / totalInvestido) × 100

10. **Seta para cima** → "Atualiza state"

11. **Retângulo "Dashboard"** novamente
    - Texto: "Exibe:"
    - 4 Cards de resumo
    - Gráfico de pizza (distribuição)
    - Lista de 5 investimentos recentes

### Anotações importantes:
- Adicionar nota: "Uma chamada à API para cada ticker"
- Adicionar nota: "Valores são calculados em tempo real"
- Adicionar nota: "BRAPI fornece cotação atual do mercado"

---

## 💼 Fluxo 3: INVESTIMENTOS (Use cor LARANJA)

### Elementos no Excalidraw:

1. **Retângulo "Página Investimentos"** (Frontend)
   - Texto: "Investimentos"
   - Trigger: "useEffect(() => loadAssets())"

2. **Losango de Decisão**: "Usuário tem risk_profile?"
   - SIM → Usa perfil do usuário
   - NÃO → Usa 'conservador' padrão + mostra banner

3. **Retângulo "Filtro por Perfil"** (Lógica)
   - Texto: "getAvailableInvestmentTypes()"
   - Conservador: apenas 'rendaFixa'
   - Moderado: 'rendaFixa', 'fundo', 'acao'
   - Arrojado: todos os tipos

4. **Seta para direita** → "Busca ativos disponíveis"

5. **Retângulo "BRAPI + Dados Locais"** (API)
   - Texto: "Busca Ativos"
   - BRAPI: Lista de ações (GET /api/quote/list)
   - Local: Fundos, Renda Fixa, Cripto (mockados)

6. **Seta de volta** → "Retorna lista de ativos"

7. **Retângulo "Filtra ativos"** (Lógica)
   - Texto: "Filtra por perfil"
   - Mantém apenas ativos compatíveis

8. **Seta para cima** → "Exibe grid de cards"

9. **Retângulo "Página Investimentos"** novamente
   - Texto: "Cards de Ativos"
   - Cada card mostra: ticker, nome, preço, variação

10. **Ação do Usuário**: "Clica em 'Investir'"

11. **Retângulo "Modal de Investimento"** (Frontend)
    - Texto: "Modal"
    - Campos: Quantidade
    - Mostra: Valor total = preço × quantidade

12. **Ação do Usuário**: "Confirma investimento"

13. **Seta para baixo** → "INSERT INTO investments"

14. **Cilindro "Tabela investments"** (Banco de Dados)
    - Texto: "Tabela: investments"
    - Operação: INSERT
    - Dados salvos:
      - user_id
      - type (acao/fundo/rendaFixa/cripto)
      - ticker
      - nome
      - quantidade
      - preco_medio
      - data_compra (NOW())
      - valor_total

15. **Seta de volta** → "Sucesso"

16. **Retângulo "Página Investimentos"** novamente
    - Texto: "Mostra mensagem de sucesso"
    - Fecha modal

### Anotações importantes:
- Adicionar nota: "Perfil 'conservador' por padrão para segurança"
- Adicionar nota: "Banner incentiva fazer quiz de perfil"
- Adicionar nota: "Apenas ativos compatíveis são exibidos"

---

## 👤 Fluxo 4: PERFIL DE INVESTIDOR (Use cor AMARELO)

### Elementos no Excalidraw:

1. **Retângulo "Página Perfil"** (Frontend)
   - Texto: "Perfil do Investidor"

2. **Losango de Decisão**: "Usuário já tem risk_profile?"
   - SIM → Mostra perfil atual + opção "Refazer"
   - NÃO → Mostra questionário

3. **Retângulo "Questionário"** (Frontend)
   - Texto: "5 Perguntas"
   - Pergunta 1: Objetivo com investimentos
   - Pergunta 2: Reação a perdas
   - Pergunta 3: Conhecimento sobre investimentos
   - Pergunta 4: Prazo dos investimentos
   - Pergunta 5: % patrimônio em ações

4. **Seta para baixo** (após última pergunta)

5. **Retângulo "Cálculo do Perfil"** (Lógica)
   - Texto: "calculateAndSaveResult()"
   - Cada resposta tem score 1-3
   - Calcula média dos scores
   - Define perfil:
     - average ≤ 1.5 → 'conservador'
     - 1.5 < average ≤ 2.5 → 'moderado'
     - average > 2.5 → 'arrojado'

6. **Seta para baixo** → "UPDATE users"

7. **Cilindro "Tabela users"** (Banco de Dados)
   - Texto: "Tabela: users"
   - Operação: UPDATE
   - Query: "UPDATE users SET risk_profile = ?, updated_at = NOW() WHERE id = ?"

8. **Seta de volta** → "Atualiza contexto"

9. **Retângulo "AuthContext"** (Context)
   - Texto: "refreshUser()"
   - Atualiza user.riskProfile no state global

10. **Seta para cima** → "Mostra resultado"

11. **Retângulo "Página Perfil"** novamente
    - Texto: "Exibe Resultado"
    - Mostra: Ícone do perfil
    - Mostra: Descrição do perfil
    - Mostra: Recomendações de investimentos
    - Botão: "Ver Investimentos Recomendados"

### Anotações importantes:
- Adicionar nota: "Salvamento automático após última pergunta"
- Adicionar nota: "Perfil atualiza filtros em toda a aplicação"
- Adicionar nota: "Usuário pode refazer o quiz a qualquer momento"

---

## 💰 Fluxo 5: DIVIDENDOS (Use cor ROXO)

### Elementos no Excalidraw:

1. **Retângulo "Página Dividendos"** (Frontend)
   - Texto: "Dividendos"
   - Trigger: "useEffect(() => loadDividends())"

2. **Seta para baixo** → "Query: SELECT ações"

3. **Cilindro "Tabela investments"** (Banco de Dados)
   - Texto: "Tabela: investments"
   - Query: "SELECT * FROM investments WHERE user_id = ? AND type = 'acao'"
   - Retorna: Apenas ações (só ações pagam dividendos)

4. **Seta para direita** → "Para cada ação"

5. **Retângulo "API Route"** (API)
   - Texto: "/api/dividends/[ticker]"
   - Operação: "fetch()"

6. **Seta para direita** → "Chama API Externa"

7. **Retângulo "BRAPI"** (API Externa)
   - Texto: "BRAPI API"
   - Endpoint: "GET /api/quote/{ticker}/dividends"
   - Retorna:
     - dividends: [{ date, value, type }]
     - summary: { dividendYield }

8. **Seta de volta** → "Retorna histórico"

9. **Retângulo "Filtra Dividendos"** (Lógica)
   - Texto: "Processa Dividendos"
   - Filtro 1: Apenas type = 'cash' (em dinheiro)
   - Filtro 2: Últimos 12 meses
   - Filtro 3: Separa recebidos vs não recebidos
     - Recebido: divDate ≥ dataCompra
     - Não recebido: divDate < dataCompra

10. **Retângulo "Cálculos"** (Lógica)
    - Texto: "Calcula Resumo"
    - totalRecebido = Σ (dividendos recebidos × quantidade)
    - Yield médio = média dos dividendYield
    - Total de pagamentos = count(dividendos)

11. **Seta para cima** → "Atualiza state"

12. **Retângulo "Página Dividendos"** novamente
    - Texto: "Exibe:"
    - 3 Cards de resumo (Total Recebido, Pagamentos, Yield Médio)
    - Cards por ativo (cada ação com seus dividendos)
    - Tabela histórico detalhado:
      - Verde com "✓": Recebidos
      - Cinza com tachado: Não recebidos

### Anotações importantes:
- Adicionar nota: "Apenas ações pagam dividendos"
- Adicionar nota: "Mostra últimos 12 meses de histórico"
- Adicionar nota: "Usuário só recebe dividendos após data de compra"
- Adicionar nota: "type = 'cash' = dividendos em dinheiro (não bonificação)"

---

## 🎨 Paleta de Cores Sugerida

### Por Fluxo:
- **LOGIN/CADASTRO:** 🟦 Azul (#3B82F6)
- **DASHBOARD:** 🟩 Verde (#10B981)
- **INVESTIMENTOS:** 🟧 Laranja (#FF6B2D)
- **PERFIL:** 🟨 Amarelo (#F59E0B)
- **DIVIDENDOS:** 🟪 Roxo (#8B5CF6)

### Por Camada:
- **Frontend:** Fundo claro (#F8FAFC)
- **Context/API:** Fundo médio (#E2E8F0)
- **Backend/APIs:** Fundo escuro (#CBD5E1)
- **Banco de Dados:** Cor sólida (#64748B)

### Elementos Especiais:
- **Setas:** Cor do fluxo correspondente
- **Decisões (Losangos):** Amarelo (#FCD34D)
- **Tabelas (Cilindros):** Azul escuro (#1E40AF)
- **APIs Externas:** Verde água (#14B8A6)

---

## 📝 Símbolos Recomendados

### Formas:
- **Retângulo:** Páginas, componentes, funções
- **Retângulo arredondado:** Botões, ações do usuário
- **Cilindro:** Tabelas de banco de dados
- **Nuvem:** APIs externas (BRAPI)
- **Losango:** Decisões/condições (if/else)
- **Círculo:** Início/fim de fluxo

### Setas:
- **Seta simples:** Fluxo normal
- **Seta dupla:** Comunicação bidirecional
- **Seta tracejada:** Fluxo condicional/opcional

### Ícones:
- **🔐:** Autenticação
- **📊:** Dashboard/Dados
- **💼:** Investimentos
- **👤:** Perfil do usuário
- **💰:** Dividendos/Dinheiro
- **📝:** INSERT (criar)
- **🔍:** SELECT (ler)
- **✏️:** UPDATE (atualizar)
- **❌:** DELETE (não usado na app)

---

## 📐 Dicas de Organização

### Layout Horizontal (Alternativa):

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   FRONTEND  │ → │   BACKEND    │ → │  BANCO DE   │
│   (Next.js) │ ← │  (Supabase)  │ ← │    DADOS    │
└─────────────┘    └──────────────┘    └─────────────┘
       ↕                   ↕
┌─────────────┐    ┌──────────────┐
│   Context   │    │  BRAPI API   │
│ (AuthContext)│    │  (Externa)   │
└─────────────┘    └──────────────┘
```

### Agrupamento por Funcionalidade:

Você pode criar "caixas" maiores agrupando funcionalidades relacionadas:

```
╔═══════════════════════════════════════╗
║         MÓDULO DE AUTENTICAÇÃO        ║
╠═══════════════════════════════════════╣
║  [Login] → [AuthContext] → [Supabase] ║
║      ↓                                 ║
║  [Tabela users]                       ║
╚═══════════════════════════════════════╝

╔═══════════════════════════════════════╗
║      MÓDULO DE INVESTIMENTOS          ║
╠═══════════════════════════════════════╣
║  [Investimentos] → [BRAPI] →          ║
║  [INSERT investments]                 ║
╚═══════════════════════════════════════╝
```

---

## ✅ Checklist Final

### Antes de começar:
- [ ] Decidir entre layout vertical ou horizontal
- [ ] Escolher paleta de cores
- [ ] Preparar legenda

### Durante o desenho:
- [ ] Criar camadas/grupos por funcionalidade
- [ ] Manter espaçamento consistente
- [ ] Usar cores para diferenciar fluxos
- [ ] Adicionar setas direcionais claras
- [ ] Nomear todos os elementos

### Detalhes importantes:
- [ ] Marcar operações de banco (SELECT, INSERT, UPDATE)
- [ ] Indicar APIs externas
- [ ] Mostrar decisões/condições
- [ ] Adicionar notas explicativas
- [ ] Destacar dados que fluem entre componentes

### Revisão final:
- [ ] Todos os fluxos estão completos?
- [ ] As setas fazem sentido?
- [ ] As cores estão consistentes?
- [ ] Há legenda explicativa?
- [ ] O diagrama está legível?

---

## 🎯 Exemplo de Legenda para Incluir

```
LEGENDA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cores dos Fluxos:
🟦 Azul   - Login/Cadastro
🟩 Verde  - Dashboard
🟧 Laranja - Investimentos
🟨 Amarelo - Perfil
🟪 Roxo   - Dividendos

Operações de Banco:
📝 INSERT - Criar registro
🔍 SELECT - Ler dados
✏️  UPDATE - Atualizar
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tabelas:
• users - Dados do usuário
• investments - Investimentos

APIs:
• BRAPI - Cotações e dividendos
• Supabase - Auth e Database
```

---

## 📱 Modelo Simplificado (Visão Geral)

Se quiser começar com algo mais simples:

```
┌──────────────────────────────────────────────┐
│              USUÁRIO (Browser)               │
└──────────────┬───────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────┐
│         APLICAÇÃO NEXT.JS (Frontend)         │
│  [Login] [Dashboard] [Investimentos] etc.    │
└──────────────┬───────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────┐
│            SUPABASE (Backend)                │
│  • Auth (Autenticação)                       │
│  • Database (Banco de Dados)                 │
│    - Tabela: users                           │
│    - Tabela: investments                     │
└──────────────┬───────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────┐
│           BRAPI (API Externa)                │
│  • Cotações de ações                         │
│  • Dividendos                                │
└──────────────────────────────────────────────┘
```

---

**Boa sorte com seu desenho no Excalidraw! 🎨**

Se precisar de mais detalhes sobre algum fluxo específico, consulte o arquivo `FLUXO-APLICACAO.md` na mesma pasta.



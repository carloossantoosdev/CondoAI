# 07 — Fluxo de Criação de Telas e Componentes

Este guia define a ordem recomendada para construir as telas estáticas do CondoAI após o setup do projeto, destacando os componentes necessários e as dependências entre elas. O objetivo é facilitar o trabalho coordenado de um time iniciando com HTML/CSS e Tailwind.

---

## Visão geral

### Premissas
- Projeto já inicializado conforme `docs/05-SETUP-PROJETO.md`.
- Componentes base shadcn/ui configurados (ver `docs/06-SHADCN-UI.md`).
- Time trabalhando apenas em layout estático (sem integrações ou lógica).

### Estratégia geral
1. Construir fundamentos compartilhados (layout global, UI base).
2. Atacar telas de entrada (Login) e navegação principal.
3. Evoluir para telas core do produto (Dashboard, Investimentos, Dividendos).
4. Finalizar com telas auxiliares (Notícias, Planos, Perfil, Dicas, Contato, Sucesso).
5. Validar responsividade e consistência ao final de cada bloco.

---

## Fase 1 — Fundamentos compartilhados

| Entrega | Descrição | Componentes necessários | Dependências |
|---------|-----------|-------------------------|--------------|
| Layout global (`MainLayout`) | Header, navegação principal, footer, wrapper responsivo | `Header`, `Footer`, `NavLink`, `ThemeToggle` (placeholder) | Tokens definidos em `globals.css` |
| Componentes UI base | `Button`, `Card`, `Input`, `Label`, `Tabs`, `Table`, `Badge`, `Pagination`, `Loading` | shadcn/ui + customizações de marca | Layout global para testar estilos |
| Página inicial (`/`) | Placeholder com CTAs e links principais | `Button`, `Card`, `Tabs` | Layout global + UI base |

Checklist da fase:
- [ ] Navegação funcional entre páginas (links estáticos)
- [ ] Tokens aplicados (cores, tipografia, background “gelo”)
- [ ] Componentes com estados hover/focus/disabled e responsividade básica

---

## Fase 2 — Telas de acesso e navegação inicial

| Tela | Objetivo | Componentes reutilizados | Componentes adicionais |
|------|----------|--------------------------|------------------------|
| Login (`/login`) | Ponto de entrada do usuário | `Card`, `Input`, `Label`, `Button` | `Checkbox` (lembrar-me) opcional |
| Dashboard (`/dashboard`) | Visão geral dos dados | `Card`, `Tabs`, `Badge`, `Table`, `Pagination`, `Loading` | `StatCard` (variação de `Card`), `Charts` (placeholder) |

Ordem sugerida:
1. Login (simples, valida componentes base).
2. Dashboard (exige maior combinação de componentes).

Checklist da fase:
- [ ] Layout mobile/desktop validado em Login e Dashboard
- [ ] Cards de KPI criados como componente reutilizável
- [ ] Tabela responsiva (scroll horizontal em mobile)

---

## Fase 3 — Telas core de finanças

| Tela | Conteúdo | Componentes | Observações |
|------|----------|-------------|-------------|
| Investimentos (`/investimentos`) | Lista de ativos, filtros | `Table`, `Tabs`, `Input`, `Select` (importado shadcn) | Criar `FilterBar` reutilizável |
| Dividendos (`/dividendos`) | Histórico e sumário | `Card`, `Table`, `Badge`, `Tabs` | Aproveitar `FilterBar`; criar `SummaryCard` |
| Notícias (`/noticias`) | Lista de cards de notícia | `Card`, `Badge`, `Pagination` | Criar `NewsCard` com metadados |

Sequência recomendada:
1. Investimentos → 2. Dividendos → 3. Notícias

Checklist da fase:
- [ ] `FilterBar` padronizada aplicada em Investimentos e Dividendos
- [ ] Componentes `SummaryCard` e `NewsCard` documentados
- [ ] Paginação visual consistente (mesmo componente shadcn)

---

## Fase 4 — Telas de planos e experiência do usuário

| Tela | Objetivo | Componentes | Dependências |
|------|----------|-------------|--------------|
| Planos (`/planos`) | Comparação de planos/assinaturas | `Card`, `Badge`, `Button`, `Tabs` | `PlanCard` com destaque para plano recomendado |
| Sucesso (`/planos/sucesso`) | Feedback pós-compra | `Card`, `Button`, `Badge` | Depende da identidade dos planos |
| Perfil (`/perfil`) | Formulário de dados do usuário | `Form`, `Input`, `Label`, `Tabs` (preferências) | Reaproveita padrões da tela Login |

Ordem sugerida:
1. Planos → 2. Sucesso → 3. Perfil

Checklist da fase:
- [ ] `PlanCard` com variação destacada (estado “recomendado”)
- [ ] Layout responsivo em colunas (1 coluna mobile, 3 colunas desktop)
- [ ] Form perfil com validação visual (estados de erro placeholders)

---

## Fase 5 — Telas complementares

| Tela | Conteúdo | Componentes | Notas |
|------|----------|-------------|-------|
| Dicas (`/dicas`) | Cards informativos por categoria | `Card`, `Badge`, `Tabs` | Reutilizar `NewsCard` como base |
| Contato (`/contato`) | Formulário e canais de suporte | `Form`, `Input`, `Textarea`, `Button`, `Card` | Adicionar `ContactInfo` e `MapPlaceholder` |

Checklist:
- [ ] Cards de dicas com variações por categoria (cor/ícone)
- [ ] Contato com grid em 2 colunas no desktop (form + dados)
- [ ] Responsividade validada em 320px / 768px / 1280px

---

## Visão consolidada das dependências

1. **Fundamentos** → Layout global, componentes base.
2. **Telescopo**:
   - Login depende apenas dos componentes base.
   - Dashboard adiciona `StatCard` e `ChartPlaceholder`.
   - Investimentos e Dividendos compartilham `FilterBar`, `SummaryCard`.
   - Planos cria `PlanCard` reaproveitado em Sucesso.
   - Perfil, Dicas, Contato reutilizam `Form` e `Card`.
3. **Componentes derivados**:
   - `FilterBar`: barra com `Input`, `Select`, `Button`.
   - `StatCard`: wrapper de KPI (ícone, título, valor, variação).
   - `SummaryCard`: card compacto com métricas (Dividendos).
   - `NewsCard`/`TipCard`: card com metadados (título, tag, data).

---

## Recomendações de colaboração

- **PRs pequenos**: 1 tela ou 1 componente por PR.
- **Checklist em cada PR**:
  - [ ] Responsivo (mobile e desktop)
  - [ ] Tokens corretos (`brand.*`, variáveis HSL)
  - [ ] Estados hover/focus presentes
  - [ ] Print mobile + desktop na descrição
- **Sincronização semanal**: revisar pendências e garantir que componentes criados estão documentados (Storybook opcional).

---

## Próximos passos

Após concluir o fluxo:
1. Validar todas as telas em conjunto.
2. Documentar quaisquer variáveis ou componentes extras criados.
3. Avançar para a fase de lógica (APIs, Supabase, Stripe) com nova documentação dedicada.

---

Com esta ordem, o time consegue construir o front estático de forma incremental, reaproveitando componentes e mantendo consistência visual desde o início.


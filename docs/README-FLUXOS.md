# 📚 Documentação Completa - Fluxos da Aplicação CondoAI

Esta pasta contém toda a documentação necessária para entender e visualizar os fluxos da aplicação CondoAI.

---

## 📋 Índice de Documentos

### 1. 📊 [FLUXO-APLICACAO.md](./FLUXO-APLICACAO.md)
**Documentação técnica completa**

Documento principal com todos os detalhes técnicos dos fluxos da aplicação:
- Estrutura do banco de dados Supabase
- Fluxo completo de Login/Cadastro
- Fluxo completo do Dashboard
- Fluxo completo de Investimentos
- Fluxo completo de Perfil de Investidor
- Fluxo completo de Dividendos
- APIs externas utilizadas
- Estrutura de dados TypeScript

**Use este documento para:**
- Entender como a aplicação funciona internamente
- Ver queries SQL específicas
- Consultar estruturas de dados
- Referência técnica completa

---

### 2. 🎨 [GUIA-DESENHO-EXCALIDRAW.md](./GUIA-DESENHO-EXCALIDRAW.md)
**Guia visual para criar diagramas**

Guia passo-a-passo para criar o diagrama da aplicação no Excalidraw:
- Layout sugerido (camadas horizontais e verticais)
- Elementos visuais para cada fluxo
- Paleta de cores recomendada
- Símbolos e formas sugeridas
- Checklist completo
- Modelo de legenda

**Use este documento para:**
- Planejar o desenho no Excalidraw
- Escolher cores e símbolos
- Seguir instruções passo-a-passo
- Criar uma legenda clara

---

### 3. 🖼️ [DIAGRAMAS-ASCII.md](./DIAGRAMAS-ASCII.md)
**Diagramas prontos em ASCII**

Diagramas completos já desenhados em ASCII para todos os fluxos:
- Fluxo de Login (visual completo)
- Fluxo de Dashboard (visual completo)
- Fluxo de Investimentos (visual completo)
- Fluxo de Perfil (visual completo)
- Fluxo de Dividendos (visual completo)
- Diagrama do Banco de Dados
- Arquitetura geral da aplicação

**Use este documento para:**
- Visualizar rapidamente como os fluxos funcionam
- Copiar estrutura para adaptar no Excalidraw
- Referência visual rápida
- Apresentações e documentação

---

## 🎯 Como Usar Esta Documentação

### Para Entender a Aplicação:
1. Comece lendo o **FLUXO-APLICACAO.md**
2. Consulte os diagramas ASCII em **DIAGRAMAS-ASCII.md** para visualizar
3. Use o **GUIA-DESENHO-EXCALIDRAW.md** se quiser criar diagramas próprios

### Para Criar Desenhos no Excalidraw:
1. Abra o **GUIA-DESENHO-EXCALIDRAW.md**
2. Siga as instruções de layout e cores
3. Consulte os **DIAGRAMAS-ASCII.md** como referência visual
4. Use o **FLUXO-APLICACAO.md** para detalhes técnicos específicos

### Para Apresentações/Reuniões:
1. Use os diagramas prontos do **DIAGRAMAS-ASCII.md**
2. Consulte o **FLUXO-APLICACAO.md** para explicar detalhes
3. Mostre o resultado visual criado no Excalidraw

---

## 🗺️ Visão Geral Rápida

### Fluxos Principais:

```
1. LOGIN/CADASTRO (🔐)
   Usuário → Login → Supabase Auth → Tabela users → Dashboard

2. DASHBOARD (📊)
   Dashboard → SELECT investments → BRAPI → Cálculos → Exibição

3. INVESTIMENTOS (💼)
   Investimentos → Filtro por Perfil → BRAPI → Modal → INSERT

4. PERFIL (👤)
   Perfil → Questionário → Cálculo → UPDATE users → Resultado

5. DIVIDENDOS (💰)
   Dividendos → SELECT ações → BRAPI → Filtros → Tabela
```

### Banco de Dados:

```
auth.users (Supabase)
    ↓
public.users
    ↓
public.investments
```

### APIs Externas:

- **Supabase**: Autenticação e Banco de Dados
- **BRAPI**: Cotações, Lista de Ações, Dividendos

---

## 🎨 Exemplo de Uso: Criar Diagrama no Excalidraw

### Passo 1: Preparação
- Abra o Excalidraw
- Tenha os 3 documentos abertos para consulta
- Escolha uma paleta de cores (sugestão no GUIA)

### Passo 2: Estrutura Base
- Crie 4 camadas horizontais:
  1. Frontend (topo)
  2. Context/API (meio-superior)
  3. Backend (meio-inferior)
  4. Banco de Dados (base)

### Passo 3: Adicione os Elementos
- Consulte o GUIA-DESENHO-EXCALIDRAW.md seção por seção
- Use os DIAGRAMAS-ASCII.md como referência visual
- Para cada fluxo, use a cor correspondente

### Passo 4: Conecte com Setas
- Siga o fluxo descrito no FLUXO-APLICACAO.md
- Use setas direcionais claras
- Adicione anotações importantes

### Passo 5: Finalize
- Adicione legenda (modelo no GUIA)
- Revise com o checklist do GUIA
- Ajuste espaçamento e alinhamento

---

## 📊 Estatísticas da Aplicação

### Tabelas no Banco de Dados: 2
- `users` - Dados dos usuários
- `investments` - Investimentos dos usuários

### Páginas Principais: 6
- Login/Cadastro
- Dashboard
- Investimentos
- Perfil de Investidor
- Dividendos
- Planos (assinaturas)

### Fluxos Principais: 5
- Autenticação
- Visualização de Portfolio
- Realizar Investimentos
- Definir Perfil de Risco
- Consultar Dividendos

### APIs Externas: 2
- Supabase (Auth + Database)
- BRAPI (Cotações + Dividendos)

---

## 🔍 Pontos-Chave da Aplicação

### Segurança:
- ✅ Autenticação gerenciada pelo Supabase
- ✅ Senhas criptografadas (não armazenadas no app)
- ✅ API key da BRAPI protegida em API Routes (server-side)
- ✅ Row Level Security (RLS) no Supabase

### Perfil de Investidor:
- ✅ 3 perfis: Conservador, Moderado, Arrojado
- ✅ Quiz de 5 perguntas com scores 1-3
- ✅ Filtragem automática de ativos por perfil
- ✅ Perfil padrão: Conservador (segurança)

### Investimentos:
- ✅ 4 tipos: Ações, Fundos, Renda Fixa, Cripto
- ✅ Cotações em tempo real via BRAPI
- ✅ Cálculo automático de lucro/prejuízo
- ✅ Histórico de compras

### Dividendos:
- ✅ Apenas para ações
- ✅ Histórico dos últimos 12 meses
- ✅ Separação: recebidos vs não recebidos
- ✅ Base na data de compra do usuário

---

## 📝 Glossário

### Termos Técnicos:

- **BRAPI**: API brasileira gratuita para cotações da B3
- **Supabase**: Plataforma BaaS (Backend as a Service) com PostgreSQL
- **AuthContext**: Context API do React para gerenciar autenticação global
- **API Routes**: Endpoints server-side do Next.js
- **RLS**: Row Level Security - segurança a nível de linha no PostgreSQL
- **FK**: Foreign Key - Chave estrangeira
- **PK**: Primary Key - Chave primária
- **UUID**: Identificador único universal

### Termos Financeiros:

- **Ticker**: Código do ativo (ex: PETR4, VALE3)
- **Dividend Yield (DY)**: Percentual de dividendos pagos em relação ao preço
- **Renda Fixa**: Investimentos com rentabilidade previsível
- **Renda Variável**: Investimentos com rentabilidade imprevisível (ações)
- **Provento**: Termo geral para dividendos, JCP, bonificações
- **Preço Médio**: Média ponderada dos preços de compra

---

## ✅ Checklist de Compreensão

Após ler a documentação, você deve conseguir responder:

### Autenticação:
- [ ] Onde as senhas são armazenadas?
- [ ] Qual tabela armazena os dados do usuário?
- [ ] O que acontece no cadastro se o usuário já existir?

### Dashboard:
- [ ] De onde vêm os preços atuais dos ativos?
- [ ] Como é calculado o lucro/prejuízo?
- [ ] Quantos investimentos são mostrados na lista?

### Investimentos:
- [ ] Como o perfil do usuário afeta os ativos disponíveis?
- [ ] O que acontece ao confirmar um investimento?
- [ ] Onde os dados do investimento são salvos?

### Perfil:
- [ ] Quantas perguntas tem o quiz?
- [ ] Como é definido o perfil (conservador/moderado/arrojado)?
- [ ] Onde o perfil é salvo?

### Dividendos:
- [ ] Quais tipos de investimento pagam dividendos?
- [ ] Como saber se o usuário recebeu um dividendo?
- [ ] Qual o período mostrado no histórico?

---

## 🚀 Próximos Passos

Após consultar esta documentação:

1. **Para Desenvolvedores:**
   - Use como referência durante o desenvolvimento
   - Consulte para entender fluxos existentes
   - Atualize ao adicionar novos recursos

2. **Para Designers:**
   - Use para criar wireframes e protótipos
   - Consulte para entender jornada do usuário
   - Crie diagramas visuais no Excalidraw

3. **Para Product Owners:**
   - Use para planejamento de features
   - Consulte para entender capacidades atuais
   - Base para documentação de requisitos

4. **Para QA/Testers:**
   - Use para criar casos de teste
   - Consulte para entender fluxos esperados
   - Referência para testes de integração

---

## 📞 Suporte

Se você tiver dúvidas sobre algum fluxo específico:

1. Consulte o documento correspondente
2. Verifique os diagramas ASCII para visualização
3. Use o guia do Excalidraw para criar diagramas próprios

---

**Documentação criada em:** Dezembro 2025  
**Versão:** 1.0  
**Aplicação:** CondoAI - Plataforma de Investimentos  
**Tecnologias:** Next.js, Supabase, BRAPI, TypeScript



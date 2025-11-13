# 🔑 Como obter e configurar API Key da brapi.dev

## ⚠️ Problema: Erro 401 Unauthorized

Se você está vendo erros 401 nas requisições para BRAPI, significa que:
- ❌ A API key não está configurada
- ❌ O limite de requisições foi excedido (sem API key: muito limitado)
- ❌ A API key está inválida ou expirou

## Por que preciso de uma API Key?

A API gratuita da brapi.dev tem **limites de uso muito restritos** sem autenticação. Uma API key gratuita permite:
- ✅ Até 15.000 requisições/mês (vs pouquíssimas sem key)
- ✅ Cotações de ações e FIIs
- ✅ Dados históricos dos últimos 3 meses
- ⚠️ **Dividendos básicos (SEM histórico completo)**

**IMPORTANTE:** O histórico completo de dividendos **NÃO** está disponível no plano gratuito, mesmo com API key. Para isso, você precisaria do plano PRO (R$ 999,90/ano).

## ✅ Passo a Passo

### 1. Crie uma conta gratuita na brapi.dev
Acesse: **https://brapi.dev/**

### 2. Faça login no Dashboard
Após criar sua conta, acesse: **https://brapi.dev/dashboard**

### 3. Gere sua API Key
No dashboard, você encontrará sua API key. Ela será algo como:
```
abc123def456ghi789jkl012mno345pq
```

### 4. Configure no seu projeto

**IMPORTANTE**: Crie um arquivo chamado `.env.local` na **raiz do projeto** (mesmo nível do `package.json`).

No Windows, você pode criar via PowerShell ou CMD:
```powershell
# PowerShell (recomendado)
New-Item -Path ".env.local" -ItemType "file" -Force

# Ou CMD
echo. > .env.local
```

Depois, edite o arquivo `.env.local` e adicione sua API key:

```bash
# .env.local
BRAPI_API_KEY=sua-api-key-aqui-copiada-do-dashboard
```

**Exemplo real**:
```bash
# .env.local
BRAPI_API_KEY=abc123def456ghi789jkl012mno345pq
```

### 5. Reinicie o servidor

**SEMPRE** reinicie o servidor após adicionar/alterar variáveis de ambiente:

```bash
# Pare o servidor (Ctrl+C) e rode novamente:
npm run dev
```

## 📊 Limites da API (Atualizado 2024)

### Plano GRATUITO (sem API key):
- ❌ Praticamente sem funcionalidade
- ⚠️ Limite extremamente reduzido de requisições
- ❌ Não recomendado para aplicações reais

### Plano GRATUITO (com API key):
- ✅ **15.000 requisições/mês** (~500/dia)
- ✅ Cotações de ações, FIIs, ETFs
- ✅ Dados históricos dos últimos 3 meses
- ✅ Resumo básico da empresa
- ⚠️ **Dividendos BÁSICOS (sem histórico completo)**
- ❌ Sem dados fundamentalistas profundos (BP, DRE, DFC)
- ❌ Sem indicadores financeiros avançados
- ✅ **Suficiente para desenvolvimento e MVP básico**

### Plano PRO (R$ 999,90/ano ou R$ 83,33/mês):
- 💎 **500.000 requisições/mês**
- ✅ **Histórico COMPLETO de Dividendos** desde 2009
- ✅ Dados fundamentalistas completos (BP, DRE, DFC, DVA)
- ✅ Indicadores financeiros avançados
- ✅ Consultas múltiplas otimizadas (até 20 ativos por requisição)
- ✅ Suporte técnico prioritário dedicado

### Plano STARTUP (R$ 599,90/ano):
- 💎 **150.000 requisições/mês**
- ✅ Histórico de dividendos do último ano
- ✅ Dados fundamentalistas anuais (últimos 5 anos)
- ✅ Consultas múltiplas (até 10 ativos por requisição)

## 🔒 Segurança

**IMPORTANTE**: 
- ❌ NUNCA commite o arquivo `.env.local` no Git
- ✅ O arquivo `.env.local` já está no `.gitignore`
- ✅ Sua API key estará segura

## 🚀 Funcionamento

A aplicação já está configurada para:
1. ✅ Funcionar **SEM** API key (mas sem dados de dividendos)
2. ✅ Usar API key **SE** disponível (com dados completos)

```typescript
// O código já faz isso automaticamente:
const apiKey = process.env.BRAPI_API_KEY || '';
const url = apiKey 
  ? `https://brapi.dev/api/quote/${ticker}?dividends=true&token=${apiKey}`
  : `https://brapi.dev/api/quote/${ticker}?dividends=true`;
```

## 🎯 Resultado

Com a API key configurada:
- ✅ Histórico completo de dividendos
- ✅ Datas de pagamento
- ✅ Valores em R$
- ✅ Cálculo automático de Dividend Yield
- ✅ Projeções e relatórios

## 🔧 Troubleshooting (Problemas Comuns)

### ❌ Ainda recebo erro 401 após configurar

**Soluções:**

1. **Verifique se o arquivo está na raiz correta**
   ```
   CondoAI/
   ├── .env.local  ← Deve estar aqui!
   ├── package.json
   ├── src/
   └── ...
   ```

2. **Verifique se não há espaços extras**
   ```bash
   # ❌ Errado (espaços antes/depois do =)
   BRAPI_API_KEY = abc123
   
   # ✅ Correto (sem espaços)
   BRAPI_API_KEY=abc123
   ```

3. **Certifique-se de que reiniciou o servidor**
   - Pressione `Ctrl+C` para parar
   - Execute `npm run dev` novamente

4. **Verifique se a API key está correta**
   - Acesse https://brapi.dev/dashboard
   - Copie novamente a API key
   - Cole no `.env.local`

5. **Limpe o cache do Next.js**
   ```bash
   # Pare o servidor e execute:
   rm -rf .next
   npm run dev
   ```

### ⚠️ Limite de requisições excedido (429)

Se receber erro 429:
- Você excedeu o limite de 400 requisições/dia
- Aguarde 24h ou considere um plano pago
- Evite recarregar a página muitas vezes

### 📊 Como verificar se está funcionando

Após configurar, você deve ver no console do navegador:
- ✅ Requisições retornando status 200
- ✅ Dados de cotações sendo carregados
- ✅ Sem erros 401

---

**Dúvidas?** Acesse a documentação oficial: https://brapi.dev/docs


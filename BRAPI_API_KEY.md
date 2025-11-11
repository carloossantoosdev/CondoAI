# 🔑 Como obter API Key da brapi.dev

## Por que preciso de uma API Key?

A API gratuita da brapi.dev tem **limites de uso** e **não inclui dados de dividendos** sem autenticação. Para acessar o histórico completo de dividendos, é necessário uma API key.

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

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
BRAPI_API_KEY=sua-api-key-aqui
```

### 5. Reinicie o servidor

```bash
npm run dev
```

## 📊 Limites da API

### Plano FREE (sem API key):
- ❌ Sem dados de dividendos
- ⚠️ Limite de requisições reduzido

### Plano FREE (com API key):
- ✅ Dados de dividendos inclusos
- ✅ 400 requisições/dia
- ✅ Suficiente para desenvolvimento e MVP

### Planos Pagos:
- 💎 **Hobby**: R$ 29/mês - 1.000 req/dia
- 💎 **Basic**: R$ 89/mês - 5.000 req/dia
- 💎 **Pro**: R$ 249/mês - 20.000 req/dia

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

---

**Dúvidas?** Acesse a documentação oficial: https://brapi.dev/docs


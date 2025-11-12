# 🚀 Configuração do Stripe - Passo a Passo

## 1️⃣ Criar Conta no Stripe

1. Acesse: https://dashboard.stripe.com/register
2. Crie sua conta (grátis)
3. Ative o **Modo de Teste** (para testar sem cobrar de verdade)

---

## 2️⃣ Criar Produto e Preço

### No Dashboard do Stripe:

1. Vá em **Products** → **Add Product**
2. Preencha:
   - **Name**: `Plano PRO - Finanças Pro`
   - **Description**: `Acesso completo à plataforma com suporte especializado`
   - **Pricing**: 
     - **Recurring**: Mensal
     - **Price**: `R$ 29,90`
     - **Currency**: `BRL`
3. Clique em **Save product**
4. **Copie o Price ID** (começa com `price_...`)

---

## 3️⃣ Obter as Chaves da API

### No Dashboard do Stripe:

1. Vá em **Developers** → **API keys**
2. Copie:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...) - clique em "Reveal test key"

---

## 4️⃣ Configurar Variáveis de Ambiente

Crie/atualize o arquivo `.env.local` na raiz do projeto:

```bash
# Supabase (já configurado)
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_aqui

# Stripe (ADICIONE ESTAS LINHAS)
STRIPE_SECRET_KEY=sk_test_...          # Secret key copiada
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Publishable key
STRIPE_PRICE_ID=price_...              # Price ID do produto criado
STRIPE_WEBHOOK_SECRET=                 # Deixe vazio por enquanto
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5️⃣ Configurar Webhook (Produção)

### Quando for para produção:

1. No Stripe Dashboard: **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. **Endpoint URL**: `https://seu-dominio.com/api/stripe/webhook`
4. **Events to send**: Selecione:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie o **Signing secret** (começa com `whsec_...`)
6. Adicione no `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## 6️⃣ Testar Localmente

### 1. Instalar Stripe CLI:

```bash
# Windows (Chocolatey)
choco install stripe

# Mac (Homebrew)
brew install stripe/stripe-cli/stripe

# Ou baixe direto:
# https://github.com/stripe/stripe-cli/releases
```

### 2. Login no Stripe CLI:

```bash
stripe login
```

### 3. Escutar Webhooks Localmente:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Isso vai gerar um **webhook secret** temporário. Copie e adicione no `.env.local`.

### 4. Iniciar a aplicação:

```bash
npm run dev
```

---

## 7️⃣ Testar Pagamento

### Cartões de Teste do Stripe:

| Número | Resultado |
|--------|-----------|
| `4242 4242 4242 4242` | ✅ Sucesso |
| `4000 0000 0000 0002` | ❌ Recusado |
| `4000 0027 6000 3184` | ⚠️ Requer 3D Secure |

**CVV**: Qualquer 3 dígitos  
**Data**: Qualquer data futura  
**CEP**: Qualquer CEP válido

---

## 8️⃣ Fluxo Completo

1. Usuário clica em **"Assinar Agora"** no Plano PRO
2. Sistema cria sessão de checkout no Stripe
3. Usuário é redirecionado para página de pagamento do Stripe
4. Usuário preenche dados do cartão
5. Stripe processa pagamento
6. **Webhook** notifica nossa aplicação
7. Sistema atualiza `subscription_status` para `'paid'` no Supabase
8. Usuário é redirecionado para `/planos/sucesso`
9. ✅ Usuário agora tem acesso PRO!

---

## 9️⃣ Verificar se Está Funcionando

### No Dashboard do Stripe:
1. **Payments** → Ver pagamentos de teste
2. **Customers** → Ver clientes criados
3. **Subscriptions** → Ver assinaturas ativas
4. **Logs** → **Webhooks** → Ver eventos recebidos

### No Supabase:
1. **Table Editor** → `users`
2. Verificar se `subscription_status` mudou para `'paid'`
3. Verificar se `customer_id` e `subscription_id` foram salvos

---

## 🔟 Modo Produção

### Quando for colocar em produção:

1. **No Stripe**: Ative o **Modo Live** (Produção)
2. Copie as **chaves de produção** (sem `_test`)
3. Crie o **produto e preço de produção**
4. Configure o **webhook de produção** apontando para sua URL real
5. Atualize `.env.local` (ou variáveis de ambiente da hospedagem)

---

## 💡 Dicas

- **Sempre teste no modo test primeiro!**
- Use o Stripe CLI para testar webhooks localmente
- Verifique os logs do Stripe Dashboard se algo não funcionar
- O Stripe tem excelente documentação: https://stripe.com/docs

---

## ❓ Problemas Comuns

### "Invalid API Key"
- Verifique se copiou a chave correta (começa com `sk_test_`)
- Certifique-se que está no `.env.local` na raiz do projeto
- Reinicie o servidor (`npm run dev`)

### "Price not found"
- Verifique se o `STRIPE_PRICE_ID` está correto
- Deve começar com `price_`
- Confirme que o preço existe no Dashboard

### Webhook não está funcionando
- Use `stripe listen` localmente
- Verifique se o endpoint está acessível
- Confira os logs no Stripe Dashboard → Webhooks

---

✅ **Tudo configurado! Seu sistema de pagamentos está pronto!** 🎉


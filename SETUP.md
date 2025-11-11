# Guia de Configuração - Investment Platform

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Firebase
- Conta no Stripe

## 1. Configuração do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative a autenticação por Google:
   - Vá em Authentication > Sign-in method
   - Ative o provedor Google
4. Crie um banco Firestore:
   - Vá em Firestore Database
   - Crie um banco em modo de produção
5. Copie as credenciais do projeto:
   - Vá em Project Settings > General
   - Copie a configuração do SDK

## 2. Configuração do Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
2. Crie um produto de assinatura:
   - Vá em Products > Add product
   - Nome: "Plano PRO Investment Platform"
   - Preço: R$ 49,90/mês recorrente
   - Copie o Price ID gerado
3. Configure o webhook:
   - Vá em Developers > Webhooks > Add endpoint
   - URL: `https://seu-dominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copie o Webhook Secret
4. Copie as chaves da API:
   - Vá em Developers > API keys
   - Copie a Secret key e Publishable key

## 3. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_PRICE_ID=price_your_stripe_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 4. Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 5. Estrutura do Firestore

A aplicação criará automaticamente as seguintes coleções:

### users/{userId}
```
{
  email: string
  displayName: string
  photoURL: string
  subscriptionStatus: 'free' | 'paid'
  subscriptionId: string | null
  customerId: string | null
  riskProfile: 'conservador' | 'moderado' | 'arrojado' | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

### portfolios/{userId}/investments/{investmentId}
```
{
  type: 'acao' | 'fundo' | 'rendaFixa' | 'cripto'
  ticker: string
  nome: string
  quantidade: number
  precoMedio: number
  dataCompra: timestamp
  valorTotal: number
}
```

### appointments/{appointmentId}
```
{
  userId: string
  userEmail: string
  userName: string
  userPhone: string (opcional)
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  message: string
  createdAt: timestamp
}
```

## 6. Regras de Segurança do Firestore

Configure as regras de segurança no Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Portfolios subcollection
    match /portfolios/{userId}/investments/{investmentId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

## 7. Testando Webhooks do Stripe Localmente

Para testar webhooks localmente, use o Stripe CLI:

```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Encaminhar webhooks para localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copie o webhook secret exibido e atualize seu .env.local
```

## 8. Deploy em Produção

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no dashboard
3. Atualize `NEXT_PUBLIC_BASE_URL` para seu domínio
4. Atualize o webhook URL no Stripe para `https://seu-dominio.com/api/stripe/webhook`

## Funcionalidades Implementadas

✅ Autenticação com Google via Firebase
✅ Dashboard com visão geral dos investimentos
✅ Exploração de ativos (Ações, Fundos, Renda Fixa, Cripto)
✅ Sistema de investimentos simulados
✅ Conteúdo educacional completo
✅ Simulador de investimentos com gráficos
✅ Quiz de perfil do investidor
✅ Sistema de assinatura com Stripe
✅ Contato e agendamento com gestora (plano pago)
✅ Layout responsivo com Material UI

## APIs Externas Utilizadas

- **brapi.dev**: Cotações de ações, FIIs e ETFs brasileiros
- **Binance API**: Cotações de criptomoedas
- **ANBIMA**: Fundos de investimento (mock implementado)
- **Open Finance**: Renda fixa (mock implementado)

## Suporte

Para dúvidas ou problemas, consulte a documentação oficial:
- [Next.js](https://nextjs.org/docs)
- [Firebase](https://firebase.google.com/docs)
- [Stripe](https://stripe.com/docs)
- [Material UI](https://mui.com/)


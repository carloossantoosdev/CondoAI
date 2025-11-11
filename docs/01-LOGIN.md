# 🔐 Tela de Login

## 📋 Introdução

A tela de login é a **porta de entrada** da aplicação. É onde o usuário se autentica usando sua conta do Google para acessar a plataforma de investimentos.

**Funcionalidade principal:** Permitir que usuários façam login com Google OAuth e sejam redirecionados para o dashboard.

---

## 📂 Localização no Projeto

```
src/
  ├── app/
  │   └── login/
  │       └── page.tsx          ← Tela de Login (interface visual)
  │
  ├── context/
  │   └── AuthContext.tsx       ← Gerenciamento de autenticação
  │
  └── services/
      └── firebase/
          ├── auth.ts           ← Funções de autenticação Firebase
          └── config.ts         ← Configuração do Firebase
```

---

## 🌐 Como a Rota Funciona

### URL da Página
```
Arquivo: src/app/login/page.tsx
URL:     https://seusite.com/login
```

Quando o usuário acessa `/login`, o Next.js automaticamente renderiza o componente exportado em `page.tsx`.

---

## 🔄 Fluxo de Autenticação (Passo a Passo)

```
1. Usuário acessa /login
   ↓
2. Página de login é carregada
   ↓
3. Usuário clica em "Entrar com Google"
   ↓
4. Firebase abre popup do Google
   ↓
5. Usuário autoriza a aplicação
   ↓
6. Firebase retorna dados do usuário
   ↓
7. AuthContext salva o usuário na memória
   ↓
8. Usuário é redirecionado para /dashboard
```

---

## 🎨 Principais Componentes da Tela

### 1. Layout e Design

A página usa **Material-UI** para os componentes visuais:

```typescript
import {
  Box,           // Container flexível
  Button,        // Botão de login
  Container,     // Centraliza o conteúdo
  Paper,         // Card com sombra
  Typography,    // Textos estilizados
  ThemeProvider, // Temas de cores
} from '@mui/material';
```

### 2. Estrutura Visual

```
┌─────────────────────────────────────┐
│  Fundo Gradiente (Roxo/Azul)        │
│                                     │
│    ┌───────────────────────────┐   │
│    │  Card Branco (Paper)       │   │
│    │                            │   │
│    │  💰 InvestPlatform         │   │
│    │  Sua plataforma completa   │   │
│    │  de investimentos          │   │
│    │                            │   │
│    │  [Entrar com Google] 🔵    │   │
│    │                            │   │
│    │  🔒 Dados seguros          │   │
│    └───────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🔧 Código Principal Explicado

### Client Component

```typescript
'use client';
```

**Por quê?** Porque precisamos usar:
- `useState` para gerenciar estados
- `useEffect` para detectar mudanças
- `useRouter` para redirecionar
- Eventos de clique (`onClick`)

### Importações Importantes

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Navegação do Next.js
import { useAuth } from '@/context/AuthContext';  // Hook de autenticação
```

### Hook de Autenticação

```typescript
const { user, signIn, loading } = useAuth();
```

- `user` - Dados do usuário logado (ou `null` se não estiver logado)
- `signIn` - Função para fazer login com Google
- `loading` - Indica se está carregando

### Redirecionamento Automático

```typescript
useEffect(() => {
  if (user && !loading) {
    router.push('/dashboard');  // Redireciona para o dashboard
  }
}, [user, loading, router]);
```

**O que faz:** Sempre que `user` mudar e não estiver mais carregando, verifica se há um usuário logado. Se sim, redireciona automaticamente para o dashboard.

### Função de Login

```typescript
const handleGoogleSignIn = async () => {
  try {
    await signIn();  // Chama a função de login do AuthContext
  } catch (error) {
    console.error('Erro ao fazer login:', error);
  }
};
```

### Botão de Login

```typescript
<Button
  variant="contained"
  size="large"
  startIcon={<GoogleIcon />}
  onClick={handleGoogleSignIn}
  sx={{
    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
  }}
>
  Entrar com Google
</Button>
```

---

## 🔐 AuthContext - Gerenciamento Global

O `AuthContext` é responsável por **gerenciar o estado de autenticação** em toda a aplicação.

### Localização
```
src/context/AuthContext.tsx
```

### O que ele faz?

1. **Monitora o estado de autenticação** do Firebase
2. **Armazena os dados do usuário** em memória
3. **Fornece funções** para login e logout
4. **Compartilha o estado** com toda a aplicação

### Como usar em qualquer página

```typescript
import { useAuth } from '@/context/AuthContext';

function MinhaPage() {
  const { user, signIn, signOut } = useAuth();
  
  if (!user) {
    return <p>Você não está logado</p>;
  }
  
  return <p>Olá, {user.displayName}!</p>;
}
```

### Estrutura do AuthContext

```typescript
interface AuthContextType {
  user: User | null;              // Dados do usuário ou null
  firebaseUser: FirebaseUser | null;  // Usuário do Firebase
  loading: boolean;               // Estado de carregamento
  signIn: () => Promise<void>;    // Função de login
  signOut: () => Promise<void>;   // Função de logout
  refreshUser: () => Promise<void>; // Atualizar dados
}
```

---

## 🔥 Firebase Authentication

### O que é Firebase?

**Firebase** é uma plataforma do Google que oferece serviços de backend prontos, incluindo:
- Autenticação (Google, Facebook, Email, etc.)
- Banco de dados (Firestore)
- Armazenamento de arquivos
- Hospedagem

### Como funciona a autenticação?

```typescript
// src/services/firebase/auth.ts

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
```

**Fluxo:**
1. Cria um provedor de autenticação do Google
2. Abre um popup para o usuário fazer login
3. Retorna os dados do usuário autenticado

---

## 🛡️ Proteção de Rotas

Todas as outras páginas da aplicação (Dashboard, Investimentos, Dividendos) verificam se o usuário está logado:

```typescript
useEffect(() => {
  if (!loading && !user) {
    router.push('/login');  // Redireciona para login se não estiver autenticado
  }
}, [user, loading, router]);
```

**Segurança:** Se alguém tentar acessar `/dashboard` sem estar logado, é automaticamente redirecionado para `/login`.

---

## 💾 Onde os Dados são Salvos?

### Firebase Firestore (Banco de Dados)

Quando um usuário faz login pela primeira vez, seus dados são salvos no Firestore:

```
Firestore Database:
  └── users/
      └── [userId]/
          ├── uid: "abc123"
          ├── email: "usuario@gmail.com"
          ├── displayName: "João Silva"
          ├── photoURL: "https://..."
          └── createdAt: 2025-01-01
```

---

## 🎯 Estados da Tela

### 1. Carregando

```typescript
if (loading || user) {
  return <Typography>Carregando...</Typography>;
}
```

Mostra "Carregando..." enquanto verifica se há um usuário logado.

### 2. Formulário de Login

```typescript
return (
  <Paper>
    <Typography variant="h3">💰 InvestPlatform</Typography>
    <Button onClick={handleGoogleSignIn}>
      Entrar com Google
    </Button>
  </Paper>
);
```

Mostra o formulário de login quando não há usuário autenticado.

### 3. Redirecionamento

```typescript
if (user && !loading) {
  router.push('/dashboard');
}
```

Redireciona automaticamente quando o usuário faz login.

---

## 🔍 Fluxo Completo de Dados

```
Login Page (page.tsx)
    ↓
    Chama: signIn()
    ↓
AuthContext (AuthContext.tsx)
    ↓
    Chama: signInWithGoogle()
    ↓
Firebase Auth (auth.ts)
    ↓
    Abre popup do Google
    ↓
    Retorna usuário autenticado
    ↓
AuthContext salva em memória
    ↓
Login Page detecta mudança
    ↓
Redireciona para /dashboard
```

---

## 🧩 Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| **Next.js 15** | Framework React com rotas |
| **Material-UI** | Biblioteca de componentes visuais |
| **Firebase Auth** | Autenticação com Google OAuth |
| **Firestore** | Banco de dados para salvar usuários |
| **Context API** | Compartilhar estado de autenticação |
| **TypeScript** | Tipagem e segurança no código |

---

## 📝 Conceitos Importantes para Iniciantes

### 1. OAuth (Open Authorization)

É um protocolo que permite que usuários façam login usando contas existentes (Google, Facebook, etc.) **sem criar uma nova senha**.

### 2. Context API

É uma forma de **compartilhar dados** entre componentes sem precisar passar props manualmente em cada nível.

### 3. useEffect

É um Hook do React que executa código quando algo muda (como o estado do usuário).

### 4. Async/Await

Forma moderna de trabalhar com **operações assíncronas** (que levam tempo, como autenticação).

```typescript
const handleGoogleSignIn = async () => {
  await signIn();  // Espera terminar antes de continuar
};
```

---

## 🚀 Testando a Tela de Login

### Passo 1: Iniciar o projeto
```bash
npm run dev
```

### Passo 2: Acessar no navegador
```
http://localhost:3000/login
```

### Passo 3: Clicar em "Entrar com Google"

### Passo 4: Autorizar a aplicação

### Passo 5: Ser redirecionado para `/dashboard`

---

## 📌 Resumo

- **Localização:** `src/app/login/page.tsx`
- **URL:** `/login`
- **Função:** Autenticar usuários com Google OAuth
- **Tecnologia:** Firebase Authentication
- **Após login:** Redireciona para `/dashboard`
- **Proteção:** Outras páginas verificam autenticação

---

## 🔗 Próximos Passos

Agora que o usuário está logado, ele pode acessar:

- **[Tela de Investimentos](./02-INVESTIMENTOS.md)** - Explorar e investir em ativos
- **[Tela de Dividendos](./03-DIVIDENDOS.md)** - Acompanhar proventos
- **[Tela de Dashboard](./04-DASHBOARD.md)** - Visão geral da carteira


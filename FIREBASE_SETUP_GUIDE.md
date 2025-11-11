# 🔥 Guia Completo de Configuração do Firebase

## 📋 Índice
1. [Criar Projeto no Firebase](#1-criar-projeto-no-firebase)
2. [Obter Credenciais do Firebase](#2-obter-credenciais-do-firebase)
3. [Configurar Autenticação Google](#3-configurar-autenticação-google)
4. [Adicionar Domínios Autorizados](#4-adicionar-domínios-autorizados)
5. [Criar Firestore Database](#5-criar-firestore-database)
6. [Configurar Regras de Segurança](#6-configurar-regras-de-segurança)
7. [Adicionar Credenciais no Projeto](#7-adicionar-credenciais-no-projeto)
8. [Testar a Aplicação](#8-testar-a-aplicação)

---

## 1. Criar Projeto no Firebase

### 1.1 Acessar o Firebase Console
1. Abra seu navegador
2. Acesse: **https://console.firebase.google.com/**
3. Faça login com sua conta Google

### 1.2 Criar Novo Projeto
1. Clique no botão **"Adicionar projeto"** ou **"Create a project"**
2. **Nome do projeto**: Digite `investment-platform` (ou outro nome de sua preferência)
3. Clique em **"Continuar"**

### 1.3 Google Analytics (Opcional)
1. Você verá a opção de ativar o Google Analytics
2. **Recomendação**: Desative o toggle (não é necessário para este projeto)
3. Clique em **"Criar projeto"**

### 1.4 Aguardar Criação
- O Firebase levará alguns segundos para criar o projeto
- Quando terminar, clique em **"Continuar"**

✅ **Resultado**: Você estará na página inicial do seu projeto Firebase!

---

## 2. Obter Credenciais do Firebase

### 2.1 Adicionar App Web
1. Na página inicial do projeto, procure **"Comece adicionando o Firebase ao seu app"**
2. Clique no ícone **`</>`** (ícone Web/HTML)
3. Em **"Apelido do app"**, digite: `investment-platform-web`
4. **NÃO** marque a caixa **"Configurar o Firebase Hosting"**
5. Clique em **"Registrar app"**

### 2.2 Copiar as Credenciais
Você verá uma tela com código JavaScript semelhante a:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-123456",
  storageBucket: "seu-projeto.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

📋 **IMPORTANTE**: Copie esses valores! Você vai precisar deles no Passo 7.

### 2.3 Concluir Registro
- Clique em **"Continuar no console"**
- Pronto! Seu app web está registrado.

✅ **Resultado**: Você tem as credenciais do Firebase!

---

## 3. Configurar Autenticação Google

### 3.1 Acessar Authentication
1. No menu lateral esquerdo do Firebase Console
2. Procure a seção **"Criação"** ou **"Build"**
3. Clique em **"Authentication"**

### 3.2 Iniciar Authentication
1. Se for a primeira vez, você verá um botão **"Vamos começar"** ou **"Get Started"**
2. Clique nele

### 3.3 Ativar Provedor Google
1. Você verá a aba **"Sign-in method"** (já deve estar selecionada)
2. Na lista de provedores, procure por **"Google"**
3. Clique em **"Google"** (a linha inteira é clicável)

### 3.4 Configurar o Provedor
1. Você verá um toggle **desativado** no topo
2. **ATIVE** o toggle (ele ficará azul/verde)
3. Em **"Email de suporte do projeto"**, selecione seu email na lista
4. Clique em **"Salvar"**

### 3.5 Verificar Ativação
- Volte para a lista de provedores
- Você deve ver: **Google** com status **"Ativado"** ou **"Enabled"**

✅ **Resultado**: Login com Google está ativado!

---

## 4. Adicionar Domínios Autorizados

### 4.1 Acessar Configurações
1. Ainda em **Authentication**
2. Clique na aba **"Settings"** ou **"Configurações"** (no topo)

### 4.2 Encontrar Domínios Autorizados
1. Role a página até encontrar **"Authorized domains"** ou **"Domínios autorizados"**
2. Você verá uma lista com alguns domínios já adicionados automaticamente

### 4.3 Adicionar localhost
1. Clique no botão **"Add domain"** ou **"Adicionar domínio"**
2. Digite: `localhost`
3. Clique em **"Add"** ou **"Adicionar"**

### 4.4 Verificar Domínios
Sua lista deve conter pelo menos:
- ✅ `localhost`
- ✅ `seu-projeto.firebaseapp.com`
- ✅ `seu-projeto.web.app`

✅ **Resultado**: localhost está autorizado para fazer login!

---

## 5. Criar Firestore Database

### 5.1 Acessar Firestore
1. No menu lateral esquerdo
2. Procure **"Firestore Database"**
3. Clique em **"Firestore Database"**

### 5.2 Criar Banco de Dados
1. Clique no botão **"Criar banco de dados"** ou **"Create database"**
2. Você verá duas opções de modo

### 5.3 Escolher Modo de Produção
- **Selecione**: ✅ **Modo de produção** ou **Production mode**
- ❌ **NÃO** selecione "Modo de teste" (é inseguro)
- Clique em **"Avançar"** ou **"Next"**

### 5.4 Escolher Localização
1. **Recomendação para Brasil**: Selecione **`southamerica-east1`** (São Paulo)
2. Outras opções boas:
   - `us-east1` (Carolina do Sul)
   - `us-central1` (Iowa)
3. Clique em **"Ativar"** ou **"Enable"**

### 5.5 Aguardar Criação
- O Firestore levará alguns segundos para criar o banco
- Quando terminar, você verá a interface do Firestore

✅ **Resultado**: Banco de dados Firestore criado!

---

## 6. Configurar Regras de Segurança

### 6.1 Acessar Regras
1. Ainda na tela do **Firestore Database**
2. Clique na aba **"Regras"** ou **"Rules"** (no topo)

### 6.2 Editar Regras
1. Você verá um editor de código
2. **Apague todo o conteúdo** existente
3. **Cole as regras abaixo**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - usuário só pode ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Portfolios - investimentos do usuário
    match /portfolios/{userId}/investments/{investmentId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments - agendamentos com gestora
    match /appointments/{appointmentId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 6.3 Publicar Regras
1. Clique no botão **"Publicar"** ou **"Publish"** (geralmente no topo direito)
2. Aguarde a confirmação: **"Regras publicadas com êxito"**

### 6.4 Entender as Regras
Essas regras garantem que:
- ✅ Usuários autenticados podem criar/ler/atualizar apenas **seus próprios dados**
- ✅ Ninguém pode acessar dados de outros usuários
- ✅ Usuários não autenticados não têm acesso a nada
- ✅ A aplicação está **segura**

✅ **Resultado**: Regras de segurança configuradas!

---

## 7. Adicionar Credenciais no Projeto

### 7.1 Criar arquivo .env.local
No terminal, na raiz do projeto, execute:

```bash
touch .env.local
```

### 7.2 Adicionar Credenciais
Abra o arquivo `.env.local` e cole:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key-aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Stripe Configuration (deixe vazio por enquanto)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 7.3 Substituir pelos Valores Reais
Pegue as credenciais que você copiou no **Passo 2** e substitua:
- `sua-api-key-aqui` → cole o valor de `apiKey`
- `seu-projeto.firebaseapp.com` → cole o valor de `authDomain`
- E assim por diante...

### 7.4 Salvar Arquivo
- Salve o arquivo `.env.local`
- **IMPORTANTE**: Este arquivo NÃO deve ser enviado para o Git (já está no .gitignore)

✅ **Resultado**: Credenciais configuradas no projeto!

---

## 8. Testar a Aplicação

### 8.1 Iniciar o Servidor
No terminal, execute:

```bash
npm run dev
```

### 8.2 Acessar a Aplicação
1. Abra o navegador
2. Acesse: **http://localhost:3000**
3. Você verá a página de login

### 8.3 Fazer Login
1. Clique no botão **"Entrar com Google"**
2. Uma janela popup do Google vai abrir
3. Selecione sua conta Google
4. Autorize o acesso
5. Você será redirecionado para o Dashboard

### 8.4 Verificar no Firebase
1. Volte ao Firebase Console
2. Vá em **Authentication** > **Users**
3. Você deve ver seu usuário listado!
4. Vá em **Firestore Database** > **Data**
5. Você verá uma coleção `users` com seu documento criado automaticamente

✅ **Resultado**: Tudo funcionando! 🎉

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Parar servidor
Ctrl+C (ou Cmd+C no Mac)

# Limpar cache e reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Ver logs do Firebase no navegador
# Abra as DevTools (F12) e vá na aba Console
```

---

## ✅ Checklist Final

Antes de considerar a configuração completa, verifique:

- [ ] Projeto Firebase criado
- [ ] Credenciais copiadas e salvas
- [ ] Authentication ativado com Google
- [ ] `localhost` adicionado aos domínios autorizados
- [ ] Firestore Database criado
- [ ] Regras de segurança configuradas e publicadas
- [ ] Arquivo `.env.local` criado com as credenciais
- [ ] Servidor rodando sem erros
- [ ] Login com Google funcionando
- [ ] Usuário aparece em Authentication > Users
- [ ] Documento do usuário criado em Firestore > Data

---

## 🎯 Próximos Passos

Após concluir esta configuração:

1. **Stripe**: Configure os pagamentos seguindo o `SETUP.md`
2. **Deploy**: Faça deploy da aplicação na Vercel
3. **Domínio**: Adicione seu domínio de produção aos domínios autorizados
4. **Backup**: Configure backups automáticos do Firestore



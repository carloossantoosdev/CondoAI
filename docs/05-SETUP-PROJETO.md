# 05 — Setup Inicial do Projeto CondoAI

Guia passo a passo para iniciar um projeto novo usando o mesmo stack deste repositório (Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui). O foco é preparar o ambiente e replicar a base visual/já adotada na aplicação atual.

---

## 1. Pré-requisitos de ambiente

- **Node.js** 18.x ou superior (verifique com `node -v`).
- **Gerenciador de pacotes**: o projeto usa **Yarn**. Instale/ou atualize (`npm i -g yarn`).
- **Git** instalado e configurado (`git --version`).
- **VS Code** (recomendado) com as extensões:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
- Acesso ao repositório (GitHub/GitLab) e credenciais necessárias.

Checklist rápido:
- [ ] Node 18+
- [ ] Yarn ≥ 1.22
- [ ] Git configurado (nome e email)
- [ ] VS Code + extensões

---

## 2. Criando o projeto base

1. Crie o diretório do projeto (ou clone um repositório vazio previamente criado).
2. Execute o scaffolding com `create-next-app` usando as mesmas opções do projeto atual:

```bash
npx create-next-app@latest condoai-web \
  --example with-tailwindcss \
  --typescript \
  --app \
  --tailwind \
  --eslint \
  --src-dir \
  --import-alias "@/*"
```

Se preferir Yarn:

```bash
yarn create next-app condoai-web \
  --typescript --app --tailwind --eslint --src-dir --import-alias @/*
```

3. Entre na pasta e instale as dependências (caso necessário):

```bash
cd condoai-web
yarn
```

4. Rode o servidor local para validar a instalação:

```bash
yarn dev
```

> Acesse http://localhost:3000 e confirme que a aplicação inicial do Next.js está funcionando.

---

## 3. Ajustes iniciais de configuração

### 3.1 Estrutura de pastas

Garanta que o projeto fique organizado igual ao repo atual:

```
src/
  app/
    layout.tsx
    page.tsx
    login/page.tsx
    dashboard/page.tsx
    ...
  components/
    layout/MainLayout.tsx
    ui/
      button.tsx
      card.tsx
      ...
  lib/
  services/
  context/
  types/
```

- Crie as pastas vazias (`lib`, `services`, `context`) para evitar futuros refactors.
- Use alias `@/*` para os imports absolutos (`tsconfig.json` já vem configurado pelo comando anterior).

### 3.2 Tailwind + tokens globais

1. Copie as configurações de `tailwind.config.ts` atuais (cores de marca, caminhos `content`, etc.). Exemplo:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#ff6b2d",
          red: "#b91c1c",
          dark: "#3d1f1f",
          "dark-deep": "#1a0f0f",
          yellow: "#f59e0b",
          green: "#10b981",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

2. Atualize `src/app/globals.css` com as variáveis CSS e utilitários compartilhados:

```css
:root {
  --background: 210 20% 95%;
  --foreground: 0 0% 3.9%;
  --card: 210 20% 98%;
  --card-foreground: 0 0% 3.9%;
  --border: 210 15% 88%;
  --primary: 16 100% 59%;
}

body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: "Inter", system-ui, sans-serif;
}

button,
[role="button"],
[type="button"],
[type="submit"],
[type="reset"] {
  cursor: pointer;
}

@media (max-width: 768px) {
  body {
    font-size: 0.875rem;
  }
}
```

3. Garanta que o Tailwind esteja importado em `globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3.3 Lint e formatação

- Configure scripts no `package.json` (o create-next-app já adiciona):

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

- Instale Prettier (opcional, mas recomendado) e configure `.prettierrc` igual ao projeto atual.

---

## 4. Layout base e componentes

### 4.1 Layout global

- Crie `src/components/layout/MainLayout.tsx` com header/nav/footer reutilizáveis.
- Em `src/app/layout.tsx`, envolva o conteúdo com o `MainLayout`.
- Estrutura recomendada para o layout:

```tsx
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
}
```

### 4.2 Componentes UI compartilhados

- Replicar `src/components/ui` (Button, Card, Input, Table, Tabs, Loader, etc.).
- Fonte de verdade: `src/components/ui/*.tsx` do projeto atual. Copie a implementação e ajuste conforme necessário.

---

## 5. Convenções para o time

### 5.1 CSS/Tailwind

- Mobile-first; usar breakpoints Tailwind (`sm`, `md`, `lg`, `xl`).
- Evitar classes mágicas; se usar valores custom, justificar no PR.
- Sempre usar tokens de cor (`brand.orange`, variáveis `hsl(var(--...))`).

### 5.2 Revisões e checklist

Antes de abrir PR:
- [ ] Rodou `yarn lint`
- [ ] Conferiu responsividade em 320px, 768px e 1280px
- [ ] Garantiu contraste mínimo AA
- [ ] Print desktop + mobile anexados na descrição do PR

### 5.3 Branches e commits

- Branch por feature: `feature/nome-tela` ou `feature/ui-button`.
- Commits no padrão convencional (`feat:`, `fix:`, `style:`, `docs:`).
- Exemplo:

```
feat: criar layout base com header e footer
style: ajustar tokens de cores globais
```

---

## 6. Próximos passos (fora do escopo inicial)

Depois das telas estáticas prontas:
- Autenticação (Supabase)
- Consumo de APIs (BRAPI, Binance, ANBIMA)
- Rotas API (`/app/api/*`) e webhooks (Stripe)
- Estado global
- Testes unitários e E2E

Esses tópicos terão sua própria documentação quando chegarmos à fase de lógica/aplicação.

---

## 7. Recursos de referência

- [Documentação Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Guia atual de telas estáticas (docs/)](./)

---

Com este guia, qualquer integrante do time consegue reproduzir a base do CondoAI do zero, mantendo a consistência visual e estrutural do projeto atual sem ainda se preocupar com integrações ou lógica de dados.


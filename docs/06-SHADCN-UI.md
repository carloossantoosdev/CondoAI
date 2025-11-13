# 06 — Guia para usar shadcn/ui no CondoAI

Este documento explica como instalar, configurar e manter componentes do [shadcn/ui](https://ui.shadcn.com) dentro do projeto CondoAI, seguindo as convenções já utilizadas no repositório.

---

## 1. O que é shadcn/ui?

shadcn/ui é uma coleção de componentes construídos com Radix UI + Tailwind. Diferente de bibliotecas tradicionais, os componentes são copiados para o projeto, permitindo personalização total.

No CondoAI usamos:
- CLI oficial (`npx shadcn-ui@latest`)
- Arquivo `components.json` para centralizar configurações (já existe no projeto)
- Componentes armazenados em `src/components/ui`
- Utilidades em `src/lib/utils.ts`

---

## 2. Pré-requisitos

- Projeto já configurado com Tailwind (ver `docs/05-SETUP-PROJETO.md`).
- Alias `@/*` ativos (`tsconfig.json`).
- Arquivo `components.json` com o schema oficial:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

Se estiver criando o projeto do zero, copie esse arquivo para a raiz.

---

## 3. Instalando a CLI

Execute o comando abaixo na raiz do projeto (usa npx para evitar instalação global):

```bash
npx shadcn-ui@latest init
```

Responda às perguntas:
- `Would you like to use TypeScript?` → **Yes**
- `Where is your tailwind.config.ts located?` → `tailwind.config.ts`
- `Where is your global CSS file?` → `src/app/globals.css`
- `Do you use React Server Components?` → **Yes** (App Router)
- `What import alias do you want to use for components?` → `@/components`
- `What import alias do you want to use for utils?` → `@/lib/utils`

O comando cria/atualiza `components.json` (não reescreva manualmente depois) e adiciona dependências necessárias.

---

## 4. Adicionando componentes

Depois da inicialização, adicione componentes conforme a necessidade. Exemplo com Button:

```bash
npx shadcn-ui@latest add button
```

O CLI irá:
- Gerar `src/components/ui/button.tsx`
- Atualizar/confirmar `lib/utils.ts` (função `cn`)
- Instalar dependências extras caso o componente precise (por exemplo, `lucide-react`)

> Dica: sempre verifique o diff após adicionar um componente.

### Componentes comuns do CondoAI

| Componente | Comando | Observações |
|------------|---------|-------------|
| Botão (Button) | `npx shadcn-ui@latest add button` | Base para ações primárias/secundárias |
| Card | `npx shadcn-ui@latest add card` | Usado em dashboards |
| Input | `npx shadcn-ui@latest add input` | Campos de formulário |
| Tabs | `npx shadcn-ui@latest add tabs` | Abas de navegação |
| Table | `npx shadcn-ui@latest add table` | Listagens (investimentos, dividendos) |
| Dialog | `npx shadcn-ui@latest add dialog` | Modais (ex. confirmar ação) |

---

## 5. Alinhando com o design do CondoAI

### 5.1 Tokens e cores

Os componentes usam variáveis CSS declaradas em `globals.css`. Verifique se os tokens essenciais estão presentes:

```css
:root {
  --background: 210 20% 95%;
  --foreground: 0 0% 3.9%;
  --card: 210 20% 98%;
  --card-foreground: 0 0% 3.9%;
  --primary: 16 100% 59%;
  --primary-foreground: 0 0% 100%;
  --muted: 210 15% 92%;
  --muted-foreground: 0 0% 45.1%;
  --border: 210 15% 88%;
}
```

Se precisar adaptar um componente para usar o laranja da marca:

```tsx
<Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
  Acessar carteira
</Button>
```

### 5.2 Utilitário `cn`

`shadcn/ui` utiliza uma função `cn()` para concatenar classes. Certifique-se de ter `src/lib/utils.ts` com o conteúdo padrão:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 6. Boas práticas de uso

- **Atualize aos poucos**: adicione apenas os componentes necessários.
- **Personalize no componente**: os arquivos gerados são seus; adapte `className`, variants e tokens conforme o design.
- **Documente variações**: se criar uma variant custom (ex.: botão “ghost” laranja), descreva no README da equipe.
- **Evite duplicatas**: antes de rodar `add`, verifique se o componente já existe em `src/components/ui`.
- **Checklist após adicionar**:
  - [ ] Dependências instaladas (`yarn install`)
  - [ ] Componentes gerados no local correto
  - [ ] Tokens de cor revisados
  - [ ] Storybook/Docs (quando aplicável) atualizados
  - [ ] PR com screenshot (desktop/mobile)

---

## 7. Atualizando componentes existentes

Caso o shadcn/ui publique mudanças e seja necessário atualizar:

1. Verifique o changelog oficial.
2. Replique manualmente as alterações (copiando o snippet atualizado da documentação).
3. Execute `yarn lint` e `yarn test` (quando existir cobertura) para garantir estabilidade.

> Não existe comando automático de upgrade; mantenha um histórico das modificações feitas em cada componente para facilitar futuras atualizações.

---

## 8. Recursos úteis

- Documentação oficial: [ui.shadcn.com/docs](https://ui.shadcn.com/docs)
- Lista de componentes disponíveis: [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
- Como estilizar com Tailwind: [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

Com este guia, o time consegue instalar e utilizar componentes shadcn/ui mantendo o padrão atual do CondoAI, garantindo consistência visual e facilitando a colaboração entre pessoas iniciantes e experientes.


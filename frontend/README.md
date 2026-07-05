# Memora Frontend

Frontend do Memora construído com React, TypeScript e Tailwind CSS.

O objetivo desta aplicação é entregar a experiência principal do MVP:

- cadastro e login de anfitriões
- criação e gestão de eventos
- página pública do evento via slug
- upload de fotos por convidados sem autenticação
- galeria privada para o anfitrião acompanhar os envios

O tema visual atual foi pensado para casamentos, com uma linguagem delicada, romântica e contemporânea.

## Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- PostCSS

## Objetivo de arquitetura

O frontend foi organizado para ser:

- componentizado
- reutilizável
- fácil de escalar
- sem duplicação desnecessária
- com separação clara entre layout, UI base, features e integração com API

Seguimos uma abordagem de composição:

- componentes base ficam em `src/components/ui`
- layouts compartilhados ficam em `src/components/layout`
- cada fluxo de produto vive dentro de `src/features`
- integração HTTP fica centralizada em `src/lib/api.ts`
- tipagens compartilhadas ficam em `src/types`

## Como rodar

### Pré-requisitos

- Node.js 20+ recomendado
- backend do Memora rodando localmente

### Instalação

```bash
npm install
```

### Ambiente

Crie um arquivo `.env` em `frontend/` com:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Desenvolvimento

```bash
npm run dev
```

O Vite sobe por padrão em algo como `http://localhost:5173`.

### Build de produção

```bash
npm run build
```

### Preview local do build

```bash
npm run preview
```

## Scripts

- `npm run dev`: sobe o frontend em modo desenvolvimento
- `npm run build`: gera o build de produção
- `npm run preview`: serve localmente o build gerado

## Rotas da aplicação

### Públicas

- `/login`: tela de login do anfitrião
- `/register`: tela de cadastro
- `/e/:slug`: página pública do evento para convidados

### Privadas

- `/app`: dashboard principal do anfitrião
- `/app/events/:eventId`: detalhe do evento com QR Code e galeria privada

## Estrutura de pastas

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── theme/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── events/
│   │   └── public/
│   ├── lib/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Detalhamento por camada

### `src/components/layout`

Responsável por cascas estruturais reutilizáveis.

- `auth-shell.tsx`: layout das telas de login e cadastro
- `app-shell.tsx`: layout das páginas privadas do anfitrião
- `public-shell.tsx`: estrutura da experiência pública
- `protected-route.tsx`: guarda de autenticação

### `src/components/theme`

Responsável pela identidade visual global.

- `falling-petals.tsx`: animação de pétalas caindo
- `floral-stage.tsx`: fundo decorativo com camadas florais e atmosfera romântica

### `src/components/ui`

Biblioteca interna de componentes reutilizáveis.

- `button.tsx`
- `card.tsx`
- `input.tsx`
- `textarea.tsx`
- `select.tsx`
- `badge.tsx`
- `empty-state.tsx`
- `section-heading.tsx`

Esses componentes concentram as decisões visuais. A regra é evitar recriar estilos diretamente nas páginas quando já existir um bloco reutilizável.

### `src/features/auth`

Fluxo de autenticação.

- páginas de login e cadastro
- formulário compartilhado
- `auth-context.tsx` para estado global da sessão

### `src/features/dashboard`

Área inicial do anfitrião após login.

- visão geral
- listagem de eventos
- ponto de entrada para criação de evento

### `src/features/events`

Fluxo privado de eventos.

- criação de evento
- cards de evento
- detalhe do evento
- QR Code
- galeria privada do anfitrião

### `src/features/public`

Experiência dos convidados.

- landing pública do evento
- upload anônimo
- lista pública de fotos do evento

### `src/lib`

Infraestrutura do frontend.

- `api.ts`: cliente HTTP centralizado com Axios
- `storage.ts`: persistência de token no navegador
- helpers de integração

### `src/types`

Tipagens compartilhadas entre telas e integrações.

- autenticação
- eventos
- fotos

## Integração com backend

Toda comunicação HTTP deve passar por `src/lib/api.ts`.

Isso garante:

- consistência no uso do `baseURL`
- headers centralizados
- melhor manutenção
- evitar `fetch` espalhado pela aplicação

Atualmente o frontend consome fluxos como:

- autenticação do anfitrião
- dados do usuário autenticado
- listagem e criação de eventos
- detalhe de evento
- QR Code do evento
- fotos privadas do evento
- página pública por slug
- fotos públicas por slug
- upload público de fotos

## Autenticação

O fluxo atual funciona assim:

1. o anfitrião faz login
2. o token é persistido no navegador
3. o `AuthProvider` reidrata a sessão ao carregar a aplicação
4. rotas privadas são protegidas por `ProtectedRoute`

Esse desenho mantém as páginas desacopladas da lógica de sessão.

## Sistema visual

O frontend usa uma direção de arte inspirada em sites modernos de casamento:

- fundo claro e etéreo
- tipografia editorial para títulos
- tipografia limpa para leitura
- tons rosados, creme e verde sálvia
- elementos arredondados com aspecto delicado
- animação de pétalas para reforçar atmosfera

## Tipografia

### Fonte de destaque

- `Cormorant Garamond`
- usada em títulos, hero sections e chamadas românticas

### Fonte de leitura

- `Manrope`
- usada em textos, labels, botões e formulários

## Paleta oficial

As cores principais estão definidas em `tailwind.config.ts`.

### Tons de texto

- `ink-950`: `#2F1E16`
- `ink-900`: `#4A2F22`
- `ink-800`: `#7C5A45`

Uso recomendado:

- `ink-950`: textos de maior contraste
- `ink-900`: títulos principais
- `ink-800`: textos auxiliares e descrições

### Tons de base quente

- `sand-50`: `#FFF9F5`
- `sand-100`: `#FBF1E8`
- `sand-200`: `#F3E0D0`
- `sand-300`: `#E7CDB8`
- `sand-400`: `#C89C73`

Uso recomendado:

- fundos claros
- superfícies suaves
- bordas quentes
- botões neutros com cara premium

### Tons rosados

- `rose-100`: `#FBE4EA`
- `rose-200`: `#F5CDD7`
- `rose-300`: `#E8A7B2`
- `rose-500`: `#D98D9E`

Uso recomendado:

- destaques românticos
- foco visual
- estados delicados de ação
- identidade principal do tema casamento

### Tons sálvia

- `sage-100`: `#E3EEE5`
- `sage-200`: `#CFE0D2`
- `sage-300`: `#A9C0AD`
- `sage-500`: `#6D9276`

Uso recomendado:

- ações secundárias elegantes
- balanço visual da paleta quente
- badges de sucesso
- seções informativas

## Gradientes e fundos

O projeto utiliza:

- `hero-radial`: gradiente radial e linear para áreas de destaque
- fundos claros com transparência
- sobreposição decorativa suave no `body`
- texturas visuais leves, sem poluir a leitura

## Cores por componente

### Botões

#### Botão primário

- fundo em gradiente creme claro
- borda em tom quente próximo de `sand-400`
- texto em `ink-900`
- uso: ações principais como criar evento, entrar e abrir fluxos

#### Botão secundário

- fundo branco translúcido
- borda quente suave
- texto em `ink-900`
- uso: ações de apoio

#### Botão ghost

- fundo transparente
- texto em `ink-800`
- uso: navegação discreta e ações de baixa hierarquia

#### Botão danger

- base rosada
- uso: ações destrutivas ou estados de alerta

### Cards

- fundo branco translúcido
- bordas suaves em tom pêssego
- cantos bem arredondados
- sombra macia

Uso recomendado:

- blocos de conteúdo
- formulários
- cards de evento
- containers de QR Code
- galerias

### Inputs, selects e textareas

- fundo branco com transparência leve
- borda em tom quente suave
- foco puxando para rosa claro
- texto principal em `ink-900`

Objetivo:

- manter legibilidade
- preservar a delicadeza do layout
- evitar aparência técnica demais

### Badges

Podem usar variações:

- neutra com base areia
- destaque com rosa
- sucesso com sálvia
- alerta com tom quente

## Responsividade

A interface foi pensada para funcionar bem em:

- desktop
- notebook
- tablet
- mobile

Decisões adotadas:

- grids flexíveis
- navegação adaptável
- espaçamentos generosos
- blocos empilháveis em telas menores

## Padrões de componentização

Para manter o frontend saudável conforme crescer, seguimos estas regras:

### 1. Evitar repetição

Se um mesmo bloco visual ou comportamental aparecer em mais de um lugar, ele deve virar componente.

### 2. Separar estrutura de aparência

- páginas orquestram dados e composição
- componentes UI concentram estilo base
- layouts cuidam do enquadramento da tela

### 3. Centralizar integração

Nenhuma feature deve criar chamadas HTTP ad hoc fora do cliente central quando isso puder ser evitado.

### 4. Tipar tudo que cruza fronteiras

Tudo que vem da API ou vai para a API deve usar tipos explícitos.

### 5. Componentes pequenos e legíveis

Preferimos vários componentes focados a arquivos muito grandes e difíceis de manter.

## Experiência atual do MVP

Hoje o frontend cobre os principais fluxos do MVP:

- cadastro de anfitrião
- login
- dashboard privado
- criação de evento
- acesso ao detalhe do evento
- visualização do QR Code
- página pública acessível por slug
- upload de fotos por convidados
- lista pública de fotos
- galeria privada do anfitrião

## Boas práticas para evolução

Ao continuar o desenvolvimento, manter:

- consistência da paleta
- uso das fontes oficiais
- reaproveitamento dos componentes base
- páginas enxutas
- lógica de API fora dos componentes visuais

Evitar:

- estilos inline repetidos
- chamadas HTTP espalhadas
- componentes gigantes
- misturar regra de negócio com apresentação

## Referência visual do tema

O tema atual foi inspirado em experiências de casamento com:

- hero amplo e elegante
- navegação com ar editorial
- animações suaves
- sensação floral e afetiva
- composição leve, feminina e premium

Isso está totalmente adequado para o MVP e cria uma identidade forte para a Memora começar focada em casamentos.

# MatriculaFácil — Frontend

Interface web do sistema de matrícula desenvolvida como projeto de treinamento da **CATI Jr.** (Trainee 2026).

## Sobre o projeto

Aplicação React que simula o fluxo de matrícula de um estudante: login, cadastro e visualização do painel com dados acadêmicos.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Estilização | Tailwind CSS 3 |
| CI/CD | GitLab CI / GitHub Actions |

## Pré-requisitos

- Node.js 20+
- npm 10+

## Como rodar localmente

```bash
# Instalar dependências
npm ci

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:5173`.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção (saída em `dist/`) |
| `npm run preview` | Pré-visualização do build de produção |

## Estrutura do projeto

```
src/
├── assets/         # Ícones SVG como componentes React
├── components/     # Componentes reutilizáveis (formulários, cabeçalhos, rodapés)
├── pages/          # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   └── DashboardPage.tsx
├── data/           # Dados mock para desenvolvimento
├── types.ts        # Tipos e interfaces TypeScript
├── App.tsx         # Componente raiz e roteamento por estado
└── main.tsx        # Entry point do React
```

## Páginas

- **Login** — autenticação do estudante
- **Cadastro** — criação de nova conta
- **Dashboard** — painel com dados acadêmicos (curso, período, semestre, matrícula)

## CI/CD

O pipeline executa `npm ci && npm run build` automaticamente em pushes para `main` e em merge requests, gerando o artefato em `dist/` com retenção de 1 semana.

- GitLab CI: `.gitlab-ci.yml`
- GitHub Actions: `.github/workflows/build.yml`

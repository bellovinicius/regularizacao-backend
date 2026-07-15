# Regularização Ambiental - Backend API

Backend Node.js/Express/TypeScript para plataforma SaaS de regularização ambiental rural.

## Setup Rápido

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Endpoints

### Auth
- `POST /api/auth/registro` - Registrar empresa + usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil do usuário

### Processos
- `POST /api/processos` - Criar processo
- `GET /api/processos` - Listar processos
- `GET /api/processos/:id` - Buscar processo
- `POST /api/processos/:id/avancar-etapa` - Avançar etapa

## Stack
- Node.js 18
- Express.js 4.18
- TypeScript 5.3
- Prisma 5.7
- PostgreSQL 15
- JWT

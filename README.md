# Backend - Regularização Ambiental Rural

Backend SaaS para regularização ambiental no Brasil.

## Setup Rápido

```bash
npm install
cp .env.example .env
npm run build
npm start
```

## Arquitetura

- Node.js + Express.js
- TypeScript
- PostgreSQL + PostGIS
- Prisma ORM
- JWT Authentication
- Multi-tenant

## Endpoints

### Auth
- POST /api/auth/registro
- POST /api/auth/login
- GET /api/auth/me

### Clientes
- POST /api/clientes
- GET /api/clientes
- GET /api/clientes/:id
- PUT /api/clientes/:id
- DELETE /api/clientes/:id

### Processos
- POST /api/processos
- GET /api/processos
- GET /api/processos/:id
- POST /api/processos/:id/avancar-etapa

## Deploy

Render.com + GitHub

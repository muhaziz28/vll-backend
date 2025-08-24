# express-ts-clean

A clean, scalable Express + TypeScript API starter with sensible defaults.

## Features

- TypeScript with strict mode and path aliases (`@app/*`)
- Express with security middlewares (helmet, cors)
- Centralized error handling and request logging (pino)
- Versioned routes (`/api/v1`), example `health` module
- ESLint + Prettier
- Prisma ORM + sample Todo CRUD

## Getting Started

```bash
npm install
npm run dev
```

Server will start on `http://localhost:3000` by default.

### Build & Run

```bash
npm run build
npm start
```

### Scripts

- `dev`: Run in watch mode using tsx
- `typecheck`: Validate types without emitting
- `build`: Compile TypeScript and rewrite path aliases
- `start`: Run compiled server
- `lint`: ESLint check
- `format`: Prettier write
- `prisma:generate`: Generate Prisma client
- `prisma:migrate`: Run development migrations (SQLite)
- `prisma:studio`: Launch Prisma Studio
- `test`: Run e2e tests (Vitest + Supertest)
- `test:watch`: Run tests in watch mode

## Project Structure

```
src/
  app.ts
  server.ts
  config/
    env.ts
  lib/
    logger.ts
    prisma.ts
  middlewares/
    error-handler.ts
    request-logger.ts
  routes/
    v1/
      index.ts
  modules/
    health/
      health.controller.ts
      health.route.ts
      health.service.ts
    todo/
      todo.controller.ts
      todo.service.ts
      todo.route.ts
      todo.types.ts
prisma/
  schema.prisma
  migrations/
```

## API

- `GET /api/v1/health` → `{ status: "ok", uptimeSec, timestamp, hostname, pid }`

### Todo CRUD Examples

- Create:

```bash
curl -X POST http://localhost:3000/api/v1/todos \
  -H 'Content-Type: application/json' \
  -d '{"title":"first task","description":"desc"}'
```

- List:

```bash
curl http://localhost:3000/api/v1/todos
```

- Get by id:

```bash
curl http://localhost:3000/api/v1/todos/<id>
```

- Update:

```bash
curl -X PUT http://localhost:3000/api/v1/todos/<id> \
  -H 'Content-Type: application/json' \
  -d '{"completed":true}'
```

- Delete:

```bash
curl -X DELETE http://localhost:3000/api/v1/todos/<id>
```

## Configuration

- Add `.env` if needed:

```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL="file:./prisma/dev.db"
```

### Prisma

- Inspect / modify data model in `prisma/schema.prisma`
- Apply migrations and generate client:

```bash
npm run prisma:migrate
npm run prisma:generate
```

### E2E Tests

- Run tests:

```bash
npm test
```

- Test stack: Vitest + Supertest. Tests live in `tests/**/*.e2e.ts`.
# express-ts-clean

A clean, scalable Express + TypeScript API starter with sensible defaults.

## Features

- TypeScript with strict mode and path aliases (`@app/*`)
- Express with security middlewares (helmet, cors)
- Centralized error handling and request logging (pino)
- Versioned routes (`/api/v1`), example `health` module
- ESLint + Prettier

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

## Project Structure

```
src/
  app.ts
  server.ts
  config/
    env.ts
  lib/
    logger.ts
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
```

## API

- `GET /api/v1/health` → `{ status: "ok", uptimeSec, timestamp, hostname, pid }`

## Configuration

- Add `.env` if needed:

```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```
# Multi-stage build untuk CI/CD optimized
FROM node:20-alpine AS base

# Install dependencies yang diperlukan
RUN apk add --no-cache \
    libc6-compat \
    dumb-init

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Copy prisma schema (jika ada)
COPY prisma ./prisma/

# Generate Prisma client
RUN npm run prisma:generate

# Debug: List files sebelum build
RUN echo "=== Files before build ===" && ls -la

# Build the application
RUN npm run build

# Debug: List files setelah build
RUN echo "=== Files after build ===" && ls -la

# Debug: Check build output directory
RUN echo "=== Build output directory ===" && \
    if [ -d "dist" ]; then ls -la dist/; \
    elif [ -d "build" ]; then ls -la build/; \
    elif [ -d ".next" ]; then ls -la .next/; \
    else echo "No common build directory found"; fi

# Production stage
FROM node:20-alpine AS production

RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    wget

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs appuser

WORKDIR /app

# Copy production dependencies
COPY --from=base --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=appuser:nodejs /app/package*.json ./

# Copy built application - sesuaikan dengan output build Anda
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
# Uncomment salah satu di bawah ini jika build output berbeda:
# COPY --from=builder --chown=appuser:nodejs /app/build ./build
# COPY --from=builder --chown=appuser:nodejs /app/.next ./.next

# Copy prisma files
COPY --from=builder --chown=appuser:nodejs /app/prisma ./prisma
COPY --from=builder --chown=appuser:nodejs /app/node_modules/.prisma ./node_modules/.prisma

RUN chown -R appuser:nodejs /app

USER appuser

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "start"]
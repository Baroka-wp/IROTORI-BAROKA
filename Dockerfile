# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Dépendances de production (prisma + toutes ses deps transitives)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Build Next.js
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# DATABASE_URL fictif : prisma generate lit seulement le schema, pas la DB
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

RUN npm run build
# S'assurer que public/ existe même s'il est vide
RUN mkdir -p /app/public

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — Runner (image finale)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Utilisateur non-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Output standalone + assets statiques
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

# Prisma schema + migrations
COPY --from=builder /app/prisma ./prisma

# Tous les node_modules de production (COPY depuis deps, pas de npm install ici)
# → inclut prisma CLI + effect + fast-check + toutes les deps transitives
COPY --from=deps /app/node_modules ./node_modules

# Script de démarrage (migrations + serveur)
COPY --chown=nextjs:nodejs scripts/docker-start.sh ./start.sh
RUN chmod +x ./start.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["./start.sh"]

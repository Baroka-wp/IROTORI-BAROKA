# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Dépendances
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Build Next.js
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# DATABASE_URL fictif : prisma generate lit seulement le schema, pas la DB
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — Runner (image finale, minimale)
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

# Prisma : schema + migrations + client natif pour le runtime
COPY --from=builder /app/prisma                   ./prisma
COPY --from=deps    /app/node_modules/.prisma      ./node_modules/.prisma
COPY --from=deps    /app/node_modules/@prisma      ./node_modules/@prisma
COPY --from=deps    /app/node_modules/prisma       ./node_modules/prisma
COPY --from=deps    /app/node_modules/.bin/prisma  ./node_modules/.bin/prisma

# Script de démarrage (migrations + serveur)
COPY --chown=nextjs:nodejs scripts/docker-start.sh ./start.sh
RUN chmod +x ./start.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["./start.sh"]

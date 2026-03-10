# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build Next.js
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
# Stage 2 — Runner (image finale)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Utilisateur non-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Installer les dépendances de production
# (inclut prisma + toutes ses dépendances transitives : effect, fast-check, etc.)
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev

# Output standalone + assets statiques
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

# Script de démarrage (migrations + serveur)
COPY --chown=nextjs:nodejs scripts/docker-start.sh ./start.sh
RUN chmod +x ./start.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["./start.sh"]

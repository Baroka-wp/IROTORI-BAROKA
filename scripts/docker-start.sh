#!/bin/sh
set -e

echo "──────────────────────────────────────────"
echo "  IROTORI BAROKA — Démarrage conteneur"
echo "──────────────────────────────────────────"

echo "▶ Exécution des migrations Prisma…"
./node_modules/.bin/prisma migrate deploy

echo "▶ Serveur Next.js sur le port ${PORT:-3000}…"
exec node server.js

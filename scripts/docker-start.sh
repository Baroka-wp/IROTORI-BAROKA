#!/bin/sh
set -e

echo "──────────────────────────────────────────"
echo "  IROTORI BAROKA — Démarrage conteneur"
echo "──────────────────────────────────────────"

echo "▶ Exécution des migrations Prisma…"
# Invoke prisma via its package entry (avoids __dirname wasm lookup issue in .bin/)
node ./node_modules/prisma/build/index.js migrate deploy

echo "▶ Serveur Next.js sur le port ${PORT:-3000}…"
exec node server.js

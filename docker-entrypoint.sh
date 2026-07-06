#!/bin/sh
set -e

echo "→ Aplicando schema no banco (prisma db push, com retry)..."
n=0
until npx prisma db push --skip-generate; do
  n=$((n+1))
  if [ "$n" -ge 15 ]; then
    echo "  falha ao conectar no banco após várias tentativas"
    exit 1
  fi
  echo "  banco indisponível, tentando novamente em 3s... ($n)"
  sleep 3
done

echo "→ Populando dados (seed)..."
npm run db:seed || echo "  seed já aplicado / ignorado"

echo "→ Iniciando aplicação..."
exec "$@"

#!/bin/sh
set -e

if [ "$NODE_ENV" = "development" ]; then
    echo "--- AMBIENTE DE DESENVOLVIMENTO ---"
    echo "🚀 Iniciando frontend em modo desenvolvimento..."
    npm run dev
else
    echo "--- AMBIENTE DE PRODUÇÃO ---"
    echo "⏳ Buildando o projecto..."
    npm run build
    echo "🚀 Iniciando frontend em modo produção..."
    npm run start
fi

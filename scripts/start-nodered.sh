#!/usr/bin/env bash
# Start Node-RED with env vars from .env (including FINNHUB_TOKEN)
set -e
cd "$(dirname "$0")/.."
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi
exec node-red

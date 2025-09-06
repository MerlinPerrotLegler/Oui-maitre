#!/usr/bin/env bash
# Dev helper: starts Postgres (Docker), the API server, and the web app
# Usage: ./dev.sh

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { printf "\033[1;36m==>\033[0m %s\n" "$*"; }

# 1) Start Postgres via Docker Compose (if available)
start_db() {
  if command -v docker >/dev/null 2>&1; then
    if docker compose version >/dev/null 2>&1; then
      log "Starting Postgres with 'docker compose' (infra/docker-compose.yml)"
      (cd "$ROOT_DIR/infra" && docker compose --env-file ./.env up -d db)
    elif command -v docker-compose >/dev/null 2>&1; then
      log "Starting Postgres with legacy 'docker-compose'"
      (cd "$ROOT_DIR/infra" && docker-compose --env-file ./.env up -d db)
    else
      log "Docker found but no compose plugin. Skipping DB start."
    fi
  else
    log "Docker not found. Assuming Postgres is available locally."
  fi
}

# 2) Ensure dependencies installed
install_deps() {
  log "Installing dependencies (root + workspaces)"
  npm install
}

# 3) Prepare database (Prisma)
prepare_db() {
  export DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5433/oui_maitre?schema=public}"
  log "Prisma generate"
  npx prisma generate --schema "$ROOT_DIR/apps/server/prisma/schema.prisma"
  log "Prisma db push (sync schema)"
  npx prisma db push --schema "$ROOT_DIR/apps/server/prisma/schema.prisma"
  log "Seeding development data"
  npm --workspace @oui-maitre/server run seed || true
}

# 4) Start server and web concurrently
start_apps() {
  log "Starting API server on http://localhost:3000 (Swagger: /docs)"
  npx tsx "$ROOT_DIR/apps/server/src/main.ts" &
  SERVER_PID=$!

  log "Starting web app on http://localhost:3001"
  npm --workspace @oui-maitre/web run dev -- -p 3001 &
  WEB_PID=$!

  log "Server PID: $SERVER_PID | Web PID: $WEB_PID"
  log "Press Ctrl+C to stop."

  cleanup() {
    log "Shutting down dev processes..."
    kill "$SERVER_PID" "$WEB_PID" 2>/dev/null || true
    wait "$SERVER_PID" "$WEB_PID" 2>/dev/null || true
  }
  trap cleanup INT TERM EXIT

  wait
}

main() {
  start_db
  install_deps
  prepare_db
  start_apps
}

main "$@"


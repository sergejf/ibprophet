#!/usr/bin/env bash
# Safe deployment script for IB Prophet (Wasp → Fly.io)
#
# Usage:
#   ./deploy.sh          # Full deploy (server + client)
#   ./deploy.sh --server # Server only
#   ./deploy.sh --client # Client only
#   ./deploy.sh --check  # Pre-flight checks only (no deploy)
#
set -euo pipefail

# flyctl writes "Warning: Metrics token unavailable" to stderr when it cannot
# reach its metrics endpoint. Wasp's deploy CLI captures stdout and stderr
# together and JSON.parse()s the result, so that one warning line lands after
# the closing "]" of `flyctl secrets list --json` and aborts the whole deploy
# with "Unexpected non-whitespace character after JSON". Disable metrics and the
# update check for every flyctl call, including the ones Wasp makes itself.
export FLY_SEND_METRICS=0
export FLY_NO_UPDATE_CHECK=1

FLY="${FLYCTL:-flyctl}"
APP_SERVER="ibprophet-server"
APP_CLIENT="ibprophet-client"
APP_DB="ibprophet-db"
VM_MEMORY=256  # Wasp defaults to 1GB; enforce 256MB after deploy

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
fail()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ---------- Pre-flight checks ----------

preflight() {
  echo ""
  echo "=== Pre-flight checks ==="
  echo ""

  # 1. Check Fly CLI is available
  command -v "$FLY" &>/dev/null || fail "flyctl not found. Set FLYCTL env var or add to PATH."
  info "flyctl found: $($FLY version 2>&1 | head -1)"

  # 2. Check Fly auth
  $FLY auth whoami &>/dev/null || fail "Not authenticated with Fly. Run: $FLY auth login"
  info "Authenticated with Fly"

  # 3. Check database is running and healthy
  echo ""
  echo "--- Database ($APP_DB) ---"
  local db_state
  db_state=$($FLY machines list -a "$APP_DB" --json 2>/dev/null | grep -o '"state": *"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')

  if [[ "$db_state" != "started" ]]; then
    warn "Database machine state: ${db_state:-unknown}"
    echo ""
    read -rp "Database is not running. Start it? [y/N] " yn
    if [[ "$yn" =~ ^[Yy]$ ]]; then
      local db_id
      db_id=$($FLY machines list -a "$APP_DB" --json 2>/dev/null | grep -o '"id": *"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
      $FLY machines start "$db_id" -a "$APP_DB"
      echo "Waiting 10s for Postgres to initialize..."
      sleep 10
    else
      fail "Cannot deploy without a running database."
    fi
  fi

  # Verify DB health checks are passing
  local db_checks
  db_checks=$($FLY status -a "$APP_DB" 2>/dev/null)
  if echo "$db_checks" | grep -q "passing"; then
    info "Database is running, health checks passing"
  else
    warn "Database is running but health checks may not be passing yet"
    echo "$db_checks" | grep -E "STATE|CHECKS|passing|warning|critical" || true
    echo ""
    read -rp "Continue anyway? [y/N] " yn
    [[ "$yn" =~ ^[Yy]$ ]] || fail "Aborted."
  fi

  # 4. Check for stuck server machines (max restart count reached)
  echo ""
  echo "--- Server ($APP_SERVER) ---"
  local server_json
  server_json=$($FLY machines list -a "$APP_SERVER" --json 2>/dev/null)
  local stuck_count
  stuck_count=$(echo "$server_json" | grep -c '"state": *"stopped"' || true)
  local total_count
  total_count=$(echo "$server_json" | grep -c '"id":' || true)

  if [[ "$stuck_count" -eq "$total_count" && "$total_count" -gt 0 ]]; then
    warn "All $total_count server machines are stopped (likely from crash loop)."
    warn "Deploy may fail with PM07 error. Machines will be restarted during deploy."
  else
    info "Server machines: $((total_count - stuck_count))/$total_count running"
  fi

  # 5. Check client
  echo ""
  echo "--- Client ($APP_CLIENT) ---"
  local client_state
  client_state=$($FLY machines list -a "$APP_CLIENT" --json 2>/dev/null | grep -o '"state": *"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
  info "Client machine state: ${client_state:-unknown}"

  echo ""
  info "Pre-flight checks complete."
  echo ""
}

# ---------- Deploy ----------

resize_machines() {
  local app=$1
  local machine_ids
  machine_ids=$($FLY machines list -a "$app" --json 2>/dev/null \
    | python3 -c "import json,sys; [print(m['id']) for m in json.load(sys.stdin) if m['config']['guest'].get('memory_mb',0) != $VM_MEMORY]" 2>/dev/null)

  for id in $machine_ids; do
    warn "Resizing $app machine $id to ${VM_MEMORY}MB (Wasp overrode it)"
    $FLY machines update "$id" -a "$app" --vm-memory "$VM_MEMORY" --yes
  done
}

deploy_server() {
  echo "=== Deploying server ==="
  wasp deploy fly deploy --skip-client

  echo ""
  echo "Verifying server..."
  sleep 5
  resize_machines "$APP_SERVER"
  $FLY status -a "$APP_SERVER"
  echo ""
  info "Server deployed."
}

deploy_client() {
  echo "=== Deploying client ==="
  wasp deploy fly deploy --skip-server

  echo ""
  echo "Verifying client..."
  sleep 3
  resize_machines "$APP_CLIENT"
  $FLY status -a "$APP_CLIENT"
  echo ""
  info "Client deployed."
}

# ---------- Main ----------

MODE="${1:---all}"

# Always set FLYCTL for environments where it's not in PATH
if [[ -x "$HOME/.fly/bin/flyctl" ]] && ! command -v flyctl &>/dev/null; then
  FLY="$HOME/.fly/bin/flyctl"
fi

if [[ "$MODE" == "--client" ]]; then
  echo ""
  echo "=== Pre-flight checks (client-only) ==="
  echo ""
  command -v "$FLY" &>/dev/null || fail "flyctl not found. Set FLYCTL env var or add to PATH."
  info "flyctl found: $($FLY version 2>&1 | head -1)"
  $FLY auth whoami &>/dev/null || fail "Not authenticated with Fly. Run: $FLY auth login"
  info "Authenticated with Fly"
  echo ""
else
  preflight
fi

case "$MODE" in
  --check)
    echo "Check-only mode — no deploy."
    ;;
  --server)
    deploy_server
    ;;
  --client)
    deploy_client
    ;;
  --all|*)
    deploy_server
    deploy_client
    echo ""
    info "Full deploy complete. Site: https://ibprophet.app/"
    ;;
esac

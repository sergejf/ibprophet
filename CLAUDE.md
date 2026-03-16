# Wasp Knowledge

Wasp knowledge can be found at @.claude/wasp/knowledge/general-wasp-knowledge.md

## Deployment

### Deploy Script (ALWAYS use this)

```bash
./deploy.sh          # Full deploy with pre-flight checks
./deploy.sh --check  # Pre-flight checks only (no deploy)
./deploy.sh --server # Server only
./deploy.sh --client # Client only
```

Never run `wasp deploy fly deploy` directly — the deploy script checks that the database is healthy before deploying, preventing server crash loops.

### Why This Matters

The Wasp server runs `prisma migrate deploy` on startup. If Fly Postgres is down, the server exits immediately, Fly restarts it up to 10 times, then the machine gets stuck in `stopped` state with a `PM07` error. Recovery requires manually starting the DB, then restarting server machines.

### Production Seeding (seed-prod.mjs)

Scripts that run **outside** of Wasp's build context (e.g., standalone seed scripts run with `node seed-prod.mjs`) cannot import from Wasp SDK internal paths like `.wasp/out/sdk/wasp/node_modules/@prisma/client/`. Use the standard `'@prisma/client'` package specifier instead — the root `node_modules` has it.

```bash
DATABASE_URL="<prod-connection-string>" node seed-prod.mjs
```

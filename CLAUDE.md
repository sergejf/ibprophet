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

Never run `wasp deploy fly deploy` directly — the deploy script checks that the database is healthy before deploying (preventing server crash loops) and auto-resizes machines back to 256MB after deploy (Wasp's generated fly.toml defaults to 1GB).

### Custom Domain & CORS

The app runs on `ibprophet.app` (primary) and `ibprophet-client.fly.dev` (legacy). Server middleware at `src/server/middleware.ts` allows CORS from both origins. If adding more domains, update the allowed origins there.

### Why This Matters

The Wasp server runs `prisma migrate deploy` on startup. If Fly Postgres is down, the server exits immediately, Fly restarts it up to 10 times, then the machine gets stuck in `stopped` state with a `PM07` error. Recovery requires manually starting the DB, then restarting server machines.

### Production Seeding (seed-prod.mjs)

Scripts that run **outside** of Wasp's build context (e.g., standalone seed scripts run with `node seed-prod.mjs`) cannot import from Wasp SDK internal paths like `.wasp/out/sdk/wasp/node_modules/@prisma/client/`. Use the standard `'@prisma/client'` package specifier instead — the root `node_modules` has it.

```bash
DATABASE_URL="<prod-connection-string>" node seed-prod.mjs
```

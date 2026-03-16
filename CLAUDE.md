# Wasp Knowledge

Wasp knowledge can be found at @.claude/wasp/knowledge/general-wasp-knowledge.md

## Deployment Lessons

### Production Seeding (seed-prod.mjs)

Scripts that run **outside** of Wasp's build context (e.g., standalone seed scripts run with `node seed-prod.mjs`) cannot import from Wasp SDK internal paths like `.wasp/out/sdk/wasp/node_modules/@prisma/client/`. Use the standard `'@prisma/client'` package specifier instead — the root `node_modules` has it.

**Run command:**
```bash
DATABASE_URL="<prod-connection-string>" node seed-prod.mjs
```

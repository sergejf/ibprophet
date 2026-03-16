# IB Prophet

IB Prophet helps IB Diploma students explore how their subject choices connect to university pathways and careers. Pick your HL and SL subjects, and instantly see which degrees and professions open up — with salary data, growth projections, and AI resilience ratings.

**Live:** https://ibprophet-client.fly.dev

## Features

- **Subject Explorer** — select up to 6 IB subjects (3 HL + 3 SL) and see matching university pathways via an interactive Sankey flow diagram
- **Career Cards** — 29 careers with UK/US salary ranges, 10-year growth outlook, and AI resilience tier (green/yellow/red)
- **Pathway Detail** — drill into any of the 20 university pathways to see required subjects and HL grade expectations
- **Subject Analysis** — 23 heuristics flag issues like essay overload, missing Maths HL for STEM, and BM+Econ overlap
- **University Benchmark** — Russell Group HL grade requirements with tier visualisation and predicted points input
- **Country Requirements** — Germany (KMK) admission rules checker
- **SEO-friendly URLs** — human-readable slugs (`/career/software-engineer`), not UUIDs
- **Zero friction** — no signup required; all reference data is public

## Data Coverage

- **39 IB subjects** across all 6 groups
- **20 university pathways** (STEM, Humanities, Social Sciences, Arts)
- **29 careers** with salary data (US & UK), growth outlook, AI resilience rating, pros/cons

## Tech Stack

- [Wasp](https://wasp.sh) — full-stack framework (React + Node.js + Prisma)
- PostgreSQL
- Tailwind CSS 4
- Vitest
- PostHog analytics
- Deployed on Fly.io

## Development

### Prerequisites

- Node.js (LTS)
- Wasp CLI: `npm i -g @wasp.sh/wasp-cli@latest`
- PostgreSQL (or use `wasp start db` for a Docker-managed instance)

### Setup

```bash
# Start the database
wasp start db

# Run migrations and seed data
wasp db migrate-dev --name init
wasp db seed

# Start the dev server
wasp start
```

The app runs at `http://localhost:3000`.

### Deployment

```bash
./deploy.sh          # Full deploy with pre-flight checks
./deploy.sh --check  # Pre-flight checks only (no deploy)
./deploy.sh --server # Server only
./deploy.sh --client # Client only
```

Always use `deploy.sh` — never run `wasp deploy fly deploy` directly. The script checks database health before deploying to prevent server crash loops.

## License

All rights reserved.

# IB Prophet

IB Prophet helps IB Diploma students explore how their subject choices connect to university pathways and careers. Pick your HL and SL subjects, and instantly see which degrees and professions open up — with salary data, growth projections, and AI resilience ratings.

## Features

- **Subject Explorer** — select up to 6 IB subjects (3 HL + 3 SL) and see matching university pathways
- **Career Cards** — each career shows UK/US salary ranges, 10-year growth outlook, and AI resilience tier (green/yellow/red)
- **Pathway Detail** — drill into any university pathway to see required subjects and HL grade expectations
- **Zero friction** — no signup required; all reference data is public

## Tech Stack

- [Wasp](https://wasp.sh) — full-stack framework (React + Node.js + Prisma)
- PostgreSQL
- Tailwind CSS 4
- Vitest

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

## License

All rights reserved.

# IB Prophet

IB Prophet helps International Baccalaureate Diploma students explore how their subject choices connect to university pathways and AI-ready careers. Pick your HL and SL subjects, and instantly see which degrees and professions open up — with AI exposure scores, salary data, growth projections, and BLS labor market stats.

**Live:** https://ibprophet.app

## Features

- **Subject Explorer** — select 6 IB subjects (3 HL + 3 SL) and see matching university pathways via an interactive Sankey flow diagram or list view
- **Subject Info Panels** — click any subject name for an official IBO-sourced description and direct link to the IB curriculum page on ibo.org
- **Facilitating Subject Badges** — amber badges on subjects that the Russell Group identifies as keeping the widest range of university degrees open; Language B subjects show "Facilitating at HL"
- **Essential / Recommended / Useful Labels** — Sankey tooltips and pathway detail panels show whether a subject is essential, recommended, or useful for each pathway (derived from weight + hlRequired data)
- **Career Cards** — 29 careers with AI exposure scores (1-9 with rationales, inspired by [karpathy/jobs](https://github.com/karpathy/jobs)), UK/US salary ranges, BLS labor market data, 10-year growth outlook, and AI resilience tier (green/yellow/red)
- **Pathway Detail** — drill into any of the 20 university pathways to see required subjects and HL grade expectations
- **Combination Analysis** — 34+ heuristics across Strengths, Limitations, and Recommendations — including facilitating subject count, classic archetype detection (science, life sciences, physical sciences), essay workload, trade-off weaknesses, and non-facilitating warnings
- **Options-Open Score** — shows how many of 20 university pathways your subjects connect to, with open/closed pathway pills and facilitating subject guidance
- **University Benchmark** — Russell Group HL grade requirements with tier visualisation and predicted points input
- **Country Requirements** — admission rules checker for Germany (KMK), United Kingdom (UCAS/Russell Group), and Netherlands (Nuffic), with flag emoji country selector
- **Guided UX** — step indicator (1-4) with checkmarks, section headers with step numbers, "Try an example" button, "Reset selection" button, and session persistence
- **Mobile Responsive** — Sankey auto-switches to list view on mobile, header/footer/picker adapt to narrow screens
- **Accounts — not yet shipped** — `/login` and `/signup` render a "Coming soon" placeholder. Auth is not merely hidden in the UI: the `auth` and `emailSender` blocks are absent from `main.wasp`, so no `/auth/*` endpoints are mounted at all.
- **SEO-friendly URLs** — human-readable slugs (`/career/software-engineer`), not UUIDs
- **Zero friction** — no signup required; all reference data is public

## Data Sources

- [Russell Group _Informed Choices_](https://www.informedchoices.ac.uk/) — facilitating subjects, subject combination guidance
- [IB Diploma Programme](https://www.ibo.org/programmes/diploma-programme/curriculum/) — subject groups, HL/SL structure, subject descriptions
- [US Bureau of Labor Statistics](https://www.bls.gov/ooh/) — median salary, employment, growth projections, education requirements
- [DAAD / KMK](https://www.daad.de/) — German university admission rules for IB diploma holders
- [karpathy/jobs](https://github.com/karpathy/jobs) — AI exposure scoring rubric, and 7 rationales reproduced verbatim (see _Data provenance_ below)
- [uniadmissions.co.uk](https://uniadmissions.co.uk) / [num8ers.com](https://num8ers.com) — Russell Group and global university IB point ranges

### Data provenance

AI exposure rationales come from two places, and every career records which:

| `rationaleSource` | Count | Meaning                                                                    |
| ----------------- | ----- | -------------------------------------------------------------------------- |
| `OWN`             | 22    | Written for this project, scored against the BLS occupational description  |
| `KARPATHY_JOBS`   | 7     | Reproduced verbatim from [karpathy/jobs](https://github.com/karpathy/jobs) |

The distinction is surfaced in the UI rather than kept in the database: a quoted
rationale is labelled as quoted, so the 22 judgements that are ours are not
presented interchangeably with the 7 that are not.

Two caveats worth stating plainly. `karpathy/jobs` carries no licence, so it is
"all rights reserved" by default — the 7 reproduced rationales are used as
attributed quotation. They are also LLM-generated (his `score.py` scores each
occupation via OpenRouter), which is why they are quoted rather than
paraphrased: rewriting machine-generated text to obscure its origin would add
no analysis and misrepresent where the judgement came from.

The underlying BLS Occupational Outlook Handbook data is a US Government work
and in the public domain.

## Data Coverage

- **40 IB subjects** across all 6 groups (including Geography)
- **20 university pathways** (STEM, Humanities, Social Sciences, Arts)
- **29 careers** with AI exposure scores (1-9), BLS labor market stats, salary data (US & UK), AI resilience rating, pros/cons
- **3 countries** for admission requirements (Germany, UK, Netherlands)

## Tech Stack

- [Wasp](https://wasp.sh) — full-stack framework (React + Node.js + Prisma)
- PostgreSQL
- Tailwind CSS 4
- @nivo/sankey — interactive flow diagrams
- Vitest (34 tests)
- PostHog analytics
- Deployed on Fly.io (custom domain: ibprophet.app)

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

### Configuration

No environment variables are required for local development — `wasp start db`
provisions a Docker-managed Postgres and injects `DATABASE_URL` for you. See
`.env.server.example` for the optional overrides and the production variables.

### Checks

```bash
npm test          # vitest (34 tests)
npm run lint      # eslint, zero warnings tolerated
npm run format    # prettier --write
```

These run on every push and pull request via GitHub Actions
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)), and on every commit
via a Husky pre-commit hook that also runs `gitleaks`.

### Deployment

```bash
./deploy.sh          # Full deploy with pre-flight checks
./deploy.sh --check  # Pre-flight checks only (no deploy)
./deploy.sh --server # Server only
./deploy.sh --client # Client only
```

Always use `deploy.sh` — never run `wasp deploy fly deploy` directly. The script checks database health before deploying to prevent server crash loops, and auto-resizes machines back to 256MB (Wasp defaults to 1GB).

## License

All rights reserved.

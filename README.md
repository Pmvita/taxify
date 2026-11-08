# Taxify

<div align="center">
  <!-- badges will be populated on first CI run -->
  <a href="https://github.com/Pmvita/taxify/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/Pmvita/taxify/ci.yml?branch=main&label=build&logo=github" alt="build" />
    </a>
    <a href="https://github.com/Pmvita/taxify/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/Pmvita/taxify/ci.yml?branch=main&label=test&logo=github-actions" alt="tests" />
    </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="license" />
  </a>
  <a href="https://www.npmjs.com/package/@taxify/core">
    <img src="https://img.shields.io/npm/v/@taxify/core.svg" alt="npm version" />
  </a>
  <a href="https://vercel.com/pierres-projects-3ccb9894/taxify-canada">
      <img src="https://img.shields.io/website?url=https://taxify-canada.vercel.app&label=deploy&logo=vercel" alt="deploy" />
    </a>
</div>

**Taxify** is a premium Canadian tax calculator for employees, sole proprietors, and corporations. Pick your person type and province, enter your numbers, and get a transparent, bracket-by-bracket calculation across all 10 provinces and 3 territories — for both the web app and the React Native Expo app.

> ⚠️ **Reference only.** Taxify computes *estimates* for planning. It does **not** file with the CRA (NETFILE). Always confirm with the Canada Revenue Agency.

## Run it

```bash
# 1. Install dependencies
npm install

# 2. Development
npm run dev            # web: http://localhost:3000
npm run test -w @taxify/core
```

## Tech stack

| Layer | Choice |
|---|---|
| Web | Next.js 16 + React 19 + TypeScript + Tailwind v4 |
| Mobile | React Native (Expo) — shares `@taxify/core` |
| Tax engine | Pure TypeScript — `packages/taxify-core` |
| Auth | Supabase (email + OAuth) |
| Billing | Stripe (3 paid tiers, 14-day free trial) |

## Repo structure

```
taxify/
├── packages/taxify-core/   # tax engine + CRA rate data (tests)
├── apps/web/               # Next.js 16 web app
├── apps/mobile/            # Expo mobile app
├── docs/                   # specs, plans, competitor analysis
└── scripts/                # release / data tooling
```

## Docs

- [Design doc](docs/superpowers/specs/2026-11-04-taxify-design.md)
- [Implementation plan](docs/superpowers/plans/2026-11-04-taxify-implementation-plan.md)
- [Competitor analysis](docs/competitor-analysis.md)

## License

Apache-2.0 — see [LICENSE](LICENSE).

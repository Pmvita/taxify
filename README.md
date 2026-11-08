# Taxify

<div align="center">
  <a href="https://github.com/Pmvita/taxify/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/Pmvita/taxify/ci.yml?branch=main&label=build&logo=github" alt="build" />
  </a>
  <a href="https://github.com/Pmvita/taxify/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/Pmvita/taxify/ci.yml?branch=main&label=test&logo=github-actions" alt="tests" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="license" />
  </a>
  <a href="https://taxify-canada.vercel.app">
    <img src="https://img.shields.io/website?url=https://taxify-canada.vercel.app&label=deploy&logo=vercel" alt="deploy" />
  </a>
</div>

**Taxify** is a Canadian tax calculator for employees, sole proprietors, and corporations. Pick your person type and province, enter your numbers, and get a transparent bracket-by-bracket estimate across all 10 provinces — on the web app and the Expo mobile shell that shares `@taxify/core`.

**Live:** https://taxify-canada.vercel.app

> If the production hostname returns Vercel `INFINITE_LOOP_DETECTED` (508), the Hobby team hit the daily deployment quota while a `vercel.json` fix was rolling out. Re-run `vercel --prod` from a short path (`C:\dev\taxify` or `subst T:`) after the quota resets so commit `fe2d5e3+` can rebuild without `outputDirectory`.

> Reference only. Taxify computes *estimates* for planning. It does **not** file with the CRA (NETFILE). Always confirm with the Canada Revenue Agency.

## Design system (Glacier Ledger)

Cool mist paper with glacier teal and a maple signal accent — light, northern, not cream/terracotta or purple SaaS defaults.

| Token | Hex | Role |
| --- | --- | --- |
| `--bg` | `#E6EDF4` | Page wash |
| `--ink` | `#0B1526` | Primary text |
| `--glacier` / `--steel` | `#0B6E6A` | Brand + result emphasis |
| `--maple` / `--orange` | `#C81D25` | Primary CTA |
| `--ice` | `#7EC8C3` | Step markers / soft data |

**Typography:** Syne (display / wordmark) + Figtree (UI) via `next/font/google`.

**Motion:** hero rise-ins, brand-mark sheen, net-pay count-up (respects `prefers-reduced-motion`). Hero uses a full-bleed glacier topographic texture in `apps/web/public/hero-glacier.jpg`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # @taxify/core vitest suite
npm run build
```

### Windows path note

If the repo lives under a folder with `)` (e.g. `1) Full-Stack Engineering`), Vitest/Vite can collect empty suites. Map a drive first:

```bat
subst T: "C:\Users\user\Desktop\MAIN\Projects\1) Full-Stack Engineering\taxify"
cd /d T:\
npm test
```

## Tech stack

| Layer | Choice |
|---|---|
| Web | Next.js 16 + React 19 + TypeScript + Tailwind |
| Mobile | React Native (Expo) — shares `@taxify/core` |
| Tax engine | Pure TypeScript — `packages/taxify-core` (27 Vitest cases) |
| Auth / billing | Supabase + Stripe hooks optional; calculators stay free |

## Repo structure

```
taxify/
├── packages/taxify-core/   # tax engine + CRA rate data + tests
├── apps/web/               # Next.js web app (Vercel)
├── apps/mobile/            # Expo mobile app
└── docs/                   # specs, plans, competitor analysis
```

## Docs

- [Design doc](docs/superpowers/specs/2026-11-04-taxify-design.md)
- [Implementation plan](docs/superpowers/plans/2026-11-04-taxify-implementation-plan.md)
- [Competitor analysis](docs/competitor-analysis.md)

## License

Apache-2.0 — see [LICENSE](LICENSE).

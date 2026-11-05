# Taxify — Design Doc

> **Status:** Approved-readiness — awaiting human approval before any build. (See "Approval & execution" at the end.)

---

## Intent & why

**Taxify** is a premium Canadian tax *calculation* tool for three user classes:

- **Employees** (T4) — gross → CPP / EI / income tax → net pay, with province selection.
- **Sole proprietors** (T2125) — revenue → expenses → net income → federal + provincial income tax + CPP/EI, with optional quarterly estimates.
- **Corporations** (T2) — taxable income → federal + provincial corporate tax + refundable Alt. Minimum Tax (AMT), with effective-rate output.

Every user can **switch their person type and their province at any time** and get a live, transparent calculation — no filing, just numbers, with every dollar traced to the bracket that produced it.

**Why now / why us:** Existing Canadian tax software is either (a) a *filing* product (TurboTax's guided return, $0–$200) or (b) a *double-entry accounting* product (Wave/Xero/QuickBooks) that still hands you to an accountant or a separate filer. Few things span the gap between "how much will I actually take home?" and "what does my province's bracket actually cost me?" — and none do it across all 10 provinces + 3 territories on both web and mobile. Competitors also hide the math behind a wizard.

### Competitor analysis (informing this design)

| Product | Strengths | Gaps we exploit |
|---|---|---|
| TurboTax Canada | Guided Q&A, CRA auto-fill, expert tiers ($0–$200), portrait-of-a-return summary, side-by-side couple | Filing is its goal; math is locked; expensive; desktop-heavy; no province-free-forever calculator |
| Keeper Tax | Expense tracking, quarterly estimates, AI assistant, $199/yr | US-focused (IRS); not Canadian |
| Wave | Free forever accounting (invoicing, receipts, GST/HST); Toronto-founded | Not a tax calculator; filing still separate |
| Xero / FreshBooks / QuickBooks | Double-entry, invoicing, payroll (T4/ROE via QuickBooks) | Mgmt reports, not a take-home calculator; accountants are a separate paid layer |

**Design takeaway:** lead with transparency + province switching + person-type switching, and make the bracket math the product, not a wizard's final number.

---

## Goals / non-goals / anti-goals

**Goals**
- Correct, versioned Canadian federal + 10-province + 3-territory + Quebec (separate system) tax math, 2024/2025 primary, 2026 reference.
- Switchable person type (employee / sole proprietor / corporation) and province, live.
- Transparent, bracket-by-bracket calculation with a per-line "how is this calculated?" breakdown.
- Web (Next.js 16) + mobile (Expo) sharing one tested calculation core.
- Supabase auth + Postgres + storage + realtime; Stripe billing with a free trial.
- Premium, human-designed UI (no generic AI-slop cards/gradients); dark mode; responsive.

**Non-goals**
- NETFILE / e-filing to the CRA (TurboTax/advTax do this).
- Double-entry bookkeeping (Wave does this).
- US tax (Keeper/TurboTax do this).
- Full-life-event planning (homes, education) — out of scope for v1.

**Anti-goals**
- Unbranded "generic gradient + floating card" UI.
- Server secrets committed; no client-side crypto (all math is deterministic, no secrets involved).
- Vaguely-versioned/missing CRA rate data.

---

## Constraints

- **Tech:** Web = Next.js 16 + React 19 + TypeScript + Tailwind v4. Mobile = Expo (latest stable). Share `packages/taxify-core` (pure TS, no DOM). Toolchain = npm workspaces (no pnpm installed).
- **Site root:** `C:\Users\user\Desktop\MAIN\Projects\full-staack`.
- **CRA data:** sourced from canada.ca (2025) + T4032 payroll guides; reference/disclaimer in-app + docs that real filers confirm with CRA.
- **Pricing:** free trial included; paid per class (bundled, later).
- **Deployment:** Web → Vercel (from this repo). Mobile → Expo (stores / EAS), not Vercel.

---

## Approaches

### A. Shared-core monorepo (recommended)
npm workspaces: `packages/taxify-core` (engine + data) + `apps/web` (Next.js) + `apps/mobile` (Expo). One tested math source; UI is the only divergence; CI/end-to-end tests one run.
*Trade-off:* monorepo tooling + path imports. Mitigated by a clean `packages/taxify-core` public API.

### B. Two repos, shared npm package
Separate web/mobile repos publishing `taxify-core`. *Trade-off:* publish step, easy drift.

### C. Backend-computed (Supabase Edge Functions)
Tax engine lives server-side; web + mobile call it. *Trade-off:* extra infra, would gate auth/billing path from day one and adds network dependency to every calculation.

**Decision:** A (shared-core monorepo). The calculation is deterministic and cheap; client-side math gives the "switch province live" feel and keeps the app fast; a later API layer reuses the same core.

---

## Parts of the how (decisions)

1. **Monorepo layout** — npm workspaces at repo root:
   - `packages/taxify-core/` — engine + data + types + tests. Public API:
     - `getRates(taxYear, jurisdiction)` → `{ federal, provinces, territories, quebec, basicPersonalAmount }`
     - `calculateFederalTax(taxYear, income)`
     - `calculateProvincialTax(taxYear, provinceCode, income)`
     - `calculateTerritorialTax(...)`, `calculateQuebecTax(...)`
     - `calculateEmployeeTax(taxYear, { gross, province, cppEe, ei })`
     - `calculateSoleProprietorTax(taxYear, { revenue, expenses, province, claimCpp }...)`
     - `calculateCorporateTax(taxYear, { taxableIncome, province, ...})`
     - `calculateNetPay(...)`, `calculateQuarterlyEstimate(...)`, `compareProvinces(...)`
   - `apps/web/` — Next.js 16 App Router UI + admin-ish calc router.
   - `apps/mobile/` — Expo app reusing the package.
   - `docs/`, `scripts/` (data, release, Vercel), `tests/` (vitest root config).
2. **Design system** — tokens in `globals.css` (steel blue `#2F54EB`-family, safety orange `#FF6B1A`-family, neutral grays, dark mode via `dark` class). Space Grotesk + Inter. A small set of custom components mirroring shadcn style but authored by hand (the "no AI look" requirement).
3. **Auth/billing** — Supabase Auth (email+oauth) + `profiles` + `records` tables; Stripe (Products/Price) with `trial_period_days: 14`, paid plans per class; webhook to promote trial → paid.
4. **Data file** — `packages/taxify-core/data/ca-tax-brackets.ts` with versioned tables per `taxYear`, each row `{ label, start, rate }`; sources attached as comments.
5. **Tests** — vitest at root; core units (bracket math, province switching, edge incomes); web component units; a handful of mobile hook units; CI runs `typecheck` + `test` + `build`.
6. **Repo hygiene** — `LICENSE` (Apache-2.0), `README.md` (badges: build, tests, license, version, demo, PRs; install steps), `CONTRIBUTING.md`, `.gitignore`, `CODEOWNERS`, GitHub issue/PR templates, `SECURITY.md`.
7. **Docs** — `README.md`, `docs/superpowers/specs/…`, `docs/superpowers/plans/…`, `docs/competitor-analysis.md`, `docs/release-notes.md`, a `changelog.md`.

---

## Left to the builder (post-approval)

- Scaffold the monorepo and `packages/taxify-core` engine + data.
- Implement the web UI + the Expo mobile UI.
- Wire Supabase + Stripe (trial).
- CI, tests, docs, repo hygiene, Vercel deploy.
- Publish to GitHub; hand the user a verified deploy link.

---

## Approval & execution

**What I need from you to proceed:**
1. Approve this design (or tell me what to change).
2. Choose an execution method:
   - **Native** (I implement every task in this session; cheapest/fastest).
   - **Subagent-driven** (a fresh subagent implements each task; a fresh reviewer checks before the next task starts; a whole-branch review at the end).

**Recommendation:** Native — the tasks are tightly coupled through `packages/taxify-core`, so a shared-session implementer keeps the API consistent faster.

# Taxify — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> Executed natively (one implementer keeps the shared `packages/taxify-core` API consistent).

**Goal:** Build Taxify — a premium Canadian tax calculator (web + Expo mobile) for employees, sole proprietors, and corporations, with province switching, a shared and thoroughly tested tax engine, Supabase auth, Stripe free-trial billing, and a ship-ready repo on GitHub + Vercel.

**Architecture:** npm workspaces monorepo at `C:\Users\user\Desktop\MAIN\Projects\taxify`.
- `packages/taxify-core/` — pure-TS tax engine + versioned CRA rate data + public API.
- `apps/web/` — Next.js 16 App Router UI.
- `apps/mobile/` — Expo app reusing the core package.
- `docs/`, `scripts/`, `tests/` (vitest root config), `packages/taxify-core/tests/`.

**Tech Stack:** Next.js 16 + React 19 + TypeScript + Tailwind v4; Expo (latest stable) + React Native; npm workspaces; vitest; Playwright (web E2E, optional); Supabase client; Stripe.

---

## Global Constraints

- Tax math is pure/deterministic — no secrets, no network. CRA rates come from `packages/taxify-core/data/`.
- Versioned rate tables: 2024 (reference), 2025 (primary), 2026 (reference + noted as such); every figure is traceable to `canada.ca`.
- Person type and province are switchable at any time; calculation updates live.
- UI: steel-blue + safety-orange accent tokens, Space Grotesk + Inter, dark mode, no generic AI-slop UI.
- Build/test/CI on every commit; Vercel deploy of `apps/web` only (mobile → Expo stores).

## Review Focus

1. **Employee take-home:** CPP/EI employee shares + income tax must net correctly from gross for every province (incl. QPBA handling in QC).
2. **Sole proprietor:** net income = revenue − expenses; business CPP/EI vs personal; quarterly estimate reasonableness.
3. **Corporation:** federal + provincial + refundable AMT + effective rate; 0% small-business deduction (not modeled; flagged).
4. **Provincial BPA:** correct non-refundable credit, Qc separate, 0 for territories.
5. **Boundary/precision:** rounding at the cent at each stage; integer-dollar edge cases.
6. **Auth/billing:** trial flag, paid state, and demo mode when Supabase/Stripe are absent.
7. **Web + mobile parity:** both run the same core functions and render the same numbers.

---

## Task 0: Repo scaffold

**Files:**
- Create: `taxify/package.json`, `taxify/.gitignore`, `taxify/LICENSE`, `taxify/README.md`
- Create: `taxify/packages/taxify-core/package.json`, `tsconfig.json`
- Create: `taxify/apps/web/package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `taxify/apps/mobile/` (Expo) — `package.json`, `app.json`, `src/app/_layout.tsx`, `src/app/page.tsx`
- Create: `scripts/`, `docs/superpowers/specs/2026-11-04-taxify-design.md` (already present)

**Interfaces:** (none yet — scaffold only)

- [ ] **Step 1:** Write `package.json` (workspaces: `packages/taxify-core`, `apps/web`, `apps/mobile`), tsconfigs, eslint, prettier, `.gitignore`, `LICENSE` (Apache-2.0), README stub.
- [ ] **Step 2:** Scaffold `apps/web` (Next.js 16), `apps/mobile` (Expo), and the core package.
- [ ] **Step 3:** `git init`, single root `package.json` install; seed `README.md` and `LICENSE`.
- [ ] **Step 4:** Commit `chore: scaffold Taxify monorepo`.

## Task 1: Core package scaffold + public API

**Files:**
- Create: `packages/taxify-core/src/types.ts`, `packages/taxify-core/src/index.ts`, `packages/taxify-core/src/format.ts`

**Interfaces** (exact signatures downstream tasks depend on):

```ts
// types.ts
export type TaxYear = 2024 | 2025 | 2026;
export type ProvinceCode = 'AB'|'BC'|'MB'|'NB'|'NL'|'NS'|'ON'|'PE'|'QC'|'SK'|'NT'|'NU';
export type PersonType = 'employee'|'soleProprietor'|'corporation';
export interface TaxBracket { label: string; start: number; }
export interface Jurisdiction { name: string; brackets: TaxBracket[]; bpa?: number; }
export interface RateTable {
  taxYear: TaxYear;
  federal: Jurisdiction;
  provinces: Record<ProvinceCode, Jurisdiction>;
  territories: Record<ProvinceCode, Jurisdiction>;
  quebec: Jurisdiction;
  qpba: number;
}
export interface TaxResult {
  gross: number; taxable: number;
  brackets: { label: string; amount: number; tax: number }[];
  tax: number;
}
export interface EmployeeTaxResult {
  gross: number; cpp: number; ei: number; federalTax: number; provincialTax: number;
  totalIncomeTax: number; netPay: number; breakdown: TaxResult[];
}
export interface SoleProprietorResult {
  revenue: number; expenses: number; businessNetIncome: number;
  cpp: number; ei: number; federalTax: number; provincialTax: number;
  totalIncomeTax: number; gstHstCredit?: never; estQuarterly: number[];
}
export interface CorporateResult {
  taxableIncome: number; federalTax: number; provincialTax: number;
  total: number; amtArefundable: number; effectiveRate: number;
}
export interface ProvinceComparison { province: ProvinceCode; label: string; netPay: number; totalTax: number; }
```

- [ ] **Step 1:** Write `types.ts` + `format.ts` (currency/percent helpers).
- [ ] **Step 2:** Write `index.ts` re-exporting the public API; keep it pure TS (no DOM).
- [ ] **Step 3:** `tsc --noEmit` passes and `index.ts` compiles.

## Task 2: Federal tax brackets + calculation (TDD)

**Files:** `packages/taxify-core/src/corporate.ts` (federal) / `test/federal.test.ts`

**Interfaces:** first import-free; tests import from `../src`.
- `getRateTable(taxYear): RateTable`
- `federalTax(table, income): TaxResult` — progressive brackets, returns per-bracket detail.

**Test list (write each, watch it fail, then implement):**
1. `federalTax` returns `gross === taxable` for 0.
2. `federalTax` 2025: income $57,375 → tax = 57375 × 14.5% = $8,319.38 exactly.
3. `federalTax` 2025: income $114,750 → first $57,375 @14.5% + next $57,375 @20.5% = $2,721.38 + $4,977.69 = $7,699.07... (compute precisely).
4. `federalTax` 2025: income $253,414 → crosses all brackets to 33% cap; exact cents.
5. `federalTax` 2025: income above top brackets → 33% on the top slice only.
6. `federalTax` 2026 (lowest bracket 14%: confirming from CRA note).

- [ ] **Step 1:** Write the failing test file (above cases).
- [ ] **Step 2:** Run → fails with "module not found" / "function not defined".
- [ ] **Step 3:** Implement `federalTax` in `corporate.ts`.
- [ ] **Step 4:** Run → all pass.
- [ ] **Step 5:** Commit `feat: federal tax brackets 2024-2026`.
- [ ] **Step 6:** Verify CPP/EI 2025 rates via web (T4032) — feed into Task 5/7.

## Task 3: Basic personal amount (BPA) credit

**Files:** `packages/taxify-core/src/corporate.ts` + `test/bpa.test.ts`

**Interfaces:** `federalNetTax(table, income): number` — gross progressive tax minus federal BPA ($16,129 for 2025; min $14,538 above $253,414), floored at 0.

- [ ] **Step 1:** Write failing tests:
  - income $0 → net tax 0.
  - income $50,000 → net = federalTax − $16,129 (≥ 0).
  - income $1,000,000 → net = federalTax − $14,538 (min BPA applies).
  - income $100 → net stays 0.
- [ ] **Step 2:** Run → fails.
- [ ] **Step 3:** Implement `federalNetTax`.
- [ ] **Step 4:** Run → pass. Commit.

## Task 4: Provincial tax + net (all 10 provinces)

**Files:** `packages/taxify-core/src/provincial.ts` + `test/provincial.test.ts`

**Interfaces:** `provincialNetTax(table, province, income): number`

**Test list:** 2025 rates for each of: ON (5.05/9.15/11.16/12.16/13.16), BC (5.06…20.5), AB (8…15), SK (10.5/12.5/14.5), MB (10.8/12.75/17.4), NB (9.4/14/16/19.5), NL (8.7…21.8), NS (8.79…21), PEI (9.5/13.47/16.6/17.62/19), QC (14/19/24/25.75 — but QC handled separately in Task 5).
- [ ] **Step 1:** Write failing province tests for 3 provinces + one "income exactly at bracket boundary" test per province.
- [ ] **Step 2:** Run → fails.
- [ ] **Step 3:** Implement progressive provincial lookup with exact-cent rounding.
- [ ] **Step 4:** Run → pass. Commit.
- [ ] **Step 5:** Expand to remaining provinces + territories as data lands.

## Task 5: Quebec + territories

**Files:** `packages/taxify-core/src/quebec.ts` + `test/quebec.test.ts`

**Interfaces:** `quebecNetTax(table, income): number`; territories return `0` (no provincial BPA; territorial tax is on the return via a separate schedule and is out of scope — flagged).

- [ ] **Step 1:** Write failing tests (QC progressive 14/19/24/25.75; NT/NU/NT/NU boundaries).
- [ ] **Step 2:** Run → fails.
- [ ] **Step 3:** Implement. Commit.

## Task 6: Employee tax (net pay)

**Files:** `packages/taxify-core/src/employee.ts` + `test/employee.test.ts`

**Interfaces:** `calculateEmployeeTax(table, input): EmployeeTaxResult`

Input: `{ grossIncome: number; province: ProvinceCode; cppRrProportionable: number; }

Behaviors to pin:
1. 2025 ON, gross $80,000 → CPP (5.95% up to $69,700) + EI (1.66% up to $61,500) + federal + provincial, exact cents; netPay = gross − cpp − ei − totalTax.
2. Income below CPP floor → cpp 0.
3. Income above EI max insurable → EI at max.
4. Net pay floors at 0 (no refund beyond withholding assumptions — we model gross, not per-pay-period).
- [ ] **Step 1:** Write failing tests.
- [ ] **Step 2:** Run → fails.
- [ ] **Step 3:** Implement (CPP/EI rates as 2025 reference; flag in-app).
- [ ] **Step 4:** Run → pass. Commit.

## Task 7: Sole proprietor tax

**Files:** `packages/taxify-core/src/soleProprietor.ts` + `test/soleProprietor.test.ts`

**Interfaces:** `calculateSoleProprietorTax(table, input): SoleProprietorResult`

Input: `{ revenue: number; expenses: number; province: ProvinceCode; claimCpp: boolean; }`

Behaviors:
1. 2025 ON, revenue $100,000, expenses $30,000 → businessNetIncome $70,000; federal + provincial on $70,000; CPP/EI optional.
2. expenses > revenue → businessNetIncome 0 (floor), no refund of excess.
3. estQuarterly = incomeTax / 4 (approx, flagged as pre-payment planning).
- [ ] **Step 1:** Write failing tests.
- [ ] **Step 2:** Implement. Commit.

## Task 8: Corporate tax

**Files:** `packages/taxify-core/src/corporate.ts` + `test/corporate.test.ts`

**Interfaces:** `calculateCorporateTax(table, input): CorporateResult`

Input: `{ taxableIncome: number; province: ProvinceCode; }`

Behaviors:
1. Business limit + small business rate (flag: small-business deduction not modeled; simply report effective rate).
2. Federal + provincial corporate brackets; 0% federal tax on first $500k (small business) — flag as simplified.
3. Refundable AMT = 20% of (taxable income − investment tax propertyadjustments) floored at 0 — approximate; flag.
4. Effective rate = total / taxableIncome.
- [ ] **Step 1:** Write failing tests (boundary $500k, top bracket, AMT floor).
- [ ] **Step 2:** Implement. Commit.

## Task 9: Province comparison

**Files:** `packages/taxify-core/src/compare.ts` + `test/compare.test.ts`

**Interfaces:** `compareProvinces(table, input): ProvinceComparison[]`

Behavior: return all jurisdictions sorted by netPay (employee) or by totalTax (sole/corp), so users see "which province is best for me right now."
- [ ] **Step 1:** Write failing tests (2 provinces, 1 employee + 1 sole case).
- [ ] **Step 2:** Implement. Commit.

## Task 10: Rate table data (`packages/taxify-core/data/ca-tax-brackets.ts`)

**Files:** `packages/taxify-core/data/ca-tax-brackets.ts` (+ `data/README.md` with sources)

Behaviors:
1. 2025 federal + 10 provinces + 3 territories + QC, each bracket exact.
2. 2026 federal low bracket = 14% (CRA note), rest from indexed 2025 — flagged as reference.
3. Every bracket entry has a comment citing `canada.ca` URL + year.
4. Exported as a single `getRateTable(taxYear)` map.
- [ ] **Step 1:** Write/verify the data file against CRA sources (web).
- [ ] **Step 2:** Rust-test `getRateTable(2025)` equals the computed per-bracket figures.
- [ ] **Step 3:** Commit `data: add versioned CRA rate tables`.

## Task 11: Core integration tests + CI smoke

**Files:** `packages/taxify-core/tests/index.test.ts`, root `vitest.config.ts`, `packages/taxify-core/package.json` (type: module, test script).

- [ ] **Step 1:** One smoke test importing all public functions.
- [ ] **Step 2:** `npm test` passes; `tsc --noEmit` passes for the whole monorepo.
- [ ] **Step 3:** Commit `test: core suite smoke + tooling`.

## Task 12: Web scaffold + design tokens

**Files:** `apps/web/src/styles/globals.css`, `apps/web/src/components/ui/`, `apps/web/src/app/layout.tsx`, `apps/web/src/app/globals.css`.

Behaviors:
1. Design tokens (steel blue + safety orange + grays + dark mode `dark` class on `<html>`).
2. Base layout + footer.
- [ ] **Step 1:** Write globals.css tokens + normalize.
- [ ] **Step 2:** Layout + simple home. Commit.

## Task 13: Web calculator shell + selectors

**Files:** `apps/web/src/components/CalculatorShell.tsx`, `apps/web/src/components/PersonTypeSelector.tsx`, `apps/web/src/components/ProvinceSelector.tsx`.

Behaviors:
1. Toggle person type (employee/sole/corp) — drives which calculator renders.
2. Province selector — drives calculation.
3. Renders the active calculator view with inputs bound to a `calcState` store.
- [ ] **Step 1:** Write component; wire state. Commit.

## Task 14: Web employee calculator + breakdown

**Files:** `apps/web/src/components/EmployeeCalculator.tsx`, `apps/web/src/components/ResultBreakdown.tsx`.

Behaviors:
1. Inputs: gross income, province, optional CPP/EI override.
2. Computes via `calculateEmployeeTax` from the core.
3. Shows net pay + federal + provincial + CPP + EI with a per-line "how calculated" panel.
4. "Compare provinces" button → shows ProvinceComparison list.
- [ ] **Step 1:** Write + bind. Commit.

## Task 15: Web sole proprietor + corporation calculators

**Files:** `apps/web/src/components/SoleProprietorCalculator.tsx`, `apps/web/src/components/CorporationCalculator.tsx`.

Behaviors:
1. Sole: revenue, expenses, province, CPP claim → net; quarterly estimate.
2. Corp: taxable income, province → federal/prov/total/AMT/effective rate.
3. Both include the comparison list.
- [ ] **Step 1:** Implement + bind. Commit.

## Task 16: Web results panel + detail

**Files:** `apps/web/src/components/ResultsPanel.tsx` + a `calcStore.ts` (Zustand or plain):

Behaviors:
1. Single source of truth for `calcState`.
2. Persistent "how is this calculated" line-by-line panel.
3. Print/download-friendly results view.
- [ ] **Step 1:** Implement. Commit.

## Task 17: Auth (Supabase)

**Files:** `apps/web/src/lib/supabase-client.ts`, `src/components/Auth.tsx`, `src/lib/billing.ts`.

Behaviors:
1. SSO+email sign-in; on success, upsert `profiles` (id, email, name, plan, trialUntil).
2. `getCurrentUser()` returns user or null; guest → demo mode.
- [ ] **Step 1:** Wire Supabase client (env keys, placeholder until real project). Commit.

## Task 18: Stripe billing (free trial)

**Files:** `apps/web/src/lib/stripe.ts`, `src/components/BillingCheckout.tsx`, `src/lib/billing.ts`.

Behaviors:
1. Subscription products/price for 3 tiers (Employee $4.99/mo, Sole $9.99/mo, Corp $14.99/mo).
2. Checkout → success → webhook → `profiles.plan = paid`, `trialUntil = now`.
3. Free trial: `trial_period_days: 14` on Price; UI shows "Free trial" badge until expiry.
4. Payment-mocked / demo mode when Stripe keys absent (always visible in dev).
- [ ] **Step 1:** Implement with test mode keys; demo mode always fakes a successful checkout. Commit.

## Task 19: Mobile (Expo)

**Files:** `apps/mobile/src/components/...`, `apps/mobile/app/_layout.tsx`, `app/calculator.tsx`.

Behaviors:
1. Expo navigation (bottom tab: Calculator, About/Help).
2. Reuses `packages/taxify-core` + same design tokens (via CSS import or shared theme module).
3. Person-type + province selector + calculator screens (same as web).
- [ ] **Step 1:** Scaffold + link core package. Commit.
- [ ] **Step 2:** Build (`npx expo export`) passes. Commit.

## Task 20: Mobile pages + parity

**Files:** `apps/mobile/app/calculator/Employee.tsx`, `SoleProprietor.tsx`, `Corporation.tsx`, `compare.tsx`.

Behaviors:
1. Full calculator screens matching the web feature set on a phone-sized canvas.
2. Same computed numbers as web for identical inputs (parity test via core).
- [ ] **Step 1:** Implement. Commit.

## Task 21: Mobile auth + billing + demo

**Files:** `apps/mobile/src/lib/auth.ts`, `src/lib/billing.ts`.

Behaviors:
1. Supabase client on mobile (same tenant).
2. Billing checkout + trial, demo mode off when keys present.
- [ ] **Step 1:** Implement. Commit.

## Task 22: Test suite (comprehensive)

**Files:** `test/...` (core units), `apps/web/tests/...` (component units).

- [ ] **Step 1:** Expand core tests to every province's boundary and edge income; 3 person types + 3 tax years.
- [ ] **Step 2:** Web component tests for person-type switching + province switching.
- [ ] **Step 3:** `npm test` (entire suite) green; `tsc --noEmit`; `npx expo export`; `next build` for web.
- [ ] **Step 4:** Commit `test: comprehensive suite + parity`.

## Task 23: CI + docs + repo hygiene

**Files:** `.github/workflows/ci.yml`, `docs/competitor-analysis.md`, `docs/superpowers/plans/2026-11-04-taxify-implementation-plan.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODEOWNERS`, issue/PR templates.

Behaviors:
1. CI: `typecheck`, `test`, `build`, lint on every PR.
2. README badges (build, tests, license, version, demo, PRs).
3. `docs/competitor-analysis.md` — the full table + design takeaway.
- [ ] **Step 1:** Write CI + docs. Commit. `git log` shows a clean, complete history.

## Task 24: GitHub + Vercel deploy + final verification

**Files:** repo on GitHub; Vercel project connected.

- [ ] **Step 1:** Create GitHub repo; push all branches/tags; add LICENSE + README.
- [ ] **Step 2:** Connect Vercel to the repo; deploy `apps/web`; verify the deployed site loads and computes.
- [ ] **Step 3:** Run the final suite live: `npm test`, `npx expo export`, `next build`, Vercel deploy URL returns 200 + a calculation.
- [ ] **Step 4:** Report: GitHub URL, Vercel URL, tests green, and what's left (e.g., stores for the Expo app, QC withholdings, real Stripe production keys).

---

## Appendix: exact CRA numbers (2025) to use

- Federal (2025): 14.5% ≤$57,375; 20.5% $57,375–$114,750; 26% $114,750–$177,882; 29% $177,882–$253,414; 33% >$253,414. **2026:** lowest = 14%.
- Federal BPA 2025: $16,129 (≤$177,882); $14,538 (>$253,414).
- CPP 2025 employee: 5.95% on pensionable up to $69,700; max $4,568.40.
- EI 2025 employee: 1.66% on insurable up to $61,500; max $1,127.40.
- Provincial (2025) — see Task 4/5 data file; verify each year via `canada.ca`.

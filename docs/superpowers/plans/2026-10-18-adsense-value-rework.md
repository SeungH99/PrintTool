# AdSense value and policy fixes — implementation plan

> **For agentic workers:** Use test-first implementation for behavior changes and independent review after integration. Steps use checkbox syntax for tracking.

**Goal:** Fix all five findings approved by the user in the 2026-10-18 AdSense rejection audit.

**Architecture:** Keep existing bilingual routes and tools. Replace metadata-only teaching fixtures with deterministic, meaningful artwork and correction examples; improve task-oriented editorial content. Add a single explicit route eligibility boundary for ads and real persisted analytics/advertising preferences that cooperate with regional Google CMP rather than bypassing it.

**Tech Stack:** Next.js, React, TypeScript, pdf-lib, existing image/PDF tooling, Vitest, Playwright, OpenNext Cloudflare.

**Spec:** `docs/audits/2026-10-18-adsense-rejection-audit.md`, findings 1–5 and the user's instruction to fix all on a new branch without a worktree.

## Global constraints

- Use `codex/adsense-value-rework` in the existing checkout, starting at `origin/main` (`528b609`). Do not create a worktree.
- Preserve user `.gitignore`, Bases/Ideas/Logs, `_CLAUDE.md`, `index.md`, `log.md`, and `printready-logo.png`.
- Keep all 17 tools and Korean/English routes. No new dependencies, invented expertise, fabricated print experiments, or approval guarantees.
- Illustrative artwork and calculated results must be labeled honestly; do not imply physical print testing.
- Do not change AdSense/Cloudflare console settings, deploy, submit a review, or merge/push a shared branch.

## Review focus

- Example correction must change the actual PDF/image being downloaded, not only displayed expected values.
- Bleed evidence must distinguish artwork reaching bleed from merely having a BleedBox; keep manual checks explicit.
- Cookie rejection must affect real GA/AdSense loading and survive navigation/reload, including previously loaded scripts.
- Regional CMP denial must never be overridden by a local preference; GPC takes precedence.
- Genuine and nested 404s must stay ad-free without blocking recognized tools/guides; policy and contact routes should not request ads.

## Task 1: Meaningful deterministic artwork and teaching cases

Owner: sample/case implementation worker.

Files: `scripts/generate-case-study-samples.mjs`, `public/samples/*`, `src/content/caseStudies/*`, `src/components/guides/*`, related content/sample component tests.

- [x] Add failing artifact/consumer tests for nonuniform instructional image, visible PDF artwork, corrected sample geometry/DPI, and usable before/after evidence.
- [x] Generate original 1200×800 artwork containing text/patterns/fine lines and colored content; preserve deterministic output and existing sample URLs where feasible.
- [x] Add a real correction comparison (e.g. same 1200 px image at 100 mm ≈304.8 DPI versus 297 mm ≈102.63 DPI), and meaningful bleed/non-bleed artwork, keeping intended page-box evidence honest.
- [x] Update all five bilingual cases with concrete reproduction, interpretation, correction and handoff steps; expose visual preview/annotation in the article using existing component patterns. Numerical tables must match artifact bytes.
- [x] Re-generate twice, check hashes, inspect image/PDF rendering, and run focused tests. Report exact changed paths and evidence; do not commit while other workers are editing.

## Task 2: Task-oriented guides and trustworthy PDF instructions

Owner: editorial/PDF UI worker.

Files: `src/content/guides.ts`, `src/content/toolExamples.ts`, `src/i18n/dictionaries/{ko,en}.ts`, `src/components/calculators/PdfPreflight.tsx`, `src/lib/preflight/report.ts` if necessary, `src/app/[locale]/guides/[slug]/page.tsx` only for supported editorial presentation, related tests.

- [x] Reproduce the detected RGB/102.6 DPI shown as unset with a failing user-visible test; distinguish missing boxes, detected RGB, low resolution and manual checks.
- [x] Correct absolute RGB→CMYK/warnings-cleared claims in both locales and any unsupported tool promises. Do not add brittle prose-equality tests.
- [x] Turn GSM and banner guides into complete worked tasks with literal hand-checked numbers, input assumptions, decision steps, pitfalls, handoff checklist and source scopes.
- [x] Expand short tool guidance where it serves the tool's actual task, with concrete interpretation/next action and limitations, not generic repeated paragraphs or word-count padding.
- [x] Run focused tests/typecheck; report changes and any integration requirements. Do not modify sample/case files or consent components.

## Task 3: Explicit ad eligibility and real consent controls

Owner: consent/advertising worker.

Files: consent modules/hooks, `ConsentScripts`, cookie settings UI/new focused component and messages, policy HTML, ad route eligibility helper, related tests and focused E2E; coordinate any shared layout changes.

- [x] Add failing tests for unrecognized/nested/error/contact/terms/privacy routes excluding ads and for valid content routes allowing ads.
- [x] Fix 404 GA initialization and ensure no ad request on noncontent/error screens. Gate ads through positive recognized route eligibility, not an open-ended pathname exclusion.
- [x] Provide accessible localized persisted analytics/advertising preferences for non-CMP visitors, with reject/accept/customize and a working reopen path. Regional CMP remains authoritative where applicable; provide an honest not-ready fallback rather than overriding regional denial. Respect GPC.
- [x] Ensure saving/revoking affects actual loading and already-running integrations (hard reload is acceptable), and update policy to accurately describe behavior. Do not promise cookie deletion if third-party cookies cannot be removed.
- [x] Run meaningful RED/GREEN unit/UI tests and supply E2E scenarios. No new dependency, fabricated legal claim, console action, deploy or commit.

## Integration and completion

- [x] Review every worker diff against findings 1–5; repair integration through the responsible worker.
- [x] Check formatting only on changed source files; preserve unrelated formatting/user edits.
- [x] Run lint, typecheck, full Vitest, production Next build, full Playwright, and OpenNext Worker build with approval outside the sandbox when needed.
- [x] Inspect desktop/mobile cases, generated artwork and cookie controls; check true 404/no ad request, consent persistence/revocation, and convert→download→same-file preflight.
- [x] Obtain independent whole-change review, resolve important findings and rerun affected checks.
- [x] Report branch, changes, verification and remaining external console/live review limitations. No approval guarantee.

## Execution log

- 2026-10-18: User approved fixes 1–5 and required current-checkout branch isolation. New branch created from remote main; no product changes were present initially.
- Implementation choice: Use existing dependencies and meaningful digital artwork; no physical print claim is needed.
- Completed: meaningful sample/case work, bilingual task guidance/PDF labels, explicit consent and error-route exclusion. Preserved all 17 tools and existing bilingual routes.
- Integration corrections: centered A4 fixture now matches actual converter at 6 mm top/bottom; PDF pass-through retains original color label; mobile RelatedTools cards allow shrinking at 320/375 px.
- Independent review: repaired canonical gtag Arguments protocol and independent root-error runtime shutdown; no remaining Critical/Important findings.
- Final verification: 55 Vitest files / 308 tests, 50 Playwright tests, lint/typecheck/scoped formatting, 103-page Next build and OpenNext Worker build all passed. Ten regenerated artifacts had no byte drift. Details: `docs/audits/2026-10-18-adsense-fixes-verification.md`.

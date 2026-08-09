# Final whole-branch fix report

Date: 2026-08-09

Branch: `codex/adsense-content-restructure`

Starting commit: `55f07cb`

## Outcome

This single fix wave closes the final-review Critical/Important findings and the bounded deferred minors. The five-case taxonomy, all existing routes, the 17-tool catalog, the desktop PDF CTA, and shared bilingual evidence records remain intact.

## Changed paths

- Plan and evidence generation:
  - `docs/superpowers/plans/2026-08-09-adsense-content-restructure.md`
  - `scripts/generate-case-study-samples.mjs`
  - `public/samples/booklet-scenarios.json`
- Browser coverage:
  - `e2e/app.spec.ts`
  - `e2e/case-studies.spec.ts`
  - `e2e/convert.spec.ts`
- Article and case-study presentation:
  - `src/app/[locale]/guides/[slug]/page.tsx`
  - `src/components/guides/CaseStudyCard.tsx`
  - `src/components/guides/CaseStudyView.tsx`
  - `src/components/guides/ExpectedObservedTable.tsx`
  - `src/content/articleMeta.ts`
  - `src/content/caseStudies/types.ts`
  - `src/content/guides.ts`
  - `src/content/toolCaseLinks.ts`
  - `src/content/toolExamples.ts`
- Mobile navigation and localized copy:
  - `src/components/layout/MobileNav.tsx`
  - `src/i18n/dictionaries/en.ts`
  - `src/i18n/dictionaries/ko.ts`
- Regression tests:
  - `tests/components/CaseStudyView.test.tsx`
  - `tests/components/MobileNav.test.tsx`
  - `tests/content/caseStudies.test.ts`
  - `tests/content/caseStudySamples.test.ts`
  - `tests/content/caseStudyTypes.test.ts`
  - `tests/content/toolGuides.test.ts`

The existing user-owned `.gitignore` modification and untracked vault/idea/log/logo files were not edited or staged.

## Behavior fixed

- A matching `warning` metric now remains an explicit localized amber Warning/경고; warning mismatches are explicitly red “Warning — does not match”/“경고 — 불일치”. Green is limited to matching `pass` metrics. Manual-review values and page/sheet units are localized without changing the shared records.
- Numeric evidence uses the raw delta for tolerance comparison and rounds only the returned display delta.
- Each case study visibly renders localized input conditions sourced from its `inputs` record.
- Case-study and editorial Articles visibly render the same organization, published date, and modified date used by JSON-LD. Editorial records now include `publishedAt`.
- The two editorial guides were narrowed to their actual source scope. ISO 536 supports only grammage definition/measurement; Adobe supports only bleed concepts. Provider-specific lb, caliper, spine, DPI, grommet, finishing, and material decisions are visibly separated instead of attributed to those sources.
- Mobile navigation now has localized accessible names, short-viewport scrolling, initial focus, Escape close, a Tab/Shift+Tab focus trap, and focus restoration. The four groups and 17 unique links remain unchanged.
- The unsupported `impose -> saddle-stitch-booklet` evidence mapping was removed from code, tests, and the plan. `booklet` remains mapped.
- Spine copy now states that the UI accepts GSM and infers caliper with a fixed bulk heuristic; it directs users to stock/provider confirmation and no longer describes a caliper input.
- `CaseStudyCard` accepts only the case-study summary discriminant; the route test uses `SITE_URL`; resolution literals/tolerances and all five generated sample hashes are independently asserted.
- The booklet generator emits pretty JSON with a trailing newline.
- Playwright now saves the actual browser conversion download and uploads that exact file to PDF preflight before checking 297 × 210 mm landscape geometry, 102.6 DPI, RGB, and absent TrimBox/BleedBox.

## RED / GREEN evidence

Initial focused RED:

- `npm.cmd test -- tests/content/caseStudyTypes.test.ts tests/components/CaseStudyView.test.tsx tests/components/MobileNav.test.tsx tests/content/toolGuides.test.ts tests/content/caseStudies.test.ts tests/content/caseStudySamples.test.ts`
- Result: 6 files failed; 15 failed / 22 passed. Failures reproduced the raw-tolerance, warning semantics/localization, input rendering, Article parity, mobile dialog, impose mapping, spine wording, and compact sample JSON gaps.

Additional warning-mismatch RED:

- `npm.cmd test -- tests/components/CaseStudyView.test.tsx`
- Result: 1 failed / 12 passed because a mismatching warning was not yet visually distinct.

Focused GREEN:

- The six-file focused suite: 6 files passed; 41 tests passed.
- Warning/sample follow-up: 2 files passed; 17 tests passed.

## Final verification

- `npm.cmd run samples:generate`: PASS.
- Determinism: repeated generation produced identical hashes for all five samples:
  - booklet JSON: `749438d59f5cbdc69597529c3dafa154a1df45201d3971bb0339da5e1d567709`
  - 3 mm bleed PDF: `2de1729487018b1bbe7dc29ec80d82df0bf55f497c16d67398a5aa7b646f35a5`
  - no-bleed PDF: `8bf4609aabd62f002ececcf78e0d8b640bffec1b64dd1d6df9aa775b3957eb88`
  - RGB A4 PDF: `ba4759593728232426cdfe99521dfa130c62f74a0b51bd26b81d368a964fc717`
  - RGB PNG: `bf1a40ee551fba3b1bfe2208200ef8879dd078a4266d34fb719f81fc6477f7f8`
- Scoped Prettier check over every changed code/test file: PASS.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd test`: PASS, 45 files / 215 tests.
- `npm.cmd run build`: PASS, 104 static pages generated.
- `npm.cmd run e2e`: PASS, 40/40 Chromium tests.
- `git diff --check`: PASS.

## Residual concerns

- Repository-wide `npm.cmd run format:check` is not green: it reports 162 pre-existing/mixed-EOL files, including preserved user files. This wave did not mass-format them; all changed code/test files are scoped-clean.
- Full Vitest still prints existing jsdom navigation and pdf.js standard-font-data warnings while all tests pass.
- Build/E2E still print the existing missing `metadataBase` warning and Playwright web-server `NO_COLOR`/`FORCE_COLOR` warning while completing successfully.
- Deployment, production responsive smoke, Search Console recrawl/manual-action checks, and AdSense reconsideration remain external release gates and were not performed locally.

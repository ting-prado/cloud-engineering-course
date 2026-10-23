# Cloud Engineering Academy

A static self-study school for a working developer transitioning to Azure infrastructure engineering. The approved redesign is [the curriculum audit](docs/CURRICULUM_AUDIT.md); implementation is deliberately staged.

**Current release: R2, Stage 1.** The complete revised 24-week syllabus is present. **Only Week 1’s three sessions are ready for learning. Weeks 2–24 are planned**, with explicit outlines/status instead of relabeled legacy lessons or active placeholder quizzes. See [batch targets and readiness scope](docs/REDESIGN_STAGES.md).

The program runs October 24, 2026–April 9, 2027 in **Asia/Manila**. Classes: Saturday and Sunday 09:00–12:00; Wednesday 09:00–11:00. Dates are generated, study is flexible, and Week 1’s budgets are exactly **180/180/120 minutes** including reading, evidence, breaks and remediation.

## Run, build and verify

Requires Node.js 22.12+ or a supported newer release and npm. On PowerShell with script execution restrictions, use `npm.cmd`/`npx.cmd`.

```sh
npm ci
npm run dev
```

The dev script packages the Week 1 workload and starts Vite, normally at `http://127.0.0.1:5173/`.

```sh
npm test             # academic, migration, grading, packaging and real API/proxy tests
npm run build       # package workload, type-check and emit dist/
npm run preview     # serve the production build
```

Stop the dev server with Ctrl+C before `npm ci` on Windows: a running Vite/Rollup process can lock its native module. Do not open the source index.html directly; use HTTP hosting.

## What Week 1 includes

- An ungraded six-question prior-knowledge diagnostic, saved separately from grades. Objective feedback and reflection models appear after submission; no pass mark or automatic short-text grade.
- Detailed process/OS/resource/persistence teaching through a supplied existing React/Node reference workload. The student operates it rather than writing application features; they can also annotate their own known app.
- A diagram and worked request/failure cases; bounded inspected MDN/Node/React readings with a 25-minute allocation. All required explanations and commands are on the lesson pages.
- A guided request/state experiment, independent configuration variation, deliberately broken upstream incident, validation/cleanup and an honestly labeled evidence-only fallback.
- An eight-question graded review with plausible distractors, mixed answer positions, exact-set multi-select and a topic-specific manually self-scored short response. Models appear after submission.
- A fresh Wednesday evidence case, specific execution/documentation rubrics, saved submissions and post-submission feedback. The platform does not verify local execution or pretend to AI-grade arbitrary text.
- Explicit study completion, notes/drafts/attempts, current grades, JSON backups, historic archives and refresh-safe navigation.

## Standalone React/Node lab

Use the lesson’s **Download ready-to-run workload** link. The build emits `dist/labs/week-01-workload.zip`. Extract it into a disposable directory and run:

```sh
node run.mjs guided
```

Open `http://127.0.0.1:4170`. The package includes prebuilt React assets, separate Node web/API services, configs, launcher and licenses. **No npm install, Azure, Docker, Python, API key or paid service is needed to run it.** `variation` and `incident` modes are used by the lab. Ctrl+C stops the child services; verify stopped endpoints and keep only dummy data.

The sample is intentionally not a production template: plain loopback HTTP, no authentication/database/cloud deployment, an in-memory counter and one local dummy data file. A process-restart persistence test is not a backup/disaster-recovery claim. Maintainers build assets with development-only React/React DOM/esbuild dependencies; the academy itself remains a lightweight TypeScript app.

## Progress versions and safe migration

**Do not clear browser site data before migrating.** Student data lives per browser/device/origin; no backend exists. A hosted release cannot read another device’s or URL’s localStorage.

- Current key: `cloud-academy-v2`; schema 2; curriculum `azure-2026-r2`; Week 1 assessment `week-01-r2.1`.
- On first R2 load, an existing `cloud-academy-v1` record is validated using the **frozen original curriculum**, copied byte-for-byte to a unique `cloud-academy-archive-before-r2-*` key and verified before the R2 record is created. The original key is never deleted or rewritten.
- Legacy grades, notes, attempts, drafts, submissions and completions stay archived. They are not reinterpreted using new week titles or question indices. Current R2 starts fresh; appearance/calendar preferences may carry forward.
- Migration/storage failure blocks writes and leaves original records intact. Settings offers an original browser-record download when readable; resolve storage access/capacity before retrying. Do not erase the only copy.
- Settings can display/download original historical records. A version-2 export contains current work **and** archives. A version-1 import becomes history; a compatible version-2 import restores active work. Confirmation occurs before replacement, current work is snapshotted and existing archives are retained.
- Invalid files leave active data unchanged. Objective totals are recalculated against matching current assessment versions. Backups contain personal notes/links and are not encrypted. Current import limit is 25 MB; legacy records retain their original 10 MB validator limit.

Future batches must keep authored assessment mappings stable or explicitly archive/migrate them. Never reorder old answer indices and reattribute historical scores. The migration contract and tests are in `src/lib/student-store.ts`; original validation lives in `legacy-store.ts` against `curriculum/legacy.ts`.

## Grading and readiness

The full-program category weights remain quizzes/written exams 15%, labs 35%, documentation 20%, foundation practical 10%, final practical/capstone 20%—74 planned items. Only the Week 1 quiz, lab and documentation currently accept scores. The diagnostic never contributes to grade/progress. The best finalized practice quiz counts; short responses remain pending until manual self-assessment. Blank means ungraded, while zero is an assessed zero.

The current graded-work average excludes missing work. Earned final points use full-program weights and cannot represent a completed program at Stage 1. The audit’s independent mastery gates, revised midterm/final banks and later practicals are **planned**, so this release does not award full graduation. A study checkmark is not evidence of independent competence.

## GitHub Pages deployment

1. Push the source and lockfile to `main` (or update the workflow branch filter).
2. Repository **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Run **Deploy Academy to GitHub Pages** or push to main.

The existing workflow runs `npm ci`, tests and the production build, uploads `dist/` and deploys with the Pages environment. It needs no Azure credentials/secrets. Relative assets and hash routes support repository subpaths and refreshed URLs such as `https://OWNER.github.io/REPO/#/lesson/1/lab`. The workload ZIP is generated during CI and included in the artifact. No student data or local lab server is hosted by Pages.

## Browser verification

With the dev server on port 5173 and an installed Edge browser:

```sh
npm run build
npx playwright test
```

For another installed Playwright browser, set `PLAYWRIGHT_CHANNEL=chromium` and install that browser if necessary (`npx playwright install chromium`). In PowerShell: `$env:PLAYWRIGHT_CHANNEL='chromium'`.

Checks cover the full Week 1 workflow; diagnostic exclusion; hidden/revealed feedback; manual grading; notes/drafts/completion refresh; version-1 migration/archive/import/export; failed archival storage; planned routes/disabled assessments; mobile/large-screen layout and dark theme; built subdirectory navigation/download; and the downloaded React/Node workload’s real separate processes, counter restart, persistent file and connection failure/repair. They do not certify a human student’s independent performance. Screenshots and temporary results are ignored.

## Authoring architecture

```text
src/curriculum/baseline.ts    # Approved metadata for all 24 weeks and module names
src/curriculum/week-01.ts     # Ready R2 Week 1 text, plans, diagnostic, quiz and feedback
src/curriculum/index.ts       # Active readiness and assessment selection
src/curriculum/legacy.ts      # Frozen original curriculum/assessment mapping
src/curriculum/{foundations,azure,engineering,walkthroughs,lab-guides}.ts
                             # Preserved original content, not current planned lessons
src/lib/student-store.ts      # Current schema, migration, archives and scoring
src/lib/legacy-store.ts       # Original schema and frozen validation/scoring
src/lib/academic.ts           # Actual Manila schedule
src/lib/grades.ts             # Current weighted grade calculations
src/pages/reader.ts           # Ready content, diagnostic/quiz and planned outlines
labs/week-01/                # Runnable reference workload source
scripts/package-labs.mjs      # Build React assets and standalone ZIP
tests/                      # Academic, migration, workload and browser verification
```

See [authoring guidance](docs/AUTHORING.md), [the audit](docs/CURRICULUM_AUDIT.md), [staged delivery](docs/REDESIGN_STAGES.md) and [resource review notes](docs/RESOURCES.md). Future content must pass readiness review before changing its status. Templates, grading/progress and course content remain separate. Existing text scale/theme design is retained; no general UI redesign is part of Stage 1.

# Cloud Engineering Academy

A self-hosted personal school for a developer learning Microsoft Azure cloud engineering. The application is a static TypeScript/Vite site: no backend, accounts, API keys or paid services are needed to use the school.

The 24-week program runs **October 24, 2026–April 9, 2027**, in **Asia/Manila**. Saturday lecture and Sunday laboratory run 09:00–12:00; Wednesday review/assessment runs 09:00–11:00. Dates are generated from the actual start date. Attendance is flexible and lessons never lock.

## Run locally

Requires Node.js 22.12+ or a supported newer release and npm.

```sh
npm ci
npm run dev
```

Open the URL Vite prints, normally `http://127.0.0.1:5173`. On Windows PowerShell with script execution restrictions, use `npm.cmd` and `npx.cmd` instead of `npm` and `npx`.

```sh
npm test             # academic, grading, backup and content-contract checks
npm run build       # TypeScript check + production build into dist/
npm run preview     # inspect the built production application
```

Do not double-click the source `index.html`: use the development server or serve the production `dist/` folder over HTTP.

## What is implemented

- Responsive dashboard with Continue Learning, the current academic week, progress, grades, pending submissions, recent results and upcoming classes.
- Complete six-module syllabus, searchable by topic, and 72 separate lecture/lab/review pages. Every week has authored explanations, objectives, terminology, a misconception, summary, review questions and external references. Labs have five tasks, setup, validation, troubleshooting, submission requirements, rubrics and cleanup. Selected labs include fuller local/cloud command walkthroughs.
- Reader with table of contents, syntax-styled/copyable code, diagrams, tables, previous/next navigation, explicit completion and autosaved notes.
- Functional single-answer, multiple-answer, true/false and short-answer assessments. Weeks 12 and 24 use separate cumulative 19-question written examinations. Short responses receive revealed model answers and manual rubric scores, never simulated AI grading.
- Weekly labs/documentation submissions, manual grades, separate foundation/final practical marks and a weighted gradebook.
- Calendar with actual classes, Wednesday 11:00 assignment/lab targets and examination dates. All labels use Asia/Manila, independent of the computer’s time zone.
- Complete capstone brief, requirements, recommended architecture, milestones, deliverables, failure tests, rubric and optional extensions.
- Local persistence, light/dark themes and validated JSON export/import with preview and explicit replacement confirmation.
- GitHub Pages deployment workflow, relative build assets and refresh-safe hash routes.

All weeks contain authored material; there are no planned/empty lesson routes. The content is a guided self-study text rather than verbatim three-hour lecture transcripts: the eight-hour weekly allocation includes reading official resources, command experiments, lab work, retrieval and assessment. Some early Azure labs are design/read-only exercises; later lab pages explicitly distinguish local rehearsal from optional real Azure execution. A design-only submission must not be represented as observed cloud deployment evidence.

## Academic grading

| Category                                    | Weight | Items |
| ------------------------------------------- | -----: | ----: |
| Weekly quizzes and cumulative written exams |    15% |    24 |
| Laboratories                                |    35% |    24 |
| Assignments and documentation               |    20% |    24 |
| Semester 1 practical examination            |    10% |     1 |
| Final capstone and practical examination    |    20% |     1 |

There are **74 graded items**. Each item has equal weight within its category. A quiz’s best _finalized_ attempt counts. Objective answers require an exact match (no partial credit for multi-select); each short answer receives 0, 1 or 2 points, normalized to one question’s weight. An attempt is pending until every short answer is self-assessed.

The gradebook exposes two distinct measures:

1. **Current graded-work average:** earned weighted points divided by the weight represented by recorded assessments. Missing work is excluded.
2. **Earned toward final grade:** all weighted points earned so far out of 100. Missing work contributes no earned points yet.

A blank manual score is ungraded; **0 is a real assessed zero**. A low recorded score is highlighted for improvement. Program completion requires all 72 sessions marked complete, all 74 scores recorded and at least 75 final earned points. Marks are a personal self-assessment record, not an accredited qualification or independent evaluation.

## Data ownership and backups

The storage key is `cloud-academy-v1`. The data contract is in `src/lib/store.ts`. Progress, notes, submissions, quiz drafts/attempts, manual scores, theme and calendar month are saved in `localStorage`.

- Opening a lesson never marks it complete. Use the explicit completion control.
- Notes save while typing. Submissions save when **Record submission** or **Update submission** is pressed. Submission text/links are stored; files themselves are not uploaded.
- Data is per browser, device and origin. Clearing site data or changing the hosting origin can create an apparently empty record. Export before changing hosts.
- **Settings & backup → Export student data** downloads a versioned JSON file. It includes personal notes and links and is not encrypted.
- Import validates the entire supported schema, bounds manual grades, rejects unsafe keys and recalculates objective scores. It previews record counts before replacement. Invalid files leave the current record intact. Import replaces rather than merges.
- Storage failure is reported. If browser storage is unavailable/full, export immediately; changes may exist only in the current tab.

Keep periodic backups outside the browser. Local grades and imported self-scores are inherently user-controlled; this is a personal school, not a tamper-proof examination service.

## Deploy to GitHub Pages

1. Push the project, including `package-lock.json`, to the repository’s `main` branch.
2. In GitHub, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Run **Deploy Academy to GitHub Pages** or push to `main`.
4. The workflow installs with `npm ci`, runs the academic checks, type-checks/builds and uploads `dist/`, then deploys using GitHub’s Pages action. The deployment job reports the actual site URL.

If the default branch is different, update the workflow’s branch filter. Repository Actions/Pages must be enabled and permitted by the organization. The workflow uses GitHub’s normal Pages environment and permissions; no Azure credentials or repository secrets are needed. This repository is deployment-ready; publishing still requires a GitHub repository and a successful Actions run.

`vite.config.ts` sets `base: './'`. All application navigation is hash-based, for example:

```text
https://OWNER.github.io/REPOSITORY/#/lesson/14/lab
```

Only the static base document is requested from the host; the fragment selects the page in the browser. Direct navigation and refresh therefore need no custom 404 fallback. GitHub Pages serves static content only; it does not store student data.

## Browser checks

The browser suite uses Playwright and defaults to an installed Microsoft Edge channel. It does not install or launch a visible browser. With the dev server running on port 5173:

```sh
npm run build
npx playwright test
```

For an installed Chromium browser on another machine, set `PLAYWRIGHT_CHANNEL=chromium` and install the Playwright browser if needed (`npx playwright install chromium`). On PowerShell: `$env:PLAYWRIGHT_CHANNEL='chromium'`.

Browser checks cover the Week 1 learning/persistence/grade/export/import flow, all 72 session routes, navigation pages, filtering, invalid imports, responsive layout, theme persistence and the built application served from `/dist/` as a subdirectory. Screenshots are written under ignored `test-results/`. Academic unit tests run in CI; browser tests are optional because they require an available browser.

## Content and maintenance

```text
src/
  curriculum/
    types.ts           # authoring contracts
    foundations.ts     # Weeks 1–8
    azure.ts           # Weeks 9–16
    engineering.ts     # Weeks 17–24
    walkthroughs.ts    # worked cases and lab command examples
    lab-guides.ts      # detailed optional cloud/local implementations
    resources.ts       # shared official references and review status
    index.ts           # assembly, exam selection and grading rubrics
  lib/
    academic.ts        # Manila scheduling and session identity
    store.ts           # browser persistence, schema and quiz scoring
    grades.ts          # weighted academic calculations
  pages/               # dashboard, syllabus, calendar, reader, grades, resources, capstone, settings
  ui.ts                # shared visual helpers, code blocks, resources and rubrics
  main.ts              # application shell, hash routes and event handlers
  styles.css           # themes, layouts, typography and responsive rules
tests/
  academy.test.ts
  browser/learning.spec.ts
```

See [the authoring guide](docs/AUTHORING.md) for content fields and [resource review notes](docs/RESOURCES.md) for verified references and maintenance. Content is structured TypeScript and does not require editing UI components. Add paragraphs using `\n\n`; code and diagram arrays are separate fields. User text is HTML-escaped before rendering. The application does not execute lesson code.

The only runtime external requests introduced by the interface are optional Google Fonts styles/fonts; system fonts provide a fallback. Documentation/video links open externally. No video autoplays or external assessment API is used. To remove font network requests entirely, remove the first `@import` in `src/styles.css` or self-host appropriately licensed fonts.

Review Azure service behavior, CLI flags, resource API versions, GitHub OIDC claims and pricing periodically. The lesson examples deliberately avoid promising that a particular cloud configuration is free. No live Azure infrastructure was provisioned as part of building or testing this website.

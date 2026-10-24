# Authoring and extending the academy

## R2 staged authoring — current source of truth

The approved sequence is `CURRICULUM_AUDIT.md` Section 5, implemented as metadata in `src/curriculum/baseline.ts`. Only Week 1 is ready, in `week-01.ts`. Weeks 2–24 are planned outlines and expose no active quiz, completion or grade entry. Do not mark a week ready until its instructional text, runnable/tested or explicitly simulated fixture, independent variation, fault, costs/cleanup and assessment are complete. Batch targets are in `REDESIGN_STAGES.md`.

Before promoting any future week to `ready`, follow [the mandatory lesson acceptance gate](LESSON_ACCEPTANCE.md) and commit a completed [acceptance record](acceptance/TEMPLATE.md) for that week. All three sessions require technical review, executed practical/fault solutions, objective-to-assessment mapping, inspected resources and verified cost/safety/cleanup instructions. Actual cloud labs require recorded cleanup execution and post-deletion inventory. Software tests support these reviews; field presence and passing builds do not establish educational readiness. Failed or pending required checks keep the week `planned`. The record must identify the actual reviewer and evidence, without inventing independent review or execution.

The older semester content files, walkthroughs and lab guides are frozen original-curriculum material used by `legacy.ts`/`legacy-store.ts`. Do not edit those banks to implement R2; doing so changes validation of historical question indices. Build new versioned content modules and assemble them through `index.ts`.

Progress schema 2 (`azure-2026-r2`) keeps schema-1 records as exact raw archives before writing current progress. The diagnostic has its own assessment ID and is never graded. Each current attempt records an assessment version. Week 1 uses `week-01-r2.1`; keep it stable in subsequent batches. Before adding more banks, extend the assessment-version lookup compatibly; do not globally bump a version and reinterpret old answers. A substantive question/order change needs a documented archive/migration path and regression tests.

Current readiness includes exact 180/180/120-minute session plans, on-page explanations, selected inspected resource sections, shared evidence rather than extra essays, and honest manual/unsupported-execution labeling. The full mastery-gate record and independent graduation policy are future work; no Stage 1 UI should imply they are implemented.

The remainder of this document describes original authoring contracts where still applicable; follow the R2 rules above when they differ.

The curriculum is data, not component markup. Start with the `Week`, `Lab`, `Section`, `Question` and `Resource` interfaces in `src/curriculum/types.ts`.

## A weekly teaching unit

Follow [the instructional writing standard](INSTRUCTIONAL_WRITING.md) for every session, quiz, lab instruction and feedback message. Teach new concepts using what/why/how/example/remember; explain terms at first use. Give guided labs numbered actions, command context, expected results and required evidence. Keep independent solutions withheld. `Section` supports structured concept explanations, command guides, steps and expandable comprehension checks; Week 1's teaching text and glossary are in `src/curriculum/week-01-teaching.ts`. The acceptance record must include a writing/terminology walkthrough, not just software checks.

Each week has one source record, assembled into three distinct pages:

- Saturday: objectives, authored sections, terminology, misconception, summary, retrieval questions and resources.
- Sunday: laboratory objective/tools/setup, five specific tasks, command examples, optional detailed walkthroughs, validation, troubleshooting, cleanup, rubrics and submissions.
- Wednesday: a topic-specific review plan, retrieval, feedback prompts, next-week preparation, functional assessment and resources.

Edit the appropriate semester content file. Keep `number` stable: session IDs such as `14-lab` are persistent data keys. Changing IDs after deployment requires a deliberate backup migration. The present calendar, categories and completion rules are designed for exactly 24 weeks; changing the program length also requires changing `src/lib/academic.ts`, `grades.ts` and tests.

```ts
{
  title: 'Explain the mechanism',
  body: 'Teach why the mechanism exists.\n\nWork through a concrete example and explain a limitation.',
  code: 'a reviewed example command',
  language: 'bash',
  diagram: ['Client', 'A named boundary', 'Durable service']
}
```

Prefer mechanisms and worked cases over lists of names. Define new terms before relying on them. Explain what an observation proves and what it does not. Identify required tools and the environment where each command runs. Do not mix Bash and PowerShell syntax without labels. For destructive examples, use reviewed disposable targets and an explicit inventory/cleanup procedure.

Use `walkthroughs.ts` for additional worked lecture cases and `lab-guides.ts` for longer lab execution sections. `labCommands` provides concise command examples and accompanying guidance. All are assembled in `curriculum/index.ts`.

## Questions

Use the helpers in `helpers.ts`: `single`, `multiple`, `bool` and `short`. Objective answer indices are zero-based. Multi-select requires an exact set with no duplicate indices. Boolean options are True at index 0 and False at index 1.

```ts
single(
  'What does a resolver return?',
  ['A DNS record answer', 'A VM disk'],
  0,
  'DNS answers help a client discover an endpoint; the later application request is separate.',
);
short('Explain the observed failure.', 'A model with mechanism, evidence and limitations.');
```

Before submission, answers/explanations are not rendered. After submission they are displayed with the student’s answer. Short answers remain unfinalized until manually scored 0–2. The best finalized attempt contributes to the gradebook. Weeks 12 and 24 use `questionsFor` to assemble separate cumulative exams from the respective semester. If you reorganize question banks, update exam selection and consider whether old attempts need migration: their answer indices refer to the authored question version.

## Resources

Keep shared resources in `resources.ts`; lessons reference them. Include an actual title, provider, type, useful description and HTTPS URL. Add a duration only when verified. `verified: true` means the source was reviewed during authoring, not a permanent availability promise. Otherwise the UI explicitly labels availability as not individually verified. Record review dates and changes in `docs/RESOURCES.md`.

Avoid made-up YouTube IDs. A linked video is acceptable without an embed. External links use `noopener noreferrer`. Do not turn user-imported text into executable HTML or unvalidated resource URLs.

## Rubrics and grades

The shared lab, documentation and practical rubrics are in `curriculum/index.ts`. Points should sum to 100. Score individual criteria using evidence, add the points and enter the total. Rubric self-assessment is deliberately human-controlled. Gradebook category weights live in `lib/grades.ts`; the independent current/earned calculations are covered by unit tests.

## Verify a change

Run `npm test` and `npm run build`. If routing, persistence, reader interaction or responsive presentation changes, run the Playwright suite with the dev server active. Inspect a desktop and mobile page and both themes when making visual changes. Revisit source links when modifying claims tied to changing cloud behavior.

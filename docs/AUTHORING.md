# Authoring and extending the academy

The curriculum is data, not component markup. Start with the `Week`, `Lab`, `Section`, `Question` and `Resource` interfaces in `src/curriculum/types.ts`.

## A weekly teaching unit

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

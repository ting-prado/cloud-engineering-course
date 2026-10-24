# Instructional writing standard

This is mandatory for all new and revised lectures, labs, assessments, feedback and learner instructions. It applies to Weeks 2–24 as they are authored. The student knows web development, but infrastructure knowledge and familiarity with formal English must not be assumed.

## Teach the skill in clear English

Use everyday words and short sentences. Address the student directly. Explain one new idea at a time. Start with a situation they recognize, such as a React page opening while its API fails. Explain why the idea helps before adding details. Keep precise technical vocabulary, but define it at first use in the teaching flow. Explain acronyms and show a concrete example. A glossary supplements this first explanation; it does not excuse using unexplained terms in the text.

Prefer “write down what happened” to “capture runtime observations,” “try the original request again” to an unexplained “validate end-to-end,” and “possible cause you can test” before introducing “hypothesis.” Do not grade English formality. Grade the accuracy, evidence and completeness of engineering reasoning.

Do not stack new terms in one sentence. Avoid jargon that adds no meaning, long noun phrases, vague pronouns and commands hidden in paragraphs. Use lists for actions and comparisons. Keep paragraphs connected so the student understands how each idea follows the previous one.

## Required concept sequence

For each new core concept, use:

1. **What is it?** Give a plain-English definition.
2. **Why do we need it?** Name the problem it solves.
3. **How does it work?** Walk through the mechanism in small steps.
4. **Real example.** Use a website, API, deployment or known app.
5. **What should I remember?** State the essential idea and relevant limits.

Technical depth follows this foundation: teach the mechanism, failure conditions, diagnostic evidence and trade-offs. A comparison can help, but explain where it stops being accurate. Do not replace mechanisms with vague analogies. Use brief “Pause and think” checks between ideas. Let the student consider a question before opening its explanation. These checks are practice, separate from graded questions and independent incidents.

In structured content, `Section.concept` supports this sequence. `checks` renders native expandable explanations. Do not turn arbitrary lesson strings into HTML.

## Guided laboratory instructions

For each part, make these visible:

- **Goal:** what the student must accomplish.
- **Why:** what the activity demonstrates.
- **What to do:** numbered actions in order.
- **What to expect:** observable outcomes, with realistic variation.
- **What to submit:** the evidence and explanation required.

Every command needs its terminal/application, folder, exact syntax, purpose, important option meanings, expected output and first failure checks. Label OS-specific commands. Explain placeholders before asking students to replace them. Tell students which terminal must remain running and which terminal takes another command. A command without flags can say so rather than inventing options.

Use `Section.steps`, `purpose`, `expected`, `evidence` and `commands` to keep those parts separate from UI components. Label an example path as an example. Explain what to verify after cleanup; a deletion or stop request alone is not proof of success. Keep security and cost instructions as understandable as the main steps.

## Preserve independent practice

Independent work still needs a clear goal, constraints, tools, observations and success criteria. It does **not** need the completed configuration or the exact repair steps. Explain how to start a fixture without giving the solution. Troubleshooting prompts should distinguish setup problems from the deliberate fault. Withhold the actual fix until a student records an attempt. Author validation must include executing the fault and a valid constrained solution.

Do not make distractors absurd, drop required concepts, lower proficiency targets or relax rubrics to improve readability. Keep multiple-answer exact-match rules and human/self-assessment honest. Explain a scoring rubric in plain language. An ungraded prior-knowledge diagnostic may ask about later topics; label that exception clearly and allow an honest unknown without penalty.

## Terminology support

Provide a glossary containing each important term, a simple definition and an example. Make it accessible from every relevant session, including lab and review. Native expandable content and a contents link are preferable to repeated popups. Explain critical terms in the lesson before asking students to use them; let students look them up later without leaving the page.

## Review before readiness

Read all three sessions as a student would, not just as a content author. Trace each instruction: do they know where to act, what to type, why, what they should see and what evidence to keep? Track first uses of technical words. Review objectives against teaching, guided practice, independent work and assessment. Check that the extra support replaces dense wording rather than adding hours beyond 180/180/120 minutes.

Record this review in the [mandatory lesson acceptance record](acceptance/TEMPLATE.md). Passing field checks, sentence-length metrics or word-count thresholds cannot establish teaching clarity. Actual student feedback remains valuable after release; do not claim an author walkthrough is a learner pilot.

For wording-only assessment changes, review every question and option for one-to-one meaning, type, order, answer indices and rubric standards. Keep IDs and versions stable only when those meanings are unchanged. Save a pre-change regression fixture and verify existing records and scores. If meaning changes, use the existing version/archive migration process before release. Never change old answers to fit new wording.

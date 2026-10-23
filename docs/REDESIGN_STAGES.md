# Approved R2 implementation stages

The approved baseline is [CURRICULUM_AUDIT.md](CURRICULUM_AUDIT.md), Section 5. This document records implementation scope; it does not schedule automatic/background agent jobs.

| Batch | Coverage                                                                  | Authoring/verification target before first class | Status                                                            |
| ----- | ------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| 1     | Week 1 plus complete revised syllabus and safe progress versioning        | October 23, 2026, before October 24 class        | Implemented; see verification report below                        |
| 2     | Weeks 2–4: DNS/TLS, addressing/routes, filtering/diagnosis                | October 30, 2026                                 | Planned; no revised instructional pages/assessments claimed ready |
| 3     | Weeks 5–8: Linux, cloud choices, safe Azure context                       | November 20, 2026                                | Planned                                                           |
| 4     | Weeks 9–12: compute/network practice and held-out midterm                 | December 18, 2026                                | Planned                                                           |
| 5     | Weeks 13–16: storage, identity, telemetry and recovery                    | January 15, 2027                                 | Planned                                                           |
| 6     | Weeks 17–20: Terraform, security and secure delivery                      | February 12, 2027                                | Planned                                                           |
| 7     | Weeks 21–24: container hosting, bounded Kubernetes, integration and final | March 12, 2027                                   | Planned                                                           |

Dates are proposed delivery targets, not a claim that future work has already run. Each batch requires authored content, tested fixtures/validation, suitable assessments, cost/cleanup procedures, and honest proficiency limits. No additional hours should be assigned beyond the existing 180/180/120-minute weekly blocks.

Only Week 1 has `status: ready` in R2. The other 23 weeks preserve approved titles, objectives, prerequisites, session outlines, intended outcomes and costs. Their lesson routes explicitly show planned status, contain no active quiz, and cannot accept completion or grades. Original lessons remain frozen in source for historical validation; they are not relabeled as revised content.

## Data and historical scores

- R2 curriculum ID: `azure-2026-r2`. Current student schema: 2. Week 1 assessment version: `week-01-r2.1`.
- The original `cloud-academy-v1` key is never deleted or rewritten. On the first successful R2 load, its exact raw JSON is validated using frozen original questions, copied to a uniquely named `cloud-academy-archive-before-r2-*` key and read back for verification **before** the new `cloud-academy-v2` record is written.
- The same raw record is included in R2's archive collection. Legacy completion, notes, drafts, grades, attempts and submissions do not become current R2 entries. Theme/calendar preferences may carry forward.
- If validation or archival storage fails, loading fails closed: no fresh active progress is written over the original and further saves are blocked. Do not clear site data to resolve that warning; preserve/export the original record first.
- Settings shows historical grades/attempts under their original curriculum and offers an exact original JSON download. A full version-2 export includes archives. A version-1 import is previewed as history; version-2 imports must match curriculum and assessment versions. Confirmed imports snapshot current work and retain existing archives.
- Backups are per browser origin. A deployment cannot read data from a different URL/device; import/export bridges those origins. This implementation does not claim to have accessed or backed up another browser remotely.
- Future authoring must keep ready assessment versions stable. Before changing question order/meaning, add explicit compatible version mappings or archive the affected assessment; never regrade old index-based answers against changed questions. Migration of mastery-gate records and the full independent graduation gate remain future work. Stage 1 does not award full-program completion.

## Week 1 readiness scope

Saturday October 24: ungraded diagnostic, detailed React/Node infrastructure lecture, worked examples, selected verified reading and readiness check. Sunday October 25: supplied runnable workload, guided state/request experiment, independent port/configuration variation, deliberately broken incident, evidence/cleanup and post-submission feedback. Wednesday October 28: retrieval, eight-question graded check, topic-specific manual short-answer rubric, fresh evidence case, documentation feedback and remediation. Exact budgets are 180/180/120 minutes; no new app development or cloud deployment is assigned.

The reference workload is supplied because the academy repository contained no existing React/Node workload. It is a ready-to-run app for the student to operate, not an application the student must write. Students may also annotate their own known app. The controlled fixture has separate Node web/API processes, a prebuilt browser React client, a volatile counter and persistent dummy file. All listeners are loopback-only. Production authentication, TLS, a real database, cloud networking, backup and disaster recovery are deliberately not implemented or claimed by this toy workload.

Ungraded diagnostic answers/reflections are stored separately from the graded quiz. Short text and practical reports are honestly self-assessed; the application does not use AI grading or verify local execution. File/command evidence can be supplied in the report. The supplied-evidence fallback supports reasoning only, with execution explicitly pending.

## Stage 1 verification — October 23, 2026

- `npm test`: 13 passing academic, assessment, migration and real HTTP/workload checks. Includes unchanged legacy bytes, archive-before-activation ordering, quota failure, invalid imports, separate diagnostic records, pending manual scores, and zero versus missing grades.
- `npm run build`: TypeScript check and production Vite build pass; the downloadable prebuilt React/Node ZIP is generated and included in `dist/labs`.
- `npx playwright test`: 8 passing Edge browser scenarios covering all three Week 1 sessions, refresh persistence, hidden/revealed answers and incident feedback, grading, import/export/archive recovery, all 72 ready/planned routes, 390-pixel and large-desktop layouts, dark theme, and built-site subdirectory navigation.
- The browser suite downloads and extracts the actual published ZIP, operates its React controls against separate web/API child processes, verifies volatile reset and file persistence, repairs the deliberate fault while preserving assigned listeners, and tests independent-mode configuration.

**All three Week 1 sessions are ready for use:** October 24 lecture (180 minutes), October 25 lab (180 minutes), and October 28 review/assessment (120 minutes), Asia/Manila. Local execution requires an allowed Node 22+ environment; the explicitly labeled fallback cannot establish execution proficiency. No Azure resources or paid services were used in verification. These are software/content readiness checks, not a human learner pilot or a deployed GitHub Pages release.

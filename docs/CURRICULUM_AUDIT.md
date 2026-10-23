# Cloud Engineering Academy — curriculum audit and proposed redesign

**Audit date:** October 23, 2026. **Program:** October 24, 2026–April 9, 2027; Asia/Manila. **Capacity:** 24 × 8 = 192 scheduled hours. **Decision status:** recommendations only; course content, syllabus, assessments and progression rules have not been changed.

This review applies five perspectives: Azure operations, platform automation, technical instruction, prerequisite/assessment design and junior hiring expectations. It is one evidence-based review using those perspectives, not a claim that five independent human reviewers or external assessors evaluated the student. No student performance was observed, and no Azure deployments were executed during this audit.

## 1. Executive verdict

**The existing course is a useful introductory reading and practice scaffold, but it is not yet a defensible 192-hour route to independently demonstrated junior Azure infrastructure competence.** Its strongest material explains responsibility boundaries: process memory versus persistence, connectivity versus authorization, replication versus backup, and provider management versus customer operations. Preserve these explanations and the explicit cost/cleanup cautions.

The weakness is the instructional contract. Many weeks contain an accurate short overview and a design task, while graduation implies practical readiness. Independent configuration and diagnosis are not consistently required. A student can finish the current academic record without proving a working Azure network, scoped data access, safe Terraform lifecycle or an actual Azure telemetry investigation. The full-time developer profile makes repeated elementary application/container tasks a poor use of scarce hours.

**Recommended direction:** use the proposed sequence as a strong starting point, with narrower weekly acceptance criteria, CLI/security introduced before use, two Terraform weeks, earlier operations, repeated independent variations, a separate practical mastery gate and capstone increments beginning in Week 8. Keep advanced networking, regional disaster recovery and AKS at awareness/guided levels. Do not expand into multiple clouds or rebuild an application.

### Week 1 readiness decision

**Not fully ready for the requested developer-to-infrastructure program on October 24, 2026.** The existing lecture and loopback-only lab are safe and usable as an introductory session. There is no discovered technical reason to cancel that introductory exercise. However, it is not yet the diagnostic, developer-specific first week required by this brief.

Before treating Week 1 as accepted, make these small, bounded corrections after approval:

1. Add a 20-minute ungraded diagnostic distinguishing existing application experience from network/Linux/identity knowledge. Use it to allocate practice, not to skip all foundations.
2. Map an existing React/Node application to static assets, the Node process, listener, environment, database and persistent uploads. Keep the Python server as a short control experiment; do not make Python installation the main achievement.
3. Add one independent variation and a withheld fault, with required evidence and a concise answer rubric. For example, give a port/process mismatch without the correction, require an investigation, then reveal feedback after submission.
4. Replace the uniform 80-minute reading instruction with the explicit 180/180/120-minute plan in Section 5. Select a short reading extract; do not assign the entire Linux Foundation course.

These are first-class blockers for the revised Week 1, not a requirement to rewrite 24 weeks overnight. The rest of the remediation can be completed before the relevant module. No correction has been silently applied by this audit.

### Evidence inventory and limits

Inspected the assembled `weeks` objects, not just week titles: all lecture bodies, worked additions, command examples, diagram arrays, lab tasks/guides, assignments, question options/keys/explanations, review prompts and shared rendered instructional text. Also inspected calendar/progression calculations, grade formulas, self-assessment behavior, rubrics and the capstone brief. Existing tests were read as evidence of what they check; passing software tests does not validate learning efficacy.

| Evidence                          | Location                                                                                                                | Educational significance                                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Weeks 1–8                         | [foundations.ts](../src/curriculum/foundations.ts)                                                                      | Infrastructure, networking, Linux and cloud content                                                  |
| Weeks 9–16                        | [azure.ts](../src/curriculum/azure.ts)                                                                                  | Organization, compute choices, foundations exam, identity/network/VM/storage material                |
| Weeks 17–24                       | [engineering.ts](../src/curriculum/engineering.ts)                                                                      | Automation, IaC, containers, delivery, security, operations and final project                        |
| Assembled content and rubrics     | [index.ts](../src/curriculum/index.ts)                                                                                  | Merges additions; selects exams; supplies generic grading criteria                                   |
| Worked cases and command guidance | [walkthroughs.ts](../src/curriculum/walkthroughs.ts)                                                                    | Material that would be missed by reviewing the three main files alone                                |
| Detailed lab extensions           | [lab-guides.ts](../src/curriculum/lab-guides.ts)                                                                        | Optional VNet, VM, storage, Terraform and local Kubernetes execution                                 |
| Shared instructional behavior     | [reader.ts](../src/pages/reader.ts)                                                                                     | Timing, broad prerequisites, review scaffolding, submissions and model-answer self-scoring           |
| Program dates/modules             | [academic.ts](../src/lib/academic.ts), [syllabus.ts](../src/pages/syllabus.ts), [calendar.ts](../src/pages/calendar.ts) | 72 sessions; three per week; real Manila dates                                                       |
| Assessment/progress               | [store.ts](../src/lib/store.ts), [grades.ts](../src/lib/grades.ts), [gradebook page](../src/pages/grades.ts)            | Objective scoring, best attempts, manual grades, graduation condition                                |
| Capstone                          | [capstone.ts](../src/pages/capstone.ts), Weeks 23–24                                                                    | Requirements and timetable, separate from ordinary week metadata                                     |
| Resources and claims              | [resources.ts](../src/curriculum/resources.ts), [resource notes](RESOURCES.md), [README](../README.md)                  | 29 unique linked references; mixed earlier review standards                                          |
| Content checks                    | [academy.test.ts](../tests/academy.test.ts)                                                                             | Presence, minimum prose length, lab fields, scoring/date contracts; not independent skill validation |

External checks used current retrievable official pages. Some pages returned tool failures; these are explicitly identified in Section 9. Source availability is not the same as executing a tutorial, validating a particular subscription/SKU or watching an entire video. Recommendations are educational judgments, not claims that Microsoft prescribes this exact 24-week schedule.

## 2. Critical weaknesses and technical findings

### 2.1 Depth and time are not aligned

The assembled lecture bodies contain **9,108 whitespace-delimited prose words total**, **300–569 per week**, excluding code, glossary, summaries, lab prose and shared scaffolding. These counts were measured from `weeks[*].sections[*].body`, including additions from `walkthroughs.ts`. Word count is not a quality score: several concise explanations are good. Nevertheless, these texts do not support the uniform **80 minutes of careful reading** promised in `reader.ts` without a much more explicit worked-practice plan. Some Saturday pages are examination/project instructions, not teaching texts.

Resources are often entire documentation hubs or courses. The Linux Foundation landing page describes **60 hours of course material**; repeatedly linking it does not specify a feasible 25–35-minute reading assignment. Select exact sections and stop conditions. Supplementary courses must not become hidden homework. [Linux Foundation LFS101][LF]

### 2.2 The sequence postpones necessary practice

- Week 2 spends a full block on virtualization; Weeks 5–7 spread modest Linux tasks across three weeks. For this developer, consolidate these while retaining mechanism teaching and actual service practice.
- Azure CLI commands appear in Week 9, while installation/sign-in/context instruction is explicitly deferred to Week 17. Introduce the tool before its first required use. [CLI documentation][CLI]
- Detailed identity is Week 13, networking Week 14, Terraform only Week 18, security Week 21 and monitoring Week 22. Those subjects then have too few repetitions before the final build.
- Existing networking covers important terms but little executed filtering/routing. Peering, effective rules, diagnostic tools, service endpoints and VPN boundaries need an explicit depth decision rather than omission or product-name exposure.
- The proposed Week 8 is itself overloaded if it means mastering directory administration, RBAC, Policy, CLI and costs in one week. Restrict it to safe environment setup and a narrow role exercise; consolidate governance later.

### 2.3 Labs frequently stop before the claimed competence

Weeks 9–13 are mainly diagrams, comparisons or role designs. Their value is real, but these cannot demonstrate Azure resource administration. Week 14 adds useful actual VNet/NSG commands, yet only configuration inspection is required; there is no executed client/server flow. Week 16 explicitly admits that its upload/download example does not prove deleted-data recovery. Week 20 implements application CI and drafts OIDC; it does not actually teach a secure Terraform deployment pipeline. Week 22 permits local logs and a designed notification rather than observed Azure telemetry.

The course often correctly labels a local fallback, then provides no graduation rule preventing that fallback from standing in for cloud capability. Keep affordable alternatives and record **which claim remains pending**. L3 means independently performing a familiar task using documentation, not copying steps or explaining what an unexecuted deployment would do.

### 2.4 The written assessment is easily gamed

All 96 authored base questions were inspected. Their keyed mechanisms are generally consistent with the lecture text; no clear objective-key inversion was found. However:

- **24/24 true/false items are false.**
- **16/24 single-answer keys are the first option**, including every Week 15–24 single-answer item.
- **18/24 multi-answer keys are exactly options 0, 1 and 2.**
- Distractors such as a CSS class, browser colors or a renamed file are frequently implausible for this student.
- Most weeks have only three objective items and one short response. They sample awareness, not configuration or diagnosis.
- `questionsFor()` builds each exam from the same public weekly bank: 12 first items, four second items and three fourth items. Week 24 samples **Weeks 13–24 only**, so it is a Semester 2 examination rather than an explicitly end-to-end final.
- Explanations are useful and short answers are honestly self-scored. Preserve that honesty, but add criterion-specific examples rather than relying solely on the generic 0–2 mechanism/limitation scale.

Evidence: all three content files; `src/curriculum/index.ts:16`; `src/pages/reader.ts` quiz/review functions; `src/lib/store.ts:145` and `:162`.

### 2.5 The midterm and graduation do not establish practical mastery

Week 12's practical is explicitly design-only by default. It cannot establish independent Linux service repair or live Azure networking. The same generic practical rubric later awards automation and recovery points without a tailored first-semester checklist. Week 24 can use tabletop responses, and completion is based on 72 marked sessions, all 74 score entries and 75 weighted points. There is no separate required skill gate and no critical security/cost fail condition.

Keeping **15/35/20/10/20** category weights is reasonable. It is not enough: high quiz/documentation scores can compensate numerically for absent or unsafe execution. Keep the weighted grade and require noncompensable mastery checks in Section 7. A self-hosted personal record can document honest evidence; it cannot certify an independent examiner watched it.

### 2.6 Concrete technical/instructional corrections

| Finding                                                               | Evidence                                                                                                                    | Required correction and verification                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A narrow NSG allow is not a restrictive segmentation policy by itself | Week 14 guide, `lab-guides.ts:8`: one HTTPS allow; no overriding internal deny; one subnet and no flow-generating workloads | Explicitly teach the default `AllowVNetInBound` behavior. Provide an intended flow matrix, an appropriately scoped higher-priority deny for unwanted internal traffic, and allowed/denied **new-connection** tests. The existing guide warns about defaults, but never makes the contrast an executed learning task. [NSG rules][NSG]                                                                                                                         |
| Private VM administration/outbound path is unresolved                 | Week 15 guide, `lab-guides.ts:22`: no public IP, no supplied private administration route; broad image enumeration          | Preflight a bounded image/SKU and reachable management method. Price any public IP/relay option, restrict administration, and define explicit outbound access if bootstrapping needs public endpoints. Do not add a permanent NAT Gateway/Bastion merely for the course. Current Microsoft guidance identifies changed private-subnet defaults for APIs released after March 31, 2026; actual API/version behavior must be checked. [Outbound access][EGRESS] |
| “Private blob container” can be mistaken for private networking       | `lab-guides.ts:28`                                                                                                          | Body correctly states public authenticated endpoint and disabled anonymous access. Rename the exercise to “authenticated blob access”; teach container public-access configuration separately from network reachability. Do not describe this as a deployed private endpoint. [Storage overview][STORAGE]                                                                                                                                                     |
| Recovery task is delegated rather than taught                         | Week 16 optional recovery extension                                                                                         | Supply a small, specific soft-delete/version or backup exercise, required recovery point, expected evidence and restoration command/portal sequence. Keep copies on the same host explicitly labeled local rehearsal. [Blob recovery][SOFTDELETE], [Backup][BACKUP]                                                                                                                                                                                           |
| CLI/auth and data-role prerequisites are externalized                 | Weeks 9 and 16                                                                                                              | Teach context and required permission boundaries before commands. Show how an authorized operator obtains the data role without making the workload Owner; identify the bootstrap administrator separately. [RBAC][RBAC], [CLI][CLI]                                                                                                                                                                                                                          |
| Protocol diagram risks combining discovery and data flow              | Week 4 task asks for a client → DNS → load-balancer path; existing diagrams are linear lists                                | Draw DNS as a separate exchange. DNS normally returns records; it does not carry the subsequent HTTP request. Show separate authentication/management paths and where TLS terminates. [DNS explanation][DNS]                                                                                                                                                                                                                                                  |
| “No healthy endpoints” does not cover every connection symptom        | Week 19 prose and selector exercise                                                                                         | Show endpoints/EndpointSlices, readiness and targetPort as separate checks. A local port-forward is not proof that external ingress, load balancing or network policy works. [Kubernetes basics][K8S]                                                                                                                                                                                                                                                         |
| Tail-latency example needs percentile precision                       | `walkthroughs.ts:46`: 95 samples at 100 ms, five at 10 s; mean 595 ms                                                       | Mean arithmetic is correct. Do not imply that p95 always exposes exactly the slowest 5%; the sample/percentile convention matters. Show a histogram and p99 or explicitly compute the chosen quantile. This is a clarification, not a reason to discard the worked case.                                                                                                                                                                                      |
| Lesson examples are not necessarily executable fixtures               | Week 19 mixes Dockerfile text and commented shell instructions; several optional branches lack tested setup                 | Separate files, command languages, expected outputs and deliberate faults. Name supported OS/tool versions and test the actual fixture before assigning it. This is instructional correctness, not a request for a UI redesign.                                                                                                                                                                                                                               |
| CI rollback language is application-oriented                          | Week 20; Terraform introduced for one week                                                                                  | Teach that reverting Terraform source does not necessarily restore data or undo replacement. Require reviewed plans, compatible application artifacts and a restore/forward-fix decision. Protected approvals and backend data permissions need actual practice. [Terraform sensitive data][TFSECRET], [GitHub OIDC][OIDC]                                                                                                                                    |

### 2.7 Benchmark, with explicit scope limits

The current [AZ-104 guide][AZ104] names five relevant domains: identity/governance, storage, compute, virtual networking and monitoring/maintenance. Use all five to check omissions; do not infer that mentioning each earns administrator competence. Its operating-system/network prerequisites support retaining infrastructure foundations. The official [administrator course][ADMIN] and learning paths provide deeper service tasks; this program should select a bounded subset rather than assign all of them.

The [Well-Architected Framework][WAF] is useful as a small decision/review checklist. It is not evidence that a graduate can design enterprise or mission-critical architecture. Optional AZ-104 preparation still needs a separate gap review, including areas intentionally left shallow here: directory licensing/SSPR, Azure Files identity integration, advanced VM availability/scaling, some data-transfer tooling, fuller Bicep deployment and regional Site Recovery operations. Those are exam-preparation gaps, not automatic reasons to overcrowd this course.

## 3. Competency and prerequisite matrix

**Interpretation:** current levels below describe what the supplied material supports/asks for, not the student's actual skill. L0 = absent, L1 = awareness, L2 = guided, L3 = independent familiar tasks with verification and common-failure diagnosis, L4 = advanced. No L4 outcome is promised. Optional execution is marked explicitly; none of the current independent L3 outcomes is reliably enforced.

Revised weeks are used in the introduction/practice/assessment columns. Guided practice means a model and coaching are available; independent practice means a fresh requirement or fault with the solution withheld. Official documentation remains allowed at L3.

| Competency                                          | Current supported level/evidence                      | Target                                           | First introduction          | Guided practice            | Independent variation           | Required assessment             | Missing practice / change                                                              |
| --------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------ | --------------------------- | -------------------------- | ------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| Process, CPU/RAM/storage and request-path reasoning | L1–L2, W1–2                                           | L2                                               | W1                          | W1                         | W1 changed port/process         | W1 diagnostic + W12 explanation | Map the known application; avoid prolonged hardware cataloging                         |
| DNS/TCP/TLS/HTTP diagnosis                          | L2 locally, W1/3/4                                    | L3                                               | W2                          | W2/4                       | W4/11/22                        | G1 at W4 and W12                | Add certificate/hostname evidence and unseen fault fixtures                            |
| CIDR, gateways and route selection                  | L1, W4 diagrams                                       | L3 for small IPv4 cases                          | W3                          | W3/10                      | W3 new range, W10 return path   | G1/W12                          | Calculate without supplied boundaries; inspect actual routes                           |
| Filtering and load-balancer reasoning               | L1, W4/14                                             | L3 filtering; L2 load-balancer diagnosis         | W4                          | W4/10                      | W10 allow/deny tests            | G1/G4                           | Execute traffic matrix; separate listener, probe and filter failures                   |
| Linux filesystem, ownership and least privilege     | L2 for basic commands, W5–6                           | L3                                               | W5                          | W5                         | W5 new service identity/path    | G2/W12                          | Create/use a restricted service account and diagnose parent permissions                |
| Linux service, SSH and logs                         | L1–L2, W6–7; SSH optional                             | L3 for familiar service                          | W5–6                        | W6                         | W6/12/22                        | G2                              | Install/configure an actual unit, validate host identity and repair a fresh fault      |
| Bash/CLI operational automation                     | L2 read-only, W7/17                                   | L2; L3 for context guards                        | W5/8                        | W6/8/17                    | W18 inventory variation         | W18/20 evidence                 | Reuse guarded scripts; error cases and structured output                               |
| Subscription, group, tags and inventory             | L1–L2, W9/17                                          | L3                                               | W7–8                        | W8                         | W9/17/23                        | G3                              | Actual scoped create/inspect/remove, not diagrams alone                                |
| Entra identity and effective RBAC                   | L1, W11/13; role design dominates                     | L3 narrow Azure authorization; L2 user lifecycle | W8                          | W8/13/14                   | W14/19/23                       | G3/G5                           | Assign/revoke a justified scope and prove allowed/denied data operations               |
| Policy, locks and governance                        | L1, W13                                               | L2                                               | W8                          | W19                        | W19 audit/exception scenario    | W19 security review             | Test an audit assignment/lock in disposable scope; do not require tenant-wide policy   |
| VM/image/disk and guest diagnosis                   | L2 local; optional Azure W15                          | L3 one familiar VM workflow                      | W9                          | W9                         | W10/12                          | G3/W12                          | A preflighted image, access route, boot/service distinction and cleanup                |
| VNet/subnets/NSG/routing                            | L1; optional L2 configuration, W14                    | L3 small network                                 | W3/8                        | W10                        | W10/11/23                       | G4                              | Two-way traffic tests and effective-rule evidence, not configuration screenshots       |
| Peering and endpoint choices                        | L0–L1 peering/service endpoints; L1 private endpoints | L2 limited peering/endpoint diagnosis            | W10–11                      | W11                        | W11 evidence variation          | W11/G4                          | State nontransitivity/overlap and service versus private endpoint differences          |
| Blob security/lifecycle/recovery                    | L1; optional guided CRUD, W16                         | L3 core Blob operations                          | W13                         | W13                        | W13/16/23                       | G5                              | Actual data-role tests, bounded SAS reasoning, version/recovery and lifecycle evidence |
| Azure Files and redundancy selection                | L1, W11/16                                            | L2 interface/selection; L1–L2 Files operation    | W13                         | W13 selected demonstration | W16 scenario                    | W16 explanation                 | Do not imply mastery of SMB identity/domain integration                                |
| Managed app hosting/identity/Key Vault              | L1 design, W10/13/21                                  | L2 implementation; L3 common access diagnosis    | W9/14                       | W14                        | W15/19/23                       | G5/G7                           | Existing app, runtime identity, data/vault scope, configuration and denied access      |
| Metrics, Azure logs/KQL and diagnosis               | L1–L2 local logs, W22                                 | L3 basic investigation                           | W9 local signals; W15 Azure | W15                        | W16/22/24                       | G7                              | Actual diagnostic settings, one working query, time window and correlated incident     |
| Reliability, restore and recovery objectives        | L2 local rehearsal, W16                               | L2 execution; L3 explain own restore evidence    | W7/13                       | W16                        | W16/23                          | G8                              | Timed integrity-checked restore; region failover remains outside core                  |
| Terraform lifecycle and change safety               | L1; optional L2 RG exercise, W18                      | L3 bounded stack                                 | W17                         | W17                        | W18/20/23                       | G6                              | Required create/change/no-op/plan/destroy across repeated variants                     |
| State, modules, drift and collaboration             | L1 only, W18                                          | L3 small module/drift case; L2 shared backend    | W17–18                      | W18                        | W18/22/24                       | G6                              | A real module, protected backend, benign drift and observed reconciliation             |
| Bicep/ARM literacy                                  | L1 plus optional Bicep alternative, W18               | L1–L2 reading/what-if                            | W18                         | W18 short comparison       | Optional                        | W18 interpretation              | Literacy only; keep Terraform as assessed implementation language                      |
| Secure infrastructure CI/CD/OIDC                    | L1 design + application CI L2, W20                    | L2                                               | W17 trust preview; W20      | W20                        | W20 rejected/accepted run       | G9                              | Terraform pipeline, backend identity, protected apply and reviewed plan                |
| Container hosting and registry operations           | L2 local Docker, W19; Azure registry/hosting L0–L1    | L2 Azure hosting                                 | W21                         | W21                        | W21 bad revision/pull/port case | G10                             | ACR auth, Container Apps deployment, revision evidence and cleanup                     |
| Kubernetes/AKS                                      | L1; optional local L2, W19                            | L1 AKS decisions; L2 local diagnostics           | W22                         | W22                        | W22 selector/readiness incident | G10 explanation                 | Bound scope; no paid cluster or advanced node administration                           |
| Cloud security review                               | L1; optional L2, W21                                  | L2                                               | W1 safe local work; W8 IAM  | W13/14/19                  | W19/23                          | G5/G9 + final gates             | Remediate a deliberately insecure fixture; test negative cases                         |
| Cost control and scoped cleanup                     | L1–L2 plans, W8 onward                                | L3 own resource lifecycle                        | W7–8                        | Every cloud lab            | W9/13/17/23                     | G11                             | Date-stamped estimate, inventory, residual resources and later billing check           |
| Documentation and incident communication            | L2 assigned reports; no per-artifact acceptance       | L3 concise handoff for familiar system           | W1                          | Every week                 | W12/22/24                       | G12                             | Evidence-linked runbooks another operator can follow; avoid repetitive essays          |
| Hybrid/enterprise/regional DR                       | L0–L1                                                 | L1                                               | W4/7/16                     | Diagrams only              | None required                   | Explain boundary                | No ExpressRoute, enterprise landing zone or complex regional failover build            |

Dependency spine: **request/process → IP/DNS/ports → filtering/routing → Linux service → cloud scopes/identity/CLI → Azure compute/network/storage → application identity and telemetry → recovery → Terraform/state → secure delivery → integrated operations**. Security and cost recur at every mutation, not solely in their named weeks.

## 4. Week-by-week audit of the existing course

### Classification and teaching-quality method

Each row classifies all three session pages. **S** = complete and substantively reviewed for its stated introductory purpose; **W** = complete but educationally weak for this student's target; **P** = partial/incomplete as a required practical or examination experience. **H** would mean placeholder; **N** would mean not authored. No whole session is H or N: all 72 routes have content. Parameter names such as `YOUR_LAB_GROUP` are intentional substitutions, not by themselves unauthored lessons.

“Complete” is not a promise of L3. W commonly means existing prose/fields are present but demonstrations, independent variation, fault evidence or prerequisite instruction are inadequate. P identifies a missing essential execution/assessment component, not an empty page. Counts below are body prose only and include assembled worked additions. File line anchors identify week starts; `walkthroughs.ts` and `lab-guides.ts` contribute where noted.

| Existing week and source                                                     | Prose words | Lecture / lab / review | Actual depth, lab quality, workload and sequence finding                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------- | ----------: | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Inside the infrastructure ([F:5](../src/curriculum/foundations.ts#L5))   |         569 | S / S / W              | Teaches process execution, resource constraints and persistence with a useful request diagram. Local HTTP success/404/stopped listener is safe and observable. No prior-knowledge diagnostic; Python inventory task underuses the developer's known architecture. Feasible in 3 hours, but 80 minutes for this reading is unjustified. Add a fresh application/port variation, not more hardware terminology. |
| 2 — Operating systems & VMs ([F:117](../src/curriculum/foundations.ts#L117)) |         502 | S / W / W              | Good kernel, host/guest, container and memory-pressure contrasts, plus worked sizing case. VM installation lacks a supported platform route and can consume the lab; snapshots and contention are described, not investigated. Isolate a short VM experience within W1/W5 rather than devote another full week before networking.                                                                             |
| 3 — Networking I ([F:211](../src/curriculum/foundations.ts#L211))            |         370 | W / W / W              | Correct layering, ports, TCP/UDP and TLS boundaries, but no worked resolver/certificate or packet interpretation. Lab repeats W1's 404/wrong port; it is mostly evidence collection. Add DNS/TLS investigation and a small unseen fault; keep OSI memorization subordinate to diagnosis.                                                                                                                      |
| 4 — Networking II ([F:300](../src/curriculum/foundations.ts#L300))           |         392 | W / W / W              | DNS mechanism/records are useful; CIDR gives answers without a binary worked derivation. DHCP/routing/NAT/firewalls/LB share one short section. Lab is primarily calculation/diagramming; no filtering or routed traffic experiment. Split addressing from filtering/diagnosis and separate DNS discovery from HTTP arrows.                                                                                   |
| 5 — Linux I ([F:389](../src/curriculum/foundations.ts#L389))                 |         345 | W / W / W              | Clear paths, quoting and streams. Copy/filter a prepared log is too little for a three-hour professional-developer lab. It never tests a service under a different identity. Merge useful navigation practice with users/permissions/process tasks; keep destructive-command cautions.                                                                                                                        |
| 6 — Linux II ([F:477](../src/curriculum/foundations.ts#L477))                |         320 | W / W / W              | Permission bits, service/process distinction and packages are explained correctly. Changing one file mode, terminating `sleep` and inspecting an existing service do not teach configuring or repairing a managed service. Add ownership/traversal failure and an actual unit. Package operations need a supported disposable environment.                                                                    |
| 7 — Linux troubleshooting ([F:567](../src/curriculum/foundations.ts#L567))   |         308 | W / W / W              | Strong caution about SSH host identity, cron environment and evidence preservation. The copied health script has useful input tests, but SSH is optional and no service is installed/repaired. A script test matrix is feasible; full SSH/systemd/cron competence is not established. Consolidate into a focused service lab and reuse scripting later.                                                       |
| 8 — Cloud fundamentals ([F:657](../src/curriculum/foundations.ts#L657))      |         453 | S / W / W              | Good responsibility, elasticity/reliability and cost boundaries; worked estimate avoids fabricated prices. Comparing three service models plus an availability design and estimate can fit with templates, but the deliverable is broad. Move earlier, introduce only essential region/availability concepts, and connect estimates to later real inventories.                                                |
| 9 — Azure architecture ([A:5](../src/curriculum/azure.ts#L5))                |         323 | W / W / W              | Useful scope/geography distinction and lifecycle grouping; mostly overview. Commands arrive before CLI installation/context teaching. Lab permits all diagrams with no account and therefore no administration claim. Move safe context/RBAC/budget setup ahead of deployment.                                                                                                                                |
| 10 — Compute choices ([A:99](../src/curriculum/azure.ts#L99))                |         310 | W / W / W              | Good statelessness and service-selection cautions. VM/App Service/Functions/Container Apps/AKS breadth substitutes for operating one host. Three workload comparisons create documentation work rather than execution. Keep a compact comparison and spend time on one VM and one familiar PaaS path.                                                                                                         |
| 11 — Core services ([A:192](../src/curriculum/azure.ts#L192))                |         311 | W / W / W              | Correct storage-interface and data/control-plane distinctions. Storage, VNet, identity, governance and monitoring are too compressed to be operational instruction. A secure upload diagram is valuable but not proof of permissions or service health. Redistribute into storage, networking, identity and observability weeks.                                                                              |
| 12 — Foundations exam ([A:278](../src/curriculum/azure.ts#L278))             |         325 | W / P / P              | Three sections are project/exam instructions. Practical is design-only by default; no independent Linux repair, configuration or network diagnosis. Written exam repeats selected bank questions. Requirements/diagram/cost/defense may exceed 3 hours if started from nothing. Replace with a bounded held-out operational case, while reusing prior diagrams.                                               |
| 13 — Identity/governance ([A:372](../src/curriculum/azure.ts#L372))          |         408 | W / W / W              | Accurate RBAC/Policy/lock distinctions and a useful managed-identity worked case. Lab drafts roles/policy/offboarding; it does not require creating/revoking an assignment or testing data access. Too late as the first detailed identity week. Introduce scoped access W8 and reinforce with storage/app tests.                                                                                             |
| 14 — Azure networking ([A:464](../src/curriculum/azure.ts#L464))             |         433 | W / P / W              | Helpful private-DNS and stateful-flow reasoning. Optional commands create only a network/NSG; the custom allow does not override default internal allowance. No workloads, deny tests, peering exercise or supplied failure evidence. Cannot establish segmented-connectivity skill; split configuration and service-connection diagnosis.                                                                    |
| 15 — Compute administration ([A:564](../src/curriculum/azure.ts#L564))       |         300 | W / P / W              | Sound provisioning/boot/listener/application distinction, but no actual bootstrap definition or bounded VM image/access route. Lab asks the student to invent bootstrap and fault configuration. Cloud branch may stall on connectivity/SKU setup. Move earlier and supply a tested guest fixture plus one independent repair.                                                                                |
| 16 — Storage/protection ([A:657](../src/curriculum/azure.ts#L657))           |         420 | W / P / W              | Good redundancy/history/RTO/RPO explanation and overwrite case. Local checksum restore is meaningful but limited. Cloud guide demonstrates authenticated upload/download, not recovery, and delegates role assignment/recovery setup. Split storage administration from a later timed recovery/reliability exercise.                                                                                          |
| 17 — Automation ([E:5](../src/curriculum/engineering.ts#L5))                 |         420 | W / S / W              | Structured output, context, exit status and idempotency are usefully explained. Read-only inventory with a wrong-subscription guard is a coherent introductory lab, although independent extension is missing. CLI introduction is far too late; distribute it from W8 and retain this task as practice, not a whole new programming week.                                                                    |
| 18 — IaC ([E:96](../src/curriculum/engineering.ts#L96))                      |         401 | W / P / W              | Correct warnings about plans/state and an adequate optional RG starter. Terraform **or** Bicep lets students avoid the intended Terraform skill; modules/backend/drift are not implemented. One week cannot deliver all these outcomes. Split lifecycle from state/modules; use repeated small changes and reserve Bicep for literacy.                                                                        |
| 19 — Containers/Kubernetes ([E:189](../src/curriculum/engineering.ts#L189))  |         314 | W / W / W              | Sound tags/digests, selection/readiness and managed-control-plane distinctions. Static nginx build repeats prior Docker exposure. Optional cluster branch has full manifest but minimal fault work, and task 5 assumes Pods despite optional Kubernetes in task 4. Split Azure hosting from bounded local Kubernetes investigation.                                                                           |
| 20 — CI/CD ([E:292](../src/curriculum/engineering.ts#L292))                  |         394 | W / P / W              | Good trust/rollback reasoning and current OIDC-claim caution. Example is Node application CI, with no infrastructure apply, backend authorization, federation execution or approval test. GitHub remote usage is not literally “local.” Replace with a narrow Terraform pipeline, simulated failures first and one observed authorized deployment.                                                            |
| 21 — Security ([E:394](../src/curriculum/engineering.ts#L394))               |         432 | W / W / W              | Useful threat model and compromised-managed-identity case. The lab often accepts specified rather than executed denied operations, and needs an already implemented capstone before its formal build week. Start security earlier; make this a bounded insecure-fixture remediation review.                                                                                                                   |
| 22 — Monitoring/reliability ([E:500](../src/curriculum/engineering.ts#L500)) |         415 | W / P / W              | Good user-facing signals, query schema caution and incident sequence. Local logs do not demonstrate diagnostic settings, KQL over real data or a delivered Azure alert. Monitoring is too close to the capstone. Introduce telemetry W15 and use this week for integrated incidents. Clarify the percentile worked example.                                                                                   |
| 23 — Capstone build ([E:604](../src/curriculum/engineering.ts#L604))         |         320 | W / P / W              | Requirements/evidence principles are worthwhile, but are not a taught implementation. The capstone page schedules IaC, pipeline and deployment for one Sunday, then five failure tests by Wednesday. With only one shallow IaC week and no worked cloud pipeline this is unrealistic. Earlier documents are useful inputs, not a staged implemented project.                                                  |
| 24 — Final/defense ([E:698](../src/curriculum/engineering.ts#L698))          |         323 | W / P / P              | Sensible three-scenario prompts and 15-minute defense structure. Tabletop is allowed; grade can pass without critical practical gates; final written exam excludes direct first-semester sampling. Keep the scenarios, supply evidence/variants, assess end-to-end competence and explicitly label unexecuted claims.                                                                                         |

### Eight teaching questions applied to the lectures

The week-specific judgments above were checked against the following dimensions. This table records recurring findings so that “correct overview” is not mistaken for “sufficient instruction.”

| Dimension                    | Actual evidence                                                                                                      | Required authoring standard                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| What is it?                  | All weeks have definitions/descriptions; W12/23/24 are mainly briefs                                                 | Define new terms with examples; do not expand acronym lists for their own sake          |
| Why does it exist?           | Usually the strongest part: isolation, naming, state, authorization, recovery                                        | Retain the cause/problem explanation                                                    |
| How does it work?            | Good introductions in W1–4; often only a sentence for routing, RBAC tokens, provisioning, state, KQL and controllers | At least one appropriately scoped mechanism walkthrough, with intermediate state/output |
| Real cloud use               | Often conceptual; live execution optional throughout many core weeks                                                 | Explicitly distinguish observed cloud behavior, local execution and a diagram           |
| When/when not?               | Stronger W2/8/10/16; several later service choices remain broad                                                      | One requirement-based decision and a rejected alternative, not five product comparisons |
| Common failures              | Misconception callouts and brief troubleshooting statements appear throughout                                        | Supply concrete symptoms/configurations, not just warnings                              |
| Investigation                | Good ordered reasoning in W3/7/14/15/22; sparse reproducible fault data                                              | One guided investigation followed by a different held-out fault                         |
| Relation to earlier learning | Usually “all previous weeks” in renderer; few precise dependencies                                                   | Name the specific prerequisite artifact and reuse it in the task                        |

Objectives, glossary, summary, review questions and resource sections exist across the weekly records. Their existence is not the missing element. Missing are adequately developed worked examples, explicit decision/check criteria and repeatable independent practice. Existing diagram arrays are useful overviews, but do not replace network/trust/management diagrams when those relationships are the assessed skill.

The per-lecture presence check below makes the eight dimensions explicit. **T** = taught at a useful introductory level; **M** = mentioned or reasoned about without a developed demonstration; **—** = not meaningfully taught in that lecture. These are qualitative authoring checks, not measured student results or an aggregate quality score. Project/exam briefs are evaluated as the text that actually exists, not assumed to contain missing instruction. A T does not mean enough practice for L3.

| Week | What | Why | Mechanism | Cloud use | When / not | Failure | Diagnosis | Prior links |
| ---- | ---- | --- | --------- | --------- | ---------- | ------- | --------- | ----------- |
| 1    | T    | T   | T         | M         | M          | T       | T         | M           |
| 2    | T    | T   | T         | M         | T          | T       | M         | M           |
| 3    | T    | T   | M         | M         | M          | T       | T         | M           |
| 4    | T    | T   | T         | M         | M          | M       | M         | M           |
| 5    | T    | T   | T         | M         | M          | M       | M         | M           |
| 6    | T    | T   | T         | M         | M          | T       | T         | M           |
| 7    | T    | T   | M         | M         | M          | T       | T         | T           |
| 8    | T    | T   | M         | T         | T          | T       | M         | T           |
| 9    | T    | T   | M         | T         | T          | M       | M         | M           |
| 10   | T    | T   | M         | T         | T          | T       | M         | T           |
| 11   | T    | T   | M         | T         | T          | T       | M         | M           |
| 12   | M    | T   | —         | M         | M          | M       | M         | T           |
| 13   | T    | T   | M         | T         | T          | T       | T         | M           |
| 14   | T    | T   | T         | T         | T          | T       | T         | T           |
| 15   | T    | T   | M         | T         | M          | T       | T         | M           |
| 16   | T    | T   | M         | T         | T          | T       | T         | T           |
| 17   | T    | T   | M         | T         | T          | T       | T         | T           |
| 18   | T    | T   | M         | T         | T          | T       | M         | M           |
| 19   | T    | T   | M         | T         | T          | T       | T         | M           |
| 20   | T    | T   | M         | T         | T          | T       | M         | T           |
| 21   | T    | T   | M         | T         | T          | T       | T         | T           |
| 22   | T    | T   | M         | T         | T          | T       | T         | T           |
| 23   | M    | T   | —         | T         | M          | M       | M         | T           |
| 24   | M    | T   | —         | T         | M          | T       | M         | T           |

## 5. Recommended revised syllabus

### Schedule, scope and workload rules

Maintain Saturday **09:00–12:00**, Sunday **09:00–12:00** and Wednesday **09:00–11:00**, all **Asia/Manila**. The final class is April 7; the final academic week ends April 9. Below, each week lists all three real dates. Every week has **S180 + L180 + W120 = 480 minutes**; 24 weeks total **11,520 minutes / 192 hours**.

**Normal weekly allocation:**

| Session   | Planned activities                                                                                                                             | Minutes |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------: |
| Saturday  | Retrieval 15; instruction 60; worked case 35; selected official reading 25; guided micro-exercise 25; breaks 20                                |     180 |
| Sunday    | Context/cost/safety preflight 15; guided A 40; independent B 50; troubleshooting C 35; evidence/reflection/cleanup D 20; contingency/breaks 20 |     180 |
| Wednesday | Retrieval 15; conceptual/scenario quiz 25; independent evidence check 40; feedback 25; remediation/next-session preparation 15                 |     120 |

Reading, installation, reports, capstone work and remediation must consume these allocations. Do not assign a separate long weekly essay. Use one short evidence packet that serves the lab, documentation grade and capstone milestone, with different rubric dimensions rather than repeating work. If setup exceeds its timebox, use the prepared fixture and record the unproven execution claim; remove optional scope before exceeding eight hours. Reassessment displaces enrichment or the next practice block, not sleep or employment time.

**Cost labels:** **L** = local/offline, no Azure provisioning; **B** = actual Azure operations potentially billable; **M** = local/fixture route plus optionally billable cloud execution. GitHub hosted-runner/storage usage is separately quota/metered, even when currently within an account's allowance. No Azure branch is guaranteed free. Before B/M execution, require a dated estimate or named pricing unknowns, a reviewed target inventory, budget precautions, maximum running window and cleanup plan. Missing cost/permission information blocks deployment, not local study. [Pricing calculator][PRICE], [Budgets][BUDGET]

**Difference from the proposed sequence:** retain its overall prerequisite order, but constrain Week 8 governance, Week 9 compute breadth, Week 13 Files/SAS depth, Week 16 recovery scope and Week 22 AKS depth. Introduce CLI at Week 8 and reuse it throughout. Introduce security with each feature; Week 19 consolidates/remediates. Use Terraform as the implemented language, Bicep/ARM as literacy. Build capstone evidence incrementally from Week 8. These are reallocations, not additions to 192 hours.

### Semester 1 — infrastructure foundations and bounded Azure administration

#### Week 1 — Infrastructure through a known application

**Dates:** Sat Oct 24, Sun Oct 25, Wed Oct 28, 2026. **Prerequisites:** existing web-development knowledge; a working Node runtime/browser; no infrastructure mastery assumed.

- **Objectives:** trace static frontend delivery versus the API process; distinguish CPU, RAM and durable data; identify an unknown rather than guess a cause.
- **Saturday:** a 20-minute ungraded diagnostic replaces the normal 15-minute retrieval block and five minutes of instruction: 20 diagnostic + 55 instruction + 35 worked case + 25 reading + 25 readiness exercise + 20 breaks = 180. Teach process/OS/resource boundaries, hosting, basic virtualization and failure domains. Work through the student's existing React/Node request path. Use the micro-exercise for tool/Linux readiness; no new application development.
- **Sunday:** A inspect a loopback listener and 200/404/stopped-process outcomes; B explain a changed API port and persistence boundary without a recipe; C investigate a supplied process/port mismatch; D annotate the diagram, evidence and cleanup. Python is optional control tooling, not a required new skill.
- **Wednesday:** review diagnostic gaps; scenario questions distinguish transport response, process state and persisted state. Correct one initial explanation.
- **Outcome/time/cost:** L2 infrastructure explanation; baseline for G1/G2. S180/L180/W120, with setup inside the blocks. **L**.
- **Selected resources:** bounded extracts from [Azure architecture fundamentals][ARCH] and [Linux Foundation][LF]; the full external Linux course is optional enrichment.

#### Week 2 — Networking I: follow a name and a connection

**Dates:** Sat Oct 31, Sun Nov 1, Wed Nov 4, 2026. **Prerequisites:** W1 process/listener/request evidence.

- **Objectives:** distinguish DNS, TCP/UDP, TLS and HTTP; collect evidence at the right boundary; explain certificate hostname validation.
- **Saturday:** IP/port/protocol tuple, TCP versus UDP, recursive/cached DNS, A/AAAA/CNAME, TLS certificate/trust/hostname and HTTP response meaning. Inspect a worked lookup and connection transcript. Use OSI only as a diagnostic scaffold.
- **Sunday:** A query a known name and inspect TCP/TLS/HTTP output; B diagnose a fresh hostname/port using documentation; C compare a DNS failure, connection refusal and certificate-name mismatch in an isolated fixture; D explain what each observation proves. Do not disable certificate checking as the fix.
- **Wednesday:** choose the next diagnostic command from evidence; explain a cache discrepancy and one TLS failure. Short model answers appear only after submission.
- **Outcome/time/cost:** L2 progressing toward G1/L3. S180/L180/W120. **L**; external demonstration endpoints require no account.
- **Resources:** [DNS][DNS], [IP][IP]; selected command help and supplied annotated transcripts.

#### Week 3 — Networking II: addressing and packet paths

**Dates:** Sat Nov 7, Sun Nov 8, Wed Nov 11, 2026. **Prerequisites:** W2 addresses/ports and DNS distinction.

- **Objectives:** calculate small IPv4 subnets; select a gateway/most-specific route; explain NAT and return traffic. IPv6 remains awareness-level.
- **Saturday:** binary prefix worked example, /24-to-/26 and a second range, private address space, DHCP-provided settings, on-link versus routed delivery and NAT tuples. Distinguish general subnet rules from later Azure reservations.
- **Sunday:** A inspect a supplied interface/route table; B create a non-overlapping plan for a different capacity requirement; C diagnose an incorrect prefix/default gateway from an isolated route fixture; D draw forward and return paths. Do not alter a managed work computer's networking.
- **Wednesday:** an unseen subnet calculation and route-selection explanation; verify non-overlap and distinguish total addresses from usable capacity.
- **Outcome/time/cost:** L3 small calculation/route interpretation after an unassisted check; actual Azure routing follows W10. S180/L180/W120. **L**.
- **Resources:** [IP][IP], [Azure VNet FAQ][VNETFAQ]; selected routing/CIDR material rather than an entire networking course.

#### Week 4 — Networking III: filtering and failed connectivity

**Dates:** Sat Nov 14, Sun Nov 15, Wed Nov 18, 2026. **Prerequisites:** W2–3; loopback/isolated lab environment.

- **Objectives:** distinguish resolver, listener, filter and return-path failures; write a small traffic matrix; explain load-balancer probes and VPN purpose.
- **Saturday:** stateful filtering, ordered rules, L4 versus L7 load balancing and health probes. Limit VPN to purpose, routes and site-to-site versus point-to-site; no gateway build. Work through an evidence-first investigation.
- **Sunday:** A inspect a known-good local request path; B investigate a different broken path; C use an isolated filtering/route fixture with misleading symptoms and withheld correction; D deliver cause, minimal change, verification and rollback. Host-wide firewall changes are excluded.
- **Wednesday:** G1: independently diagnose two different failures, including one real DNS/port/TLS case; interpret a filtering case without assuming a timeout proves a firewall fault.
- **Outcome/time/cost:** L3 basic network diagnosis; filtering configuration still L2 until W10. S180/L180/W120. **L**.
- **Resources:** [DNS][DNS], [NSG concepts/default rules][NSG] as preparation for Azure.

#### Week 5 — Linux I: administer a constrained environment

**Dates:** Sat Nov 21, Sun Nov 22, Wed Nov 25, 2026. **Prerequisites:** W1 readiness; one supported Ubuntu VM or systemd-capable WSL environment.

- **Objectives:** navigate/inspect safely, manage a service identity and directory permissions, inspect processes and packages, and preserve useful output.
- **Saturday:** filesystem hierarchy/paths, streams and quoting, ownership/groups, file versus directory permissions, package metadata and process identity. Skip general programming lessons. Show a permission failure with a correct-looking file mode but missing parent traversal.
- **Sunday:** A build a safe service workspace with a restricted account; B grant a new group read-only access to another directory; C fix ownership/traversal without 777 or a root-run application; D show positive and negative access tests, package version and transcript. Installation readiness has a timebox/fallback.
- **Wednesday:** independent permission task and process interpretation; reassess a failed access explanation.
- **Outcome/time/cost:** L2→L3 foundational Linux; first G2 evidence. S180/L180/W120. **L**.
- **Resources:** selected [systemd service documentation][SYSTEMD] for the service context; selected [Linux Foundation][LF] material. Ubuntu documentation remains a pending-access reference, not a required inaccessible lesson.

#### Week 6 — Linux II: operate and repair a service

**Dates:** Sat Nov 28, Sun Nov 29, Wed Dec 2, 2026. **Prerequisites:** W5 permissions/processes and W2–4 diagnosis.

- **Objectives:** configure a non-root systemd service; distinguish enabled/active/listening/healthy; use logs and key-based SSH deliberately; automate a bounded check.
- **Saturday:** unit User/WorkingDirectory/ExecStart, environment, journal/time ranges, signal/restart behavior and host-key versus user-key authentication. Review Bash validation/exit status rather than teach loops from scratch. Scheduling is a short demonstration, not a second project.
- **Sunday:** A run the supplied known application under a unit; B configure a similar unit for a new path/port; C repair one withheld bad working directory, permission or environment setting using status/journal/socket evidence; D validate restart/persistence boundaries and record a short runbook. SSH practice uses only an authorized disposable environment.
- **Wednesday:** G2: independent service diagnosis and least-privilege repair; feedback includes cause and negative test.
- **Outcome/time/cost:** L3 familiar Linux service administration/diagnosis; L2 automation. S180/L180/W120. **L**.
- **Resources:** [systemd.service][SYSTEMD], selected Linux materials; GNU Bash manual access is unverified in this audit.

#### Week 7 — Cloud fundamentals and engineering choices

**Dates:** Sat Dec 5, Sun Dec 6, Wed Dec 9, 2026. **Prerequisites:** W1–6; a working local application/service.

- **Objectives:** allocate customer/provider responsibility; distinguish availability, elasticity and recovery; estimate a bounded demonstration and identify unknown costs.
- **Saturday:** IaaS/PaaS/SaaS, virtualization review, region/zone basics, public/private/hybrid boundaries, shared responsibility and scaling. Use two architectures for the same known workload; no product catalog tour.
- **Sunday:** A annotate a VM versus managed-host design; B select one under changed requirements; C investigate a hypothetical “deallocated but still billed” inventory; D produce a dated estimate with retained storage/log/network assumptions and teardown targets.
- **Wednesday:** defend a service choice and identify the unprotected shared dependency; cost questions distinguish alerts from caps.
- **Outcome/time/cost:** L2 selection/cost reasoning. S180/L180/W120. **L**, calculator only; no deployment.
- **Resources:** selected [cloud fundamentals][FUND], [architecture fundamentals][ARCH], [pricing][PRICE] and [budget behavior][BUDGET].

#### Week 8 — Safe Azure organization, access and CLI

**Dates:** Sat Dec 12, Sun Dec 13, Wed Dec 16, 2026. **Prerequisites:** W7; authorized personal/sponsored subscription if using live Azure.

- **Objectives:** verify tenant/subscription, create/tag/inventory a disposable group, interpret narrow RBAC and configure available budget notifications.
- **Saturday:** identity versus management hierarchy; Entra users/groups awareness; principal/role/scope and management/data actions; CLI login/context/JSON queries. Preview Policy/locks without attempting enterprise governance. Explain the privileged bootstrap administrator separately from runtime/deployment roles.
- **Sunday:** A verify context and create a scoped learning group; B create a second disposable tagged resource container under a changed name; C investigate wrong-context or insufficient-role evidence; D inventory/cleanup and record estimate/budget ownership. A supplied fixture supports study if permissions are unavailable; live claims remain pending.
- **Wednesday:** G3 first check: safe context, scope explanation and no accidental cross-project deletion. Freeze capstone workload/requirements, no new app build.
- **Outcome/time/cost:** L2→L3 core management; capstone C1. S180/L180/W120. **M**; resource-group metadata is not itself a VM deployment, but no blanket free promise.
- **Resources:** [identities/governance path][IDPATH], [Entra ID module][ENTRAMODULE], [RBAC][RBAC], [CLI][CLI], [budgets][BUDGET].

#### Week 9 — Operate one Azure VM

**Dates:** Sat Dec 19, Sun Dec 20, Wed Dec 23, 2026. **Prerequisites:** W6 service repair; W8 context/scopes; preflighted image, quota and management connectivity.

- **Objectives:** provision/inspect a small VM, distinguish OS/data/temporary storage, and diagnose provisioning versus guest/application failure.
- **Saturday:** bounded image/SKU selection, disks, SSH/admin route, bootstrap and deallocation/deletion. Discuss availability options, App Service and Functions only to justify service selection; do not configure every compute product.
- **Sunday:** A deploy or inspect a tested short-lived VM and run the known service; B change an application setting without rebuilding application code; C repair a bad listener/service configuration; D capture state, disk/resource inventory and cleanup. Explicitly price and validate administration/outbound access.
- **Wednesday:** complete G3 VM evidence; identify the next diagnostic layer from a boot/status/socket/HTTP transcript. Save reproducible setup as capstone C2 input, not an always-running server.
- **Outcome/time/cost:** L3 bounded compute workflow after independent validation. S180/L180/W120. **B**; local fallback proves Linux only, not Azure provisioning.
- **Resources:** [VM overview][VM], selected [compute learning path][COMPUTEPATH], [explicit outbound][EGRESS].

#### Week 10 — Azure networking I: implement and test segmentation

**Dates:** Sat Dec 26, Sun Dec 27, Wed Dec 30, 2026. **Prerequisites:** W3–4 and W8–9; tested short-lived client/server fixture.

- **Objectives:** implement non-overlapping subnets and NSG intent, evaluate effective rules/routes, and prove an allowed and denied flow.
- **Saturday:** Azure address reservations, NIC/subnet NSG evaluation and defaults, longest-prefix routing, new versus established flows and peering boundaries. Peering is a small L2 demonstration; advanced transit routing is excluded.
- **Sunday:** A deploy the prepared two-endpoint network; B adapt the range/port matrix without step-by-step instructions; C fix an internal default-allow or rule-priority fault; D test both directions as needed, inspect effective rules and remove the resources. Review any public administration exposure separately from application flows.
- **Wednesday:** G4: explain and demonstrate allow/deny results, with a route/rule evidence packet. Capture C2 network design. Use a prepared fixture over the holiday; no hidden setup assignment.
- **Outcome/time/cost:** L3 small VNet/NSG workflow; L2 peering. S180/L180/W120. **B**; simulated configuration cannot close the live network gate.
- **Resources:** [network learning path][NETPATH], [NSGs][NSG], [VNet FAQ][VNETFAQ], [Network Watcher][WATCHER].

#### Week 11 — Azure networking II: diagnose service connectivity

**Dates:** Sat Jan 2, Sun Jan 3, Wed Jan 6, 2027. **Prerequisites:** W2 DNS/TLS, W10 flows, W8 identity/data-action distinction.

- **Objectives:** compare service and private endpoints, trace private DNS and use suitable Azure network evidence without confusing it with PaaS application monitoring.
- **Saturday:** public versus private service reachability, private DNS zone links/forwarding at an introductory level, service endpoint distinction and Network Watcher IP flow/effective rules/connection diagnosis. No paid firewall/VPN build.
- **Sunday:** A interpret a known-good service path; B diagnose a changed client/zone-link scenario; C investigate supplied wrong-DNS and denied-data evidence and, if funded, validate a short-lived real private endpoint; D explain the minimal correction and its limits. Remove a real endpoint/zone after evidence capture.
- **Wednesday:** network mastery refresh and midterm preparation; require a client-context lookup and separate authorization reasoning. C2 connectivity runbook.
- **Outcome/time/cost:** L3 basic evidence-driven diagnosis; private endpoint configuration L2 only if actually executed, otherwise L1 scenario reasoning. S180/L180/W120. **M**.
- **Resources:** [private endpoint][PRIVATE], [private DNS][PRIVATEDNS], [Network Watcher][WATCHER], [NSGs][NSG].

#### Week 12 — Independent foundations and administration midterm

**Dates:** Sat Jan 9, Sun Jan 10, Wed Jan 13, 2027. **Prerequisites:** W1–11 evidence; same tools, fresh parameters/faults.

- **Objectives:** demonstrate network/Linux diagnosis, safe Azure context and bounded configuration independently; communicate evidence and uncertainty.
- **Saturday:** 45 minutes targeted recap, 45-minute new written assessment, 60-minute evidence/diagram interpretation and 30-minute gap/plan review. Do not introduce new services.
- **Sunday:** 100-minute held-out practical covering one Linux service fault, one network-path fault and one scoped Azure change; 20-minute explanation, 20-minute rubric check, 20-minute cleanup and 20-minute contingency. Documentation permitted; answer walkthrough withheld. A local/fixture branch is separately labeled and leaves live Azure checks pending.
- **Wednesday:** 45-minute feedback, 45-minute equivalent retest and 30-minute individualized practice plan. Reuse existing diagrams rather than demand a new architecture essay.
- **Outcome/time/cost:** independently checked G1–G4; written and practical evidence separated. S180/L180/W120. **M**; live resources only for the bounded administration check.
- **Resources:** previously assigned [network][NETPATH], [RBAC][RBAC], [VM][VM] and [systemd][SYSTEMD] references, not new courses.

### Semester 2 — operations, Terraform and integrated delivery

#### Week 13 — Storage administration and recoverable data

**Dates:** Sat Jan 16, Sun Jan 17, Wed Jan 20, 2027. **Prerequisites:** W8 RBAC, W10–11 reachability, midterm remediation plan.

- **Objectives:** manage a Blob container with identity-based access, compare Blob/Files, and recover a disposable sample using a configured protection feature.
- **Saturday:** account/container/data-plane boundaries, narrow roles, anonymous access versus network access, SAS scope/expiry, encryption defaults, tiers/lifecycle and redundancy. Files is a bounded interface demonstration; domain-joined SMB/complex replication is not mastered here.
- **Sunday:** A provision authenticated Blob storage and a tested recovery mechanism; B change container/object and narrow permissions independently; C investigate a denied data operation or expired/scoped SAS fixture; D restore a disposable sample, compare contents and inventory retained data. Do not publish tokens in evidence.
- **Wednesday:** G5 storage checks; explain the actual recovery point and why redundancy alone is insufficient. C3 data/permission evidence.
- **Outcome/time/cost:** L3 core Blob workflow after independent check; L1–L2 Files/SAS selection. S180/L180/W120. **B**; a local copy cannot prove Azure data-role behavior.
- **Resources:** [storage path][STOREPATH], [storage overview][STORAGE], [RBAC][RBAC], [soft delete][SOFTDELETE].

#### Week 14 — Application hosting, managed identity and secrets

**Dates:** Sat Jan 23, Sun Jan 24, Wed Jan 27, 2027. **Prerequisites:** known application; W8 roles, W11 reachability and W13 data access.

- **Objectives:** host the existing app, separate configuration from artifacts, use managed identity for data access and diagnose an authorization/configuration failure.
- **Saturday:** App Service plan/app boundaries, deployment configuration, runtime identity and Key Vault access/rotation. Use one host, not App Service plus Functions plus AKS. Review slots only if the selected funded tier supports them; artifact redeployment is the baseline rollback mechanism.
- **Sunday:** A deploy a supplied known-good app and grant its runtime identity narrow data access; B reproduce the pattern under a changed scope or setting; C repair wrong identity/role/audience or configuration evidence; D prove valid and denied access, document secret handling and teardown. A dummy vault secret is a separate demonstration where a real secret requirement exists.
- **Wednesday:** G5 application-identity diagnosis; scope and denied-operation explanation. C3 hosted workload with no new frontend/backend development.
- **Outcome/time/cost:** L2 hosting implementation; L3 familiar data-access diagnosis. S180/L180/W120. **B**.
- **Resources:** [App Service managed identity][APPIDENTITY], [Key Vault][VAULT], [RBAC][RBAC], [compute path][COMPUTEPATH].

#### Week 15 — Azure observability and incident evidence

**Dates:** Sat Jan 30, Sun Jan 31, Wed Feb 3, 2027. **Prerequisites:** W14 working app/identity; Linux log basics and time-range reasoning.

- **Objectives:** configure appropriate diagnostic collection, query actual telemetry, correlate a failing user operation and test an actionable notification.
- **Saturday:** metrics versus logs/traces; Activity Log versus resource diagnostic settings versus application telemetry; workspace/schema/time range; small KQL filters/summaries; alert/action group and cost/retention. One user-facing success/latency indicator is enough.
- **Sunday:** A instrument/collect the prepared app signal and run a known query; B write a new filter/aggregation for another operation; C diagnose a supplied dependency failure versus missing ingestion; D demonstrate notification and record the user symptom/cause. Use a simulated alert receiver if Azure notification permissions are unavailable and label that limit.
- **Wednesday:** G7: independent timed investigation with correlated evidence and a corrected query. C4 telemetry/runbook increment.
- **Outcome/time/cost:** L3 basic logging/diagnosis; L2 alert configuration. S180/L180/W120. **B/M**; local logs prove log reasoning, not an Azure collection pipeline.
- **Resources:** [Azure Monitor][MONITOR], selected [monitor/backup path][MONPATH], [Well-Architected][WAF].

#### Week 16 — Reliability, restoration and cost reconciliation

**Dates:** Sat Feb 6, Sun Feb 7, Wed Feb 10, 2027. **Prerequisites:** W13 protected sample, W14 application and W15 telemetry.

- **Objectives:** set feasible RTO/RPO, restore and verify a sample, distinguish scale from recovery, and reconcile resources against the cost model.
- **Saturday:** failure domains, availability versus recovery, backup/version distinctions, restore permissions/order, stateless scaling and cost tradeoffs. Use a short backup-policy demonstration/fixture; enterprise regional DR is awareness only.
- **Sunday:** A time a known restore into an isolated destination; B recover a different object/revision without the recipe; C explain a restore failure caused by retention/identity or recover the known artifact after a bad release; D compare integrity, recovery point/time and retained resources with the plan. No destructive production data experiments.
- **Wednesday:** G8 and G11: review measured recovery, residual costs and a usable runbook; reserve remediation time for earlier core gates.
- **Outcome/time/cost:** L2 recovery execution and reliability choices; L3 explain/validate own restore and cleanup. S180/L180/W120. **M**; a regional failover is not required.
- **Resources:** [Backup][BACKUP], [soft delete][SOFTDELETE], [pricing][PRICE], [budgets][BUDGET], [Well-Architected][WAF].

#### Week 17 — Terraform I: a safe resource lifecycle

**Dates:** Sat Feb 13, Sun Feb 14, Wed Feb 17, 2027. **Prerequisites:** W8 CLI/context, core Azure network/storage/compute concepts; no previous Terraform assumed.

- **Objectives:** author a small parameterized configuration, authenticate deliberately, review a plan and perform create/change/no-op/destroy safely.
- **Saturday:** provider/version/lockfile, resource address, variables/outputs and references; configuration/state/remote-object distinction. Teach replacement and data risk. Start with resource group plus one familiar low-complexity resource; do not build the entire capstone in one sitting.
- **Sunday:** A run the reviewed starter lifecycle; B independently add/change a named/tagged familiar resource from requirements; C diagnose wrong context, invalid input or an unexpected replacement; D validate final inventory and safe cleanup. State/plan files never enter Git.
- **Wednesday:** first G6 check: explain every planned action, prove a no-op and distinguish validate from real deployment success. C5 first IaC increment.
- **Outcome/time/cost:** L2 progressing toward L3 Terraform fundamentals. S180/L180/W120. **B/M**; offline validation alone cannot close apply/destroy mastery.
- **Resources:** [Terraform Azure tutorial][TFBUILD], [sensitive state/plans][TFSECRET], [CLI][CLI].

#### Week 18 — Terraform II: state, modules and drift

**Dates:** Sat Feb 20, Sun Feb 21, Wed Feb 24, 2027. **Prerequisites:** successful W17 lifecycle; scoped storage permissions and familiar resource IDs.

- **Objectives:** refactor one coherent module, use a protected backend, detect benign drift and choose reconciliation without losing control of the resource.
- **Saturday:** module input/output contract, dependencies, local versus remote state, backend bootstrap/locking/access and state sensitivity. Read a small Bicep/ARM equivalent for 20 minutes within instruction/worked time; do not require two IaC implementations.
- **Sunday:** A use a prepared protected backend and small module; B modularize a second environment/value set; C investigate a deliberately changed tag and an address/refactor fixture, reviewing the plan before reconciliation; D prove a no-op and safe lifecycle. Do not hand-edit state or force-unlock an active writer.
- **Wednesday:** G6 independent variant and G11 cleanup; explain backend management/data permissions separately. C5 reproducible module/state design.
- **Outcome/time/cost:** L3 small Terraform module/drift workflow; L2 shared-backend operations; Bicep L1–L2 literacy. S180/L180/W120. **B/M**.
- **Resources:** [remote state][TFREMOTE], [modules][TFMODULE], [drift tutorial][TFDRIFT] for mechanism only (its AWS deployment is not assigned), [Bicep][BICEP].

#### Week 19 — Security review and remediation

**Dates:** Sat Feb 27, Sun Feb 28, Wed Mar 3, 2027. **Prerequisites:** roles, networks, storage, app identity, logs and Terraform; security has already appeared in those weeks.

- **Objectives:** identify concrete exposure, prioritize fixes, remediate a bounded insecure configuration and validate both allowed and denied behavior.
- **Saturday:** a small threat model, least privilege, public exposure, encryption/transport, secrets, policy audit and lock limitations. Use a supplied deliberately insecure **configuration fixture**, not real leaked credentials or a publicly exposed vulnerable app.
- **Sunday:** A inspect a demonstrated finding; B independently find two other meaningful issues; C repair a broad role or storage/network misconfiguration without breaking the necessary operation; D test negative cases and document residual risk. Use audit-policy scope/exception evidence instead of tenant-wide enforcement.
- **Wednesday:** security review rubric; verify runtime cannot administer the environment and logs/artifacts contain no secrets. C6 hardening evidence.
- **Outcome/time/cost:** L2 cloud security review; repeated L3 narrow authorization. S180/L180/W120. **M**; local/plan review cannot prove the live effective permission result.
- **Resources:** [Azure security guidance][SECURITY], [RBAC][RBAC], [Policy][POLICY], [Key Vault][VAULT], [Terraform secrets][TFSECRET].

#### Week 20 — Secure Terraform delivery with GitHub Actions

**Dates:** Sat Mar 6, Sun Mar 7, Wed Mar 10, 2027. **Prerequisites:** W17–19; existing GitHub Actions familiarity is used, not retaught.

- **Objectives:** validate/plan infrastructure in CI, use scoped OIDC trust, protect apply and backend access, and explain rollback/forward-fix limits.
- **Saturday:** repository/event/environment trust; issued claims; workflow permissions versus Azure roles; fmt/validate/plan, sensitive plan artifacts and approval. Distinguish reverting source, restoring data and returning an app artifact. Use current claim documentation, not a stale copied subject string.
- **Sunday:** A run the prepared minimal pipeline; B adapt it to the student's lab scope/backend; C demonstrate an invalid change being blocked and an unauthorized event failing trust while an approved run succeeds; D record commit/plan/apply evidence and recover a harmless change. Bootstrap federation/role assignment is a separately authorized administrator step.
- **Wednesday:** G9 guided-delivery evidence and independent explanation; C7 pipeline increment. No long-lived cloud client secret fallback.
- **Outcome/time/cost:** L2 secure infrastructure CI/CD; L3 explanation of own change safety. S180/L180/W120. **B/M**, plus GitHub quota/metered usage.
- **Resources:** [GitHub Actions][ACTIONS], [Azure OIDC][OIDC], [Terraform plan/state sensitivity][TFSECRET], [RBAC][RBAC].

#### Week 21 — Azure container hosting and failed revisions

**Dates:** Sat Mar 13, Sun Mar 14, Wed Mar 17, 2027. **Prerequisites:** existing Docker skill, W14 configuration/identity and W15 logs.

- **Objectives:** explain registry/authentication, deploy a known image to a managed host and diagnose a pull, port, configuration or readiness failure.
- **Saturday:** short Docker review only; digests/tags, build context, ACR permissions, Container Apps ingress/revisions/scaling and hosting tradeoffs. A registry pull identity is not automatically the same as application data authorization.
- **Sunday:** A deploy the known app/image to a short-lived reviewed Container Apps environment; B release a changed immutable image/configuration; C diagnose one failed revision from logs/status; D select a working revision, confirm the operation and remove registry/environment/log resources as appropriate. Do not rebuild the capstone workload into another framework.
- **Wednesday:** G10 container-hosting evidence and service-selection defense. Compare with the existing App Service capstone; switching its host is optional.
- **Outcome/time/cost:** L2 Azure container hosting. S180/L180/W120. **B/M**; local Docker fallback leaves Azure hosting unproven.
- **Resources:** selected [Docker][DOCKER], [ACR][ACR], [Container Apps][ACA], [compute choice][COMPUTE].

#### Week 22 — Kubernetes literacy and integrated incident practice

**Dates:** Sat Mar 20, Sun Mar 21, Wed Mar 24, 2027. **Prerequisites:** W21 containers, networking/identity/logging and retained Terraform evidence.

- **Objectives:** explain Pod/Deployment/Service/readiness and AKS responsibility; diagnose a bounded workload fault; integrate earlier evidence without adding production cluster operations.
- **Saturday:** 60-minute bounded Kubernetes mechanism/diagnostic segment, worked selector/readiness example and service-selection comparison. Use remaining normal reading/micro-exercise/retrieval time for an integrated incident. No node pool, CNI, upgrade or paid AKS administration project.
- **Sunday:** A inspect a small pre-provisioned local cluster or supplied event/log fixture; B diagnose a changed selector/targetPort/readiness case; C investigate a separate Azure application/identity/route/telemetry incident; D produce a timeline and safe verification. Avoid a clean rebuild of a whole cluster during the block.
- **Wednesday:** G7/G12 integrated check and remaining core-gate retests. Finalize capstone evidence index and risks before Week 23.
- **Outcome/time/cost:** L1 AKS choice/ownership, L2 local Kubernetes diagnostics; L3 familiar cross-layer incident reasoning. S180/L180/W120. **L/M**; no AKS cluster required.
- **Resources:** selected [Kubernetes basics][K8S], [Network Watcher][WATCHER], [Monitor][MONITOR], [Well-Architected][WAF].

#### Week 23 — Capstone integration and acceptance

**Dates:** Sat Mar 27, Sun Mar 28, Wed Mar 31, 2027. **Prerequisites:** C1–C7 working artifacts and core gate evidence, not an empty repository.

- **Objectives:** independently integrate the familiar infrastructure, validate requirements and close operational/security gaps without adding services.
- **Saturday:** use 30 minutes to check architecture/requirements, 90 for implementation repair, 30 for security/cost review and 30 for breaks/contingency. Select a known release; no new workload features.
- **Sunday:** 15-minute preflight, 70-minute recreate/integration, 40-minute held-out acceptance/failure tests, 25-minute evidence/runbook correction, 10-minute teardown verification and 20-minute contingency. Reuse previously tested restore and release mechanisms.
- **Wednesday:** 45-minute evidence/critical-gate check, 45-minute targeted correction/retest, 30-minute defense rehearsal. Do not require five entirely new experiments at once.
- **Outcome/time/cost:** independent familiar-system integration; C8 release/evidence package. S180/L180/W120. **B/M**; full Azure claims require observed authorized Azure execution.
- **Resources:** only the previously selected Terraform, identity, hosting, storage and monitoring references; [Well-Architected][WAF] as a bounded review checklist.

#### Week 24 — Final practical, defense and skills-gap plan

**Dates:** Sat Apr 3, Sun Apr 4, Wed Apr 7, 2027; academic week ends Fri Apr 9. **Prerequisites:** frozen capstone release, evidence index and complete practice history.

- **Objectives:** demonstrate the system, diagnose fresh faults, defend decisions/limitations and archive a truthful competency record.
- **Saturday:** 30-minute recap, 60-minute new end-to-end written/scenario assessment, 60-minute targeted remediation and 30-minute presentation preparation. Sample networking/Linux as well as Azure/automation.
- **Sunday:** 90-minute bounded practical, 20-minute demonstration/defense, 30-minute scoring, 20-minute cleanup and 20-minute buffer. Use either the prepared live environment or preserved cloud evidence plus a fresh executable local fault; identify exactly what was not observed live.
- **Wednesday:** 60-minute equivalent retest if needed, 30-minute skills-gap/next-30-days plan, 30-minute record/export/portfolio archive. Unpassed critical gates remain pending; the calendar does not force a false pass.
- **Outcome/time/cost:** conditional graduation at the specific levels demonstrated. S180/L180/W120. **M**; no always-on infrastructure after the demonstration.
- **Resources:** the student's runbooks and selected [AZ-104 gap benchmark][AZ104]/[Well-Architected][WAF] references; optional exam study is subsequent work.

## 6. Practical lab improvement plan

### Required lab contract

Every replacement core lab must name the competency, starting state, supported tool/environment, specific prerequisites, A/B/C/D time allocation, success/failure observations and safe cleanup target. Publish the guided A solution; withhold the B/C correction until after an attempt. An independent task changes the requirement, identity, range, resource or fault—not just the resource name in an otherwise copied recipe.

Provide an **evidence packet**: target/subscription/context, version/commit, intent, command/action, sanitized observation, interpretation, correction, positive/negative checks, limitations and cleanup. Model output shapes rather than static IPs or time-dependent exact output. An exit code, a screenshot and an application success response prove different things. Documentation is allowed; an assessor or the student must honestly record whether hints were needed.

### Specific replacements and validation

| Existing lab(s)                                 | Replacement / revised slot                          | Independent work and deliberate fault                                                     | Acceptance evidence                                                                                              |
| ----------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| W1 inventory/static server                      | Revised W1 known application + control listener     | Changed process/port and persistence question, separate from guided HTTP example          | Correct listener/PID/request relationship; 404 versus connection error; labeled known app diagram                |
| W2 guest/container comparison                   | Short W1/W5 platform experience                     | New guest allocation/observation; unsupported virtualization path has a prepared fallback | Actual host/guest/kernel distinctions; a persisted sample; no claim of dedicated physical vCPU capacity          |
| W3 repeated request checks                      | Revised W2 DNS/TLS investigation                    | New hostname/certificate/port transcript                                                  | Correct layer, command and interpretation; no insecure TLS-bypass “fix”                                          |
| W4 subnet plan only                             | Revised W3 calculation and W4 fault pack            | Unseen subnet capacity; wrong gateway or return route                                     | Non-overlap, calculation, selected route and forward/return explanation                                          |
| W5 copy/filter files; W6 chmod/sleep            | Revised W5 identity/permissions                     | A second account/group and a parent-directory traversal fault                             | Allowed/denied reads under actual identities; corrected ownership/mode, not 777                                  |
| W6 service inspection; W7 copied script         | Revised W6 managed service                          | New unit/path and a withheld environment/ExecStart/permission problem                     | Service survives intended restart; logs/socket/HTTP agree; non-root runtime; valid SSH host-identity process     |
| W8 architecture estimate                        | Revised W7 choice/cost                              | Different demand or retained-resource case                                                | Dated assumptions, remaining failure dependency, cost unknowns and cleanup scope                                 |
| W9 diagram; W13 role design                     | Revised W8 actual safe environment                  | Wrong subscription/role or inherited-access fixture                                       | Narrow scoped mutation and inventory; explain bootstrap authority and effective access                           |
| W10 compute decision; W15 invented bootstrap    | Revised W9 one VM                                   | Repair actual guest service independently                                                 | Provisioning/boot/service/HTTP evidence; reachable restricted administration; disk/IP inventory                  |
| W14 configuration-only network                  | Revised W10 tested segmentation                     | Deny a formerly allowed unwanted internal flow; new-connection verification               | Two observable endpoints, allowed application flow, denied unwanted flow, effective rules/routes, cleanup        |
| W11 secure upload diagram; W14 DNS design       | Revised W11 connectivity investigation              | Wrong client-context DNS plus separate 403 evidence                                       | Correct DNS/route/filter/auth distinction; live endpoint setup recorded separately from fixture reasoning        |
| W12 design “practical”                          | Revised W12 held-out operations                     | One Linux, one network and one bounded Azure context/configuration task                   | G1–G4 evidence; fresh fault/parameters; no model answer during attempt                                           |
| W16 copy/restore and delegated Azure protection | Revised W13 storage, W16 recovery                   | New container/scope; denied data operation; restore different object/version              | Actual authorization and restored contents; retention/recovery point/time; no claim that download equals restore |
| W17 copied read-only inventory                  | Embedded W8/17/18 guard practice                    | Different query/schema and wrong-context failure                                          | Structured output, nonzero failure, no tokens, no unintended mutation                                            |
| W18 Terraform-or-Bicep resource group           | Revised W17–18 Terraform lifecycle/module           | New familiar resource; benign drift and refactor/address review                           | create/change/no-op/plan/destroy, protected state, module contract, explicit drift decision                      |
| W19 static nginx + optional cluster             | Revised W21 Azure host and W22 local diagnosis      | Failed image pull/target port; selector/readiness mismatch                                | Deployment/revision logs plus working operation; local K8s endpoint evidence; no paid AKS requirement            |
| W20 Node build and OIDC draft                   | Revised W20 Terraform pipeline                      | Invalid plan blocked; wrong event rejected; approved apply succeeds                       | Actual trust/permission result, protected backend, reviewed plan and target inventory                            |
| W21 security design                             | Revised W19 bounded insecure fixture                | Locate/remediate broad permission or exposure; retest denied operation                    | Before/after evidence, retained legitimate function and risk priority                                            |
| W22 local logs/design alert                     | Revised W15 Azure observability and W22 integration | Missing ingestion versus dependency error; unfamiliar correlation ID                      | Actual collected table/signal, correct time filter, action/notification evidence and incident timeline           |
| W23 from-scratch build; W24 tabletop            | Staged capstone + held-out final                    | Recreate known stack, investigate fresh fault and defend limitations                      | Traceable release/evidence index, critical gates and verified resource removal                                   |

### Feasibility and access controls

- Test each lab's known-good baseline and fault injection using the named tool version before assigning it. Publish an instructor dry-run time; allow the student more time than an expert. If the normal case exceeds 150 lab minutes, reduce scope to preserve cleanup/contingency.
- Do not make the student choose among five hypervisors, two IaC languages and three compute platforms before beginning. Support one local Linux route, one default app host and Terraform; offer alternatives with clearly bounded support.
- For VM labs, verify image/SKU/quotas and a reachable administration path beforehand. An inaccessible private VM is not an effective beginner lab. Default outbound behavior varies with resource/API history; do not assume package downloads will work. [Outbound access][EGRESS]
- For segmentation, preserve necessary administration/return paths while restricting application flows. Review default NSG allowances explicitly. No corporate-network changes or unauthorized scans. [NSGs][NSG]
- For cloud permission exercises, specify who has authority to bootstrap identities/assign roles. **Contributor alone does not provide general role-assignment administration.** Do not “fix” the pipeline by giving runtime identity Owner. Azure management scope and Terraform backend/blob data scope are separate. [RBAC][RBAC]
- Cloud preflight must include the region, SKU/tier, quantity, duration, storage/transactions, logs/retention, network/endpoints/IPs and backups if used. If an item cannot be priced, record the unknown and do not deploy that component. Budgets notify and can lag; they do not stop resources. [Pricing][PRICE], [Budgets][BUDGET]
- Teardown is part of the lab: inventory exact owned resources first; remove lab-only locks where authorized; destroy/delete reviewed targets; inspect remaining disks, IPs, workspaces, registries, endpoints, backups/versions and retained data. Schedule a later cost review within a subsequent Wednesday block. “No resources in one group” is not proof of a zero subscription bill.
- Local, mocked and architecture alternatives remain valuable. Their evidence must say “Linux verified, Azure provisioning pending,” “DNS fixture reasoned, private endpoint deployment pending,” or equivalent. Do not silently award the same live-cloud competency.

## 7. Assessment and mastery plan

### Retain the grade; add a separate mastery record

Keep the current five weights unless experience later justifies a change. Distinguish missing from zero and current graded-work average from earned final points; the implementation already does this usefully. Written midterm/final results remain in the quiz category, with practical examinations separately weighted. Avoid grade inflation from duplicated artifacts by assessing execution in the lab category and explanation/reproducibility in documentation.

**Recommended graduation rule:** 75 or more final weighted points, required submissions/grade entries, and all required mastery gates passed at their target level. Session checkmarks document study participation, not competence. A passed gate must reference evidence, date, environment, allowed assistance and assessor type (self/peer/instructor). A personal self-assessment is acceptable when explicitly labeled; it is not independent external certification.

### Practical skills checklist

| Gate                                | Required performance                                                                                                                         | Target / assessment points              | Pass evidence and failure conditions                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| G1 — Basic network diagnosis        | Diagnose two distinct DNS/port/TLS/route failures; calculate/interpret a small subnet and route                                              | L3; W4, W12, W24                        | Correct layer and justified next test; successful verification; no certificate-check bypass or unsupported root-cause claim |
| G2 — Linux operations               | Configure a non-root service, inspect logs/process/listener and repair an unseen permission/path/environment fault                           | L3; W6/W12                              | Actual working service and least-privilege positive/negative checks; 777/root-as-default fails                              |
| G3 — Azure resource management      | Verify context, provision/inspect/change a familiar small resource and separate provisioning/guest health                                    | L3; W8–9/W12                            | Correct tenant/subscription/group and observed result; wrong-target mutation is a critical fail                             |
| G4 — Azure network                  | Implement a small subnet/NSG design and prove allowed/denied new flows; interpret effective rules/routes                                     | L3; W10–11, final evidence              | Actual Azure configuration/traffic evidence required for the Azure claim; fixture alone remains pending                     |
| G5 — Identity and storage           | Identify the actual runtime principal, grant/revoke narrow data access, prove authorized and unauthorized operations and protect a sample    | L3; W13–14/19/24                        | Data-operation evidence at exact scope, secure secret handling and preserved intended access; broad Owner workaround fails  |
| G6 — Terraform                      | Independently author/adapt a small stack; plan/apply/change/no-op/destroy; explain drift and small module/state boundaries                   | L3 bounded lifecycle; W17–18/23–24      | Reviewed plan matches target, safe no-op, reconciled benign drift, no state/secret in Git and verified removal              |
| G7 — Logging and incidents          | Query actual Azure telemetry, correlate an operation and diagnose a common failure                                                           | L3; W15/22/24                           | Correct schema/time window and actionable cause/verification; local JSON alone does not establish Azure collection          |
| G8 — Recovery                       | Perform a guided restore, measure time/recovery point and verify contents; explain limits                                                    | L2 execution; W16/23                    | Real restored sample, comparison and RTO/RPO discussion; redundancy-only claim fails                                        |
| G9 — Secure infrastructure delivery | Adapt an OIDC Terraform pipeline; block invalid/untrusted runs and observe a scoped successful deployment                                    | L2; W20/23                              | Trust, backend, approval and plan/apply evidence; permanent broad client secret or untrusted privileged execution fails     |
| G10 — Containers and service choice | Deploy/troubleshoot a known container with guidance; interpret local Kubernetes workload/Service evidence; reject unjustified AKS complexity | L2 containers/local K8s; L1 AKS; W21–22 | Record Azure hosting separately from local execution; a selector or revision diagnosis plus verified operation              |
| G11 — Cost and cleanup              | Produce estimate/unknowns, owned inventory, bounded running window and cleanup/residual-cost review                                          | L3; every cloud week, final             | Exact target and remaining chargeable items accounted for; leaving untracked billable resources fails until reconciled      |
| G12 — Operational handoff           | Give another operator a concise deployment/diagnosis/recovery/cleanup runbook and explain known limits                                       | L3 familiar system; W12/22/24           | Evidence and actual commands/targets/version; reader can follow without guessing authority or exposing credentials          |

G1–G7 and G11 are independent core checks; G8–G10 explicitly allow guidance consistent with L2. G12 is independent explanation/handoff. These targets apply to the bounded course system, not every service variation. A learner without live Azure access can finish foundations and simulations, but core Azure gates remain **not demonstrated**, regardless of weighted grade.

### Scoring and feedback

For each independent practical, use **40 points functional result, 25 diagnosis/evidence, 20 safety/reproducibility, 15 explanation/limitations**. Pass at **80/100 for that mastery check**, plus all critical safety/result criteria. This 80% gate threshold is a proposed performance standard, not a Microsoft certification score and not a change already made to the 75% course grade. L2 checks instead record supported execution and explanation using the same dimensions, with assistance documented.

Record what worked, the earliest unsupported inference, the minimum correction, and the new evidence proving it. A submission saying “completed” does not count. For a short answer, define two or three topic-specific required ideas and a model example: 0 missing/incorrect mechanism; 1 partly correct with an important gap; 2 correct mechanism and evidence/limit. Do not demand a single model wording or use keyword matching as if it were reliable semantic grading.

### Written assessments

- Use 6–8 meaningful weekly items within 25 minutes: a small amount of recall, evidence interpretation, next-step reasoning and one short explanation. Do not expand item count at the expense of practical time.
- Replace implausible distractors and balance keys. Use plausible wrong scopes, DNS/cache interpretations, route priorities and permission boundaries. Randomized order alone does not fix weak questions.
- Create held-out midterm/final variants. The final explicitly revisits networking/Linux and samples Azure management, identity/storage/network, automation and incidents. It must not simply select the first question from each recent week.
- Objective items remain automatically graded with explanations after submission. Keep exact-match multi-select if clearly stated; alternatively change the scoring policy deliberately and document it. Do not silently pretend exact-match scores measure partial understanding.
- Free text, practical behavior and diagrams remain manually/self/peer assessed with evidence rubrics. No AI-grading capability is assumed or requested.

### Remediation and retakes

Allow practice quizzes freely and use the best finalized practice score as the current system does. Mark the formal practical attempt history separately. After a failed gate: identify the specific gap, complete one bounded corrective exercise, then retry an equivalent **different** task/fault. Do not use immediate repeated exposure to the same answer as proof of independence.

Use the next Wednesday's 15-minute remediation allocation and its evidence-check block; W12 and W24 have explicit retest capacity. If more time is necessary, displace optional enrichment or extend completion beyond the calendar. No silent ninth-hour homework requirement. Preserve both initial and current results; remove any artificial grade penalty that discourages honest remediation. Critical unsafe behavior requires remediation and a new safe execution, not just a written apology or bonus quiz points.

## 8. Staged capstone specification

### Project and scope

**Provision and operate a small Azure-hosted environment for an existing known web/API application**, using dummy data and Terraform. Reuse the student's application or a supplied tested workload; do not spend the program building a new frontend, database product or authentication framework. State application prerequisites and provide a ready baseline so infrastructure remains the assessed work.

Default to one managed web host (App Service is a sensible familiar baseline), one appropriate persistent store, a runtime managed identity and a bounded telemetry path. Use Key Vault only when a real secret requirement exists; demonstrate secret handling with dummy values separately if the workload is otherwise secretless. Do not invent a production secret merely to include another product. A second Container Apps host, AKS, a database server, private endpoint, NAT Gateway, Bastion or multi-region stack is not mandatory.

Appropriate networking does not require making every service private. A public HTTPS application with authenticated storage, well-explained network restrictions and scoped identity can be a valid small baseline. Prove actual subnet/NSG competency separately through G4; do not add an unused VNet to the capstone diagram to claim segmentation. Private connectivity is an extension only if its DNS, client path, service tier and cost are justified. [Compute selection][COMPUTE], [managed identity][APPIDENTITY], [private DNS][PRIVATEDNS]

### Milestones within existing weekly hours

| Stage                              | Week(s) | Required increment                                                                                          | Evidence / scope control                                                                       |
| ---------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| C1 — Requirements and safe account | W8      | Known workload, owner, subscription/group convention, data sensitivity, cost unknowns and core requirements | One-page contract and context inventory; no new app features                                   |
| C2 — Compute/network evidence      | W9–11   | Reproducible local/VM baseline, traffic matrix and connectivity runbook                                     | Actual scoped VM/network evidence, then teardown; save configuration/evidence, not running VMs |
| C3 — Data and workload identity    | W13–14  | Authenticated persistence, runtime identity, intended/denied operation and simple hosted app                | One sample survives process replacement; exact principal/role/scope and labeled secret path    |
| C4 — Operations                    | W15–16  | Working telemetry/query/notification, tested restore and cost reconciliation                                | Correlation ID, restore result/time/recovery point, short runbooks                             |
| C5 — Reproducible infrastructure   | W17–18  | Terraform parameters/outputs, small module, state/backend plan and reviewed lifecycle                       | Versioned code, lockfile, safe plan, no-op and benign drift test                               |
| C6 — Hardening                     | W19     | Threat review, priority fixes, scoped permission and exposure checks                                        | Before/after evidence and accepted risks, not an enormous security checklist                   |
| C7 — Delivery                      | W20     | Validated/approved OIDC pipeline, backend access and change/recovery decision                               | Invalid/untrusted run rejected; scoped approved run and exact commit/plan                      |
| C8 — Integration/final evidence    | W22–24  | Fresh investigation, recreate known environment, verify requirements and defend limits                      | Frozen release/evidence matrix, practical gate record, cleanup/billing review                  |

There is no implied permanently running environment between these stages. Recreate short-lived resources from retained definitions. If backend state storage or retained data must remain, inventory and price it separately, protect access and define its final disposition. Week 23 is integration/repair of known pieces, not the first implementation of every component.

### Required deliverables and objective checks

1. **Requirements/evidence matrix:** map each claim to an actual test or label it unexecuted. Define small availability/recovery objectives as targets, not guaranteed SLAs.
2. **Architecture and decisions:** client request flow, DNS/TLS, management/deployment path, runtime identity, persistence and observability. Diagram matches the implemented release; explain a rejected alternative.
3. **Terraform repository:** parameterized target/environment, pinned/reviewed dependencies, outputs, module contract, protected state and reproducible create/change/destroy instructions. A reviewed plan and a subsequent no-op are required.
4. **Permissions/bootstrap record:** distinguish the human access administrator, deployment workflow, backend identity and runtime identity. If Terraform creates role assignments, explicitly authorize that bootstrap step or use a separately controlled identity; do not assume Contributor can do it. Runtime may never administer its subscription for convenience. [RBAC][RBAC]
5. **Secure pipeline:** current OIDC trust conditions, minimum necessary workflow/Azure/backend permissions, validation/plan, approval control where supported and a recorded successful change. If repository-plan restrictions prevent a native approval feature, use a documented manual protected apply path and state what is not enforced by the platform. [OIDC][OIDC]
6. **Persistence/authorization tests:** an application replacement preserves the dummy sample; authorized data action works; an unauthorized identity/action is denied at the actual data boundary, not merely hidden by the UI.
7. **Observability/incident evidence:** collected Azure signal, working time-bounded query, correlation to one failed operation, cause, correction and verification. Notification executed or explicitly pending, never invented.
8. **Recovery/change evidence:** restore a known sample and verify contents, measured recovery point/time; return to a compatible application artifact or demonstrate a justified forward fix. A Terraform Git revert alone is not data restoration.
9. **Operational handoff:** short deployment, incident, restore and cleanup runbooks with expected observations and rollback limits; exact release/commit/tool versions.
10. **Costs/teardown:** dated estimate and assumptions, demo duration, reviewed before/after inventory, residual/retained resources and delayed cost reconciliation. Save evidence before deletion.

### Final practical rubric

| Criterion                                                |  Points | Full-credit behavior                                                                                   |
| -------------------------------------------------------- | ------: | ------------------------------------------------------------------------------------------------------ |
| Requirements, architecture and justified service choices |      10 | Diagram/decisions match actual requirements and release; limits explicit                               |
| Terraform and reproducible lifecycle                     |      25 | Parameterized stack, protected state/module, reviewed change/no-op and safe teardown                   |
| Identity, secrets and networking                         |      20 | Actual narrow principal/scope, required reachability and denied data test; bootstrap understood        |
| Secure deployment/change control                         |      15 | Scoped OIDC, correct backend access, rejected invalid/untrusted run and reviewed successful deployment |
| Observability and fresh diagnosis                        |      15 | Real signal/query, supported causal reasoning, minimal correction and verification                     |
| Data integrity and recovery                              |      10 | Preserved sample plus tested restore and measured objectives/limits                                    |
| Cost, cleanup and concise handoff                        |       5 | Inventory/cost reconciliation and usable runbooks/evidence index                                       |
| **Total**                                                | **100** | **At least 75 plus all critical gates; mastery checks remain separate**                                |

**Noncompensable final pass conditions:** actual authorized Azure execution for claimed Azure skills; no exposed active credentials or state in public artifacts; no unjustified broad runtime permissions; intended and denied data operations verified; intended network policy/G4 evidence; reviewed Terraform mutation and safe target; working telemetry/diagnosis; an integrity-checked restore; and accounted-for teardown/residual costs. A critical failure yields “pending remediation” regardless of total points. Absence of evidence is “not demonstrated,” not an automatic accusation of unsafe behavior.

A 15–20-minute defense should trace one request, justify one choice, explain one failure and recovery, identify the exact artifact and name one untested limit. Advanced extras do not compensate for failed core conditions. Optional extensions: a justified private endpoint with client-context DNS, a tested reusable module, a basic audit policy or an alternative managed container host. Exclude advanced AKS and complex regional disaster recovery from required credit.

## 9. Job-readiness analysis and resource validation

### Reasonable employment claims

**If the redesigned course and gates are actually completed**, a successful graduate could independently handle familiar, bounded tasks in a known Azure environment: inspect context/inventory; operate a simple Linux service; investigate DNS/ports/TLS and common permission failures; manage small resource groups and Blob/VNet configurations; make reviewed changes with a small Terraform module; inspect a plan/state boundary; query basic telemetry; produce concise incident/runbook evidence; and remove owned learning resources with cost awareness.

They should still expect review or supervision for production authorization changes, destructive/stateful Terraform actions, shared-backend recovery, production CI/CD trust changes, incident command, broad policy enforcement, security exceptions and restoring important customer data. Familiar-task L3 does not mean unsupervised permission to make any production change. Secure CI/CD, container hosting, recovery drills, automation and security reviews remain L2 unless separately demonstrated at greater depth.

Outside the course: enterprise landing zones, tenant migrations, identity licensing/SSPR operations at scale, complex hybrid routing/ExpressRoute, advanced firewalls, deep Kubernetes/AKS operations, multi-region database failover, organization-wide disaster recovery, large-scale SRE/capacity engineering and senior architecture/security judgment. Optional AZ-104 readiness requires its own objective-by-objective review. Completion is not a guarantee of certification, hiring or senior-level responsibility.

For a junior/associate interview, the credible portfolio is a repeatable environment and a few well-explained failures. The current course can produce useful notes and design explanations, but its existing checkmarks/weighted grade alone do not substantiate those employment claims.

### Resource validation method and results

All **29 unique existing URLs** were attempted through browsing during this audit. **27 returned readable page content; two did not** (Ubuntu server documentation returned HTTP 429; the YouTube watch page returned a cache-miss fetch failure). Reading a landing page does not mean completing its course, validating all outbound links or executing its commands. No new video IDs or runtimes were invented. Prices were not quoted because region/SKU/usage have not been selected.

The older `docs/RESOURCES.md` treats “found in search” and “opened” as one reviewed status. That is too coarse for the requested standard. The resource boolean also lacks reviewer/date/scope. Proposed statuses: **inspected content**, **landing page only**, **redirect/topic changed**, **fetch failed**, **execution untested**, with date and selected sections. Preserve the existing labels until a deliberate resource update; this audit does not change source flags.

| Existing resource (all from `src/curriculum/resources.ts`)                           | Audit result and relevance                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Azure architectural components][ARCH]                                               | Opened training module; appropriate selected fundamentals; not a full VM/Linux lab                                                                                                                                                                                   |
| [Linux Foundation introduction][LF]                                                  | Opened landing page; structured course, not a short documentation article; 60-hour whole-course workload must not be assigned inside a weekly reading slot                                                                                                           |
| [Docker getting started][DOCKER]                                                     | Opened official hub; select the app/image sections rather than ask this developer to repeat the full beginner track                                                                                                                                                  |
| [Linux VM overview][VM]                                                              | Old Linux URL redirects to general VM overview; relevant, but update display title/target after approval                                                                                                                                                             |
| [Cloudflare IP][IP]                                                                  | Opened networking explanation; suitable supplement, not a packet-lab replacement                                                                                                                                                                                     |
| [Cloudflare DNS][DNS]                                                                | Opened explanation; suitable resolution/records supplement                                                                                                                                                                                                           |
| [VNet overview][VNET]                                                                | Opened; use with current default-outbound and NSG references, not as a timeless promise about internet connectivity                                                                                                                                                  |
| [Ubuntu Server documentation](https://documentation.ubuntu.com/server/)              | Fetch failed with 429; do not call content verified in this audit. Supply an accessible local lesson and retry before making a particular page required                                                                                                              |
| [Cloud concepts path][FUND]                                                          | Opened; select relevant units; full paths are not automatic homework                                                                                                                                                                                                 |
| [Azure budgets][BUDGET]                                                              | Opened; supports notifications, delayed evaluation and no automatic consumption stop                                                                                                                                                                                 |
| [Well-Architected][WAF]                                                              | Opened framework; use a few review questions, not senior architecture expectations                                                                                                                                                                                   |
| [Existing Microsoft Learn YouTube link](https://www.youtube.com/watch?v=9dZK_d-nZp8) | Direct fetch failed; earlier search metadata is insufficient for current playback/content/embedding verification. Keep optional ordinary link only; verify manually before required use                                                                              |
| [RBAC][RBAC]                                                                         | Opened; relevant principal/role/scope/data-action foundation                                                                                                                                                                                                         |
| [Compute decision guide][COMPUTE]                                                    | Opened; supports bounded choice, not operational competence in every product                                                                                                                                                                                         |
| [Storage introduction][STORAGE]                                                      | Opened; useful interfaces overview; insufficient alone for data-role/recovery operations                                                                                                                                                                             |
| [Existing Entra link](https://learn.microsoft.com/en-us/entra/fundamentals/whatis)   | Redirected to **Microsoft Entra product family**, broader than the displayed “What is Microsoft Entra ID?” label. Prefer selected inspected units from [Understand Microsoft Entra ID][ENTRAMODULE]; its full advanced prerequisites/licensing scope are not assumed |
| [Azure Monitor][MONITOR]                                                             | Opened; overview is relevant but must be paired with the authored ingestion/query lab                                                                                                                                                                                |
| [Policy][POLICY]                                                                     | Opened; relevant audit/deny distinction, not proof of implementation                                                                                                                                                                                                 |
| [NSGs][NSG]                                                                          | Opened successfully in this audit, including default inbound rule; prior timeout is not a permanent broken-link finding                                                                                                                                              |
| [Private endpoint][PRIVATE]                                                          | Opened; pair with client-context DNS and a real or explicitly simulated path                                                                                                                                                                                         |
| [Backup][BACKUP]                                                                     | Opened; distinguishes data restoration from broader disaster recovery; no guarantee a paid vault exercise fits the student's budget                                                                                                                                  |
| [Key Vault][VAULT]                                                                   | Opened; teach identity/network/data-plane and secret lifecycle together                                                                                                                                                                                              |
| [Azure CLI][CLI]                                                                     | Opened; current view redirect works; assign before first command use                                                                                                                                                                                                 |
| [Azure PowerShell][PS]                                                               | Opened hub; useful secondary object-pipeline literacy, not a second scripting curriculum                                                                                                                                                                             |
| [Terraform Azure build tutorial][TFBUILD]                                            | Opened; complete resource-group starting point. Applying one RG is foundational, not a full network/compute module                                                                                                                                                   |
| [Bicep overview][BICEP]                                                              | Opened; literacy supplement while Terraform remains the implemented course language                                                                                                                                                                                  |
| [Kubernetes basics][K8S]                                                             | Opened index and selected scope; linked full series exceeds required AKS awareness. Select local workload/Service diagnostics                                                                                                                                        |
| [GitHub Actions][ACTIONS]                                                            | Old path redirects to current getting-started page; relevant baseline, mostly prior knowledge for this student                                                                                                                                                       |
| [GitHub Azure OIDC][OIDC]                                                            | Opened; includes current newer-repository subject-claim caveat. Requires inspected trust configuration, not a memorized legacy `sub`                                                                                                                                 |

Additional inspected benchmarks: the [AZ-104 guide][AZ104], [administrator course][ADMIN], all five learning-path landing pages ([identity][IDPATH], [storage][STOREPATH], [compute][COMPUTEPATH], [network][NETPATH], [monitor/backup][MONPATH]), [security guidance][SECURITY], [pricing calculator][PRICE], [systemd service manual][SYSTEMD], [Terraform sensitive data][TFSECRET], [remote state][TFREMOTE], [module development][TFMODULE], [drift tutorial][TFDRIFT], [private DNS][PRIVATEDNS], [default outbound][EGRESS], [VNet FAQ][VNETFAQ], [Network Watcher][WATCHER], [Blob soft delete][SOFTDELETE], [App Service identity][APPIDENTITY], [ACR][ACR] and [Container Apps][ACA].

Attempts to retrieve the GNU Bash full/manual-index pages timed out. Do not call them inspected; retain them only as references requiring recheck. The official systemd manual and Linux Foundation source were available. The website currently links videos rather than embedding them, so no embedding permission/playback claim is made. Some Microsoft pages included an authorization notice while also returning the article body; conclusions here use the readable public content, not presumed access to gated exercises.

## 10. Prioritized remediation backlog and approval boundary

Effort below refers to author/reviewer work, **not extra student hours**. The schedule must stay at 192 hours by replacing weak tasks. Exact implementation effort depends on fixture testing, Azure access and supported environments.

| Priority / deadline                   | Required change                                                                                                                   | Affected sources                                                                                                        | Acceptance before release                                                                                                                |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| P0 — before first class               | Developer-specific Week 1 diagnostic, known-app diagram task, independent port/process variant and criterion-specific feedback    | `foundations.ts` W1; `walkthroughs.ts`; `reader.ts` instructional timing                                                | Student can start without Python-install detour; 180/180/120 plan; baseline gaps recorded; no early L3 claim                             |
| P0 — before first class               | Bound external reading and explain local/self-assessed evidence limits                                                            | `resources.ts`; `reader.ts`; `README.md`                                                                                | Exact selected reading/stop point; no implied 60-hour homework course; no “completion = competence” claim                                |
| P0 — before affected first assessment | Repair answer-position pattern and replace weak distractors; draft independent gate rubric                                        | all question banks; `index.ts`; `reader.ts`                                                                             | Mixed plausible keys, scenario evidence and no answers shown before the first attempt; grading policy explicit                           |
| P1 — before W2–6                      | Author network fault pack, subnet derivation and supported Linux/service/SSH fixtures; consolidate introductory VM/Linux material | `foundations.ts`; `walkthroughs.ts`; new instructional fixture assets after approval                                    | Known-good/fault dry run; fresh B/C variation; core G1/G2 checks; no host/corporate network changes                                      |
| P1 — before W8                        | Move context/CLI/access/cost instruction earlier; state exact prerequisite artifacts rather than “all earlier weeks”              | `academic.ts` module metadata; `azure.ts`; `engineering.ts`; `reader.ts`                                                | A dependency map and preflight exist before any cloud mutation; authorized bootstrap route                                               |
| P1 — before W9–11                     | Replace paper-only Azure core labs; fix segmentation/default-rule teaching and administration/outbound assumptions                | `azure.ts`; `lab-guides.ts`; `walkthroughs.ts`                                                                          | Live bounded VM/network evidence or honestly pending cloud gate; intended and denied flows observed                                      |
| P1 — before W12                       | Replace design-only midterm and recycled exam selection with held-out operational assessment                                      | `azure.ts` W12; `index.ts`; relevant fixtures                                                                           | Fresh Linux/network/scoped-Azure tasks, independent scoring, remediation capacity                                                        |
| P1 — before W13–16                    | Complete Blob identity/recovery, managed-host identity and actual telemetry/restore labs                                          | `azure.ts`; `engineering.ts` monitoring content; `lab-guides.ts`                                                        | Data denial and restoration proven; collection/query/alert path observed; local fallback limitations recorded                            |
| P1 — before W17–20                    | Split Terraform into lifecycle/state/modules; make Terraform required implementation; implement narrow OIDC/backend/approval lab  | `engineering.ts`; `lab-guides.ts`; question/rubric assembly                                                             | Reviewed apply/change/no-op/destroy; drift variant; no secret/state leakage; authorized and rejected pipeline cases                      |
| P1 — before module completion claims  | Add practical mastery record and critical pass conditions alongside weighted grades                                               | `types.ts` if extending assessment metadata; `store.ts`; `grades.ts`; gradebook/reader instructional rules; `README.md` | Missing versus failed versus guided versus independent distinguishable; backup/version migration designed before changing stored records |
| P1 — before capstone work begins      | Publish staged capstone C1–C8, Terraform requirement and noncompensable security/execution gates                                  | `capstone.ts`; W8–24 assignments; `index.ts` practical rubric                                                           | Work starts W8, no new application project, no one-Sunday from-scratch stack/pipeline demand                                             |
| P2 — before W21–24                    | Separate Azure container hosting from local Kubernetes literacy; new integrated/final fault variants                              | `engineering.ts`; `lab-guides.ts`; `index.ts`                                                                           | Existing Docker skill respected; no paid AKS build; final samples Semester 1 and 2                                                       |
| P2 — important maintenance            | Date/scope resource reviews; correct Entra/VM/Actions redirects, course types and video status                                    | `resources.ts`; `docs/RESOURCES.md`; authoring guidance                                                                 | “Inspected” means opened content; failed resources remain labeled; no invented runtimes/embedding guarantees                             |
| P2 — important quality improvement    | Replace one-size rubrics/prerequisites/time text with specific evidence criteria and short model packets                          | `reader.ts`; `index.ts`; all content sources                                                                            | Gradeable outcomes, different assessment modes and feasible reading/practice timings                                                     |
| P3 — optional enrichment              | More Bicep, Files identity, Azure Backup/ASR, load-balancer operations, private endpoint build or AZ-104 gap study                | future optional content, separate from required 192 hours                                                               | Added only after core gates, with explicit extra hours/costs; no extra clouds/advanced Kubernetes requirement                            |

### Implementation cautions for an approved redesign

Reordering content changes the educational meaning of persisted IDs such as `14-lab` and question indices. Do not move lessons and silently retain old completion/attempt scores as if they assessed the new material. Preserve a backup, version the curriculum/assessment mapping and either migrate exact-equivalent evidence or mark the revised competency pending. This is necessary academic-record integrity, not a general code refactor request.

No app code, syllabus, lessons, questions, grading rules or resource flags were modified for this audit. This document is the reviewable deliverable. **Approval is required before implementing the recommended redesign because the user explicitly requested audit-first execution.**

### Source references

The following links resolve the reference labels used next to claims, resources and proposed activities throughout this report. They are not a recommendation to complete every linked course or documentation tree.

[AZ104]: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104
[ADMIN]: https://learn.microsoft.com/en-us/training/courses/az-104t00
[IDPATH]: https://learn.microsoft.com/en-us/training/paths/az-104-manage-identities-governance/
[STOREPATH]: https://learn.microsoft.com/en-us/training/paths/az-104-manage-storage/
[COMPUTEPATH]: https://learn.microsoft.com/en-us/training/paths/az-104-manage-compute-resources/
[NETPATH]: https://learn.microsoft.com/en-us/training/paths/az-104-manage-virtual-networks/
[MONPATH]: https://learn.microsoft.com/en-us/training/paths/az-104-monitor-backup-resources/
[WAF]: https://learn.microsoft.com/en-us/azure/well-architected/
[FUND]: https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/
[ARCH]: https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/
[LF]: https://training.linuxfoundation.org/training/introduction-to-linux/
[SYSTEMD]: https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html
[IP]: https://www.cloudflare.com/learning/network-layer/internet-protocol/
[DNS]: https://www.cloudflare.com/learning/dns/what-is-dns/
[VNET]: https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview
[VNETFAQ]: https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq
[NSG]: https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview
[EGRESS]: https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/default-outbound-access
[PRIVATE]: https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview
[PRIVATEDNS]: https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns
[WATCHER]: https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-overview
[VM]: https://learn.microsoft.com/en-us/azure/virtual-machines/overview
[COMPUTE]: https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree
[STORAGE]: https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction
[SOFTDELETE]: https://learn.microsoft.com/en-us/azure/storage/blobs/soft-delete-blob-overview
[RBAC]: https://learn.microsoft.com/en-us/azure/role-based-access-control/overview
[ENTRAMODULE]: https://learn.microsoft.com/en-us/training/modules/understand-azure-active-directory/
[POLICY]: https://learn.microsoft.com/en-us/azure/governance/policy/overview
[VAULT]: https://learn.microsoft.com/en-us/azure/key-vault/general/basic-concepts
[MONITOR]: https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview
[BACKUP]: https://learn.microsoft.com/en-us/azure/backup/backup-overview
[CLI]: https://learn.microsoft.com/en-us/cli/azure/get-started-with-azure-cli
[PS]: https://learn.microsoft.com/en-us/powershell/azure/
[TFBUILD]: https://developer.hashicorp.com/terraform/tutorials/azure-get-started/azure-build
[TFSECRET]: https://developer.hashicorp.com/terraform/language/manage-sensitive-data
[TFREMOTE]: https://developer.hashicorp.com/terraform/language/state/remote
[TFMODULE]: https://developer.hashicorp.com/terraform/language/modules/develop
[TFDRIFT]: https://developer.hashicorp.com/terraform/tutorials/state/resource-drift
[BICEP]: https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview
[DOCKER]: https://docs.docker.com/get-started/
[K8S]: https://kubernetes.io/docs/tutorials/kubernetes-basics/
[ACTIONS]: https://docs.github.com/en/actions/get-started/understand-github-actions
[OIDC]: https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-azure
[SECURITY]: https://learn.microsoft.com/en-us/azure/security/fundamentals/best-practices-and-patterns
[PRICE]: https://azure.microsoft.com/en-us/pricing/calculator/
[BUDGET]: https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets
[APPIDENTITY]: https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity
[ACR]: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro
[ACA]: https://learn.microsoft.com/en-us/azure/container-apps/overview

import { intro, esc, lessonUrl } from '../ui';
const stages = [
  ['C1', '8', 'Known workload, requirements, scoped account and cost unknowns.'],
  [
    'C2',
    '9–11',
    'Tested compute/network evidence and connectivity runbook; remove temporary infrastructure.',
  ],
  ['C3', '13–14', 'Authenticated persistence, managed runtime identity and hosted known app.'],
  ['C4', '15–16', 'Actual telemetry/query, integrity-checked restore and cost reconciliation.'],
  ['C5', '17–18', 'Terraform lifecycle, small module, protected state and benign drift.'],
  ['C6', '19', 'Hardening review, verified denied operations and accepted risks.'],
  ['C7', '20', 'Scoped OIDC infrastructure pipeline, protected backend and reviewed change.'],
  ['C8', '22–24', 'Fresh investigation, integration, release defense and teardown evidence.'],
];
export function capstone() {
  return `${intro('APPROVED STAGED PROJECT · IMPLEMENTATION PLANNED', 'A cumulative project, not a one-week build.', 'The audit’s staged capstone is the baseline. Only Week 1 learning material is implemented in Stage 1; executable capstone instructions and gates will be authored in later batches.')}<article class="lesson-prose"><h2>Use an existing workload</h2><p>Operate a familiar small web/API application on Azure. Do not spend the course building a complex new frontend or backend. Terraform is the assessed provisioning language; Bicep/ARM is literacy. Prefer one managed host, persistent data, scoped runtime/deployment identities and a bounded telemetry path. Private endpoints and AKS are not mandatory products.</p><h2>Milestones within scheduled classes</h2><table><thead><tr><th>Stage</th><th>Week</th><th>Evidence increment</th></tr></thead><tbody>${stages.map(([id, week, description]) => `<tr><td>${id}</td><td>${week}</td><td>${esc(description)}</td></tr>`).join('')}</tbody></table><h2>Noncompensable conditions</h2><p>Actual Azure evidence for Azure claims; reviewed Terraform mutation and safe targets; scoped identities and no exposed active credentials/state; intended and denied data operations; useful telemetry and diagnosis; integrity-checked restoration; and accounted-for costs/cleanup. A high quiz average cannot offset a failed critical condition. The complete mastery-gate implementation is planned, not claimed to exist in this release.</p><h2>Cost and execution limits</h2><p>Use short reviewed deployment windows and retain code/evidence rather than permanently running paid infrastructure. Budgets alert and can lag; they do not cap consumption. Local simulations must be labeled and leave the corresponding live-cloud competence pending.</p><a class="button primary" href="#/syllabus">Full revised syllabus</a> <a class="button quiet" href="${lessonUrl(1, 'lecture')}">Ready Week 1</a></article>`;
}

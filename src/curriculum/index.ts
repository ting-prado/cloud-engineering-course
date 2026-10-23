import type { Question } from './types';
import { baseline } from './baseline';
import { week1, diagnosticQuestions } from './week-01';
export { CURRICULUM_ID, ASSESSMENT_VERSION } from './baseline';
export const weeks = baseline.map((w) => (w.number === 1 ? week1 : w));
export function questionsFor(week: number, exam = false): Question[] {
  return weeks[week - 1]?.status === 'ready' && !exam ? weeks[week - 1].questions : [];
}
export function questionsForAssessment(id: string): Question[] {
  if (id === '1-diagnostic') return diagnosticQuestions;
  return id === '1-quiz' ? questionsFor(1) : [];
}
export const labRubric = [
  {
    name: 'Correct implementation',
    points: 40,
    description: 'All required tasks work as specified, with reproducible configuration.',
  },
  {
    name: 'Validation & evidence',
    points: 25,
    description: 'Expected outcomes and failure cases are tested and explained.',
  },
  {
    name: 'Technical reasoning',
    points: 20,
    description: 'Choices, limitations and troubleshooting are technically justified.',
  },
  {
    name: 'Safety & cleanup',
    points: 15,
    description: 'Least privilege, secret handling, scoped cleanup and cost awareness are demonstrated.',
  },
];
export const assignmentRubric = [
  { name: 'Technical accuracy', points: 40, description: 'Mechanisms and terminology are correct.' },
  { name: 'Completeness', points: 30, description: 'Every required deliverable and question is addressed.' },
  {
    name: 'Evidence & clarity',
    points: 30,
    description: 'Evidence is sanitized, organized and understandable to another engineer.',
  },
];
export const practicalRubric = [
  {
    name: 'Architecture & tradeoffs',
    points: 20,
    description: 'Requirements, failure boundaries, service decisions and diagrams agree.',
  },
  {
    name: 'Reproducibility & automation',
    points: 20,
    description: 'Versioned configuration and a reviewed deployment process can recreate the environment.',
  },
  {
    name: 'Identity & security',
    points: 20,
    description: 'Least privilege, secret lifecycle and denied-access tests are demonstrated.',
  },
  {
    name: 'Operations & recovery',
    points: 25,
    description: 'Useful telemetry, diagnosis, rollback and tested restoration meet stated objectives.',
  },
  {
    name: 'Cost, documentation & defense',
    points: 15,
    description: 'Dated estimates, cleanup evidence, limitations and a clear technical handoff.',
  },
];

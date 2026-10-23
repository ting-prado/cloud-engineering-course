import { foundations } from './foundations';
import { azure } from './azure';
import { engineering } from './engineering';
import type { Question } from './types';
import { walkthroughs, labCommands } from './walkthroughs';
import { labGuides } from './lab-guides';
export const weeks = [...foundations, ...azure, ...engineering].map((w) => ({
  ...w,
  sections: walkthroughs[w.number] ? [...w.sections, walkthroughs[w.number]] : w.sections,
  lab: {
    ...w.lab,
    ...(labCommands[w.number] ? { code: labCommands[w.number].code } : {}),
    guide: labGuides[w.number],
  },
}));
export function questionsFor(week: number, exam = false): Question[] {
  if (!exam) return weeks[week - 1].questions;
  const range = week === 12 ? weeks.slice(0, 12) : weeks.slice(12, 24);
  return [
    ...range.map((w) => w.questions[0]),
    ...range.filter((_, i) => i % 3 === 0).map((w) => w.questions[1]),
    ...range.filter((_, i) => i % 4 === 0).map((w) => w.questions[3]),
  ];
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

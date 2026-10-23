// Frozen original curriculum: historical answer indices must never use redesigned questions.
import { foundations } from './foundations';
import { azure } from './azure';
import { engineering } from './engineering';
import { walkthroughs, labCommands } from './walkthroughs';
import { labGuides } from './lab-guides';
import type { Question } from './types';
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

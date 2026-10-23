import type { Question, Week } from './types';
export const single = (
  prompt: string,
  options: string[],
  correct: number,
  explanation: string,
): Question => ({ prompt, options, answer: [correct], explanation, type: 'single' });
export const multiple = (
  prompt: string,
  options: string[],
  correct: number[],
  explanation: string,
): Question => ({ prompt, options, answer: correct, explanation, type: 'multiple' });
export const bool = (prompt: string, correct: boolean, explanation: string): Question => ({
  prompt,
  options: ['True', 'False'],
  answer: [correct ? 0 : 1],
  explanation,
  type: 'boolean',
});
export const short = (prompt: string, model: string): Question => ({
  prompt,
  answer: [],
  explanation: model,
  type: 'short',
});
export function defineWeek(week: Week): Week {
  return week;
}

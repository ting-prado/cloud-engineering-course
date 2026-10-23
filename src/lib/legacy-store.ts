import { allSessions } from './academic';
import { weeks, questionsFor } from '../curriculum/legacy';
import type { Question } from '../curriculum/types';
export interface Attempt {
  id: string;
  quiz: string;
  date: string;
  answers: Record<string, number[] | string>;
  earned: number;
  possible: number;
  shortScores: Record<string, number>;
}
export interface Submission {
  text: string;
  date: string;
}
export interface StudentData {
  version: 1;
  completed: string[];
  notes: Record<string, string>;
  submissions: Record<string, Submission>;
  grades: Record<string, number>;
  attempts: Attempt[];
  theme: 'light' | 'dark';
  calendarMonth: string;
  drafts: Record<string, Record<string, number[] | string>>;
}
export const STORAGE_KEY = 'cloud-academy-v1';
export function emptyData(): StudentData {
  return {
    version: 1,
    completed: [],
    notes: {},
    submissions: {},
    grades: {},
    attempts: [],
    theme: 'light',
    calendarMonth: '2026-10',
    drafts: {},
  };
}
const plain = (value: unknown): value is Record<string, unknown> =>
  !!value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;
const safeKeys = (v: Record<string, unknown>) =>
  Object.keys(v).every((k) => !['__proto__', 'constructor', 'prototype'].includes(k));
export const quizKey = (week: number) => `${week}-${week === 12 || week === 24 ? 'exam' : 'quiz'}`;
export function parseBackup(input: string): StudentData {
  if (input.length > 10_000_000) throw new Error('Backup exceeds the 10 MB limit.');
  const v: unknown = JSON.parse(input);
  if (!plain(v) || !safeKeys(v) || v.version !== 1)
    throw new Error('Unsupported backup format. Expected academy version 1.');
  const ids = new Set(allSessions().map((s) => s.id));
  if (!Array.isArray(v.completed) || !v.completed.every((x) => typeof x === 'string' && ids.has(x)))
    throw new Error('Invalid completion records.');
  for (const field of ['notes', 'submissions', 'grades', 'drafts'])
    if (!plain(v[field]) || !safeKeys(v[field])) throw new Error(`Invalid ${field} records.`);
  if (
    !Object.entries(v.notes as Record<string, unknown>).every(([k, x]) => ids.has(k) && typeof x === 'string')
  )
    throw new Error('Invalid notes.');
  const assessmentIds = new Set(
    weeks.flatMap((w) => [
      `${w.number}-lab`,
      `${w.number}-assignment`,
      ...([12, 24].includes(w.number) ? [`${w.number}-practical`] : []),
    ]),
  );
  if (
    !Object.entries(v.grades as Record<string, unknown>).every(
      ([k, x]) => assessmentIds.has(k) && typeof x === 'number' && Number.isFinite(x) && x >= 0 && x <= 100,
    )
  )
    throw new Error('Grades must be valid assessment scores from 0 to 100.');
  if (
    !Object.entries(v.submissions as Record<string, unknown>).every(
      ([k, x]) =>
        assessmentIds.has(k) &&
        plain(x) &&
        typeof x.text === 'string' &&
        typeof x.date === 'string' &&
        Number.isFinite(Date.parse(x.date)),
    )
  )
    throw new Error('Invalid submissions.');
  const validQuiz = new Set(weeks.map((w) => quizKey(w.number)));
  const validAnswers = (x: unknown) =>
    plain(x) &&
    safeKeys(x) &&
    Object.entries(x).every(
      ([k, a]) =>
        /^\d+$/.test(k) &&
        (typeof a === 'string' ||
          (Array.isArray(a) && a.every((n) => Number.isInteger(n) && n >= 0 && n < 20))),
    );
  if (
    !Object.entries(v.drafts as Record<string, unknown>).every(
      ([k, x]) => validQuiz.has(k) && validAnswers(x),
    )
  )
    throw new Error('Invalid quiz drafts.');
  if (
    !Array.isArray(v.attempts) ||
    !v.attempts.every(
      (a) =>
        plain(a) &&
        typeof a.id === 'string' &&
        typeof a.quiz === 'string' &&
        validQuiz.has(a.quiz) &&
        typeof a.date === 'string' &&
        Number.isFinite(Date.parse(a.date)) &&
        validAnswers(a.answers) &&
        typeof a.earned === 'number' &&
        typeof a.possible === 'number' &&
        Number.isFinite(a.earned) &&
        Number.isFinite(a.possible) &&
        a.earned >= 0 &&
        a.possible > 0 &&
        a.earned <= a.possible &&
        plain(a.shortScores) &&
        safeKeys(a.shortScores) &&
        Object.entries(a.shortScores).every(
          ([k, n]) => /^\d+$/.test(k) && typeof n === 'number' && [0, 1, 2].includes(n),
        ),
    )
  )
    throw new Error('Invalid quiz attempts.');
  // Recalculate objective points: imported score totals are never trusted.
  const result = v as unknown as StudentData;
  for (const a of result.attempts) {
    const n = Number(a.quiz.split('-')[0]);
    const qs = questionsFor(n, n === 12 || n === 24);
    const scored = objectiveScore(qs, a.answers);
    a.earned = scored.earned;
    a.possible = scored.possible;
    if (!Object.keys(a.shortScores).every((k) => qs[Number(k)]?.type === 'short'))
      throw new Error('Invalid short-answer score.');
  }
  if (!['light', 'dark'].includes(result.theme) || !/^\d{4}-(0[1-9]|1[0-2])$/.test(result.calendarMonth))
    throw new Error('Invalid display preferences.');
  return { ...emptyData(), ...result, completed: [...new Set(result.completed)] };
}
export function objectiveScore(qs: Question[], answers: Attempt['answers']) {
  let earned = 0,
    possible = 0;
  qs.forEach((q, i) => {
    if (q.type === 'short') return;
    possible++;
    const a = answers[i];
    if (
      Array.isArray(a) &&
      a.length === q.answer.length &&
      [...new Set(a)].length === a.length &&
      q.answer.every((n) => a.includes(n))
    )
      earned++;
  });
  return { earned, possible };
}
export function attemptScore(a: Attempt): number | null {
  const n = Number(a.quiz.split('-')[0]);
  const qs = questionsFor(n, n === 12 || n === 24);
  const shorts = qs.map((q, i) => (q.type === 'short' ? i : -1)).filter((i) => i >= 0);
  if (shorts.some((i) => a.shortScores[i] === undefined)) return null;
  return (
    (100 * (a.earned + shorts.reduce((sum, i) => sum + a.shortScores[i] / 2, 0))) /
    (a.possible + shorts.length)
  );
}

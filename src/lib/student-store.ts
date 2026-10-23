import { allSessions } from './academic';
import { weeks, questionsForAssessment, CURRICULUM_ID, ASSESSMENT_VERSION } from '../curriculum';
import { parseBackup as parseLegacyBackup } from './legacy-store';
import type { Question } from '../curriculum/types';
export interface Attempt {
  id: string;
  quiz: string;
  assessmentVersion: string;
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
export interface Archive {
  id: string;
  date: string;
  curriculumId: string;
  schema: 1 | 2;
  raw: string;
}
export interface StudentData {
  version: 2;
  curriculumId: string;
  completed: string[];
  notes: Record<string, string>;
  submissions: Record<string, Submission>;
  grades: Record<string, number>;
  attempts: Attempt[];
  theme: 'light' | 'dark';
  calendarMonth: string;
  drafts: Record<string, Record<string, number[] | string>>;
  archives: Archive[];
}
export const STORAGE_KEY = 'cloud-academy-v2';
export const LEGACY_KEY = 'cloud-academy-v1';
export const LEGACY_BACKUP_PREFIX = 'cloud-academy-archive-before-r2-';
export const quizKey = (week: number) => `${week}-${week === 12 || week === 24 ? 'exam' : 'quiz'}`;
export function emptyData(): StudentData {
  return {
    version: 2,
    curriculumId: CURRICULUM_ID,
    completed: [],
    notes: {},
    submissions: {},
    grades: {},
    attempts: [],
    theme: 'light',
    calendarMonth: '2026-10',
    drafts: {},
    archives: [],
  };
}
const plain = (v: unknown): v is Record<string, unknown> =>
  !!v &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  Object.getPrototypeOf(v) === Object.prototype &&
  Object.keys(v).every((k) => !['__proto__', 'prototype', 'constructor'].includes(k));
const validDate = (v: unknown): v is string => typeof v === 'string' && Number.isFinite(Date.parse(v));
const records = (v: unknown, test: (key: string, value: unknown) => boolean) =>
  plain(v) && Object.entries(v).every(([k, x]) => test(k, x));
const availableIds = () =>
  new Set(
    allSessions()
      .filter((s) => weeks[s.week - 1].status === 'ready')
      .map((s) => s.id),
  );
const gradeIds = () =>
  new Set(
    weeks
      .filter((w) => w.status === 'ready')
      .flatMap((w) => [
        `${w.number}-lab`,
        `${w.number}-assignment`,
        ...([12, 24].includes(w.number) ? [`${w.number}-practical`] : []),
      ]),
  );
function validateAnswers(v: unknown, qs: Question[]) {
  return records(v, (key, value) => {
    const q = qs[Number(key)];
    if (!/^\d+$/.test(key) || !q) return false;
    if (q.type === 'short') return typeof value === 'string' && value.length <= 50000;
    return (
      Array.isArray(value) &&
      new Set(value).size === value.length &&
      value.every((n) => Number.isInteger(n) && n >= 0 && n < (q.options?.length || 0))
    );
  });
}
function archive(raw: string, schema: 1 | 2): Archive {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    schema,
    curriculumId: schema === 1 ? 'legacy-v1' : CURRICULUM_ID,
    raw,
  };
}
function legacyToCurrent(raw: string): StudentData {
  const legacy = parseLegacyBackup(raw);
  return {
    ...emptyData(),
    theme: legacy.theme,
    calendarMonth: legacy.calendarMonth,
    archives: [archive(raw, 1)],
  };
}
export function parseBackup(input: string, allowArchives = true): StudentData {
  if (input.length > 25_000_000) throw new Error('Backup exceeds the 25 MB limit.');
  const value: unknown = JSON.parse(input);
  if (!plain(value)) throw new Error('Invalid academy backup.');
  if (value.version === 1) {
    if (!allowArchives) throw new Error('Nested legacy records are not allowed.');
    return legacyToCurrent(input);
  }
  if (value.version !== 2 || value.curriculumId !== CURRICULUM_ID)
    throw new Error('Unsupported backup or curriculum version.');
  const ids = availableIds(),
    grades = gradeIds();
  if (!Array.isArray(value.completed) || !value.completed.every((x) => typeof x === 'string' && ids.has(x)))
    throw new Error('Invalid or planned lesson completion.');
  if (!records(value.notes, (k, v) => ids.has(k) && typeof v === 'string'))
    throw new Error('Invalid lesson notes.');
  if (
    !records(
      value.grades,
      (k, v) => grades.has(k) && typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100,
    )
  )
    throw new Error('Grades must target ready assessments and be from 0 to 100.');
  if (
    !records(
      value.submissions,
      (k, v) => grades.has(k) && plain(v) && typeof v.text === 'string' && validDate(v.date),
    )
  )
    throw new Error('Invalid submissions.');
  if (
    !records(
      value.drafts,
      (k, v) => questionsForAssessment(k).length > 0 && validateAnswers(v, questionsForAssessment(k)),
    )
  )
    throw new Error('Invalid assessment drafts.');
  if (!Array.isArray(value.attempts)) throw new Error('Invalid attempts.');
  for (const a of value.attempts) {
    if (
      !plain(a) ||
      typeof a.id !== 'string' ||
      !/^[\w-]{1,100}$/.test(a.id) ||
      typeof a.quiz !== 'string' ||
      a.assessmentVersion !== ASSESSMENT_VERSION ||
      !validDate(a.date)
    )
      throw new Error('Invalid assessment identity or version.');
    const qs = questionsForAssessment(a.quiz);
    if (
      !qs.length ||
      !validateAnswers(a.answers, qs) ||
      !records(a.shortScores, (k, n) => qs[Number(k)]?.type === 'short' && [0, 1, 2].includes(n as number))
    )
      throw new Error('Invalid assessment answers or manual scores.');
    const score = objectiveScore(qs, a.answers as Attempt['answers']);
    a.earned = score.earned;
    a.possible = score.possible;
  }
  if (new Set(value.attempts.map((a) => a.id)).size !== value.attempts.length)
    throw new Error('Duplicate attempt identifiers.');
  if (
    !['light', 'dark'].includes(String(value.theme)) ||
    typeof value.calendarMonth !== 'string' ||
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(value.calendarMonth)
  )
    throw new Error('Invalid display preferences.');
  if (!Array.isArray(value.archives) || (!allowArchives && value.archives.length))
    throw new Error('Invalid archive collection.');
  for (const a of value.archives) {
    if (
      !plain(a) ||
      typeof a.id !== 'string' ||
      !/^[\w-]{1,100}$/.test(a.id) ||
      !validDate(a.date) ||
      typeof a.raw !== 'string' ||
      ![1, 2].includes(a.schema as number)
    )
      throw new Error('Invalid archived record.');
    if (a.schema === 1) {
      parseLegacyBackup(a.raw);
      if (a.curriculumId !== 'legacy-v1') throw new Error('Incorrect legacy curriculum label.');
    } else {
      parseBackup(a.raw, false);
      if (a.curriculumId !== CURRICULUM_ID) throw new Error('Incorrect archived curriculum label.');
    }
  }
  if (new Set(value.archives.map((a) => a.id)).size !== value.archives.length)
    throw new Error('Duplicate archive identifiers.');
  return { ...value, completed: [...new Set(value.completed)] } as unknown as StudentData;
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
      new Set(a).size === a.length &&
      a.length === q.answer.length &&
      q.answer.every((n) => a.includes(n))
    )
      earned++;
  });
  return { earned, possible };
}
export function attemptScore(a: Attempt): number | null {
  if (a.quiz.endsWith('-diagnostic') || a.assessmentVersion !== ASSESSMENT_VERSION) return null;
  const qs = questionsForAssessment(a.quiz);
  if (!qs.length) return null;
  const shorts = qs.flatMap((q, i) => (q.type === 'short' ? [i] : []));
  if (shorts.some((i) => a.shortScores[i] === undefined)) return null;
  const score = objectiveScore(qs, a.answers);
  return (
    (100 * (score.earned + shorts.reduce((n, i) => n + a.shortScores[i] / 2, 0))) /
    (score.possible + shorts.length)
  );
}
export function initializeData(storage: Pick<Storage, 'getItem' | 'setItem'>) {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current) return { record: parseBackup(current), issue: '', blocked: false };
    const raw = storage.getItem(LEGACY_KEY);
    if (!raw) return { record: emptyData(), issue: '', blocked: false };
    const record = legacyToCurrent(raw);
    // A separate verified backup is written BEFORE activating redesigned progress.
    const backupKey = LEGACY_BACKUP_PREFIX + record.archives[0].id;
    storage.setItem(backupKey, raw);
    if (storage.getItem(backupKey) !== raw) throw new Error('Historical backup verification failed.');
    storage.setItem(STORAGE_KEY, JSON.stringify(record));
    return { record, issue: '', blocked: false };
  } catch (e) {
    return {
      record: emptyData(),
      issue:
        'Progress could not be safely loaded or archived. Existing browser records were left intact. Do not clear site data. ' +
        String(e),
      blocked: true,
    };
  }
}
const initial =
  typeof localStorage === 'undefined'
    ? { record: emptyData(), issue: '', blocked: false }
    : initializeData(localStorage);
export let data: StudentData = initial.record;
export let storageIssue = initial.issue;
const writeBlocked = initial.blocked;
export function saveData() {
  if (writeBlocked) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    storageIssue = '';
    return true;
  } catch {
    storageIssue =
      'Browser storage is unavailable or full. Export your data; changes are held only in this tab.';
    return false;
  }
}
export function replaceData(next: StudentData) {
  if (writeBlocked) return false;
  const prior = [...data.archives];
  if (
    data.completed.length ||
    data.attempts.length ||
    Object.keys(data.notes).length ||
    Object.keys(data.submissions).length ||
    Object.keys(data.grades).length ||
    Object.keys(data.drafts).length
  )
    prior.push(archive(JSON.stringify({ ...data, archives: [] }), 2));
  const archives = [...next.archives, ...prior]
    .filter((a, i, all) => all.findIndex((x) => x.raw === a.raw && x.schema === a.schema) === i)
    .map((a) => ({ ...a }));
  const seenIds = new Set<string>();
  for (const entry of archives) {
    if (seenIds.has(entry.id)) entry.id = crypto.randomUUID();
    seenIds.add(entry.id);
  }
  try {
    const replacement = parseBackup(JSON.stringify({ ...next, archives }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(replacement));
    data = replacement;
    storageIssue = '';
    return true;
  } catch {
    storageIssue = 'Restore could not be saved. Your current record remains active.';
    return false;
  }
}

import type { Kind } from '../curriculum/types';
export const TIMEZONE = 'Asia/Manila';
export const KINDS: Kind[] = ['lecture', 'lab', 'review'];
export const LABELS = { lecture: 'Lecture', lab: 'Laboratory', review: 'Review & assessment' };
export const modules = [
  'Infrastructure Foundations',
  'Systems Administration',
  'Azure Fundamentals',
  'Azure Administration',
  'Cloud Engineering & Automation',
  'Operations & Capstone',
];
export function sessionDate(week: number, kind: Kind): Date {
  return new Date(Date.UTC(2026, 9, 24 + (week - 1) * 7 + { lecture: 0, lab: 1, review: 4 }[kind], 1));
}
export function dateLabel(
  date: Date,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
): string {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: TIMEZONE }).format(date);
}
export function currentWeek(now = new Date()): number {
  return Math.min(
    24,
    Math.max(
      1,
      Math.floor((now.getTime() - (sessionDate(1, 'lecture').getTime() - 9 * 3600000)) / 604800000) + 1,
    ),
  );
}
export function key(week: number, kind: Kind) {
  return `${week}-${kind}`;
}
export function allSessions() {
  return Array.from({ length: 24 }, (_, i) =>
    KINDS.map((kind) => ({ week: i + 1, kind, id: key(i + 1, kind), date: sessionDate(i + 1, kind) })),
  ).flat();
}
export function nextScheduled(now = new Date()) {
  return allSessions().find((s) => s.date.getTime() >= now.getTime());
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  weeks,
  questionsFor,
  questionsForAssessment,
  ASSESSMENT_VERSION,
  CURRICULUM_ID,
} from '../src/curriculum/index.ts';
import { weeks as legacyWeeks } from '../src/curriculum/legacy.ts';
import { emptyData as legacyEmpty } from '../src/lib/legacy-store.ts';
import { timetable, week1LabSections } from '../src/curriculum/week-01.ts';
import { allSessions, sessionDate, dateLabel, modules } from '../src/lib/academic.ts';
import {
  emptyData,
  parseBackup,
  objectiveScore,
  attemptScore,
  initializeData,
  LEGACY_KEY,
  STORAGE_KEY,
  LEGACY_BACKUP_PREFIX,
  replaceData,
  data,
  type Attempt,
} from '../src/lib/store.ts';
import { gradebook } from '../src/lib/grades.ts';
import { section } from '../src/ui.ts';

test('clarity revision preserves existing R2 attempts, drafts, manual scores and answer mappings', () => {
  const before = JSON.parse(
    readFileSync(new URL('./fixtures/week-01-before-clarity.json', import.meta.url), 'utf8'),
  );
  for (const bank of before.signatures) {
    const current = questionsForAssessment(bank.id);
    assert.equal(current.length, bank.questions.length);
    current.forEach((question, i) => {
      assert.equal(question.type, bank.questions[i].type);
      assert.deepEqual(question.answer, bank.questions[i].answer);
      assert.equal(question.options?.length, bank.questions[i].options?.length);
    });
  }
  const restored = parseBackup(JSON.stringify(before.record));
  assert.deepEqual(restored, before.record);
  assert.deepEqual(restored.attempts.map(attemptScore), before.expectedScores);
  assert.deepEqual(parseBackup(JSON.stringify(restored)), restored);
});

class MemoryStorage {
  values = new Map<string, string>();
  writes: string[] = [];
  fail: (key: string) => boolean = () => false;
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    if (this.fail(key)) throw new Error('Quota blocked');
    this.writes.push(key);
    this.values.set(key, value);
  }
}
function oldRecord() {
  const old = legacyEmpty();
  old.completed = ['1-lecture', '7-review'];
  old.notes['7-review'] = 'Historical Linux review; not the new cloud week.';
  old.grades['1-lab'] = 92;
  old.submissions['1-lab'] = { text: 'Original evidence', date: '2026-10-23T01:00:00Z' };
  old.attempts.push({
    id: 'legacy-attempt',
    quiz: '1-quiz',
    date: '2026-10-23T01:00:00Z',
    answers: { 0: [1], 1: [0, 2], 2: [1], 3: 'Old answer' },
    earned: 3,
    possible: 3,
    shortScores: { 3: 2 },
  });
  old.drafts['2-quiz'] = { 0: [1] };
  old.theme = 'dark';
  return old;
}
function correctAttempt(quiz = '1-quiz'): Attempt {
  const qs = questionsForAssessment(quiz),
    answers = Object.fromEntries(
      qs.map((q, i) => [i, q.type === 'short' ? 'A reasoned explanation with verification.' : q.answer]),
    );
  return {
    id: 'attempt-test',
    quiz,
    assessmentVersion: ASSESSMENT_VERSION,
    date: '2026-10-23T01:00:00Z',
    answers,
    ...objectiveScore(qs, answers),
    shortScores: {},
  };
}

test('approved R2 baseline has all 24 weeks; only three Week 1 pages are ready', () => {
  assert.equal(weeks.length, 24);
  assert.deepEqual(
    weeks.map((w) => w.number),
    Array.from({ length: 24 }, (_, i) => i + 1),
  );
  assert.equal(weeks.filter((w) => w.status === 'ready').length, 1);
  assert.equal(modules.length, 6);
  assert.match(weeks[1].title, /Networking I/);
  assert.match(weeks[16].title, /Terraform I/);
  assert.match(weeks[17].title, /Terraform II/);
  assert.match(weeks[14].title, /observability/);
  for (const w of weeks) {
    assert.ok(w.prerequisites);
    assert.ok(w.objectives.length >= 2);
    assert.ok(w.plan?.lecture.length);
    assert.ok(w.plan?.lab.length);
    assert.ok(w.plan?.review.length);
  }
  for (const w of weeks.slice(1)) {
    assert.equal(w.sections.length, 0);
    assert.equal(questionsFor(w.number, [12, 24].includes(w.number)).length, 0);
  }
  const teaching = weeks[0].sections.map(section).join('');
  assert.match(teaching, /What is it\?/);
  assert.match(teaching, /Why do we need it\?/);
  assert.match(teaching, /Show explanation/);
  assert.equal(weeks[0].questions.length, 8);
  assert.equal(questionsForAssessment('1-diagnostic').length, 6);
  assert.equal(questionsForAssessment('2-quiz').length, 0);
  assert.equal(legacyWeeks[0].questions[0].answer[0], 1);
  assert.equal(weeks[0].questions[0].answer[0], 2);
});
test('72 Manila dates and all Week 1 activity budgets are exact', () => {
  assert.equal(allSessions().length, 72);
  assert.equal(sessionDate(1, 'lecture').toISOString(), '2026-10-24T01:00:00.000Z');
  assert.equal(sessionDate(1, 'lab').toISOString(), '2026-10-25T01:00:00.000Z');
  assert.equal(sessionDate(1, 'review').toISOString(), '2026-10-28T01:00:00.000Z');
  assert.equal(sessionDate(24, 'review').toISOString(), '2027-04-07T01:00:00.000Z');
  assert.equal(dateLabel(sessionDate(1, 'lecture'), { hour: 'numeric', minute: '2-digit' }), '9:00 AM');
  assert.equal(
    timetable.lecture.reduce((n, a) => n + a.minutes, 0),
    180,
  );
  assert.equal(
    timetable.lab.reduce((n, a) => n + a.minutes, 0),
    180,
  );
  assert.equal(
    timetable.review.reduce((n, a) => n + a.minutes, 0),
    120,
  );
  assert.equal(timetable.lecture[0].minutes, 20);
  assert.ok(week1LabSections.some((s) => s.title.includes('Independent')));
  assert.ok(week1LabSections.some((s) => s.title.includes('deliberately broken')));
});
test('migration preserves exact v1 bytes before creating new progress, never remaps old answers', () => {
  const storage = new MemoryStorage(),
    raw = JSON.stringify(oldRecord());
  storage.values.set(LEGACY_KEY, raw);
  const result = initializeData(storage);
  assert.equal(result.blocked, false);
  assert.equal(result.record.version, 2);
  assert.equal(result.record.curriculumId, CURRICULUM_ID);
  assert.equal(result.record.theme, 'dark');
  assert.deepEqual(result.record.completed, []);
  assert.deepEqual(result.record.notes, {});
  assert.deepEqual(result.record.grades, {});
  assert.deepEqual(result.record.attempts, []);
  assert.deepEqual(result.record.drafts, {});
  assert.equal(result.record.archives[0].raw, raw);
  assert.equal(result.record.archives[0].curriculumId, 'legacy-v1');
  assert.equal(storage.getItem(LEGACY_KEY), raw);
  assert.ok(storage.writes[0].startsWith(LEGACY_BACKUP_PREFIX));
  assert.equal(storage.getItem(storage.writes[0]), raw);
  assert.equal(storage.writes[1], STORAGE_KEY);
  assert.equal(gradebook(result.record).gradedAverage, null);
  const second = initializeData(storage);
  assert.equal(second.record.archives.length, 1);
  assert.equal(storage.writes.length, 2);
});
test('backup/quota/validation failure fails closed and leaves v1 untouched', () => {
  for (const failing of ['archive', 'active', 'corrupt']) {
    const storage = new MemoryStorage();
    const raw = failing === 'corrupt' ? '{broken' : JSON.stringify(oldRecord());
    storage.values.set(LEGACY_KEY, raw);
    storage.fail = (k) =>
      failing === 'archive'
        ? k.startsWith(LEGACY_BACKUP_PREFIX)
        : failing === 'active'
          ? k === STORAGE_KEY
          : false;
    const result = initializeData(storage);
    assert.equal(result.blocked, true);
    assert.match(result.issue, /safely loaded or archived/);
    assert.equal(storage.getItem(LEGACY_KEY), raw);
    assert.equal(storage.getItem(STORAGE_KEY), null);
  }
});
test('v1 file import archives history; v2 roundtrip preserves current notes, drafts and archives', () => {
  const raw = JSON.stringify(oldRecord()),
    d = parseBackup(raw);
  assert.equal(d.archives[0].raw, raw);
  assert.deepEqual(d.completed, []);
  d.completed = ['1-lecture'];
  d.notes['1-lecture'] = '<b>Literal note</b>';
  d.drafts['1-diagnostic'] = { 0: [4], 4: 'Not yet studied.' };
  d.grades['1-lab'] = 0;
  assert.deepEqual(parseBackup(JSON.stringify(d)), d);
});
test('objective answers require exact sets; true/false and single keys are not uniform', () => {
  const a = correctAttempt();
  assert.deepEqual(objectiveScore(weeks[0].questions, a.answers), { earned: 7, possible: 7 });
  a.answers[2] = [0];
  assert.equal(objectiveScore(weeks[0].questions, a.answers).earned, 6);
  a.answers[2] = [0, 0];
  assert.equal(objectiveScore(weeks[0].questions, a.answers).earned, 6);
  assert.deepEqual(
    weeks[0].questions.filter((q) => q.type === 'boolean').map((q) => q.answer[0]),
    [0, 1],
  );
  assert.ok(new Set(weeks[0].questions.filter((q) => q.type === 'single').map((q) => q.answer[0])).size >= 3);
});
test('diagnostic never contributes a score, weighted grade or completion', () => {
  const d = emptyData(),
    a = correctAttempt('1-diagnostic');
  d.attempts = [a];
  assert.equal(attemptScore(a), null);
  assert.equal(gradebook(d).earned, 0);
  assert.equal(gradebook(d).gradedAverage, null);
  assert.equal(gradebook(d).missing, 74);
  assert.equal(d.completed.length, 0);
});
test('graded short answer stays pending until manual assessment', () => {
  const a = correctAttempt();
  assert.equal(attemptScore(a), null);
  a.shortScores[7] = 0;
  assert.equal(attemptScore(a), 87.5);
  a.shortScores[7] = 2;
  assert.equal(attemptScore(a), 100);
  const d = emptyData();
  d.attempts = [a];
  d.grades['1-lab'] = 85;
  d.grades['1-assignment'] = 90;
  d.grades['2-lab'] = 100;
  const g = gradebook(d);
  assert.equal(g.missing, 71);
  assert.equal(g.rows[1].items[1].score, null);
  assert.ok(Math.abs(g.earned - 62.75 / 24) < 0.00001);
});
test('missing and zero remain different; forged objective totals are recalculated', () => {
  const d = emptyData();
  assert.equal(gradebook(d).gradedAverage, null);
  d.grades['1-lab'] = 0;
  assert.equal(gradebook(d).gradedAverage, 0);
  assert.equal(gradebook(d).missing, 73);
  const a = correctAttempt();
  a.answers[0] = [0];
  a.earned = 99;
  a.possible = 99;
  d.attempts = [a];
  assert.equal(parseBackup(JSON.stringify(d)).attempts[0].earned, 6);
  assert.equal(parseBackup(JSON.stringify(d)).attempts[0].possible, 7);
});
test('imports reject planned work, mismatched assessments, invalid scores and nested archives', () => {
  const reject = (mutate: (d: any) => void) => {
    const d = emptyData();
    mutate(d);
    assert.throws(() => parseBackup(JSON.stringify(d)));
  };
  reject((d) => (d.curriculumId = 'other'));
  reject((d) => (d.version = 99));
  reject((d) => (d.completed = ['2-lecture']));
  reject((d) => (d.notes = { '2-lecture': 'planned' }));
  reject((d) => (d.grades['1-lab'] = 101));
  reject((d) => (d.grades['1-lab'] = -1));
  reject((d) => (d.grades['2-lab'] = 85));
  reject((d) => (d.drafts['1-quiz'] = { 0: [99] }));
  reject((d) => (d.attempts = [{ ...correctAttempt(), assessmentVersion: 'old-order' }]));
  reject((d) => (d.attempts = [{ ...correctAttempt(), shortScores: { 0: 2 } }]));
  reject((d) => (d.attempts = [{ ...correctAttempt(), answers: { 7: [0] } }]));
  reject(
    (d) =>
      (d.archives = [
        {
          id: 'nested',
          date: new Date().toISOString(),
          schema: 2,
          curriculumId: CURRICULUM_ID,
          raw: JSON.stringify({ ...emptyData(), archives: [{}] }),
        },
      ]),
  );
  assert.throws(() => parseBackup('{"version":2,"__proto__":{},"curriculumId":"azure-2026-r2"}'));
});
test('confirmed restore retains archives and snapshots active work; failed write preserves active data', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage'),
    storage = new MemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  try {
    const first = parseBackup(JSON.stringify(oldRecord()));
    first.notes['1-lecture'] = 'Current revised note';
    assert.equal(replaceData(first), true);
    assert.equal(replaceData(emptyData()), true);
    assert.equal(data.archives.length, 2);
    const snapshot = data.archives.find((a) => a.schema === 2)!;
    assert.equal(JSON.parse(snapshot.raw).notes['1-lecture'], 'Current revised note');
    assert.ok(data.archives.some((a) => a.schema === 1));
    const incoming = emptyData();
    incoming.archives = [
      {
        ...snapshot,
        raw: JSON.stringify({ ...emptyData(), notes: { '1-lecture': 'Another archived note' } }),
      },
    ];
    assert.equal(replaceData(incoming), true);
    assert.equal(new Set(data.archives.map((a) => a.id)).size, data.archives.length);
    assert.equal(parseBackup(JSON.stringify(data)).archives.length, 3);
    assert.equal(incoming.archives[0].id, snapshot.id);
    const before = JSON.stringify(data);
    storage.fail = () => true;
    assert.equal(replaceData(emptyData()), false);
    assert.equal(JSON.stringify(data), before);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete (globalThis as any).localStorage;
  }
});

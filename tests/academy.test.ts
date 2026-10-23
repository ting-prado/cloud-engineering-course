import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weeks, questionsFor } from '../src/curriculum/index.ts';
import { allSessions, currentWeek, sessionDate, dateLabel } from '../src/lib/academic.ts';
import {
  emptyData,
  parseBackup,
  objectiveScore,
  attemptScore,
  quizKey,
  type Attempt,
} from '../src/lib/store.ts';
import { gradebook } from '../src/lib/grades.ts';

test('24 distinct authored weeks contain teachable content and complete lab contracts', () => {
  assert.deepEqual(
    weeks.map((w) => w.number),
    Array.from({ length: 24 }, (_, i) => i + 1),
  );
  for (const w of weeks) {
    assert.ok(w.sections.length >= 3, `Week ${w.number} lecture`);
    assert.ok(
      w.sections.reduce((n, s) => n + s.body.split(/\s+/).length, 0) >= 300,
      `Week ${w.number} depth`,
    );
    assert.equal(w.lab.tasks.length, 5);
    for (const field of ['setup', 'expected', 'validate', 'troubleshooting', 'cleanup'])
      assert.ok(w.lab[field as keyof typeof w.lab]);
    assert.ok(w.resources.length >= 2);
    assert.equal(w.questions.length, 4);
    assert.ok(w.questions.some((q) => q.type === 'short'));
  }
});
test('72 real Manila session dates extend through the final Wednesday', () => {
  const sessions = allSessions();
  assert.equal(sessions.length, 72);
  assert.equal(new Set(sessions.map((s) => s.id)).size, 72);
  assert.equal(sessionDate(1, 'lecture').toISOString(), '2026-10-24T01:00:00.000Z');
  assert.equal(sessionDate(24, 'lecture').toISOString(), '2027-04-03T01:00:00.000Z');
  assert.equal(sessionDate(24, 'review').toISOString(), '2027-04-07T01:00:00.000Z');
  assert.equal(dateLabel(sessionDate(1, 'lecture'), { hour: 'numeric', minute: '2-digit' }), '9:00 AM');
  assert.equal(currentWeek(new Date('2027-01-16T02:00:00Z')), 13);
  assert.equal(currentWeek(new Date('2030-01-01')), 24);
  for (const s of sessions) assert.equal(s.date.getUTCDay(), { lecture: 6, lab: 0, review: 3 }[s.kind]);
});
test('objective grading requires exact unique multi-select answers', () => {
  const qs = weeks[0].questions;
  assert.deepEqual(objectiveScore(qs, { '0': [1], '1': [0, 2], '2': [1] }), { earned: 3, possible: 3 });
  assert.deepEqual(objectiveScore(qs, { '0': [1], '1': [0], '2': [0] }), { earned: 1, possible: 3 });
  assert.equal(objectiveScore(qs, { '1': [0, 0] }).earned, 0);
});
test('short answers remain unfinalized until manual self-assessment', () => {
  const a: Attempt = {
    id: 'test',
    quiz: '1-quiz',
    date: new Date().toISOString(),
    answers: { '0': [1], '1': [0, 2], '2': [1], '3': 'An explanation' },
    earned: 3,
    possible: 3,
    shortScores: {},
  };
  assert.equal(attemptScore(a), null);
  a.shortScores['3'] = 0;
  assert.equal(attemptScore(a), 75);
  a.shortScores['3'] = 2;
  assert.equal(attemptScore(a), 100);
});
test('gradebook distinguishes zero and missing and uses specified weights', () => {
  const d = emptyData();
  let g = gradebook(d);
  assert.equal(g.total, 74);
  assert.equal(g.missing, 74);
  assert.equal(g.gradedAverage, null);
  assert.equal(g.earned, 0);
  d.grades['1-lab'] = 0;
  g = gradebook(d);
  assert.equal(g.missing, 73);
  assert.equal(g.gradedAverage, 0);
  assert.equal(g.rows[1].items[0].score, 0);
  assert.equal(g.rows[1].items[1].score, null);
  for (const w of weeks) {
    d.grades[`${w.number}-lab`] = 80;
    d.grades[`${w.number}-assignment`] = 80;
    const qs = questionsFor(w.number, [12, 24].includes(w.number));
    const answers = Object.fromEntries(qs.map((q, i) => [i, q.type === 'short' ? 'model' : q.answer]));
    const obj = objectiveScore(qs, answers);
    d.attempts.push({
      id: `a${w.number}`,
      quiz: quizKey(w.number),
      date: new Date().toISOString(),
      answers,
      ...obj,
      shortScores: Object.fromEntries(qs.flatMap((q, i) => (q.type === 'short' ? [[i, 2]] : []))),
    });
  }
  d.grades['12-practical'] = 80;
  d.grades['24-practical'] = 80;
  g = gradebook(d);
  assert.equal(g.missing, 0);
  assert.ok(Math.abs(g.earned - 83) < 0.00001);
  assert.ok(Math.abs(g.gradedAverage! - 83) < 0.00001);
});
test('written exams are cumulative and retain manually assessed responses', () => {
  for (const n of [12, 24]) {
    const qs = questionsFor(n, true);
    assert.equal(qs.length, 19);
    assert.equal(qs.filter((q) => q.type === 'short').length, 3);
  }
});
test('backup roundtrip preserves data, recalculates objective scores and rejects invalid schemas', () => {
  const d = emptyData();
  d.completed = ['1-lecture'];
  d.notes['1-lecture'] = '<script>not executable</script>';
  d.grades['1-lab'] = 0;
  d.submissions['1-lab'] = { text: 'Evidence', date: new Date().toISOString() };
  d.drafts['1-quiz'] = { '0': [1], '3': 'draft' };
  assert.deepEqual(parseBackup(JSON.stringify(d)), d);
  const reject = (mutate: (d: any) => void) => {
    const bad = structuredClone(d);
    mutate(bad);
    assert.throws(() => parseBackup(JSON.stringify(bad)));
  };
  reject((d) => (d.version = 99));
  reject((d) => (d.completed = ['25-lecture']));
  reject((d) => (d.grades['1-lab'] = -1));
  reject((d) => (d.grades['1-lab'] = 101));
  reject((d) => (d.notes = []));
  reject((d) => (d.submissions['1-lab'].date = 'invalid'));
  reject((d) => (d.attempts = [{}]));
  reject((d) => (d.theme = 'unknown'));
  d.attempts.push({
    id: 'imported',
    quiz: '1-quiz',
    date: new Date().toISOString(),
    answers: { '0': [0] },
    earned: 3,
    possible: 3,
    shortScores: {},
  });
  assert.equal(parseBackup(JSON.stringify(d)).attempts[0].earned, 0);
  assert.throws(() => parseBackup('{"version":1,"notes":{"__proto__":{}}}'));
});

import { weeks, questionsFor, assignmentRubric, practicalRubric } from '../curriculum';
import type { Kind } from '../curriculum/types';
import { allSessions, dateLabel, key, KINDS, LABELS, sessionDate } from '../lib/academic';
import { data, attemptScore, quizKey, type Attempt } from '../lib/store';

import {
  icon,
  esc,
  pct,
  lessonUrl,
  done,
  pill,
  progress,
  intro,
  codeBlock,
  section,
  resources,
  rubric,
} from '../ui';
import { labCommands } from '../curriculum/walkthroughs';

export function submission(id: string, title: string) {
  const sub = data.submissions[id];
  const score = data.grades[id];
  return `<form class="submission-form" data-id="${id}"><div class="section-heading"><h3>${title}</h3>${pill(sub ? 'Submitted' : 'Not submitted', sub ? 'success' : '')}</div><label for="submission-${id}">Evidence, repository link or submission notes</label><textarea id="submission-${id}" name="evidence" rows="5" placeholder="Describe what you completed. Link your evidence and explain any limitations. This saves text and links, not uploaded files." required maxlength="30000">${esc(sub?.text || '')}</textarea><div class="submission-actions"><button type="submit" class="button primary">${sub ? 'Update submission' : 'Record submission'}</button><label>Self-assessed score / 100<input type="number" name="score" min="0" max="100" step="0.1" value="${score ?? ''}" placeholder="Ungraded"></label></div><p class="subtle">Use the rubric above. Leave the score blank for ungraded work; 0 is an assessed zero. ${sub ? 'Last saved ' + esc(dateLabel(new Date(sub.date), { month: 'short', day: 'numeric', year: 'numeric' })) + '.' : ''}</p></form>`;
}
export function lecture(w: (typeof weeks)[number]) {
  return `<section id="objectives" class="objectives"><span class="eyebrow">BY THE END OF THIS CLASS</span><h2>You’ll be able to…</h2><ul>${w.objectives.map((o) => `<li>${icon('check')}${esc(o)}</li>`).join('')}</ul></section><div class="session-plan"><h3>Your 180-minute study plan</h3><p>15 min recall & objectives · 80 min careful reading · 30 min command/diagram walkthrough · 35 min official resources · 20 min summary & review questions. Take short breaks within the block.</p></div>${w.sections.map(section).join('')}<section id="terminology"><h2>The language of this lesson</h2><dl class="term-list">${Object.entries(
    w.terms,
  )
    .map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`)
    .join(
      '',
    )}</dl></section><aside class="callout misconception"><strong>A common misconception</strong><p>${esc(w.misconception)}</p></aside><section id="summary"><h2>Bring it together</h2><p>${esc(w.summary)}</p><h3>Check your understanding</h3><ol>${w.reviewQuestions.map((q) => `<li>${esc(q)}</li>`).join('')}</ol><p class="subtle">Explain each answer in your own words before looking back. Use the Wednesday assessment for scored practice.</p></section>${resources(w.resources)}`;
}
export function laboratory(w: (typeof weeks)[number]) {
  return `<div class="cost-callout ${w.lab.cost === 'Potentially billable' ? 'billable' : ''}">${icon(w.lab.cost === 'Potentially billable' ? 'shield' : 'check')}<div><strong>${w.lab.cost}</strong><p>${w.lab.cost === 'Potentially billable' ? 'Cloud execution is optional where stated. Review current prices before deploying. Budgets alert; they do not cap spending.' : 'No cloud subscription needed. Use only your own disposable local environment.'}</p></div></div><section id="lab-brief"><h2>Your mission</h2><p>${esc(w.lab.expected)}</p><dl class="term-list"><div><dt>Objective</dt><dd>${esc(w.objectives.join(' '))}</dd></div><div><dt>Required tools</dt><dd>${esc(w.lab.tools)}</dd></div><div><dt>Prerequisites</dt><dd>This week’s lecture${w.number > 1 ? ' and previous weeks’ lab evidence' : ''}. Confirm that every target environment is yours to administer.</dd></div><div><dt>Time budget</dt><dd>180 minutes: 20 setup · 110 tasks · 25 validation/troubleshooting · 15 documentation · 10 cleanup.</dd></div></dl></section><section id="setup"><h2>Before you begin</h2><p>${esc(w.lab.setup)}</p></section><section id="tasks"><h2>Build it, step by step</h2><ol class="lab-tasks">${w.lab.tasks.map((t, i) => `<li><span>${i + 1}</span><div><h3>Task ${i + 1}</h3><p>${esc(t)}</p></div></li>`).join('')}</ol>${w.lab.code ? codeBlock(w.lab.code) + (labCommands[w.number] ? `<p class="example-guidance">${esc(labCommands[w.number].guidance)}</p>` : '') : ''}${(w.lab.guide || []).map((s, i) => section(s, 100 + i)).join('')}<p class="subtle">Record the command, output, interpretation and any deviation for each task. A screenshot without explanation is incomplete evidence.</p></section><section id="validation"><h2>Prove it works</h2><p>${esc(w.lab.validate)}</p><h3>If something goes wrong</h3><p>${esc(w.lab.troubleshooting)}</p></section><section id="cleanup" class="callout"><h2>Leave the environment tidy</h2><p>${esc(w.lab.cleanup)}</p></section><section id="rubric"><h2>Laboratory grading rubric</h2>${rubric()}<p>Submission requirements: a task-by-task report, sanitized command evidence, expected-outcome checks, a troubleshooting observation and cleanup confirmation.</p></section><section id="submission">${submission(`${w.number}-lab`, 'Turn in your laboratory')}</section><section id="assignment"><h2>Assignment & documentation</h2><p>${esc(w.assignment)}</p><p class="subtle">Target deadline: Wednesday ${dateLabel(sessionDate(w.number, 'review'))}, 11:00 AM Asia/Manila. Late completion is always available.</p>${rubric(assignmentRubric)}${submission(`${w.number}-assignment`, 'Turn in your assignment')}</section>${[12, 24].includes(w.number) ? `<section id="practical"><h2>${w.number === 12 ? 'Semester 1' : 'Final'} practical assessment</h2><p>Evaluate the integrated project and defense separately from the weekly lab. Use observed evidence; award partial credit within each criterion and add the points.</p>${rubric(practicalRubric)}${submission(`${w.number}-practical`, 'Record practical examination')}</section>` : ''}${resources(w.resources)}`;
}
export function review(w: (typeof weeks)[number]) {
  return `<section id="review-plan" class="objectives"><span class="eyebrow">REFLECT · RETRIEVE · APPLY</span><h2>Your two-hour review</h2><p>${esc(w.review)}</p></section><section id="retrieval"><h2>Start with retrieval</h2><p>Close the lecture and answer these from memory. Then compare your explanation with the lesson, identify a specific misconception and revise it in your notes.</p><ol>${w.reviewQuestions.map((q) => `<li>${esc(q)}</li>`).join('')}</ol></section><section id="feedback"><h2>Give your lab useful feedback</h2><p>Check each required outcome against actual evidence. Distinguish “the command ran” from “the intended behavior was validated.” Reproduce one failure and explain which boundary it tests. Use the laboratory rubric to record a justified score, and keep incomplete work ungraded.</p><p><strong>Key idea to revisit:</strong> ${esc(w.misconception)}</p><p><strong>Prepare for next week:</strong> ${w.number < 24 ? esc(weeks[w.number].objectives.join(' ')) : 'Archive your evidence and write a 30-day practice plan for your weakest skills.'}</p><a class="button quiet" href="${lessonUrl(w.number, 'lab')}">Review lab & submission ${icon('arrow')}</a></section><section id="quiz"><h2>${[12, 24].includes(w.number) ? (w.number === 12 ? 'Semester 1 written examination' : 'Final written examination') : 'Check your understanding'}</h2><p>${[12, 24].includes(w.number) ? 'Cumulative assessment · suggested 60 minutes.' : 'Knowledge check · suggested 25 minutes.'} Objective questions are graded on submission. Short answers use a revealed model and your own 0–2 self-score. Answers stay hidden until you submit.</p>${quiz(w.number)}</section>${resources(w.resources)}`;
}
export function quiz(week: number) {
  const id = quizKey(week);
  const exam = [12, 24].includes(week);
  const qs = questionsFor(week, exam);
  const attempts = data.attempts.filter((a) => a.quiz === id);
  const last = attempts.at(-1);
  const draft = data.drafts[id] || {};
  return `<form id="quiz-form" data-week="${week}"><div class="quiz-top">${pill(exam ? 'CUMULATIVE EXAM' : 'KNOWLEDGE CHECK')}<span>${qs.length} questions · ${attempts.length} previous attempt${attempts.length === 1 ? '' : 's'}</span></div>${qs.map((q, i) => `<fieldset class="question"><legend><span>${String(i + 1).padStart(2, '0')}</span>${esc(q.prompt)}</legend><p class="question-type">${q.type === 'multiple' ? 'Select all correct answers · exact match' : q.type === 'short' ? 'Short answer · self-assessed after submission' : q.type === 'boolean' ? 'True or false' : 'Choose one answer'}</p>${q.type === 'short' ? `<textarea name="q${i}" aria-label="Answer question ${i + 1}" rows="4" required maxlength="10000">${esc(typeof draft[i] === 'string' ? draft[i] : '')}</textarea>` : q.options!.map((o, j) => `<label class="answer-option"><input type="${q.type === 'multiple' ? 'checkbox' : 'radio'}" name="q${i}" value="${j}" ${Array.isArray(draft[i]) && (draft[i] as number[]).includes(j) ? 'checked' : ''} ${q.type !== 'multiple' ? 'required' : ''}><span>${esc(o)}</span></label>`).join('')}</fieldset>`).join('')}<div class="quiz-submit"><button class="button primary" type="submit">Submit ${exam ? 'examination' : 'answers'} ${icon('arrow')}</button><small>Your draft saves on this device. Retakes are allowed; your best fully assessed score counts.</small></div></form>${last ? attemptReview(last) : ''}${
    attempts.length
      ? `<details class="attempt-history"><summary>All ${attempts.length} attempt${attempts.length === 1 ? '' : 's'}</summary>${attempts
          .slice()
          .reverse()
          .map(
            (a) =>
              `<div class="attempt-line"><span>${new Date(a.date).toLocaleString('en-US', { timeZone: 'Asia/Manila' })} PHST</span><strong>${attemptScore(a) === null ? 'Self-assessment pending' : pct(attemptScore(a))}</strong>${a.id !== last?.id ? `<button class="text-button" data-action="attempt" data-id="${a.id}">Review</button>` : ''}</div>`,
          )
          .join('')}</details>`
      : ''
  }`;
}
export function attemptReview(a: Attempt) {
  const week = Number(a.quiz.split('-')[0]);
  const qs = questionsFor(week, [12, 24].includes(week));
  return `<section class="attempt-review" id="attempt-result-${esc(a.id)}"><div class="result-heading"><span class="result-icon">${icon('check')}</span><div><p class="eyebrow">ATTEMPT SUBMITTED</p><h3>Objective score: ${a.earned} / ${a.possible}</h3><p>${attemptScore(a) === null ? 'Finish the short-answer self-assessment to finalize this score.' : `Final score: ${pct(attemptScore(a))} · best completed attempt counts.`}</p></div></div>${qs
    .map((q, i) => {
      const answer = a.answers[i];
      const correct =
        q.type === 'short'
          ? false
          : Array.isArray(answer) &&
            answer.length === q.answer.length &&
            q.answer.every((n) => answer.includes(n));
      return `<div class="answer-review ${q.type === 'short' ? 'self-assess' : correct ? 'correct' : 'incorrect'}"><strong>${i + 1}. ${esc(q.prompt)}</strong><p><span class="tiny-label">YOUR ANSWER</span> ${q.type === 'short' ? esc(answer || '(No answer)') : Array.isArray(answer) ? answer.map((n) => esc(q.options![n])).join('; ') : '(No answer)'}</p>${q.type !== 'short' ? `<p><span class="tiny-label">${correct ? 'CORRECT' : 'CORRECT ANSWER'}</span> ${q.answer.map((n) => esc(q.options![n])).join('; ')}</p>` : '<p class="tiny-label">MODEL ANSWER</p>'}<p>${esc(q.explanation)}</p>${q.type === 'short' ? `<label class="self-score-label">Self-assessment <select data-self-score="${esc(a.id)}" data-question="${i}" aria-label="Self-assess question ${i + 1}"><option value="">Not yet assessed</option>${[0, 1, 2].map((n) => `<option value="${n}" ${a.shortScores[i] === n ? 'selected' : ''}>${n} / 2 · ${['Missing or incorrect mechanism', 'Partly correct; important gap', 'Correct mechanism and justified limitation'][n]}</option>`).join('')}</select></label><small>Score your explanation against the model. This is manual self-assessment, not AI grading.</small>` : ''}</div>`;
    })
    .join('')}</section>`;
}
export function lessonPage(path: string) {
  const match = path.match(/^\/lesson\/(\d+)\/(lecture|lab|review)(?:#.*)?$/);
  if (!match || !weeks[Number(match[1]) - 1])
    return intro(
      'LESSON NOT FOUND',
      'That classroom doesn’t exist.',
      'Open the curriculum to choose a valid session.',
      '<a class="button primary" href="#/syllabus">Open curriculum</a>',
    );
  const n = Number(match[1]);
  const kind = match[2] as Kind;
  const w = weeks[n - 1];
  const index = (n - 1) * 3 + KINDS.indexOf(kind);
  const all = allSessions();
  const previous = all[index - 1],
    next = all[index + 1];
  const toc =
    kind === 'lecture'
      ? [
          ['objectives', 'Learning objectives'],
          ...w.sections.map((s, i) => [`section-${i}`, s.title]),
          ['terminology', 'Key terminology'],
          ['summary', 'Summary & questions'],
          ['resources', 'Learning resources'],
        ]
      : kind === 'lab'
        ? [
            ['lab-brief', 'Your mission'],
            ['setup', 'Before you begin'],
            ['tasks', 'Lab tasks'],
            ['validation', 'Validation & troubleshooting'],
            ['cleanup', 'Cleanup'],
            ['rubric', 'Grading rubric'],
            ['submission', 'Lab submission'],
            ['assignment', 'Assignment'],
            ...([12, 24].includes(n) ? [['practical', 'Practical examination']] : []),
            ['resources', 'Resources'],
          ]
        : [
            ['review-plan', 'Study plan'],
            ['retrieval', 'Retrieval practice'],
            ['feedback', 'Assignment feedback'],
            ['quiz', [12, 24].includes(n) ? 'Written examination' : 'Knowledge check'],
            ['resources', 'Resources'],
          ];
  return `<div class="reader-breadcrumb"><a href="#/syllabus">Curriculum</a>${icon('chevron')}<span>Module ${Math.ceil(n / 4)}</span>${icon('chevron')}<span>Week ${n}</span></div><div class="lesson-heading"><div class="lesson-badges">${pill(`WEEK ${String(n).padStart(2, '0')}`)}${pill(LABELS[kind])}${done(n, kind) ? pill('Completed', 'success') : ''}</div><h1>${esc(kind === 'lab' ? w.lab.title : kind === 'review' ? `${[12, 24].includes(n) ? 'Examination' : 'Review'}: ${w.title}` : w.title)}</h1><p class="subtle">${dateLabel(sessionDate(n, kind), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · 9:00 AM–${kind === 'review' ? '11:00 AM' : '12:00 PM'} PHST · ${kind === 'review' ? '120' : '180'} minutes</p><p class="prerequisite"><strong>Prerequisites:</strong> ${kind === 'lecture' ? (n === 1 ? 'Basic web development experience. No infrastructure knowledge assumed.' : `Weeks 1–${n - 1}, especially ${esc(weeks[n - 2].title)}.`) : `This week’s lecture${kind === 'review' ? ' and laboratory evidence' : ''}.`}</p></div><nav class="session-tabs" aria-label="Week ${n} sessions">${KINDS.map((k) => `<a class="${k === kind ? 'selected' : ''}" href="${lessonUrl(n, k)}">${icon(done(n, k) ? 'check' : k === 'lab' ? 'code' : k === 'review' ? 'note' : 'book')}${LABELS[k]}<span>${k === 'review' ? '2' : '3'}h</span></a>`).join('')}</nav><div class="reader-layout"><article class="lesson-prose">${kind === 'lecture' ? lecture(w) : kind === 'lab' ? laboratory(w) : review(w)}<section id="notes" class="notes-section"><div class="section-heading"><h2>Make it your own</h2><span id="notes-status" role="status">Saved on this device</span></div><label for="lesson-notes">Personal notes · questions, discoveries and things to revisit</label><textarea id="lesson-notes" data-note="${key(n, kind)}" rows="7" maxlength="50000" placeholder="Explain a concept in your own words. What surprised you? What will you investigate next?">${esc(data.notes[key(n, kind)] || '')}</textarea></section><div class="lesson-completion"><div><h3>${done(n, kind) ? 'A step forward, recorded.' : 'Ready to close this session?'}</h3><p>Mark completion deliberately after doing the work. Opening a lesson never marks it complete.</p></div><button class="button ${done(n, kind) ? 'quiet' : 'primary'}" data-action="complete" data-week="${n}" data-kind="${kind}">${icon('check')}${done(n, kind) ? 'Mark incomplete' : 'Mark as complete'}</button></div><nav class="lesson-pagination" aria-label="Lesson navigation">${previous ? `<a href="${lessonUrl(previous.week, previous.kind)}"><small>← Previous session</small><strong>Week ${previous.week} · ${LABELS[previous.kind]}</strong></a>` : '<span></span>'}${next ? `<a href="${lessonUrl(next.week, next.kind)}"><small>Next session →</small><strong>Week ${next.week} · ${LABELS[next.kind]}</strong></a>` : '<a href="#/grades"><small>Your next step →</small><strong>Review program completion</strong></a>'}</nav></article><aside class="reader-toc"><div class="toc-inner"><p class="eyebrow">IN THIS SESSION</p><nav aria-label="Lesson contents">${toc.map(([id, title]) => `<button class="toc-link" data-action="scroll" data-target="${id}">${esc(title)}</button>`).join('')}<button class="toc-link" data-action="scroll" data-target="notes">Personal notes</button></nav><div class="toc-progress"><span>Week ${n} progress</span><strong>${KINDS.filter((k) => done(n, k)).length}/3</strong>${progress((KINDS.filter((k) => done(n, k)).length / 3) * 100, 'Weekly completion')}</div><p class="toc-tip">Understanding takes practice. You can return to any session at any time.</p></div></aside></div>`;
}

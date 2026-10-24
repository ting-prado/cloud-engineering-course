import { weeks, questionsForAssessment } from '../curriculum';
import {
  timetable,
  week1Glossary,
  week1LabSections,
  reviewSections,
  incidentFeedback,
  reviewFeedback,
  week1LabRubric,
  week1DocRubric,
} from '../curriculum/week-01';
import type { Kind, Week } from '../curriculum/types';
import { allSessions, dateLabel, key, KINDS, LABELS, sessionDate } from '../lib/academic';
import { data, attemptScore, type Attempt } from '../lib/store';
import {
  icon,
  esc,
  pct,
  lessonUrl,
  done,
  pill,
  progress,
  intro,
  paragraphs,
  section,
  resources,
  rubric,
} from '../ui';

function glossary() {
  return (
    '<section id="terminology"><h2>Week 1 glossary</h2><p>Forgot a word? Open its definition here. Each entry includes an example. This glossary is available in all three sessions.</p><details><summary>Open the glossary</summary><dl class="term-list">' +
    week1Glossary
      .map(
        (g) =>
          '<div><dt>' +
          esc(g.term) +
          '</dt><dd>' +
          esc(g.definition) +
          '<br><strong>Example:</strong> ' +
          esc(g.example) +
          '</dd></div>',
      )
      .join('') +
    '</dl></details></section>'
  );
}
export function submission(id: string, title: string) {
  const sub = data.submissions[id];
  return `<form class="submission-form" data-id="${id}"><div class="section-heading"><h3>${title}</h3>${pill(sub ? 'Submitted' : 'Not submitted', sub ? 'success' : '')}</div><label for="submission-${id}">Evidence and explanation · at least 80 characters</label><textarea id="submission-${id}" name="evidence" rows="6" required minlength="80" maxlength="30000" placeholder="Write what happened, the results/logs you collected, your possible cause, what you changed and what happened when you tested again. Say which results were supplied or which help you used.">${esc(sub?.text || '')}</textarea><div class="submission-actions"><button type="submit" class="button primary">${sub ? 'Update submission' : 'Record submission'}</button><label>Your score using the rubric / 100<input name="score" type="number" min="0" max="100" step="0.1" placeholder="Ungraded" value="${data.grades[id] ?? ''}"></label></div><p class="subtle">Submitting at least 80 characters opens the model feedback. It does not prove your answer is correct or that you ran the lab. Use the scoring guide above. Leave the score blank until assessed; zero means an assessed score of zero. ${sub ? 'Last saved ' + esc(dateLabel(new Date(sub.date))) + '.' : ''}</p></form>`;
}
function sessionPlan(kind: Kind) {
  const rows = timetable[kind];
  return `<section id="study-plan" class="session-plan"><h2>Your ${kind === 'review' ? '120' : '180'}-minute plan</h2><p>Follow this plan within the class block. Reading, setup, writing down results, breaks and correcting mistakes are included. Use spare time for setup problems rather than adding extra homework.</p><table><thead><tr><th>Minutes</th><th>Activity</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.minutes}</td><td>${esc(r.activity)}</td></tr>`).join('')}</tbody><tfoot><tr><td>${rows.reduce((n, r) => n + r.minutes, 0)}</td><td>Total · Asia/Manila</td></tr></tfoot></table></section>`;
}
function workloadDownload() {
  return `<aside class="callout"><strong>The ready-to-run app for this lesson</strong><p>Request notebook is a small app already written for you. You will run it and investigate it, not build new features. If useful, compare its parts with an app you already know.</p><a class="button primary" href="./labs/week-01-workload.zip" download>${icon('download')} Download ready-to-run workload</a><p>Download the ZIP and extract it into a new folder. Keep the files together. You need Node 22 or later, a browser and a terminal (a command window). No npm install or Azure account is needed. The ZIP contains the built React files, settings and server programs. Sunday’s preflight explains how to open the folder and terminals.</p></aside>`;
}
function lecture(w: Week) {
  return `${sessionPlan('lecture')}<section id="diagnostic"><h2>Before the lecture: ungraded diagnostic</h2><p>These starting questions help you notice what you already know. Some cover later weeks; you are not expected to know everything. Spend no more than 20 minutes. Choose “Not sure yet” or write “I do not know yet” when needed. Submit before reading the lesson. There is no grade or pass mark.</p>${assessment('1-diagnostic')}</section><section id="objectives" class="objectives"><p class="eyebrow">BY THE END OF SATURDAY</p><h2>Understand what keeps your app running.</h2><ul>${w.objectives.map((o) => `<li>${icon('check')}${esc(o)}</li>`).join('')}</ul></section>${workloadDownload()}${w.sections.map(section).join('')}<aside class="callout"><strong>A common misconception</strong><p>${esc(w.misconception)}</p></aside><section id="summary"><h2>What to remember</h2><p>${esc(w.summary)}</p><ol>${w.reviewQuestions.map((q) => `<li>${esc(q)}</li>`).join('')}</ol></section>${resources(w.resources)}`;
}
function laboratory(w: Week) {
  return `${sessionPlan('lab')}<section id="lab-brief" class="objectives"><h2>Your mission</h2><p>${esc(w.lab.expected)}</p><p><strong>Tools:</strong> ${esc(w.lab.tools)}</p><p><strong>Prerequisites:</strong> Saturday’s explanations of running programs, ports, memory and saved files. Check that Node and the downloaded app can start.</p><p><strong>Cost:</strong> Free and local. No cloud resources or GitHub Actions are created.</p></section>${workloadDownload()}<section id="tasks"><h2>Guided practice, independent variation and incident</h2>${week1LabSections.map((s, i) => `<div id="lab-part-${i}">${section(s, 100 + i)}</div>`).join('')}</section><section id="rubric"><h2>Week 1 laboratory rubric</h2>${rubric(week1LabRubric)}<p>Submit one short report with the A/B/C/D results and anything you could not test. The academy stores what you write and the score you enter. It cannot check your computer to confirm that you ran the lab.</p></section><section id="submission">${submission('1-lab', 'Turn in your Week 1 laboratory')}${data.submissions['1-lab'] ? `<div id="incident-feedback">${section(incidentFeedback, 110)}</div>` : '<p class="subtle">Incident correction/model feedback is withheld until you record your investigation above.</p>'}</section><section id="assignment"><h2>Documentation · explain the same lab results</h2><p>${esc(w.assignment)}</p><p>Target: Wednesday October 28, 2026, 11:00 AM Asia/Manila. Late work stays available. Use the allocated Wednesday block; no separate essay.</p>${rubric(week1DocRubric)}${submission('1-assignment', 'Record your explanation and Wednesday case')}${data.submissions['1-assignment'] ? section(reviewFeedback, 111) : ''}</section>${resources(w.resources)}`;
}
function review(w: Week) {
  return `${sessionPlan('review')}<section id="review-plan" class="objectives"><h2>Review your results and correct mistakes</h2><p>${esc(w.review)}</p><p>Use the quiz to check this week’s understanding. The starting diagnostic is still ungraded. This week does not yet prove you can administer Azure, networks or Linux independently.</p></section>${section(reviewSections[0], 100)}<section id="quiz"><h2>Week 1 knowledge check</h2><p>Allow 25 minutes for eight questions. Choose one answer unless asked to select all correct answers. Selection questions have fixed answer keys and are graded automatically. After submitting, use the model and 0–2 scoring guide for your short explanation. The best fully assessed attempt counts. Previous feedback remains visible if you retry; this is practice, not a supervised exam.</p>${assessment('1-quiz')}</section>${reviewSections
    .slice(1)
    .map((s, i) => `<div id="review-part-${i + 1}">${section(s, 101 + i)}</div>`)
    .join(
      '',
    )}<section id="assignment"><h2>Submit your explanation of the new case</h2>${rubric(week1DocRubric)}${submission('1-assignment', 'Record your explanation and Wednesday case')}${data.submissions['1-assignment'] ? section(reviewFeedback, 111) : '<p class="subtle">The Wednesday case model is withheld until you record your response.</p>'}<a class="button quiet" href="${lessonUrl(1, 'lab')}#submission">Review lab evidence and incident feedback ${icon('arrow')}</a></section>${resources(w.resources)}`;
}
function assessment(id: string) {
  const diagnostic = id === '1-diagnostic',
    qs = questionsForAssessment(id),
    attempts = data.attempts.filter((a) => a.quiz === id),
    last = attempts.at(-1),
    draft = data.drafts[id] || {};
  return `<form id="${diagnostic ? 'diagnostic-form' : 'quiz-form'}" data-assessment="${id}" data-week="1"><div class="quiz-top">${pill(diagnostic ? 'UNGRADED DIAGNOSTIC' : 'WEEK 1 · R2.1')}<span>${qs.length} questions · ${attempts.length} previous attempts</span></div>${qs.map((q, i) => `<fieldset class="question"><legend><span>${String(i + 1).padStart(2, '0')}</span>${esc(q.prompt)}</legend><p class="question-type">${q.type === 'short' ? (diagnostic ? 'Your own starting explanation · ungraded' : 'Short answer · use the scoring guide after submitting') : q.type === 'multiple' ? 'Select all correct answers · choose every correct option and no others' : q.type === 'boolean' ? 'True or false' : 'Choose one answer'}</p>${q.type === 'short' ? `<textarea name="q${i}" aria-label="Answer question ${i + 1}" rows="4" required maxlength="10000">${esc(typeof draft[i] === 'string' ? draft[i] : '')}</textarea>` : q.options!.map((option, j) => `<label class="answer-option"><input type="${q.type === 'multiple' ? 'checkbox' : 'radio'}" name="q${i}" value="${j}" ${Array.isArray(draft[i]) && (draft[i] as number[]).includes(j) ? 'checked' : ''} ${q.type !== 'multiple' ? 'required' : ''}><span>${esc(option)}</span></label>`).join('')}</fieldset>`).join('')}<div class="quiz-submit"><button class="button primary" type="submit">${diagnostic ? 'Submit diagnostic reflection' : 'Submit answers'} ${icon('arrow')}</button><small>Drafts save on this device. ${diagnostic ? 'No contribution to grades.' : 'Your best fully assessed practice attempt counts. Score the short answer after submitting to finish the attempt.'}</small></div></form>${last ? attemptReview(last) : ''}${
    attempts.length
      ? `<details class="attempt-history"><summary>All ${attempts.length} attempts</summary>${attempts
          .slice()
          .reverse()
          .map(
            (a) =>
              `<div class="attempt-line"><span>${esc(new Date(a.date).toLocaleString('en-US', { timeZone: 'Asia/Manila' }))} PHST</span><strong>${diagnostic ? 'Ungraded' : attemptScore(a) === null ? 'Self-assessment pending' : pct(attemptScore(a))}</strong><button class="text-button" data-action="attempt" data-id="${esc(a.id)}">Review</button></div>`,
          )
          .join('')}</details>`
      : ''
  }`;
}
export function attemptReview(a: Attempt) {
  const diagnostic = a.quiz === '1-diagnostic',
    qs = questionsForAssessment(a.quiz);
  const gaps = qs.flatMap((q, i) => {
    const answer = a.answers[i];
    return q.type !== 'short' &&
      (!Array.isArray(answer) ||
        answer.length !== q.answer.length ||
        !q.answer.every((n) => answer.includes(n)))
      ? [q.domain || 'this concept']
      : [];
  });
  return `<section class="attempt-review" id="attempt-result-${esc(a.id)}"><div class="result-heading"><span class="result-icon">${icon('check')}</span><div><p class="eyebrow">${diagnostic ? 'UNGRADED BASELINE RECORDED' : 'ATTEMPT SUBMITTED'}</p><h3>${diagnostic ? 'Reflection saved · no grade or pass mark' : `Objective score: ${a.earned} / ${a.possible}`}</h3><p>${diagnostic ? (gaps.length ? 'Review these topics: ' + esc([...new Set(gaps)].join(', ')) + '. Compare your written reflections with the models below. The app does not decide your skill level.' : 'Review your short reflections against the models. Recognizing an answer does not yet show you can do the task yourself.') : attemptScore(a) === null ? 'Use the 0–2 scoring guide below to finalize this attempt.' : `Final score: ${pct(attemptScore(a))} · best finalized attempt counts.`}</p></div></div>${qs
    .map((q, i) => {
      const answer = a.answers[i],
        correct =
          Array.isArray(answer) &&
          answer.length === q.answer.length &&
          q.answer.every((n) => answer.includes(n));
      return `<div class="answer-review ${q.type === 'short' ? 'self-assess' : correct ? 'correct' : 'incorrect'}"><strong>${i + 1}. ${esc(q.prompt)}</strong><p><span class="tiny-label">YOUR ANSWER</span>${q.type === 'short' ? esc(answer || '(No answer)') : Array.isArray(answer) ? answer.map((n) => esc(q.options![n])).join('; ') : '(No answer)'}</p>${q.type === 'short' ? '<p class="tiny-label">MODEL / REFLECTION GUIDE</p>' : `<p><span class="tiny-label">${correct ? 'CORRECT' : 'CORRECT ANSWER'}</span>${q.answer.map((n) => esc(q.options![n])).join('; ')}</p>`}<p>${esc(q.explanation)}</p>${q.type === 'short' && !diagnostic ? `<ul>${(q.selfRubric || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul><label class="self-score-label">Manual self-assessment<select data-self-score="${esc(a.id)}" data-question="${i}" aria-label="Self-assess question ${i + 1}"><option value="">Not yet assessed</option>${[0, 1, 2].map((n) => `<option value="${n}" ${a.shortScores[i] === n ? 'selected' : ''}>${n} / 2</option>`).join('')}</select></label><small>Compare your explanation with the scoring guide. You assess it yourself; the app does not use AI or check your computer.</small>` : ''}</div>`;
    })
    .join('')}</section>`;
}
function plannedPage(w: Week, kind: Kind) {
  return `<div class="lesson-heading">${pill('PLANNED · NOT READY')}<h1>${esc(w.title)}</h1><p class="subtle">${dateLabel(sessionDate(w.number, kind), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · ${LABELS[kind]} · Asia/Manila</p></div><aside class="callout"><strong>This is the revised syllabus, not a completed lesson.</strong><p>Week ${w.number} awaits authoring and tested fixtures in a subsequent batch. Legacy Week ${w.number} content and scores belong to the previous curriculum and are not relabeled as this material. Only Week 1 is ready in this release.</p></aside><article class="lesson-prose"><h2>Objectives</h2><ul>${w.objectives.map((o) => `<li>${esc(o)}</li>`).join('')}</ul><p><strong>Prerequisites:</strong> ${esc(w.prerequisites)}</p>${(['lecture', 'lab', 'review'] as const).map((k) => `<section><h2>${LABELS[k]} · ${k === 'review' ? '120' : '180'} minutes</h2><ul>${w.plan![k].map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>`).join('')}<p><strong>Planned outcome:</strong> ${esc(w.plan?.outcome)}</p><p><strong>Cost classification:</strong> ${esc(w.lab.cost)}. Cloud batches must publish an estimate, scope, observable validation and cleanup before execution.</p><a class="button primary" href="${lessonUrl(1, 'lecture')}">Open ready Week 1</a> <a class="button quiet" href="#/syllabus">Full revised syllabus</a></article>`;
}
export function lessonPage(path: string) {
  const match = path.match(/^\/lesson\/(\d+)\/(lecture|lab|review)(?:#.*)?$/);
  if (!match || !weeks[Number(match[1]) - 1])
    return intro(
      'LESSON NOT FOUND',
      'Choose a classroom.',
      'Open the revised curriculum.',
      '<a href="#/syllabus">Curriculum</a>',
    );
  const n = Number(match[1]),
    kind = match[2] as Kind,
    w = weeks[n - 1];
  if (w.status !== 'ready') return plannedPage(w, kind);
  const toc =
    kind === 'lecture'
      ? [
          ['study-plan', 'Study plan'],
          ['diagnostic', 'Ungraded diagnostic'],
          ['objectives', 'Objectives'],
          ...w.sections.map((s, i) => [`section-${i}`, s.title]),
          ['summary', 'Summary'],
          ['resources', 'Selected references'],
        ]
      : kind === 'lab'
        ? [
            ['study-plan', 'Study plan'],
            ['lab-brief', 'Mission & workload'],
            ...week1LabSections.map((s, i) => [`lab-part-${i}`, s.title]),
            ['rubric', 'Evidence rubric'],
            ['submission', 'Lab submission & feedback'],
            ['assignment', 'Documentation'],
          ]
        : [
            ['study-plan', 'Study plan'],
            ['review-plan', 'Review'],
            ['quiz', 'Knowledge check'],
            ['review-part-1', 'Independent investigation'],
            ['assignment', 'Explanation & feedback'],
          ];
  const all = allSessions(),
    index = (n - 1) * 3 + KINDS.indexOf(kind),
    previous = all[index - 1],
    next = all[index + 1];
  return `<div class="reader-breadcrumb"><a href="#/syllabus">Revised curriculum</a>${icon('chevron')}<span>Week ${n} · R2</span></div><div class="lesson-heading"><div class="lesson-badges">${pill('READY · WEEK 01')}${pill(LABELS[kind])}${done(n, kind) ? pill('Completed', 'success') : ''}</div><h1>${esc(kind === 'lab' ? w.lab.title : kind === 'review' ? 'Review: ' + w.title : w.title)}</h1><p class="subtle">${dateLabel(sessionDate(n, kind), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · 9:00 AM–${kind === 'review' ? '11:00 AM' : '12:00 PM'} Asia/Manila</p><p class="prerequisite"><strong>Prerequisites:</strong> ${esc(kind === 'lecture' ? w.prerequisites : 'Read Saturday’s explanations and check the tools first. Keep your results for Wednesday.')}</p><p><button class="button quiet" data-action="scroll" data-target="terminology">Look up a word</button></p></div><nav class="session-tabs" aria-label="Week 1 sessions">${KINDS.map((k) => `<a class="${k === kind ? 'selected' : ''}" href="${lessonUrl(1, k)}">${icon(done(1, k) ? 'check' : k === 'lab' ? 'code' : 'book')}${LABELS[k]}<span>${k === 'review' ? '2' : '3'}h</span></a>`).join('')}</nav><div class="reader-layout"><article class="lesson-prose">${kind === 'lecture' ? lecture(w) : kind === 'lab' ? laboratory(w) : review(w)}${glossary()}<section id="notes" class="notes-section"><div class="section-heading"><h2>Personal notes</h2><span id="notes-status" role="status">Saved on this device</span></div><label for="lesson-notes">Write what you learned, what you observed and what still confuses you</label><textarea id="lesson-notes" data-note="${key(n, kind)}" rows="7" maxlength="50000">${esc(data.notes[key(n, kind)] || '')}</textarea></section><div class="lesson-completion"><div><h3>${done(n, kind) ? 'Study completion recorded.' : 'Finished this session’s work?'}</h3><p>Mark complete when you have finished this session’s work. Opening the page does not complete it. The checkmark records your study; it does not prove independent skill. In your notes, say what is still blocked or based on supplied results.</p></div><button class="button ${done(n, kind) ? 'quiet' : 'primary'}" data-action="complete" data-week="1" data-kind="${kind}">${icon('check')}${done(n, kind) ? 'Mark incomplete' : 'Mark as complete'}</button></div><nav class="lesson-pagination" aria-label="Lesson navigation">${previous ? `<a href="${lessonUrl(previous.week, previous.kind)}"><small>Previous session</small><strong>Week ${previous.week} · ${LABELS[previous.kind]}</strong></a>` : '<span></span>'}${next ? `<a href="${lessonUrl(next.week, next.kind)}"><small>${weeks[next.week - 1].status === 'ready' ? 'Next session' : 'Next syllabus entry · planned'}</small><strong>Week ${next.week} · ${LABELS[next.kind]}</strong></a>` : ''}</nav></article><aside class="reader-toc"><div class="toc-inner"><p class="eyebrow">IN THIS SESSION</p><nav aria-label="Lesson contents">${toc.map(([id, title]) => `<button class="toc-link" data-action="scroll" data-target="${id}">${esc(title)}</button>`).join('')}<button class="toc-link" data-action="scroll" data-target="terminology">Glossary · definitions and examples</button><button class="toc-link" data-action="scroll" data-target="notes">Personal notes</button></nav><div class="toc-progress">Week 1 · ${KINDS.filter((k) => done(1, k)).length}/3 study sessions${progress((KINDS.filter((k) => done(1, k)).length / 3) * 100, 'Weekly study completion')}</div></div></aside></div>`;
}

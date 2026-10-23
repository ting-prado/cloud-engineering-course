import { weeks } from '../curriculum';

import { KINDS } from '../lib/academic';
import { data } from '../lib/store';
import { gradebook } from '../lib/grades';
import { icon, esc, pct, lessonUrl, done, pill, progress, intro } from '../ui';

export function grades() {
  const book = gradebook(data);
  return `${intro('EVIDENCE OF YOUR PROGRESS', 'Every skill, accounted for.', 'Manual marks belong to you. Score your work against the rubrics and keep incomplete work distinct from an assessed zero.')}<div class="grade-summary"><article class="panel"><p class="tiny-label">CURRENT · GRADED WORK ONLY</p><strong class="grade-number">${pct(book.gradedAverage)}</strong><p>Weighted by each assessment’s share of the program. Missing work is excluded from this average.</p></article><article class="panel"><p class="tiny-label">EARNED TOWARD FINAL GRADE</p><strong class="grade-number">${book.earned.toFixed(1)}<small> / 100</small></strong>${progress(book.earned, 'Earned final grade points')}<p>Missing work earns no points yet. Pass at 75/100.</p></article><article class="panel"><p class="tiny-label">ACADEMIC RECORD</p><strong class="grade-number">${book.total - book.missing}<small> / ${book.total}</small></strong><p>Assessments graded · ${book.missing} missing</p>${pill(book.missing === 0 && data.completed.length === 72 && book.earned >= 75 ? 'Program complete' : 'In progress', book.earned >= 75 ? 'success' : '')}</article></div><section class="panel grade-category-panel"><div class="section-heading"><h2>Category breakdown</h2><span class="subtle">Best finalized quiz attempt counts</span></div><div class="table-scroll"><table><thead><tr><th>Assessment category</th><th>Weight</th><th>Graded average</th><th>Earned points</th><th>Missing</th></tr></thead><tbody>${book.rows.map((r) => `<tr><td>${r.name}</td><td>${r.weight}%</td><td class="${r.average !== null && r.average < 75 ? 'low-grade' : ''}">${pct(r.average)}</td><td>${r.earned.toFixed(2)} / ${r.weight}</td><td>${r.missing}</td></tr>`).join('')}</tbody></table></div><p class="subtle">Each item has equal weight within its category. Written midterm/final quizzes are included in the 15% category; their practical projects contribute 10% and 20% separately.</p></section><div class="section-heading lower-heading"><h2>Weekly academic record</h2><a href="#/settings">${icon('download')} Export a backup</a></div><div class="table-scroll grade-record"><table><thead><tr><th>Week / topic</th><th>Quiz</th><th>Lab · 35%</th><th>Documentation · 20%</th><th>Progress</th></tr></thead><tbody>${weeks
    .map((w) => {
      const quiz = book.rows[0].items.find((i) => i.week === w.number)!;
      return `<tr><td><a href="${lessonUrl(w.number, 'lecture')}"><small>WEEK ${String(w.number).padStart(2, '0')}</small><strong>${esc(w.title)}</strong></a></td><td><a class="${quiz.score !== null && quiz.score < 75 ? 'low-grade' : ''}" href="${lessonUrl(w.number, 'review')}">${quiz.score === null ? 'Not assessed' : pct(quiz.score)}</a></td>${['lab', 'assignment'].map((c) => `<td><label class="sr-only" for="grade-${w.number}-${c}">Week ${w.number} ${c} score</label><input id="grade-${w.number}-${c}" class="grade-input" data-grade="${w.number}-${c}" type="number" min="0" max="100" step="0.1" placeholder="Ungraded" value="${data.grades[`${w.number}-${c}`] ?? ''}"><small class="submission-status">${data.submissions[`${w.number}-${c}`] ? 'Submitted' : 'No submission'}</small></td>`).join('')}<td>${KINDS.filter((k) => done(w.number, k)).length}/3 sessions${[12, 24].includes(w.number) ? `<label class="practical-label">Practical / 100<input data-grade="${w.number}-practical" type="number" min="0" max="100" step="0.1" placeholder="Ungraded" value="${data.grades[`${w.number}-practical`] ?? ''}" aria-label="Week ${w.number} practical score"></label>` : ''}</td></tr>`;
    })
    .join('')}</tbody></table></div><aside class="callout"><strong>Where to focus next</strong><p>${
    book.rows.some((r) => r.average !== null && r.average < 75)
      ? book.rows
          .filter((r) => r.average !== null && r.average < 75)
          .map((r) => esc(r.name))
          .join(', ') +
        ' currently fall below 75%. Review the rubric and repeat a targeted task before reassessing.'
      : 'Record your first scores, then use low-scoring categories to choose focused practice.'
  } ${book.missing} assessments still need a finalized score.</p></aside>`;
}

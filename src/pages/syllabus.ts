import { weeks, questionsFor } from '../curriculum';

import { dateLabel, KINDS, LABELS, modules, sessionDate } from '../lib/academic';

import { icon, esc, lessonUrl, done, pill, intro } from '../ui';

export function syllabus() {
  return `${intro('THE ACADEMIC PROGRAM', 'Your path to cloud engineering.', '24 weeks. Six modules. One carefully sequenced journey from infrastructure foundations to operating on Azure.')}<div class="info-strip">${icon('calendar')} Oct 24, 2026 – Apr 9, 2027 <span>·</span>${icon('clock')} 8 hours / week <span>·</span>Sat + Sun + Wed <span>·</span>Asia/Manila</div><div class="syllabus-toolbar"><label class="search-field">${icon('search')}<input id="syllabus-search" type="search" placeholder="Find a week, topic or skill…" aria-label="Search curriculum"></label><label class="filter-label">Show <select id="syllabus-filter"><option value="all">All weeks</option><option value="incomplete">Not yet complete</option><option value="complete">Completed weeks</option></select></label></div>${[
    0, 1,
  ]
    .map(
      (semester) =>
        `<section class="semester-section"><div class="semester-heading"><span>0${semester + 1}</span><div><p class="eyebrow">SEMESTER ${semester + 1} · WEEKS ${semester * 12 + 1}–${semester * 12 + 12}</p><h2>${semester === 0 ? 'Infrastructure & Cloud Foundations' : 'Azure Cloud Engineering'}</h2></div></div>${[
          0, 1, 2,
        ]
          .map((mi) => {
            const module = semester * 3 + mi;
            return `<div class="syllabus-module" id="module-${module}"><div class="section-heading"><h3>Module ${module + 1} <span>${modules[module]}</span></h3><span class="subtle">32 learning hours</span></div>${weeks
              .slice(module * 4, module * 4 + 4)
              .map((w) => {
                const count = KINDS.filter((k) => done(w.number, k)).length;
                return `<details class="week-item" data-search="${esc((w.title + ' ' + w.topics.join(' ')).toLowerCase())}" data-complete="${count === 3}"><summary><span class="week-num">${String(w.number).padStart(2, '0')}</span><span class="week-title"><strong>${esc(w.title)}</strong><small>${dateLabel(sessionDate(w.number, 'lecture'))} – ${dateLabel(new Date(sessionDate(w.number, 'lecture').getTime() + 6 * 86400000))} · ${esc(w.topics.slice(0, 3).join(' / '))}</small></span>${pill(count === 3 ? 'Complete' : `${count}/3 sessions`, count === 3 ? 'success' : '')}${icon('chevron')}</summary><div class="week-expanded"><div><h4>What you’ll learn</h4><ul>${w.objectives.map((o) => `<li>${esc(o)}</li>`).join('')}</ul><p><strong>Lab:</strong> ${esc(w.lab.title)}</p><p><strong>Assessment:</strong> ${[12, 24].includes(w.number) ? 'Cumulative written exam + practical defense' : 'Knowledge check + self-scored technical response'}</p><p class="subtle">${w.sections.length} authored lecture sections · ${w.lab.tasks.length} lab tasks · ${questionsFor(w.number, [12, 24].includes(w.number)).length} assessment questions</p></div><div class="week-session-links">${KINDS.map((k) => `<a href="${lessonUrl(w.number, k)}">${icon(done(w.number, k) ? 'check' : k === 'lab' ? 'code' : 'book')}<span>${LABELS[k]}<small>${dateLabel(sessionDate(w.number, k), { weekday: 'short', month: 'short', day: 'numeric' })} · ${k === 'review' ? '2' : '3'}h</small></span>${icon('arrow')}</a>`).join('')}</div></div></details>`;
              })
              .join('')}</div>`;
          })
          .join('')}</section>`,
    )
    .join('')}<p class="empty-search" hidden>No weeks match your search.</p>`;
}

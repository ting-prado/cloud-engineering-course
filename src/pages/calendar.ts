import { weeks } from '../curriculum';

import { allSessions, dateLabel, LABELS } from '../lib/academic';
import { data } from '../lib/store';

import { icon, esc, lessonUrl, done, intro } from '../ui';

export function calendar() {
  const [year, month] = data.calendarMonth.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const offset = (start.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const sessions = allSessions();
  const monthly = sessions.filter(
    (s) => s.date.getUTCFullYear() === year && s.date.getUTCMonth() === month - 1,
  );
  const today = dateLabel(new Date(), { year: 'numeric', month: '2-digit', day: '2-digit' });
  return `${intro('MAKE SPACE FOR LEARNING', 'Your academic calendar.', 'Asia/Manila target schedule. Week 1 is ready; later dates are approved plans awaiting authored lessons.')}<div class="calendar-toolbar"><div class="calendar-month"><button class="icon-button" data-action="month" data-delta="-1" aria-label="Previous month">‹</button><h2>${dateLabel(start, { month: 'long', year: 'numeric' })}</h2><button class="icon-button" data-action="month" data-delta="1" aria-label="Next month">›</button></div><div class="calendar-controls"><button class="button quiet" data-action="calendar-now">Today</button><span>Asia/Manila · UTC+8</span></div></div><div class="calendar-legend"><span><i class="legend-dot lecture"></i>Lecture · Saturday 9–12</span><span><i class="legend-dot lab"></i>Laboratory · Sunday 9–12</span><span><i class="legend-dot review"></i>Review · Wednesday 9–11</span></div><section class="calendar-grid" aria-label="${dateLabel(start, { month: 'long', year: 'numeric' })} class schedule">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => `<div class="calendar-weekday">${d}</div>`).join('')}${Array.from(
    { length: Math.ceil((offset + days) / 7) * 7 },
    (_, i) => {
      const day = i - offset + 1;
      if (day < 1 || day > days) return '<div class="calendar-day outside"></div>';
      const d = new Date(Date.UTC(year, month - 1, day, 1));
      const events = monthly.filter((s) => s.date.getUTCDate() === day);
      return `<div class="calendar-day ${dateLabel(d, { year: 'numeric', month: '2-digit', day: '2-digit' }) === today ? 'today' : ''}"><span class="day-number">${day}</span>${events.map((s) => `<a class="calendar-event ${s.kind}" href="${lessonUrl(s.week, s.kind)}"><span>09:00 · W${s.week}</span><strong>${[12, 24].includes(s.week) && s.kind === 'review' ? 'Written examination' : (weeks[s.week - 1].status === 'planned' ? 'Planned · ' : '') + LABELS[s.kind]}</strong>${done(s.week, s.kind) ? icon('check') : ''}</a>${s.kind === 'review' ? `<a class="deadline" href="${lessonUrl(s.week, 'lab')}">11:00 · Lab + assignment due${[12, 24].includes(s.week) ? ' · practical' : ''}</a>` : ''}`).join('')}</div>`;
    },
  ).join(
    '',
  )}</section><section class="calendar-agenda"><div class="section-heading"><h2>Classes this month</h2><span class="subtle">${monthly.length} sessions · flexible attendance</span></div>${monthly.length ? monthly.map((s) => `<a class="agenda-row" href="${lessonUrl(s.week, s.kind)}"><span class="date-tile"><small>${dateLabel(s.date, { weekday: 'short' })}</small><strong>${dateLabel(s.date, { day: 'numeric' })}</strong></span><span><strong>${esc(weeks[s.week - 1].title)}</strong><small>Week ${s.week} · ${LABELS[s.kind]} · 9:00 AM–${s.kind === 'review' ? '11:00 AM' : '12:00 PM'} PHST</small></span>${icon(done(s.week, s.kind) ? 'check' : 'arrow')}</a>`).join('') : '<div class="panel empty-state">No scheduled classes this month. The program runs October 2026 through April 2027.</div>'}</section>`;
}

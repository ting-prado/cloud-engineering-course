import './styles.css';
import { icon, esc, pct, route, completion, progress, intro } from './ui';
import { dashboard } from './pages/dashboard';
import { syllabus } from './pages/syllabus';
import { calendar } from './pages/calendar';
import { attemptReview, lessonPage } from './pages/reader';
import { grades } from './pages/grades';
import { library } from './pages/resources';
import { capstone } from './pages/capstone';
import { settings } from './pages/settings';
import { questionsFor } from './curriculum';
import type { Kind } from './curriculum/types';
import { dateLabel, key } from './lib/academic';
import {
  data,
  saveData,
  replaceData,
  parseBackup,
  objectiveScore,
  attemptScore,
  quizKey,
  storageIssue,
  type Attempt,
  type StudentData,
} from './lib/store';

const app = document.querySelector<HTMLDivElement>('#app')!;
function notify(message: string) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.role = 'status';
  node.textContent = message;
  document.body.append(node);
  setTimeout(() => node.remove(), 4000);
}
function persist() {
  if (!saveData()) notify(storageIssue);
}
function nav() {
  const path = route();
  const links = [
    ['/', 'home', 'Overview'],
    ['/syllabus', 'book', 'Curriculum'],
    ['/calendar', 'calendar', 'Academic calendar'],
    ['/grades', 'chart', 'Gradebook'],
    ['/resources', 'folder', 'Resource library'],
    ['/capstone', 'cap', 'Capstone project'],
  ];
  return `<aside class="sidebar"><a class="brand" href="#/" aria-label="Academy home"><span class="brand-mark">A<span>∧</span></span><span>Cloud Engineering<small>ACADEMY</small></span></a><div class="workspace"><span class="avatar">S</span><div>Personal workspace<small>Azure Cloud Engineering</small></div><span class="workspace-dot"></span></div><p class="nav-label">YOUR CAMPUS</p><nav aria-label="Main navigation">${links.map(([url, i, label]) => `<a href="#${url}" class="nav-link ${path === url || (url === '/syllabus' && path.startsWith('/lesson')) ? 'active' : ''}" ${path === url ? 'aria-current="page"' : ''}>${icon(i)}<span>${label}</span>${url === '/syllabus' ? '<span class="nav-count">24</span>' : ''}</a>`).join('')}</nav><div class="sidebar-bottom"><div class="semester-mini"><div><span class="tiny-label">YOUR LEARNING JOURNEY</span><strong>${completion()}% complete</strong></div><span class="tiny-counter">${data.completed.length}/72</span>${progress(completion(), 'Program completion')}<small>One lesson at a time. You’ve got this.</small></div><a href="#/settings" class="nav-link ${path === '/settings' ? 'active' : ''}">${icon('settings')}<span>Settings & backup</span></a><div class="local-status"><span></span>Saved on this device${icon('shield')}</div></div></aside>`;
}
function render() {
  document.documentElement.dataset.theme = data.theme;
  const path = route();
  const title = path.startsWith('/lesson')
    ? 'Classroom'
    : {
        '/': 'Overview',
        '/syllabus': 'Curriculum',
        '/calendar': 'Academic calendar',
        '/grades': 'Gradebook',
        '/resources': 'Resource library',
        '/capstone': 'Capstone project',
        '/settings': 'Settings & backup',
      }[path] || 'Academy';
  app.innerHTML = `<a href="#main-content" class="skip-link" data-action="skip">Skip to main content</a>${nav()}<div class="main-shell"><header class="topbar"><div class="breadcrumbs"><button class="icon-button mobile-menu" data-action="menu" aria-label="Toggle navigation">${icon('menu')}</button><span>My campus</span>${icon('chevron')}<strong>${title}</strong></div><div class="topbar-actions"><span class="date-today">${dateLabel(new Date(), { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}<span>PHST</span></span><button class="icon-button" data-action="theme" aria-label="Switch to ${data.theme === 'light' ? 'dark' : 'light'} theme">${icon(data.theme === 'light' ? 'moon' : 'sun')}</button><span class="avatar small-avatar" title="Your personal academy">S</span></div></header>${storageIssue ? `<div class="storage-warning" role="alert">${esc(storageIssue)} <a href="#/settings">Back up data</a></div>` : ''}<main id="main-content" tabindex="-1">${page(path)}</main><footer>Built for the journey from developer to cloud engineer.<span>24 weeks · 192 learning hours · Asia/Manila</span></footer></div><div id="modal-root"></div>`;
  bindPage();
}
function page(path: string): string {
  if (path.startsWith('/lesson/')) return lessonPage(path);
  switch (path) {
    case '/':
      return dashboard();
    case '/syllabus':
      return syllabus();
    case '/calendar':
      return calendar();
    case '/grades':
      return grades();
    case '/resources':
      return library();
    case '/capstone':
      return capstone();
    case '/settings':
      return settings();
    default:
      return intro(
        'PAGE NOT FOUND',
        'Let’s find your way back.',
        'This address does not match an academy page.',
        '<a class="button primary" href="#/">Back to overview</a>',
      );
  }
}

function bindPage() {
  const search = document.querySelector<HTMLInputElement>('#syllabus-search');
  const filter = document.querySelector<HTMLSelectElement>('#syllabus-filter');
  const filterWeeks = () => {
    const query = search?.value.toLowerCase() || '';
    let visible = 0;
    document.querySelectorAll<HTMLElement>('.week-item').forEach((el) => {
      const show =
        el.dataset.search!.includes(query) &&
        (filter?.value === 'all' ||
          (filter?.value === 'complete' && el.dataset.complete === 'true') ||
          (filter?.value === 'incomplete' && el.dataset.complete === 'false'));
      el.hidden = !show;
      if (show) visible++;
    });
    document.querySelectorAll<HTMLElement>('.syllabus-module').forEach((el) => {
      el.hidden = ![...el.querySelectorAll<HTMLElement>('.week-item')].some((x) => !x.hidden);
    });
    document.querySelectorAll<HTMLElement>('.semester-section').forEach((el) => {
      el.hidden = ![...el.querySelectorAll<HTMLElement>('.syllabus-module')].some((x) => !x.hidden);
    });
    const empty = document.querySelector<HTMLElement>('.empty-search');
    if (empty) empty.hidden = visible > 0;
  };
  search?.addEventListener('input', filterWeeks);
  filter?.addEventListener('change', filterWeeks);
  document.querySelector<HTMLInputElement>('#resource-search')?.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value.toLowerCase();
    let count = 0;
    document.querySelectorAll<HTMLElement>('.library-item').forEach((el) => {
      el.hidden = !el.dataset.search!.includes(value);
      if (!el.hidden) count++;
    });
    document.querySelector<HTMLElement>('.empty-search')!.hidden = count > 0;
  });
  document.querySelector<HTMLTextAreaElement>('#lesson-notes')?.addEventListener('input', (e) => {
    const el = e.target as HTMLTextAreaElement;
    data.notes[el.dataset.note!] = el.value;
    const ok = saveData();
    document.querySelector('#notes-status')!.textContent = ok
      ? 'Saved on this device'
      : 'Storage unavailable — export now';
  });
  document.querySelectorAll<HTMLFormElement>('.submission-form').forEach((form) =>
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = new FormData(form),
        id = form.dataset.id!;
      const text = String(fields.get('evidence')).trim();
      if (!text) {
        notify('Add your evidence or submission notes first.');
        return;
      }
      data.submissions[id] = { text, date: new Date().toISOString() };
      const score = String(fields.get('score'));
      if (score === '') delete data.grades[id];
      else data.grades[id] = Number(score);
      persist();
      const y = window.scrollY;
      render();
      window.scrollTo(0, y);
      notify('Submission and self-assessment saved.');
    }),
  );
  document.querySelectorAll<HTMLInputElement>('[data-grade]').forEach((el) =>
    el.addEventListener('change', () => {
      if (!el.checkValidity()) {
        el.reportValidity();
        return;
      }
      if (el.value === '') delete data.grades[el.dataset.grade!];
      else data.grades[el.dataset.grade!] = Number(el.value);
      persist();
      const y = scrollY;
      render();
      scrollTo(0, y);
      notify('Grade saved.');
    }),
  );
  const quizForm = document.querySelector<HTMLFormElement>('#quiz-form');
  quizForm?.addEventListener('input', () => {
    data.drafts[quizKey(Number(quizForm.dataset.week))] = collectAnswers(quizForm);
    persist();
  });
  quizForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const week = Number(quizForm.dataset.week);
    const qs = questionsFor(week, [12, 24].includes(week));
    const answers = collectAnswers(quizForm);
    if (qs.some((q, i) => q.type === 'multiple' && !(answers[i] as number[])?.length)) {
      notify('Choose at least one option for every multiple-answer question.');
      return;
    }
    const score = objectiveScore(qs, answers);
    const a: Attempt = {
      id: crypto.randomUUID(),
      quiz: quizKey(week),
      date: new Date().toISOString(),
      answers,
      ...score,
      shortScores: {},
    };
    data.attempts.push(a);
    delete data.drafts[a.quiz];
    persist();
    render();
    document.querySelector(`#attempt-result-${a.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    notify('Answers submitted. Review explanations and self-assess short answers.');
  });
  document.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const status = document.querySelector('#import-status')!;
    try {
      if (file.size > 10_000_000) throw new Error('Choose a backup smaller than 10 MB.');
      const imported = parseBackup(await file.text());
      showImport(imported);
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Unable to read the backup.';
      input.value = '';
    }
  });
}
function collectAnswers(form: HTMLFormElement) {
  const week = Number(form.dataset.week);
  const fields = new FormData(form);
  const answers: Attempt['answers'] = {};
  questionsFor(week, [12, 24].includes(week)).forEach((q, i) => {
    answers[i] = q.type === 'short' ? String(fields.get(`q${i}`) || '') : fields.getAll(`q${i}`).map(Number);
  });
  return answers;
}
let pendingImport: StudentData | null = null;
function showImport(next: StudentData) {
  pendingImport = next;
  document.querySelector('#modal-root')!.innerHTML =
    `<dialog id="import-dialog"><h2>Restore this academic record?</h2><p>This backup contains ${next.completed.length} completed sessions, ${Object.keys(next.notes).length} notes, ${next.attempts.length} attempts and ${Object.keys(next.grades).length} manual grades.</p><p>Confirming replaces your current record on this browser. Export a backup first if you want to keep it.</p><div class="dialog-actions"><button class="button quiet" data-action="export">Export current record</button><button class="button quiet" data-action="cancel-import">Cancel</button><button class="button primary" data-action="confirm-import">Replace & restore</button></div></dialog>`;
  document.querySelector<HTMLDialogElement>('#import-dialog')!.showModal();
}
document.addEventListener('change', (e) => {
  const el = e.target as HTMLSelectElement;
  if (!el.matches('[data-self-score]')) return;
  const a = data.attempts.find((a) => a.id === el.dataset.selfScore)!;
  if (el.value === '') delete a.shortScores[el.dataset.question!];
  else a.shortScores[el.dataset.question!] = Number(el.value);
  persist();
  const y = scrollY;
  render();
  scrollTo(0, y);
  notify(
    attemptScore(a) === null ? 'Self-assessment saved.' : 'Assessment finalized: ' + pct(attemptScore(a)),
  );
});
document.addEventListener('click', async (e) => {
  const button = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  switch (action) {
    case 'skip':
      e.preventDefault();
      document.getElementById('main-content')?.focus();
      break;
    case 'theme':
      data.theme = data.theme === 'light' ? 'dark' : 'light';
      persist();
      {
        const y = scrollY;
        render();
        scrollTo(0, y);
      }
      break;
    case 'menu':
      document.body.classList.toggle('menu-open');
      break;
    case 'complete': {
      const id = key(Number(button.dataset.week), button.dataset.kind as Kind);
      if (data.completed.includes(id)) data.completed = data.completed.filter((x) => x !== id);
      else data.completed.push(id);
      persist();
      const y = scrollY;
      render();
      scrollTo(0, y);
      notify(
        data.completed.includes(id)
          ? 'Session completed. Well done — keep going.'
          : 'Session marked incomplete.',
      );
      break;
    }
    case 'scroll':
      document.getElementById(button.dataset.target!)?.scrollIntoView({ behavior: 'smooth' });
      break;
    case 'copy': {
      const code = button.closest('.code-block')!.querySelector('code')!.textContent!;
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Copied';
        setTimeout(() => (button.innerHTML = 'Copy ' + icon('note')), 1800);
      } catch {
        notify('Clipboard unavailable. Select the command text to copy it.');
      }
      break;
    }
    case 'month': {
      const [y, m] = data.calendarMonth.split('-').map(Number);
      const d = new Date(Date.UTC(y, m - 1 + Number(button.dataset.delta), 1));
      data.calendarMonth = d.toISOString().slice(0, 7);
      persist();
      render();
      break;
    }
    case 'calendar-now': {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
      }).formatToParts(new Date());
      data.calendarMonth = `${parts.find((p) => p.type === 'year')!.value}-${parts.find((p) => p.type === 'month')!.value}`;
      persist();
      render();
      break;
    }
    case 'export': {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cloud-academy-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify('Backup exported. Keep a copy somewhere safe.');
      break;
    }
    case 'cancel-import':
      document.querySelector<HTMLDialogElement>('#import-dialog')?.close();
      pendingImport = null;
      break;
    case 'confirm-import':
      if (pendingImport) {
        replaceData(pendingImport);
        pendingImport = null;
        render();
        notify(storageIssue || 'Your academic record has been restored.');
      }
      break;
    case 'attempt': {
      const a = data.attempts.find((a) => a.id === button.dataset.id);
      if (a) {
        document.querySelector('#modal-root')!.innerHTML =
          `<dialog id="attempt-dialog" class="attempt-dialog"><button class="button quiet" data-action="close-attempt">Close review</button>${attemptReview(a)}</dialog>`;
        document.querySelector<HTMLDialogElement>('#attempt-dialog')!.showModal();
      }
      break;
    }
    case 'close-attempt':
      document.querySelector<HTMLDialogElement>('#attempt-dialog')?.close();
      break;
  }
});
window.addEventListener('hashchange', () => {
  document.body.classList.remove('menu-open');
  render();
  window.scrollTo(0, 0);
  const anchor = location.hash.split('#')[2];
  if (anchor) document.getElementById(anchor)?.scrollIntoView();
});
// Module links keep the route simple while scrolling to the selected section.
document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#/syllabus?module="]');
  if (link) {
    e.preventDefault();
    const module = link.hash.split('=')[1];
    if (route() !== '/syllabus') {
      location.hash = '/syllabus';
      setTimeout(() => document.getElementById(`module-${module}`)?.scrollIntoView(), 30);
    } else document.getElementById(`module-${module}`)?.scrollIntoView();
  }
});
render();

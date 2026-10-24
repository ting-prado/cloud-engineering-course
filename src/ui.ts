import { labRubric, weeks } from './curriculum';
import type { Kind, Resource, Section } from './curriculum/types';
import { allSessions, key } from './lib/academic';
import { data } from './lib/store';

export const iconPaths: Record<string, string> = {
  home: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  book: '<path d="M12 5v16M12 5C8 2 4 3 2 4v15c3-1 6-1 10 2 4-3 7-3 10-2V4c-3-1-6-2-10 1Z"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h1m6 0h1"/>',
  chart: '<path d="M4 3v18h17M8 16v-5m5 5V7m5 9v-3"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v8"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  moon: '<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>',
  settings: '<path d="M9 3h6l1 4 4 1v8l-4 1-1 4H9l-1-4-4-1V8l4-1Z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  external: '<path d="M14 3h7v7m0-7L10 14M9 4H4v16h16v-5"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-16-2 20"/>',
  play: '<path d="m8 4 12 8-12 8V4Z"/>',
  note: '<path d="M4 3h16v14l-4 4H4V3Zm12 18v-4h4M8 8h8m-8 4h6"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 1-10 6 6 0 0 1 11 2 4 4 0 0 1-1 8H7Z"/>',
  shield: '<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
};
export function icon(name: string, cls = '') {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.book}</svg>`;
}
export const esc = (v: unknown) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
export const pct = (n: number | null) => (n === null ? '—' : `${n.toFixed(1)}%`);
export const route = () => location.hash.slice(1).split('?')[0] || '/';
export const lessonUrl = (week: number, kind: Kind) => `#/lesson/${week}/${kind}`;
export const done = (week: number, kind: Kind) => data.completed.includes(key(week, kind));
export const completion = () => Math.round((data.completed.length / 72) * 100);
export const nextLesson = () =>
  allSessions().find((s) => weeks[s.week - 1].status === 'ready' && !data.completed.includes(s.id));
export const pill = (text: string, cls = '') => `<span class="pill ${cls}">${esc(text)}</span>`;
export const progress = (value: number, label: string) =>
  `<div class="progress" role="progressbar" aria-label="${esc(label)}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"><span style="width:${value}%"></span></div>`;
export const intro = (eyebrow: string, title: string, description: string, action = '') =>
  `<div class="page-intro"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="subtle">${description}</p></div>${action}</div>`;
export function codeBlock(code: string, language = 'shell') {
  return `<div class="code-block"><div class="code-header"><span>${esc(language)}</span><button data-action="copy" aria-label="Copy code">Copy ${icon('note')}</button></div><pre><code>${highlight(code)}</code></pre></div>`;
}
export function highlight(code: string) {
  return code
    .split('\n')
    .map((line) => {
      if (/^\s*(#|\/\/)/.test(line)) return `<span class="syntax-comment">${esc(line)}</span>`;
      return esc(line)
        .replace(/(&quot;.*?&quot;|&#39;.*?&#39;)/g, '<span class="syntax-string">$1</span>')
        .replace(
          /^(\s*)(az |docker |kubectl |terraform |Get-Az|curl |python |mkdir |chmod |set |param |resource |FROM |COPY )/,
          '$1<span class="syntax-keyword">$2</span>',
        );
    })
    .join('\n');
}
export function paragraphs(text: string) {
  return text
    .split('\n\n')
    .map((p) => `<p>${esc(p)}</p>`)
    .join('');
}
export function section(s: Section, i: number) {
  const teaching = s.concept
    ? `<div class="concept-explanation"><h3>What is it?</h3>${paragraphs(s.concept.what)}<h3>Why do we need it?</h3>${paragraphs(s.concept.why)}<h3>How does it work?</h3><ol>${s.concept.how.map((step) => `<li>${esc(step)}</li>`).join('')}</ol><h3>Real example</h3>${paragraphs(s.concept.example)}<aside class="callout"><strong>What should I remember?</strong>${paragraphs(s.concept.remember)}</aside></div>`
    : '';
  const guidance = `${s.purpose ? `<p><strong>Why you are doing this:</strong> ${esc(s.purpose)}</p>` : ''}${s.steps ? `<h3>What to do</h3><ol>${s.steps.map((step) => `<li>${esc(step)}</li>`).join('')}</ol>` : ''}${(s.commands || []).map((c) => `<div class="command-guide"><p><strong>Where to run it:</strong> ${esc(c.where)}</p>${codeBlock(c.command, c.language || 'shell')}<p><strong>What it does:</strong> ${esc(c.does)}</p>${c.options ? `<p><strong>Options:</strong> ${esc(c.options)}</p>` : ''}<p><strong>Expected result:</strong> ${esc(c.expect)}</p><p><strong>If it fails:</strong> ${esc(c.ifFails)}</p></div>`).join('')}${s.expected ? `<p><strong>What to expect:</strong> ${esc(s.expected)}</p>` : ''}${s.evidence ? `<h3>What to submit</h3><ul>${s.evidence.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}${(s.checks || []).map((c) => `<div class="comprehension-check"><p><strong>Pause and think:</strong> ${esc(c.question)}</p><details><summary>Show explanation</summary>${paragraphs(c.answer)}</details></div>`).join('')}`;
  if (s.concept || s.steps || s.commands || s.checks || s.evidence || s.purpose || s.expected) {
    const diagram = s.diagram
      ? `<figure class="flow-diagram">${s.diagram.map((d, j) => `${j ? '<span class="flow-arrow">↓</span>' : ''}<div><span>${esc(d)}</span></div>`).join('')}<figcaption>Follow the request from the browser to the API and its data.</figcaption></figure>`
      : '';
    return `<section class="prose-section" id="section-${i}"><h2>${esc(s.title)}</h2>${paragraphs(s.body)}${teaching}${diagram}${s.code ? codeBlock(s.code, s.language) : ''}${guidance}</section>`;
  }
  return `<section class="prose-section" id="section-${i}">${i < 100 ? `<span class="section-number">${String(i + 1).padStart(2, '0')}</span>` : ''}<h2>${esc(s.title)}</h2>${paragraphs(s.body)}${s.diagram ? `<figure class="flow-diagram">${s.diagram.map((d, j) => `${j ? '<span class="flow-arrow">↓</span>' : ''}<div>${icon(j === 0 ? 'cloud' : j === s.diagram!.length - 1 ? 'folder' : 'code')}<span>${esc(d)}</span></div>`).join('')}<figcaption>A request crosses several responsibilities. Investigate each boundary.</figcaption></figure>` : ''}${s.code ? codeBlock(s.code, s.language) : ''}</section>`;
}
export function resources(items: Resource[]) {
  return `<section id="resources" class="resource-section"><h2>Selected references</h2><p class="subtle">The lesson explains the required ideas on this page. For further reading, use only the sections named below within the planned time. You do not need to read the whole documentation site. Links open in a new tab.</p><div class="resource-list">${items.map((r) => `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" class="resource-card">${icon(r.type === 'Video' ? 'play' : 'book')}<span><small>${esc(r.provider)} · ${r.type}</small><strong>${esc(r.title)}</strong><p>${esc(r.description)}</p>${r.selection ? `<p><strong>Scope:</strong> ${esc(r.selection)}</p>` : ''}<em>${r.verified ? 'Content inspected' + (r.reviewedOn ? ' · ' + esc(r.reviewedOn) : '') : 'Availability not individually verified'}</em></span>${icon('external')}</a>`).join('')}</div></section>`;
}
export function rubric(items = labRubric) {
  return `<div class="table-scroll" role="region" aria-label="Grading rubric" tabindex="0"><table class="rubric-table"><thead><tr><th>Criterion</th><th>What good looks like</th><th>Points</th></tr></thead><tbody>${items.map((i) => `<tr><td>${i.name}</td><td>${i.description}</td><td>${i.points}</td></tr>`).join('')}</tbody><tfoot><tr><td colspan="2">Total · self-assess with evidence</td><td>100</td></tr></tfoot></table></div>`;
}

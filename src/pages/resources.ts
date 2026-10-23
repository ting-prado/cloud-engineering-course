import { weeks } from '../curriculum';

import { icon, esc, lessonUrl, intro, resources } from '../ui';

export function library() {
  const unique = [...new Map(weeks.flatMap((w) => w.resources).map((r) => [r.url, r])).values()];
  return `${intro('YOUR REFERENCE SHELF', 'Go deeper, with good sources.', 'The references used throughout the program, gathered in one place. Lecture pages provide the context and exercises.')}<label class="search-field library-search">${icon('search')}<input id="resource-search" type="search" aria-label="Search resources" placeholder="Search resources, providers or topics…"></label><p class="subtle">${unique.length} references · Provider durations are shown only when known. Unreviewed availability is labeled individually.</p><div class="library-grid">${unique
    .map(
      (r) =>
        `<div class="library-item" data-search="${esc((r.title + ' ' + r.provider + ' ' + r.description).toLowerCase())}">${resources([r])}<div class="resource-weeks">Used in ${weeks
          .filter((w) => w.resources.some((x) => x.url === r.url))
          .map((w) => `<a href="${lessonUrl(w.number, 'lecture')}">W${w.number}</a>`)
          .join('')}</div></div>`,
    )
    .join('')}</div><p class="empty-search" hidden>No references match your search.</p>`;
}

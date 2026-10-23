import { data, storageIssue } from '../lib/store';
import { weeks as legacyWeeks } from '../curriculum/legacy';
import { icon, intro, esc } from '../ui';
function archives() {
  return `<section class="panel"><h2>Versioned progress archives</h2><p>R2 uses a new curriculum and assessment mapping. Legacy completions, scores, notes, drafts and submissions are retained as history; they never count toward redesigned lessons. The original version-1 browser key is not deleted. Export a backup before clearing site data or changing origins.</p>${
    data.archives.length
      ? data.archives
          .map((a) => {
            const old = JSON.parse(a.raw);
            return `<details><summary>${a.schema === 1 ? 'Original curriculum · version 1' : 'Earlier R2 active snapshot'} · ${esc(a.date.slice(0, 10))}</summary><p>${old.completed.length} completions · ${old.attempts.length} attempts · ${Object.keys(old.notes).length} notes · ${Object.keys(old.grades).length} manual grades. All original values are preserved in the downloadable JSON.</p><h3>Historical manual grades</h3><ul>${
              Object.entries(old.grades)
                .map(
                  ([id, score]) =>
                    `<li>${a.schema === 1 ? esc(legacyWeeks[Number(id.split('-')[0]) - 1]?.title) : 'R2 Week ' + esc(id.split('-')[0])} · ${esc(id)}: ${esc(score)}/100</li>`,
                )
                .join('') || '<li>No recorded manual grades.</li>'
            }</ul><h3>Historical attempts</h3><ul>${old.attempts.map((attempt: { quiz: string; earned: number; possible: number; date: string }) => `<li>${esc(attempt.quiz)} · objective ${esc(attempt.earned)}/${esc(attempt.possible)} · ${esc(attempt.date.slice(0, 10))}. Original self-scores and answers are in the archive, not regraded against R2.</li>`).join('') || '<li>No attempts.</li>'}</ul><button class="button quiet" data-action="archive-export" data-id="${esc(a.id)}">${icon('download')} Download original archived JSON</button></details>`;
          })
          .join('')
      : '<p>No historical record was found on this browser origin. If your earlier progress is on another device or URL, import its version-1 JSON to preserve it here.</p>'
  }</section>`;
}
export function settings() {
  return `${intro('YOUR VERSIONED LEARNING RECORD', 'Your learning, safely kept.', 'Current R2 progress and historical records are separate. This application has no server-side student storage.')}<div class="settings-grid"><section class="panel"><h2>Export current data and archives</h2>${storageIssue ? `<p role="alert">${esc(storageIssue)}</p><button class="button quiet" data-action="recovery-export">Download original browser record</button>` : ''}<p>Download a version-2 JSON containing current completions, notes, diagnostic/quiz attempts, drafts, submissions, self-scores and all historical archives. The file is not encrypted.</p><div class="backup-stats"><span><strong>${data.completed.length}</strong> current completions</span><span><strong>${data.archives.length}</strong> historical records</span></div><button class="button primary" data-action="export">${icon('download')} Export student data</button></section><section class="panel"><h2>Restore or preserve a previous backup</h2><p>Version 2 restores the matching R2 record. Version 1 imports as archived history with fresh R2 progress; historical scores are never remapped. A valid import shows a confirmation before replacement. Existing archives are retained and current active work is snapshotted.</p><label class="file-picker">Choose backup<input id="import-file" type="file" accept="application/json,.json"></label><p id="import-status" role="status">Schema, curriculum and assessment versions are validated before confirmation. Limit: 25 MB.</p></section>${archives()}<section class="panel"><h2>Appearance</h2><p>Your existing text scale and themes are unchanged.</p><button class="button quiet" data-action="theme">${icon(data.theme === 'light' ? 'moon' : 'sun')} Switch to ${data.theme === 'light' ? 'dark' : 'light'} theme</button><h2>Stage 1 academic status</h2><p>Week 1 is ready. Weeks 2–24 are approved syllabus plans, not authored sessions. Weighted grades describe recorded work; practical mastery gates and later examinations remain planned, so this release cannot award full program completion.</p><p>Oct 24, 2026–Apr 9, 2027 · Asia/Manila · 192 scheduled hours.</p></section></div>`;
}

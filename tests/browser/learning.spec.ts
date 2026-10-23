import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { emptyData as legacyEmpty } from '../../src/lib/legacy-store';
import { questionsForAssessment } from '../../src/curriculum';
import {
  extractWorkload,
  freePort,
  startWorkload,
  stopWorkload,
  cleanupWorkload,
} from '../workload-helpers.mjs';

const report =
  'UI test report, not a student competency claim: initial document 200 and API failure were recorded; listener and target evidence informed a scoped correction, followed by a fresh request. Supplied/observed evidence must be distinguished.';
function legacy() {
  const old = legacyEmpty();
  old.completed = ['1-lecture', '7-review'];
  old.notes['7-review'] = 'Original Linux note';
  old.grades['1-lab'] = 92;
  old.attempts = [
    {
      id: 'old-attempt',
      quiz: '1-quiz',
      date: '2026-10-23T01:00:00Z',
      answers: { 0: [1], 1: [0, 2], 2: [1], 3: 'Original response' },
      earned: 3,
      possible: 3,
      shortScores: { 3: 2 },
    },
  ];
  old.theme = 'dark';
  return old;
}
async function fillDiagnostic(page) {
  for (const [i, q] of questionsForAssessment('1-diagnostic').entries()) {
    if (q.type === 'short')
      await page
        .locator(`#diagnostic-form textarea[name=q${i}]`)
        .fill('Prior knowledge reflection; this baseline is not a graded execution claim.');
    else
      for (const answer of q.answer)
        await page.locator(`#diagnostic-form input[name=q${i}][value="${answer}"]`).check();
  }
}
async function fillQuiz(page) {
  for (const [i, answers] of [
    [0, [2]],
    [1, [1]],
    [2, [0, 2]],
    [3, [0]],
    [4, [3]],
    [5, [1, 3]],
    [6, [1]],
  ] as [number, number[]][])
    for (const answer of answers)
      await page.locator(`#quiz-form input[name=q${i}][value="${answer}"]`).check();
  await page
    .locator('#quiz-form textarea[name=q7]')
    .fill(
      'The directly available API and refused upstream target differ. Inspect and align the proxy target while preserving assigned listeners, reload configuration, and retest the original proxied request. This does not validate every dependency.',
    );
}

test('Week 1 diagnostic, learning, notes, quiz, self-score, submissions and export persist', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('link', { name: 'Continue Learning' }).click();
  await expect(page.locator('.lesson-heading h1')).toHaveText('Infrastructure through a known application');
  await expect(page.locator('#diagnostic-form')).toContainText('UNGRADED DIAGNOSTIC');
  await expect(page.locator('.attempt-review')).toHaveCount(0);
  await page.locator('#diagnostic-form input[name=q0][value="2"]').check();
  await page.reload();
  await expect(page.locator('#diagnostic-form input[name=q0][value="2"]')).toBeChecked();
  await fillDiagnostic(page);
  await page.getByRole('button', { name: 'Submit diagnostic reflection' }).click();
  await expect(page.locator('.attempt-review')).toContainText('Reflection saved · no grade or pass mark');
  await expect(page.locator('[data-self-score]')).toHaveCount(0);
  await page
    .locator('#lesson-notes')
    .fill('Browser executes React; web and API are distinct processes. <b>Literal notes</b>');
  await page.reload();
  await expect(page.locator('#lesson-notes')).toHaveValue(
    'Browser executes React; web and API are distinct processes. <b>Literal notes</b>',
  );
  await expect(page.getByRole('button', { name: 'Mark as complete', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Mark as complete', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Mark incomplete' })).toBeVisible();
  await page.goto('/#/grades');
  await expect(page.locator('.grade-summary').first()).toContainText('—');
  await expect(page.locator('#grade-2-lab')).toBeDisabled();
  await page.goto('/#/lesson/1/lab');
  await expect(page.locator('#incident-feedback')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Download ready-to-run workload' })).toBeVisible();
  await page.locator('#submission-1-lab').fill(report);
  await page.locator('form[data-id="1-lab"] input[name=score]').fill('85');
  await page.locator('form[data-id="1-lab"] button[type=submit]').click();
  await expect(page.locator('#incident-feedback')).toContainText('API listens on 4300');
  await page.reload();
  await expect(page.locator('#incident-feedback')).toBeAttached();
  await page.goto('/#/lesson/1/review');
  await expect(page.locator('.attempt-review')).toHaveCount(0);
  await expect(page.locator('#assignment')).not.toContainText('Wednesday case feedback');
  await fillQuiz(page);
  await page.getByRole('button', { name: 'Submit answers', exact: true }).click();
  await expect(page.locator('.attempt-review')).toContainText('Objective score: 7 / 7');
  await expect(page.locator('.attempt-review')).toContainText('finalize this attempt');
  await page.locator('[data-self-score]').selectOption('2');
  await expect(page.locator('.attempt-review')).toContainText('Final score: 100.0%');
  await page.locator('#submission-1-assignment').fill(report);
  await page.locator('form[data-id="1-assignment"] button[type=submit]').click();
  await expect(page.locator('#assignment')).toContainText('Wednesday case feedback');
  await page.reload();
  await expect(page.locator('.attempt-review')).toContainText('Final score: 100.0%');
  await page.goto('/#/settings');
  const exported = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export student data' }).click();
  const download = await exported;
  const filename = await download.path();
  const backup = JSON.parse(await fs.readFile(filename!, 'utf8'));
  expect(backup.version).toBe(2);
  expect(backup.curriculumId).toBe('azure-2026-r2');
  expect(backup.attempts).toHaveLength(2);
  expect(backup.grades['1-lab']).toBe(85);
  await page.locator('#import-file').setInputFiles(filename!);
  await expect(page.getByRole('dialog')).toContainText('archived records');
  await page.getByRole('button', { name: 'Replace & restore' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Switch to dark theme' }).first().click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});
test('first R2 load backs up exact v1 progress; historical grades never enter new Week 1', async ({
  page,
}) => {
  const raw = JSON.stringify(legacy());
  await page.addInitScript((raw) => {
    if (!localStorage.getItem('cloud-academy-v1')) localStorage.setItem('cloud-academy-v1', raw);
  }, raw);
  await page.goto('/');
  const stored = await page.evaluate(() => ({
    original: localStorage.getItem('cloud-academy-v1'),
    current: JSON.parse(localStorage.getItem('cloud-academy-v2')!),
    backupKeys: Object.keys(localStorage).filter((k) => k.startsWith('cloud-academy-archive-before-r2-')),
  }));
  expect(stored.original).toBe(raw);
  expect(stored.current.completed).toEqual([]);
  expect(stored.current.attempts).toEqual([]);
  expect(stored.current.grades).toEqual({});
  expect(stored.current.archives[0].raw).toBe(raw);
  expect(stored.backupKeys).toHaveLength(1);
  await page.goto('/#/settings');
  await page.getByText('Original curriculum · version 1', { exact: false }).click();
  await expect(page.locator('main')).toContainText('Inside the infrastructure');
  await expect(page.locator('main')).toContainText('92/100');
  const exported = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download original archived JSON' }).click();
  const file = await (await exported).path();
  expect(await fs.readFile(file!, 'utf8')).toBe(raw);
  await page.reload();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('cloud-academy-v2')!).archives.length),
  ).toBe(1);
  await page.goto('/#/lesson/1/review');
  await expect(page.locator('.attempt-review')).toHaveCount(0);
  await page.goto('/#/grades');
  await expect(page.locator('#grade-1-lab')).toHaveValue('');
});
test('v1 import is archived and invalid import changes nothing', async ({ page }) => {
  await page.goto('/#/lesson/1/lecture');
  await page.locator('#lesson-notes').fill('A current R2 note to preserve before importing history.');
  await page.goto('/#/settings');
  await page.locator('#import-file').setInputFiles({
    name: 'legacy.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(legacy())),
  });
  await expect(page.getByRole('dialog')).toContainText('0 current completions');
  await page.getByRole('button', { name: 'Replace & restore' }).click();
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('cloud-academy-v2')!));
  expect(after.archives).toHaveLength(2);
  expect(after.attempts).toEqual([]);
  expect(after.archives.some((a) => a.schema === 2 && JSON.parse(a.raw).notes['1-lecture'])).toBeTruthy();
  const before = await page.evaluate(() => localStorage.getItem('cloud-academy-v2'));
  await page
    .locator('#import-file')
    .setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"version":99}') });
  await expect(page.locator('#import-status')).toContainText('Unsupported');
  expect(await page.evaluate(() => localStorage.getItem('cloud-academy-v2'))).toBe(before);
});
test('all 72 routes show ready Week 1 or honest planned outlines without old questions', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (let n = 1; n <= 24; n++)
    for (const kind of ['lecture', 'lab', 'review']) {
      await page.goto(`/#/lesson/${n}/${kind}`);
      await expect(page.locator('.lesson-heading h1')).toBeVisible();
      if (n === 1) await expect(page.locator('#lesson-notes')).toBeAttached();
      else {
        await expect(page.locator('main')).toContainText('PLANNED · NOT READY');
        await expect(page.locator('form')).toHaveCount(0);
        await expect(page.locator('[data-action=complete]')).toHaveCount(0);
      }
    }
  await page.goto('/#/syllabus');
  await expect(page.locator('.week-item')).toHaveCount(24);
  await expect(page.locator('main')).toContainText('Terraform II: state, modules and drift');
  expect(await page.locator('.week-item .pill').filter({ hasText: 'Planned' }).count()).toBe(23);
  await page.locator('#syllabus-search').fill('DNS');
  expect(await page.locator('.week-item:visible').count()).toBeGreaterThan(0);
  for (const path of ['calendar', 'grades', 'resources', 'capstone', 'settings']) {
    await page.goto(`/#/${path}`);
    await expect(page.locator('main h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('failed browser archive preserves v1 and exposes an exact recovery download', async ({ page }) => {
  const raw = JSON.stringify(legacy());
  await page.addInitScript((raw) => {
    localStorage.setItem('cloud-academy-v1', raw);
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith('cloud-academy-archive-before-r2-'))
        throw new DOMException('Test quota', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  }, raw);
  await page.goto('/');
  await expect(page.locator('.storage-warning')).toContainText('safely loaded or archived');
  expect(await page.evaluate(() => localStorage.getItem('cloud-academy-v1'))).toBe(raw);
  expect(await page.evaluate(() => localStorage.getItem('cloud-academy-v2'))).toBe(null);
  await page.goto('/#/settings');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download original browser record' }).click();
  const downloaded = await pending;
  expect(await fs.readFile((await downloaded.path())!, 'utf8')).toBe(raw);
});
test('study completion never implies full program graduation; themes and responsive layout remain', async ({
  page,
}) => {
  for (const kind of ['lecture', 'lab', 'review']) {
    await page.goto(`/#/lesson/1/${kind}`);
    await page.getByRole('button', { name: 'Mark as complete', exact: true }).click();
  }
  await page.goto('/');
  await expect(page.locator('.hero')).toContainText('Week 1 study sessions recorded');
  await expect(page.getByRole('link', { name: 'View revised syllabus' })).toBeVisible();
  await page.goto('/#/grades');
  await expect(page.locator('.grade-summary')).not.toContainText('Program complete');
  for (const width of [390, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      '/',
      '/lesson/1/lecture',
      '/lesson/1/lab',
      '/lesson/1/review',
      '/syllabus',
      '/grades',
    ]) {
      await page.goto('/#' + route);
      await expect(page.locator('main')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  await page.getByRole('button', { name: 'Switch to dark theme' }).first().click();
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(19, 29, 25)');
});
test('built subdirectory navigation and workload download work without a backend', async ({ page }) => {
  await page.goto('/dist/#/lesson/1/lecture');
  await expect(page.locator('#diagnostic-form')).toBeVisible();
  await page.reload();
  await expect(page.locator('.lesson-heading h1')).toContainText('known application');
  const response = await page.request.get('/dist/labs/week-01-workload.zip');
  expect(response.status()).toBe(200);
  expect((await response.body()).readUInt32LE(0)).toBe(0x04034b50);
  await page.goto('/dist/#/lesson/24/review');
  await expect(page.locator('main')).toContainText('PLANNED · NOT READY');
});
test('actual downloaded React/Node app runs in separate processes and survives restart correctly', async ({
  page,
}) => {
  const root = await extractWorkload();
  const apiPort = await freePort();
  let webPort = await freePort();
  while (webPort === apiPort) webPort = await freePort();
  const config = { apiPort, webPort, upstreamPort: apiPort, dataFile: 'data/guided.json' };
  let running = await startWorkload(root, config);
  try {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const apiPid = running.logs.match(/\[api (\d+)\] Listening/)![1],
      webPid = running.logs.match(/\[web (\d+)\] Listening/)![1];
    expect(apiPid).not.toBe(webPid);
    // A slow sample response must finish before the student can edit/save it.
    await page.route('**/api/sample', async (route) => {
      if (route.request().method() === 'GET') await new Promise((resolve) => setTimeout(resolve, 120));
      await route.continue();
    });
    await page.goto(running.url);
    await expect(page.getByRole('heading', { name: 'Request notebook' })).toBeVisible();
    await page.getByRole('button', { name: 'Refresh API status' }).click();
    await expect(page.locator('pre')).toContainText(`"port": ${apiPort}`);
    await page.getByRole('button', { name: 'Increment volatile counter' }).click();
    await expect(page.locator('pre')).toContainText('"counter": 1');
    await page.getByRole('button', { name: 'Increment volatile counter' }).click();
    await expect(page.locator('pre')).toContainText('"counter": 2');
    await page
      .getByRole('textbox', { name: 'Dummy persisted sample' })
      .fill('Browser-tested persisted phrase');
    await page.getByRole('button', { name: 'Save dummy sample' }).click();
    await expect
      .poll(async () => (await (await page.request.get(running.url + '/api/sample')).json()).text)
      .toBe('Browser-tested persisted phrase');
    await stopWorkload(running);
    running = await startWorkload(root, config);
    await page.reload();
    await page.getByRole('button', { name: 'Refresh API status' }).click();
    await expect(page.locator('pre')).toContainText('"counter": 0');
    await expect(page.getByRole('textbox', { name: 'Dummy persisted sample' })).toHaveValue(
      'Browser-tested persisted phrase',
    );
    await stopWorkload(running);
    const bad = await freePort();
    running = await startWorkload(root, { ...config, upstreamPort: bad });
    await page.reload();
    await page.getByRole('button', { name: 'Refresh API status' }).click();
    await expect(page.getByRole('alert')).toContainText('502');
    expect((await page.request.get(running.apiUrl + '/api/status')).status()).toBe(200);
    expect((await page.request.get(running.url + '/missing.html')).status()).toBe(404);
    await stopWorkload(running);
    running = await startWorkload(root, config, 'incident');
    await page.reload();
    await page.getByRole('button', { name: 'Refresh API status' }).click();
    await expect(page.locator('pre')).toContainText('"counter": 0');
    await expect(page.getByRole('alert')).toHaveCount(0);
    await stopWorkload(running);
    let variedWeb = await freePort();
    while (variedWeb === apiPort) variedWeb = await freePort();
    running = await startWorkload(
      root,
      { ...config, webPort: variedWeb, dataFile: 'data/variation.json' },
      'variation',
    );
    await page.goto(running.url);
    await page.getByRole('button', { name: 'Refresh API status' }).click();
    await expect(page.locator('pre')).toContainText(`"port": ${apiPort}`);
    await expect(page.getByRole('textbox', { name: 'Dummy persisted sample' })).toHaveValue(
      'A persisted dummy sample',
    );
    expect(errors).toEqual([]);
  } finally {
    await stopWorkload(running);
    await cleanupWorkload(root);
  }
});

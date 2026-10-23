import { test, expect } from '@playwright/test';

test('Week 1 learning, notes, assessment, submission and backup survive refresh', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Continue Learning' })).toBeVisible();
  await page.getByRole('link', { name: 'Continue Learning' }).click();
  await expect(page.getByRole('heading', { name: 'Inside the infrastructure', exact: true })).toBeVisible();
  await expect(page.locator('.lesson-prose')).toContainText('A repository stores instructions');
  await page.locator('#lesson-notes').fill('CPU executes; RAM holds active objects. <b>safe text</b>');
  await page.reload();
  await expect(page.locator('#lesson-notes')).toHaveValue(
    'CPU executes; RAM holds active objects. <b>safe text</b>',
  );
  await expect(page.getByRole('button', { name: 'Mark as complete', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Mark as complete', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Mark incomplete' })).toBeVisible();
  await page.goto('/#/lesson/1/lab');
  await page.locator('#submission-1-lab').fill('Inventory, HTTP 200, 404 and stopped-server evidence.');
  await page.locator('.submission-form[data-id="1-lab"] input[name="score"]').fill('85');
  await page.locator('.submission-form[data-id="1-lab"] button[type="submit"]').click();
  await expect(page.locator('.submission-form[data-id="1-lab"]')).toContainText('Submitted');
  await page.goto('/#/lesson/1/review');
  await expect(page.locator('.answer-review')).toHaveCount(0);
  await page.locator('input[name="q0"][value="1"]').check();
  await page.locator('input[name="q1"][value="0"]').check();
  await page.locator('input[name="q1"][value="2"]').check();
  await page.locator('input[name="q2"][value="1"]').check();
  await page
    .locator('textarea[name="q3"]')
    .fill('Cart state was in RAM; catalog data was persisted. Verify configuration and logs.');
  await page.getByRole('button', { name: 'Submit answers' }).click();
  await expect(page.locator('.attempt-review')).toContainText('Objective score: 3 / 3');
  await page.locator('[data-self-score]').selectOption('2');
  await expect(page.locator('.attempt-review')).toContainText('Final score: 100.0%');
  await page.reload();
  await expect(page.locator('.attempt-review')).toContainText('Final score: 100.0%');
  await page.goto('/#/grades');
  await expect(page.locator('#grade-1-lab')).toHaveValue('85');
  await expect(page.locator('tbody').last()).toContainText('100.0%');
  await page.goto('/#/settings');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export student data' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/cloud-academy-backup/);
  const file = await download.path();
  expect(file).toBeTruthy();
  await page.locator('#import-file').setInputFiles(file!);
  await expect(page.getByRole('dialog')).toContainText('Restore this academic record?');
  await page.getByRole('button', { name: 'Replace & restore' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Switch to dark theme' }).first().click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});
test('all session routes and navigation pages render without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const n of Array.from({ length: 24 }, (_, i) => i + 1))
    for (const kind of ['lecture', 'lab', 'review']) {
      await page.goto(`/#/lesson/${n}/${kind}`);
      await expect(page.locator('.lesson-heading h1')).toBeVisible();
      await expect(page.locator('#lesson-notes')).toBeAttached();
      expect((await page.locator('.lesson-prose').innerText()).length).toBeGreaterThan(500);
    }
  for (const path of ['syllabus', 'calendar', 'grades', 'resources', 'capstone', 'settings']) {
    await page.goto(`/#/${path}`);
    await expect(page.locator('main h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test('calendar, syllabus filtering, import protection and mobile reader', async ({ page }) => {
  await page.goto('/#/calendar');
  await expect(page.getByRole('heading', { name: 'October 2026' })).toBeVisible();
  await expect(page.locator('.calendar-event.lecture').first()).toContainText('W1');
  await page.getByRole('button', { name: 'Next month' }).click();
  await expect(page.getByRole('heading', { name: 'November 2026' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'November 2026' })).toBeVisible();
  await page.goto('/#/syllabus');
  await page.locator('#syllabus-search').fill('DNS');
  expect(await page.locator('.week-item:visible').count()).toBeGreaterThan(0);
  expect(await page.locator('.week-item:visible').count()).toBeLessThan(24);
  await page.goto('/#/settings');
  await page
    .locator('#import-file')
    .setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"version":99}') });
  await expect(page.locator('#import-status')).toContainText('Unsupported');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Continue Learning' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/mobile-dashboard.png', fullPage: true });
  await page.getByRole('link', { name: 'Continue Learning' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await expect(page.getByRole('link', { name: 'Gradebook', exact: true })).toBeVisible();
});
test('desktop dashboard visual record', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/desktop-dashboard.png', fullPage: true });
});
test('built assets and refreshed lesson route work from a subdirectory', async ({ page }) => {
  await page.goto('/dist/#/lesson/24/review');
  await expect(page.locator('.lesson-heading h1')).toContainText('Examination');
  await page.reload();
  await expect(page.locator('#quiz-form')).toBeVisible();
  expect(await page.locator('script[src*="./assets/"]').count()).toBe(1);
});

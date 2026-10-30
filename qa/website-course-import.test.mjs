import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('admin import page exposes the five-step website-to-course workflow', async () => {
  const page = await source('src/features/content-import/pages/AdminImportPage.jsx');
  const wizard = await source('src/features/content-import/components/WebsiteImportWizard.jsx');
  assert.match(page, /WebsiteImportWizard/);
  for (const label of ['Nguồn import', 'Phân tích', 'Cấu trúc khóa học', 'Nội dung & media', 'Lưu bản nháp']) {
    assert.ok(wizard.includes(label), `missing wizard step: ${label}`);
  }
  assert.match(wizard, /SINGLE_LESSON/);
  assert.match(wizard, /FULL_COURSE/);
  assert.match(wizard, /analyzeFile/);
  assert.match(wizard, /Retry kiểm tra media/);
  assert.match(wizard, /rightsConfirmed/);
  assert.match(wizard, /Course Builder/);
});

test('import review supports structure edits, block edits, provenance, and safe HTML', async () => {
  const wizard = await source('src/features/content-import/components/WebsiteImportWizard.jsx');
  const service = await source('src/features/content-import/api/websiteImportService.js');
  const safeHtml = await source('src/shared/components/common/SafeImportedHtml.jsx');
  for (const contract of ['mergePrevious', 'splitLesson', 'moveLesson', 'orderIndex', 'sourcePageUrl', 'originalUrl', 'attribution', 'license', 'importStatus']) {
    assert.ok(wizard.includes(contract), `missing import review contract: ${contract}`);
  }
  assert.match(service, /\/draft/);
  assert.match(service, /\/save/);
  assert.match(service, /retry-media/);
  assert.match(safeHtml, /ALLOWED_TAGS/);
  assert.match(safeHtml, /\['http:', 'https:'\]/);
});

test('lesson player renders source HTML only through the imported HTML sanitizer', async () => {
  const player = await source('src/features/learning/components/learning/LessonActivities.jsx');
  assert.match(player, /content\.importedExact && content\.html/);
  assert.match(player, /<SafeImportedHtml html=\{content\.html\}/);
  assert.match(player, /content\.embedUrl/);
});

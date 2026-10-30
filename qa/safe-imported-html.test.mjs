import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('lesson player renders stored source HTML only through the imported HTML sanitizer', async () => {
  const safeHtml = await source('src/shared/components/common/SafeImportedHtml.jsx');
  const player = await source('src/features/learning/components/learning/LessonActivities.jsx');
  assert.match(safeHtml, /ALLOWED_TAGS/);
  assert.match(safeHtml, /\['http:', 'https:'\]/);
  assert.match(player, /content\.importedExact && content\.html/);
  assert.match(player, /<SafeImportedHtml html=\{content\.html\}/);
  assert.match(player, /content\.embedUrl/);
});

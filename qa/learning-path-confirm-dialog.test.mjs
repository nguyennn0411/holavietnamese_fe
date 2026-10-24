import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('learning path uses the branded confirmation dialog instead of browser confirms', () => {
  const page = read('src/pages/learning-path/LearningPathPage.jsx');
  const dialog = read('src/components/common/ConfirmDialog.jsx');

  assert.match(page, /useConfirmDialog\(\)/);
  assert.match(page, /learning-path-confirm-list/);
  assert.match(page, /confirmationDialog/);
  assert.doesNotMatch(page, /window\.confirm/);
  assert.match(dialog, /options\.details/);
});

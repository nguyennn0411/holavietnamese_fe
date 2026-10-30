import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const read = path => fs.readFile(new URL(path, import.meta.url), 'utf8');

test('selected lesson text can prefill a lesson-linked vocabulary entry', async () => {
  const [page, form] = await Promise.all([
    read('../src/features/learning/pages/learning/LessonLearningPage.jsx'),
    read('../src/features/vocabulary/components/VocabularyForm.jsx'),
  ]);

  assert.match(page, /window\.getSelection\(\)/);
  assert.match(page, /lessonContentRef\.current\?\.contains\(range\.commonAncestorContainer\)/);
  assert.match(page, /<BilingualText vi="Lưu vào sổ tay" en="Save to notebook" \/>/);
  assert.match(page, /onPointerDown=\{\(event\) => \{/);
  assert.match(page, /openSelectionVocabularyForm\(selectionAction\.word\)/);
  assert.match(page, /initialValues=\{selectedWord \? \{ word: selectedWord \} : undefined\}/);
  assert.match(page, /lessonId=\{lesson\.id\}/);
  assert.match(form, /const values = entry \|\| initialValues \|\| \{\}/);
  assert.match(form, /defaultValue=\{values\.word \|\| ''\}/);
});

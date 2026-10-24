import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const read = (path) => fs.readFile(new URL(path, import.meta.url), 'utf8');

test('Learning Path reads and mutates real backend resources', async () => {
  const [service, hook] = await Promise.all([
    read('../src/services/learningPathService.js'),
    read('../src/hooks/useLearningPath.js'),
  ]);
  assert.match(service, /\/api\/learning-path\/me/);
  assert.match(service, /\/api\/learning-path\/recommendation/);
  assert.match(service, /\/api\/learning-path\/apply/);
  assert.match(service, /\/api\/learning-path\/preferences/);
  assert.match(hook, /AbortController/);
  assert.match(service, /async me\(options = \{\}\)/);
  assert.match(hook, /learningPathService\.me\(signal \? \{ signal \} : \{\}\)/);
  assert.match(hook, /const reload = useCallback\(\(\) => load\(\)/);
});

test('Learning Path renders all required data-backed sections and states', async () => {
  const [page, backend] = await Promise.all([
    read('../src/pages/learning-path/LearningPathPage.jsx'),
    read('../../../BE/src/main/java/com/sep490/backend/learning/path/LearningPathService.java'),
  ]);
  for (const label of ['Personalized Learning', 'Learning Path Progress', 'Continue Learning', 'Interactive Roadmap', 'Recommended Courses', 'Learning preferences']) {
    assert.match(page, new RegExp(label));
  }
  for (const state of ['COMPLETED', 'IN_PROGRESS', 'AVAILABLE', 'LOCKED']) {
    assert.match(page + backend, new RegExp(state));
  }
  assert.match(page, /LearningPathSkeleton/);
  assert.match(page, /Unable to load Learning Path/);
  assert.match(page, /No exact matching course/);
  assert.doesNotMatch(page, /LEVEL_CONFIG|mockLessons|fallbackLessons/);
});

test('applying a recommendation asks for confirmation and preserves existing progress messaging', async () => {
  const [page, service] = await Promise.all([
    read('../src/pages/learning-path/LearningPathPage.jsx'),
    read('../src/services/learningPathService.js'),
  ]);
  assert.match(page, /window\.confirm/);
  assert.match(page, /path\.apply\(courseIdOf\(course\)\)/);
  assert.match(page, /path\.applyPath\(recommendedPath\.map\(courseIdOf\)\)/);
  assert.match(page, /Recommended course path/);
  assert.match(service, /courseIds/);
  assert.match(page, /Existing course progress will be preserved/);
  assert.doesNotMatch(page, /unenroll|deleteEnrollment/);
});

test('Learning Path has responsive styles for desktop and mobile', async () => {
  const css = await read('../src/styles/learning-path-simple.css');
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(css, /learning-path-personalized-hero/);
  assert.match(css, /learning-path-skeleton/);
  assert.match(css, /is-in-progress/);
});

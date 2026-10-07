import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import axios from 'axios';
import { matchRoutes } from 'react-router-dom';
import { ROUTES } from '../src/constants/routes.js';
import { VocabularyEntry } from '../src/models/VocabularyEntry.js';
import { Course } from '../src/models/Course.js';
import { Enrollment } from '../src/models/Enrollment.js';
import { Lesson } from '../src/models/Lesson.js';
import { LearningProgress } from '../src/models/LearningProgress.js';

const calls = [];
const notebook = [];
const catalogWord = {
  id: 1009, word: 'tạm biệt', pronunciation: '/taːm ɓiət/', partOfSpeech: 'PHRASE',
  cefrLevel: 'A1', status: 'PUBLISHED', audioUrl: '/audio/goodbye.mp3', topics: [{ id: 2, name: 'Chào hỏi' }],
  meanings: [
    { translationEn: 'goodbye', definitionEn: 'A phrase used when leaving.', usageNote: 'Dùng khi chia tay.', examples: [{ exampleVi: 'Tạm biệt, hẹn gặp lại!', translationEn: 'Goodbye, see you again!' }] },
    { translationEn: 'farewell', examples: [{ exampleVi: 'Lời tạm biệt.', translationEn: 'A farewell.' }] },
  ],
};
let rejected = false;
let token = 'vocabulary-contract-test-token';
globalThis.__vocabularyContract = { axios, VocabularyEntry, Course, Enrollment, Lesson, LearningProgress };
globalThis.localStorage = { getItem: key => key === 'token' ? token : null };
const load = source => import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const clientSource = (await fs.readFile(new URL('../src/infrastructure/api/axiosClient.js', import.meta.url), 'utf8'))
  .replace("import axios from 'axios';", 'const { axios } = globalThis.__vocabularyContract;')
  .replace('import.meta.env.VITE_API_BASE_URL', '({}).VITE_API_BASE_URL');
const { default: client } = await load(clientSource);
globalThis.__vocabularyContract.client = client;
client.defaults.adapter = async config => {
  const body = config.data ? JSON.parse(config.data) : undefined;
  calls.push({ method: config.method, url: config.url, body, params: config.params, signal: config.signal, authorization: config.headers.Authorization });
  assert.equal(config.headers.Authorization, `Bearer ${token}`);
  if (rejected) throw new Error('NOTEBOOK_SAVE_REJECTED');
  let data;
  if (config.url === '/api/me/courses') data = [{ enrollmentId: 31, courseId: 1, title: 'Tiếng Việt A1', progressPercentage: 45 }];
  else if (config.url === '/api/courses/1/lessons') data = [{ id: 101, courseId: 1, title: 'Chào hỏi' }];
  else if (config.url === '/api/me/courses/1/progress') data = { progressPercentage: 45, completedLessons: 2, totalLessons: 6 };
  else if (config.url === '/api/vocabulary') data = { code: 1000, result: [catalogWord] };
  else if (config.url === '/api/vocabulary/1009') data = { code: 1000, result: catalogWord };
  else if (config.url === '/api/me/vocabulary' && config.method === 'post') {
    data = { ...body, id: notebook.length + 1 };
    notebook.push(data);
  } else if (config.url === '/api/me/vocabulary') data = [...notebook];
  else if (config.method === 'put') { data = { ...body, id: 1 }; notebook[0] = data; }
  else if (config.method === 'delete') { notebook.length = 0; data = ''; }
  else data = notebook[0];
  return { config, status: config.method === 'post' ? 201 : config.method === 'delete' ? 204 : 200, statusText: 'OK', headers: {}, data };
};
const importService = async name => load((await fs.readFile(new URL(`../src/services/${name}.js`, import.meta.url), 'utf8'))
  .replace(/import axiosClient from [^;\n]+;?/, 'const axiosClient = globalThis.__vocabularyContract.client;')
  .replace(/import \{ (\w+) \} from ['"]@\/models\/[^'"\n]+['"];?/g, (_, name) => `const { ${name} } = globalThis.__vocabularyContract;`)
  .replace(/import \{ httpClient \} from [^;\n]+;?/, 'const httpClient = () => { throw new Error("UNEXPECTED_COOKIE_CLIENT"); };'));
const { vocabularyService } = await importService('vocabularyService');
const { vocabularyCatalogService } = await importService('vocabularyCatalogService');
const { courseService } = await importService('courseService');
const { learningService } = await importService('learningService');

test('Notebook course/lesson filters and private course progress send the current localStorage JWT', async () => {
  calls.length = 0;
  const originalToken = token;
  token = 'rotated-course-contract-token';
  try {
    const courses = await courseService.myCourses();
    assert.deepEqual(courses, [{ enrollmentId: 31, courseId: 1, title: 'Tiếng Việt A1', progressPercentage: 45 }]);
    const lessons = await learningService.lessons(courses[0].courseId);
    assert.ok(lessons[0] instanceof Lesson);
    assert.equal(lessons[0].id, 101);
    const progress = await learningService.progress(courses[0].courseId);
    assert.ok(progress instanceof LearningProgress);
    assert.equal(progress.progressPercentage, 45);
    assert.deepEqual(calls.map(({ method, url, authorization }) => ({ method, url, authorization })), [
      { method: 'get', url: '/api/me/courses', authorization: 'Bearer rotated-course-contract-token' },
      { method: 'get', url: '/api/courses/1/lessons', authorization: 'Bearer rotated-course-contract-token' },
      { method: 'get', url: '/api/me/courses/1/progress', authorization: 'Bearer rotated-course-contract-token' },
    ]);
  } finally { token = originalToken; }
});

test('Catalog and notebook paths select separate pages without shadowing review', async () => {
  const routes = ['VOCABULARY', 'VOCABULARY_CATALOG_DETAIL', 'VOCABULARY_NOTEBOOK', 'VOCABULARY_NOTEBOOK_DETAIL', 'VOCABULARY_REVIEW'].map(key => ({ id: key, path: ROUTES[key] }));
  for (const [path, expected] of [['/vocabulary', 'VOCABULARY'], ['/vocabulary/1009', 'VOCABULARY_CATALOG_DETAIL'], ['/vocabulary/notebook', 'VOCABULARY_NOTEBOOK'], ['/vocabulary/notebook/1', 'VOCABULARY_NOTEBOOK_DETAIL'], ['/vocabulary/review', 'VOCABULARY_REVIEW']]) {
    assert.equal(matchRoutes(routes, path).at(-1).route.id, expected);
  }
  const app = await fs.readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.ok(app.includes("import('@/pages/vocabulary/VocabularyDetailPage')"));
  assert.ok(app.includes('path={ROUTES.VOCABULARY_CATALOG_DETAIL} element={<VocabularyDetailPage />}'));
});

test('Catalog GET preserves filters, cancellation, all meanings and the existing Bearer interceptor', async () => {
  calls.length = 0;
  const signal = new AbortController().signal;
  assert.deepEqual(await vocabularyCatalogService.list({ keyword: 'tạm', cefrLevel: '', topicId: null }, { signal }), [catalogWord]);
  assert.deepEqual(await vocabularyCatalogService.get(1009, { signal }), catalogWord);
  assert.deepEqual(calls.map(({ method, url, params, signal: requestSignal }) => ({ method, url, params, signal: requestSignal })), [
    { method: 'get', url: '/api/vocabulary', params: { keyword: 'tạm' }, signal },
    { method: 'get', url: '/api/vocabulary/1009', params: undefined, signal },
  ]);
});

test('Saving a Master word posts only VocabularyRequest fields and notebook/review can read it', async () => {
  calls.length = 0;
  notebook.length = 0;
  const before = structuredClone(catalogWord);
  const saved = await vocabularyService.saveWord(catalogWord);
  assert.ok(saved instanceof VocabularyEntry);
  const payload = { lessonId: null, word: 'tạm biệt', meaning: 'goodbye', pronunciation: '/taːm ɓiət/', exampleSentence: 'Tạm biệt, hẹn gặp lại!', note: 'Dùng khi chia tay.' };
  assert.deepEqual(calls[0].body, payload);
  assert.equal(calls[0].method, 'post');
  assert.equal(calls[0].url, '/api/me/vocabulary');
  assert.deepEqual(catalogWord, before);
  const entries = await vocabularyService.list({ search: '', courseId: '', lessonId: '' });
  assert.equal(entries.length, 1);
  assert.deepEqual({ ...entries[0] }, { ...payload, id: saved.id });
  assert.equal((await vocabularyService.get(saved.id)).word, saved.word);
  assert.equal(token, 'vocabulary-contract-test-token');
});

test('Lesson save uses the same helper, keeps lessonId and sends no Master fields', async () => {
  calls.length = 0;
  await vocabularyService.saveWord({ wordVi: 'cà phê', meaningEn: 'coffee', exampleVi: 'Cho tôi một cà phê.', pronunciation: '/ka fe/' }, 101);
  assert.deepEqual(calls[0].body, { lessonId: 101, word: 'cà phê', meaning: 'coffee', pronunciation: '/ka fe/', exampleSentence: 'Cho tôi một cà phê.', note: '' });
  const lesson = await fs.readFile(new URL('../src/components/learning/LessonActivities.jsx', import.meta.url), 'utf8');
  assert.ok(lesson.includes('vocabularyService.saveWord(item, lessonId)'));
});

test('Existing notebook update/delete retain methods, payload and 204 result', async () => {
  calls.length = 0;
  const payload = { lessonId: null, word: ' tạm biệt ', meaning: ' goodbye ', pronunciation: '', exampleSentence: '', note: '' };
  await vocabularyService.update(1, payload);
  assert.equal(calls[0].method, 'put');
  assert.equal(calls[0].url, '/api/me/vocabulary/1');
  assert.equal(calls[0].body.word, 'tạm biệt');
  assert.equal(calls[0].body.meaning, 'goodbye');
  assert.equal(await vocabularyService.delete(1), null);
  assert.equal(calls[1].method, 'delete');
  assert.equal(calls[1].url, '/api/me/vocabulary/1');
});

test('Invalid and rejected saves never turn into successful notebook data', async () => {
  calls.length = 0;
  const size = notebook.length;
  await assert.rejects(async () => vocabularyService.saveWord({ word: 'tạm biệt', meanings: [] }), /required/);
  assert.equal(calls.length, 0);
  rejected = true;
  try { await assert.rejects(vocabularyService.saveWord(catalogWord), /NOTEBOOK_SAVE_REJECTED/); }
  finally { rejected = false; }
  assert.equal(notebook.length, size);
});

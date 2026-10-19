import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { dictionaryMeaning, definitionOf, dictionaryQuery, highlightedParts } from '../src/models/Dictionary.js';
import { vocabularyDraft, vocabularyPayload } from '../src/models/AdminVocabulary.js';

test('Dictionary search URL retains filters and server pagination without invalid page numbers', () => {
  assert.deepEqual(dictionaryQuery(new URLSearchParams('keyword=bàn&partOfSpeech=noun&topicId=4&page=2')), {
    keyword: 'bàn', partOfSpeech: 'noun', cefrLevel: '', topicId: '4', page: 2, size: 20,
  });
  for (const value of ['-1', 'NaN', 'Infinity', '2.5']) assert.equal(dictionaryQuery(new URLSearchParams(`page=${value}`)).page, 0);
});

test('Vietnamese-only meanings fit Notebook and highlights remain plain text with Unicode accents', () => {
  assert.equal(dictionaryMeaning({ definitionVi: ' Đồ vật có mặt phẳng. ' }), 'Đồ vật có mặt phẳng.');
  assert.equal(dictionaryMeaning({ translationEn: 'table', definitionVi: 'Đồ vật.' }), 'table');
  assert.equal(dictionaryMeaning({ definitionVi: 'x'.repeat(1100) }).length, 1000);
  assert.equal(definitionOf({ translationEn: 'table', definitionVi: 'Đồ vật.' }), 'Đồ vật.');
  const parts=highlightedParts('Bàn và cái bàn. <script>alert(1)</script>', 'bàn');
  assert.deepEqual(parts.filter(part => part.match).map(part => part.text), ['Bàn', 'bàn']);
  assert.equal(parts.map(part => part.text).join(''), 'Bàn và cái bàn. <script>alert(1)</script>');
  assert.deepEqual(highlightedParts('a.b', 'a.b'), [{ text: 'a.b', match: true }]);
});

test('Admin can edit Vietnamese definitions without inventing translations or CEFR and preserves labels', () => {
  const draft=vocabularyDraft({ word: 'bàn', partOfSpeech: 'noun', source: { license: 'CC-BY-SA-4.0' }, meanings: [
    { definitionVi: 'Đồ vật.', labels: ['figuratively'], examples: [{ exampleVi: 'Cái bàn.' }] },
    { definitionVi: 'Một nghĩa khác.' },
  ] });
  const payload=vocabularyPayload(draft);
  assert.equal(payload.cefrLevel, null);
  assert.equal(payload.meanings.length, 2);
  assert.equal(payload.meanings[0].translationEn, null);
  assert.equal(payload.meanings[0].examples[0].translationEn, null);
  assert.deepEqual(payload.meanings[0].labels, ['figuratively']);
  assert.deepEqual(vocabularyPayload({ ...draft, meanings: [{ ...draft.meanings[0], labelsInput: 'figuratively, colloquial' }] }).meanings[0].labels, ['figuratively', 'colloquial']);
  assert.equal('source' in payload, false);
  assert.throws(() => vocabularyPayload({ ...draft, cefrLevel: 'Z9' }), /CEFR/);
  assert.throws(() => vocabularyPayload({ ...draft, meanings: [{ ...draft.meanings[0], definitionVi: '' }] }), /Mỗi nghĩa/);
});

test('Dictionary service passes page and exact filters to API and import uses the existing JSONL adapter', async () => {
  const calls=[];
  globalThis.__dictionaryClient={ get: async (path, options) => { calls.push([path,options]); return { result: { content: [], totalElements: 0 } }; },
    post: async (path, body) => { calls.push([path,body]); return { result: { canConfirm: false } }; } };
  const load=async name => {
    const source=(await fs.readFile(new URL(`../src/services/${name}.js`,import.meta.url),'utf8'))
      .replace("import axiosClient from '@/infrastructure/api/axiosClient';",'const axiosClient=globalThis.__dictionaryClient;');
    return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  };
  const { vocabularyCatalogService }=await load('vocabularyCatalogService');
  const signal=new AbortController().signal;
  await vocabularyCatalogService.search({ keyword: 'ban', page: 3, size: 20, exact: false, cefrLevel: '' }, { signal });
  assert.deepEqual(calls[0], ['/api/vocabulary/search', { signal, params: { keyword: 'ban', page: 3, size: 20, exact: false } }]);
  await vocabularyCatalogService.links(7); assert.equal(calls[1][0], '/api/vocabulary/7/links');
  const { contentImportService }=await load('contentImportService');
  await contentImportService.preview('DICTIONARY_JSONL',new File(['{}\n'],'pilot.jsonl'));
  assert.equal(calls[2][0], '/api/admin/imports/preview');
  assert.equal(calls[2][1].get('module'), 'DICTIONARY_JSONL');
  await assert.rejects(() => contentImportService.preview('DICTIONARY_JSONL',new File(['x'],'wrong.xlsx')));
});

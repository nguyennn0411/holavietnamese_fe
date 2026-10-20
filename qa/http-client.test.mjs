import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const source = await fs.readFile(new URL('../src/api/httpClient.js', import.meta.url), 'utf8');
const originalFetch = globalThis.fetch;
const originalStorage = globalThis.localStorage;
let sequence = 0;
after(() => {
  globalThis.fetch = originalFetch;
  if (originalStorage === undefined) delete globalThis.localStorage;
  else globalThis.localStorage = originalStorage;
});
const load = base => import('data:text/javascript;base64,' + Buffer.from(
  source.replace('import.meta.env.VITE_API_BASE_URL', JSON.stringify(base)) + `\n// case ${sequence++}`
).toString('base64'));

test('API URLs accept host or /api base and prefixed paths without duplicating /api', async () => {
  for (const base of ['', 'http://localhost:8080', 'http://localhost:8080/api/']) {
    const { resolveApiUrl } = await load(base);
    const root = base ? 'http://localhost:8080/api' : '/api';
    assert.equal(resolveApiUrl(''), root);
    assert.equal(resolveApiUrl('/api'), root);
    for (const path of ['ai/sessions', '/ai/sessions', '/api/ai/sessions'])
      assert.equal(resolveApiUrl(path), root + '/ai/sessions');
  }
});

test('Uploads retain Bearer authentication and let FormData supply its multipart boundary', async () => {
  const calls = [];
  globalThis.localStorage = { getItem: () => 'test-token' };
  globalThis.fetch = async (url, options) => { calls.push({ url, options }); return { ok: true, status: 200, json: async () => ({ uploaded: true }) }; };
  const { httpClient } = await load('http://localhost:8080/api');
  const body = new FormData();
  body.append('file', new Blob(['demo image']), 'demo.png');
  await httpClient('/api/media', { method: 'POST', body });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'http://localhost:8080/api/media');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer test-token');
  assert.equal(calls[0].options.headers['Content-Type'], undefined);
  assert.equal(calls[0].options.body, body);
});

test('Cookie writes obtain a CSRF token and send it with the request', async () => {
  const calls = [];
  globalThis.localStorage = { getItem: () => null };
  globalThis.fetch = async (url, options) => { calls.push({ url, options }); return { ok: true, status: 200, json: async () => url.endsWith('/csrf') ? { headerName: 'X-CSRF-TOKEN', token: 'test-csrf' } : { saved: true } }; };
  const { httpClient } = await load('');
  await httpClient('/courses', { method: 'POST', body: '{}' });
  assert.deepEqual(calls.map(call => call.url), ['/api/csrf', '/api/courses']);
  assert.equal(calls[1].options.headers['X-CSRF-TOKEN'], 'test-csrf');
  assert.equal(calls[1].options.headers.Authorization, undefined);
});

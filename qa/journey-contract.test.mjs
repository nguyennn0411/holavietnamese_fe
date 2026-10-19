import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import axios from 'axios';
import { ROUTES } from '../src/constants/routes.js';
const calls = [];
globalThis.localStorage = { getItem: key => key === 'token' ? 'journey-contract-token' : null, removeItem() {} };
globalThis.window = { location: { pathname: '/explore', search: '', assign() {} } };
globalThis.__journeyContract = { axios };
const load = source => import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const { default: client } = await load((await fs.readFile(new URL('../src/infrastructure/api/axiosClient.js', import.meta.url), 'utf8'))
  .replace("import axios from 'axios';", 'const { axios } = globalThis.__journeyContract;')
  .replace('import.meta.env.VITE_API_BASE_URL', '({}).VITE_API_BASE_URL'));
globalThis.__journeyContract.client = client;
const { journeyService, adminJourneyService } = await load((await fs.readFile(new URL('../src/services/journeyService.js', import.meta.url), 'utf8'))
  .replace(/import axiosClient from [^;]+;/, 'const axiosClient = globalThis.__journeyContract.client;'));
let result = {}, rejected = false;
client.defaults.adapter = async config => {
  calls.push({ url: config.url, method: config.method, params: config.params, body: config.data ? JSON.parse(config.data) : undefined, token: config.headers.Authorization, signal: config.signal });
  return { config, status: 200, statusText: 'OK', headers: {}, data: rejected ? { code: 9999, message: 'Rule unavailable', success: false } : { code: 1000, result } };
};

test('Journey reads preserve server order/status and send no client user ID', async () => {
  result = { stops: [{ destination: { id: 91 }, status: 'COMPLETED' }, { destination: { id: 7 }, status: 'NOT_STARTED' }], progressPercent: 50, rulesConfigured: false };
  const abort = new AbortController();
  assert.deepEqual(await journeyService.get({ keyword: 'Huế', region: 'CENTRAL', userId: 999, progressPercent: 100 }, { signal: abort.signal }), result);
  assert.deepEqual(calls.at(-1).params, { keyword: 'Huế', region: 'CENTRAL' });
  assert.equal(calls.at(-1).token, 'Bearer journey-contract-token');
  assert.equal(calls.at(-1).signal, abort.signal);
});
test('Configuration and links send only owned references, preserving selected order', async () => {
  await adminJourneyService.save([{ destination: { id: 91, nameVi: 'Private draft' }, status: 'PUBLISHED', progressPercent: 100 }, { destination: { id: 7 }, status: 'DRAFT' }]);
  assert.deepEqual(calls.at(-1).body, { stops: [{ destinationId: 91, status: 'PUBLISHED' }, { destinationId: 7, status: 'DRAFT' }], unlockRule: 'PREVIOUS_COMPLETED', completionRule: 'ALL_LINKED_LESSONS' });
  assert.equal(calls.at(-1).method, 'put');
  await adminJourneyService.link(91, [4, 3], [8]);
  assert.equal(calls.at(-1).url, '/api/admin/destinations/91/content');
  assert.deepEqual(calls.at(-1).body, { lessonIds: [4, 3], vocabularyIds: [8] });
});
test('Completion never supplies a claimed percentage and rejected rules propagate', async () => {
  await journeyService.complete(91);
  assert.deepEqual(calls.at(-1).body, {});
  assert.equal(calls.at(-1).url, '/api/me/journey/destinations/91/complete');
  rejected = true;
  await assert.rejects(journeyService.complete(91), /Rule unavailable/);
  await assert.rejects(adminJourneyService.save([]), /Rule unavailable/);
  rejected = false;
});
test('Passport and content remain scoped to authenticated learner and admin routes', async () => {
  await journeyService.passport(); assert.equal(calls.at(-1).url, '/api/me/journey/passport');
  await journeyService.content(91); assert.equal(calls.at(-1).url, '/api/me/journey/destinations/91/content');
  await journeyService.start(91); assert.equal(calls.at(-1).url, '/api/me/journey/destinations/91/start'); assert.deepEqual(calls.at(-1).body, {});
  await adminJourneyService.content(91); assert.equal(calls.at(-1).url, '/api/admin/destinations/91/content');
  assert.equal(ROUTES.ADMIN_JOURNEY, '/admin/journey');
  const controller = new AbortController(); controller.abort();
  const before = calls.length;
  await assert.rejects(journeyService.get({}, { signal: controller.signal }), /canceled/);
  assert.equal(calls.length, before);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const moduleUrl = new URL('../src/shared/api/managementApiPath.js', import.meta.url);

const localStorageStub = initial => {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  };
};

test('CONTENT and ADMIN use different management API namespaces', async () => {
  globalThis.localStorage = localStorageStub({ role: 'CONTENT' });
  const paths = await import(`${moduleUrl.href}?separation=${Date.now()}`);
  assert.equal(paths.managementApiPath('/courses'), '/api/content/courses');
  assert.equal(paths.managementResourcePath('/lessons/1'), '/content/lessons/1');

  globalThis.localStorage.setItem('role', 'ADMIN');
  assert.equal(paths.managementApiPath('/courses'), '/api/admin/courses');
  assert.equal(paths.managementResourcePath('/lessons/1'), '/admin/lessons/1');
  delete globalThis.localStorage;
});

test('backend security keeps admin and content namespaces exclusive', () => {
  const security = readFileSync(
    new URL('../../holavietnamese-be/src/main/java/com/sep490/backend/modules/auth/config/SecurityConfig.java', import.meta.url),
    'utf8',
  );
  assert.match(security, /requestMatchers\("\/api\/content\/\*\*"\)\.hasRole\("CONTENT"\)/);
  assert.match(security, /requestMatchers\("\/api\/admin\/\*\*"\)\.hasRole\("ADMIN"\)/);
  assert.doesNotMatch(security, /requestMatchers\("\/api\/admin\/\*\*"\)\.hasAnyRole\("ADMIN", "CONTENT"\)/);
});

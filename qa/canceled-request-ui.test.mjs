import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const read = path => fs.readFile(new URL(path, import.meta.url), 'utf8');

test('canceled requests retain their type and never become Learning Path errors', async () => {
  const [client, hook] = await Promise.all([
    read('../src/api/axiosClient.js'),
    read('../src/hooks/useLearningPath.js'),
  ]);

  assert.match(client, /axios\.isCancel\(error\)/);
  assert.match(client, /error\?\.code === 'ERR_CANCELED'/);
  assert.match(client, /return Promise\.reject\(error\)/);
  assert.match(hook, /const isCanceledRequest/);
  assert.match(hook, /if \(!isCanceledRequest\(reason\)\)/);
});

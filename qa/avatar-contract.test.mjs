import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('avatar uses the signed direct-to-Cloudinary flow and client validation', async () => {
  const [service, profile] = await Promise.all([
    read('src/services/learnerService.js'),
    read('src/pages/profile/ProfilePage.jsx'),
  ]);

  assert.match(service, /post\(['"]\/api\/users\/me\/avatar\/signature['"]\)/);
  assert.match(service, /new FormData\(\)/);
  assert.match(service, /formData\.append\(['"]file['"], file\)/);
  for (const field of ['api_key', 'timestamp', 'signature']) {
    assert.match(service, new RegExp(`formData\\.append\\(['"]${field}['"]`));
  }
  assert.match(service, /if \(signature\.folder\) formData\.append\(['"]folder['"], signature\.folder\)/);
  assert.match(service, /if \(signature\.publicId\) formData\.append\(['"]public_id['"], signature\.publicId\)/);
  assert.match(service, /fetch\(signature\.uploadUrl/);
  assert.match(service, /uploaded\?\.secure_url/);
  assert.match(service, /put\(['"]\/api\/users\/me\/avatar['"], \{ avatarUrl \}\)/);
  assert.doesNotMatch(service, /post\(['"]\/api\/users\/me\/avatar['"], formData\)/);
  assert.doesNotMatch(service, /CLOUDINARY_API_SECRET|api_secret/i);
  assert.match(profile, /image\/jpeg/);
  assert.match(profile, /image\/png/);
  assert.match(profile, /image\/webp/);
  assert.match(profile, /5 \* 1024 \* 1024/);
  assert.match(profile, /updatedUser\?\.avatarUrl/);
});

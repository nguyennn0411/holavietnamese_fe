import assert from 'node:assert/strict';
import test from 'node:test';
import { appendInlineIllustration, canIllustrateActivity, isIllustrationFile } from '../src/features/learning/admin/activityIllustrations.js';

test('manual illustrations target existing editable content activities', () => {
  assert.equal(canIllustrateActivity({ id: 144, activityType: 'TEXT', status: 'PUBLISHED' }), true);
  assert.equal(canIllustrateActivity({ id: 144, activityType: 'TEXT', status: 'ARCHIVED' }), false);
  assert.equal(canIllustrateActivity({ id: 152, activityType: 'IMAGE', status: 'PUBLISHED' }), false);
  assert.equal(canIllustrateActivity({ id: 160, activityType: 'QUIZ', status: 'PUBLISHED' }), false);
  assert.equal(canIllustrateActivity({ activityType: 'TEXT', status: 'DRAFT' }), false);
});

test('inserting an inline illustration preserves the text and other images', () => {
  const initial = {
    textVi: 'Bảng chữ cái tiếng Việt',
    textEn: 'The Vietnamese alphabet',
    illustrations: [{ imageUrl: '/media/lesson.png', sourcePage: 1 }],
  };
  const imageUrl = 'https://res.cloudinary.com/example/image/upload/alphabet.png';
  const result = appendInlineIllustration(initial, imageUrl);
  assert.deepEqual(result, {
    ...initial,
    illustrations: [...initial.illustrations, { imageUrl, placement: 'inline' }],
  });
  assert.equal(initial.illustrations.length, 1);
  assert.equal(appendInlineIllustration(result, imageUrl), result);
  assert.throws(() => appendInlineIllustration({ illustrations: 'invalid' }, imageUrl));
});

test('manual uploads only accept nonempty lesson images within the existing limit', () => {
  assert.equal(isIllustrationFile({ type: 'image/png', size: 5 * 1024 * 1024 }), true);
  assert.equal(isIllustrationFile({ type: 'image/png', size: 5 * 1024 * 1024 + 1 }), false);
  assert.equal(isIllustrationFile({ type: 'image/webp', size: 0 }), false);
  assert.equal(isIllustrationFile({ type: 'image/svg+xml', size: 100 }), false);
});

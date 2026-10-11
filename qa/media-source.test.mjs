import test from 'node:test';
import assert from 'node:assert/strict';
import { mediaSource } from '../src/components/common/mediaSource.js';

test('API image URLs retain paths, signed query parameters and local upload URLs', () => {
  const signed = 'https://cdn.example.test/photo.jpg?signature=a%2Bb&width=1200';
  assert.equal(mediaSource(`  ${signed}  `), signed);
  assert.equal(mediaSource('/uploads/ảnh bìa.jpg'), '/uploads/ảnh bìa.jpg');
  assert.equal(mediaSource('media/photo.jpg'), 'media/photo.jpg');
});

test('missing and malformed fields never become requests for undefined or object strings', () => {
  for (const value of [undefined, null, '', '  ', 'undefined', 'null', '[object Object]', {}, [], 123]) assert.equal(mediaSource(value), null);
});

test('media schemes match the actual media type and reject executable sources', () => {
  for (const value of ['javascript:alert(1)', 'file:///private/photo.jpg', 'https://', 'https://example.test/\nimage']) assert.equal(mediaSource(value), null);
  assert.equal(mediaSource('data:audio/wav;base64,AAAA'), null);
  assert.equal(mediaSource('data:audio/wav;base64,AAAA', 'audio'), 'data:audio/wav;base64,AAAA');
  assert.equal(mediaSource('blob:https://example.test/image'), 'blob:https://example.test/image');
});

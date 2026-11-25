import assert from 'node:assert/strict';
import test from 'node:test';
import { strToU8, zipSync } from 'fflate';
import { makeLessonImageTemplate, readLessonImageZip } from '../src/features/learning/admin/lessonImageZip.js';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWPkAAAAASUVORK5CYII=', 'base64');

test('the ZIP template round-trips with the chosen course lesson code and quoted title', () => {
  const zip = makeLessonImageTemplate({ code: 'A1-L01', titleVi: 'Chào bạn, Việt Nam' }, png);
  const result = readLessonImageZip(zip);
  assert.deepEqual(result.unused, []);
  assert.deepEqual(result.rows.map(row => row.assetType), ['01-knowledge', '02-vocabulary', '03-practice']);
  assert(result.rows.every(row => row.lessonKey === 'A1-L01' && row.lessonTitleVi === 'Chào bạn, Việt Nam'
    && row.blob.type === 'image/png' && !row.issue));
});

test('a repacked ZIP keeps relative paths and flags missing and duplicate filenames', () => {
  const zip = zipSync({
    'pack/manifest.csv': strToU8('lessonKey,assetType,file\nA1-L01,02-vocabulary,one/test.png\nA1-L01,01-knowledge,two/test.png\nA1-L02,01-knowledge,missing.png'),
    'pack/one/test.png': png,
    'pack/two/test.png': png,
    'pack/unused.png': png,
  });
  const { rows, unused } = readLessonImageZip(zip);
  assert.deepEqual(unused, ['pack/unused.png']);
  assert.match(rows[0].issue, /nhiều lần/);
  assert.match(rows[1].issue, /nhiều lần/);
  assert.match(rows[2].issue, /Không tìm thấy/);
});

test('ZIP entries with unsafe paths and mislabeled images are rejected', () => {
  const manifest = strToU8('lessonKey,file\nA1-L01,image.png');
  assert.throws(() => readLessonImageZip(zipSync({
    'manifest.csv': manifest,
    '../image.png': png,
  })), /Đường dẫn/);
  const { rows } = readLessonImageZip(zipSync({
    'manifest.csv': manifest,
    'image.png': strToU8('not an image'),
  }));
  assert.match(rows[0].issue, /khớp định dạng/);
});

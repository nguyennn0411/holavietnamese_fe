import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../src/features/alphabet/alphabet.json', import.meta.url), 'utf8'));
assert.equal(data.letters.map(item => item.symbol).join(''), 'aăâbcdđeêghiklmnoôơpqrstuưvxy');
assert.equal(new Set(data.vowels).size, 12);
assert.equal(data.letters.filter(item => !data.vowels.includes(item.symbol)).length, 17);
assert.equal(data.consonantGroups.length, 11);
assert.deepEqual(data.tones.map(item => item.symbol), ['a', 'á', 'à', 'ả', 'ã', 'ạ']);
const items = [...data.letters, ...data.consonantGroups, ...data.tones];
assert.equal(new Set(items.map(item => item.id)).size, 46);
let totalBytes = 0;
for (const item of items) {
  const file = new URL(`../public/media/alphabet/${item.id}.wav`, import.meta.url);
  const wav = await readFile(file);
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF', item.id);
  assert.equal(wav.toString('ascii', 8, 12), 'WAVE', item.id);
  let pcm, byteRate;
  for (let pos = 12; pos + 8 <= wav.length;) {
    const type = wav.toString('ascii', pos, pos + 4);
    const size = wav.readUInt32LE(pos + 4);
    assert.ok(pos + 8 + size <= wav.length, `Truncated WAV: ${item.id}`);
    if (type === 'fmt ') {
      assert.equal(wav.readUInt16LE(pos + 8), 1, 'PCM required');
      assert.equal(wav.readUInt16LE(pos + 22), 16, '16-bit required');
      byteRate = wav.readUInt32LE(pos + 16);
    }
    if (type === 'data') pcm = wav.subarray(pos + 8, pos + 8 + size);
    pos += 8 + size + (size % 2);
  }
  assert.ok(pcm && byteRate && pcm.length / byteRate > 0.4, `Missing/short audio: ${item.id}`);
  let peak = 0;
  for (let pos = 0; pos + 1 < pcm.length; pos += 2) peak = Math.max(peak, Math.abs(pcm.readInt16LE(pos)));
  assert.ok(peak > 100, `Silent audio: ${item.id}`);
  totalBytes += wav.length;
  if (process.env.ALPHABET_BASE_URL) {
    const response = await fetch(new URL(`/media/alphabet/${item.id}.wav`, process.env.ALPHABET_BASE_URL));
    assert.equal(response.status, 200, `HTTP audio missing: ${item.id}`);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), wav, `Wrong HTTP content: ${item.id}`);
  }
}
console.log(`Verified alphabet groups and ${items.length} non-silent WAV files (${(totalBytes / 1024 / 1024).toFixed(2)} MB).`);

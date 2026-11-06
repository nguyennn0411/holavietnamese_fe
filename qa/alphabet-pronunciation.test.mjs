import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getVietSyllablesAudioUrl,
  VIETSYLLABLES_ASSET_HOST,
  VIETSYLLABLES_VOICE,
} from '../src/features/alphabet/pronunciation.js';

test('builds the same audio path format as the VietSyllables player', () => {
  assert.equal(
    getVietSyllablesAudioUrl('b', 'a', 'none'),
    `${VIETSYLLABLES_ASSET_HOST}/${VIETSYLLABLES_VOICE}/b/a_none.mp3`,
  );
  assert.equal(
    getVietSyllablesAudioUrl('∅', 'ê', 'grave'),
    `${VIETSYLLABLES_ASSET_HOST}/${VIETSYLLABLES_VOICE}/%E2%88%85/%C3%AA_grave.mp3`,
  );
  assert.equal(
    getVietSyllablesAudioUrl('', 'ương', 'acute'),
    `${VIETSYLLABLES_ASSET_HOST}/${VIETSYLLABLES_VOICE}/%E2%88%85/%C6%B0%C6%A1ng_acute.mp3`,
  );
});

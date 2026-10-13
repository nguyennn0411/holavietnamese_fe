# Vietnamese alphabet reference

The page also includes an interactive initial × final pronunciation chart inspired by [VietSyllables](https://vietsyllables.com/). It shows a curated set of recorded syllables, lets learners filter final groups and select tones, and plays the selected tones in sequence. Chart audio is requested from the VietSyllables asset host only when a cell is clicked. When that host is unavailable or blocks playback, the browser's Vietnamese speech synthesis reads the syllable instead. The synthesis voice and accent depend on the learner's device, and the two audio sources can sound different. Stop and Replay control both playback paths.

`/alphabet` is a public, standalone listening reference linked from the learner navigation and course catalog. It has 29 letter tiles, 12 vowel-letter tiles, 17 consonant-letter tiles, 11 common consonant spelling groups and six tones. Repeated letters in the vowel and consonant sections use the same pronunciation mapping. No enrollment or lesson progress is required.

The lower letter, consonant-group and tone tiles use the same VietSyllables syllable recordings and shared player as the chart above. Multi-syllable letter names play their component recordings in order. Letters without a standalone recording use the browser's Vietnamese speech synthesis; inaccessible recordings use the same fallback. Example words in `alphabet.json` are metadata and are not played. The 46 previously generated WAV assets in `public/media/alphabet` are retained for offline reference and can be regenerated with the script below, but are not used by the page.

- Regenerate on Windows with the Vietnamese voice installed: `powershell.exe -NoProfile -File scripts/render-alphabet-audio.ps1`.
- Verify inventory, WAV structure, duration and non-silent PCM: `node scripts/verify-alphabet.mjs`.
- Set `ALPHABET_BASE_URL=http://localhost:5173` to also verify that every public URL serves the exact recording.
- Build: `npm run build`.

Reference for the 29-letter inventory: [Vietnamese Ministry of Education teaching-material specification](https://moet.gov.vn/content/vanban/Lists/VBDT/Attachments/1560/1.Danh%20m%E1%BB%A5c%20TBDH%20Ti%E1%BA%BFng%20Vi%E1%BB%87t_%20Ti%E1%BB%83u%20h%E1%BB%8Dc_16.09.pdf). Layout follows the user's supplied reference image.

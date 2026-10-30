import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getCoachDay } from '../src/utils/coachDay.js';

test('Coach day rolls over at midnight in Vietnam', () => {
  assert.equal(getCoachDay(new Date('2026-10-30T16:59:59Z')), '2026-10-30');
  assert.equal(getCoachDay(new Date('2026-10-30T17:00:00Z')), '2026-10-31');
});

test('daily Coach sessions reuse today, preserve yesterday and isolate users and lessons', async () => {
  const sessions = [];
  const sentTo = [];
  let day = '2026-10-30';
  let user = 'learner-1';
  const client = {
    get: async () => ({ result: sessions }),
    post: async (url, body) => {
      if (url === '/api/ai/sessions') {
        const session = { ...body, messages: [] };
        sessions.push(session);
        return { result: session };
      }
      sentTo.push(url);
      return { result: { text: 'Reply' } };
    },
  };
  globalThis.__coachDailyTest = { client, day: () => day, user: () => user };
  try {
    let source = await readFile(new URL('../src/features/ai/api/aiCourseCoachService.js', import.meta.url), 'utf8');
    source = source
      .replace("import axiosClient from '@/shared/api/axiosClient.js';", 'const axiosClient = globalThis.__coachDailyTest.client;')
      .replace("import { getCurrentUserStorageKey } from './aiTutorService.js';", 'const getCurrentUserStorageKey = globalThis.__coachDailyTest.user;')
      .replace("import { getCoachDay } from '../../../utils/coachDay.js';", 'const getCoachDay = globalThis.__coachDailyTest.day;');
    const { default: service } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
    const context = { courseId: 1, lessonId: 2, lessonTitle: 'Pronunciation' };
    const [first, duplicate] = await Promise.all([
      service.getOrCreateSession(context), service.getOrCreateSession(context),
    ]);
    assert.equal(first.id, duplicate.id);
    assert.equal(sessions.length, 1);
    assert.equal((await service.getOrCreateSession(context)).id, first.id);
    day = '2026-10-31';
    const next = await service.getOrCreateSession(context);
    assert.notEqual(next.id, first.id);
    assert.equal(sessions.length, 2);
    assert.equal(sessions[0].id, first.id);
    await service.sendMessage({ ...context, sessionId: first.id, text: 'Hello' });
    assert.equal(sentTo[0], `/api/ai/coach/sessions/${next.id}/messages`);
    assert.notEqual((await service.getOrCreateSession({ ...context, lessonId: 3 })).id, next.id);
    user = 'learner-2';
    assert.notEqual((await service.getOrCreateSession(context)).id, next.id);
  } finally {
    delete globalThis.__coachDailyTest;
  }
});

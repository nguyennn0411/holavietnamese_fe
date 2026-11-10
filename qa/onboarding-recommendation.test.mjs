import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOnboardingRecommendation,
  buildLearningPathPath,
  buildRecommendationPath,
  GOAL_DISCOVERY_PROFILES,
  normalizeGoalId,
  rankCoursesForRecommendation,
} from '../src/features/onboarding/services/recommendationEngine.js';

test('builds a practical beginner travel plan from onboarding answers', () => {
  const recommendation = buildOnboardingRecommendation({
    learningReasons: ['travel'],
    currentLevel: 'new',
    learningPath: 'beginner',
    dailyGoalMinutes: 10,
  });

  assert.equal(recommendation.targetLevel, 'A0');
  assert.equal(recommendation.goalId, 'travel');
  assert.equal(recommendation.paceId, 'steady');
  assert.equal(recommendation.sessionsPerWeek, 5);
  assert.equal(recommendation.weeklyMinutes, 50);

  const path = buildRecommendationPath(recommendation);
  assert.match(path, /level=A0/);
  assert.match(path, /recommended=1/);
  assert.match(path, /goal=travel/);
  assert.match(path, /pace=steady/);

  const learningPath = buildLearningPathPath(recommendation);
  assert.match(learningPath, /^\/learning-path\?/);
  assert.match(learningPath, /level=A0/);
  assert.match(learningPath, /goal=travel/);
});

test('placement result overrides self-assessed level', () => {
  const recommendation = buildOnboardingRecommendation({
    learningReasons: ['work'],
    currentLevel: 'words',
    dailyGoalMinutes: 15,
    placementResult: { targetLevel: 'B1' },
  });

  assert.equal(recommendation.targetLevel, 'B1');
  assert.equal(recommendation.paceId, 'progressive');
});

test('ranks same-level courses matching the learner goal first', () => {
  const ranked = rankCoursesForRecommendation([
    { course: { id: 1, level: 'A1', title: 'Vietnamese for travel and directions' } },
    { course: { id: 2, level: 'A1', title: 'Vietnamese writing foundations' } },
    { course: { id: 3, level: 'B2', title: 'Vietnamese travel conversations' } },
  ], { targetLevel: 'A1', goalId: 'travel' });

  assert.equal(ranked[0].course.id, 1);
  assert.ok(ranked[0].recommendationScore > ranked[1].recommendationScore);
});

test('every learning goal recommends culture, regional, or practical discovery content', () => {
  for (const goal of ['travel', 'connection', 'work', 'culture', 'challenge', 'other']) {
    const items = GOAL_DISCOVERY_PROFILES[goal];
    assert.equal(items.length, 3);
    assert.ok(items.some((item) => ['/culture', '/regional-vietnamese', '/explore'].includes(item.path)));
  }

  assert.deepEqual(
    GOAL_DISCOVERY_PROFILES.culture.map((item) => item.path),
    ['/culture', '/explore', '/regional-vietnamese'],
  );
  assert.equal(normalizeGoalId('daily_communication'), 'connection');
  assert.equal(normalizeGoalId('exam_vsl'), 'challenge');
});

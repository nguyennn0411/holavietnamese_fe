import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const read = (path) => fs.readFile(new URL(path, import.meta.url), 'utf8');

test('Welcome opens the onboarding questions before account creation', async () => {
  const [pages, app] = await Promise.all([
    read('../src/features/onboarding/pages/OnboardingPages.jsx'),
    read('../src/App.jsx'),
  ]);
  assert.match(pages, /navigate\('\/onboarding\/reason'\)/);
  assert.match(app, /path="\/onboarding\/reason" element=\{<ReasonPage \/>\}/);
  assert.doesNotMatch(app, /<Route element=\{<RequireAuth fallbackFeature="learning" \/>\}>[\s\S]*path="\/onboarding\/placement-test"/);
  assert.match(pages, /LOG IN TO SAVE THIS PLAN/);
  assert.match(pages, /New here\? Create an account/);
});

test('authenticated existing learners can open the placement test directly', async () => {
  const pages = await read('../src/features/onboarding/pages/OnboardingPages.jsx');
  assert.match(pages, /export const PlacementTestPage = \(\) => <ExerciseRunner mode="placement" \/>;/);
  assert.doesNotMatch(pages, /PlacementTestPage[^\n]*data\.learningPath !== 'placement'/);
});

test('registration and OTP verification preserve the post-login onboarding destination', async () => {
  const [register, verify, flow] = await Promise.all([
    read('../src/pages/RegisterPage.jsx'),
    read('../src/pages/auth/VerifyEmailPage.jsx'),
    read('../src/features/auth/emailVerificationFlow.js'),
  ]);
  assert.match(register, /savePostVerificationPath\(location\.state\?\.from \|\| '\/onboarding\/reason'\)/);
  assert.match(verify, /from: afterLogin/);
  assert.match(flow, /POST_VERIFICATION_PATH_KEY/);
});

test('onboarding result maps to a CEFR target and ranks personalized courses', async () => {
  const [data, service, engine, pages, courses] = await Promise.all([
    read('../src/features/onboarding/data/onboardingData.js'),
    read('../src/features/onboarding/services/onboardingService.js'),
    read('../src/features/onboarding/services/recommendationEngine.js'),
    read('../src/features/onboarding/pages/OnboardingPages.jsx'),
    read('../src/pages/courses/CourseListPage.jsx'),
  ]);
  assert.match(data, /targetLevel: 'A1'/);
  assert.match(data, /targetLevel: 'A2'/);
  assert.match(data, /targetLevel: 'B1'/);
  assert.match(data, /targetLevel: 'B2'/);
  assert.match(data, /targetLevel: 'C1'/);
  assert.match(service, /buildOnboardingRecommendation/);
  assert.match(service, /recommendation\.secondaryGoalIds/);
  assert.match(engine, /data\.placementResult\?\.targetLevel/);
  assert.match(engine, /recommended: '1'/);
  assert.match(engine, /goal: recommendation\.goalId/);
  assert.match(engine, /pace: recommendation\.paceId/);
  assert.match(pages, /buildRecommendationPath\(recommendation\)/);
  assert.match(courses, /searchParams\.get\('level'\)/);
  assert.match(courses, /searchParams\.get\('goal'\)/);
  assert.match(courses, /rankCoursesForRecommendation/);
  assert.match(courses, /Lộ trình khóa học dành riêng cho bạn/);
});

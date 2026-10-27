import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const read = (path) => fs.readFile(new URL(path, import.meta.url), 'utf8');

test('Welcome requires account creation before the onboarding entry test', async () => {
  const [pages, app] = await Promise.all([
    read('../src/features/onboarding/pages/OnboardingPages.jsx'),
    read('../src/App.jsx'),
  ]);
  assert.match(pages, /navigate\('\/register', \{ state: \{ from: '\/onboarding\/reason' \} \}\)/);
  assert.match(app, /<Route element=\{<RequireAuth fallbackFeature="learning" \/>\}>[\s\S]*path="\/onboarding\/placement-test"/);
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

test('placement result maps to a CEFR target and filters recommended courses', async () => {
  const [data, service, pages, courses] = await Promise.all([
    read('../src/features/onboarding/data/onboardingData.js'),
    read('../src/features/onboarding/services/onboardingService.js'),
    read('../src/features/onboarding/pages/OnboardingPages.jsx'),
    read('../src/pages/courses/CourseListPage.jsx'),
  ]);
  assert.match(data, /targetLevel: 'A1'/);
  assert.match(data, /targetLevel: 'A2'/);
  assert.match(data, /targetLevel: 'B1'/);
  assert.match(service, /data\.placementResult\?\.targetLevel/);
  assert.match(pages, /courses\?level=\$\{encodeURIComponent\(targetLevel\)\}&recommended=1/);
  assert.match(courses, /searchParams\.get\('level'\)/);
  assert.match(courses, /Khóa học phù hợp với kết quả Entry Test/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { answerPresent, answerLabel, moveItem } from '../src/components/learning/answerUtils.js';

test('Unanswered and cleared answers remain empty for every supported input shape', () => {
  for (const answer of [null, undefined, {}, '', '  ', {text:'  '}, {optionIds:[]}, {sequence:[]}, {pairs:{a:''}}]) {
    assert.equal(answerPresent(answer), false, JSON.stringify(answer));
  }
  for (const answer of [{text:'ngon'}, {optionIds:['a']}, {sequence:['b','a']}, {pairs:{left:'right'}}]) {
    assert.equal(answerPresent(answer), true);
  }
});

test('Review renders readable labels from numeric and string option IDs', () => {
  const options = [{id:1,textVi:'Cho tôi'}, {id:'2',text:'một bát phở'}];
  assert.equal(answerLabel({optionIds:['1',2]}, options), 'Cho tôi, một bát phở');
  assert.equal(answerLabel({sequence:[1,'2']}, options), 'Cho tôi một bát phở');
  assert.equal(answerLabel({pairs:{1:'2'}}, options), 'Cho tôi → một bát phở');
  assert.equal(answerLabel({acceptedAnswers:['ngon','rất ngon']}), 'ngon / rất ngon');
  assert.equal(answerLabel(null), 'Chưa trả lời');
});

test('Reordering preserves all IDs and the input array, including boundary moves', () => {
  const original = Object.freeze([101,102,103]);
  assert.deepEqual(moveItem(original,1,-1), [102,101,103]);
  assert.deepEqual(moveItem(original,1,1), [101,103,102]);
  assert.deepEqual(moveItem(original,0,-1), original);
  assert.deepEqual(moveItem(original,2,1), original);
  assert.deepEqual(original,[101,102,103]);
});

const source = await fs.readFile(new URL('../src/services/contentService.js', import.meta.url), 'utf8');
const calls = [];
const fixture = {
  session: async (path, options) => {calls.push({path,...options}); return {id:501};},
  jwt: async options => {calls.push(options); return {id:501};},
};
globalThis.__contentContractFixture = fixture;
const moduleSource = source
  .replace(/import \{ httpClient \} from [^;]+;/, 'const httpClient = globalThis.__contentContractFixture.session;')
  .replace(/import axiosClient from [^;]+;/, 'const axiosClient = {request:globalThis.__contentContractFixture.jwt};');
const {contentService} = await import('data:text/javascript;base64,' + Buffer.from(moduleSource).toString('base64'));
let token = null;
globalThis.localStorage = {getItem:key => key === 'token' ? token : null};

test('Lesson and quiz requests match existing server paths, methods and payloads', async () => {
  calls.length=0; token=null;
  await contentService.completeActivity(1005,{optionIds:['11']});
  await contentService.answer(501,1,{});
  await contentService.submit(501);
  await contentService.startQuiz(1);
  await contentService.result(501);
  assert.deepEqual(calls, [
    {path:'/activities/1005/complete',method:'POST',body:'{"answer":{"optionIds":["11"]}}'},
    {path:'/quiz-attempts/501/answers/1',method:'PUT',body:'{"answer":{}}'},
    {path:'/quiz-attempts/501/submit',method:'POST'},
    {path:'/quizzes/1/start',method:'POST'},
    {path:'/quiz-attempts/501/result',method:'GET'},
  ]);
});

test('Builders retain bilingual fields and immutable question/order identifiers', async () => {
  calls.length=0; token=null;
  const body={title:'Food',titleVi:'Ẩm thực',description:'A story',descriptionVi:'Một câu chuyện',isFree:true};
  await contentService.update('courses',1,body);
  await contentService.reorder('quizzes/1/questions',[3,1,2]);
  await contentService.addQuestion(1,3,2.5);
  await contentService.status('quizzes',1,'PUBLISHED');
  assert.deepEqual(JSON.parse(calls[0].body), body);
  assert.deepEqual(calls[1],{path:'/admin/quizzes/1/questions/reorder',method:'PUT',body:'{"ids":[3,1,2]}'});
  assert.deepEqual(calls[2],{path:'/admin/quizzes/1/questions',method:'POST',body:'{"questionId":3,"points":2.5}'});
  assert.deepEqual(calls[3],{path:'/admin/quizzes/1/status',method:'PATCH',body:'{"status":"PUBLISHED"}'});
});

test('Existing JWT client is reused without rewriting authentication or session storage', async () => {
  calls.length=0; token='test-token-only';
  const signal=new AbortController().signal;
  await contentService.attempt(501,signal);
  assert.deepEqual(calls[0],{url:'/api/quiz-attempts/501',method:'GET',data:undefined,signal});
  assert.equal(token,'test-token-only');
  token=null;
});

test('API failure propagates to UI rather than being converted to successful data', async () => {
  const original=fixture.session;
  // The wrapper bound above delegates through this function at module initialization.
  const rejectionSource=moduleSource.replace('const httpClient = globalThis.__contentContractFixture.session;', 'const httpClient = async () => { throw new Error("SERVER_REJECTED"); };');
  const rejected=await import('data:text/javascript;base64,'+Buffer.from(rejectionSource).toString('base64'));
  await assert.rejects(rejected.contentService.create('quizzes',{}),/SERVER_REJECTED/);
  assert.equal(fixture.session,original);
});

test('Every original route keeps its path, and all new routes are connected', async () => {
  const original=execFileSync('git',['show','HEAD:src/constants/routes.js'],{encoding:'utf8'});
  const current=await fs.readFile(new URL('../src/constants/routes.js',import.meta.url),'utf8');
  const routeMap=text=>Object.fromEntries([...text.matchAll(/(\w+):\s*'([^']+)'/g)].map(([,key,path])=>[key,path]));
  const before=routeMap(original), after=routeMap(current);
  for(const [key,path] of Object.entries(before)) assert.equal(after[key],path,key);
  const app=await fs.readFile(new URL('../src/App.jsx',import.meta.url),'utf8');
  for(const key of Object.keys(after)) assert.ok(app.includes(`ROUTES.${key}`),`${key} has a Route`);
  for (const key of ['VOCABULARY_REVIEW','EXPLORE','DESTINATION_DETAIL','BLOG','BLOG_DETAIL','QUIZ','QUIZ_ATTEMPT','QUIZ_RESULT','ADMIN_COURSES','ADMIN_COURSE_BUILDER','ADMIN_COURSE_PREVIEW','ADMIN_LESSONS','ADMIN_LESSON_BUILDER','ADMIN_LESSON_PREVIEW','ADMIN_QUESTIONS','ADMIN_QUIZZES','ADMIN_QUIZ_BUILDER','ADMIN_QUIZ_PREVIEW']) {
    assert.ok(after[key], `${key} is available`);
  }
});

test('Production entry never imports QA fixtures, and shared theme follows presentation CSS', async () => {
  const entry=await fs.readFile(new URL('../src/main.jsx',import.meta.url),'utf8');
  assert.ok(!entry.includes('qa/'));
  assert.ok(entry.indexOf('design-system.css')>entry.indexOf('ai-tutor.css'));
  const vite=await fs.readFile(new URL('../vite.config.js',import.meta.url),'utf8');
  assert.ok(!vite.includes('FixtureAuth')&&!vite.includes('fixtureHttpClient'));
});

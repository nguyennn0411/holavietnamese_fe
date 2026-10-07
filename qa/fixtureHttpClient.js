import {courses,lessons,words,questions,quizzes,attempt,quizResult,profile} from './fixtures';
const page=content=>({content,totalPages:1,totalElements:content.length});
const fixtureMode=new URLSearchParams(location.search).get('fixture');
export const resetCsrf=()=>{};
export async function httpClient(path,options={}){
 options.signal?.throwIfAborted(); const url=new URL(path,'http://qa.test'),p=url.pathname,method=options.method||'GET',body=options.body?JSON.parse(options.body):{};
 if(fixtureMode==='error')throw new Error('Không thể tải dữ liệu kiểm thử. Vui lòng thử lại.');
 if(fixtureMode==='empty' && ['/courses','/me/courses','/me/vocabulary'].includes(p))return [];
 if(fixtureMode==='empty' && /^\/admin\/(courses|lessons|questions|quizzes)$/.test(p))return page([]);
 if(p==='/me/session')return profile;
 if(p==='/courses')return courses;
 if(p==='/me/courses')return courses.slice(0,2).map(c=>({...c,courseId:c.id,courseTitle:c.title,enrollmentId:c.id,completedLessons:2,totalLessons:c.totalLessons,progressPercentage:45,lastAccessedLessonId:101,enrolledAt:'2026-10-08',status:'ACTIVE'}));
 if(/^\/courses\/\d+\/lessons$/.test(p))return p.split('/')[2]==='1'?lessons:[];
 if(p.endsWith('/enrollment-status')||p.endsWith('/enroll'))return {enrolled:true,courseId:1,status:'ACTIVE',progressPercentage:45};
 if(/^\/courses\/\d+$/.test(p))return courses.find(c=>String(c.id)===p.split('/').at(-1))||courses[0];
 if(p.endsWith('/progress'))return {progressPercentage:45,completedLessons:2,totalLessons:6,nextLessonId:101};
 if(p==='/me/vocabulary'){if(method==='POST'){const item={...body,id:words.length+1};words.push(item);return item;}return words.filter(w=>!url.searchParams.get('keyword')||w.word.includes(url.searchParams.get('keyword')));}
 if(p.startsWith('/me/vocabulary/')){const id=Number(p.split('/').at(-1));const item=words.find(w=>w.id===id);if(method==='DELETE'){words.splice(words.indexOf(item),1);return null;}if(method==='PUT')Object.assign(item,body);return item;}
 if(p==='/admin/vocabulary-topics')return [{id:1,name:'Ẩm thực'},{id:2,name:'Chào hỏi'}];
 if(p==='/admin/vocabulary')return words;
 if(p.startsWith('/admin/vocabulary/'))return words[0];
 if(p.startsWith('/activities/')){const id=Number(p.split('/')[2]),lesson=lessons[0],activity=lesson.activities.find(a=>a.id===id);const activityCompleted=id!==1005||body.answer?.optionIds?.map(String).includes('11');if(activityCompleted)lesson.progress.activities.find(a=>a.activityId===id).status='COMPLETED';return{...lesson.progress,activityCompleted,completed:false,progressPercent:Math.round(lesson.progress.activities.filter(a=>a.status==='COMPLETED').length/6*100)};}
 if(p.startsWith('/quiz-attempts/')){if(p.includes('/answers/')){const q=attempt.questions.find(q=>q.questionId===Number(p.split('/').at(-1)));q.answer=body.answer;return q;}return p.endsWith('/result')||p.endsWith('/submit')?quizResult:attempt;}
 if(p.startsWith('/quizzes/'))return p.endsWith('/start')?attempt:quizzes[0];
 if(p.startsWith('/lessons/')){const lesson=lessons.find(l=>String(l.id)===p.split('/')[2])||lessons[0];if(p.endsWith('/complete'))lesson.learningStatus='COMPLETED';return lesson;}
 if(p.startsWith('/admin/')){const[, ,kind,id,suffix]=p.split('/');const data={courses,lessons,questions,quizzes}[kind];if(data){if(!id&&method==='GET'){const query=url.searchParams.get('search')?.toLowerCase();return page(data.filter(item=>!query||(item.title||item.prompt).toLowerCase().includes(query)));}const item=data.find(i=>String(i.id)===id)||data[0];if(method==='POST'&&!id){const created={...body,id:data.length+1,status:'DRAFT',modules:[],activities:[],questions:[]};data.push(created);return created;}if(method==='PATCH'){item.status=body.status;return item;}if(method==='PUT'){Object.assign(item,body);return item;}if(kind==='questions')return{...item,versions:[{...item,snapshot:item,versionNumber:1}]};if(kind==='quizzes'&&suffix==='preview')return questions;return item;}return body;}
 throw new Error(`Fixture chưa hỗ trợ ${method} ${p}`);
}


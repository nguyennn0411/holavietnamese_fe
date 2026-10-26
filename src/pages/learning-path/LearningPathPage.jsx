import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, ChevronRight, Circle, Lock, RefreshCw, Settings2 } from 'lucide-react';
import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';
import { useLearningPath } from '@/hooks/useLearningPath';
import '@/styles/learning-path-simple.css';

const LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];
const SOURCE_LABELS = {
  USER_CONFIRMED: ['Người học xác nhận', 'Confirmed by learner'],
  PLACEMENT: ['Bài kiểm tra đầu vào', 'Placement test'],
  PROFILE: ['Hồ sơ cá nhân', 'User profile'],
  ONBOARDING: ['Onboarding', 'Onboarding'],
};
const REASON_LABELS = {
  LEVEL_AND_GOAL_MATCH: ['Khớp trình độ và mục tiêu', 'Matches level and goal'],
  LEVEL_MATCH: ['Khớp trình độ hiện tại', 'Matches current level'],
  NEAREST_LEVEL: ['Trình độ gần nhất hiện có', 'Nearest available level'],
};

const titleOf = item => item?.titleVi || item?.title || '';
const descriptionOf = item => item?.descriptionVi || item?.description || '';
const courseIdOf = item => item?.courseId ?? item?.id;

function LearningPathSkeleton() {
  return <main className="learning-path-simple-page" aria-busy="true"><section className="learning-path-simple-card learning-path-skeleton"><div/><div/><div/><div/></section></main>;
}

function LevelRequired({ saving, onSave }) {
  const [level, setLevel] = useState('');
  return <main className="learning-path-simple-page"><section className="learning-path-simple-card learning-path-state"><BookOpen size={28}/><h1><BilingualText vi="Hãy xác định trình độ hiện tại" en="Choose your current level" /></h1><p><BilingualText vi="Chúng tôi chưa có đủ dữ liệu để kết luận trình độ của bạn. Chọn một mức hoặc làm bài kiểm tra đầu vào." en="We do not have enough information to determine your level. Choose one or take the placement test." /></p><div className="learning-path-level-tabs">{LEVELS.map(item=><button type="button" key={item} className={level===item?'is-active':''} onClick={()=>setLevel(item)}>{item}</button>)}</div><div className="learning-path-state-actions"><button disabled={!level||saving} onClick={()=>onSave(level)}><BilingualText vi="Xác nhận trình độ" en="Confirm level" /></button><Link to="/onboarding/placement-test"><BilingualText vi="Làm bài kiểm tra đầu vào" en="Take placement test" /></Link></div></section></main>;
}

function Roadmap({ stages, courseId }) {
  if (!stages?.length) return <div className="learning-path-empty"><BilingualText vi="Khóa học này chưa có module và bài học được xuất bản." en="This course has no published modules or lessons yet." /></div>;
  return <ol>{stages.flatMap(module => [
    ...(module.lessons || []).map(lesson => ({ ...lesson, moduleTitle: titleOf(module) })),
    { id:`milestone-${module.id}`, milestone:true, moduleTitle:titleOf(module), state:module.milestone?.state||'LOCKED', assessment:module.assessment },
  ]).map(item => {
    const state = item.state || 'LOCKED';
    const icon = state==='COMPLETED'?<Check size={16}/>:state==='LOCKED'?<Lock size={14}/>:state==='IN_PROGRESS'?<Circle size={15} fill="currentColor"/>:<BookOpen size={15}/>;
    if (item.milestone) {
      const milestone=<><small><BilingualText vi="Cột mốc" en="Milestone" /></small><strong>{item.assessment?.titleVi || item.assessment?.title || `${item.moduleTitle} · Checkpoint`}</strong><p><BilingualText vi="Hoàn thành các bài học trong giai đoạn để mở khóa đánh giá." en="Complete this stage's lessons to unlock its assessment." /></p></>;
      return <li key={item.id} className={`is-${state.toLowerCase().replace('_','-')}`}><span>{icon}</span><div>{item.assessment&&state==='AVAILABLE'?<Link to={`/quizzes/${item.assessment.id}`}>{milestone}</Link>:milestone}</div></li>;
    }
    const content=<><small>{item.moduleTitle}</small><strong>{titleOf(item)}</strong><p>{descriptionOf(item)}</p></>;
    return <li key={item.id} className={`is-${state.toLowerCase().replace('_','-')}`}><span>{icon}</span><div>{state==='LOCKED'?content:<Link to={`/learn/${courseId}/lesson/${item.id}`}>{content}</Link>}</div></li>;
  })}</ol>;
}

export function LearningPathPage() {
  const path = useLearningPath();
  const { confirm, confirmationDialog } = useConfirmDialog();
  const [editing, setEditing] = useState(false);
  const [level, setLevel] = useState('');
  const [goals, setGoals] = useState('');
  const [minutes, setMinutes] = useState(15);
  useEffect(()=>{
    const pref = path.data?.preferences;
    if (!pref) return;
    setLevel(pref.level || '');
    setGoals((pref.learningGoals || []).join(', '));
    setMinutes(pref.dailyStudyMinutes || 15);
  },[path.data]);

  const preferences = path.data?.preferences || {};
  const recommendation = path.data?.recommendation || {};
  const recommended = recommendation.recommendedCourse;
  const recommendedPath = recommendation.recommendedPath || [];
  const exactCourses = recommendation.courses || [];
  const nearestCourses = recommendation.nearestCourses || [];
  const active = path.data?.activeCourse;
  const roadmapCourse = path.data?.roadmapCourse;
  const progress = path.data?.progress || {};
  const continueLearning = path.data?.continueLearning || [];
  const nextMilestone = path.data?.roadmap?.find(module => module.milestone?.state !== 'COMPLETED');
  const source = SOURCE_LABELS[preferences?.levelSource] || ['Chưa xác định', 'Not determined'];
  const catalogPath = useMemo(() => {
    const query = new URLSearchParams();
    if (preferences?.level) query.set('level', preferences.level);
    const firstGoal = preferences?.learningGoals?.[0];
    if (firstGoal) query.set('goal', firstGoal);
    return `/courses?${query}`;
  }, [preferences]);

  if (path.error && !path.data) return <main className="learning-path-simple-page"><section className="learning-path-simple-card learning-path-state" role="alert"><h1><BilingualText vi="Không thể tải Learning Path" en="Unable to load Learning Path" /></h1><p>{path.error}</p><button onClick={path.reload}><RefreshCw size={15}/><BilingualText vi="Thử lại" en="Retry" /></button></section></main>;
  if (path.loading || !path.data) return <LearningPathSkeleton/>;
  if (path.data?.requiresLevel) return <LevelRequired saving={path.saving} onSave={selected=>path.updatePreferences({level:selected,levelSource:'USER_CONFIRMED'})}/>;

  const applyCourse = async course => {
    if (!await confirm({
      title: bilingualLabel('Áp dụng khóa học này?', 'Use this course?'),
      description: bilingualLabel(`“${titleOf(course)}” sẽ trở thành lộ trình hiện tại. Tiến độ các khóa học trước vẫn được giữ nguyên.`, `“${titleOf(course)}” will become your active path. Progress in previous courses will be preserved.`),
      confirmLabel: bilingualLabel('Áp dụng khóa học', 'Use course'),
      cancelLabel: bilingualLabel('Hủy', 'Cancel'),
      tone: 'warning',
    })) return;
    await path.apply(courseIdOf(course));
  };

  const applyRecommendedPath = async () => {
    if (!recommendedPath.length) return;
    if (!await confirm({
      title: bilingualLabel(`Áp dụng lộ trình ${recommendedPath.length} khóa học?`, `Apply a ${recommendedPath.length}-course path?`),
      description: bilingualLabel('Các khóa học sẽ được thêm theo đúng thứ tự đề xuất. Tiến độ hiện tại của bạn vẫn được giữ nguyên.', 'Courses will be added in the recommended order. Your existing progress will be preserved.'),
      details: <ol className="learning-path-confirm-list">{recommendedPath.map((course,index)=><li key={courseIdOf(course)}><span>{index+1}</span><div><small>{course.levelMin===course.levelMax?course.level:`${course.levelMin}–${course.levelMax}`}</small><strong>{titleOf(course)}</strong></div></li>)}</ol>,
      confirmLabel: bilingualLabel('Áp dụng lộ trình', 'Apply path'),
      cancelLabel: bilingualLabel('Hủy', 'Cancel'),
      tone: 'warning',
    })) return;
    await path.applyPath(recommendedPath.map(courseIdOf));
  };

  const savePreferences = async event => {
    event.preventDefault();
    if (!await confirm({
      title: bilingualLabel('Lưu tùy chỉnh lộ trình?', 'Save learning preferences?'),
      description: bilingualLabel('Hệ thống sẽ cập nhật trình độ, mục tiêu và đề xuất lộ trình phù hợp với lựa chọn mới.', 'Your level, goals, and recommendations will be updated using these preferences.'),
      confirmLabel: bilingualLabel('Lưu thay đổi', 'Save changes'),
      cancelLabel: bilingualLabel('Hủy', 'Cancel'),
      tone: 'warning',
    })) return;
    await path.updatePreferences({level,levelSource:'USER_CONFIRMED',learningGoals:goals.split(',').map(item=>item.trim()).filter(Boolean),dailyStudyMinutes:Number(minutes)});
    setEditing(false);
  };

  return <><main className="learning-path-simple-page"><section className="learning-path-simple-card">
    <header className="learning-path-simple-header"><div><strong><BookOpen size={17}/> Hola Vietnamese</strong><span><BilingualText vi="Học tập cá nhân hóa" en="Personalized Learning" /></span></div><button className="learning-path-preference-trigger" onClick={()=>setEditing(value=>!value)}><Settings2 size={14}/><BilingualText vi="Tùy chỉnh" en="Preferences" /></button></header>
    {path.error&&<div className="learning-path-inline-error" role="alert">{path.error}</div>}
    <div className="learning-path-simple-intro"><span className="learning-path-simple-kicker"><BilingualText vi="Lộ trình cá nhân hóa" en="Personalized path" /></span><h1><BilingualText vi="Hành trình tiếng Việt của bạn" en="Your Vietnamese Journey" /></h1><p><BilingualText vi="Lộ trình sử dụng khóa học, module, bài học và đánh giá đã xuất bản." en="Your path uses published courses, modules, lessons, and assessments." /></p></div>

    <section className="learning-path-personalized-hero"><div><span>{preferences.level || '—'}</span><h2>{roadmapCourse?titleOf(roadmapCourse):<BilingualText vi="Chưa có khóa học phù hợp" en="No matching course yet" />}</h2><p><BilingualText vi={`Mục tiêu: ${(preferences.learningGoals||[]).join(', ')||'Chưa cập nhật'} · ${preferences.dailyStudyMinutes||'—'} phút/ngày`} en={`Goals: ${(preferences.learningGoals||[]).join(', ')||'Not set'} · ${preferences.dailyStudyMinutes||'—'} min/day`} /></p>{recommendedPath.length>0&&<button disabled={path.saving} onClick={applyRecommendedPath}><BilingualText vi={`Áp dụng lộ trình ${recommendedPath.length} khóa học`} en={`Apply ${recommendedPath.length}-course path`}/></button>}</div><dl><div><dt><BilingualText vi="Trình độ" en="Level" /></dt><dd>{preferences.level || '—'}</dd></div><div><dt><BilingualText vi="Nguồn xác định" en="Level source" /></dt><dd><BilingualText vi={source[0]} en={source[1]}/></dd></div><div><dt><BilingualText vi="Trạng thái" en="Status" /></dt><dd>{path.data?.roadmapPreview?<BilingualText vi="Bản xem trước" en="Preview"/>:<BilingualText vi="Đang áp dụng" en="Active"/>}</dd></div></dl></section>

    {editing&&<form className="learning-path-preferences" onSubmit={savePreferences}><h2><BilingualText vi="Tùy chỉnh lộ trình" en="Learning preferences" /></h2><label><BilingualText vi="Trình độ hiện tại" en="Current level"/><select value={level} onChange={event=>setLevel(event.target.value)}>{LEVELS.map(item=><option key={item}>{item}</option>)}</select></label><label><BilingualText vi="Mục tiêu học (phân cách bằng dấu phẩy)" en="Learning goals (comma separated)"/><input value={goals} onChange={event=>setGoals(event.target.value)}/></label><label><BilingualText vi="Phút học mỗi ngày" en="Daily study minutes"/><input type="number" min="5" max="240" value={minutes} onChange={event=>setMinutes(event.target.value)}/></label><div><button type="button" className="secondary" onClick={()=>setEditing(false)}><BilingualText vi="Hủy" en="Cancel"/></button><button disabled={path.saving}><BilingualText vi="Lưu thay đổi" en="Save changes"/></button></div></form>}

    <section className="learning-path-progress-card"><div className="learning-path-section-heading"><div><h2><BilingualText vi="Tiến độ Learning Path" en="Learning Path Progress"/></h2><p><BilingualText vi={`${progress.completedLessons||0}/${progress.totalLessons||0} bài thực tế đã hoàn thành trong active path.`} en={`${progress.completedLessons||0}/${progress.totalLessons||0} real lessons completed in the active path.`}/></p></div><strong>{progress.percentage||0}%</strong></div><div className="learning-path-progress"><span style={{width:`${progress.percentage||0}%`}}/></div><dl className="learning-path-simple-stats"><div><dt>{progress.completedLessons||0}</dt><dd><BilingualText vi="Bài hoàn thành" en="Completed"/></dd></div><div><dt>{progress.inProgressLessons||0}</dt><dd><BilingualText vi="Đang học" en="In progress"/></dd></div><div><dt className="is-text">{nextMilestone?titleOf(nextMilestone):'—'}</dt><dd><BilingualText vi="Cột mốc tiếp theo" en="Next milestone"/></dd></div></dl></section>

    {continueLearning.length>0&&<section className="learning-path-continue"><div className="learning-path-section-heading"><h2><BilingualText vi="Tiếp tục học" en="Continue Learning"/></h2></div><div className="learning-path-continue-list">{continueLearning.map(item=><article key={item.id}><div><span className="learning-path-status"><BilingualText vi="Đang học" en="In progress"/></span><strong>{titleOf(item)}</strong><p>{item.completedLessons}/{item.totalLessons} <BilingualText vi="bài đã hoàn thành" en="lessons completed"/></p></div><div className="learning-path-progress"><span style={{width:`${item.progressPercentage||0}%`}}/></div>{item.nextLesson?<Link to={`/learn/${item.id}/lesson/${item.nextLesson.id}`}><BilingualText vi="Tiếp tục" en="Continue"/><ChevronRight size={14}/></Link>:<Link to={`/courses/${item.id}`}><BilingualText vi="Mở khóa học" en="Open course"/></Link>}</article>)}</div>{recommendedPath.length>0&&<div className="learning-path-suggestion"><strong><BilingualText vi="Lộ trình đề xuất" en="Recommended path"/></strong><p><BilingualText vi={`Gồm ${recommendedPath.length} khóa học theo thứ tự. Tiến độ các khóa cũ vẫn được giữ nguyên.`} en={`Includes ${recommendedPath.length} courses in sequence. Existing course progress will be preserved.`}/></p><button disabled={path.saving} onClick={applyRecommendedPath}><BilingualText vi="Áp dụng toàn bộ lộ trình" en="Apply full path"/></button></div>}</section>}

    {recommendedPath.length>0&&<section className="learning-path-course-path"><div className="learning-path-section-heading"><div><h2><BilingualText vi="Lộ trình khóa học được đề xuất" en="Recommended course path"/></h2><p><BilingualText vi="Hoàn thành các khóa học theo thứ tự để đạt mục tiêu đã chọn." en="Complete these courses in order to reach your selected goals."/></p></div><button disabled={path.saving} onClick={applyRecommendedPath}><BilingualText vi="Áp dụng lộ trình" en="Apply path"/></button></div><ol>{recommendedPath.map((course,index)=><li key={courseIdOf(course)}><span>{index+1}</span><div><small>{course.levelMin===course.levelMax?course.level:`${course.levelMin}–${course.levelMax}`}</small><strong>{titleOf(course)}</strong><p>{descriptionOf(course)}</p></div><Link to={`/courses/${courseIdOf(course)}`} aria-label={bilingualLabel(`Xem ${titleOf(course)}`,`View ${titleOf(course)}`)}><ChevronRight size={16}/></Link></li>)}</ol></section>}

    <section className="learning-path-roadmap"><div className="learning-path-section-heading"><div><h2><BilingualText vi="Lộ trình tương tác" en="Interactive Roadmap"/></h2><p>{roadmapCourse?titleOf(roadmapCourse):<BilingualText vi="Chưa có lộ trình khả dụng" en="No path available"/>}{path.data?.roadmapPreview&&<> · <BilingualText vi="Bản xem trước" en="Preview"/></>}</p></div>{roadmapCourse&&<Link to={`/courses/${roadmapCourse.id}`}><BilingualText vi="Chi tiết khóa học" en="Course details"/><ArrowRight size={14}/></Link>}</div><Roadmap stages={path.data?.roadmap} courseId={roadmapCourse?.id}/></section>

    <section className="learning-path-courses"><div className="learning-path-section-heading"><div><h2><BilingualText vi="Khóa học đề xuất" en="Recommended Courses"/></h2><p><BilingualText vi="Xếp hạng theo trình độ, mục tiêu, điều kiện tiên quyết và trạng thái xuất bản." en="Ranked by level, goals, prerequisites, and publication status."/></p></div><Link to={catalogPath}><BilingualText vi="Mở Course Catalog" en="Open Course Catalog"/><ArrowRight size={14}/></Link></div>{exactCourses.length?<div className="learning-path-course-list">{exactCourses.map(item=><button key={item.id} onClick={()=>applyCourse(item)} disabled={path.saving}><span>{item.levelMin===item.levelMax?item.level:item.levelMin+'–'+item.levelMax}</span><strong>{titleOf(item)}</strong><small><BilingualText vi="Áp dụng" en="Apply"/><ChevronRight size={13}/></small></button>)}</div>:<div className="learning-path-empty"><strong><BilingualText vi="Chưa có khóa học phù hợp chính xác" en="No exact matching course"/></strong><p><BilingualText vi="Không tạo dữ liệu giả. Bạn có thể xem các lựa chọn gần nhất bên dưới hoặc mở Course Catalog." en="No placeholder course is created. Review the nearest options below or open Course Catalog."/></p>{nearestCourses.length>0&&<div className="learning-path-course-list">{nearestCourses.map(item=>{const reason=REASON_LABELS[item.recommendationReason]||REASON_LABELS.NEAREST_LEVEL;return <Link key={item.id} to={`/courses/${item.id}`}><span>{item.level}</span><strong>{titleOf(item)}</strong><small><BilingualText vi={reason[0]} en={reason[1]}/></small></Link>;})}</div>}</div>}</section>
  </section></main>{confirmationDialog}</>;
}

export default LearningPathPage;

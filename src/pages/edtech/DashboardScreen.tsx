import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Check, Clock3, Flame, Lock, Map, RefreshCw, Sparkles, Star, Trophy } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { learnerService } from '@/services/learnerService';
import { learningService } from '@/services/learningService';

type AnyRecord = Record<string, any>;

const asArray = (value: any): AnyRecord[] => {
  const unwrapped = value?.result ?? value;
  if (Array.isArray(unwrapped)) return unwrapped;
  return Array.isArray(unwrapped?.content) ? unwrapped.content : [];
};
const courseIdOf = (course: AnyRecord | null) => course?.courseId ?? course?.id;

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<AnyRecord>({});
  const [course, setCourse] = useState<AnyRecord | null>(null);
  const [courseProgress, setCourseProgress] = useState<AnyRecord>({});
  const [lessons, setLessons] = useState<AnyRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([learnerService.getProgressData(), courseService.myCourses()])
      .then(async ([summary, enrolledResponse]) => {
        if (!active) return;
        const enrolled = asArray(enrolledResponse);
        const currentCourse = enrolled.find((item) => item.status === 'ACTIVE') ?? enrolled[0] ?? null;
        setProgress(summary ?? {});
        setCourse(currentCourse);
        const courseId = courseIdOf(currentCourse);
        if (!courseId) return;
        const [lessonList, learningProgress] = await Promise.all([
          learningService.lessons(courseId),
          learningService.progress(courseId).catch(() => ({})),
        ]);
        if (!active) return;
        setLessons(asArray(lessonList));
        setCourseProgress(learningProgress ?? {});
      })
      .catch((reason) => active && setError(reason?.message || 'We could not load your learning path.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [revision]);

  const currentId = courseProgress?.currentLessonId ?? courseProgress?.nextLessonId ?? progress?.currentLesson?.id;
  const completedIds = useMemo(() => new Set(asArray(courseProgress?.completedLessons).map((item) => item.id ?? item.lessonId)), [courseProgress]);
  const firstIncomplete = lessons.find((lesson) => !lesson.isCompleted && !completedIds.has(lesson.id));
  const selected = lessons.find((lesson) => lesson.id === selectedId) ?? lessons.find((lesson) => lesson.id === currentId) ?? firstIncomplete ?? lessons[0];
  const completion = Number(courseProgress?.progressPercentage ?? course?.progress ?? 0);

  const statusOf = (lesson: AnyRecord) => {
    if (lesson.isCompleted || lesson.learningStatus === 'COMPLETED' || completedIds.has(lesson.id)) return 'completed';
    if (lesson.id === currentId || lesson.id === firstIncomplete?.id) return 'current';
    if (lesson.locked || lesson.isLocked || lesson.learningStatus === 'LOCKED') return 'locked';
    return 'available';
  };

  const openLesson = (lesson: AnyRecord) => {
    const courseId = courseIdOf(course);
    if (!courseId || statusOf(lesson) === 'locked') return;
    navigate(`/learn/${courseId}/lesson/${lesson.id}`);
  };

  if (loading) return <div className="mx-auto max-w-6xl px-5 py-10" aria-busy="true"><div className="h-56 animate-pulse rounded-[2rem] bg-[#f1e6d7]"/><div className="mx-auto mt-10 h-[34rem] max-w-2xl animate-pulse rounded-[2rem] bg-white"/></div>;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#d7b991] bg-gradient-to-br from-[#581C17] via-[#7d261e] to-[#B42318] p-7 text-white shadow-[0_24px_70px_rgba(88,28,23,.22)] sm:p-10">
        <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-[#E8B74C]/20 blur-2xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.16em]"><Map size={14}/> My learning path</span>
            <h1 className="mt-4 text-3xl font-black sm:text-5xl">{course?.title ?? course?.courseTitle ?? 'Your Vietnamese journey'}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">Follow your real course sequence, revisit completed lessons, and continue from the next lesson available to you.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <HeroStat icon={<Flame size={18}/>} value={progress?.streakCount ?? progress?.currentStreak ?? 0} label="day streak" />
            <HeroStat icon={<Star size={18}/>} value={progress?.totalXp ?? 0} label="total XP" />
            <HeroStat icon={<Trophy size={18}/>} value={`${Math.max(0, Math.min(100, completion))}%`} label="course" />
          </div>
        </div>
      </section>

      {error ? <div role="alert" className="mt-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><span>{error}</span><button onClick={() => setRevision((v) => v + 1)} className="inline-flex items-center gap-2 font-bold"><RefreshCw size={15}/> Retry</button></div> : null}

      {!course && !error ? <section className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-dashed border-[#d7b991] bg-white p-10 text-center shadow-sm"><BookOpen className="mx-auto text-[#B42318]" size={42}/><h2 className="mt-4 text-2xl font-black text-[#251B18]">Choose your first course</h2><p className="mt-2 text-sm text-[#78685B]">Enroll in a course to turn this space into your personal learning path.</p><Link to="/courses" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#B42318] px-5 py-3 font-black text-white">Explore courses <ArrowRight size={17}/></Link></section> : null}

      {course && !lessons.length && !error ? <section className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-dashed border-[#d7b991] bg-white p-10 text-center"><BookOpen className="mx-auto text-[#B42318]" size={38}/><h2 className="mt-3 text-xl font-black text-[#251B18]">No published lessons yet</h2><p className="mt-2 text-sm text-[#78685B]">This course is enrolled, but its learning path does not contain available lessons.</p></section> : null}

      {lessons.length ? <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#eadbc8] bg-[#FFFCF7] px-5 py-10 shadow-sm sm:px-10">
          <div className="absolute left-1/2 top-16 h-[calc(100%-8rem)] w-2 -translate-x-1/2 rounded-full bg-[#eadbc8]" />
          <div className="relative space-y-10">
            {lessons.map((lesson, index) => {
              const status = statusOf(lesson);
              const active = selected?.id === lesson.id;
              return <motion.button key={lesson.id} type="button" disabled={status === 'locked'} onClick={() => setSelectedId(lesson.id)} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay: Math.min(index * .05, .35)}} className={`group relative flex w-full ${index % 2 ? 'justify-end pr-[8%]' : 'justify-start pl-[8%]'} text-left disabled:cursor-not-allowed`}>
                <span className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-[7px] border-[#FFFCF7] shadow-[0_9px_0_rgba(68,36,27,.15)] transition-transform group-hover:-translate-y-1 ${status === 'completed' ? 'bg-[#16A34A] text-white' : status === 'current' ? 'bg-[#B42318] text-white animate-pulse' : status === 'locked' ? 'bg-stone-300 text-stone-500' : 'bg-[#E8B74C] text-[#581C17]'} ${active ? 'ring-4 ring-[#E8B74C]/50' : ''}`}>
                  {status === 'completed' ? <Check size={30} strokeWidth={4}/> : status === 'locked' ? <Lock size={25}/> : <span className="text-xl font-black">{index + 1}</span>}
                  {status === 'current' ? <span className="absolute -top-7 rounded-full bg-[#251B18] px-3 py-1 text-[10px] font-black tracking-wider text-white">START</span> : null}
                </span>
                <span className={`absolute top-1/2 hidden -translate-y-1/2 sm:block ${index % 2 ? 'right-[calc(8%+6rem)] text-right' : 'left-[calc(8%+6rem)]'} max-w-[34%]`}><strong className="block text-sm text-[#251B18]">{lesson.title ?? lesson.titleVi ?? `Lesson ${index + 1}`}</strong><small className="text-[#78685B]">{status}</small></span>
              </motion.button>;
            })}
          </div>
        </section>

        <aside className="h-fit rounded-[2rem] border border-[#eadbc8] bg-white p-6 shadow-[0_16px_50px_rgba(88,28,23,.09)] lg:sticky lg:top-24">
          <span className="text-xs font-black uppercase tracking-[.15em] text-[#B42318]">Selected lesson</span>
          <h2 className="mt-2 text-2xl font-black text-[#251B18]">{selected?.title ?? selected?.titleVi}</h2>
          {selected?.description ? <p className="mt-3 text-sm leading-6 text-[#78685B]">{selected.description}</p> : null}
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[#581C17]">
            {selected?.estimatedDuration != null ? <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF5EB] px-3 py-2"><Clock3 size={14}/>{selected.estimatedDuration} min</span> : null}
            {selected?.xpReward != null ? <span className="inline-flex items-center gap-1 rounded-full bg-[#fff4d5] px-3 py-2"><Sparkles size={14}/>{selected.xpReward} XP</span> : null}
          </div>
          {Array.isArray(selected?.objectives) && selected.objectives.length ? <ul className="mt-5 space-y-2">{selected.objectives.map((objective: string, index: number) => <li key={index} className="flex gap-2 text-sm text-[#4f423d]"><Check size={16} className="mt-0.5 shrink-0 text-[#16A34A]"/>{objective}</li>)}</ul> : null}
          <button type="button" disabled={statusOf(selected) === 'locked'} onClick={() => openLesson(selected)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#B42318] px-5 py-3.5 font-black text-white shadow-[0_5px_0_#7f1d17] transition active:translate-y-1 disabled:bg-stone-300 disabled:shadow-none">{statusOf(selected) === 'completed' ? 'Review lesson' : statusOf(selected) === 'locked' ? 'Lesson locked' : 'Start lesson'}<ArrowRight size={18}/></button>
        </aside>
      </div> : null}
    </main>
  );
};

function HeroStat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur"><span className="mx-auto flex w-fit text-[#E8B74C]">{icon}</span><strong className="mt-1 block text-lg">{value}</strong><small className="text-[10px] uppercase tracking-wider text-white/65">{label}</small></div>;
}

export default DashboardScreen;

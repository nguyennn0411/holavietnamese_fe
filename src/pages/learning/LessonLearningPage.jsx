import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { learningService } from '@/services/learningService';
import { useLearning } from '@/hooks/useLearning';
import { ResourceState } from '@/components/common/ResourceState';
import { LessonSidebar } from '@/components/learning/LessonSidebar';
import { LessonContent } from '@/components/learning/LessonContent';
import { LessonNavigation } from '@/components/learning/LessonNavigation';
import { VocabularyForm } from '@/components/vocabulary/VocabularyForm';
import { LessonActivities } from '@/components/learning/LessonActivities';
import { useAiSidebar } from '@/contexts/AiSidebarContext';
import { ArrowLeft, CheckCircle2, Bookmark, PanelLeftClose, PanelLeft, Check } from 'lucide-react';

function LessonContextSyncer({ lesson, course, contentLesson, courseId }) {
  const { setLearningContext } = useAiSidebar();
  useEffect(() => {
    if (lesson) {
      const rawContent = contentLesson?.content || lesson.content || lesson.summary || lesson.description || '';
      setLearningContext({
        courseId: courseId || course?.id,
        courseTitle: course?.titleVi || course?.title || '',
        lessonId: lesson.id,
        lessonTitle: lesson.titleVi || lesson.title || '',
        lessonContent: rawContent,
        vocabulary: lesson.vocabulary || contentLesson?.vocabulary || [],
      });
    }
    return () => {
      setLearningContext(null);
    };
  }, [lesson, course, contentLesson, courseId, setLearningContext]);
  return null;
}

export function LessonLearningPage() {
  const { courseId, lessonId } = useParams();
  return <LessonScreen key={courseId} courseId={courseId} lessonId={lessonId} />;
}

function LessonScreen({ courseId, lessonId }) {
  const navigate = useNavigate();
  const resource = useLearning(courseId, lessonId);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [savingWord, setSavingWord] = useState(false);
  const [message, setMessage] = useState('');
  const [contentLesson, setContentLesson] = useState(null);

  // Trạng thái mở/đóng thanh bên (Sidebar danh sách bài học)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mặc định mở thanh bên trên màn hình lớn
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  async function complete() {
    setPending(true);
    setError('');
    try {
      await learningService.complete(lessonId);
      resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <ResourceState resource={resource}>
      {({ course, lesson, lessons, progress }) => {
        return (
          <>
            <LessonContextSyncer lesson={lesson} course={course} contentLesson={contentLesson} courseId={courseId} />
          <div className="lesson-learning-screen max-w-7xl mx-auto space-y-4 transition-all duration-300">
            {/* ===================== TOP HEADER BAR ===================== */}
            <header className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E5DF] p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs sticky top-2 z-30 transition-all">
              {/* Cụm trái: Nút quay lại & Tiêu đề bài học */}
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  to={`/courses/${courseId}`}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors no-underline shrink-0"
                >
                  <ArrowLeft size={14} />
                  <span className="hidden sm:inline">
                    <BilingualText vi="Khóa học" en="Course" />
                  </span>
                </Link>

                <div className="h-4 w-[1px] bg-stone-200 hidden sm:block shrink-0" />

                <div className="min-w-0 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 shrink-0">
                    <BilingualText
                      vi={`BÀI ${lesson.lessonOrder || ''}`}
                      en={`LESSON ${lesson.lessonOrder || ''}`}
                    />
                  </span>
                  <h1 className="text-sm sm:text-base font-extrabold text-stone-900 truncate tracking-tight m-0">
                    {lesson.titleVi || lesson.title}
                  </h1>
                </div>
              </div>

              {/* Cụm phải: Tiến độ học & Nút tiện ích */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                {/* Chỉ số tiến độ hoàn thành khóa học */}
                <div
                  className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-stone-50 border border-stone-200/60 text-xs font-medium text-stone-600"
                  title={`${progress?.completedLessons || 0}/${progress?.totalLessons || 0} bài đã xong`}
                >
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>
                    {progress?.completedLessons || 0}/{progress?.totalLessons || 0}{' '}
                    <span className="hidden lg:inline">
                      <BilingualText vi="bài" en="lessons" />
                    </span>
                  </span>
                  <div className="w-12 h-1.5 bg-stone-200 rounded-full overflow-hidden hidden sm:block ml-0.5">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress?.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>

                {/* Nút mở modal lưu từ vựng */}
                <button
                  type="button"
                  onClick={() => setSavingWord(true)}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-[#E8E5DF] transition-colors cursor-pointer"
                >
                  <Bookmark size={14} className="text-amber-600" />
                  <span className="hidden sm:inline">
                    <BilingualText vi="Lưu từ vựng" en="Save word" />
                  </span>
                </button>

                {/* Nút ẩn/hiện thanh bên danh sách bài */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen((v) => !v)}
                  className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    sidebarOpen
                      ? 'bg-[#24382B] text-white border-[#24382B]'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-[#E8E5DF]'
                  }`}
                  title={sidebarOpen ? bilingualLabel('Ẩn danh sách bài', 'Hide lesson list') : bilingualLabel('Hiện danh sách bài', 'Show lesson list')}
                >
                  {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
                  <span className="hidden sm:inline">
                    {sidebarOpen ? <BilingualText vi="Thu gọn" en="Collapse" /> : <BilingualText vi="Bài học" en="Lessons" />}
                  </span>
                </button>
              </div>
            </header>

            {/* Thông báo thành công khi lưu từ */}
            {message && (
              <div
                role="status"
                className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce-subtle"
              >
                <Check size={16} className="text-emerald-600 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* Thông báo lỗi nếu có */}
            {error && (
              <p role="alert" className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold">
                <BilingualText>{error}</BilingualText>
              </p>
            )}

            {/* ===================== MAIN LAYOUT ===================== */}
            <div className="relative">
              <div className="flex gap-4 items-start">
                {/* 1. Sidebar máy tính để bàn (Desktop) */}
                {sidebarOpen && (
                  <aside className="w-80 shrink-0 hidden lg:block sticky top-20 self-start">
                    <LessonSidebar
                      lessons={lessons}
                      courseId={courseId}
                      currentId={lesson.id}
                      courseTitle={course?.titleVi || course?.title}
                    />
                  </aside>
                )}

                {/* 2. Nội dung bài học chính */}
                <main className="flex-1 min-w-0 space-y-4">
                  {/* Hoạt động bài học (Activities) */}
                  <LessonActivities
                    onLoadedLesson={setContentLesson}
                    onActivityChange={(result) => {
                      if (result.completed) resource.reload();
                    }}
                    lessonId={lesson.id}
                    courseId={courseId}
                    nextLessonId={lesson.nextLessonId}
                    onNextLesson={() => {
                      if (lesson.nextLessonId) {
                        navigate(`/courses/${courseId}/lesson/${lesson.nextLessonId}`);
                      }
                    }}
                    fallback={
                      <div className="card">
                        <LessonContent lesson={lesson} />
                      </div>
                    }
                  />

                  {/* Bài có hoạt động được tự hoàn thành từ tiến độ hoạt động và quiz. */}
                  <LessonNavigation
                    lesson={lesson}
                    pending={pending}
                    onComplete={complete}
                    courseId={courseId}
                    showComplete={String(contentLesson?.id) === String(lesson.id) && !contentLesson.activities?.length}
                  />
                </main>
              </div>

              {/* 3. Mobile / Tablet Drawer cho Sidebar */}
              {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                  />

                  {/* Drawer Content */}
                  <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col">
                    <LessonSidebar
                      lessons={lessons}
                      courseId={courseId}
                      currentId={lesson.id}
                      onClose={() => setSidebarOpen(false)}
                      courseTitle={course?.titleVi || course?.title}
                      isDrawer
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal lưu từ vựng */}
            {savingWord && (
              <VocabularyForm
                lessonId={lesson.id}
                onClose={() => setSavingWord(false)}
                onSaved={() => {
                  setSavingWord(false);
                  setMessage(bilingualLabel('Đã lưu thành công vào sổ tay từ vựng.', 'Saved successfully to your vocabulary notebook.'));
                  setTimeout(() => setMessage(''), 4000);
                }}
              />
            )}
          </div>
          </>
        );
      }}
    </ResourceState>
  );
}
export default LessonLearningPage;

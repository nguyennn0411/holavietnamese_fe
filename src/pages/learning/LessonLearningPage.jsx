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
import { ArrowLeft, CheckCircle2, Bookmark, PanelLeftClose, PanelLeft, Check, Bot } from 'lucide-react';

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

  // Trạng thái mở/đóng thanh bên (Sidebar)
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
        const completedCount = progress?.completedLessons ?? 0;
        const totalCount = progress?.totalLessons ?? lessons.length;
        const progressPercentage = progress?.progressPercentage ?? 0;
        const isSwitchingLesson = resource.isValidating || String(lesson.id) !== String(lessonId);

        return (
          <div className="lesson-learning-screen w-full max-w-[1560px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
            {/* ===================== TOP HEADER BAR ===================== */}
            <header className="relative sticky top-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E5DF] p-3.5 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
              {/* Subtle top indicator during lesson transitions */}
              {isSwitchingLesson && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7A00] via-[#FFCD00] to-[#FF7A00] animate-pulse z-50" />
              )}
              {/* Bên trái: Nút quay lại & Tiêu đề bài học */}
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  to={`/courses/${courseId}`}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#FFF7E8] hover:bg-[#FFF2D6] text-[#FF7A00] text-xs font-bold border border-[#E8E5DF]/60 transition-colors shrink-0 no-underline"
                  title={bilingualLabel("Quay lại khóa học", "Back to course")}
                >
                  <ArrowLeft size={14} />
                  <span className="hidden sm:inline"><BilingualText vi="Khóa học" en="Course" /></span>
                </Link>

                <div className="h-5 w-[1px] bg-stone-200 hidden sm:block" />

                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF2D6] text-[#EA580C] font-bold text-[10px] uppercase shrink-0">
                      <BilingualText vi={`Bài ${lesson.lessonOrder || 1}`} en={`Lesson ${lesson.lessonOrder || 1}`} />
                    </span>
                    <h1 className="text-sm sm:text-base font-black text-[#253044] truncate m-0">
                      <BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} />
                    </h1>
                  </div>
                </div>
              </div>

              {/* Ở giữa / Phải: Tiến độ & Nút chức năng */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                {/* Thanh tiến độ tóm tắt */}
                <div className="flex items-center gap-2 bg-[#FFF7E8] py-1.5 px-3 rounded-xl border border-[#E8E5DF]/60 text-xs font-bold text-[#64748B]">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span><BilingualText vi={`${completedCount}/${totalCount} bài`} en={`${completedCount}/${totalCount} lessons`} /></span>
                  <div className="w-16 h-2 rounded-full bg-stone-200 overflow-hidden ml-1">
                    <div
                      className="h-full bg-[#FF7A00] rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Nút lưu nhanh từ vựng */}
                <button
                  type="button"
                  onClick={() => setSavingWord(true)}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white hover:bg-amber-50 text-[#253044] border border-[#E8E5DF] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  title={bilingualLabel("Thêm từ vựng mới vào sổ tay", "Add new word to notebook")}
                >
                  <Bookmark size={13} className="text-[#FF7A00]" />
                  <span className="hidden sm:inline"><BilingualText vi="Lưu từ vựng" en="Save word" /></span>
                </button>

                {/* Nút bật/tắt Sidebar */}
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

                <Link
                  to={`/ai-tutor?lessonId=${encodeURIComponent(lesson.id)}&lessonTitle=${encodeURIComponent(lesson.titleVi || lesson.title || '')}&courseTitle=${encodeURIComponent(course?.titleVi || course?.title || '')}`}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#24382B] hover:bg-[#1a291f] text-white text-xs font-bold border border-[#24382B] shadow-2xs transition-colors no-underline"
                  title="Hỏi AI Tutor về bài học này"
                >
                  <Bot size={14} />
                  <span className="hidden sm:inline">Hỏi AI</span>
                </Link>
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
              {/* Bố cục có Sidebar hoặc Full-width */}
              <div
                className={`transition-all ${
                  sidebarOpen
                    ? 'grid grid-cols-1 lg:grid-cols-[330px_1fr] xl:grid-cols-[360px_1fr] gap-8 items-start'
                    : 'max-w-4xl mx-auto space-y-6'
                }`}
              >
                {/* 1. Sidebar trên Desktop */}
                {sidebarOpen && (
                  <aside className="hidden lg:block sticky top-24 self-start w-full">
                    <LessonSidebar
                      lessons={lessons}
                      courseId={courseId}
                      currentId={lesson.id}
                      courseTitle={course?.titleVi || course?.title}
                    />
                  </aside>
                )}

                {/* 2. Main Lesson Content Panel */}
                <main className={`lesson-panel space-y-6 min-w-0 transition-opacity duration-300 ${isSwitchingLesson ? 'opacity-85' : 'opacity-100'}`}>
                  <LessonActivities
                    onLessonLoaded={setContentLesson}
                    onProgress={(result) => {
                      if (result.completed) resource.reload();
                    }}
                    lessonId={lesson.id}
                    courseId={courseId}
                    nextLessonId={lesson.nextLessonId}
                    onNextLesson={() => {
                      if (lesson.nextLessonId) {
                        navigate(`/learn/${courseId}/lesson/${lesson.nextLessonId}`);
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
        );
      }}
    </ResourceState>
  );
}
export default LessonLearningPage;

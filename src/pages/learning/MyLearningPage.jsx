import { BilingualText } from '@/components/common/BilingualText';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  BookOpen,
  Languages,
  MapPin,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
  Compass,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { learnerService } from '@/services/learnerService';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { ResourceState } from '@/components/common/ResourceState';
import { EmptyState, Artwork, SpeakButton } from '@/components/common/Ui';
import { ProgressBar } from '@/components/common/ProgressBar';
import { ContentImage } from '@/components/common/ContentImage';

export function MyLearningPage() {
  const [tab, setTab] = useState('courses');
  const resource = useAsyncResource(useCallback(() => learnerService.getMyLearningOverview(), []));

  const tabItems = [
    { id: 'courses', label: 'Khóa học của tôi', icon: BookOpen },
    { id: 'vocabulary', label: 'Từ vựng đã lưu', icon: Languages },
    { id: 'journey', label: 'Hành trình văn hóa', icon: MapPin },
    { id: 'quiz', label: 'Lịch sử quiz', icon: Award },
  ];

  return (
    <div className="mylearning-page w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9EE] via-[#F7F0E3] to-[#EEE3D1] border border-[#DECBB4] p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#A62A24] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles size={14} className="text-[#A62A24]" />
            <BilingualText>{"Hành trình của riêng bạn • Personal Learning Space"}</BilingualText>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#431914] tracking-tight">
            <BilingualText>{"Góc học tập của tôi"}</BilingualText>
          </h1>

          <p className="text-sm sm:text-base text-[#78685B] leading-relaxed max-w-2xl">
            <BilingualText>
              {"Từng bài học, từng từ mới. Một chút tiến bộ mỗi ngày tích lũy thành phản xạ tiếng Việt tự nhiên."}
            </BilingualText>
          </p>

          <div className="pt-2">
            <Link
              to="/edtech/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-[#431914] border border-[#DECBB4] font-semibold text-xs shadow-xs transition-all hover:border-[#A62A24]"
            >
              <Compass size={15} className="text-[#A62A24]" />
              <BilingualText>{"Đến Lộ trình học tương tác (EdTech) →"}</BilingualText>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#DECBB4] scrollbar-none" role="tablist" aria-label="Góc học tập">
        {tabItems.map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all duration-200 ${
                isActive
                  ? 'border-[#A62A24] text-[#A62A24] bg-[#FFF9EE]'
                  : 'border-transparent text-[#78685B] hover:text-[#431914] hover:bg-[#FFF9EE]/50'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#A62A24]' : 'text-[#78685B]'} />
              <BilingualText>{item.label}</BilingualText>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <ResourceState resource={resource}>
        {(data) => (
          <div className="space-y-6">
            {/* TAB 1: Enrolled Courses */}
            {tab === 'courses' && (
              <div className="course-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.enrolledCourses?.map((course) => {
                  const isCompleted = course.progress >= 100;
                  return (
                    <motion.article
                      whileHover={{ y: -4 }}
                      key={course.id}
                      className="card learning-course group relative flex flex-col bg-[#FFF9EE] border border-[#DECBB4] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative overflow-hidden aspect-[16/10] bg-[#EEE3D1]">
                        <ContentImage
                          className="learning-course-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={course.image}
                          alt={course.title}
                          fallback={
                            <Artwork
                              kind={course.id % 2 ? 'food' : 'village'}
                              alt={`Minh họa khóa học: ${course.title}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          }
                        />
                        <div className="absolute top-3 right-3 z-10">
                          <span
                            className={`badge px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 ${
                              isCompleted
                                ? 'bg-emerald-800 text-emerald-100 border border-emerald-700'
                                : 'bg-[#A62A24] text-white border border-[#89221E]'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={12} /> : null}
                            <BilingualText>{isCompleted ? 'Đã hoàn thành' : 'Đang học'}</BilingualText>
                          </span>
                        </div>
                      </div>

                      <div className="learning-course-body p-5 flex flex-col flex-1 justify-between gap-4">
                        <div className="space-y-2">
                          <h2 className="text-lg font-bold text-[#431914] group-hover:text-[#A62A24] transition-colors leading-snug line-clamp-2">
                            <BilingualText vi={course.titleVi || course.title} en={course.title} />
                          </h2>

                          <div className="pt-1">
                            <ProgressBar value={course.progress} label="Tiến độ khóa học" />
                          </div>

                          {course.nextLesson && (
                            <p className="text-xs text-[#78685B] pt-1">
                              <span className="font-semibold text-[#431914]">
                                <BilingualText>{"Bài tiếp theo: "}</BilingualText>
                              </span>
                              {course.nextLesson}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-[#DECBB4]/40">
                          <Link
                            className="button w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#A62A24] hover:bg-[#89221E] text-white font-bold text-xs shadow-sm transition-all"
                            to={`/courses/${course.id}`}
                          >
                            <BilingualText>{isCompleted ? 'Xem lại khóa học' : 'Tiếp tục học →'}</BilingualText>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}

                {/* Add New Course Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="card learning-course-add group flex flex-col items-center justify-center text-center p-8 bg-[#FFF9EE]/70 border-2 border-dashed border-[#DECBB4] hover:border-[#A62A24] rounded-2xl transition-all"
                >
                  <span className="w-12 h-12 rounded-2xl bg-[#F5E1D8] text-[#A62A24] flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                  </span>
                  <h2 className="text-lg font-bold text-[#431914] mb-1">
                    <BilingualText>{"Một câu chuyện mới?"}</BilingualText>
                  </h2>
                  <p className="text-xs text-[#78685B] max-w-xs mb-4">
                    <BilingualText>{"Khám phá thêm tiếng Việt qua những điều bạn yêu thích."}</BilingualText>
                  </p>
                  <Link
                    className="button secondary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#DECBB4] text-[#431914] font-bold text-xs hover:border-[#A62A24] transition-all"
                    to="/courses"
                  >
                    <BilingualText>{"Khám phá khóa học"}</BilingualText>
                    <ArrowRight size={13} />
                  </Link>
                </motion.div>
              </div>
            )}

            {/* TAB 2: Saved Vocabulary */}
            {tab === 'vocabulary' && (
              <section className="card bg-[#FFF9EE] border border-[#DECBB4] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="builder-heading flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DECBB4]/60 pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#431914]">
                      <BilingualText>{"Từ vựng đã lưu ("}</BilingualText>
                      {data.savedVocabCount ?? 0})
                    </h2>
                    <p className="text-xs text-[#78685B] mt-1">
                      <BilingualText>{"Những từ quen thuộc trên hành trình học của bạn."}</BilingualText>
                    </p>
                  </div>
                  <div className="actions flex items-center gap-3">
                    <Link
                      className="button secondary px-4 py-2 rounded-xl bg-white border border-[#DECBB4] text-[#431914] font-bold text-xs hover:border-[#A62A24] transition-all"
                      to={ROUTES.VOCABULARY_NOTEBOOK}
                    >
                      <BilingualText>{"Mở sổ tay"}</BilingualText>
                    </Link>
                    <Link
                      className="button px-5 py-2 rounded-xl bg-[#A62A24] hover:bg-[#89221E] text-white font-bold text-xs shadow-sm transition-all"
                      to={ROUTES.VOCABULARY_REVIEW}
                    >
                      <BilingualText>{"Ôn tập →"}</BilingualText>
                    </Link>
                  </div>
                </div>

                {data.recentVocab?.length ? (
                  <div className="mylearning-vocab-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.recentVocab.map((word, index) => (
                      <div
                        className="mylearning-word-chip bg-white/90 border border-[#DECBB4] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-2"
                        key={index}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`badge px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              word.mastered
                                ? 'bg-[#EDF0E5] text-[#24382B]'
                                : 'bg-[#F8E6B7] text-[#431914]'
                            }`}
                          >
                            <BilingualText>{word.mastered ? 'Đã thuộc' : 'Đang ôn tập'}</BilingualText>
                          </span>
                          <SpeakButton text={word.vi} />
                        </div>
                        <h3 className="text-base font-bold text-[#431914]">{word.vi}</h3>
                        <p className="text-xs text-[#78685B]">{word.en}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Sổ tay đang chờ những từ đầu tiên"
                    description="Lưu từ mới trong bài học hoặc thêm vào sổ tay để ôn tập ngắt quãng."
                  />
                )}
              </section>
            )}

            {/* TAB 3: Cultural Journey */}
            {tab === 'journey' && (
              <div className="journey-learning card bg-[#FFF9EE] border border-[#DECBB4] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 shrink-0 rounded-2xl overflow-hidden border border-[#DECBB4] shadow-sm bg-white p-2">
                  <Artwork kind="lanterns" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <span className="eyebrow text-xs font-bold uppercase tracking-wider text-[#A62A24]">
                      <BilingualText>{"Hành trình văn hóa"}</BilingualText>
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#431914] mt-1">
                      <BilingualText>{data.journeyCity || 'Khám phá Việt Nam'}</BilingualText>
                    </h2>
                  </div>

                  {data.journeyProgress != null ? (
                    <div className="max-w-md">
                      <ProgressBar value={data.journeyProgress} label="Tiến độ hành trình" />
                    </div>
                  ) : (
                    <p className="text-xs text-[#78685B]">
                      <BilingualText>{"Chưa có dữ liệu tiến độ hành trình."}</BilingualText>
                    </p>
                  )}

                  <div className="actions flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      className="button inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A62A24] hover:bg-[#89221E] text-white font-bold text-xs shadow-sm transition-all"
                      to="/explore"
                    >
                      <BilingualText>{"Xem các điểm đến →"}</BilingualText>
                    </Link>
                    <Link
                      className="button secondary px-5 py-2.5 rounded-xl bg-white border border-[#DECBB4] text-[#431914] font-bold text-xs hover:border-[#A62A24] transition-all"
                      to="/achievements"
                    >
                      <BilingualText>{"Hộ chiếu & thành tích"}</BilingualText>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Quiz History */}
            {tab === 'quiz' && (
              <section className="card bg-[#FFF9EE] border border-[#DECBB4] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                <div className="border-b border-[#DECBB4]/60 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-[#431914]">
                    <BilingualText>{"Nhìn lại những điều đã học"}</BilingualText>
                  </h2>
                  <p className="text-xs text-[#78685B] mt-0.5">
                    <BilingualText>{"Lịch sử làm bài kiểm tra và đánh giá năng lực tiếng Việt của bạn."}</BilingualText>
                  </p>
                </div>

                {data.quizHistory?.length ? (
                  <div className="space-y-3">
                    {data.quizHistory.map((quiz) => (
                      <div
                        className="list-row flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/80 border border-[#DECBB4] gap-3"
                        key={quiz.id}
                      >
                        <div className="space-y-1">
                          <strong className="block text-sm font-bold text-[#431914]">{quiz.quizName || quiz.quiz_name}</strong>
                          <p className="text-[11px] text-[#78685B] flex items-center gap-1">
                            <Calendar size={12} />
                            {quiz.date}
                          </p>
                        </div>
                        <div className="actions flex items-center gap-3 self-end sm:self-auto">
                          <span
                            className={`badge px-2.5 py-1 rounded-lg text-xs font-bold ${
                              quiz.passed ? 'bg-[#EDF0E5] text-[#24382B]' : 'bg-[#F5E1D8] text-[#A62A24]'
                            }`}
                          >
                            {quiz.score}/100 · <BilingualText>{quiz.passed ? 'Đạt' : 'Cần ôn tập'}</BilingualText>
                          </span>
                          <Link
                            className="text-link text-xs font-bold text-[#A62A24] hover:underline"
                            to={`/quiz-attempts/${quiz.id}/result`}
                          >
                            <BilingualText>{"Xem kết quả →"}</BilingualText>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Chưa có bài kiểm tra đã hoàn thành"
                    description="Các kết quả quiz sau mỗi chương học sẽ xuất hiện tại đây."
                  />
                )}
              </section>
            )}
          </div>
        )}
      </ResourceState>
    </div>
  );
}

import { BilingualText } from '@/components/common/BilingualText';
import { Link, useParams } from 'react-router-dom';
import { useCourse } from '@/hooks/useCourses';
import { CourseInfo, CourseThumbnail } from '@/components/course/CourseInfo';
import { EnrollButton } from '@/components/course/EnrollButton';
import { ResourceState } from '@/components/common/ResourceState';
import { CourseCurriculum } from '@/components/course/CourseCurriculum';
import { CourseProgress } from '@/components/course/CourseProgress';
import { Artwork } from '@/components/common/Ui';
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Clock,
  Sparkles,
  ChevronDown,
  Play,
  Lock,
  Award,
  Compass
} from 'lucide-react';

export function CourseDetailPage() {
  const { courseId } = useParams();
  const resource = useCourse(courseId);

  return (
    <section className="course-detail-page w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#78685B]">
        <Link
          className="inline-flex items-center gap-1.5 text-[#DA251D] hover:underline transition-colors"
          to="/courses"
        >
          <ArrowLeft size={13} />
          <BilingualText>{"Tất cả khóa học"}</BilingualText>
        </Link>
        <span>/</span>
        <span className="text-[#431914] truncate max-w-xs sm:max-w-md">
          {resource.data?.course?.titleVi || resource.data?.course?.title || 'Chi tiết khóa học'}
        </span>
      </nav>

      <ResourceState resource={resource}>
        {({ course, enrollment }) => {
          const outcomes = String(course.learningOutcomes || '')
            .split(/\n|;/)
            .map((item) => item.trim())
            .filter(Boolean);

          return (
            <div className="space-y-8">
              {/* Hero Course Showcase */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9EE] via-[#F7F0E3] to-[#EEE3D1] border border-[#DECBB4] p-6 sm:p-10 shadow-sm">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none overflow-hidden hidden md:block">
                  <Artwork kind="dong-son" className="w-full h-full object-contain object-right" />
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Course Intro */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="badge px-3 py-1 rounded-full bg-[#DA251D] text-white font-bold text-xs uppercase tracking-wider shadow-xs">
                        {course.level}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF2D6] text-[#A62A24] border border-[#FFCD00]/50 font-bold text-xs">
                        <Sparkles size={13} />
                        <BilingualText>{course.isFree ? 'Miễn phí' : 'Khóa học chính thức'}</BilingualText>
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#431914] tracking-tight leading-tight">
                      <BilingualText vi={course.titleVi || course.title} en={course.title} />
                    </h1>

                    <p className="text-sm sm:text-base text-[#78685B] leading-relaxed preserve-lines max-w-2xl">
                      <BilingualText vi={course.descriptionVi || course.description} en={course.description} />
                    </p>

                    {/* Metadata Strip */}
                    <div className="pt-2">
                      <CourseInfo course={course} />
                    </div>

                    {/* Primary Enrollment Call To Action */}
                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <EnrollButton
                        courseId={courseId}
                        enrollment={enrollment}
                        onEnrolled={resource.reload}
                      />

                      {enrollment?.isEnrolled && (
                        <Link
                          to={`/learn/${courseId}`}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#DA251D] hover:bg-[#B71C1C] text-white font-black text-sm shadow-md hover:shadow-lg transition-all"
                        >
                          <Play size={16} fill="white" />
                          <BilingualText>{"Tiếp tục học ngay →"}</BilingualText>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Thumbnail Showcase */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="w-full max-w-md aspect-video sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                      <CourseThumbnail course={course} />
                    </div>
                  </div>
                </div>
              </div>

              {/* What You Will Learn (Learning Outcomes) */}
              {outcomes.length > 0 && (
                <section className="bg-white rounded-3xl border border-[#DECBB4] p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex items-center gap-2">
                    <Award size={20} className="text-[#DA251D]" />
                    <h2 className="text-lg sm:text-xl font-black text-[#431914] tracking-tight">
                      <BilingualText>{"Bạn sẽ học được gì từ khóa học này"}</BilingualText>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {outcomes.map((text, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF9EE] border border-[#DECBB4]/60 hover:border-[#FFCD00] transition-colors"
                      >
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[#431914] leading-snug">
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Curriculum Breakdown For Enrolled Students */}
              {enrollment?.isEnrolled && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8">
                    <CourseCurriculum courseId={courseId} />
                  </div>
                  <aside className="lg:col-span-4 bg-white rounded-3xl border border-[#DECBB4] p-6 shadow-xs space-y-5 sticky top-6">
                    <div className="flex items-center gap-2">
                      <Compass size={18} className="text-[#DA251D]" />
                      <h2 className="text-base font-black text-[#431914]">
                        <BilingualText>{"Tiến độ của bạn"}</BilingualText>
                      </h2>
                    </div>
                    <CourseProgress courseId={courseId} />
                    <Link
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#DA251D] hover:bg-[#B71C1C] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                      to={`/learn/${courseId}`}
                    >
                      <BilingualText>{"Tiếp tục học →"}</BilingualText>
                    </Link>
                  </aside>
                </div>
              )}

              {/* Curriculum Breakdown For Visitors / Not Enrolled */}
              {!enrollment?.isEnrolled && course.modules?.length > 0 && (
                <section className="bg-white rounded-3xl border border-[#DECBB4] p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen size={20} className="text-[#DA251D]" />
                      <h2 className="text-lg sm:text-xl font-black text-[#431914] tracking-tight">
                        <BilingualText>{"Nội dung chi tiết khóa học"}</BilingualText>
                      </h2>
                    </div>
                    <p className="text-xs text-[#78685B]">
                      <BilingualText>
                        {"Bao gồm các bài học thực tế, bài tập phát âm, và trắc nghiệm củng cố kiến thức."}
                      </BilingualText>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {course.modules.map((module, mIdx) => (
                      <details
                        key={module.id}
                        className="group rounded-2xl border border-[#DECBB4] overflow-hidden bg-[#FFFDF9] open:bg-white transition-all shadow-xs"
                        open={mIdx === 0}
                      >
                        <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer font-bold text-[#431914] hover:text-[#DA251D] transition-colors select-none">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-xl bg-[#FFF2D6] text-[#A62A24] font-black text-xs flex items-center justify-center shrink-0">
                              {mIdx + 1}
                            </span>
                            <span className="text-sm sm:text-base font-bold">
                              <BilingualText vi={module.titleVi || module.title} en={module.title} />
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#78685B]">
                            <span>{module.lessons?.length || 0} bài học</span>
                            <ChevronDown size={16} className="group-open:rotate-180 transition-transform" />
                          </div>
                        </summary>

                        <div className="p-4 sm:p-5 pt-0 space-y-2 border-t border-[#DECBB4]/40 bg-white">
                          {module.lessons?.map((lesson, lIdx) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9EE]/70 hover:bg-[#FFF9EE] border border-[#DECBB4]/40 text-xs sm:text-sm transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-white border border-[#DECBB4] text-[10px] font-bold text-[#78685B] flex items-center justify-center shrink-0">
                                  {lIdx + 1}
                                </span>
                                <span className="font-semibold text-[#431914]">
                                  <BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} />
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-[#78685B] shrink-0">
                                <span className="inline-flex items-center gap-1">
                                  <Clock size={11} className="text-[#A62A24]" />
                                  {lesson.estimatedMinutes} phút
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-[#F5E1D8] text-[#A62A24] font-bold text-[10px]">
                                  <Lock size={10} className="inline mr-0.5" />
                                  Đăng ký
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>
          );
        }}
      </ResourceState>
    </section>
  );
}

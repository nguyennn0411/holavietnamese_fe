import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Circle,
  Compass,
  Lock,
  RefreshCw,
  Settings2,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { useConfirmDialog } from '@/shared/components/common/ConfirmDialog';
import { BuffaloMascot } from '@/shared/components/mascot/BuffaloMascot';
import { useLearningPath } from '@/features/learning/hooks/useLearningPath';
import '@/styles/learning-path-simple.css';

const LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];

const GOAL_OPTIONS = [
  { id: 'connection', labelVi: 'Giao tiếp gia đình & bạn bè', labelEn: 'Family & Friends', icon: '💬' },
  { id: 'travel', labelVi: 'Du lịch & đời sống', labelEn: 'Travel & Daily Life', icon: '✈️' },
  { id: 'work', labelVi: 'Công việc & học tập', labelEn: 'Work & Study', icon: '💼' },
  { id: 'culture', labelVi: 'Văn hóa Việt Nam', labelEn: 'Vietnamese Culture', icon: '🏛️' },
  { id: 'challenge', labelVi: 'Kỹ năng toàn diện & luyện thi', labelEn: 'Comprehensive Mastery', icon: '🎯' },
  { id: 'other', labelVi: 'Khám phá tự do', labelEn: 'General Exploration', icon: '🧭' },
];

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
  return (
    <main className="learning-path-simple-page" aria-busy="true">
      <section className="learning-path-simple-card learning-path-skeleton">
        <div />
        <div />
        <div />
        <div />
      </section>
    </main>
  );
}

function LevelRequired({ saving, onSave }) {
  const [level, setLevel] = useState('');
  return (
    <main className="learning-path-simple-page">
      <section className="learning-path-simple-card learning-path-state">
        <div className="learning-path-state-mascot">
          <BuffaloMascot variant="thinking" size="medium" />
        </div>
        <BookOpen size={28} />
        <h1><BilingualText vi="Hãy xác định trình độ hiện tại" en="Choose your current level" /></h1>
        <p>
          <BilingualText
            vi="Chúng tôi chưa có đủ dữ liệu để kết luận trình độ của bạn. Chọn một mức hoặc làm bài kiểm tra đầu vào."
            en="We do not have enough information to determine your level. Choose one or take the placement test."
          />
        </p>
        <div className="learning-path-level-tabs">
          {LEVELS.map(item => (
            <button
              type="button"
              key={item}
              className={level === item ? 'is-active' : ''}
              onClick={() => setLevel(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="learning-path-state-actions">
          <button disabled={!level || saving} onClick={() => onSave(level)}>
            <BilingualText vi="Xác nhận trình độ" en="Confirm level" />
          </button>
          <Link to="/onboarding/placement-test">
            <BilingualText vi="Làm bài kiểm tra đầu vào" en="Take placement test" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Roadmap({ stages, courseId }) {
  if (!stages?.length) {
    return (
      <div className="learning-path-empty">
        <BilingualText
          vi="Khóa học này chưa có module và bài học được xuất bản."
          en="This course has no published modules or lessons yet."
        />
      </div>
    );
  }

  return (
    <ol>
      {stages.flatMap(module => [
        ...(module.lessons || []).map(lesson => ({ ...lesson, moduleTitle: titleOf(module) })),
        {
          id: `milestone-${module.id}`,
          milestone: true,
          moduleTitle: titleOf(module),
          state: module.milestone?.state || 'LOCKED',
          assessment: module.assessment,
        },
      ]).map(item => {
        const state = item.state || 'LOCKED';
        let icon;
        if (item.milestone) {
          icon = state === 'COMPLETED' ? <Award size={18} /> : <Trophy size={16} />;
        } else {
          icon = state === 'COMPLETED'
            ? <Check size={16} />
            : state === 'LOCKED'
              ? <Lock size={14} />
              : state === 'IN_PROGRESS'
                ? <Circle size={15} fill="currentColor" />
                : <BookOpen size={15} />;
        }

        if (item.milestone) {
          const milestone = (
            <div className="learning-path-milestone-box">
              <div className="learning-path-milestone-top">
                <span className="learning-path-milestone-badge">
                  <Trophy size={13} />
                  <BilingualText vi="Cột mốc" en="Milestone" />
                </span>
                {state === 'COMPLETED' && (
                  <span className="learning-path-milestone-done">
                    <Check size={13} />
                    <BilingualText vi="Đã đạt" en="Passed" />
                  </span>
                )}
              </div>
              <strong>{item.assessment?.titleVi || item.assessment?.title || `${item.moduleTitle} · Checkpoint`}</strong>
              <p>
                <BilingualText
                  vi="Hoàn thành các bài học trong giai đoạn để mở khóa đánh giá."
                  en="Complete this stage's lessons to unlock its assessment."
                />
              </p>
              {item.assessment && state === 'AVAILABLE' && (
                <span className="learning-path-milestone-cta">
                  <BilingualText vi="Làm bài đánh giá ngay" en="Take assessment now" />
                  <ChevronRight size={14} />
                </span>
              )}
            </div>
          );

          return (
            <li key={item.id} className={`is-${state.toLowerCase().replace('_', '-')} is-milestone`}>
              <span>{icon}</span>
              <div>
                {item.assessment && state === 'AVAILABLE' ? (
                  <Link to={`/quizzes/${item.assessment.id}`}>{milestone}</Link>
                ) : (
                  milestone
                )}
              </div>
            </li>
          );
        }

        const content = (
          <div className="learning-path-lesson-box">
            <small>{item.moduleTitle}</small>
            <strong>{titleOf(item)}</strong>
            <p>{descriptionOf(item)}</p>
          </div>
        );

        return (
          <li key={item.id} className={`is-${state.toLowerCase().replace('_', '-')}`}>
            <span>{icon}</span>
            <div>
              {state === 'LOCKED' ? content : <Link to={`/learn/${courseId}/lesson/${item.id}`}>{content}</Link>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function LearningPathPage() {
  const path = useLearningPath();
  const { confirm, confirmationDialog } = useConfirmDialog();
  const [editing, setEditing] = useState(false);
  const [level, setLevel] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [minutes, setMinutes] = useState(15);

  useEffect(() => {
    const pref = path.data?.preferences;
    if (!pref) return;
    setLevel(pref.level || '');
    setSelectedGoals(pref.learningGoals || []);
    setMinutes(pref.dailyStudyMinutes || 15);
  }, [path.data]);

  const preferences = path.data?.preferences || {};
  const recommendation = path.data?.recommendation || {};
  const recommendedPath = recommendation.recommendedPath || [];
  const exactCourses = recommendation.courses || [];
  const nearestCourses = recommendation.nearestCourses || [];
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

  if (path.error && !path.data) {
    return (
      <main className="learning-path-simple-page">
        <section className="learning-path-simple-card learning-path-state" role="alert">
          <h1><BilingualText vi="Không thể tải Learning Path" en="Unable to load Learning Path" /></h1>
          <p>{path.error}</p>
          <button onClick={path.reload}>
            <RefreshCw size={15} />
            <BilingualText vi="Thử lại" en="Retry" />
          </button>
        </section>
      </main>
    );
  }

  if (path.loading) return <LearningPathSkeleton />;
  if (!path.data) return <LearningPathSkeleton/>;
  if (path.data?.requiresLevel) {
    return (
      <LevelRequired
        saving={path.saving}
        onSave={selected => path.updatePreferences({ level: selected, levelSource: 'USER_CONFIRMED' })}
      />
    );
  }

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(g => g !== goalId);
      }
      return [...prev, goalId];
    });
  };

  const applyCourse = async course => {
    if (!await confirm({
      title: bilingualLabel('Áp dụng khóa học này?', 'Use this course?'),
      description: bilingualLabel(
        `“${titleOf(course)}” sẽ trở thành lộ trình hiện tại. Tiến độ các khóa học trước vẫn được giữ nguyên.`,
        `“${titleOf(course)}” will become your active path. Progress in previous courses will be preserved.`
      ),
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
      description: bilingualLabel(
        'Các khóa học sẽ được thêm theo đúng thứ tự đề xuất. Tiến độ hiện tại của bạn vẫn được giữ nguyên.',
        'Courses will be added in the recommended order. Your existing progress will be preserved.'
      ),
      details: (
        <ol className="learning-path-confirm-list">
          {recommendedPath.map((course, index) => (
            <li key={courseIdOf(course)}>
              <span>{index + 1}</span>
              <div>
                <small>{course.levelMin === course.levelMax ? course.level : `${course.levelMin}–${course.levelMax}`}</small>
                <strong>{titleOf(course)}</strong>
              </div>
            </li>
          ))}
        </ol>
      ),
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
      description: bilingualLabel(
        'Hệ thống sẽ cập nhật trình độ, mục tiêu và đề xuất lộ trình phù hợp với lựa chọn mới.',
        'Your level, goals, and recommendations will be updated using these preferences.'
      ),
      confirmLabel: bilingualLabel('Lưu thay đổi', 'Save changes'),
      cancelLabel: bilingualLabel('Hủy', 'Cancel'),
      tone: 'warning',
    })) return;

    await path.updatePreferences({
      level,
      levelSource: 'USER_CONFIRMED',
      learningGoals: selectedGoals,
      dailyStudyMinutes: Number(minutes),
    });
    setEditing(false);
  };

  return (
    <>
      <main className="learning-path-simple-page">
        <section className="learning-path-simple-card">
          {/* Header */}
          <header className="learning-path-simple-header">
            <div>
              <strong>
                <BookOpen size={18} className="learning-path-header-icon" />
                Hola Vietnamese
              </strong>
              <span><BilingualText vi="Học tập cá nhân hóa" en="Personalized Learning" /></span>
            </div>
            <button
              className="learning-path-preference-trigger"
              onClick={() => setEditing(value => !value)}
              aria-expanded={editing}
            >
              <Settings2 size={15} />
              <BilingualText vi="Tùy chỉnh" en="Preferences" />
            </button>
          </header>

          {path.error && <div className="learning-path-inline-error" role="alert">{path.error}</div>}

          {/* Intro */}
          <div className="learning-path-simple-intro">
            <span className="learning-path-simple-kicker">
              <Sparkles size={12} />
              <BilingualText vi="Lộ trình cá nhân hóa" en="Personalized path" />
            </span>
            <h1><BilingualText vi="Hành trình tiếng Việt của bạn" en="Your Vietnamese Journey" /></h1>
            <p>
              <BilingualText
                vi="Lộ trình sử dụng khóa học, module, bài học và đánh giá đã xuất bản."
                en="Your path uses published courses, modules, lessons, and assessments."
              />
            </p>
          </div>

          {/* Hero Section with Nghé Mascot & Level Showcase */}
          <section className="learning-path-personalized-hero">
            <div className="learning-path-hero-main">
              <div className="learning-path-hero-badge-wrap">
                <span className="learning-path-level-pill">
                  <Sparkles size={13} />
                  <strong>{preferences.level || '—'}</strong>
                </span>
                <span className="learning-path-status-badge">
                  <BilingualText
                    vi={path.data?.roadmapPreview ? 'Bản xem trước' : 'Đang áp dụng'}
                    en={path.data?.roadmapPreview ? 'Preview' : 'Active'}
                  />
                </span>
              </div>

              <h2>
                {roadmapCourse
                  ? titleOf(roadmapCourse)
                  : <BilingualText vi="Chưa có khóa học phù hợp" en="No matching course yet" />}
              </h2>

              <p className="learning-path-hero-meta">
                <BilingualText
                  vi={`Mục tiêu: ${(preferences.learningGoals || []).join(', ') || 'Chưa cập nhật'} · ${preferences.dailyStudyMinutes || '—'} phút/ngày`}
                  en={`Goals: ${(preferences.learningGoals || []).join(', ') || 'Not set'} · ${preferences.dailyStudyMinutes || '—'} min/day`}
                />
              </p>

              {recommendedPath.length > 0 && (
                <button
                  className="learning-path-hero-cta"
                  disabled={path.saving}
                  onClick={applyRecommendedPath}
                >
                  <Compass size={16} />
                  <BilingualText
                    vi={`Áp dụng lộ trình ${recommendedPath.length} khóa học`}
                    en={`Apply ${recommendedPath.length}-course path`}
                  />
                  <ArrowRight size={15} />
                </button>
              )}
            </div>

            {/* Companion Mascot */}
            <div className="learning-path-hero-mascot">
              <BuffaloMascot variant="welcome" size="medium" />
            </div>

            {/* Quick Metrics */}
            <dl className="learning-path-hero-dl">
              <div>
                <dt><BilingualText vi="Trình độ" en="Level" /></dt>
                <dd>{preferences.level || '—'}</dd>
              </div>
              <div>
                <dt><BilingualText vi="Nguồn xác định" en="Level source" /></dt>
                <dd><BilingualText vi={source[0]} en={source[1]} /></dd>
              </div>
              <div>
                <dt><BilingualText vi="Trạng thái" en="Status" /></dt>
                <dd>
                  {path.data?.roadmapPreview
                    ? <BilingualText vi="Bản xem trước" en="Preview" />
                    : <BilingualText vi="Đang áp dụng" en="Active" />}
                </dd>
              </div>
            </dl>
          </section>

          {/* Enhanced Preferences Form with Visual Chips */}
          {editing && (
            <form className="learning-path-preferences" onSubmit={savePreferences}>
              <h2><BilingualText vi="Tùy chỉnh lộ trình" en="Learning preferences" /></h2>

              {/* CEFR Level Selection */}
              <div className="learning-path-pref-field">
                <label><BilingualText vi="Trình độ hiện tại" en="Current level" /></label>
                <div className="learning-path-pref-levels">
                  {LEVELS.map(item => (
                    <button
                      type="button"
                      key={item}
                      className={`pref-level-btn ${level === item ? 'is-selected' : ''}`}
                      onClick={() => setLevel(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Selection Chips */}
              <div className="learning-path-pref-field">
                <label>
                  <BilingualText vi="Mục tiêu học tập (chọn các mục phù hợp)" en="Learning goals (select matching items)" />
                </label>
                <div className="learning-path-pref-goals">
                  {GOAL_OPTIONS.map(g => {
                    const isSelected = selectedGoals.includes(g.id);
                    return (
                      <button
                        type="button"
                        key={g.id}
                        className={`pref-goal-chip ${isSelected ? 'is-active' : ''}`}
                        onClick={() => toggleGoal(g.id)}
                      >
                        <span className="goal-chip-icon">{g.icon}</span>
                        <span className="goal-chip-text">
                          <BilingualText vi={g.labelVi} en={g.labelEn} />
                        </span>
                        {isSelected && <Check size={14} className="goal-chip-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Daily Study Minutes */}
              <div className="learning-path-pref-field">
                <label><BilingualText vi="Phút học mỗi ngày" en="Daily study minutes" /></label>
                <div className="learning-path-pref-minutes">
                  {[10, 15, 20, 30, 45, 60].map(m => (
                    <button
                      type="button"
                      key={m}
                      className={`pref-min-btn ${Number(minutes) === m ? 'is-selected' : ''}`}
                      onClick={() => setMinutes(m)}
                    >
                      {m} <BilingualText vi="phút" en="min" />
                    </button>
                  ))}
                  <input
                    type="number"
                    min="5"
                    max="240"
                    value={minutes}
                    onChange={event => setMinutes(event.target.value)}
                    className="pref-min-input"
                    aria-label={bilingualLabel('Số phút tự nhập', 'Custom minutes')}
                  />
                </div>
              </div>

              <div className="learning-path-pref-actions">
                <button type="button" className="secondary" onClick={() => setEditing(false)}>
                  <BilingualText vi="Hủy" en="Cancel" />
                </button>
                <button disabled={path.saving} type="submit" className="primary">
                  <BilingualText vi="Lưu thay đổi" en="Save changes" />
                </button>
              </div>
            </form>
          )}

          {/* Progress Card */}
          <section className="learning-path-progress-card">
            <div className="learning-path-section-heading">
              <div>
                <h2><BilingualText vi="Tiến độ Learning Path" en="Learning Path Progress" /></h2>
                <p>
                  <BilingualText
                    vi={`${progress.completedLessons || 0}/${progress.totalLessons || 0} bài thực tế đã hoàn thành trong active path.`}
                    en={`${progress.completedLessons || 0}/${progress.totalLessons || 0} real lessons completed in the active path.`}
                  />
                </p>
              </div>
              <strong className="learning-path-percent-badge">{progress.percentage || 0}%</strong>
            </div>

            <div className="learning-path-progress">
              <span style={{ width: `${progress.percentage || 0}%` }} />
            </div>

            <dl className="learning-path-simple-stats">
              <div>
                <dt>{progress.completedLessons || 0}</dt>
                <dd><BilingualText vi="Bài hoàn thành" en="Completed" /></dd>
              </div>
              <div>
                <dt>{progress.inProgressLessons || 0}</dt>
                <dd><BilingualText vi="Đang học" en="In progress" /></dd>
              </div>
              <div>
                <dt className="is-text">{nextMilestone ? titleOf(nextMilestone) : '—'}</dt>
                <dd><BilingualText vi="Cột mốc tiếp theo" en="Next milestone" /></dd>
              </div>
            </dl>
          </section>

          {/* Continue Learning */}
          {continueLearning.length > 0 && (
            <section className="learning-path-continue">
              <div className="learning-path-section-heading">
                <h2><BilingualText vi="Tiếp tục học" en="Continue Learning" /></h2>
              </div>
              <div className="learning-path-continue-list">
                {continueLearning.map(item => (
                  <article key={item.id}>
                    <div>
                      <span className="learning-path-status">
                        <BilingualText vi="Đang học" en="In progress" />
                      </span>
                      <strong>{titleOf(item)}</strong>
                      <p>
                        {item.completedLessons}/{item.totalLessons}{' '}
                        <BilingualText vi="bài đã hoàn thành" en="lessons completed" />
                      </p>
                    </div>
                    <div className="learning-path-progress">
                      <span style={{ width: `${item.progressPercentage || 0}%` }} />
                    </div>
                    {item.nextLesson ? (
                      <Link to={`/learn/${item.id}/lesson/${item.nextLesson.id}`}>
                        <BilingualText vi="Tiếp tục" en="Continue" />
                        <ChevronRight size={14} />
                      </Link>
                    ) : (
                      <Link to={`/courses/${item.id}`}>
                        <BilingualText vi="Mở khóa học" en="Open course" />
                      </Link>
                    )}
                  </article>
                ))}
              </div>

              {recommendedPath.length > 0 && (
                <div className="learning-path-suggestion">
                  <strong><BilingualText vi="Lộ trình đề xuất" en="Recommended path" /></strong>
                  <p>
                    <BilingualText
                      vi={`Gồm ${recommendedPath.length} khóa học theo thứ tự. Tiến độ các khóa cũ vẫn được giữ nguyên.`}
                      en={`Includes ${recommendedPath.length} courses in sequence. Existing course progress will be preserved.`}
                    />
                  </p>
                  <button disabled={path.saving} onClick={applyRecommendedPath}>
                    <BilingualText vi="Áp dụng toàn bộ lộ trình" en="Apply full path" />
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Recommended Course Path (Sequence) */}
          {recommendedPath.length > 0 && (
            <section className="learning-path-course-path">
              <div className="learning-path-section-heading">
                <div>
                  <h2><BilingualText vi="Lộ trình khóa học được đề xuất" en="Recommended course path" /></h2>
                  <p>
                    <BilingualText
                      vi="Hoàn thành các khóa học theo thứ tự để đạt mục tiêu đã chọn."
                      en="Complete these courses in order to reach your selected goals."
                    />
                  </p>
                </div>
              </div>
              <ol>
                {recommendedPath.map((course, index) => (
                  <li key={courseIdOf(course)}>
                    <span>{index + 1}</span>
                    <div>
                      <small>
                        {course.levelMin === course.levelMax ? course.level : `${course.levelMin}–${course.levelMax}`}
                      </small>
                      <strong>{titleOf(course)}</strong>
                      <p>{descriptionOf(course)}</p>
                    </div>
                    <Link
                      to={`/courses/${courseIdOf(course)}`}
                      aria-label={bilingualLabel(`Xem ${titleOf(course)}`, `View ${titleOf(course)}`)}
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Interactive Roadmap */}
          <section className="learning-path-roadmap">
            <div className="learning-path-section-heading">
              <div>
                <h2><BilingualText vi="Lộ trình tương tác" en="Interactive Roadmap" /></h2>
                <p>
                  {roadmapCourse ? titleOf(roadmapCourse) : <BilingualText vi="Chưa có lộ trình khả dụng" en="No path available" />}
                  {path.data?.roadmapPreview && <> · <BilingualText vi="Bản xem trước" en="Preview" /></>}
                </p>
              </div>
              {roadmapCourse && (
                <Link to={`/courses/${roadmapCourse.id}`}>
                  <BilingualText vi="Chi tiết khóa học" en="Course details" />
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
            <Roadmap stages={path.data?.roadmap} courseId={roadmapCourse?.id} />
          </section>

          {/* Recommended Courses Catalog List */}
          <section className="learning-path-courses">
            <div className="learning-path-section-heading">
              <div>
                <h2><BilingualText vi="Khóa học đề xuất" en="Recommended Courses" /></h2>
                <p>
                  <BilingualText
                    vi="Xếp hạng theo trình độ, mục tiêu, điều kiện tiên quyết và trạng thái xuất bản."
                    en="Ranked by level, goals, prerequisites, and publication status."
                  />
                </p>
              </div>
              <Link to={catalogPath}>
                <BilingualText vi="Mở Course Catalog" en="Open Course Catalog" />
                <ArrowRight size={14} />
              </Link>
            </div>

            {exactCourses.length ? (
              <div className="learning-path-course-list">
                {exactCourses.map(item => (
                  <button key={item.id} onClick={() => applyCourse(item)} disabled={path.saving}>
                    <span>{item.levelMin === item.levelMax ? item.level : `${item.levelMin}–${item.levelMax}`}</span>
                    <strong>{titleOf(item)}</strong>
                    <small>
                      <BilingualText vi="Áp dụng" en="Apply" />
                      <ChevronRight size={13} />
                    </small>
                  </button>
                ))}
              </div>
            ) : (
              <div className="learning-path-empty">
                <strong><BilingualText vi="Chưa có khóa học phù hợp chính xác" en="No exact matching course" /></strong>
                <p>
                  <BilingualText
                    vi="Không tạo dữ liệu giả. Bạn có thể xem các lựa chọn gần nhất bên dưới hoặc mở Course Catalog."
                    en="No placeholder course is created. Review the nearest options below or open Course Catalog."
                  />
                </p>
                {nearestCourses.length > 0 && (
                  <div className="learning-path-course-list">
                    {nearestCourses.map(item => {
                      const reason = REASON_LABELS[item.recommendationReason] || REASON_LABELS.NEAREST_LEVEL;
                      return (
                        <Link key={item.id} to={`/courses/${item.id}`}>
                          <span>{item.level}</span>
                          <strong>{titleOf(item)}</strong>
                          <small><BilingualText vi={reason[0]} en={reason[1]} /></small>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>
        </section>
      </main>
      {confirmationDialog}
    </>
  );
}

export default LearningPathPage;

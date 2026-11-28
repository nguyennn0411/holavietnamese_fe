import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { CourseThumbnail } from '@/features/learning/components/course/CourseInfo';
import { CourseStudio } from '@/features/learning/admin/components/CourseStudio';
import { ActivityEditor } from '@/features/learning/admin/components/ActivityEditor';
import { canIllustrateActivity } from '@/features/learning/admin/activityIllustrations';
import { useCallback, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { contentService } from '@/features/learning/api/contentService';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import { ResourceState } from '@/shared/components/common/ResourceState';
import { PageHeader, EmptyState, Notice, Breadcrumb } from '@/shared/components/common/Ui';
import { Modal } from '@/shared/components/common/Modal';
import { ContentForm } from '@/features/learning/admin/components/ContentForm';
import { moveItem } from '@/features/learning/components/learning/answerUtils';
import { LessonActivities } from '@/features/learning/components/learning/LessonActivities';
import { useAuth } from '@/features/auth/context/AuthContext';
import { AdminActionGroup, AdminActionLink } from '@/shared/components/common/AdminTableActions';
import { AdminPagination } from '@/shared/components/common/AdminPagination';
import { AdminFilterSelect } from '@/shared/components/common/AdminFilterSelect';
import { AdminStatusBadge } from '@/shared/components/common/AdminStatusBadge';
import { HolaSelect } from '@/shared/components/common/HolaSelect';
import { AlertCircle, Archive, ArrowDown, ArrowLeft, ArrowUp, Check, ChevronDown, Clock, Eye, Info, Layers, Pencil, Plus, Search, X } from 'lucide-react';
import './lesson-builder.css';

const CONTENT_STATUS_DOTS = {
  DRAFT: '#F59E0B',
  REVIEW: '#3B82F6',
  REJECTED: '#EF4444',
  PUBLISHED: '#10B981',
  ARCHIVED: '#64748B',
};

const STATUS_BANNER_CONFIG = {
  '': {
    labelVi: 'Tất cả khóa học',
    labelEn: 'All Courses',
    icon: Layers,
    hintVi: 'Hiển thị danh sách toàn bộ khóa học trên hệ thống ở mọi trạng thái.',
    hintEn: 'Displaying all courses across all statuses.',
    emptyTitleVi: 'Chưa có khóa học nào',
    emptyTitleEn: 'No courses found',
    emptyDescVi: 'Hệ thống chưa có khóa học nào hoặc hãy thử từ khóa tìm kiếm khác.',
    emptyDescEn: 'No courses available or try another search keyword.',
  },
  REVIEW: {
    labelVi: 'Chờ Admin duyệt',
    labelEn: 'Pending Review',
    icon: Clock,
    hintVi: 'Các bản nháp Content Manager đã gửi sẽ xuất hiện ở mục Chờ Admin duyệt.',
    hintEn: 'Drafts submitted by Content Managers appear in Pending review.',
    emptyTitleVi: 'Không có khóa học chờ duyệt',
    emptyTitleEn: 'No courses pending review',
    emptyDescVi: 'Các khóa học Content Manager gửi duyệt sẽ hiển thị tại đây.',
    emptyDescEn: 'Courses submitted by Content Managers will appear here.',
  },
  DRAFT: {
    labelVi: 'Bản nháp',
    labelEn: 'Draft Courses',
    icon: Pencil,
    hintVi: 'Các khóa học đang trong quá trình biên soạn, chưa gửi yêu cầu kiểm duyệt.',
    hintEn: 'Courses currently being authored, not yet submitted for review.',
    emptyTitleVi: 'Không có khóa học bản nháp',
    emptyTitleEn: 'No draft courses',
    emptyDescVi: 'Không có khóa học nào đang ở trạng thái bản nháp.',
    emptyDescEn: 'There are no courses currently in draft status.',
  },
  REJECTED: {
    labelVi: 'Cần chỉnh sửa',
    labelEn: 'Needs Revision / Rejected',
    icon: AlertCircle,
    hintVi: 'Các khóa học cần Content Manager cập nhật và chỉnh sửa lại theo yêu cầu.',
    hintEn: 'Courses requiring updates and revisions from Content Managers.',
    emptyTitleVi: 'Không có khóa học cần chỉnh sửa',
    emptyTitleEn: 'No rejected courses',
    emptyDescVi: 'Hiện không có khóa học nào bị từ chối hoặc cần chỉnh sửa lại.',
    emptyDescEn: 'There are currently no courses requiring revisions.',
  },
  PUBLISHED: {
    labelVi: 'Đã xuất bản',
    labelEn: 'Published Courses',
    icon: Check,
    hintVi: 'Các khóa học đã duyệt thành công và đang hiển thị công khai cho học viên.',
    hintEn: 'Courses successfully approved and live for learners.',
    emptyTitleVi: 'Không có khóa học đã xuất bản',
    emptyTitleEn: 'No published courses',
    emptyDescVi: 'Chưa có khóa học nào được xuất bản công khai.',
    emptyDescEn: 'There are no published courses yet.',
  },
  ARCHIVED: {
    labelVi: 'Lưu trữ',
    labelEn: 'Archived Courses',
    icon: Archive,
    hintVi: 'Các khóa học đã tạm ngưng hoặc được đưa vào kho lưu trữ.',
    hintEn: 'Courses paused or retired to the archive.',
    emptyTitleVi: 'Không có khóa học lưu trữ',
    emptyTitleEn: 'No archived courses',
    emptyDescVi: 'Không có khóa học nào trong kho lưu trữ.',
    emptyDescEn: 'There are no courses in the archive.',
  },
};

const labels = { courses: 'Khóa học', lessons: 'Bài học', quizzes: 'Quiz' };

export function AdminContentListPage({ kind }) {
  const { isAdmin, isContentCreator } = useAuth();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  // Default to all statuses as requested by user (previously: isAdmin && kind === 'courses' ? 'REVIEW' : '')
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const resource = useAsyncResource(
    useCallback(
      (signal) => contentService.list(kind, { q: query, status, page, size: 12 }, signal),
      [kind, query, status, page]
    )
  );

  const canCreate = isContentCreator && !isAdmin && kind === 'courses';
  const statuses =
    kind === 'courses'
      ? ['DRAFT', 'REVIEW', 'REJECTED', 'PUBLISHED', 'ARCHIVED']
      : ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

  const statusOptions = [
    { value: '', label: bilingualLabel('Tất cả trạng thái', 'All statuses'), dotColor: '#94A3B8' },
    ...statuses.map((s) => ({
      value: s,
      label: bilingualLabel(
        s === 'DRAFT'
          ? 'Bản nháp (DRAFT)'
          : s === 'REVIEW'
          ? 'Chờ duyệt (REVIEW)'
          : s === 'REJECTED'
          ? 'Từ chối (REJECTED)'
          : s === 'PUBLISHED'
          ? 'Đã xuất bản (PUBLISHED)'
          : s === 'ARCHIVED'
          ? 'Lưu trữ (ARCHIVED)'
          : s,
        s
      ),
      dotColor: CONTENT_STATUS_DOTS[s] || '#94A3B8',
    })),
  ];

  const description =
    kind === 'courses'
      ? isAdmin
        ? 'Xem và kiểm duyệt khóa học do Content Creator gửi lên.'
        : 'Tạo, chỉnh sửa và gửi khóa học cho Admin kiểm duyệt.'
      : kind === 'lessons'
      ? 'Xem các bài học thuộc khóa học được phân quyền.'
      : 'Quản lý quiz và trạng thái xuất bản.';

  const action =
    kind === 'lessons' ? (
      <Link className="admin-btn admin-btn-secondary" to={isAdmin ? "/admin/courses" : "/content/courses"}>
        <BilingualText vi="← Quay lại khóa học" en="← Back to courses" />
      </Link>
    ) : canCreate && kind === 'courses' ? (
      <Link className="admin-btn admin-btn-primary" to="/content/courses/new">
        + Import khóa học
      </Link>
    ) : canCreate ? (
      <button className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>
        <BilingualText
          vi={kind === 'quizzes' ? '+ Tạo quiz' : kind === 'lessons' ? '+ Tạo bài học' : '+ Tạo khóa học'}
          en={kind === 'quizzes' ? '+ Create quiz' : kind === 'lessons' ? '+ Create lesson' : '+ Create course'}
        />
      </button>
    ) : isContentCreator && !isAdmin && kind !== 'courses' ? (
      <Link className="admin-btn admin-btn-secondary" to={isAdmin ? "/admin/courses" : "/content/courses"}>
        <BilingualText vi="← Quay lại khóa học" en="← Back to courses" />
      </Link>
    ) : null;

  const reviewQueue = isAdmin && kind === 'courses';

  return (
    <section>
      <PageHeader
        eyebrow={<BilingualText vi={isAdmin ? 'Kiểm duyệt nội dung' : 'Người sáng tạo nội dung học tập'} en={isAdmin ? 'Content Moderation' : 'Learning Content Management'} />}
        title={<BilingualText vi={labels[kind]} en={kind === 'courses' ? 'Courses' : kind === 'lessons' ? 'Lessons' : 'Quizzes'} />}
        description={
          <BilingualText
            vi={description}
            en={
              kind === 'courses'
                ? isAdmin
                  ? 'Review and moderate courses submitted by Content Creators.'
                  : 'Create, edit and submit courses for Admin review.'
                : kind === 'lessons'
                ? 'View lessons belonging to assigned courses.'
                : 'Manage quizzes and publication status.'
            }
          />
        }
        actions={action}
      />

      {reviewQueue && (() => {
        const currentBanner = STATUS_BANNER_CONFIG[status] || STATUS_BANNER_CONFIG[''];
        const TabIcon = currentBanner.icon;
        return (
          <div className="review-tabs-bar">
            <div className="review-tabs-group" role="tablist" aria-label={bilingualLabel('Bộ lọc kiểm duyệt khóa học', 'Course review filters')}>
              <button
                type="button"
                role="tab"
                aria-selected={true}
                className="review-tab-btn is-active"
                onClick={() => {
                  setStatus((current) => (current === 'REVIEW' ? '' : current === '' ? 'REVIEW' : ''));
                  setPage(0);
                }}
                title={
                  status === 'REVIEW'
                    ? bilingualLabel("Bấm để xem tất cả khóa học", "Click to view all courses")
                    : bilingualLabel("Bấm để chuyển sang Chờ duyệt", "Click to switch to pending review")
                }
              >
                <TabIcon size={16} />
                <span><BilingualText vi={currentBanner.labelVi} en={currentBanner.labelEn} /></span>
              </button>
            </div>

            <div className="review-tabs-hint">
              <Info size={14} />
              <span>
                <BilingualText
                  vi={currentBanner.hintVi}
                  en={currentBanner.hintEn}
                />
              </span>
            </div>
          </div>
        );
      })()}

      {/* Filter Toolbar matching the exact ratio & style of AdminUsersPage */}
      <form
        className="admin-card"
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(search.trim());
          setPage(0);
        }}
        style={{
          position: 'relative',
          zIndex: 40,
          padding: '14px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {/* Search Input on the Left */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 280px',
            maxWidth: '380px',
            minWidth: '220px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8',
              pointerEvents: 'none',
            }}
          />
          <input
            aria-label={`Tìm ${labels[kind]}`}
            placeholder={bilingualLabel(
              kind === 'courses' ? "Tìm khóa học…" : kind === 'lessons' ? "Tìm bài học…" : "Tìm quiz…",
              kind === 'courses' ? "Search courses…" : kind === 'lessons' ? "Search lessons…" : "Search quizzes…"
            )}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{
              width: '100%',
              height: '40px',
              minHeight: '40px',
              maxHeight: '40px',
              padding: '0 36px 0 36px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              fontSize: '13px',
              color: '#1E293B',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setQuery('');
                setPage(0);
              }}
              aria-label={bilingualLabel("Xóa tìm kiếm", "Clear search")}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'transparent',
                padding: '4px',
                cursor: 'pointer',
                color: '#94A3B8',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                minHeight: '24px',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Dropdown and Search Button on the Right */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginLeft: 'auto',
            flexWrap: 'wrap',
          }}
        >
          <AdminFilterSelect
            ariaLabel={bilingualLabel("Trạng thái nội dung", "Content status")}
            value={status}
            options={statusOptions}
            onChange={(val) => {
              setStatus(val);
              setPage(0);
            }}
            minWidth="190px"
            align="right"
          />

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
          >
            <Search size={15} strokeWidth={2.3} />
            <span><BilingualText vi="Tìm kiếm" en="Search" /></span>
          </button>
        </div>
      </form>

      <ResourceState resource={resource}>
        {(data) => {
          const items = Array.isArray(data) ? data : data.content || [];
          return (
            <>
              {items.length ? (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th><BilingualText vi="Nội dung" en="Content" /></th>
                        <th><BilingualText vi="Loại / Trình độ" en="Type / Level" /></th>
                        <th><BilingualText vi="Trạng thái" en="Status" /></th>
                        <th><BilingualText vi={reviewQueue && status === 'REVIEW' ? "Ngày gửi duyệt" : "Cập nhật"} en={reviewQueue && status === 'REVIEW' ? "Submitted" : "Updated"} /></th>
                        <th style={{ textAlign: 'right' }}><BilingualText vi="Thao tác" en="Actions" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const pendingReview = isAdmin && item.status === 'REVIEW';
                        return (
                          <tr key={item.id} className={pendingReview ? 'course-review-row' : ''}>
                            <td>
                              <strong><BilingualText vi={item.titleVi || item.title} en={item.title} /></strong>
                              <div className="muted"><BilingualText vi={item.descriptionVi || item.description} en={item.description} /></div>
                            </td>
                            <td>{item.level || item.lessonType || item.quizType}</td>
                            <td>
                              <AdminStatusBadge status={item.status || item.publicationStatus} />
                            </td>
                            <td>
                              {(pendingReview ? item.submittedAt : item.updatedAt)
                                ? new Date(pendingReview ? item.submittedAt : item.updatedAt).toLocaleDateString('vi-VN')
                                : '—'}
                            </td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <AdminActionGroup>
                                <AdminActionLink
                                  tone={pendingReview ? 'approve' : isAdmin ? 'detail' : 'neutral'}
                                  icon={pendingReview ? Check : isAdmin ? Eye : Pencil}
                                  to={`${isAdmin ? '/admin' : '/content'}/${kind}/${item.id}${pendingReview ? '?step=publish' : ''}`}
                                >
                                  <BilingualText
                                    vi={
                                      pendingReview
                                        ? 'Mở kiểm duyệt'
                                        : isAdmin
                                        ? 'Chi tiết'
                                        : kind === 'courses'
                                        ? 'Chỉnh sửa'
                                        : 'Mở builder'
                                    }
                                    en={
                                      pendingReview
                                        ? 'Review'
                                        : isAdmin
                                        ? 'Details'
                                        : kind === 'courses'
                                        ? 'Edit'
                                        : 'Open builder'
                                    }
                                  />
                                </AdminActionLink>
                              </AdminActionGroup>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <AdminPagination
                    currentPage={page + 1}
                    pageSize={12}
                    totalItems={data.totalElements ?? items.length}
                    onPageChange={(nextPage) => setPage(nextPage - 1)}
                  />
                </div>
              ) : (
                <EmptyState
                  title={
                    kind === 'courses' && STATUS_BANNER_CONFIG[status]
                      ? bilingualLabel(STATUS_BANNER_CONFIG[status].emptyTitleVi, STATUS_BANNER_CONFIG[status].emptyTitleEn)
                      : bilingualLabel("Chưa có nội dung phù hợp", "No matching content")
                  }
                  description={
                    kind === 'courses' && STATUS_BANNER_CONFIG[status]
                      ? bilingualLabel(STATUS_BANNER_CONFIG[status].emptyDescVi, STATUS_BANNER_CONFIG[status].emptyDescEn)
                      : bilingualLabel("Tạo nội dung mới hoặc thay đổi bộ lọc.", "Create new content or change filters.")
                  }
                />
              )}
            </>
          );
        }}
      </ResourceState>

      {creating && (
        <Modal
          title={
            kind === 'quizzes'
              ? bilingualLabel('Tạo quiz')
              : kind === 'lessons'
              ? bilingualLabel('Tạo bài học')
              : bilingualLabel('Tạo khóa học')
          }
          onClose={() => setCreating(false)}
        >
          <ContentForm
            kind={kind}
            onCancel={() => setCreating(false)}
            onSave={async (body) => {
              const created = await contentService.create(kind, body);
              setCreating(false);
              navigate(`${isAdmin ? '/admin' : '/content'}/${kind}/${created.id}${kind === 'quizzes' ? '?newQuestion=1' : ''}`);
            }}
          />
        </Modal>
      )}
    </section>
  );
}

export function AdminCourseBuilderPage() {
  const { courseId } = useParams();
  const resource = useAsyncResource(useCallback((signal) => contentService.get('courses', courseId, signal), [courseId]));
  return <ResourceState resource={resource}>{(course) => <CourseBuilder key={course.id} course={course} reload={resource.reload} />}</ResourceState>;
}

function CourseBuilder({ course, reload }) {
  return <CourseStudio course={course} reload={reload} />;
}

export function AdminLessonBuilderPage() {
  const { lessonId } = useParams();
  const resource = useAsyncResource(useCallback((signal) => contentService.get('lessons', lessonId, signal), [lessonId]));
  return <ResourceState resource={resource}>{(lesson) => <LessonBuilder key={lesson.id} lesson={lesson} reload={resource.reload} />}</ResourceState>;
}

function LessonBuilder({ lesson, reload }) {
  const [selection, setSelection] = useState(undefined),
    [showEditor, setShowEditor] = useState(false),
    [editing, setEditing] = useState(false),
    [creatingQuiz, setCreatingQuiz] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [imageTargetId, setImageTargetId] = useState(null),
    [focusIllustration, setFocusIllustration] = useState(0);
  const { isAdmin, isContentCreator } = useAuth();
  const navigate = useNavigate();
  const canEdit = isContentCreator && !isAdmin && ['DRAFT', 'REJECTED'].includes(lesson.courseStatus);
  const addActivityMenu = useRef(null);
  const activitiesHeading = useRef(null);
  const editorBackButton = useRef(null);
  const activities = lesson.activities || [];
  const selected = selection === undefined
    ? activities[0]
    : selection?.id == null
      ? selection
      : activities.find(activity => activity.id === selection.id);
  const illustrationTargets = activities.filter(canIllustrateActivity);
  const imageTarget = illustrationTargets.find(activity => String(activity.id) === imageTargetId);

  async function reorder(index, direction) {
    setBusy(true);
    try {
      await contentService.reorder(`lessons/${lesson.id}/activities`, moveItem(lesson.activities.map((item) => item.id), index, direction));
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(nextStatus) {
    const targetStatus = typeof nextStatus === 'string' ? nextStatus : nextStatus?.target?.value;
    if (!targetStatus || targetStatus === (lesson.publicationStatus || 'DRAFT')) return;
    setBusy(true);
    try {
      await contentService.status('lessons', lesson.id, targetStatus);
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function closeAddActivityMenu() {
    addActivityMenu.current?.removeAttribute('open');
  }

  function openIllustrationEditor(activity) {
    selectActivity(activity, true);
    setImageTargetId(null);
    setMessage('');
    setError('');
  }

  function chooseLessonImage() {
    closeAddActivityMenu();
    const current = illustrationTargets.find(activity => activity.id === selected?.id);
    if (current) openIllustrationEditor(current);
    else if (illustrationTargets.length === 1) openIllustrationEditor(illustrationTargets[0]);
    else setImageTargetId('');
  }

  function selectActivity(activity, focusImage = false) {
    setFocusIllustration(request => focusImage ? request + 1 : 0);
    closeAddActivityMenu();
    setSelection(activity);
    setShowEditor(true);
    if (!focusImage && window.matchMedia('(max-width: 900px)').matches) {
      requestAnimationFrame(() => editorBackButton.current?.focus());
    }
  }

  function showActivities() {
    setShowEditor(false);
    if (window.matchMedia('(max-width: 900px)').matches) {
      requestAnimationFrame(() => activitiesHeading.current?.focus());
    }
  }

  return (
    <section>
      <Breadcrumb
        items={[
          { to: isAdmin ? '/admin/courses' : '/content/courses', label: bilingualLabel('Khóa học', 'Courses') },
          { to: `${isAdmin ? '/admin' : '/content'}/courses/${lesson.courseId}?step=curriculum`, label: lesson.courseTitle },
          { label: lesson.title },
        ]}
      />
      <PageHeader
        eyebrow={bilingualLabel('BIÊN SOẠN BÀI HỌC', 'LESSON AUTHORING')}
        title={<span className="lesson-builder-title">
          <BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} />
          <AdminStatusBadge status={lesson.publicationStatus || 'DRAFT'} />
        </span>}
        description={lesson.moduleTitle}
        actions={<Link className="admin-btn admin-btn-secondary" to={`${isAdmin ? '/admin' : '/content'}/lessons/${lesson.id}/preview`}>
          <Eye size={16} />
          <BilingualText>{"Xem trước bài học"}</BilingualText>
        </Link>}
      />
      {error && <Notice kind="error"><BilingualText>{error}</BilingualText></Notice>}
      {message && <Notice kind="success"><BilingualText>{message}</BilingualText></Notice>}
      {!canEdit && <Notice><BilingualText>{"Bài học đang ở chế độ chỉ đọc theo trạng thái khóa học."}</BilingualText></Notice>}
      <details className="admin-card lesson-builder-info">
        <summary><BilingualText>{"Thông tin bài học"}</BilingualText><ChevronDown size={16} /></summary>
        <div className="lesson-builder-info-content">
          {lesson.lessonType && <p className="muted"><BilingualText>{lesson.lessonType}</BilingualText></p>}
          {(lesson.descriptionVi || lesson.description) && <p>
            <BilingualText vi={lesson.descriptionVi || lesson.description} en={lesson.description || lesson.descriptionVi} />
          </p>}
          {canEdit && <div className="lesson-builder-info-actions">
            <div className="lesson-builder-status-field">
              <span className="lesson-builder-status-label"><BilingualText>{"Trạng thái"}</BilingualText></span>
              <HolaSelect
                value={lesson.publicationStatus || 'DRAFT'}
                disabled={busy}
                onChange={changeStatus}
                options={[
                  { value: 'DRAFT', label: bilingualLabel('DRAFT') },
                  ...(lesson.publicationStatus === 'PUBLISHED'
                    ? [{ value: 'PUBLISHED', label: bilingualLabel('PUBLISHED') }]
                    : []),
                  { value: 'ARCHIVED', label: bilingualLabel('ARCHIVED') },
                ]}
                minWidth="190px"
                align="left"
                ariaLabel={bilingualLabel('Trạng thái', 'Status')}
              />
            </div>
            <button type="button" className="admin-btn admin-btn-secondary" disabled={busy} onClick={() => setEditing(true)}>
              <Pencil size={15} /> <BilingualText>{"Chỉnh sửa"}</BilingualText>
            </button>
          </div>}
        </div>
      </details>
      <div className={`lesson-builder-grid${canEdit && selected && showEditor ? ' is-editor-open' : ''}`}>
        <section className="admin-card lesson-builder-list" aria-labelledby="lesson-builder-activities">
          <div className="lesson-builder-list-heading">
            <h2 id="lesson-builder-activities" tabIndex={-1} ref={activitiesHeading}><BilingualText>{"Các hoạt động"}</BilingualText></h2>
            {canEdit && <details className="lesson-builder-add" ref={addActivityMenu}>
              <summary className="admin-btn admin-btn-primary admin-btn-sm"><Plus size={15} /><BilingualText vi="Thêm hoạt động" en="Add activity" /><ChevronDown size={14} /></summary>
              <div className="lesson-builder-add-options">
                <button type="button" className="secondary" disabled={busy || !illustrationTargets.length} onClick={chooseLessonImage}>
                  <BilingualText vi="Thêm ảnh" en="Add image" />
                </button>
                {!illustrationTargets.length && <small className="muted">
                  <BilingualText vi="Thêm một mục nội dung trước khi gắn ảnh minh họa." en="Create a content activity before attaching an illustration." />
                </small>}
                <button type="button" className="secondary" disabled={busy} onClick={() => selectActivity({ activityType: 'VIDEO', status: 'PUBLISHED', contentJson: { videoUrl: '' } })}>
                  <BilingualText vi="Thêm video" en="Add video" />
                </button>
                <button type="button" className="secondary" disabled={busy} onClick={() => selectActivity({})}>
                  <BilingualText vi="Hoạt động khác" en="Other activities" />
                </button>
              </div>
            </details>}
          </div>
          <ol className="lesson-builder-activities">
            {activities.map((activity, index) => {
              const active = canEdit && selected?.id === activity.id;
              const title = <BilingualText vi={activity.titleVi || activity.title} en={activity.title} />;
              const summary = <><span className="lesson-builder-number" aria-hidden="true">{index + 1}</span><span className="lesson-builder-item-title">{title}</span></>;
              return <li className={`lesson-builder-row${active ? ' is-selected' : ''}`} key={activity.id}>
                {canEdit ? <button type="button" className="lesson-builder-select" aria-pressed={active} disabled={busy} onClick={() => selectActivity(activity)}>
                  {summary}
                </button> : <span className="lesson-builder-select">{summary}</span>}
                {canEdit && <div className="lesson-builder-order">
                  <button type="button" className="secondary" aria-label={bilingualLabel('Di chuyển lên', 'Move up')} disabled={busy || index === 0} onClick={() => reorder(index, -1)}><ArrowUp size={14} /></button>
                  <button type="button" className="secondary" aria-label={bilingualLabel('Di chuyển xuống', 'Move down')} disabled={busy || index === activities.length - 1} onClick={() => reorder(index, 1)}><ArrowDown size={14} /></button>
                </div>}
              </li>;
            })}
          </ol>
          {!activities.length && <EmptyState title={bilingualLabel("Chưa có hoạt động", "No activities yet")} />}
          {canEdit && <button type="button" className="secondary lesson-builder-quiz" disabled={busy} onClick={() => setCreatingQuiz(true)}>
            <Plus size={16} /> <BilingualText vi="Tạo quiz bài học" en="Create lesson quiz" />
          </button>}
        </section>
        <section className="admin-card lesson-builder-editor">
          {canEdit && selected ? (
            <>
              <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm lesson-builder-back" ref={editorBackButton} disabled={busy} onClick={showActivities}>
                <ArrowLeft size={15} /> <BilingualText vi="Quay lại hoạt động" en="Back to activities" />
              </button>
              <ActivityEditor key={selected.id || selected.activityType || 'new'} initial={selected}
                lessonId={lesson.id} focusIllustration={focusIllustration} onBusyChange={setBusy}
                onSaved={({ addedIllustration }) => {
                  if (addedIllustration) setMessage(bilingualLabel('Đã gắn ảnh vào mục nội dung.', 'Illustration attached to the activity.'));
                  setFocusIllustration(0);
                  setSelection(null);
                  showActivities();
                  reload();
                }} />
            </>
          ) : (
            <p className="muted"><BilingualText>
              {canEdit ? 'Chọn hoạt động để chỉnh sửa nội dung.' : 'Admin có thể xem toàn bộ nội dung bằng chức năng xem trước.'}
            </BilingualText></p>
          )}
        </section>
      </div>
      {canEdit && imageTargetId !== null && <Modal title={bilingualLabel('Thêm ảnh minh họa', 'Add an illustration')} onClose={() => setImageTargetId(null)}>
        <form className="activity-editor-form" onSubmit={event => {
          event.preventDefault();
          if (imageTarget) openIllustrationEditor(imageTarget);
        }}>
          <div className="activity-editor-field">
            <span className="activity-editor-field-label"><BilingualText vi="Mục nội dung" en="Content activity" /></span>
            <HolaSelect
              value={imageTargetId}
              onChange={(val) => setImageTargetId(String(val))}
              placeholder={bilingualLabel('Chọn mục để gắn ảnh', 'Choose an activity for this image')}
              options={illustrationTargets.map((activity) => ({
                value: String(activity.id),
                label: bilingualLabel(activity.titleVi || activity.title, activity.title || activity.titleVi),
              }))}
              fullWidth
              align="left"
              ariaLabel={bilingualLabel('Mục nội dung', 'Content activity')}
            />
          </div>
          <div className="activity-editor-actions">
            <button className="admin-btn admin-btn-primary" type="submit" disabled={!imageTarget}>
              <BilingualText vi="Tiếp tục" en="Continue" />
            </button>
          </div>
        </form>
      </Modal>}
      {canEdit && editing && (
        <Modal title={bilingualLabel("Chỉnh sửa bài học")} onClose={() => setEditing(false)}>
          <ContentForm kind="lessons" initial={lesson} onCancel={() => setEditing(false)} onSave={async (body) => { await contentService.update('lessons', lesson.id, body); setEditing(false); reload(); }} />
        </Modal>
      )}
      {canEdit && creatingQuiz && (
        <Modal title={bilingualLabel("Tạo quiz bài học")} onClose={() => setCreatingQuiz(false)}>
          <ContentForm
            kind="quizzes"
            initial={{ quizType: 'LESSON', courseId: lesson.courseId, lessonId: lesson.id, passingScore: 70 }}
            fixedFields={['quizType', 'courseId', 'lessonId']}
            onCancel={() => setCreatingQuiz(false)}
            onSave={async (body) => {
              const quiz = await contentService.create('quizzes', body);
              setCreatingQuiz(false);
              navigate(`${isAdmin ? '/admin' : '/content'}/quizzes/${quiz.id}?newQuestion=1`);
            }}
          />
        </Modal>
      )}
    </section>
  );
}

export function AdminCoursePreviewPage() {
  const { isAdmin } = useAuth();
  const { courseId } = useParams();
  const resource = useAsyncResource(useCallback((signal) => contentService.get('courses', courseId, signal), [courseId]));
  return (
    <ResourceState resource={resource}>
      {(course) => (
        <section>
          <PageHeader
            title={<BilingualText vi={course.titleVi || course.title} en={course.title} />}
            description={<BilingualText vi={course.descriptionVi || course.description} en={course.description} />}
            actions={<Link className="button secondary" to={`${isAdmin ? '/admin' : '/content'}/courses/${course.id}?step=preview`}><BilingualText>{"← Quay lại chỉnh sửa khóa học"}</BilingualText></Link>}
          />
          <Notice><BilingualText>{"Xem trước nội dung quản trị, bao gồm bản nháp."}</BilingualText></Notice>
          <div className="course-detail-hero card">
            <div>
              <span className="badge">{course.level}</span>
              <h2><BilingualText vi={course.titleVi || course.title} en={course.title} /></h2>
              <p>{course.learningOutcomes}</p>
            </div>
            <CourseThumbnail course={course} />
          </div>
          {course.modules?.map((module) => (
            <section key={module.id}>
              <h2><BilingualText vi={module.titleVi || module.title} en={module.title} /></h2>
              {module.lessons?.map((lesson) => (
                <Link className="list-row" key={lesson.id} to={`${isAdmin ? '/admin' : '/content'}/lessons/${lesson.id}/preview`}>
                  <strong><BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} /></strong>
                  <span><BilingualText>{"Xem bài học →"}</BilingualText></span>
                </Link>
              ))}
            </section>
          ))}
        </section>
      )}
    </ResourceState>
  );
}

export function AdminLessonPreviewPage() {
  const { isAdmin } = useAuth();
  const { lessonId } = useParams();
  const resource = useAsyncResource(useCallback((signal) => contentService.preview('lessons', lessonId, signal), [lessonId]));
  return (
    <ResourceState resource={resource}>
      {(lesson) => (
        <section>
          <PageHeader
            title={<BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} />}
            description={<BilingualText vi={lesson.descriptionVi || lesson.description} en={lesson.description} />}
            actions={
              <>
                <Link className="button secondary" to={`${isAdmin ? '/admin' : '/content'}/lessons/${lesson.id}`}><BilingualText>{"← Quay lại chỉnh sửa bài học"}</BilingualText></Link>
                {lesson.courseId && <Link className="button secondary" to={`${isAdmin ? '/admin' : '/content'}/courses/${lesson.courseId}?step=curriculum`}><BilingualText>{"Về khóa học"}</BilingualText></Link>}
              </>
            }
          />
          <LessonActivities lessonId={lesson.id} previewLesson={lesson} fallback={<EmptyState title={bilingualLabel("Chưa có hoạt động", "No activities yet")} />} />
        </section>
      )}
    </ResourceState>
  );
}

export default AdminContentListPage;

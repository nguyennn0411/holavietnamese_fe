import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { CourseThumbnail } from '@/features/learning/components/course/CourseInfo';
import { CourseStudio } from '@/features/learning/admin/components/CourseStudio';
import { ActivityEditor } from '@/features/learning/admin/components/ActivityEditor';
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
import { Search, X, Eye, Pencil, Check, Info, Clock, Layers, AlertCircle, Archive } from 'lucide-react';

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
  const { isAdmin, isContentManager } = useAuth();
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

  const canCreate = isContentManager && !isAdmin && kind === 'courses';
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
        ? 'Xem và kiểm duyệt khóa học do Content Manager gửi lên.'
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
    ) : isContentManager && !isAdmin && kind !== 'courses' ? (
      <Link className="admin-btn admin-btn-secondary" to={isAdmin ? "/admin/courses" : "/content/courses"}>
        <BilingualText vi="← Quay lại khóa học" en="← Back to courses" />
      </Link>
    ) : null;

  const reviewQueue = isAdmin && kind === 'courses';

  return (
    <section>
      <PageHeader
        eyebrow={<BilingualText vi={isAdmin ? 'Kiểm duyệt nội dung' : 'Quản lý nội dung học tập'} en={isAdmin ? 'Content Moderation' : 'Learning Content Management'} />}
        title={<BilingualText vi={labels[kind]} en={kind === 'courses' ? 'Courses' : kind === 'lessons' ? 'Lessons' : 'Quizzes'} />}
        description={
          <BilingualText
            vi={description}
            en={
              kind === 'courses'
                ? isAdmin
                  ? 'Review and moderate courses submitted by Content Managers.'
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
                                  <BilingualText>
                                    {pendingReview
                                      ? 'Mở kiểm duyệt'
                                      : isAdmin
                                      ? 'Chi tiết'
                                      : kind === 'courses'
                                      ? 'Chỉnh sửa'
                                      : 'Mở builder'}
                                  </BilingualText>
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
  const [selected, setSelected] = useState(null),
    [editing, setEditing] = useState(false),
    [creatingQuiz, setCreatingQuiz] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef(null);
  const { isAdmin, isContentManager } = useAuth();
  const navigate = useNavigate();
  const canEdit = isContentManager && !isAdmin && ['DRAFT', 'REJECTED'].includes(lesson.courseStatus);

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

  function chooseLessonImage() {
    setSelected(null);
    setMessage('');
    setError('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
      imageInputRef.current.click();
    }
  }

  async function addLessonImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError(bilingualLabel(
        'Thêm hình ảnh vào bài học thất bại. Chỉ chấp nhận ảnh JPG, PNG hoặc WebP tối đa 5 MB.',
        'Failed to add the image to the lesson. Choose a JPG, PNG, or WebP image up to 5 MB.'
      ));
      return;
    }

    setUploadingImage(true);
    setMessage('');
    setError('');
    try {
      const imageUrl = await contentService.uploadLessonMedia(file, 'image');
      await contentService.addActivity(lesson.id, {
        activityType: 'IMAGE',
        title: 'Lesson image',
        titleVi: 'Hình ảnh bài học',
        instruction: '',
        instructionVi: '',
        contentJson: { imageUrl },
        isRequired: false,
        maxScore: 0,
        status: 'PUBLISHED',
        quizId: null,
        grammarTopicIds: [],
      });
      setMessage(bilingualLabel(
        'Đã thêm hình ảnh vào bài học thành công.',
        'The image was added to the lesson successfully.'
      ));
      reload();
    } catch (err) {
      setError(bilingualLabel(
        `Thêm hình ảnh vào bài học thất bại. ${err.message}`,
        `Failed to add the image to the lesson. ${err.message}`
      ));
    } finally {
      setUploadingImage(false);
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
        title={<BilingualText vi={canEdit ? 'Lesson Builder' : 'Xem nội dung bài học'} en={canEdit ? 'Lesson Builder' : 'View lesson content'} />}
        description={`${lesson.title} · ${lesson.moduleTitle || ''}`}
        actions={
          <>
            <Link className="button secondary" to={`${isAdmin ? '/admin' : '/content'}/courses/${lesson.courseId}?step=curriculum`}>
              <BilingualText>{"← Quay lại khóa học"}</BilingualText>
            </Link>
            <Link className="button secondary" to={`${isAdmin ? '/admin' : '/content'}/lessons/${lesson.id}/preview`}>
              <BilingualText>{"Xem trước bài học"}</BilingualText>
            </Link>
            {canEdit && (
              <button onClick={() => setCreatingQuiz(true)}>
                <BilingualText>{"+ Tạo quiz bài học"}</BilingualText>
              </button>
            )}
          </>
        }
      />
      {error && <Notice kind="error"><BilingualText>{error}</BilingualText></Notice>}
      {message && <Notice kind="success"><BilingualText>{message}</BilingualText></Notice>}
      {!canEdit && <Notice><BilingualText>{"Bài học đang ở chế độ chỉ đọc theo trạng thái khóa học."}</BilingualText></Notice>}
      <div className="lesson-builder-grid">
        <aside className="admin-card">
          <h2><BilingualText>{"Thông tin bài học"}</BilingualText></h2>
          <strong><BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} /></strong>
          <p className="muted">{lesson.lessonType} · <BilingualText>{lesson.publicationStatus}</BilingualText></p>
          <p><BilingualText vi={lesson.descriptionVi || lesson.description} en={lesson.description} /></p>
          {canEdit && (
            <>
              <button className="secondary" onClick={() => setEditing(true)}>
                <BilingualText>{"Chỉnh sửa"}</BilingualText>
              </button>
              <label className="builder-status">
                <BilingualText>{"Trạng thái"}</BilingualText>
                <select
                  value={lesson.publicationStatus || 'DRAFT'}
                  disabled={busy}
                  onChange={async (event) => {
                    setBusy(true);
                    try {
                      await contentService.status('lessons', lesson.id, event.target.value);
                      reload();
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((st) => (
                    <option key={st} value={st}>{bilingualLabel(st)}</option>
                  ))}
                </select>
              </label>
            </>
          )}
        </aside>
        <section>
          <div className="builder-heading">
            <h2><BilingualText>{"Các hoạt động"}</BilingualText></h2>
            {canEdit && (
              <div className="actions">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={addLessonImage}
                />
                <button disabled={busy || uploadingImage} onClick={chooseLessonImage}>
                  <BilingualText
                    vi={uploadingImage ? 'Đang tải ảnh…' : '+ Thêm ảnh'}
                    en={uploadingImage ? 'Uploading image…' : '+ Add image'}
                  />
                </button>
                <button onClick={() => setSelected({ activityType: 'VIDEO', status: 'PUBLISHED', contentJson: { videoUrl: '' } })}>
                  <BilingualText>{"+ Thêm video"}</BilingualText>
                </button>
                <button className="secondary" onClick={() => setSelected({})}>
                  <BilingualText>{"+ Hoạt động khác"}</BilingualText>
                </button>
              </div>
            )}
          </div>
          {lesson.activities?.map((activity, index) => (
            <div className={`list-row activity-builder-row ${selected?.id === activity.id ? 'selected' : ''}`} key={activity.id}>
              <button className="activity-select" onClick={() => canEdit && setSelected(activity)}>
                <span className="badge">{index + 1}</span>
                <BilingualText vi={activity.titleVi || activity.title} en={activity.title} />
              </button>
              {canEdit && (
                <div className="actions">
                  <button className="secondary" disabled={busy || index === 0} onClick={() => reorder(index, -1)}>↑</button>
                  <button className="secondary" disabled={busy || index === lesson.activities.length - 1} onClick={() => reorder(index, 1)}>↓</button>
                </div>
              )}
            </div>
          ))}
          {!lesson.activities?.length && <EmptyState title={bilingualLabel("Chưa có hoạt động", "No activities yet")} />}
        </section>
        <aside className="admin-card">
          {canEdit && selected ? (
            <ActivityEditor key={selected.id || selected.activityType || 'new'} initial={selected} lessonId={lesson.id} onSaved={() => { setSelected(null); reload(); }} />
          ) : (
            <p className="muted"><BilingualText>{canEdit ? 'Chọn hoạt động để chỉnh sửa nội dung.' : 'Admin có thể xem toàn bộ nội dung bằng chức năng xem trước.'}</BilingualText></p>
          )}
        </aside>
      </div>
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

import { BilingualText } from '@/shared/components/common/BilingualText';

const STATUS_CONFIGS = {
  DRAFT: {
    labelVi: 'Bản nháp',
    labelEn: 'Draft',
    className: 'admin-status-badge--draft',
  },
  PENDING: {
    labelVi: 'Chờ duyệt',
    labelEn: 'Pending',
    className: 'admin-status-badge--review',
  },
  REVIEW: {
    labelVi: 'Chờ duyệt',
    labelEn: 'Under Review',
    className: 'admin-status-badge--review',
  },
  PENDING_REVIEW: {
    labelVi: 'Chờ duyệt',
    labelEn: 'Pending Review',
    className: 'admin-status-badge--review',
  },
  PUBLISHED: {
    labelVi: 'Đã xuất bản',
    labelEn: 'Published',
    className: 'admin-status-badge--published',
  },
  ACTIVE: {
    labelVi: 'Đang hoạt động',
    labelEn: 'Active',
    className: 'admin-status-badge--active',
  },
  REJECTED: {
    labelVi: 'Từ chối',
    labelEn: 'Rejected',
    className: 'admin-status-badge--rejected',
  },
  LOCKED: {
    labelVi: 'Đã khóa',
    labelEn: 'Locked',
    className: 'admin-status-badge--locked',
  },
  ARCHIVED: {
    labelVi: 'Lưu trữ',
    labelEn: 'Archived',
    className: 'admin-status-badge--archived',
  },
  DISABLED: {
    labelVi: 'Vô hiệu hóa',
    labelEn: 'Disabled',
    className: 'admin-status-badge--disabled',
  },
  INACTIVE: {
    labelVi: 'Chưa kích hoạt',
    labelEn: 'Inactive',
    className: 'admin-status-badge--inactive',
  },
};

export function AdminStatusBadge({ status, labelVi, labelEn, showDot = true, size = 'md', className = '' }) {
  const normalizedKey = String(status || '').toUpperCase().trim();
  const config = STATUS_CONFIGS[normalizedKey] || {
    labelVi: labelVi || status || '—',
    labelEn: labelEn || status || '—',
    className: 'admin-status-badge--default',
  };

  const resolvedVi = labelVi || config.labelVi;
  const resolvedEn = labelEn || config.labelEn;

  return (
    <span className={`admin-status-badge ${config.className} admin-status-badge--${size} ${className}`.trim()}>
      {showDot && <span className="admin-status-badge__dot" aria-hidden="true" />}
      <span className="admin-status-badge__text">
        <BilingualText vi={resolvedVi} en={resolvedEn} />
      </span>
    </span>
  );
}

export default AdminStatusBadge;

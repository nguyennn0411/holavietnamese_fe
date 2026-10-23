import { BilingualText, useBilingualLabel } from '@/components/common/BilingualText';
import { destinationDate, DESTINATION_REGIONS } from '@/models/Destination';

export function DestinationRegion({ value }) {
  const region = DESTINATION_REGIONS.find(item => item.value === value);
  return region ? (
    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>
      📍 <BilingualText vi={region.vi} en={region.en} />
    </span>
  ) : (
    value || '—'
  );
}

export function DestinationStatusBadge({ status }) {
  const label = useBilingualLabel();
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    height: '28px',
    padding: '0 11px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    lineHeight: 1,
  };

  switch (status) {
    case 'PUBLISHED':
      return (
        <span
          style={{
            ...baseStyle,
            background: '#dcfce7',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
          <span>{label('Đã xuất bản', 'Published')}</span>
        </span>
      );
    case 'PENDING_REVIEW':
    case 'IN_REVIEW':
      return (
        <span
          style={{
            ...baseStyle,
            background: '#e0f2fe',
            color: '#0369a1',
            border: '1px solid #bae6fd',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7', display: 'inline-block' }} />
          <span>{label('Chờ duyệt', 'Pending Review')}</span>
        </span>
      );
    case 'DRAFT':
      return (
        <span
          style={{
            ...baseStyle,
            background: '#fef3c7',
            color: '#b45309',
            border: '1px solid #fde68a',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706', display: 'inline-block' }} />
          <span>{label('Bản nháp', 'Draft')}</span>
        </span>
      );
    case 'ARCHIVED':
      return (
        <span
          style={{
            ...baseStyle,
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
          <span>{label('Đã lưu trữ', 'Archived')}</span>
        </span>
      );
    default:
      return (
        <span
          style={{
            ...baseStyle,
            background: '#f1f5f9',
            color: '#475569',
            border: '1px solid #e2e8f0',
          }}
        >
          <span>{status}</span>
        </span>
      );
  }
}

export function DestinationMetadata({ entry }) {
  return (
    <dl>
      <dt>ID</dt>
      <dd>{entry.id}</dd>
      <dt><BilingualText vi="Ngày xuất bản" en="Published Date" /></dt>
      <dd>{destinationDate(entry.publishedAt)}</dd>
      <dt><BilingualText vi="Ngày lưu trữ" en="Archived Date" /></dt>
      <dd>{destinationDate(entry.archivedAt)}</dd>
      <dt><BilingualText vi="Ngày tạo" en="Created Date" /></dt>
      <dd>{destinationDate(entry.createdAt)}</dd>
      <dt><BilingualText vi="Cập nhật lần cuối" en="Last Updated" /></dt>
      <dd>{destinationDate(entry.updatedAt)}</dd>
    </dl>
  );
}

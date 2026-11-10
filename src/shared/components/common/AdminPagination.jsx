import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBilingualLabel } from '@/shared/components/common/BilingualText';

export function AdminPagination({
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  style = {},
}) {
  const label = useBilingualLabel();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems <= 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderTop: '1px solid rgba(15, 23, 42, 0.08)',
        background: '#ffffff',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '13px',
        ...style,
      }}
    >
      <div style={{ color: 'var(--color-forest, #64748B)', fontSize: '13px', fontWeight: 500 }}>
        {label(
          `Hiển thị ${startItem} – ${endItem} trong tổng số ${totalItems} mục`,
          `Showing ${startItem} – ${endItem} of ${totalItems} items`
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Previous button */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            height: '32px',
            padding: '0 10px',
            borderRadius: '7px',
            border: '1px solid #e2e8f0',
            background: currentPage <= 1 ? '#f8fafc' : '#ffffff',
            color: currentPage <= 1 ? '#94a3b8' : '#334155',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
          title={label('Trang trước', 'Previous page')}
        >
          <ChevronLeft size={14} />
          <span>{label('Trước', 'Prev')}</span>
        </button>

        {/* Number buttons */}
        {pageNumbers.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  color: '#94a3b8',
                  fontSize: '13px',
                }}
              >
                …
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '32px',
                height: '32px',
                padding: '0 6px',
                borderRadius: '7px',
                border: isActive ? '1px solid #ea580c' : '1px solid #e2e8f0',
                background: isActive ? '#fff7ed' : '#ffffff',
                color: isActive ? '#ea580c' : '#334155',
                fontSize: '12.5px',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {p}
            </button>
          );
        })}

        {/* Next button */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            height: '32px',
            padding: '0 10px',
            borderRadius: '7px',
            border: '1px solid #e2e8f0',
            background: currentPage >= totalPages ? '#f8fafc' : '#ffffff',
            color: currentPage >= totalPages ? '#94a3b8' : '#334155',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
          title={label('Trang sau', 'Next page')}
        >
          <span>{label('Sau', 'Next')}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

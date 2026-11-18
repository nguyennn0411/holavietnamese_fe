import { Search, X } from 'lucide-react';
import { useBilingualLabel } from '@/shared/components/common/BilingualText';

export function AdminSearchBar({
  value = '',
  onChange,
  onClear,
  onSubmit,
  placeholderVi = 'Tìm kiếm...',
  placeholderEn = 'Search...',
  maxWidth = '360px',
  className = '',
  autoFocus = false,
}) {
  const label = useBilingualLabel();
  const placeholder = label(placeholderVi, placeholderEn);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (onClear) onClear();
      else if (onChange) onChange('');
    } else if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  const handleClear = () => {
    if (onClear) onClear();
    else if (onChange) onChange('');
  };

  return (
    <div className={`admin-search-bar ${className}`.trim()} style={{ maxWidth }}>
      <Search size={16} className="admin-search-bar__icon" aria-hidden="true" />
      <input
        type="text"
        className="admin-search-bar__input"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus={autoFocus}
      />
      {value && (
        <button
          type="button"
          className="admin-search-bar__clear"
          onClick={handleClear}
          aria-label={label('Xóa tìm kiếm', 'Clear search')}
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

export default AdminSearchBar;

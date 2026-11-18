import { BilingualText } from '@/shared/components/common/BilingualText';

export function AdminSwitchToggle({
  checked = false,
  onChange,
  disabled = false,
  labelVi,
  labelEn,
  descriptionVi,
  descriptionEn,
  id,
  className = '',
}) {
  const handleToggle = () => {
    if (disabled || !onChange) return;
    onChange(!checked);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`admin-switch-container ${disabled ? 'is-disabled' : ''} ${className}`.trim()}>
      <div
        id={id}
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`admin-switch-toggle ${checked ? 'is-checked' : ''}`}
      >
        <span className="admin-switch-toggle__thumb" />
      </div>
      {(labelVi || labelEn || descriptionVi || descriptionEn) && (
        <div className="admin-switch-content" onClick={handleToggle}>
          {(labelVi || labelEn) && (
            <span className="admin-switch-label">
              <BilingualText vi={labelVi} en={labelEn} />
            </span>
          )}
          {(descriptionVi || descriptionEn) && (
            <span className="admin-switch-desc">
              <BilingualText vi={descriptionVi} en={descriptionEn} />
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminSwitchToggle;

import React from 'react';

/**
 * AuthRightPanel - Renders the exact Dong Son Heritage artwork uploaded by user
 * Used across Login, Register, Forgot Password, and Reset Password.
 */
export function AuthRightPanel({
  imageSrc = '/design/auth/dongson_auth_clean.png',
  alt = 'Trống đồng Đông Sơn - Vietnamese for real life',
}) {
  return (
    <aside className="auth-right-panel" aria-label="HolaVietnamese Cultural Heritage">
      <img
        src={imageSrc}
        alt={alt}
        className="auth-right-hero-image"
        loading="eager"
        decoding="async"
      />
    </aside>
  );
}

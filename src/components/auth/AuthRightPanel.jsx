import { bilingualLabel } from '@/components/common/BilingualText';
import React from 'react';
import dongsonHeritage from '@/assets/images/dongson_heritage.png';

/**
 * AuthRightPanel - Authentic Vietnamese Dong Son Cultural Heritage Showcase
 * Full-bleed edge-to-edge background display of dongson_heritage.png covering
 * the entire right half of the screen. Zero text, zero frames, pure cultural immersion.
 * Shared across Login, Register, Forgot Password, Reset Password, and Verify Email.
 */
export function AuthRightPanel({
  imageSrc = dongsonHeritage,
  alt = bilingualLabel('Hoa văn Trống đồng Đông Sơn - Tinh hoa di sản văn hóa Việt Nam', 'Dong Son drum patterns - Vietnamese cultural heritage'),
}) {
  return (
    <aside
      className="auth-right-panel"
      role="img"
      aria-label={alt}
      style={{ backgroundImage: `url(${imageSrc})` }}
    />
  );
}

export default AuthRightPanel;

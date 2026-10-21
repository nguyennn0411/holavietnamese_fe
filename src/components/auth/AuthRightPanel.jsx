import React from 'react';
import dongsonHeritage from '@/assets/images/dongson_heritage.png';
import { BilingualText } from '@/components/common/BilingualText';

/**
 * AuthRightPanel - Authentic Vietnamese Dong Son Cultural Heritage Showcase
 * Showcases the authentic Half Dong Son drum motif from dongson_heritage.png
 * on an inviting light cream background with balanced cultural typography.
 * Shared across Login, Register, Forgot Password, Reset Password, and Verify Email.
 */
export function AuthRightPanel({
  imageSrc = dongsonHeritage,
  alt = 'Họa tiết Nửa Trống đồng Đông Sơn - Tinh hoa di sản văn hóa Việt Nam',
  showCaption = true,
}) {
  return (
    <aside className="auth-right-panel" aria-label={alt}>
      <div className="auth-right-content">
        <div className="auth-drum-frame">
          <img
            src={imageSrc}
            alt={alt}
            className="auth-right-hero-image"
            loading="eager"
            decoding="async"
          />
        </div>

        {showCaption && (
          <div className="auth-heritage-caption">
            <span className="auth-heritage-badge">
              <BilingualText vi="DI SẢN VĂN HÓA ĐÔNG SƠN" en="DONG SON CULTURAL HERITAGE" />
            </span>
            <h2 className="auth-heritage-title">
              <BilingualText vi="Hồn cốt ngàn năm văn hiến" en="Echoes of Ancient Vietnam" />
            </h2>
            <p className="auth-heritage-desc">
              <BilingualText
                vi="Khám phá tiếng Việt qua chiều sâu bản sắc và văn hóa truyền thống."
                en="Learn Vietnamese through the richness of its living history and culture."
              />
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default AuthRightPanel;

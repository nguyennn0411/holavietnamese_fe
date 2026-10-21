import React from 'react';
import dongSonDrum from '/design/auth/dong-son-drum.webp';
import { BilingualText } from '@/components/common/BilingualText';

/**
 * AuthRightPanel - Premium Vietnamese Dong Son Cultural Heritage Showcase
 * Renders complete authentic Dong Son drum circle with ambient cultural geometry
 * and bilingual heritage framing.
 * Used across Login, Register, Forgot Password, Reset Password, and Verify Email.
 */
export function AuthRightPanel({
  imageSrc = dongSonDrum,
  alt = 'Hoa văn Trống đồng Đông Sơn - Tinh hoa di sản văn hóa Việt Nam',
  showCaption = true,
}) {
  return (
    <aside className="auth-right-panel" aria-label={alt}>
      {/* Decorative ambient background with concentric circular motifs */}
      <div className="auth-right-ambient" aria-hidden="true">
        <span className="auth-ambient-ring auth-ambient-ring-1" />
        <span className="auth-ambient-ring auth-ambient-ring-2" />
        <span className="auth-ambient-ring auth-ambient-ring-3" />
      </div>

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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import { DongSonDrum } from '@/presentation/components/DongSonDrum';
import '@/presentation/styles/auth.css';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus({ loading: true, message: '', error: '' });

    try {
      const res = await learnerService.forgotPassword(email);
      setStatus({ loading: false, message: res.message || 'Đã gửi hướng dẫn đặt lại mật khẩu!', error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message || 'Có lỗi xảy ra.' });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <div className="auth-brand-row">
            <div className="auth-brand-logo">
              <span className="auth-logo-text">H</span>
              <span className="auth-logo-star">★</span>
            </div>
            <span className="auth-brand-name">HolaVietnamese</span>
            <span className="auth-brand-badge">ĐỐNG SƠN POP</span>
          </div>

          <div className="auth-welcome-pill">
            <span className="auth-welcome-code">🔑</span>
            <span className="auth-welcome-text">Khôi phục mật khẩu</span>
          </div>

          <h1 className="auth-heading">Quên mật khẩu?</h1>
          <p className="auth-subtitle">
            Nhập email tài khoản của bạn, chúng tôi sẽ gửi liên kết khôi phục để tạo mật khẩu mới.
          </p>

          {status.error && <div className="auth-message auth-message-error">{status.error}</div>}
          {status.message && <div className="auth-message auth-message-success">{status.message}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Địa chỉ Email</label>
              <input
                className="auth-input"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={status.loading}
            >
              {status.loading ? 'Đang gửi yêu cầu…' : 'Gửi liên kết khôi phục'}
            </button>
          </form>

          <p className="auth-footer-text">
            Nhớ lại mật khẩu rồi? <Link to="/login" className="auth-footer-link">Quay lại đăng nhập</Link>
          </p>
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="auth-drum-bg">
          <DongSonDrum className="auth-drum-svg" />
        </div>
        <div className="auth-hero-card">
          <div className="auth-hero-tag">HỖ TRỢ TÀI KHOẢN</div>
          <h2 className="auth-hero-title">Đừng lo, hành trình vẫn tiếp tục.</h2>
          <p className="auth-hero-desc">
            Chỉ với một bước xác nhận qua email, bạn sẽ đặt lại mật khẩu an toàn và tiếp tục chinh phục tiếng Việt.
          </p>
        </div>
      </div>
    </div>
  );
}

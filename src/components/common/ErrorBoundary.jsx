import React from 'react';
import { Link } from 'react-router-dom';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <span style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 8px 0' }}>
            Đã xảy ra lỗi giao diện
          </h2>
          <p style={{ color: 'var(--color-muted)', maxWidth: '460px', margin: '0 0 24px 0', fontSize: '0.9rem' }}>
            {this.state.error?.message || 'Có sự cố phát sinh khi tải thành phần này. Vui lòng thử tải lại trang.'}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: 'var(--color-surface)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🔄 Tải lại trang
            </button>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--color-red-hover)',
                color: 'var(--color-surface)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Về Trang chủ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

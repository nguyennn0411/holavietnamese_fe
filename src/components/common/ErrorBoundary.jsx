import { BilingualText } from '@/components/common/BilingualText';
import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

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
        <main className="fatal-error" role="alert">
          <span className="fatal-error__icon"><AlertTriangle size={28}/></span>
          <p className="eyebrow">HOLA VIETNAMESE</p>
          <h1><BilingualText>{"Đã xảy ra lỗi giao diện"}</BilingualText></h1>
          <p>
            <BilingualText>{this.state.error?.message || 'Có sự cố phát sinh khi tải thành phần này. Vui lòng thử tải lại trang.'}</BilingualText>
          </p>
          <div className="actions">
            <button type="button" className="secondary" onClick={() => window.location.reload()}><RefreshCw size={16}/><BilingualText>{"Tải lại trang"}</BilingualText></button>
            <button type="button" onClick={this.handleReset}><Home size={16}/><BilingualText>{"Về Trang chủ"}</BilingualText></button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

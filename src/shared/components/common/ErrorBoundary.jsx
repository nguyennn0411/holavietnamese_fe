import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import React from 'react';
import { AlertTriangle, Home, RefreshCw, Copy, Check } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, copied: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    try {
      sessionStorage.setItem(
        'hola:last_error',
        JSON.stringify({
          message: error?.message,
          stack: error?.stack,
          componentStack: errorInfo?.componentStack,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore storage errors
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleCopyError = () => {
    const { error, errorInfo } = this.state;
    const text = [
      `Error: ${error?.name}: ${error?.message}`,
      `Stack:\n${error?.stack || 'N/A'}`,
      `Component Stack:\n${errorInfo?.componentStack || 'N/A'}`,
    ].join('\n\n');
    navigator.clipboard?.writeText(text);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, copied } = this.state;
      return (
        <main className="fatal-error" role="alert" style={{ maxWidth: '680px', margin: '40px auto', padding: '24px' }}>
          <span className="fatal-error__icon"><AlertTriangle size={36} className="text-amber-500" /></span>
          <p className="eyebrow font-bold tracking-wider text-[#EA580C]">HOLA VIETNAMESE</p>
          <h1 className="text-2xl font-black text-[#253044] mt-1 mb-2">
            <BilingualText vi="Đã xảy ra lỗi giao diện" en="Something went wrong with the interface" />
          </h1>
          <p className="text-sm text-[#64748B] mb-4">
            <BilingualText
              vi="Có sự cố kỹ thuật phát sinh khi hiển thị trang này. Bạn có thể tải lại trang hoặc quay về trang chủ."
              en="A technical error occurred while rendering this interface. You can reload the page or return to the home page."
            />
          </p>

          {error?.message && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl p-3 text-left font-mono break-all mb-4">
              <strong>{error.name || 'Error'}:</strong> {error.message}
            </div>
          )}

          <div className="actions flex items-center justify-center gap-3 mb-6">
            <button
              type="button"
              className="secondary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={15} />
              <BilingualText vi="Tải lại trang" en="Reload page" />
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold hover:bg-[#C2410C]"
              onClick={this.handleReset}
            >
              <Home size={15} />
              <BilingualText vi="Về Trang chủ" en="Back to home" />
            </button>
          </div>

          {(error?.stack || errorInfo?.componentStack) && (
            <details className="text-left bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs">
              <summary className="font-bold cursor-pointer text-stone-700 hover:text-[#EA580C] select-none flex items-center justify-between">
                <span>
                  <BilingualText vi="Chi tiết lỗi kỹ thuật (dành cho lập trình viên)" en="Technical error details (for developers)" />
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleCopyError();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white border border-stone-300 hover:bg-stone-100"
                >
                  {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copied ? bilingualLabel("Đã sao chép", "Copied") : bilingualLabel("Sao chép", "Copy")}</span>
                </button>
              </summary>
              <pre className="mt-3 p-2 bg-stone-900 text-stone-100 rounded-lg overflow-x-auto text-[11px] leading-relaxed max-h-60 whitespace-pre-wrap">
                {error?.stack}
                {errorInfo?.componentStack ? `\n\nComponent Stack:${errorInfo.componentStack}` : ''}
              </pre>
            </details>
          )}
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

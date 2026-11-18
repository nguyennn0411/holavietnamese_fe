import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import React from 'react';
import { AlertTriangle, Home, RefreshCw, Copy, Check, ChevronDown } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, copied: false, isOpen: false };
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
        <div
          role="alert"
          className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6"
          style={{
            background: 'radial-gradient(circle at 50% 30%, #FFFFFF, #FAF7F2 65%, #F4EFE6 100%)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-10 text-center relative overflow-hidden transition-all duration-300"
            style={{
              border: '1px solid rgba(234, 88, 12, 0.12)',
              boxShadow: '0 20px 50px -12px rgba(234, 88, 12, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
            }}
          >
            {/* Top decorative gradient bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{
                background: 'linear-gradient(90deg, #FBBF24 0%, #EA580C 50%, #F97316 100%)',
              }}
            />

            {/* Warning Icon with soft glow */}
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: '1px solid #FDE68A',
                boxShadow: '0 8px 18px -4px rgba(245, 158, 11, 0.2)',
              }}
            >
              <AlertTriangle size={32} className="text-[#D97706]" strokeWidth={2.2} />
            </div>

            {/* Brand Eyebrow Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3"
              style={{
                backgroundColor: '#FFF7ED',
                border: '1px solid #FFEDD5',
                color: '#EA580C',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
              HOLA VIETNAMESE
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              <BilingualText vi="Đã xảy ra sự cố giao diện" en="Something went wrong with the interface" />
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
              <BilingualText
                vi="Có lỗi phát sinh khi xử lý giao diện. Bạn có thể tải lại trang hoặc quay về trang chủ để tiếp tục."
                en="A technical error occurred while rendering this interface. You can reload the page or return to the home page."
              />
            </p>

            {/* Error Message Box (if present) */}
            {error?.message && (
              <div
                className="rounded-2xl p-3.5 text-left font-mono break-all mb-6 flex items-start gap-2.5"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  color: '#991B1B',
                }}
              >
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5"
                  style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}
                >
                  {error.name || 'Error'}
                </span>
                <span className="text-xs leading-relaxed select-all text-slate-800">
                  {error.message}
                </span>
              </div>
            )}

            {/* Actions Button Group */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 w-full">
              {/* Secondary Button: Reload page */}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
                style={{
                  minHeight: '44px',
                  padding: '10px 22px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  color: '#334155',
                  boxShadow: '0 2px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF7ED';
                  e.currentTarget.style.borderColor = '#FED7AA';
                  e.currentTarget.style.color = '#EA580C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.color = '#334155';
                }}
              >
                <RefreshCw size={16} className="text-slate-400 group-hover:text-[#EA580C] group-hover:rotate-45 transition-transform duration-300" />
                <span><BilingualText vi="Tải lại trang" en="Reload page" /></span>
              </button>

              {/* Primary Button: Back to home */}
              <button
                type="button"
                onClick={this.handleReset}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98] cursor-pointer"
                style={{
                  minHeight: '44px',
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 20px -4px rgba(234, 88, 12, 0.38)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(234, 88, 12, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(234, 88, 12, 0.38)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Home size={16} className="text-white/90 group-hover:scale-110 transition-transform duration-200" />
                <span><BilingualText vi="Về trang chủ" en="Back to home" /></span>
              </button>
            </div>

            {/* Developer Technical Details Drawer */}
            {(error?.stack || errorInfo?.componentStack) && (
              <details className="text-left rounded-2xl p-3.5 text-xs transition-all w-full border border-slate-200/80 bg-slate-50/70">
                <summary className="font-semibold cursor-pointer text-slate-600 hover:text-slate-900 select-none flex items-center justify-between gap-3 list-none">
                  <div className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <BilingualText vi="Chi tiết lỗi kỹ thuật (dành cho lập trình viên)" en="Technical error details (for developers)" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      this.handleCopyError();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 cursor-pointer shadow-sm"
                    style={{
                      minHeight: '28px',
                      height: '28px',
                      padding: '2px 10px',
                      backgroundColor: copied ? '#ECFDF5' : '#FFFFFF',
                      border: copied ? '1px solid #6EE7B7' : '1px solid #CBD5E1',
                      color: copied ? '#047857' : '#475569',
                    }}
                    onMouseEnter={(e) => {
                      if (!copied) {
                        e.currentTarget.style.backgroundColor = '#FFF7ED';
                        e.currentTarget.style.borderColor = '#FDBA74';
                        e.currentTarget.style.color = '#EA580C';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!copied) {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.color = '#475569';
                      }
                    }}
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-emerald-600" strokeWidth={2.5} />
                        <span>{bilingualLabel('Đã sao chép!', 'Copied!')}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} className="text-slate-400 group-hover:text-[#EA580C]" />
                        <span>{bilingualLabel('Sao chép mã lỗi', 'Copy error')}</span>
                      </>
                    )}
                  </button>
                </summary>
                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto text-[11px] leading-relaxed max-h-60 whitespace-pre-wrap font-mono selection:bg-orange-500/30">
                    {error?.stack}
                    {errorInfo?.componentStack ? `\n\nComponent Stack:${errorInfo.componentStack}` : ''}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

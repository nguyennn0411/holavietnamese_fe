import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { courseService } from '@/services/courseService';
import { Play, AlertCircle } from 'lucide-react';

export function EnrollButton({ courseId, enrollment, onEnrolled }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  async function enroll() {
    setPending(true);
    setError(null);
    try {
      const result = await courseService.enroll(courseId);
      if (!result?.isEnrolled) {
        throw new Error(bilingualLabel('Đăng ký khóa học chưa hoàn tất. Vui lòng thử lại.', 'Course enrollment incomplete. Please try again.'));
      }
      onEnrolled?.(result);
    } catch (e) {
      setError(e);
    } finally {
      setPending(false);
    }
  }

  if (enrollment?.isEnrolled) {
    return (
      <Link
        className="button inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#FF7A00] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all no-underline"
        to={`/learn/${courseId}`}
      >
        <Play size={15} fill="white" />
        <BilingualText>{"Tiếp tục học →"}</BilingualText>
      </Link>
    );
  }

  return (
    <div className="enroll-button-container space-y-2">
      <button
        type="button"
        disabled={pending}
        aria-busy={pending}
        onClick={enroll}
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#FF7A00] hover:bg-[#EA580C] disabled:bg-[#FF7A00]/60 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
      >
        {pending ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <BilingualText>{"Đang đăng ký…"}</BilingualText>
          </>
        ) : (
          <>
            <Play size={15} fill="currentColor" />
            <BilingualText>{"Đăng ký học ngay"}</BilingualText>
          </>
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="text-xs text-rose-600 font-semibold flex items-center justify-center gap-1.5 p-2 rounded-xl bg-rose-50 border border-rose-200"
        >
          <AlertCircle size={14} className="shrink-0" />
          <BilingualText>{error.message || 'Không thể đăng ký.'}</BilingualText>
          {error.status === 401 && (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="text-[#FF7A00] underline ml-1 font-bold"
            >
              <BilingualText>{"Đăng nhập"}</BilingualText>
            </Link>
          )}
        </p>
      )}
    </div>
  );
}

export default EnrollButton;

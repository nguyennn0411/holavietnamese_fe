import { useCallback, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { sessionService } from "@/services/sessionService";
import { BilingualText } from "./BilingualText";
export const levels = ["A0", "A1", "A2", "B1", "B2", "C1"];
export const statuses = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"];
export function useLoad(loader, deps = []) {
  return useAsyncResource(useCallback(loader, deps));
}
export function State({ resource, children }) {
  if (resource.loading)
    return (
      <div className="m2-grid" aria-label="Loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="m2-skeleton" />
        ))}
      </div>
    );
  if (resource.error)
    return (
      <div className="m2-empty" role="alert">
        <h2>
          <BilingualText vi={resource.error.code === "LESSON_LOCKED" ? "Bài học đã khóa" : "Không thể tải nội dung"} en={resource.error.code === "LESSON_LOCKED" ? "Lesson locked" : "Unable to load content"} variant="title" />
        </h2>
        <p>
          {resource.error.code === "LESSON_LOCKED"
            ? <BilingualText vi="Hoàn thành các bài học tiên quyết trước." en="Complete the prerequisite lessons first." />
            : <BilingualText vi="Không thể hoàn tất yêu cầu. Hãy thử lại." en={resource.error.message} />}
        </p>
        {resource.error.status === 401 ? (
          <Link className="button" to="/login">
            <BilingualText vi="Đăng nhập" en="Sign in" variant="caption" />
          </Link>
        ) : (
          <button onClick={resource.reload}>
            <BilingualText vi="Thử lại" en="Retry" variant="caption" />
          </button>
        )}
      </div>
    );
  return children(resource.data);
}
export function Pagination({ data, onChange }) {
  return (
    <div className="m2-pagination">
      <span>
        <BilingualText
          vi={`${data.totalElements} kết quả · Trang ${data.page + 1} / ${Math.max(1, data.totalPages)}`}
          en={`${data.totalElements} results · Page ${data.page + 1} of ${Math.max(1, data.totalPages)}`}
          variant="caption"
        />
      </span>
      <button
        className="secondary"
        disabled={data.first}
        onClick={() => onChange(data.page - 1)}
      >
        <ArrowLeft size={16} />{" "}
        <BilingualText vi="Trước" en="Previous" variant="caption" />
      </button>
      <button
        className="secondary"
        disabled={data.last}
        onClick={() => onChange(data.page + 1)}
      >
        <BilingualText vi="Tiếp" en="Next" variant="caption" />{" "}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
export function Badge({ children }) {
  return (
    <span
      className={`m2-badge ${children === "PUBLISHED" || children === "COMPLETED" ? "good" : ""}`}
    >
      {typeof children === "string" ? children.replaceAll("_", " ") : children}
    </span>
  );
}
export function Progress({ value = 0 }) {
  return (
    <div
      className="m2-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
export function Empty({
  children = (
    <BilingualText vi="Không tìm thấy kết quả." en="No results found." />
  ),
}) {
  return (
    <div className="m2-empty">
      <BookOpen size={32} />
      <p>{children}</p>
    </div>
  );
}
export function Field({ label, children }) {
  return (
    <label className="m2-field">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Select({ label, values, value, onChange, all = true }) {
  return (
    <Field label={label}>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {all && <option value="">All</option>}
        {values.map((v) => (
          <option
            key={typeof v === "string" ? v : v.value}
            value={typeof v === "string" ? v : v.value}
          >
            {typeof v === "string" ? v.replaceAll("_", " ") : v.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
export function AdminGuard({ children }) {
  const location = useLocation();
  const session = useLoad(() => sessionService.current(), []);
  if (session.loading) return <p>Checking session…</p>;
  if (session.error?.status === 401)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (session.error) return <State resource={session}>{() => null}</State>;
  if (session.data.role !== "ADMIN")
    return <Empty>Administrator access required.</Empty>;
  return children;
}
export function AdminNav() {
  return (
    <nav className="m2-tabs" aria-label="Content administration">
      {[
        "courses",
        "lessons",
        "grammar",
        "questions",
        "quizzes",
        "quiz-attempts",
      ].map((t) => (
        <Link key={t} to={`/admin/${t}`}>
          {t.replaceAll("-", " ")}
        </Link>
      ))}
    </nav>
  );
}
export function useAction(reload) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return {
    busy,
    error,
    run: async (fn) => {
      setBusy(true);
      setError("");
      try {
        const result = await fn();
        reload?.();
        return result;
      } catch (e) {
        if (!e.cancelled) setError(e.message);
        return undefined;
      } finally {
        setBusy(false);
      }
    },
  };
}

import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { ROUTES } from '@/constants/routes';
const groups = [
  { title: 'Tổng quan', links: [[ROUTES.ADMIN, 'Dashboard'], [ROUTES.ADMIN_USERS, 'Người dùng']] },
  { title: 'Nội dung học tập', links: [['/admin/courses', 'Khóa học'], ['/admin/lessons', 'Bài học'], [ROUTES.ADMIN_VOCABULARY, 'Từ vựng'],[ROUTES.ADMIN_VOCABULARY_TOPICS, 'Chủ đề từ vựng'], ['/admin/questions', 'Ngân hàng câu hỏi'], ['/admin/quizzes', 'Quiz']] },
  { title: 'Văn hóa & AI', links: [[ROUTES.ADMIN_CULTURE, 'Văn hóa'], [ROUTES.ADMIN_CULTURE_CATEGORIES, 'Danh mục văn hóa'], [ROUTES.ADMIN_AI_SCENARIOS, 'Kịch bản AI'], [ROUTES.ADMIN_AI_SETTINGS, 'Cấu hình AI'], [ROUTES.ADMIN_AI_USAGE, 'Sử dụng AI & chi phí'], [ROUTES.ADMIN_AI_REVIEWS, 'Chất lượng AI']] },
  { title: 'Hệ thống', links: [[ROUTES.ADMIN_ACHIEVEMENTS, 'Thành tích'], [ROUTES.ADMIN_XP_RULES, 'Quy tắc XP'], [ROUTES.ADMIN_ROLES, 'Vai trò & phân quyền'], [ROUTES.ADMIN_AUDIT_LOGS, 'Nhật ký hệ thống'], [ROUTES.ADMIN_SETTINGS, 'Cài đặt']] },
];
export function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const sidebar = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const controls = () => [...sidebar.current.querySelectorAll('a,button:not(:disabled)')];
    controls()[0]?.focus();
    const keydown = event => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Tab') {
        const items = controls(), first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.removeEventListener('keydown', keydown); previous?.focus(); };
  }, [open]);
  const location = useLocation();
  const current = groups.flatMap(group => group.links).find(([to]) => location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to + '/')))?.[1] || 'Quản trị nội dung';
  return <div className={`admin-wrapper ${open ? 'admin-menu-open' : ''}`}>
    <a className="skip-link" href="#admin-content">Chuyển đến nội dung chính</a>
    <aside ref={sidebar} id="admin-navigation" className="admin-sidebar">
      <Link to="/admin" className="admin-sidebar-header">hola admin<span>CONTENT & LEARNING</span></Link>
      <nav className="admin-nav" aria-label="Điều hướng quản trị">{groups.map(group => <div className="admin-nav-group" key={group.title}><p>{group.title}</p>{group.links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/admin'} onClick={() => setOpen(false)} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>{label}</NavLink>)}</div>)}</nav>
      <div className="admin-sidebar-footer"><Link to="/">← Giao diện học viên</Link><button className="admin-logout" onClick={logout}>Đăng xuất</button></div>
    </aside>
    {open && <button className="admin-menu-backdrop" aria-label="Đóng menu" onClick={() => setOpen(false)} />}
    <div className="admin-main-area"><header className="admin-topbar"><button className="mobile-menu-button secondary" aria-label="Mở menu quản trị" aria-controls="admin-navigation" aria-expanded={open} onClick={() => setOpen(value => !value)}>☰</button><span>Quản trị / <strong>{current}</strong></span><span className="admin-identity">{user?.fullName || user?.username || 'Quản trị viên'} <span className="badge">ADMIN</span></span></header><main className="admin-content" id="admin-content"><Outlet /></main></div>
  </div>;
}

import { BilingualText, bilingualLabel, useTextLanguage } from '@/shared/components/common/BilingualText';
import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Menu,
  X,
  ArrowLeft,
  LogOut,
  Home,
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  Languages,
  HelpCircle,
  CheckSquare,
  Compass,
  Landmark,
  FolderTree,
  Sparkles,
  Trophy,
  Zap,
  ShieldCheck,
  History,
  LayoutGrid,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { PageTransition } from '@/shared/components/common/PageTransition';
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher';
import { canReadExplore, canReadVocabulary, canReadCulture } from '@/utils/permissions/contentAccess';

const groups = [
  {
    title: 'Tổng quan',
    titleEn: 'Overview',
    links: [
      [ROUTES.ADMIN, 'Dashboard', 'Dashboard', LayoutDashboard],
      [ROUTES.ADMIN_USERS, 'Người dùng', 'Users', Users],
    ],
  },
  {
    title: 'Nội dung học tập',
    titleEn: 'Learning Content',
    links: [
      [ROUTES.CONTENT_COURSES, 'Khóa học', 'Courses', BookOpen],
      [ROUTES.CONTENT_LESSONS, 'Bài học', 'Lessons', Layers],
      [ROUTES.ADMIN_VOCABULARY, 'Từ vựng', 'Vocabulary', Languages],
      [ROUTES.CONTENT_QUESTIONS, 'Ngân hàng câu hỏi', 'Question Bank', HelpCircle],
      [ROUTES.CONTENT_QUIZZES, 'Quiz', 'Quizzes', CheckSquare],
    ],
  },
  {
    title: 'Văn hóa & AI',
    titleEn: 'Culture & AI',
    links: [
      [ROUTES.ADMIN_DESTINATIONS, 'Điểm đến', 'Destinations', Compass],
      [ROUTES.ADMIN_CULTURE, 'Văn hóa', 'Culture', Landmark],
      [ROUTES.ADMIN_CULTURE_CATEGORIES, 'Danh mục văn hóa', 'Culture Categories', FolderTree],
      [ROUTES.ADMIN_AI_SCENARIOS, 'Kịch bản AI', 'AI Scenarios', Sparkles],
    ],
  },
  {
    title: 'Hệ thống',
    titleEn: 'System',
    links: [
      [ROUTES.ADMIN_ACHIEVEMENTS, 'Thành tích', 'Achievements', Trophy],
      [ROUTES.ADMIN_XP_RULES, 'Quy tắc XP', 'XP Rules', Zap],
      [ROUTES.ADMIN_ROLES, 'Vai trò & phân quyền', 'Roles & Permissions', ShieldCheck],
      [ROUTES.ADMIN_AUDIT_LOGS, 'Nhật ký hệ thống', 'Audit Logs', History],
      [ROUTES.ADMIN_SITE_CONTENT, 'Menu & banner', 'Menus & Banners', LayoutGrid],
      [ROUTES.ADMIN_SETTINGS, 'Cài đặt', 'Settings', Settings],
    ],
  },
];

export function AdminLayout() {
  useTextLanguage();
  const { user, logout, isAdmin, isContentManager } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const sidebar = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

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

  const vocabularyAllowed = canReadVocabulary(user);
  const exploreAllowed = canReadExplore(user);
  const cultureAllowed = canReadCulture(user);
  const managerAuthoringPaths = [ROUTES.CONTENT_COURSES, ROUTES.CONTENT_LESSONS, ROUTES.CONTENT_QUESTIONS, ROUTES.CONTENT_QUIZZES];

  const visibleGroups = groups.map(group => {
    let groupTitle = group.title;
    let groupTitleEn = group.titleEn;
    if (isContentManager && !isAdmin && group.title === 'Văn hóa & AI') {
      groupTitle = 'Văn hóa';
      groupTitleEn = 'Culture';
    }
    return {
      ...group,
      title: groupTitle,
      titleEn: groupTitleEn,
      links: group.links.filter(([to]) => {
        if (to === ROUTES.ADMIN_VOCABULARY) return vocabularyAllowed;
        if (to === ROUTES.ADMIN_DESTINATIONS) return exploreAllowed;
        if (to === ROUTES.CONTENT_CULTURE || to === ROUTES.CONTENT_CULTURE_CATEGORIES || to === ROUTES.ADMIN_CULTURE || to === ROUTES.ADMIN_CULTURE_CATEGORIES) return cultureAllowed;
        if (managerAuthoringPaths.includes(to)) {
          return to === ROUTES.CONTENT_COURSES ? (isAdmin || isContentManager) : (isContentManager && !isAdmin);
        }
        return isAdmin;
      }).map(([to, labelVi, labelEn, Icon]) => {
        let finalTo = to;
        if (isAdmin) {
          if (to === ROUTES.CONTENT_COURSES) finalTo = ROUTES.ADMIN_COURSES;
        } else if (isContentManager && !isAdmin) {
          if (to === ROUTES.ADMIN_CULTURE) finalTo = ROUTES.CONTENT_CULTURE;
          if (to === ROUTES.ADMIN_CULTURE_CATEGORIES) finalTo = ROUTES.CONTENT_CULTURE_CATEGORIES;
          if (to === ROUTES.ADMIN_VOCABULARY) finalTo = ROUTES.CONTENT_VOCABULARY;
          if (to === ROUTES.ADMIN_DESTINATIONS) finalTo = ROUTES.CONTENT_DESTINATIONS;
        }
        let resolvedLabel = labelVi;
        let resolvedLabelEn = labelEn;
        if (to === ROUTES.CONTENT_COURSES) {
          resolvedLabel = isContentManager && !isAdmin ? 'Biên soạn khóa học' : (isAdmin ? 'Khóa học' : 'Khóa học');
          resolvedLabelEn = isContentManager && !isAdmin ? 'Course Authoring' : 'Courses';
        } else if (to === ROUTES.ADMIN_VOCABULARY && isAdmin) {
          resolvedLabel = 'Từ vựng';
          resolvedLabelEn = 'Vocabulary';
        } else if (isAdmin && (to === ROUTES.ADMIN_CULTURE || to === ROUTES.CONTENT_CULTURE)) {
          resolvedLabel = 'Quản lý bài viết';
          resolvedLabelEn = 'Manage Articles';
        }
        return [finalTo, resolvedLabel, resolvedLabelEn, Icon];
      }),
    };
  }).filter(group => group.links.length > 0);

  const location = useLocation();
  const currentItem = visibleGroups
    .flatMap(group => group.links)
    .find(([to]) => location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to + '/')));
  const currentVi = currentItem?.[1] || (isAdmin ? 'Quản trị hệ thống' : 'Quản lý nội dung');
  const currentEn = currentItem?.[2] || (isAdmin ? 'System Administration' : 'Content Management');

  const userInitial = (user?.fullName || user?.username || (isAdmin ? 'A' : 'C')).charAt(0).toUpperCase();

  return (
    <div className={`admin-wrapper ${open ? 'admin-menu-open' : ''}`}>
      <a className="skip-link" href="#admin-content"><BilingualText vi="Chuyển đến nội dung chính" en="Skip to main content" /></a>
      <aside ref={sidebar} id="admin-navigation" className="admin-sidebar">
        <Link to={isAdmin ? '/admin' : (visibleGroups[0]?.links[0]?.[0] || '/')} className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <span className="admin-sidebar-brand__name">{isAdmin ? 'hola admin' : 'hola content'}</span>
            <span className="admin-sidebar-brand__tag">
              <BilingualText vi={isAdmin ? "HỆ THỐNG & QUẢN TRỊ" : "NỘI DUNG & HỌC TẬP"} en={isAdmin ? "SYSTEM & GOVERNANCE" : "CONTENT & LEARNING"} />
            </span>
          </div>
        </Link>
        <nav className="admin-nav" aria-label={bilingualLabel("Điều hướng quản lý", "Management navigation")}>
          {visibleGroups.map(group => (
            <div className="admin-nav-group" key={group.title}>
              <p><BilingualText vi={group.title} en={group.titleEn} /></p>
              {group.links.map(([to, labelVi, labelEn, Icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `admin-nav-item ${
                    isActive || (to !== '/admin' && (location.pathname === to || location.pathname.startsWith(`${to}/`)))
                      ? 'active'
                      : ''
                  }`}
                >
                  {Icon && <Icon size={16} className="admin-nav-icon" aria-hidden="true" />}
                  <span className="admin-nav-text">
                    <BilingualText vi={labelVi} en={labelEn} />
                  </span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-learner-link">
            <ArrowLeft size={15} aria-hidden="true" />
            <BilingualText vi="Giao diện học viên" en="Learner view" />
          </Link>
          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={15} aria-hidden="true" />
            <BilingualText vi="Đăng xuất" en="Sign out" />
          </button>
        </div>
      </aside>

      {open && <button className="admin-menu-backdrop" aria-label={bilingualLabel("Đóng menu", "Close menu")} onClick={() => setOpen(false)} />}

      <div className="admin-main-area">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="mobile-menu-button secondary"
              aria-label={bilingualLabel("Mở menu quản lý", "Open management menu")}
              aria-controls="admin-navigation"
              aria-expanded={open}
              onClick={() => setOpen(value => !value)}
            >
              {open ? <X size={20}/> : <Menu size={20}/>}
            </button>
            <div className="admin-breadcrumb">
              <Link to={isAdmin ? '/admin' : (visibleGroups[0]?.links[0]?.[0] || '/')} className="admin-breadcrumb-home" aria-label="Home">
                <Home size={15} />
              </Link>
              <span className="admin-breadcrumb-separator">/</span>
              <span className="admin-breadcrumb-prefix">
                <BilingualText vi={isAdmin ? "Quản trị" : "Nội dung"} en={isAdmin ? "Admin" : "Content"} />
              </span>
              <span className="admin-breadcrumb-separator">/</span>
              <strong className="admin-breadcrumb-current">
                <BilingualText vi={currentVi} en={currentEn} />
              </strong>
            </div>
          </div>

          <div className="admin-topbar-right">
            <LanguageSwitcher compact />
            <div className="admin-user-pill">
              <div className="admin-user-avatar">
                {userInitial}
              </div>
              <div className="admin-user-meta">
                <span className="admin-user-name">
                  {user?.fullName || user?.username || (isAdmin ? 'Quản trị viên' : 'Quản lý nội dung')}
                </span>
                <span className={`admin-user-role-badge ${isAdmin ? 'admin-user-role-badge--admin' : 'admin-user-role-badge--content'}`}>
                  {isAdmin ? 'ADMIN' : 'CONTENT'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content" id="admin-content">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

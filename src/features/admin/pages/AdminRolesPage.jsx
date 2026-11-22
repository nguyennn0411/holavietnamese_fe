import { BilingualText, bilingualLabel, useTextLanguage } from '@/shared/components/common/BilingualText';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminService } from '@/features/admin/api/adminService';
import { AdminSearchBar } from '@/shared/components/common/AdminSearchBar';
import { AdminStatusBadge } from '@/shared/components/common/AdminStatusBadge';
import { AdminActionGroup, AdminActionButton } from '@/shared/components/common/AdminTableActions';
import { useConfirmDialog } from '@/shared/components/common/ConfirmDialog';
import {
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  GraduationCap,
  Users,
  Lock,
  Layers,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Key,
  Info,
} from 'lucide-react';

// Default metadata for standard permissions in HolaVietnamese system
const PERMISSION_METADATA = [
  // Admin & System
  { code: 'ADMIN_ACCESS', domain: 'Hệ thống', domainEn: 'System', descVi: 'Truy cập bảng điều khiển quản trị Admin', descEn: 'Access the admin dashboard', roles: ['ADMIN'] },
  { code: 'SYSTEM_SETTINGS_MANAGE', domain: 'Hệ thống', domainEn: 'System', descVi: 'Thay đổi tham số cấu hình toàn hệ thống', descEn: 'Manage platform global settings', roles: ['ADMIN'] },
  { code: 'AUDIT_LOG_VIEW', domain: 'Hệ thống', domainEn: 'System', descVi: 'Xem lịch sử thao tác và nhật ký bảo mật', descEn: 'View system audit trails and security logs', roles: ['ADMIN'] },
  { code: 'USERS_MANAGE', domain: 'Người dùng', domainEn: 'Users', descVi: 'Xem, khóa, mở khóa và gán vai trò người dùng', descEn: 'View, lock, unlock, and assign user roles', roles: ['ADMIN'] },
  { code: 'ACHIEVEMENT_MANAGE', domain: 'Gamification', domainEn: 'Gamification', descVi: 'Tạo và cập nhật quy tắc thành tích & huy hiệu', descEn: 'Configure achievements and badge rules', roles: ['ADMIN'] },
  { code: 'XP_RULES_MANAGE', domain: 'Gamification', domainEn: 'Gamification', descVi: 'Cấu hình hệ số tích lũy XP học tập', descEn: 'Configure XP rewards and multipliers', roles: ['ADMIN'] },
  { code: 'SITE_CONTENT_MANAGE', domain: 'CMS', domainEn: 'CMS', descVi: 'Quản lý banner trang chủ và menu điều hướng', descEn: 'Manage home banners and navigation menus', roles: ['ADMIN'] },

  // Content Authoring
  { code: 'COURSE_CREATE', domain: 'Khóa học', domainEn: 'Courses', descVi: 'Tạo mới khóa học và chương trình đào tạo', descEn: 'Create courses and curriculum modules', roles: ['ADMIN', 'CONTENT'] },
  { code: 'COURSE_EDIT', domain: 'Khóa học', domainEn: 'Courses', descVi: 'Biên soạn cấu trúc bài học, từ vựng và câu hỏi', descEn: 'Edit lessons, vocabulary, and questions', roles: ['ADMIN', 'CONTENT'] },
  { code: 'COURSE_REVIEW', domain: 'Khóa học', domainEn: 'Courses', descVi: 'Duyệt và xuất bản khóa học công khai', descEn: 'Review and publish courses for learners', roles: ['ADMIN'] },
  { code: 'QUESTION_BANK_MANAGE', domain: 'Khóa học', domainEn: 'Courses', descVi: 'Quản lý kho câu hỏi trắc nghiệm và bài tập', descEn: 'Manage question bank and quizzes', roles: ['ADMIN', 'CONTENT'] },
  { code: 'CONTENT_IMPORT', domain: 'Dữ liệu', domainEn: 'Data', descVi: 'Nhập hàng loạt khóa học và từ vựng từ tệp Excel', descEn: 'Bulk import courses and vocabulary via Excel', roles: ['ADMIN', 'CONTENT'] },

  // Culture & Explore
  { code: 'CULTURE_ARTICLE_MANAGE', domain: 'Văn hóa', domainEn: 'Culture', descVi: 'Viết bài giới thiệu văn hóa và phong tục Việt', descEn: 'Publish culture articles and traditions', roles: ['ADMIN', 'CONTENT'] },
  { code: 'DESTINATION_MANAGE', domain: 'Điểm đến', domainEn: 'Destinations', descVi: 'Quản lý địa điểm danh lam thắng cảnh du lịch', descEn: 'Manage tourism destinations and regional guides', roles: ['ADMIN', 'CONTENT'] },
  { code: 'AI_SCENARIO_MANAGE', domain: 'AI & Luyện nói', domainEn: 'AI & Speech', descVi: 'Thiết lập kịch bản hội thoại và gia sư ảo', descEn: 'Design roleplay scenarios and AI tutor settings', roles: ['ADMIN'] },

  // Learner Capabilities
  { code: 'LEARNER_STUDY', domain: 'Học tập', domainEn: 'Learning', descVi: 'Học bài, làm bài tập và làm bài kiểm tra', descEn: 'Access lessons, exercises, and quizzes', roles: ['ADMIN', 'CONTENT', 'LEARNER'] },
  { code: 'AI_CHAT_ACCESS', domain: 'AI & Luyện nói', domainEn: 'AI & Speech', descVi: 'Trò chuyện và luyện phát âm cùng gia sư AI', descEn: 'Converse with AI tutor for pronunciation practice', roles: ['ADMIN', 'CONTENT', 'LEARNER'] },
  { code: 'PROFILE_CUSTOMIZE', domain: 'Cá nhân', domainEn: 'Personal', descVi: 'Tùy chỉnh mục tiêu hàng ngày và hồ sơ cá nhân', descEn: 'Customize daily study goals and user profile', roles: ['ADMIN', 'CONTENT', 'LEARNER'] },
];

const ROLE_CARDS = [
  {
    role: 'ADMIN',
    nameVi: 'Quản trị viên',
    nameEn: 'System Administrator',
    badgeTone: 'danger',
    accentColor: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    icon: ShieldAlert,
    descVi: 'Toàn quyền cấu hình tham số hệ thống, phân quyền người dùng, quản trị bảo mật và duyệt nội dung.',
    descEn: 'Full permissions to manage platform settings, user security, access control, and approve courses.',
    scopes: ['Quản trị người dùng', 'Cài đặt hệ thống', 'Duyệt khóa học', 'Nhật ký bảo mật'],
    scopesEn: ['User Management', 'System Settings', 'Course Review', 'Audit Logs'],
  },
  {
    role: 'CONTENT',
    nameVi: 'Quản lý nội dung',
    nameEn: 'Content Manager',
    badgeTone: 'warning',
    accentColor: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: BookOpen,
    descVi: 'Biên soạn cấu trúc khóa học, ngân hàng câu hỏi, bài viết văn hóa, điểm đến du lịch và import Excel.',
    descEn: 'Author courses, lesson units, question banks, culture articles, destination guides, and Excel imports.',
    scopes: ['Biên soạn khóa học', 'Ngân hàng câu hỏi', 'Bài viết văn hóa', 'Import Excel'],
    scopesEn: ['Course Authoring', 'Question Bank', 'Culture Articles', 'Excel Import'],
  },
  {
    role: 'LEARNER',
    nameVi: 'Học viên',
    nameEn: 'Learner Member',
    badgeTone: 'success',
    accentColor: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: GraduationCap,
    descVi: 'Tham gia lộ trình học tập cá nhân hóa, hoàn thành bài tập, luyện phát âm cùng AI và nhận huy hiệu.',
    descEn: 'Engage with personalized learning paths, complete exercises, practice speech with AI, and earn badges.',
    scopes: ['Lộ trình học tập', 'Gia sư ảo AI', 'Luyện từ vựng', 'Bảng thành tích'],
    scopesEn: ['Learning Path', 'AI Virtual Tutor', 'Vocabulary Practice', 'Achievements'],
  },
];

export function AdminRolesPage() {
  useTextLanguage();
  const { confirm, confirmationDialog } = useConfirmDialog();
  const [roles, setRoles] = useState([]);
  const [state, setState] = useState({ loading: true, error: '', message: '' });
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const data = await adminService.getRoles();
      const list = Array.isArray(data) ? data : data?.content || [];
      setRoles(list);
      setState({ loading: false, error: '', message: '' });
    } catch (e) {
      setState({ loading: false, error: e.message || 'Không thể tải danh sách vai trò.', message: '' });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Filtered permission matrix
  const filteredPermissions = useMemo(() => {
    return PERMISSION_METADATA.filter((perm) => {
      // Role filter
      if (selectedRole !== 'ALL' && !perm.roles.includes(selectedRole)) {
        return false;
      }
      // Keyword search
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        perm.code.toLowerCase().includes(q) ||
        perm.domain.toLowerCase().includes(q) ||
        perm.domainEn.toLowerCase().includes(q) ||
        perm.descVi.toLowerCase().includes(q) ||
        perm.descEn.toLowerCase().includes(q)
      );
    });
  }, [search, selectedRole]);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '40px' }}>
      {confirmationDialog}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>
              <BilingualText vi="Vai trò & Phân quyền" en="Roles & Permissions" />
            </h1>
          </div>
          <p style={{ color: '#64748B', margin: 0, fontSize: '0.92rem' }}>
            <BilingualText
              vi="Mô hình kiểm soát truy cập dựa trên vai trò (RBAC). Hệ thống áp dụng nguyên tắc phân quyền tối thiểu để bảo vệ dữ liệu."
              en="Role-Based Access Control (RBAC) model. The system applies least privilege principles to safeguard platform data."
            />
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={load}
            disabled={state.loading}
            className="admin-btn admin-btn-secondary"
          >
            <RefreshCw size={15} className={state.loading ? 'spin-animation' : ''} />
            <BilingualText vi="Làm mới" en="Refresh" />
          </button>
        </div>
      </div>

      {state.error && (
        <div
          role="alert"
          style={{
            padding: '16px 20px',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            borderRadius: '12px',
            border: '1px solid #FECACA',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={18} />
          <span>{state.error}</span>
        </div>
      )}

      {/* RBAC Notice Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          marginBottom: '24px',
          fontSize: '0.88rem',
          color: '#475569',
        }}
      >
        <Lock size={18} style={{ color: '#64748B', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <strong style={{ color: '#0F172A', marginRight: '6px' }}>
            <BilingualText vi="Chính sách bảo mật hệ thống:" en="System Security Policy:" />
          </strong>
          <BilingualText
            vi="Các vai trò cốt lõi (ADMIN, CONTENT, LEARNER) được định nghĩa cố định trong kiến trúc bảo mật để ngăn ngừa leo thang đặc quyền. Quản trị viên gán vai trò trực tiếp cho tài khoản tại trang Người dùng."
            en="Core roles (ADMIN, CONTENT, LEARNER) are permanently structured in the security layer to prevent privilege escalation. Administrators assign roles to individual accounts in the Users page."
          />
        </div>
      </div>

      {/* 3 Role Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {ROLE_CARDS.map((card) => {
          const Icon = card.icon;
          const assignedPermsCount = PERMISSION_METADATA.filter((p) => p.roles.includes(card.role)).length;
          const isSelected = selectedRole === card.role;

          return (
            <div
              key={card.role}
              className="admin-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: isSelected ? `2px solid ${card.accentColor}` : '1px solid #E2E8F0',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: card.bgColor,
                      color: card.accentColor,
                      border: `1px solid ${card.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                      <BilingualText vi={card.nameVi} en={card.nameEn} />
                    </h3>
                    <span
                      style={{
                        display: 'inline-block',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: card.accentColor,
                        marginTop: '2px',
                      }}
                    >
                      ROLE_{card.role}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      backgroundColor: card.bgColor,
                      color: card.accentColor,
                      border: `1px solid ${card.borderColor}`,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {assignedPermsCount} <BilingualText vi="quyền" en="perms" />
                  </span>
                  <AdminActionGroup>
                    <AdminActionButton
                      tone="detail"
                      onClick={() => setSelectedRole(isSelected ? 'ALL' : card.role)}
                      title={bilingualLabel('Chi tiết phân quyền', 'Permission details')}
                    >
                      <BilingualText vi={isSelected ? 'Đang lọc' : 'Lọc'} en={isSelected ? 'Active' : 'Filter'} />
                    </AdminActionButton>
                  </AdminActionGroup>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                <BilingualText vi={card.descVi} en={card.descEn} />
              </p>

              {/* Scopes Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
                {card.scopes.map((scope, idx) => (
                  <span
                    key={scope}
                    style={{
                      backgroundColor: '#F8FAFC',
                      color: '#475569',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                    }}
                  >
                    <BilingualText vi={scope} en={card.scopesEn[idx]} />
                  </span>
                ))}
              </div>

              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setSelectedRole(isSelected ? 'ALL' : card.role)}
                className={`admin-btn admin-btn-sm ${isSelected ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
              >
                {isSelected ? (
                  <BilingualText vi="Đang lọc quyền vai trò này" en="Filtering this role" />
                ) : (
                  <BilingualText vi="Lọc ma trận quyền" en="Filter matrix by role" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix Table Section */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Toolbar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} style={{ color: '#2563EB' }} />
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
              <BilingualText vi="Ma trận chi tiết quyền hạn (Permissions Matrix)" en="Detailed Permissions Matrix" />
            </h2>
            <span
              style={{
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              {filteredPermissions.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ width: '260px' }}>
              <AdminSearchBar
                value={search}
                onChange={setSearch}
                placeholder={bilingualLabel('Tìm kiếm mã quyền, phân hệ...', 'Search permission, module...')}
              />
            </div>

            {/* Quick Role Filter Pills */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'ALL', labelVi: 'Tất cả', labelEn: 'All' },
                { id: 'ADMIN', labelVi: 'Admin', labelEn: 'Admin' },
                { id: 'CONTENT', labelVi: 'Content', labelEn: 'Content' },
                { id: 'LEARNER', labelVi: 'Learner', labelEn: 'Learner' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setSelectedRole(pill.id)}
                  className={`admin-btn admin-btn-sm ${selectedRole === pill.id ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                  style={{ borderRadius: '6px' }}
                >
                  <BilingualText vi={pill.labelVi} en={pill.labelEn} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="admin-table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '220px' }}>
                  <BilingualText vi="Mã quyền (Code)" en="Permission Code" />
                </th>
                <th style={{ width: '150px' }}>
                  <BilingualText vi="Phân hệ chức năng" en="Functional Domain" />
                </th>
                <th style={{ width: '240px' }}>
                  <BilingualText vi="Vai trò được cấp" en="Granted Roles" />
                </th>
                <th>
                  <BilingualText vi="Mô tả phạm vi quyền hạn" en="Scope & Description" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.map((perm) => (
                <tr key={perm.code}>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: '#F1F5F9',
                        color: '#0F172A',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      {perm.code}
                    </span>
                  </td>

                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#334155',
                      }}
                    >
                      <Layers size={13} style={{ color: '#64748B' }} />
                      <BilingualText vi={perm.domain} en={perm.domainEn} />
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {perm.roles.map((r) => {
                        const isAdm = r === 'ADMIN';
                        const isCnt = r === 'CONTENT';
                        const isLrn = r === 'LEARNER';
                        const bg = isAdm ? '#FEF2F2' : isCnt ? '#FFFBEB' : '#ECFDF5';
                        const color = isAdm ? '#DC2626' : isCnt ? '#D97706' : '#059669';
                        const border = isAdm ? '#FECACA' : isCnt ? '#FDE68A' : '#A7F3D0';

                        return (
                          <span
                            key={r}
                            style={{
                              display: 'inline-block',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              padding: '2px 7px',
                              borderRadius: '6px',
                              backgroundColor: bg,
                              color,
                              border: `1px solid ${border}`,
                            }}
                          >
                            {r}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.4 }}>
                      <BilingualText vi={perm.descVi} en={perm.descEn} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

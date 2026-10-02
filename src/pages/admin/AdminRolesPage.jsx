import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export function AdminRolesPage() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    adminService.getRoles().then(setRoles);
  }, []);

  const permissionLabels = {
    view_all: 'Xem tất cả dữ liệu hệ thống',
    manage_users: 'Quản lý & khóa người dùng',
    manage_roles: 'Phân quyền & vai trò',
    publish_content: 'Duyệt & xuất bản bài học',
    system_config: 'Cấu hình hệ thống & API',
    view_courses: 'Xem danh sách khóa học',
    edit_courses: 'Tạo & sửa nội dung khóa học',
    create_quiz: 'Soạn ngân hàng câu hỏi & quiz',
    view_reports: 'Xem báo cáo học tập',
    learn: 'Tham gia học tập & luyện phát âm',
    take_quiz: 'Làm bài thi trắc nghiệm',
    view_profile: 'Quản lý hồ sơ cá nhân',
    save_vocab: 'Lưu từ vựng vào sổ tay',
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>Vai trò & Phân quyền</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
          Quản lý quyền xem, tạo, sửa, duyệt, xuất bản và gán vai trò cho các nhóm thành viên.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {roles.map(role => (
          <div key={role.id} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{role.name}</h3>
                  <span className={`admin-badge ${role.id === 'ADMIN' ? 'admin-badge-danger' : role.id === 'INSTRUCTOR' ? 'admin-badge-info' : 'admin-badge-warning'}`}>
                    {role.id}
                  </span>
                </div>
                <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.85rem' }}>{role.desc}</p>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Danh sách quyền hạn được cấp:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {role.permissions.map(perm => (
                  <span
                    key={perm}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {permissionLabels[perm] || perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

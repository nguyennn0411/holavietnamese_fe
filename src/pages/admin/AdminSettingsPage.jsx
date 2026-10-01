import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminService.getSystemSettings().then(setSettings);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await adminService.updateSystemSettings(settings);
    setMsg(res.message);
    setTimeout(() => setMsg(''), 3000);
  };

  if (!settings) return <div>Đang tải cấu hình hệ thống…</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>Cấu hình Hệ thống</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
          Quản lý các thông số chung của ứng dụng, dịch vụ AI và các cổng xác thực.
        </p>
      </div>

      {msg && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px' }}>
          ✓ {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            Tên ứng dụng
          </label>
          <input
            type="text"
            value={settings.appName}
            onChange={e => setSettings({ ...settings, appName: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            Email hỗ trợ hệ thống
          </label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            Nhà cung cấp AI Tutor (Hội thoại & Gợi ý phản hồi)
          </label>
          <input
            type="text"
            value={settings.aiTutorProvider}
            onChange={e => setSettings({ ...settings, aiTutorProvider: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: '#1e293b' }}>Cho phép đăng ký tài khoản mới</strong>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Bật/tắt biểu mẫu đăng ký học viên trên trang web</span>
            </div>
            <input
              type="checkbox"
              checked={settings.allowRegistration}
              onChange={e => setSettings({ ...settings, allowRegistration: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: '#8B1A1A' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: '#1e293b' }}>Kích hoạt đăng nhập Google OAuth</strong>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Bật nút Sign in with Google qua thư viện GSI</span>
            </div>
            <input
              type="checkbox"
              checked={settings.googleAuthEnabled}
              onChange={e => setSettings({ ...settings, googleAuthEnabled: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: '#8B1A1A' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: '#1e293b' }}>Chế độ bảo trì hệ thống (Maintenance Mode)</strong>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Chỉ cho phép tài khoản Admin đăng nhập khi bảo trì</span>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: '#8B1A1A' }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            alignSelf: 'flex-start',
            padding: '10px 24px',
            borderRadius: '8px',
            border: 'none',
            background: '#8B1A1A',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Lưu cấu hình hệ thống
        </button>
      </form>
    </div>
  );
}

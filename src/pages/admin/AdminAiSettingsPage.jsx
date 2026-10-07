import { useState } from 'react';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import '@/presentation/styles/admin.css';

export function AdminAiSettingsPage() {
  const [settings, setSettings] = useState(() => adminCultureAiService.getAiSettings());
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    adminCultureAiService.saveAiSettings(settings);
    showToast('Đã lưu cấu hình mô hình & giới hạn AI thành công!');
  };

  return (
    <div className="admin-content">
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#245c48', color: '#fff', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#a62a24', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            AI GOVERNANCE & LLM CONFIG • NGƯỜI 4
          </span>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '32px' }}>Cấu hình hệ thống AI</h1>
          <p style={{ margin: 0, color: '#665349', fontSize: '14px' }}>
            Quản trị mô hình ngôn ngữ lớn (LLM), phiên bản System Prompt, kiểm soát giới hạn tần suất, chi phí và bảo mật API.
          </p>
        </div>

        <button className="button" onClick={handleSave} style={{ fontSize: '13px' }}>
          💾 Lưu tất cả cấu hình
        </button>
      </div>

      {/* Security Banner: API Key chỉ ở backend */}
      <div style={{ background: '#edf7ed', border: '1px solid #c3e6cb', borderRadius: '14px', padding: '18px 22px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ fontSize: '28px' }}>🛡️</span>
        <div>
          <strong style={{ fontSize: '14px', color: '#1e6334', display: 'block' }}>
            Kiến trúc bảo mật API Key an toàn:
          </strong>
          <span style={{ fontSize: '13px', color: '#275235' }}>
            API key của nhà cung cấp (Google Gemini, OpenAI, Claude) <strong>chỉ được lưu trữ và gọi tại Backend Server</strong> (thông qua Backend Proxy endpoint: <code>/api/v1/ai/completions</code>). Không có bất kỳ API key nào lộ ra Frontend client.
          </span>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Column 1: Allowed Models & System Prompt Versioning */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Allowed Models */}
            <div className="admin-card">
              <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#381e18' }}>
                1. Chọn mô hình được phép (LLM Providers)
              </h2>

              <label>
                Mô hình đang hoạt động chính (Default Active Model):
                <select
                  value={settings.activeModel}
                  onChange={e => setSettings({ ...settings, activeModel: e.target.value })}
                >
                  {settings.allowedModels.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#381e18', display: 'block', marginBottom: '8px' }}>
                  Danh sách mô hình được cấp phép trong hệ thống:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {settings.allowedModels.map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf3e8', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}>
                      <div>
                        <strong>{m.name}</strong>
                        <div style={{ fontSize: '11px', color: '#7a6458' }}>Nhà cung cấp: {m.provider}</div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#245c48', fontWeight: 700 }}>
                        ${m.costPer1kTokens} / 1k tokens
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Prompt Versioning */}
            <div className="admin-card">
              <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#381e18' }}>
                2. Phiên bản hướng dẫn hệ thống (System Prompt)
              </h2>

              <label>
                Phiên bản System Prompt hiện hành:
                <input
                  type="text"
                  value={settings.systemPromptVersion}
                  onChange={e => setSettings({ ...settings, systemPromptVersion: e.target.value })}
                  style={{ fontWeight: 700, color: '#a62a24' }}
                />
              </label>

              <div style={{ marginTop: '14px', padding: '12px 14px', background: '#fcf6ee', border: '1px solid #ebd8c7', borderRadius: '10px', fontSize: '12.5px', color: '#684d40' }}>
                📌 <strong>Quy tắc bắt buộc đã tích hợp trong prompt v2.2.0:</strong><br />
                - Phản hồi phải dựa trên lịch sử hội thoại thực tế của người học.<br />
                - <em>Nếu chưa có công cụ đo đạc âm thanh thực tế, tuyệt đối không sinh điểm số phát âm ảo (Pronunciation score) gây hiểu lầm cho người học.</em>
              </div>

              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#381e18', display: 'block', marginBottom: '6px' }}>
                  Lịch sử các phiên bản hướng dẫn:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {settings.promptVersionsHistory.map(v => (
                    <div key={v.version} style={{ fontSize: '12px', background: '#fff', border: '1px solid #ebd9c8', padding: '8px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a62a24', fontWeight: 700 }}>
                        <span>{v.version}</span>
                        <span>{v.releasedAt}</span>
                      </div>
                      <div style={{ color: '#553c31', marginTop: '2px' }}>{v.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Limits, Quotas & Cost Caps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Conversation & Rate Limits */}
            <div className="admin-card">
              <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#381e18' }}>
                3. Giới hạn hội thoại & Tần suất sử dụng
              </h2>

              <label>
                Số lượt hội thoại tối đa mỗi phiên (Max turns per session):
                <input
                  type="number"
                  min={10}
                  max={50}
                  value={settings.limits.maxTurnsPerSession}
                  onChange={e => setSettings({ ...settings, limits: { ...settings.limits, maxTurnsPerSession: parseInt(e.target.value) || 20 } })}
                />
              </label>

              <label style={{ marginTop: '12px' }}>
                Độ dài câu trả lời tối đa (Max output tokens):
                <input
                  type="number"
                  min={256}
                  max={2048}
                  value={settings.limits.maxTokensPerResponse}
                  onChange={e => setSettings({ ...settings, limits: { ...settings.limits, maxTokensPerResponse: parseInt(e.target.value) || 1024 } })}
                />
              </label>

              <label style={{ marginTop: '12px' }}>
                Giới hạn tần suất gọi API (Rate limit / phút / người dùng):
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={settings.limits.rateLimitPerMinute}
                  onChange={e => setSettings({ ...settings, limits: { ...settings.limits, rateLimitPerMinute: parseInt(e.target.value) || 30 } })}
                />
              </label>

              <label style={{ marginTop: '12px' }}>
                Số phiên tối đa trong ngày mỗi học viên (Daily sessions cap):
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={settings.limits.dailySessionsPerUser}
                  onChange={e => setSettings({ ...settings, limits: { ...settings.limits, dailySessionsPerUser: parseInt(e.target.value) || 40 } })}
                />
              </label>
            </div>

            {/* Budget & Cost Cap */}
            <div className="admin-card">
              <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#381e18' }}>
                4. Kiểm soát ngân sách & Giới hạn chi phí
              </h2>

              <label>
                Ngân sách tối đa hàng tháng (Monthly Budget Cap - USD):
                <input
                  type="number"
                  step="10"
                  value={settings.limits.monthlyBudgetCapUsd}
                  onChange={e => setSettings({ ...settings, limits: { ...settings.limits, monthlyBudgetCapUsd: parseFloat(e.target.value) || 150 } })}
                />
              </label>

              <label style={{ marginTop: '12px' }}>
                Ngưỡng cảnh báo chi phí (% Budget Alert Threshold):
                <input
                  type="number"
                  min={50}
                  max={95}
                  value={settings.limits.costAlertThresholdPercent}
                  onChange={e => setSettings({ ...settings, limits: { ...settings.limits, costAlertThresholdPercent: parseInt(e.target.value) || 80 } })}
                />
              </label>

              <div style={{ marginTop: '16px', background: '#faf3e8', padding: '14px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  <span>Chi phí tháng hiện tại:</span>
                  <span style={{ color: '#245c48' }}>${settings.limits.currentMonthSpendUsd} / ${settings.limits.monthlyBudgetCapUsd}</span>
                </div>
                <div style={{ height: '8px', background: '#ebd8c7', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: '#245c48',
                      width: `${(settings.limits.currentMonthSpendUsd / settings.limits.monthlyBudgetCapUsd) * 100}%`,
                    }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: '#7a6054', display: 'block', marginTop: '4px' }}>
                  Hệ thống đang hoạt động trong ngưỡng an toàn ({Math.round((settings.limits.currentMonthSpendUsd / settings.limits.monthlyBudgetCapUsd) * 100)}%).
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

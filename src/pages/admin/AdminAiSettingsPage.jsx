import { BilingualText, useBilingualLabel } from '@/components/common/BilingualText';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart3, Check, Power, Save, Settings } from 'lucide-react';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import { TUTOR_MODES } from '@/services/aiTutorService';

const ALL_MODE_IDS = TUTOR_MODES.map(m => m.id);

function normalizeEnabledModes(rawModes) {
  if (Array.isArray(rawModes) && rawModes.length > 0) {
    return rawModes.map(m => String(m).trim().toLowerCase()).filter(Boolean);
  }
  if (typeof rawModes === 'string' && rawModes.trim()) {
    const parsed = rawModes
      .split(',')
      .map(m => m.trim().toLowerCase())
      .filter(Boolean);
    if (parsed.length > 0) return parsed;
  }
  return ALL_MODE_IDS;
}

export function AdminAiSettingsPage() {
  const label = useBilingualLabel();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'usage' ? 'usage' : 'config';

  const [settings, setSettings] = useState(null);
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const localStored = adminCultureAiService.getAiSettings();
    adminCultureAiService.loadAiSettings()
      .then(data => {
        const merged = {
          activeModel: 'openrouter/free',
          allowedModels: localStored?.allowedModels || [],
          systemPromptVersion: 'v2.2.0-stable',
          promptVersionsHistory: localStored?.promptVersionsHistory || [],
          ...localStored,
          ...data,
          enabledModes: normalizeEnabledModes(data?.enabledModes ?? localStored?.enabledModes),
          limits: {
            maxTurnsPerSession: 25,
            maxTokensPerResponse: 1024,
            rateLimitPerMinute: 30,
            dailySessionsPerUser: 40,
            ...(localStored?.limits || {}),
            ...(data?.limits || {}),
          },
        };
        setSettings(merged);
        adminCultureAiService.saveAiSettings(merged);
      })
      .catch(() => {
        const fallback = {
          ...localStored,
          enabledModes: normalizeEnabledModes(localStored?.enabledModes),
          limits: {
            maxTurnsPerSession: 25,
            maxTokensPerResponse: 1024,
            rateLimitPerMinute: 30,
            dailySessionsPerUser: 40,
            ...(localStored?.limits || {}),
          },
        };
        setSettings(fallback);
      })
      .finally(() => setLoading(false));

    adminCultureAiService.loadUsageStats()
      .then(setUsageData)
      .catch(() => setUsageData(adminCultureAiService.getUsageStats()));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const switchTab = (tab) => {
    if (tab === 'usage') {
      setSearchParams({ tab: 'usage' }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleToggleMode = (modeId) => {
    if (!settings) return;
    const current = normalizeEnabledModes(settings.enabledModes);
    const exists = current.includes(modeId);
    if (exists && current.length <= 1) {
      showToast(label('Cần giữ ít nhất 1 chế độ học hoạt động cho học viên.', 'At least 1 learning mode must remain enabled for learners.'));
      return;
    }
    const nextModes = exists ? current.filter(id => id !== modeId) : [...current, modeId];
    setSettings({ ...settings, enabledModes: nextModes });
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!settings) return;

    adminCultureAiService.saveAiSettings(settings);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hola-ai-settings-updated'));
    }

    adminCultureAiService.updateAiSettings(settings)
      .then(data => {
        const merged = {
          ...settings,
          ...data,
          enabledModes: normalizeEnabledModes(data?.enabledModes ?? settings.enabledModes),
          limits: {
            ...settings.limits,
            ...(data?.limits || {}),
          },
        };
        setSettings(merged);
        adminCultureAiService.saveAiSettings(merged);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hola-ai-settings-updated'));
        }
        showToast(label('Đã lưu cấu hình AI & đồng bộ sang trang Học viên thành công!', 'AI configuration saved and synced to Learner view!'));
      })
      .catch(() => {
        showToast(label('Đã lưu cấu hình AI & đồng bộ sang trang Học viên!', 'AI configuration saved and synced to Learner view!'));
      });
  };

  if (loading || !settings) {
    return (
      <div className="admin-content">
        {label('Đang tải cấu hình AI...', 'Loading AI configuration...')}
      </div>
    );
  }

  const summary = {
    totalSessions: 0,
    totalApiCalls: 0,
    totalTokens: 0,
    avgResponseTimeMs: 0,
    ...(usageData?.summary || {}),
  };
  const modeBreakdown = Array.isArray(usageData?.modeBreakdown) ? usageData.modeBreakdown : [];
  const recentLogs = Array.isArray(usageData?.recentLogs) ? usageData.recentLogs : [];
  const enabledModesList = normalizeEnabledModes(settings.enabledModes);

  const pillBadgeBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    height: '28px',
    padding: '0 11px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    lineHeight: 1,
  };

  const actionBtnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    height: '32px',
    minHeight: '32px',
    maxHeight: '32px',
    minWidth: 'auto',
    padding: '0 10px',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '8px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    lineHeight: 1,
    textDecoration: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  };

  const thStyle = {
    padding: '14px 16px',
    whiteSpace: 'nowrap',
    fontSize: '11.5px',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--color-ink)',
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
  };

  const tdStyle = {
    padding: '15px 16px',
    verticalAlign: 'middle',
    borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
  };

  return (
    <div className="admin-content">
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: 'var(--color-ink)', color: 'var(--color-surface)', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-red-hover)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <BilingualText vi="QUẢN TRỊ & GIÁM SÁT AI" en="AI GOVERNANCE & MONITORING" />
          </span>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '30px', fontWeight: 800, color: 'var(--text-primary, #253044)' }}>
            <BilingualText
              vi={activeTab === 'usage' ? 'Thống kê lượt sử dụng AI' : 'Cấu hình hệ thống AI'}
              en={activeTab === 'usage' ? 'AI Usage Analytics' : 'AI System Configuration'}
            />
          </h1>
          <p style={{ margin: 0, color: 'var(--color-forest)', fontSize: '14px' }}>
            <BilingualText
              vi={
                activeTab === 'usage'
                  ? 'Theo dõi số phiên hội thoại, lượt gọi API, phân bổ theo chế độ học và nhật ký phản hồi thực tế.'
                  : 'Quản trị mô hình ngôn ngữ lớn (LLM), chế độ học AI Tutor của học viên và giới hạn tần suất phiên.'
              }
              en={
                activeTab === 'usage'
                  ? 'Monitor conversation sessions, API calls, mode distribution and real-time response logs.'
                  : 'Manage Large Language Models (LLM), learner AI Tutor modes and session rate limits.'
              }
            />
          </p>
        </div>

        {activeTab === 'config' && (
          <button
            type="button"
            className="button"
            onClick={handleSave}
            style={{ fontSize: '13px', minHeight: '40px', height: '40px', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={15} strokeWidth={2.2} />
            <span>{label('Lưu cấu hình', 'Save configuration')}</span>
          </button>
        )}
      </div>

      {/* Sub-Navigation Tabs: Cấu hình & Thống kê sử dụng */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
        <button
          type="button"
          className={`button ${activeTab === 'config' ? '' : 'secondary'}`}
          onClick={() => switchTab('config')}
          style={{ fontSize: '13px', minHeight: '38px', height: '38px', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Settings size={14} strokeWidth={2.2} />
          <span>{label('Cấu hình Mô hình & Chế độ học', 'Model & Learning Modes')}</span>
        </button>
        <button
          type="button"
          className={`button ${activeTab === 'usage' ? '' : 'secondary'}`}
          onClick={() => switchTab('usage')}
          style={{ fontSize: '13px', minHeight: '38px', height: '38px', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <BarChart3 size={14} strokeWidth={2.2} />
          <span>{label('Thống kê lượt sử dụng', 'Usage Analytics')}</span>
        </button>
      </div>

      {activeTab === 'config' ? (
        <>
          {/* Security Banner */}
          <div style={{ background: 'var(--color-sage-soft)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '18px 22px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '28px' }}>🛡️</span>
            <div>
              <strong style={{ fontSize: '14px', color: 'var(--color-ink)', display: 'block' }}>
                <BilingualText vi="Kiến trúc bảo mật API Key an toàn:" en="Secure API Key Architecture:" />
              </strong>
              <span style={{ fontSize: '13px', color: 'var(--color-ink)' }}>
                <BilingualText
                  vi="API key của nhà cung cấp AI chỉ được lưu trữ và gọi tại Backend Server (qua endpoint "
                  en="Provider API keys are stored and invoked strictly on the Backend Server (via endpoint "
                />
                <code>/api/ai/sessions</code>
                <BilingualText
                  vi="). Không có bất kỳ API key nào lộ ra Frontend client."
                  en="). No API keys are ever exposed to the Frontend client."
                />
              </span>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
              {/* Column 1: Allowed Models & System Prompt Versioning */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Allowed Models */}
                <div className="admin-card">
                  <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--color-ink)' }}>
                    <BilingualText vi="1. Chọn mô hình AI hoạt động" en="1. Active AI Model Selection" />
                  </h2>

                  <label>
                    <span>{label('Mô hình đang hoạt động chính:', 'Primary active model:')}</span>
                    <select
                      value={settings.activeModel}
                      onChange={e => setSettings({ ...settings, activeModel: e.target.value })}
                    >
                      {(settings.allowedModels || []).map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.provider})
                        </option>
                      ))}
                    </select>
                  </label>

                  <div style={{ marginTop: '16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ink)', display: 'block', marginBottom: '8px' }}>
                      <BilingualText vi="Danh sách mô hình được cấp phép trong hệ thống:" en="Authorized models in system:" />
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(settings.allowedModels || []).map(m => {
                        const isCurrent = settings.activeModel === m.id;
                        return (
                          <div
                            key={m.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '12px',
                              background: isCurrent ? '#fff7ed' : 'var(--color-cream)',
                              border: isCurrent ? '1px solid #fed7aa' : '1px solid transparent',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontSize: '13px',
                            }}
                          >
                            <div>
                              <strong style={{ color: 'var(--color-ink)' }}>{m.name}</strong>
                              <div style={{ fontSize: '11.5px', color: 'var(--color-forest)', marginTop: '2px' }}>
                                {label('Nhà cung cấp:', 'Provider:')} {m.provider}
                              </div>
                            </div>

                            {isCurrent ? (
                              <span
                                style={{
                                  ...pillBadgeBase,
                                  background: '#dcfce7',
                                  color: '#15803d',
                                  border: '1px solid #bbf7d0',
                                }}
                              >
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                                <span>{label('Đang dùng', 'Active')}</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="button secondary"
                                style={{
                                  ...actionBtnBase,
                                  color: '#334155',
                                  background: '#ffffff',
                                  border: '1px solid #cbd5e1',
                                }}
                                onClick={() => setSettings({ ...settings, activeModel: m.id })}
                              >
                                <Check size={13} strokeWidth={2.2} />
                                <span>{label('Chọn', 'Select')}</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* System Prompt Versioning */}
                <div className="admin-card">
                  <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--color-ink)' }}>
                    <BilingualText vi="2. Phiên bản hướng dẫn hệ thống" en="2. System Prompt Version" />
                  </h2>

                  <label>
                    <span>{label('Phiên bản hướng dẫn hệ thống hiện hành:', 'Current system prompt version:')}</span>
                    <input
                      type="text"
                      value={settings.systemPromptVersion}
                      onChange={e => setSettings({ ...settings, systemPromptVersion: e.target.value })}
                      style={{ fontWeight: 700, color: 'var(--color-red-hover)' }}
                    />
                  </label>

                  <div style={{ marginTop: '16px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-ink)', display: 'block', marginBottom: '6px' }}>
                      <BilingualText vi="Lịch sử các phiên bản hướng dẫn:" en="System prompt version history:" />
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(settings.promptVersionsHistory || []).map(v => (
                        <div key={v.version} style={{ fontSize: '12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '8px 12px', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-red-hover)', fontWeight: 700 }}>
                            <span>{v.version}</span>
                            <span>{v.releasedAt}</span>
                          </div>
                          <div style={{ color: 'var(--color-ink)', marginTop: '2px' }}>{v.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Limits & Learner AI Tutor Modes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Conversation & Rate Limits */}
                <div className="admin-card">
                  <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--color-ink)' }}>
                    <BilingualText vi="3. Giới hạn hội thoại & Tần suất sử dụng" en="3. Conversation & Rate Limits" />
                  </h2>

                  <label>
                    <span>{label('Số lượt hội thoại tối đa mỗi phiên (Đồng bộ AI Tutor):', 'Max conversation turns per session (Synced with AI Tutor):')}</span>
                    <input
                      type="number"
                      min={10}
                      max={50}
                      value={settings.limits.maxTurnsPerSession}
                      onChange={e => setSettings({ ...settings, limits: { ...settings.limits, maxTurnsPerSession: parseInt(e.target.value) || 20 } })}
                    />
                  </label>

                  <label style={{ marginTop: '12px' }}>
                    <span>{label('Giới hạn số token đầu ra:', 'Max output tokens per response:')}</span>
                    <input
                      type="number"
                      min={256}
                      max={2048}
                      value={settings.limits.maxTokensPerResponse}
                      onChange={e => setSettings({ ...settings, limits: { ...settings.limits, maxTokensPerResponse: parseInt(e.target.value) || 1024 } })}
                    />
                  </label>

                  <label style={{ marginTop: '12px' }}>
                    <span>{label('Giới hạn tần suất gọi API (lượt / phút / người dùng):', 'API rate limit (requests / min / user):')}</span>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={settings.limits.rateLimitPerMinute}
                      onChange={e => setSettings({ ...settings, limits: { ...settings.limits, rateLimitPerMinute: parseInt(e.target.value) || 30 } })}
                    />
                  </label>

                  <label style={{ marginTop: '12px' }}>
                    <span>{label('Số phiên tối đa trong ngày mỗi học viên:', 'Max daily sessions per learner:')}</span>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={settings.limits.dailySessionsPerUser}
                      onChange={e => setSettings({ ...settings, limits: { ...settings.limits, dailySessionsPerUser: parseInt(e.target.value) || 40 } })}
                    />
                  </label>
                </div>

                {/* Enabled AI Tutor Modes for Learner */}
                <div className="admin-card">
                  <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', color: 'var(--color-ink)' }}>
                    <BilingualText vi="4. Chế độ AI Tutor mở cho Học viên" en="4. Enabled AI Tutor Modes for Learners" />
                  </h2>
                  <p style={{ margin: '0 0 14px 0', fontSize: '12.5px', color: 'var(--color-forest)' }}>
                    <BilingualText
                      vi="Bật/tắt các chế độ học hiển thị trên trang Gia sư AI (/ai-tutor) của học viên."
                      en="Enable or disable learning modes available on the Learner AI Tutor (/ai-tutor) page."
                    />
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {TUTOR_MODES.map(mode => {
                      const isEnabled = enabledModesList.includes(mode.id);
                      return (
                        <div
                          key={mode.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: isEnabled ? 'var(--color-cream)' : 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <span style={{ fontSize: '20px', flexShrink: 0 }}>{mode.icon}</span>
                            <div style={{ minWidth: 0 }}>
                              <strong style={{ fontSize: '13.5px', color: 'var(--color-ink)', display: 'block' }}>
                                {mode.title} ({mode.name})
                              </strong>
                              <span style={{ fontSize: '11.5px', color: 'var(--color-forest)' }}>
                                {mode.badge}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            {isEnabled ? (
                              <>
                                <span
                                  style={{
                                    ...pillBadgeBase,
                                    background: '#dcfce7',
                                    color: '#15803d',
                                    border: '1px solid #bbf7d0',
                                  }}
                                >
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                                  <span>{label('Đang bật', 'Enabled')}</span>
                                </span>
                                <button
                                  type="button"
                                  className="button secondary"
                                  style={{
                                    ...actionBtnBase,
                                    color: '#c2410c',
                                    background: '#fff7ed',
                                    border: '1px solid #fed7aa',
                                  }}
                                  onClick={() => handleToggleMode(mode.id)}
                                >
                                  <Power size={13} strokeWidth={2.2} />
                                  <span>{label('Tắt', 'Disable')}</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <span
                                  style={{
                                    ...pillBadgeBase,
                                    background: '#f1f5f9',
                                    color: '#475569',
                                    border: '1px solid #e2e8f0',
                                  }}
                                >
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }} />
                                  <span>{label('Đang tắt', 'Disabled')}</span>
                                </span>
                                <button
                                  type="button"
                                  className="button secondary"
                                  style={{
                                    ...actionBtnBase,
                                    color: '#15803d',
                                    background: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                  }}
                                  onClick={() => handleToggleMode(mode.id)}
                                >
                                  <Check size={13} strokeWidth={2.4} />
                                  <span>{label('Bật', 'Enable')}</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </>
      ) : (
        /* Usage Analytics Tab (Merged & Cleaned) */
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div className="admin-card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase' }}>
                <BilingualText vi="Tổng số phiên" en="Total Sessions" />
              </span>
              <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--color-ink)', margin: '6px 0' }}>
                {(summary.totalSessions ?? 0).toLocaleString()}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-forest)' }}>
                <BilingualText vi="Phiên hội thoại AI đã tạo" en="Created AI conversation sessions" />
              </span>
            </div>

            <div className="admin-card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase' }}>
                <BilingualText vi="Tổng lượt gọi API" en="Total API Calls" />
              </span>
              <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--color-ink)', margin: '6px 0' }}>
                {(summary.totalApiCalls ?? 0).toLocaleString()}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-forest)' }}>
                <BilingualText vi="Lượt phản hồi từ LLM" en="LLM completion responses" />
              </span>
            </div>

            <div className="admin-card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase' }}>
                <BilingualText vi="Token tiêu thụ" en="Tokens Consumed" />
              </span>
              <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--color-ink)', margin: '6px 0' }}>
                {(summary.totalTokens ?? 0).toLocaleString()}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-forest)' }}>
                <BilingualText vi="Tổng Token Đầu vào + Đầu ra" en="Total Input + Output tokens" />
              </span>
            </div>

            <div className="admin-card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase' }}>
                <BilingualText vi="Độ trễ trung bình" en="Avg Response Time" />
              </span>
              <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--color-ink)', margin: '6px 0' }}>
                {summary.avgResponseTimeMs ?? 0} ms
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-forest)' }}>
                <BilingualText vi="Thời gian phản hồi trung bình" en="Average completion latency" />
              </span>
            </div>
          </div>

          {/* Breakdown by Mode */}
          <div className="admin-card" style={{ padding: 0, overflowX: 'auto', marginBottom: '28px' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ margin: 0, fontSize: '17px', color: 'var(--color-ink)' }}>
                <BilingualText vi="Phân bổ lượng sử dụng theo chế độ AI" en="Usage Breakdown by AI Mode" />
              </h2>
            </div>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, paddingLeft: '24px' }}>{label('Chế độ AI', 'AI Mode')}</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>{label('Số lượt gọi', 'API Calls')}</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>{label('Lượng Token', 'Tokens')}</th>
                  <th style={{ ...thStyle, paddingRight: '24px' }}>{label('Tỷ lệ', 'Share')}</th>
                </tr>
              </thead>
              <tbody>
                {modeBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-muted)' }}>
                      <BilingualText vi="Chưa có dữ liệu phân bổ theo chế độ." en="No mode breakdown recorded yet." />
                    </td>
                  </tr>
                ) : (
                  modeBreakdown.map(item => (
                    <tr key={item.mode}>
                      <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                        <strong style={{ color: 'var(--color-ink)' }}>{item.mode}</strong>
                        <div style={{ fontSize: '11.5px', color: 'var(--color-forest)' }}>{item.name}</div>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span
                          style={{
                            ...pillBadgeBase,
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                          }}
                        >
                          {(item.calls ?? 0).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 600 }}>
                        {(item.tokens ?? 0).toLocaleString()}
                      </td>
                      <td style={{ ...tdStyle, paddingRight: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '90px', height: '6px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${item.percent || 0}%`, height: '100%', background: 'var(--color-red-hover)' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>{item.percent || 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Real-time API Logs Table */}
          <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '17px', color: 'var(--color-ink)' }}>
                <BilingualText vi="Nhật ký gọi API gần đây" en="Recent API Call Logs" />
              </h2>
            </div>

            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, paddingLeft: '24px' }}>{label('Request ID', 'Request ID')}</th>
                  <th style={thStyle}>{label('Thời gian', 'Timestamp')}</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>{label('Chế độ', 'Mode')}</th>
                  <th style={thStyle}>{label('Người dùng', 'User')}</th>
                  <th style={thStyle}>{label('Tokens In/Out', 'Tokens In/Out')}</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>{label('Độ trễ', 'Latency')}</th>
                  <th style={{ ...thStyle, textAlign: 'right', paddingRight: '24px' }}>{label('Trạng thái', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '28px', color: 'var(--color-muted)' }}>
                      <BilingualText vi="Chưa có nhật ký gọi API nào gần đây." en="No recent API call logs found." />
                    </td>
                  </tr>
                ) : (
                  recentLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ ...tdStyle, paddingLeft: '24px' }}><code>{log.id}</code></td>
                      <td style={tdStyle}>{log.timestamp}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span
                          style={{
                            ...pillBadgeBase,
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                          }}
                        >
                          {log.mode}
                        </span>
                      </td>
                      <td style={tdStyle}>{log.user}</td>
                      <td style={tdStyle}>{log.tokensIn} in / {log.tokensOut} out</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <strong style={{ color: log.latency < 400 ? 'var(--color-ink)' : 'var(--color-red)' }}>
                          {log.latency} ms
                        </strong>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '24px' }}>
                        <span
                          style={{
                            ...pillBadgeBase,
                            background: '#dcfce7',
                            color: '#15803d',
                            border: '1px solid #bbf7d0',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                          <span>{log.status} OK</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

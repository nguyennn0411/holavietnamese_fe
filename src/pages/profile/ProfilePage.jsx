import { useEffect, useState } from 'react';
import { learnerService } from '@/services/learnerService';
import { useAuth } from '@/application/context/AuthContext';
import { ContentImage } from '@/components/common/ContentImage';

export function ProfilePage() {
  const { fetchProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState({ loading: true, error: '', message: '' });

  useEffect(() => {
    learnerService
      .getProfile()
      .then((p) => {
        setProfile(p);
        setForm(p);
      })
      .catch((e) => setState((s) => ({ ...s, error: e.message })))
      .finally(() => setState((s) => ({ ...s, loading: false })));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setState({ ...state, loading: true, error: '', message: '' });
    try {
      const r = await learnerService.updateProfile(form);
      const p = r.result ?? form;
      setProfile(p);
      setEditing(false);
      setState({ loading: false, error: '', message: r.message || 'Đã cập nhật hồ sơ thành công!' });
      fetchProfile();
    } catch (err) {
      setState({ loading: false, error: err.message, message: '' });
    }
  };

  if (state.loading && !profile) {
    return <div className="account-empty">Đang tải hồ sơ…</div>;
  }

  if (!profile) {
    return <div className="account-empty" role="alert">{state.error}</div>;
  }

  const goalLabels = {
    travel: '✈️ Du lịch & Khám phá',
    work: '💼 Công việc & Định cư',
    exam_vsl: '🎓 Thi chứng chỉ VSL',
    culture: '🏮 Văn hóa & Đời sống',
  };

  const languageLabels = {
    en: '🇬🇧 English',
    ko: '🇰🇷 한국어',
    ja: '🇯🇵 日本語',
    zh: '🇨🇳 中文',
    fr: '🇫🇷 Français',
  };

  return (
    <div className="account-page">
      <div className="account-header">
        <span className="account-pill">👤 Thông tin cá nhân</span>
        <h1 className="account-title">Hồ sơ người học</h1>
        <p className="account-desc">
          Quản lý thông tin tài khoản, mục tiêu học tập và cấp độ tiếng Việt của bạn.
        </p>
      </div>

      {state.error && <div className="auth-message auth-message-error">{state.error}</div>}
      {state.message && <div className="auth-message auth-message-success">{state.message}</div>}

      {/* Hero Avatar & Identity Card */}
      <section className="profile-hero">
        <div className="profile-avatar">
            <ContentImage
              src={profile.avatarUrl}
              alt={`Ảnh đại diện của ${profile.fullName || profile.username || 'học viên'}`}
              fallback={profile.fullName?.[0]?.toUpperCase() || 'H'}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
        </div>
        <div>
          <h2>{profile.fullName || profile.username}</h2>
          <p>{profile.email}</p>
        </div>
        <button
          type="button"
          className="account-outline-btn"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? 'Hủy bỏ' : '✏️ Chỉnh sửa'}
        </button>
      </section>

      {/* Edit Form vs Display List */}
      {editing ? (
        <form className="account-panel account-form" onSubmit={save}>
          <label>
            <span>Họ và tên</span>
            <input
              type="text"
              value={form.fullName || ''}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </label>

          <label>
            <span>Số điện thoại</span>
            <input
              type="tel"
              value={form.phoneNumber || ''}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              placeholder="VD: 0912345678"
            />
          </label>

          <label>
            <span>Ảnh đại diện (URL)</span>
            <input
              type="url"
              value={form.avatarUrl || ''}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
              placeholder="https://..."
            />
          </label>

          <label>
            <span>Quốc gia</span>
            <input
              type="text"
              value={form.country || ''}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="VD: United States"
            />
          </label>

          <label>
            <span>Ngôn ngữ mẹ đẻ</span>
            <select
              value={form.nativeLanguage || 'en'}
              onChange={(e) => setForm({ ...form, nativeLanguage: e.target.value })}
            >
              <option value="en">English</option>
              <option value="ko">한국어 (Korean)</option>
              <option value="ja">日本語 (Japanese)</option>
              <option value="zh">中文 (Chinese)</option>
              <option value="fr">Français (French)</option>
            </select>
          </label>

          <label>
            <span>Mục tiêu học tập</span>
            <select
              value={form.learningGoal || 'travel'}
              onChange={(e) => setForm({ ...form, learningGoal: e.target.value })}
            >
              <option value="travel">✈️ Du lịch & Khám phá</option>
              <option value="work">💼 Công việc & Định cư</option>
              <option value="exam_vsl">🎓 Thi chứng chỉ VSL</option>
              <option value="culture">🏮 Văn hóa & Đời sống</option>
            </select>
          </label>

          <label>
            <span>Cấp độ mong muốn</span>
            <select
              value={form.targetLevel || 'A1'}
              onChange={(e) => setForm({ ...form, targetLevel: e.target.value })}
            >
              <option value="A1">🌱 A1 – Mới bắt đầu</option>
              <option value="A2">🌿 A2 – Sơ cấp</option>
              <option value="B1">🌳 B1 – Trung cấp</option>
              <option value="B2">🚀 B2 – Trung cấp nâng cao</option>
            </select>
          </label>

          <button type="submit" disabled={state.loading}>
            {state.loading ? 'Đang lưu…' : 'Lưu thay đổi hồ sơ'}
          </button>
        </form>
      ) : (
        <div className="profile-rows">
          <div>
            <b>Mục tiêu học tiếng Việt</b>
            <span>{goalLabels[profile.learningGoal] || profile.learningGoal || 'Du lịch & Khám phá'}</span>
            <i>✓</i>
          </div>
          <div>
            <b>Trình độ hiện tại</b>
            <span>{profile.targetLevel ? `Cấp độ ${profile.targetLevel}` : 'A1 - Mới bắt đầu'}</span>
            <i>✓</i>
          </div>
          <div>
            <b>Ngôn ngữ mẹ đẻ</b>
            <span>{languageLabels[profile.nativeLanguage] || profile.nativeLanguage || 'English'}</span>
            <i>✓</i>
          </div>
          <div>
            <b>Quốc gia</b>
            <span>{profile.country || 'Chưa cập nhật'}</span>
            <i>✓</i>
          </div>
          <div>
            <b>Số điện thoại</b>
            <span>{profile.phoneNumber || 'Chưa cập nhật'}</span>
            <i>✓</i>
          </div>
        </div>
      )}
    </div>
  );
}

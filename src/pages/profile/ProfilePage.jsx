import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
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
    return <div className="account-empty"><BilingualText>{"Đang tải hồ sơ…"}</BilingualText></div>;
  }

  if (!profile) {
    return <div className="account-empty" role="alert"><BilingualText>{state.error}</BilingualText></div>;
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
        <span className="account-pill"><BilingualText>{"👤 Thông tin cá nhân"}</BilingualText></span>
        <h1 className="account-title"><BilingualText>{"Hồ sơ người học"}</BilingualText></h1>
        <p className="account-desc"><BilingualText>{"Quản lý thông tin tài khoản, mục tiêu học tập và cấp độ tiếng Việt của bạn."}</BilingualText></p>
      </div>

      {state.error && <div className="auth-message auth-message-error"><BilingualText>{state.error}</BilingualText></div>}
      {state.message && <div className="auth-message auth-message-success"><BilingualText>{state.message}</BilingualText></div>}

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
          <BilingualText>{editing ? 'Hủy bỏ' : '✏️ Chỉnh sửa'}</BilingualText>
        </button>
      </section>

      {/* Edit Form vs Display List */}
      {editing ? (
        <form className="account-panel account-form" onSubmit={save}>
          <label>
            <span><BilingualText>{"Họ và tên"}</BilingualText></span>
            <input
              type="text"
              value={form.fullName || ''}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </label>

          <label>
            <span><BilingualText>{"Số điện thoại"}</BilingualText></span>
            <input
              type="tel"
              value={form.phoneNumber || ''}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              placeholder="VD: 0912345678"
            />
          </label>

          <label>
            <span><BilingualText>{"Ảnh đại diện (URL)"}</BilingualText></span>
            <input
              type="url"
              value={form.avatarUrl || ''}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
              placeholder="https://..."
            />
          </label>

          <label>
            <span><BilingualText>{"Quốc gia"}</BilingualText></span>
            <input
              type="text"
              value={form.country || ''}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="VD: United States"
            />
          </label>

          <label>
            <span><BilingualText>{"Ngôn ngữ mẹ đẻ"}</BilingualText></span>
            <select
              value={form.nativeLanguage || 'en'}
              onChange={(e) => setForm({ ...form, nativeLanguage: e.target.value })}
            >
              <option value="en">{bilingualLabel("English")}</option>
              <option value="ko">{bilingualLabel("한국어 (Korean)")}</option>
              <option value="ja">{bilingualLabel("日本語 (Japanese)")}</option>
              <option value="zh">{bilingualLabel("中文 (Chinese)")}</option>
              <option value="fr">{bilingualLabel("Français (French)")}</option>
            </select>
          </label>

          <label>
            <span><BilingualText>{"Mục tiêu học tập"}</BilingualText></span>
            <select
              value={form.learningGoal || 'travel'}
              onChange={(e) => setForm({ ...form, learningGoal: e.target.value })}
            >
              <option value="travel">{bilingualLabel("✈️ Du lịch & Khám phá")}</option>
              <option value="work">{bilingualLabel("💼 Công việc & Định cư")}</option>
              <option value="exam_vsl">{bilingualLabel("🎓 Thi chứng chỉ VSL")}</option>
              <option value="culture">{bilingualLabel("🏮 Văn hóa & Đời sống")}</option>
            </select>
          </label>

          <label>
            <span><BilingualText>{"Cấp độ mong muốn"}</BilingualText></span>
            <select
              value={form.targetLevel || 'A1'}
              onChange={(e) => setForm({ ...form, targetLevel: e.target.value })}
            >
              <option value="A1">{bilingualLabel("🌱 A1 – Mới bắt đầu")}</option>
              <option value="A2">{bilingualLabel("🌿 A2 – Sơ cấp")}</option>
              <option value="B1">{bilingualLabel("🌳 B1 – Trung cấp")}</option>
              <option value="B2">{bilingualLabel("🚀 B2 – Trung cấp nâng cao")}</option>
            </select>
          </label>

          <button type="submit" disabled={state.loading}>
            <BilingualText>{state.loading ? 'Đang lưu…' : 'Lưu thay đổi hồ sơ'}</BilingualText>
          </button>
        </form>
      ) : (
        <div className="profile-rows">
          <div>
            <b><BilingualText>{"Mục tiêu học tiếng Việt"}</BilingualText></b>
            <span><BilingualText>{goalLabels[profile.learningGoal] || profile.learningGoal || 'Du lịch & Khám phá'}</BilingualText></span>
            <i>✓</i>
          </div>
          <div>
            <b><BilingualText>{"Trình độ hiện tại"}</BilingualText></b>
            <span><BilingualText>{profile.targetLevel ? `Cấp độ ${profile.targetLevel}` : 'A1 - Mới bắt đầu'}</BilingualText></span>
            <i>✓</i>
          </div>
          <div>
            <b><BilingualText>{"Ngôn ngữ mẹ đẻ"}</BilingualText></b>
            <span><BilingualText>{languageLabels[profile.nativeLanguage] || profile.nativeLanguage || 'English'}</BilingualText></span>
            <i>✓</i>
          </div>
          <div>
            <b><BilingualText>{"Quốc gia"}</BilingualText></b>
            <span><BilingualText>{profile.country || 'Chưa cập nhật'}</BilingualText></span>
            <i>✓</i>
          </div>
          <div>
            <b><BilingualText>{"Số điện thoại"}</BilingualText></b>
            <span><BilingualText>{profile.phoneNumber || 'Chưa cập nhật'}</BilingualText></span>
            <i>✓</i>
          </div>
        </div>
      )}
    </div>
  );
}

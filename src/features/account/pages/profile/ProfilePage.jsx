import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { useEffect, useRef, useState } from 'react';
import { learnerService } from '@/features/learning/api/learnerService';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ContentImage } from '@/shared/components/common/ContentImage';
import { Camera, LoaderCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';

const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

export function ProfilePage() {
  const { fetchProfile, updateCurrentUser } = useAuth();
  const avatarInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState({ loading: true, error: '', message: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarState, setAvatarState] = useState({ uploading: false, error: '' });

  useEffect(() => () => {
    if (avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

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
      setState({ loading: false, error: '', message: r.message || bilingualLabel('Đã cập nhật hồ sơ thành công!', 'Profile updated successfully!') });
      fetchProfile();
    } catch (err) {
      setState({ loading: false, error: err.message, message: '' });
    }
  };

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!AVATAR_TYPES.includes(file.type)) {
      setAvatarState({ uploading: false, error: bilingualLabel('Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP.', 'Only JPEG, PNG, or WebP images are accepted.') });
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarState({ uploading: false, error: bilingualLabel('Ảnh đại diện không được vượt quá 5MB.', 'Avatar image must not exceed 5MB.') });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setAvatarState({ uploading: true, error: '' });
    setState((current) => ({ ...current, error: '', message: '' }));
    try {
      const response = await learnerService.uploadAvatar(file);
      const updatedUser = response?.result ?? response;
      if (!updatedUser?.avatarUrl) throw new Error(response?.message || bilingualLabel('Máy chủ không trả về ảnh đại diện mới.', 'Server did not return a new avatar.'));
      setProfile((current) => ({ ...current, ...updatedUser }));
      setForm((current) => ({ ...current, ...updatedUser }));
      updateCurrentUser(updatedUser);
      setAvatarPreview('');
      setState((current) => ({ ...current, message: response?.message || bilingualLabel('Cập nhật ảnh đại diện thành công.', 'Avatar updated successfully.') }));
      toast.success(response?.message || bilingualLabel('Cập nhật ảnh đại diện thành công.', 'Avatar updated successfully.'));
    } catch (error) {
      setAvatarState({ uploading: false, error: error.message || bilingualLabel('Không thể tải ảnh đại diện lên.', 'Failed to upload avatar.') });
      return;
    }
    setAvatarState({ uploading: false, error: '' });
  };

  if (state.loading && !profile) {
    return <div className="account-empty"><BilingualText>{"Đang tải hồ sơ…"}</BilingualText></div>;
  }

  if (!profile) {
    return <div className="account-empty" role="alert"><BilingualText>{state.error}</BilingualText></div>;
  }

  const goalLabels = {
    daily_communication: { vi: '🗣️ Giao tiếp hằng ngày', en: '🗣️ Daily Communication' },
    travel: { vi: '✈️ Du lịch & Khám phá', en: '✈️ Travel & Exploration' },
    work: { vi: '💼 Công việc & Định cư', en: '💼 Work & Career' },
    exam_vsl: { vi: '🎓 Thi chứng chỉ VSL', en: '🎓 VSL Exam' },
    culture: { vi: '🏮 Văn hóa & Đời sống', en: '🏮 Culture & Life' },
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
        <div className={`profile-avatar profile-avatar--editable ${avatarState.uploading ? 'is-uploading' : ''}`}>
            <ContentImage
              src={avatarPreview || profile.avatarUrl}
              alt={bilingualLabel(`Ảnh đại diện của ${profile.fullName || profile.username || 'học viên'}`, `Avatar of ${profile.fullName || profile.username || 'learner'}`)}
              fallback={profile.fullName?.[0]?.toUpperCase() || 'H'}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
            <input ref={avatarInputRef} className="profile-avatar-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadAvatar} disabled={avatarState.uploading} aria-label={bilingualLabel("Chọn ảnh đại diện", "Select profile avatar")} />
            <button type="button" className="profile-avatar-action" onClick={() => avatarInputRef.current?.click()} disabled={avatarState.uploading} aria-label={bilingualLabel("Thay đổi ảnh đại diện", "Change profile photo")}>
              {avatarState.uploading ? <LoaderCircle className="profile-avatar-spinner" size={19}/> : <Camera size={19}/>}
            </button>
        </div>
        <div className="profile-identity">
          <h2>{profile.fullName || profile.username}</h2>
          <p>{profile.email}</p>
          <button type="button" className="profile-upload-link" onClick={() => avatarInputRef.current?.click()} disabled={avatarState.uploading}><Upload size={14}/><BilingualText>{avatarState.uploading ? 'Đang tải ảnh lên…' : 'Đổi ảnh đại diện'}</BilingualText></button>
          <small><BilingualText>{"JPEG, PNG hoặc WebP · tối đa 5MB"}</BilingualText></small>
          {avatarState.error && <span className="profile-avatar-error" role="alert"><BilingualText>{avatarState.error}</BilingualText></span>}
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
              <option value="travel">{bilingualLabel("Du lịch & Khám phá")}</option>
              <option value="work">{bilingualLabel("Công việc & Định cư")}</option>
              <option value="exam_vsl">{bilingualLabel("Thi chứng chỉ VSL")}</option>
              <option value="culture">{bilingualLabel("Văn hóa & Đời sống")}</option>
            </select>
          </label>

          <label>
            <span><BilingualText>{"Cấp độ mong muốn"}</BilingualText></span>
            <select
              value={form.targetLevel || 'A1'}
              onChange={(e) => setForm({ ...form, targetLevel: e.target.value })}
            >
              <option value="A1">{bilingualLabel("A1 – Mới bắt đầu")}</option>
              <option value="A2">{bilingualLabel("A2 – Sơ cấp")}</option>
              <option value="B1">{bilingualLabel("B1 – Trung cấp")}</option>
              <option value="B2">{bilingualLabel("B2 – Trung cấp nâng cao")}</option>
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
            <span>
              <BilingualText
                vi={goalLabels[profile.learningGoal]?.vi || profile.learningGoal || 'Du lịch & Khám phá'}
                en={goalLabels[profile.learningGoal]?.en || profile.learningGoal || 'Travel & Exploration'}
              />
            </span>
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

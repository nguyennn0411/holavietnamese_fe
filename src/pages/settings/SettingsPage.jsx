import { useCallback, useEffect, useState } from 'react';
import { learnerService } from '@/services/learnerService';

const defaultSettings = {
  audioSpeed: 1,
  pronunciationHintsEnabled: true,
  autoTranslateEnabled: true,
  notificationsEnabled: true,
  dailyLearningGoalMinutes: 15,
};

export function SettingsPage() {
  const [form, setForm] = useState(null);
  const [state, setState] = useState({ loading: true, error: '', message: '' });

  const load = useCallback(async () => {
    try {
      const remote = await learnerService.getSettings();
      setForm({ ...defaultSettings, ...remote });
    } catch (e) {
      setState((s) => ({ ...s, error: e.message || 'Không thể tải cài đặt.' }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e) => {
    e.preventDefault();
    setState({ ...state, loading: true, error: '', message: '' });
    try {
      const res = await learnerService.updateSettings(form);
      setState({
        loading: false,
        error: '',
        message: res.message || 'Đã lưu thiết lập thành công!',
      });
    } catch (err) {
      setState({ loading: false, error: err.message, message: '' });
    }
  };

  if (!form) {
    return (
      <div className="account-empty">
        {state.error || 'Đang tải cài đặt…'}
      </div>
    );
  }

  const toggle = (key) => setForm({ ...form, [key]: !form[key] });

  return (
    <div className="account-page">
      <div className="account-header">
        <span className="account-pill">⚙️ Tùy biến trải nghiệm</span>
        <h1 className="account-title">Cài đặt ứng dụng</h1>
        <p className="account-desc">
          Tùy chỉnh tốc độ bài học, tính năng trợ giảng và thông báo nhắc nhở hàng ngày.
        </p>
      </div>

      {state.error && <div className="auth-message auth-message-error">{state.error}</div>}
      {state.message && <div className="auth-message auth-message-success">{state.message}</div>}

      <form className="settings-list" onSubmit={save}>
        {/* Audio settings */}
        <label>
          <div>
            <b>Tốc độ phát âm (Audio Speed)</b>
            <small style={{ display: 'block', color: 'var(--color-sage)', marginTop: '2px' }}>
              Điều chỉnh tốc độ đọc các đoạn hội thoại mẫu
            </small>
          </div>
          <select
            value={form.audioSpeed || 1}
            onChange={(e) => setForm({ ...form, audioSpeed: Number(e.target.value) })}
          >
            <option value={0.75}>0.75× Chậm rãi</option>
            <option value={1}>1.0× Bình thường (Chuẩn)</option>
            <option value={1.25}>1.25× Nhanh tự nhiên</option>
          </select>
        </label>

        {/* Daily Goal */}
        <label>
          <div>
            <b>Mục tiêu thời gian mỗi ngày</b>
            <small style={{ display: 'block', color: 'var(--color-sage)', marginTop: '2px' }}>
              Thời lượng học kỳ vọng để hệ thống thông báo nhắc nhở
            </small>
          </div>
          <select
            value={form.dailyLearningGoalMinutes || 15}
            onChange={(e) => setForm({ ...form, dailyLearningGoalMinutes: Number(e.target.value) })}
          >
            <option value={10}>10 phút / ngày (Thư giãn)</option>
            <option value={15}>15 phút / ngày (Tiêu chuẩn)</option>
            <option value={30}>30 phút / ngày (Nghiêm túc)</option>
            <option value={45}>45 phút / ngày (Cấp tốc)</option>
          </select>
        </label>

        {/* Toggleable features */}
        <label>
          <div>
            <b>Gợi ý phát âm & khẩu hình</b>
            <small style={{ display: 'block', color: 'var(--color-sage)', marginTop: '2px' }}>
              Hiển thị mẹo đặt lưỡi và lấy hơi cho 6 thanh điệu tiếng Việt
            </small>
          </div>
          <input
            type="checkbox"
            checked={!!form.pronunciationHintsEnabled}
            onChange={() => toggle('pronunciationHintsEnabled')}
          />
        </label>

        <label>
          <div>
            <b>Tự động dịch nghĩa song ngữ</b>
            <small style={{ display: 'block', color: 'var(--color-sage)', marginTop: '2px' }}>
              Hiển thị nghĩa tiếng Anh bên dưới các cụm từ mới
            </small>
          </div>
          <input
            type="checkbox"
            checked={!!form.autoTranslateEnabled}
            onChange={() => toggle('autoTranslateEnabled')}
          />
        </label>

        <label>
          <div>
            <b>Thông báo nhắc nhở chuỗi Streak</b>
            <small style={{ display: 'block', color: 'var(--color-sage)', marginTop: '2px' }}>
              Nhắc bạn học bài trước 21h hàng ngày để không bị đứt chuỗi
            </small>
          </div>
          <input
            type="checkbox"
            checked={!!form.notificationsEnabled}
            onChange={() => toggle('notificationsEnabled')}
          />
        </label>

        <button type="submit" disabled={state.loading}>
          {state.loading ? 'Đang lưu…' : 'Lưu tất cả cài đặt'}
        </button>
      </form>
    </div>
  );
}

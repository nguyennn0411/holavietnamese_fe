import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import '@/presentation/styles/admin.css';

export function AdminScenarioBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    topic: 'dining',
    topicName: 'Ẩm thực & Quán xá',
    level: 'A1',
    destination: 'Hà Nội',
    difficulty: 'Dễ',
    status: 'ACTIVE',
    thumbnail: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    overview: '',
    contextStory: '',
    learnerRole: '',
    aiRole: {
      name: '',
      avatar: '👩‍🍳',
      role: '',
      tone: '',
      initialGreeting: '',
    },
    objectives: [
      'Chào hỏi và xác nhận chỗ ngồi',
      'Gọi món chính kèm yêu cầu khẩu vị riêng',
    ],
    sampleHints: [
      'Dạ chào bạn, cho tôi hỏi...',
    ],
    endCondition: {
      maxTurns: 10,
      requireAllObjectives: true,
    },
    criteria: ['Lưu loát', 'Vốn từ vựng', 'Ngữ pháp', 'Sắc thái văn hóa'],
  });

  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'simulation'
  const [simMessages, setSimMessages] = useState([]);
  const [simInput, setSimInput] = useState('');

  useEffect(() => {
    if (!isNew) {
      const existing = adminCultureAiService.getScenario(id);
      if (existing) {
        setFormData({
          ...existing,
          objectives: existing.objectives?.map(o => typeof o === 'string' ? o : o.label) || [],
          sampleHints: existing.sampleHints || [],
          criteria: existing.criteria || ['Lưu loát', 'Vốn từ vựng', 'Ngữ pháp', 'Sắc thái văn hóa'],
          endCondition: existing.endCondition || { maxTurns: 10, requireAllObjectives: true },
        });

        // Initialize simulation chat with initial greeting
        if (existing.aiRole?.initialGreeting) {
          setSimMessages([
            { sender: 'ai', text: existing.aiRole.initialGreeting },
          ]);
        }
      }
    }
  }, [id, isNew]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddObjective = () => {
    setFormData(prev => ({ ...prev, objectives: [...prev.objectives, ''] }));
  };

  const handleObjectiveChange = (index, val) => {
    const list = [...formData.objectives];
    list[index] = val;
    setFormData(prev => ({ ...prev, objectives: list }));
  };

  const handleRemoveObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddHint = () => {
    setFormData(prev => ({ ...prev, sampleHints: [...prev.sampleHints, ''] }));
  };

  const handleHintChange = (index, val) => {
    const list = [...formData.sampleHints];
    list[index] = val;
    setFormData(prev => ({ ...prev, sampleHints: list }));
  };

  const handleRemoveHint = (index) => {
    setFormData(prev => ({
      ...prev,
      sampleHints: prev.sampleHints.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên kịch bản!');
      return;
    }

    const payload = {
      ...formData,
      id: formData.id || `sc-${Date.now()}`,
      objectives: formData.objectives.filter(Boolean).map((label, idx) => ({
        id: `task-${idx + 1}`,
        label,
        completed: false,
      })),
      sampleHints: formData.sampleHints.filter(Boolean),
    };

    adminCultureAiService.saveScenario(payload);
    showToast('Đã lưu cấu hình kịch bản trong Scenario Builder!');
    setTimeout(() => {
      navigate('/admin/ai-scenarios');
    }, 800);
  };

  const handleSimulateSend = () => {
    if (!simInput.trim()) return;
    const userText = simInput.trim();
    setSimInput('');
    setSimMessages(prev => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'ai', text: `(Mô phỏng AI "${formData.aiRole.name}"): Cảm ơn bạn đã phản hồi! Tôi đang đóng vai với phong cách: "${formData.aiRole.tone}". Câu nói của bạn rất phù hợp với ngữ cảnh!` },
    ]);
  };

  return (
    <div className="admin-content">
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#245c48', color: '#fff', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <nav style={{ fontSize: '13px', color: '#7a6458', marginBottom: '6px' }}>
            <Link to="/admin/ai-scenarios" style={{ color: '#a62a24', textDecoration: 'none' }}>← Danh sách kịch bản AI</Link>
          </nav>
          <h1 style={{ margin: 0, fontSize: '30px' }}>
            Scenario Builder: {formData.title || 'Kịch bản mới'}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className={`button ${activeTab === 'builder' ? '' : 'secondary'}`}
            onClick={() => setActiveTab('builder')}
            style={{ fontSize: '13px' }}
          >
            ⚙️ Cấu hình kịch bản
          </button>
          <button
            type="button"
            className={`button ${activeTab === 'simulation' ? '' : 'secondary'}`}
            onClick={() => setActiveTab('simulation')}
            style={{ fontSize: '13px' }}
          >
            🧪 Thử nghiệm giả lập
          </button>
          <button
            type="button"
            className="button"
            onClick={handleSubmit}
            style={{ background: '#245c48', borderColor: '#245c48', fontSize: '13px' }}
          >
            💾 Lưu kịch bản
          </button>
        </div>
      </div>

      {activeTab === 'builder' ? (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', alignItems: 'start' }}>
            {/* Left Column: Roles, Story, Objectives, Greeting */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* General Overview */}
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: '#381e18' }}>1. Thông tin chung & Bối cảnh</h3>

                <label>
                  Tên kịch bản nhập vai:
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ví dụ: Gọi món tại quán Phở gia truyền Hà Nội..."
                  />
                </label>

                <label style={{ marginTop: '12px' }}>
                  Bối cảnh tình huống (Context Story):
                  <textarea
                    rows={3}
                    value={formData.overview}
                    onChange={e => setFormData({ ...formData, overview: e.target.value })}
                    placeholder="Mô tả hoàn cảnh xuất phát khi học viên bắt đầu kịch bản..."
                  />
                </label>
              </div>

              {/* Roles Definition */}
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: '#381e18' }}>2. Thiết lập vai trò (Roles)</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '12px' }}>
                  <label>
                    Avatar:
                    <input
                      type="text"
                      value={formData.aiRole.avatar}
                      onChange={e => setFormData({ ...formData, aiRole: { ...formData.aiRole, avatar: e.target.value } })}
                      style={{ textAlign: 'center', fontSize: '18px' }}
                    />
                  </label>
                  <label>
                    Tên nhân vật AI:
                    <input
                      type="text"
                      required
                      value={formData.aiRole.name}
                      onChange={e => setFormData({ ...formData, aiRole: { ...formData.aiRole, name: e.target.value } })}
                      placeholder="Cô Mai (Chủ quán Phở), Bác Hùng (Tài xế)..."
                    />
                  </label>
                </div>

                <label style={{ marginTop: '12px' }}>
                  Mô tả vai trò AI:
                  <input
                    type="text"
                    value={formData.aiRole.role}
                    onChange={e => setFormData({ ...formData, aiRole: { ...formData.aiRole, role: e.target.value } })}
                    placeholder="Chủ quán phở Hà Nội nhanh nhẹn, xưng hô 'cô - cháu'..."
                  />
                </label>

                <label style={{ marginTop: '12px' }}>
                  Tính cách & Tông giọng xưng hô của AI:
                  <input
                    type="text"
                    value={formData.aiRole.tone}
                    onChange={e => setFormData({ ...formData, aiRole: { ...formData.aiRole, tone: e.target.value } })}
                    placeholder="Thân thiện, xởi lởi, giọng Bắc chuẩn Tràng An, phục vụ nhanh nhẹn..."
                  />
                </label>

                <label style={{ marginTop: '14px', borderTop: '1px dashed #ebd8c7', paddingTop: '14px' }}>
                  Vai trò của Học viên (Learner Role):
                  <input
                    type="text"
                    value={formData.learnerRole}
                    onChange={e => setFormData({ ...formData, learnerRole: e.target.value })}
                    placeholder="Du khách lần đầu thưởng thức phở truyền thống phố cổ..."
                  />
                </label>
              </div>

              {/* Initial Greeting & Sample Hints */}
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: '#381e18' }}>3. Lời thoại mở đầu & Gợi ý trả lời</h3>

                <label>
                  Câu chào mở đầu của AI (Initial Greeting):
                  <textarea
                    rows={3}
                    required
                    value={formData.aiRole.initialGreeting}
                    onChange={e => setFormData({ ...formData, aiRole: { ...formData.aiRole, initialGreeting: e.target.value } })}
                    placeholder="Câu đầu tiên AI sẽ tự động nói khi học viên vào phiên..."
                  />
                </label>

                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#381e18' }}>Gợi ý câu trả lời mẫu cho học viên:</span>
                    <button type="button" className="button secondary" onClick={handleAddHint} style={{ fontSize: '11px', padding: '4px 8px' }}>
                      + Thêm gợi ý
                    </button>
                  </div>
                  {formData.sampleHints.map((hint, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <input
                        type="text"
                        value={hint}
                        onChange={e => handleHintChange(idx, e.target.value)}
                        placeholder="Mẫu câu gợi ý..."
                        style={{ fontSize: '13px' }}
                      />
                      <button type="button" onClick={() => handleRemoveHint(idx)} style={{ background: 'transparent', border: 'none', color: '#c62828', cursor: 'pointer' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objectives Builder */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#381e18' }}>4. Danh sách nhiệm vụ (Objectives Checklist)</h3>
                  <button type="button" className="button secondary" onClick={handleAddObjective} style={{ fontSize: '11px', padding: '4px 10px' }}>
                    + Thêm nhiệm vụ
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.objectives.map((task, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#9f2d20', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 800 }}>
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={task}
                        onChange={e => handleObjectiveChange(idx, e.target.value)}
                        placeholder={`Mục tiêu ${idx + 1}...`}
                        style={{ fontSize: '13px' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveObjective(idx)}
                        style={{ background: 'transparent', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '16px' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Settings, End conditions, Criteria */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: '#381e18' }}>Phân loại kịch bản</h3>

                <label>
                  Trạng thái:
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="ACTIVE">Đang hoạt động (Active)</option>
                    <option value="DRAFT">Bản nháp (Draft)</option>
                    <option value="ARCHIVED">Lưu trữ (Archived)</option>
                  </select>
                </label>

                <label style={{ marginTop: '12px' }}>
                  Trình độ (CEFR):
                  <select value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })}>
                    <option value="A1">A1 - Sơ cấp 1</option>
                    <option value="A2">A2 - Sơ cấp 2</option>
                    <option value="B1">B1 - Trung cấp 1</option>
                    <option value="B2">B2 - Trung cấp 2</option>
                    <option value="C1">C1 - Nâng cao</option>
                  </select>
                </label>

                <label style={{ marginTop: '12px' }}>
                  Chủ đề kịch bản:
                  <select value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })}>
                    <option value="dining">🍜 Ẩm thực & Quán xá</option>
                    <option value="shopping">🛍️ Mua sắm & Mặc cả</option>
                    <option value="travel">🛵 Di chuyển & Du lịch</option>
                    <option value="hospitality">🏨 Khách sạn & Nghỉ dưỡng</option>
                    <option value="social">🏡 Gia đình & Bạn bè</option>
                    <option value="work">💼 Giao tiếp công sở</option>
                  </select>
                </label>

                <label style={{ marginTop: '12px' }}>
                  Địa điểm bối cảnh:
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Hà Nội, Sài Gòn, Đà Nẵng..."
                  />
                </label>
              </div>

              {/* End Conditions & Criteria */}
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: '#381e18' }}>Điều kiện kết thúc phiên</h3>

                <label>
                  Số lượt trao đổi tối đa (Max Turns):
                  <input
                    type="number"
                    min={4}
                    max={30}
                    value={formData.endCondition.maxTurns}
                    onChange={e => setFormData({ ...formData, endCondition: { ...formData.endCondition, maxTurns: parseInt(e.target.value) || 10 } })}
                  />
                </label>

                <label style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.endCondition.requireAllObjectives}
                    onChange={e => setFormData({ ...formData, endCondition: { ...formData.endCondition, requireAllObjectives: e.target.checked } })}
                    style={{ width: 'auto' }}
                  />
                  <span>Yêu cầu hoàn thành tất cả mục tiêu mới mở nút kết thúc</span>
                </label>
              </div>

              {/* Feedback criteria */}
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: '#381e18' }}>Tiêu chí phản hồi & Đánh giá</h3>
                <p style={{ fontSize: '12.5px', color: '#685044', margin: '0 0 12px' }}>
                  Hệ thống phân tích 4 thang điểm cốt lõi dựa trên tương tác thực tế:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ background: '#faf3e8', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                    ✓ <strong>Độ lưu loát (Fluency)</strong>: Khả năng phản xạ và nhịp đối thoại.
                  </div>
                  <div style={{ background: '#faf3e8', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                    ✓ <strong>Vốn từ vựng (Vocabulary)</strong>: Từ ngữ chính xác theo chủ đề.
                  </div>
                  <div style={{ background: '#faf3e8', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                    ✓ <strong>Ngữ pháp (Grammar)</strong>: Trật tự từ và hư từ biểu cảm.
                  </div>
                  <div style={{ background: '#faf3e8', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                    ✓ <strong>Văn hóa & Ngữ cảnh (Culture)</strong>: Kính ngữ, thái độ lịch thiệp.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Interactive Simulation Mode */
        <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', background: '#fff' }}>
          <div style={{ borderBottom: '1px solid #ebd9c8', paddingBottom: '14px', marginBottom: '18px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#a62a24', textTransform: 'uppercase' }}>
              SIMULATION TEST SANDBOX
            </span>
            <h2 style={{ margin: '4px 0', fontSize: '20px' }}>
              Thử nghiệm kịch bản: {formData.aiRole.name} ({formData.title})
            </h2>
          </div>

          <div style={{ minHeight: '280px', maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
            {simMessages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user' ? '#245c48' : '#faf3e8',
                  color: m.sender === 'user' ? '#fff' : '#331d17',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid #f0e2d3', paddingTop: '14px' }}>
            <input
              type="text"
              placeholder="Nhập thử phản hồi của học viên..."
              value={simInput}
              onChange={e => setSimInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSimulateSend()}
            />
            <button type="button" className="button" onClick={handleSimulateSend}>
              Gửi thử
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminCultureAiService } from '@/services/adminCultureAiService';

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
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: 'var(--color-ink)', color: 'var(--color-surface)', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          <BilingualText>{toast}</BilingualText>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <nav style={{ fontSize: '13px', color: 'var(--color-forest)', marginBottom: '6px' }}>
            <Link to="/admin/ai-scenarios" style={{ color: 'var(--color-red-hover)', textDecoration: 'none' }}><BilingualText>{"← Danh sách kịch bản AI"}</BilingualText></Link>
          </nav>
          <h1 style={{ margin: 0, fontSize: '30px' }}><BilingualText vi={<>Trình tạo kịch bản: {formData.title || 'Kịch bản mới'}</>} en={<>Scenario builder: {formData.title || 'New scenario'}</>} />
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className={`button ${activeTab === 'builder' ? '' : 'secondary'}`}
            onClick={() => setActiveTab('builder')}
            style={{ fontSize: '13px' }}
          ><BilingualText>{"⚙️ Cấu hình kịch bản"}</BilingualText></button>
          <button
            type="button"
            className={`button ${activeTab === 'simulation' ? '' : 'secondary'}`}
            onClick={() => setActiveTab('simulation')}
            style={{ fontSize: '13px' }}
          ><BilingualText>{"🧪 Thử nghiệm giả lập"}</BilingualText></button>
          <button
            type="button"
            className="button"
            onClick={handleSubmit}
            style={{ background: 'var(--color-ink)', borderColor: 'var(--color-ink)', fontSize: '13px' }}
          ><BilingualText>{"💾 Lưu kịch bản"}</BilingualText></button>
        </div>
      </div>

      {activeTab === 'builder' ? (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', alignItems: 'start' }}>
            {/* Left Column: Roles, Story, Objectives, Greeting */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* General Overview */}
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--color-ink)' }}><BilingualText>{"1. Thông tin chung & Bối cảnh"}</BilingualText></h3>

                <label><BilingualText>{"Tên kịch bản nhập vai:"}</BilingualText><input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder={bilingualLabel("Ví dụ: Gọi món tại quán Phở gia truyền Hà Nội...")}
                  />
                </label>

                <label style={{ marginTop: '12px' }}><BilingualText>{"Bối cảnh tình huống (Context Story):"}</BilingualText><textarea
                    rows={3}
                    value={formData.overview}
                    onChange={e => setFormData({ ...formData, overview: e.target.value })}
                    placeholder={bilingualLabel("Mô tả hoàn cảnh xuất phát khi học viên bắt đầu kịch bản...")}
                  />
                </label>
              </div>

              {/* Roles Definition */}
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--color-ink)' }}><BilingualText>{"2. Thiết lập vai trò (Roles)"}</BilingualText></h3>

                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '12px' }}>
                  <label><BilingualText>{"Avatar:"}</BilingualText><input
                      type="text"
                      value={formData.aiRole.avatar}
                      onChange={e => setFormData({ ...formData, aiRole: { ...formData.aiRole, avatar: e.target.value } })}
                      style={{ textAlign: 'center', fontSize: '18px' }}
                    />
                  </label>
                  <label><BilingualText>{"Tên nhân vật AI:"}</BilingualText><input
                      type="text"
                      required
                      value={formData.aiRole.name}
                      onChange={e => setFormData({ ...formData, aiRole: { ...formData.aiRole, name: e.target.value } })}
                      placeholder={bilingualLabel("Cô Mai (Chủ quán Phở), Bác Hùng (Tài xế)...")}
                    />
                  </label>
                </div>

                <label style={{ marginTop: '12px' }}><BilingualText>{"Mô tả vai trò AI:"}</BilingualText><input
                    type="text"
                    value={formData.aiRole.role}
                    onChange={e => setFormData({ ...formData, aiRole: { ...formData.aiRole, role: e.target.value } })}
                    placeholder={bilingualLabel("Chủ quán phở Hà Nội nhanh nhẹn, xưng hô 'cô - cháu'...")}
                  />
                </label>

                <label style={{ marginTop: '12px' }}><BilingualText>{"Tính cách & Tông giọng xưng hô của AI:"}</BilingualText><input
                    type="text"
                    value={formData.aiRole.tone}
                    onChange={e => setFormData({ ...formData, aiRole: { ...formData.aiRole, tone: e.target.value } })}
                    placeholder={bilingualLabel("Thân thiện, xởi lởi, giọng Bắc chuẩn Tràng An, phục vụ nhanh nhẹn...")}
                  />
                </label>

                <label style={{ marginTop: '14px', borderTop: '1px dashed var(--color-border)', paddingTop: '14px' }}><BilingualText>{"Vai trò của Học viên (Learner Role):"}</BilingualText><input
                    type="text"
                    value={formData.learnerRole}
                    onChange={e => setFormData({ ...formData, learnerRole: e.target.value })}
                    placeholder={bilingualLabel("Du khách lần đầu thưởng thức phở truyền thống phố cổ...")}
                  />
                </label>
              </div>

              {/* Initial Greeting & Sample Hints */}
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--color-ink)' }}><BilingualText>{"3. Lời thoại mở đầu & Gợi ý trả lời"}</BilingualText></h3>

                <label><BilingualText>{"Câu chào mở đầu của AI (Initial Greeting):"}</BilingualText><textarea
                    rows={3}
                    required
                    value={formData.aiRole.initialGreeting}
                    onChange={e => setFormData({ ...formData, aiRole: { ...formData.aiRole, initialGreeting: e.target.value } })}
                    placeholder={bilingualLabel("Câu đầu tiên AI sẽ tự động nói khi học viên vào phiên...")}
                  />
                </label>

                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ink)' }}><BilingualText>{"Gợi ý câu trả lời mẫu cho học viên:"}</BilingualText></span>
                    <button type="button" className="button secondary" onClick={handleAddHint} style={{ fontSize: '11px', padding: '4px 8px' }}><BilingualText>{"+ Thêm gợi ý"}</BilingualText></button>
                  </div>
                  {formData.sampleHints.map((hint, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <input
                        type="text"
                        value={hint}
                        onChange={e => handleHintChange(idx, e.target.value)}
                        placeholder={bilingualLabel("Mẫu câu gợi ý...")}
                        style={{ fontSize: '13px' }}
                      />
                      <button type="button" onClick={() => handleRemoveHint(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--color-red)', cursor: 'pointer' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objectives Builder */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--color-ink)' }}><BilingualText>{"4. Danh sách nhiệm vụ (Objectives Checklist)"}</BilingualText></h3>
                  <button type="button" className="button secondary" onClick={handleAddObjective} style={{ fontSize: '11px', padding: '4px 10px' }}><BilingualText>{"+ Thêm nhiệm vụ"}</BilingualText></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.objectives.map((task, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-red-hover)', color: 'var(--color-surface)', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 800 }}>
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
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-red)', cursor: 'pointer', fontSize: '16px' }}
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
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--color-ink)' }}><BilingualText>{"Phân loại kịch bản"}</BilingualText></h3>

                <label><BilingualText>{"Trạng thái:"}</BilingualText><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="ACTIVE">{bilingualLabel("Đang hoạt động (Active)")}</option>
                    <option value="DRAFT">{bilingualLabel("Bản nháp (Draft)")}</option>
                    <option value="ARCHIVED">{bilingualLabel("Lưu trữ (Archived)")}</option>
                  </select>
                </label>

                <label style={{ marginTop: '12px' }}><BilingualText>{"Trình độ (CEFR):"}</BilingualText><select value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })}>
                    <option value="A1">{bilingualLabel("A1 - Sơ cấp 1")}</option>
                    <option value="A2">{bilingualLabel("A2 - Sơ cấp 2")}</option>
                    <option value="B1">{bilingualLabel("B1 - Trung cấp 1")}</option>
                    <option value="B2">{bilingualLabel("B2 - Trung cấp 2")}</option>
                    <option value="C1">{bilingualLabel("C1 - Nâng cao")}</option>
                  </select>
                </label>

                <label style={{ marginTop: '12px' }}><BilingualText>{"Chủ đề kịch bản:"}</BilingualText><select value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })}>
                    <option value="dining">{bilingualLabel("🍜 Ẩm thực & Quán xá")}</option>
                    <option value="shopping">{bilingualLabel("🛍️ Mua sắm & Mặc cả")}</option>
                    <option value="travel">{bilingualLabel("🛵 Di chuyển & Du lịch")}</option>
                    <option value="hospitality">{bilingualLabel("🏨 Khách sạn & Nghỉ dưỡng")}</option>
                    <option value="social">{bilingualLabel("🏡 Gia đình & Bạn bè")}</option>
                    <option value="work">{bilingualLabel("💼 Giao tiếp công sở")}</option>
                  </select>
                </label>

                <label style={{ marginTop: '12px' }}><BilingualText>{"Địa điểm bối cảnh:"}</BilingualText><input
                    type="text"
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    placeholder={bilingualLabel("Hà Nội, Sài Gòn, Đà Nẵng...")}
                  />
                </label>
              </div>

              {/* End Conditions & Criteria */}
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--color-ink)' }}><BilingualText>{"Điều kiện kết thúc phiên"}</BilingualText></h3>

                <label><BilingualText>{"Số lượt trao đổi tối đa (Max Turns):"}</BilingualText><input
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
                  <span><BilingualText>{"Yêu cầu hoàn thành tất cả mục tiêu mới mở nút kết thúc"}</BilingualText></span>
                </label>
              </div>

              {/* Feedback criteria */}
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--color-ink)' }}><BilingualText>{"Tiêu chí phản hồi & Đánh giá"}</BilingualText></h3>
                <p style={{ fontSize: '12.5px', color: 'var(--color-red-hover)', margin: '0 0 12px' }}><BilingualText>{"Hệ thống phân tích 4 thang điểm cốt lõi dựa trên tương tác thực tế:"}</BilingualText></p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ background: 'var(--color-cream)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                    ✓ <strong><BilingualText>{"Độ lưu loát (Fluency)"}</BilingualText></strong><BilingualText>{": Khả năng phản xạ và nhịp đối thoại."}</BilingualText></div>
                  <div style={{ background: 'var(--color-cream)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                    ✓ <strong><BilingualText>{"Vốn từ vựng (Vocabulary)"}</BilingualText></strong><BilingualText>{": Từ ngữ chính xác theo chủ đề."}</BilingualText></div>
                  <div style={{ background: 'var(--color-cream)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                    ✓ <strong><BilingualText>{"Ngữ pháp (Grammar)"}</BilingualText></strong><BilingualText>{": Trật tự từ và hư từ biểu cảm."}</BilingualText></div>
                  <div style={{ background: 'var(--color-cream)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                    ✓ <strong><BilingualText>{"Văn hóa & Ngữ cảnh (Culture)"}</BilingualText></strong><BilingualText>{": Kính ngữ, thái độ lịch thiệp."}</BilingualText></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Interactive Simulation Mode */
        <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--color-surface)' }}>
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '18px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-red-hover)', textTransform: 'uppercase' }}><BilingualText>{"SIMULATION TEST SANDBOX"}</BilingualText></span>
            <h2 style={{ margin: '4px 0', fontSize: '20px' }}><BilingualText>{"Thử nghiệm kịch bản:"}</BilingualText>{formData.aiRole.name} (<BilingualText vi={formData.titleVi || formData.title} en={formData.title} />)
            </h2>
          </div>

          <div style={{ minHeight: '280px', maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
            {simMessages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user' ? 'var(--color-ink)' : 'var(--color-cream)',
                  color: m.sender === 'user' ? 'var(--color-surface)' : 'var(--color-ink)',
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

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
            <input
              type="text"
              placeholder={bilingualLabel("Nhập thử phản hồi của học viên...")}
              value={simInput}
              onChange={e => setSimInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSimulateSend()}
            />
            <button type="button" className="button" onClick={handleSimulateSend}><BilingualText>{"Gửi thử"}</BilingualText></button>
          </div>
        </div>
      )}
    </div>
  );
}

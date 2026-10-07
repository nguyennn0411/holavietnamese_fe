import { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiRoleplayService } from '@/services/aiRoleplayService';
import '@/presentation/styles/ai-tutor.css';

export function ScenarioListPage() {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const levels = aiRoleplayService.getLevels();
  const topics = aiRoleplayService.getTopics();
  const scenarios = aiRoleplayService.listScenarios({
    search,
    level: selectedLevel,
    topic: selectedTopic,
  });

  return (
    <div className="p4-container">
      {/* Header */}
      <div>
        <span className="p4-header-badge">Roleplay & Scenarios</span>
        <h1 className="p4-title">Kịch bản nhập vai thực tế</h1>
        <p className="p4-subtitle">
          Luyện phản xạ giao tiếp tự nhiên cùng AI trong các tình huống đời thực: từ gọi món phở Bát Đàn, trả giá chợ Bến Thành cho đến phỏng vấn xin việc và ra mắt gia đình người Việt.
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#fffdfa', border: '1px solid #ebd9c8', borderRadius: '18px', padding: '20px', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm kịch bản theo tên, địa điểm hoặc bối cảnh..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #dccbb8' }}
          />
        </div>

        {/* Level & Topic Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#685145' }}>Trình độ:</span>
            {levels.map(lvl => (
              <button
                key={lvl.id}
                className={`destination-pill-btn ${selectedLevel === lvl.id ? 'active' : ''}`}
                onClick={() => setSelectedLevel(lvl.id)}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#685145' }}>Chủ đề:</span>
            {topics.map(t => (
              <button
                key={t.id}
                className={`destination-pill-btn ${selectedTopic === t.id ? 'active' : ''}`}
                onClick={() => setSelectedTopic(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#381e18', margin: 0 }}>
          Danh sách kịch bản ({scenarios.length})
        </h2>
        {(search || selectedLevel !== 'all' || selectedTopic !== 'all') && (
          <button
            onClick={() => { setSearch(''); setSelectedLevel('all'); setSelectedTopic('all'); }}
            style={{ background: 'transparent', border: 'none', color: '#9f2d20', fontSize: '13px', fontWeight: 650, cursor: 'pointer' }}
          >
            ✕ Xóa bộ lọc
          </button>
        )}
      </div>

      {scenarios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fffdf9', borderRadius: '18px', border: '1px solid #ebd9c8' }}>
          <p style={{ fontSize: '40px', margin: 0 }}>🎭</p>
          <h3 style={{ fontSize: '18px', color: '#4a2c22', margin: '10px 0' }}>Chưa tìm thấy kịch bản phù hợp</h3>
          <p style={{ color: '#8c7367', fontSize: '14px' }}>Hãy thử điều chỉnh cấp độ hoặc chủ đề để khám phá thêm nhiều kịch bản thú vị nhé!</p>
        </div>
      ) : (
        <div className="scenario-grid">
          {scenarios.map(sc => (
            <div key={sc.id} className="scenario-card">
              <div className="scenario-card__media">
                <img src={sc.thumbnail} alt={sc.title} />
                <span className="culture-card__destination">📍 {sc.destination}</span>
              </div>

              <div className="scenario-card__body">
                <div className="role-badge-row">
                  <span className="badge-level">{sc.level}</span>
                  <span className="badge-topic">{sc.topicLabel}</span>
                  <span style={{ fontSize: '11px', color: '#7a6054', display: 'flex', alignItems: 'center' }}>
                    ⏱️ {sc.duration}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 750, color: '#2d1813', margin: '0 0 8px', lineHeight: 1.35 }}>
                  {sc.title}
                </h3>

                <p style={{ fontSize: '13.5px', color: '#6b574d', margin: '0 0 14px', lineHeight: 1.5 }}>
                  {sc.overview}
                </p>

                {/* Role snapshot */}
                <div className="scenario-role-box">
                  <div>
                    <span style={{ fontWeight: 700, color: '#9f2d20' }}>AI đóng vai:</span> {sc.aiRole.name}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: '#245c48' }}>Bạn đóng vai:</span> {sc.learnerRole.role}
                  </div>
                </div>

                {/* Objectives snapshot */}
                <div style={{ fontSize: '12px', color: '#836a5e', margin: '6px 0 16px' }}>
                  🎯 <strong>{sc.objectives.length} nhiệm vụ</strong> cần hoàn thành trong phiên
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <Link
                    to={`/ai-scenarios/${sc.id}`}
                    className="button secondary"
                    style={{ flex: 1, fontSize: '13px', padding: '10px' }}
                  >
                    Xem chi tiết
                  </Link>
                  <Link
                    to={`/ai-roleplay/${sc.id}`}
                    className="button"
                    style={{ flex: 1, fontSize: '13px', padding: '10px', background: '#9f2d20', borderColor: '#9f2d20' }}
                  >
                    Bắt đầu ➔
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

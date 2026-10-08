import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiRoleplayService } from '@/services/aiRoleplayService';

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
        <span className="p4-header-badge"><BilingualText>{"Roleplay & Scenarios"}</BilingualText></span>
        <h1 className="p4-title"><BilingualText>{"Kịch bản nhập vai thực tế"}</BilingualText></h1>
        <p className="p4-subtitle"><BilingualText>{"Luyện phản xạ giao tiếp tự nhiên cùng AI trong các tình huống đời thực: từ gọi món phở Bát Đàn, trả giá chợ Bến Thành cho đến phỏng vấn xin việc và ra mắt gia đình người Việt."}</BilingualText></p>
      </div>

      {/* Filter Bar */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '20px', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder={bilingualLabel("Tìm kiếm kịch bản theo tên, địa điểm hoặc bối cảnh...")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}
          />
        </div>

        {/* Level & Topic Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-red-hover)' }}><BilingualText>{"Trình độ:"}</BilingualText></span>
            {levels.map(lvl => (
              <button
                key={lvl.id}
                className={`destination-pill-btn ${selectedLevel === lvl.id ? 'active' : ''}`}
                onClick={() => setSelectedLevel(lvl.id)}
              >
                <BilingualText>{lvl.label}</BilingualText>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-red-hover)' }}><BilingualText>{"Chủ đề:"}</BilingualText></span>
            {topics.map(t => (
              <button
                key={t.id}
                className={`destination-pill-btn ${selectedTopic === t.id ? 'active' : ''}`}
                onClick={() => setSelectedTopic(t.id)}
              >
                <BilingualText>{t.label}</BilingualText>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}><BilingualText>{"Danh sách kịch bản ("}</BilingualText>{scenarios.length})
        </h2>
        {(search || selectedLevel !== 'all' || selectedTopic !== 'all') && (
          <button
            onClick={() => { setSearch(''); setSelectedLevel('all'); setSelectedTopic('all'); }}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-red-hover)', fontSize: '13px', fontWeight: 650, cursor: 'pointer' }}
          ><BilingualText>{"✕ Xóa bộ lọc"}</BilingualText></button>
        )}
      </div>

      {scenarios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--color-surface)', borderRadius: '18px', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '40px', margin: 0 }}>🎭</p>
          <h3 style={{ fontSize: '18px', color: 'var(--color-ink)', margin: '10px 0' }}><BilingualText>{"Chưa tìm thấy kịch bản phù hợp"}</BilingualText></h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}><BilingualText>{"Hãy thử điều chỉnh cấp độ hoặc chủ đề để khám phá thêm nhiều kịch bản thú vị nhé!"}</BilingualText></p>
        </div>
      ) : (
        <div className="scenario-grid">
          {scenarios.map(sc => (
            <div key={sc.id} className="scenario-card">
              <div className="scenario-card__media">
                <ContentImage src={sc.thumbnail} alt={sc.title} />
                <span className="culture-card__destination">📍 {sc.destination}</span>
              </div>

              <div className="scenario-card__body">
                <div className="role-badge-row">
                  <span className="badge-level">{sc.level}</span>
                  <span className="badge-topic">{sc.topicLabel}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-forest)', display: 'flex', alignItems: 'center' }}>
                    ⏱️ {sc.duration}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 750, color: 'var(--color-ink)', margin: '0 0 8px', lineHeight: 1.35 }}>
                  <BilingualText vi={sc.titleVi || sc.title} en={sc.title} />
                </h3>

                <p style={{ fontSize: '13.5px', color: 'var(--color-forest)', margin: '0 0 14px', lineHeight: 1.5 }}>
                  {sc.overview}
                </p>

                {/* Role snapshot */}
                <div className="scenario-role-box">
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--color-red-hover)' }}><BilingualText>{"AI đóng vai:"}</BilingualText></span> {sc.aiRole.name}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--color-ink)' }}><BilingualText>{"Bạn đóng vai:"}</BilingualText></span> {sc.learnerRole.role}
                  </div>
                </div>

                {/* Objectives snapshot */}
                <div style={{ fontSize: '12px', color: 'var(--color-muted)', margin: '6px 0 16px' }}>
                  🎯 <strong>{sc.objectives.length}<BilingualText>{"nhiệm vụ"}</BilingualText></strong><BilingualText>{"cần hoàn thành trong phiên"}</BilingualText></div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <Link
                    to={`/ai-scenarios/${sc.id}`}
                    className="button secondary"
                    style={{ flex: 1, fontSize: '13px', padding: '10px' }}
                  ><BilingualText>{"Xem chi tiết"}</BilingualText></Link>
                  <Link
                    to={`/ai-roleplay/${sc.id}`}
                    className="button"
                    style={{ flex: 1, fontSize: '13px', padding: '10px', background: 'var(--color-red-hover)', borderColor: 'var(--color-red-hover)' }}
                  ><BilingualText>{"Bắt đầu ➔"}</BilingualText></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

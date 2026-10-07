import { useParams, Link } from 'react-router-dom';
import { aiRoleplayService } from '@/services/aiRoleplayService';
import '@/presentation/styles/ai-tutor.css';

export function ScenarioDetailPage() {
  const { id } = useParams();
  const scenario = aiRoleplayService.getScenario(id);

  if (!scenario) {
    return (
      <div className="p4-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Không tìm thấy kịch bản này</h2>
        <p style={{ color: '#7a6458', margin: '14px 0 24px' }}>Kịch bản này không tồn tại hoặc đã được cập nhật.</p>
        <Link to="/ai-scenarios" className="button">
          Quay lại Danh sách kịch bản
        </Link>
      </div>
    );
  }

  return (
    <div className="p4-container">
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7a6458', marginBottom: '20px' }}>
        <Link to="/ai-scenarios" style={{ color: '#9f2d20', textDecoration: 'none' }}>
          ← Danh sách kịch bản
        </Link>
        <span>/</span>
        <span>{scenario.topicLabel}</span>
        <span>/</span>
        <span style={{ color: '#381e18', fontWeight: 600 }}>{scenario.title}</span>
      </nav>

      {/* Hero Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span className="badge-level">{scenario.levelLabel}</span>
            <span className="badge-topic">{scenario.topicLabel}</span>
            <span style={{ padding: '4px 10px', background: '#f4ede4', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#5e4336' }}>
              📍 {scenario.destination}
            </span>
            <span style={{ padding: '4px 10px', background: '#f4ede4', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#5e4336' }}>
              ⚡ Độ khó: {scenario.difficulty}
            </span>
          </div>

          <h1 className="p4-title" style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)' }}>
            {scenario.title}
          </h1>

          <p className="p4-subtitle" style={{ fontSize: '16.5px' }}>
            {scenario.overview}
          </p>

          <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
            <Link
              to={`/ai-roleplay/${scenario.id}`}
              className="button"
              style={{ background: '#9f2d20', borderColor: '#9f2d20', fontSize: '15px', padding: '12px 28px' }}
            >
              🎭 Bắt đầu phiên Roleplay ngay
            </Link>
          </div>
        </div>

        {/* Media Preview */}
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '260px', boxShadow: '0 8px 24px rgba(50,27,23,0.1)', border: '1px solid #ebd9c8' }}>
          <img src={scenario.coverImage} alt={scenario.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* 2-Column Detail Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Left Column: Roles & Mission Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Roles */}
          <div style={{ background: '#ffffff', border: '1px solid #eddcca', borderRadius: '18px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 16px', color: '#381e18' }}>
              👥 Phân vai trong kịch bản
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* AI Role */}
              <div style={{ background: '#fbf5ee', border: '1px solid #ebd8c5', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '28px' }}>{scenario.aiRole.avatar}</span>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#9f2d20', textTransform: 'uppercase' }}>Nhân vật AI</span>
                    <h3 style={{ margin: 0, fontSize: '15px', color: '#2d1813' }}>{scenario.aiRole.name}</h3>
                  </div>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#685044', lineHeight: 1.5 }}>
                  {scenario.aiRole.tone}
                </p>
              </div>

              {/* Learner Role */}
              <div style={{ background: '#edf4ef', border: '1px solid #c9dec9', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '28px' }}>🎓</span>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#245c48', textTransform: 'uppercase' }}>Bạn đóng vai</span>
                    <h3 style={{ margin: 0, fontSize: '15px', color: '#163b2f' }}>{scenario.learnerRole.role}</h3>
                  </div>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#39574d', lineHeight: 1.5 }}>
                  {scenario.learnerRole.context}
                </p>
              </div>
            </div>
          </div>

          {/* Mission Objectives */}
          <div style={{ background: '#ffffff', border: '1px solid #eddcca', borderRadius: '18px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 16px', color: '#381e18' }}>
              🎯 Mục tiêu cần hoàn thành
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scenario.objectives.map((task, i) => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#faf3eb', padding: '12px 16px', borderRadius: '12px', border: '1px solid #eedecf' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#9f2d20', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '14px', color: '#391f19', fontWeight: 600 }}>
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Vocabulary Hints & Cultural Tip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Vocabulary hints */}
          <div style={{ background: '#ffffff', border: '1px solid #eddcca', borderRadius: '18px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 16px', color: '#381e18' }}>
              💡 Mẫu câu & Từ vựng gợi ý
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scenario.vocabularyHints.map((item, idx) => (
                <div key={idx} style={{ padding: '10px 12px', background: '#fcf8f2', borderRadius: '10px', border: '1px solid #f0e3d5' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#9f2d20' }}>
                    "{item.word}"
                  </div>
                  <div style={{ fontSize: '12px', color: '#685145', marginTop: '2px' }}>
                    {item.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural tip */}
          {scenario.culturalTip && (
            <div style={{ background: '#fcf5ee', border: '1px solid #e7cca8', borderRadius: '18px', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#8b4513', fontWeight: 750, fontSize: '14px' }}>
                <span>🏮</span> Mẹo văn hóa thực tế:
              </div>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#55392d' }}>
                {scenario.culturalTip}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

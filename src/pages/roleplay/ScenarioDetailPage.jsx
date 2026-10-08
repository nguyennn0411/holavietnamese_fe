import { ContentImage } from '@/components/common/ContentImage';
import { useParams, Link } from 'react-router-dom';
import { aiRoleplayService } from '@/services/aiRoleplayService';

export function ScenarioDetailPage() {
  const { id } = useParams();
  const scenario = aiRoleplayService.getScenario(id);

  if (!scenario) {
    return (
      <div className="p4-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Không tìm thấy kịch bản này</h2>
        <p style={{ color: 'var(--color-sage)', margin: '14px 0 24px' }}>Kịch bản này không tồn tại hoặc đã được cập nhật.</p>
        <Link to="/ai-scenarios" className="button">
          Quay lại Danh sách kịch bản
        </Link>
      </div>
    );
  }

  return (
    <div className="p4-container">
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-sage)', marginBottom: '20px' }}>
        <Link to="/ai-scenarios" style={{ color: 'var(--color-red-hover)', textDecoration: 'none' }}>
          ← Danh sách kịch bản
        </Link>
        <span>/</span>
        <span>{scenario.topicLabel}</span>
        <span>/</span>
        <span style={{ color: 'var(--color-ink)', fontWeight: 600 }}>{scenario.title}</span>
      </nav>

      {/* Hero Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span className="badge-level">{scenario.levelLabel}</span>
            <span className="badge-topic">{scenario.topicLabel}</span>
            <span style={{ padding: '4px 10px', background: 'var(--color-red-soft)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-ink)' }}>
              📍 {scenario.destination}
            </span>
            <span style={{ padding: '4px 10px', background: 'var(--color-red-soft)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-ink)' }}>
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
              style={{ background: 'var(--color-red-hover)', borderColor: 'var(--color-red-hover)', fontSize: '15px', padding: '12px 28px' }}
            >
              🎭 Bắt đầu phiên Roleplay ngay
            </Link>
          </div>
        </div>

        {/* Media Preview */}
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '260px', boxShadow: '0 8px 24px rgba(50,27,23,0.1)', border: '1px solid var(--color-border)' }}>
          <ContentImage src={scenario.coverImage} alt={scenario.title} loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* 2-Column Detail Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Left Column: Roles & Mission Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Roles */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 16px', color: 'var(--color-ink)' }}>
              👥 Phân vai trong kịch bản
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* AI Role */}
              <div style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '28px' }}>{scenario.aiRole.avatar}</span>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-red-hover)', textTransform: 'uppercase' }}>Nhân vật AI</span>
                    <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--color-ink)' }}>{scenario.aiRole.name}</h3>
                  </div>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: 'var(--color-red-hover)', lineHeight: 1.5 }}>
                  {scenario.aiRole.tone}
                </p>
              </div>

              {/* Learner Role */}
              <div style={{ background: 'var(--color-sage-soft)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '28px' }}>🎓</span>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ink)', textTransform: 'uppercase' }}>Bạn đóng vai</span>
                    <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--color-ink)' }}>{scenario.learnerRole.role}</h3>
                  </div>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: 'var(--color-ink)', lineHeight: 1.5 }}>
                  {scenario.learnerRole.context}
                </p>
              </div>
            </div>
          </div>

          {/* Mission Objectives */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 16px', color: 'var(--color-ink)' }}>
              🎯 Mục tiêu cần hoàn thành
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scenario.objectives.map((task, i) => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--color-cream)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-red-hover)', color: 'var(--color-surface)', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--color-ink)', fontWeight: 600 }}>
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
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 16px', color: 'var(--color-ink)' }}>
              💡 Mẫu câu & Từ vựng gợi ý
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scenario.vocabularyHints.map((item, idx) => (
                <div key={idx} style={{ padding: '10px 12px', background: 'var(--color-cream)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 750, color: 'var(--color-red-hover)' }}>
                    "{item.word}"
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-red-hover)', marginTop: '2px' }}>
                    {item.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural tip */}
          {scenario.culturalTip && (
            <div style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-red-hover)', fontWeight: 750, fontSize: '14px' }}>
                <span>🏮</span> Mẹo văn hóa thực tế:
              </div>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--color-ink)' }}>
                {scenario.culturalTip}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

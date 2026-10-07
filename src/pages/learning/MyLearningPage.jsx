import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';

export function MyLearningPage() {
  const [activeTab, setActiveTab] = useState('courses');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    learnerService.getMyLearningOverview().then(res => {
      setData(res);
    }).catch(() => setError('Không tải được dữ liệu học tập. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu học tập…</div>;
  }
  if (error) return <p role="alert">{error}</p>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#2d1810', margin: '0 0 8px 0' }}>
          Góc học tập của tôi (My Learning)
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Theo dõi khóa học, sổ tay từ vựng, hành trình khám phá và lịch sử thi cử.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e5e7eb', marginBottom: '28px' }}>
        {[
          { id: 'courses', label: '📚 Khóa học của tôi', count: data?.enrolledCourses?.length },
          { id: 'vocabulary', label: '📖 Sổ tay từ vựng', count: data?.savedVocabCount },
          { id: 'journey', label: '🛵 Hành trình Việt Nam', count: data?.journeyProgress == null ? undefined : `${data.journeyProgress}%` },
          { id: 'quiz', label: '📝 Lịch sử bài thi', count: data?.quizHistory?.length },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #8B1A1A' : '3px solid transparent',
              color: activeTab === tab.id ? '#8B1A1A' : '#6b7280',
              fontWeight: activeTab === tab.id ? '700' : '500',
              cursor: 'pointer',
              fontSize: '0.95rem',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                background: activeTab === tab.id ? '#fee2e2' : '#f3f4f6',
                color: activeTab === tab.id ? '#8B1A1A' : '#6b7280',
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '999px',
                fontWeight: '600',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Courses */}
      {activeTab === 'courses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {data?.enrolledCourses?.map(course => (
            <div key={course.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              {course.image && <img src={course.image} alt={course.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />}
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 10px 0' }}>{course.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>
                  <span>Tiến độ</span>
                  <strong>{course.progress}%</strong>
                </div>
                <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
                  <div style={{ height: '100%', width: `${course.progress}%`, background: '#8B1A1A', borderRadius: '4px' }} />
                </div>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: '0 0 16px 0' }}>
                  Tiếp theo: <strong>{course.nextLesson}</strong>
                </p>
                <Link
                  to={`/courses/${course.id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#8B1A1A',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  Tiếp tục học ngay →
                </Link>
              </div>
            </div>
          ))}
          <div style={{ background: '#fdfaf5', borderRadius: '16px', border: '2px dashed #ded5cb', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', marginBottom: '10px' }}>➕</span>
            <h4 style={{ margin: '0 0 6px 0', color: '#2d1810' }}>Khám phá thêm khóa học</h4>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '16px' }}>Mở rộng vốn từ và nâng cao kỹ năng giao tiếp tiếng Việt.</p>
            <Link to="/courses" style={{ padding: '8px 18px', borderRadius: '999px', background: '#dca653', color: '#382414', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
              Xem danh sách khóa học
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: Vocabulary */}
      {activeTab === 'vocabulary' && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#111827' }}>Từ vựng đã lưu ({data?.savedVocabCount})</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Những từ bạn đã đánh dấu cần ôn tập trong các bài học</p>
            </div>
            <Link to="/vocabulary" style={{ padding: '8px 16px', borderRadius: '8px', background: '#8B1A1A', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
              Mở Sổ tay đầy đủ ↗
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {data?.recentVocab?.map((v, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '10px', background: '#faf8f5', border: '1px solid #ded5cb' }}>
                <span style={{ fontSize: '0.7rem', color: v.mastered ? '#16a34a' : '#d97706', fontWeight: 700, textTransform: 'uppercase' }}>
                  {v.mastered ? '✓ Đã thuộc' : '● Đang ôn tập'}
                </span>
                <h4 style={{ margin: '6px 0 2px 0', fontSize: '1.1rem', color: '#2d1810' }}>{v.vi}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>{v.en}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Journey */}
      {activeTab === 'journey' && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '3rem' }}>🏮</span>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#111827' }}>Điểm đến hiện tại: {data?.journeyCity}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>{data?.journeyProgress == null ? 'Chưa có dữ liệu hành trình.' : `Bạn đã hoàn thành ${data.journeyProgress}% chặng đường khám phá.`}</p>
            </div>
          </div>
          <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '5px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ height: '100%', width: `${data?.journeyProgress ?? 0}%`, background: '#dca653', borderRadius: '5px' }} />
          </div>
          <Link to="/achievements" style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '8px', background: '#8B1A1A', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            Xem Hộ chiếu & Tem địa phương 🛂
          </Link>
        </div>
      )}

      {/* Tab 4: Quiz History */}
      {activeTab === 'quiz' && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#111827' }}>Lịch sử làm bài kiểm tra</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.quizHistory?.map(q => (
              <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '10px', background: '#fafafa', border: '1px solid #f3f4f6' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: '#111827' }}>{q.quizName}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Ngày làm: {q.date}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: q.score >= 80 ? '#16a34a' : '#ea580c' }}>
                    {q.score}/100
                  </span>
                  <Link to={`/quiz-attempts/${q.id}`} style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>{q.passed ? 'Đạt chuẩn' : 'Chưa đạt'} · Xem kết quả</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

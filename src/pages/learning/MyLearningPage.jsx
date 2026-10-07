import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import '@/presentation/styles/account.css';

export function MyLearningPage() {
  const [activeTab, setActiveTab] = useState('courses');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learnerService.getMyLearningOverview().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="account-empty">Đang tải dữ liệu học tập…</div>;
  }

  return (
    <div className="mylearning-page">
      {/* Page Header */}
      <div className="mylearning-header">
        <span className="account-pill">📚 Góc học tập cá nhân</span>
        <h1 className="mylearning-title">Góc học tập của tôi</h1>
        <p className="mylearning-desc">
          Theo dõi tiến trình khóa học, củng cố sổ tay từ vựng và xem lại lịch sử kiểm tra.
        </p>
      </div>

      {/* Tabs */}
      <div className="mylearning-tabs">
        {[
          { id: 'courses', label: '📚 Khóa học của tôi', count: data?.enrolledCourses?.length },
          { id: 'vocabulary', label: '📖 Sổ tay từ vựng', count: data?.savedVocabCount },
          { id: 'journey', label: '🛵 Hành trình văn hóa', count: `${data?.journeyProgress}%` },
          { id: 'quiz', label: '📝 Lịch sử bài thi', count: data?.quizHistory?.length },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`mylearning-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="mylearning-tab-badge">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Courses */}
      {activeTab === 'courses' && (
        <div className="mylearning-course-grid">
          {data?.enrolledCourses?.map((course) => (
            <div key={course.id} className="mylearning-course-card">
              <div className="mylearning-course-img-wrap">
                <img src={course.image} alt={course.title} className="mylearning-course-img" />
              </div>
              <div className="mylearning-course-body">
                <h3 className="mylearning-course-title">{course.title}</h3>

                <div className="mylearning-progress-row">
                  <span>Tiến độ hoàn thành</span>
                  <strong>{course.progress}%</strong>
                </div>

                <div className="mylearning-progress-bar">
                  <div
                    className="mylearning-progress-fill"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <p className="mylearning-course-next">
                  Bài tiếp theo: <strong>{course.nextLesson}</strong>
                </p>

                <Link to={`/courses/${course.id}`} className="mylearning-btn-continue">
                  Tiếp tục bài học →
                </Link>
              </div>
            </div>
          ))}

          {/* Add more course card */}
          <div className="mylearning-add-course-card">
            <span className="mylearning-add-icon">➕</span>
            <h4 className="mylearning-add-title">Khám phá thêm khóa học</h4>
            <p className="mylearning-add-desc">
              Mở rộng vốn từ và nâng cao kỹ năng giao tiếp tiếng Việt theo ngữ cảnh.
            </p>
            <Link to="/courses" className="mylearning-btn-explore">
              Xem danh sách khóa học
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: Vocabulary */}
      {activeTab === 'vocabulary' && (
        <div className="mylearning-vocab-card">
          <div className="mylearning-vocab-header">
            <div>
              <h3>Từ vựng đã lưu ({data?.savedVocabCount})</h3>
              <p>Những từ vựng quan trọng bạn đã lưu lại trong quá trình học</p>
            </div>
            <Link to="/vocabulary" className="home-btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              Mở sổ tay từ vựng đầy đủ ↗
            </Link>
          </div>

          <div className="mylearning-vocab-grid">
            {data?.recentVocab?.map((v, i) => (
              <div key={i} className="mylearning-word-chip">
                <span
                  className={`mylearning-word-badge ${
                    v.mastered ? 'mylearning-word-badge--mastered' : 'mylearning-word-badge--learning'
                  }`}
                >
                  {v.mastered ? '✓ Đã thuộc' : '● Đang ôn tập'}
                </span>
                <h4 className="mylearning-word-vi">{v.vi}</h4>
                <p className="mylearning-word-en">{v.en}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Cultural Journey */}
      {activeTab === 'journey' && (
        <div className="mylearning-journey-card">
          <div className="mylearning-journey-hero">
            <span className="mylearning-journey-icon">🏮</span>
            <div>
              <h3>Điểm đến hiện tại: {data?.journeyCity || 'Hà Nội'}</h3>
              <p>
                Bạn đã hoàn thành {data?.journeyProgress}% chặng đường khám phá văn hóa & ngôn ngữ tại thành phố này.
              </p>
            </div>
          </div>

          <div className="mylearning-progress-bar" style={{ height: '10px', marginBottom: '24px' }}>
            <div
              className="mylearning-progress-fill"
              style={{ width: `${data?.journeyProgress}%` }}
            />
          </div>

          <Link to="/achievements" className="home-btn-primary">
            Xem Hộ chiếu & Bộ sưu tập tem 🛂
          </Link>
        </div>
      )}

      {/* Tab 4: Quiz History */}
      {activeTab === 'quiz' && (
        <div className="mylearning-vocab-card">
          <div className="mylearning-vocab-header">
            <div>
              <h3>Lịch sử làm bài kiểm tra</h3>
              <p>Xem lại kết quả các bài kiểm tra từ vựng và ngữ pháp đã hoàn thành</p>
            </div>
          </div>

          <div className="mylearning-quiz-list">
            {data?.quizHistory?.map((q) => (
              <div key={q.id} className="mylearning-quiz-item">
                <div>
                  <strong className="mylearning-quiz-title">{q.quizName}</strong>
                  <span className="mylearning-quiz-date">Ngày thực hiện: {q.date}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="mylearning-quiz-score">{q.score}/100</span>
                  <small style={{ display: 'block', color: '#16a34a', fontWeight: 700, fontSize: '11px' }}>
                    ĐẠT CHUẨN
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

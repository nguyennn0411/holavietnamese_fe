import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { learnerService } from '@/services/learnerService';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { ResourceState } from '@/components/common/ResourceState';
import { PageHeader, Tabs, EmptyState, Artwork } from '@/components/common/Ui';
import { ProgressBar } from '@/components/common/ProgressBar';
import { ContentImage } from '@/components/common/ContentImage';

export function MyLearningPage() {
  const [tab, setTab] = useState('courses');
  const resource = useAsyncResource(useCallback(() => learnerService.getMyLearningOverview(), []));
  return <section>
    <PageHeader eyebrow="Hành trình của riêng bạn" title="Góc học tập của tôi" description="Từng bài học, từng từ mới. Một chút tiến bộ mỗi ngày." />
    <Tabs value={tab} onChange={setTab} items={[{id:'courses',label:'Khóa học của tôi'},{id:'vocabulary',label:'Từ vựng đã lưu'},{id:'journey',label:'Hành trình văn hóa'},{id:'quiz',label:'Lịch sử quiz'}]} />
    <ResourceState resource={resource}>{data => <>
      {tab === 'courses' && <div className="course-grid">
        {data.enrolledCourses?.map(course => <article className="card learning-course" key={course.id}>
          <ContentImage className="learning-course-image" src={course.image} alt={course.title} fallback={<Artwork kind={course.id % 2 ? 'food' : 'village'} alt={`Minh họa khóa học: ${course.title}`}/>}/>
          <div className="learning-course-body"><span className="badge">{course.progress >= 100 ? 'Đã hoàn thành' : 'Đang học'}</span><h2>{course.title}</h2>
            <ProgressBar value={course.progress} label="Tiến độ khóa học" />
            {course.nextLesson && <p className="muted">Bài tiếp theo: {course.nextLesson}</p>}
            <Link className="button" to={`/courses/${course.id}`}>{course.progress >= 100 ? 'Xem lại khóa học' : 'Tiếp tục học →'}</Link>
          </div>
        </article>)}
        <div className="card learning-course-add"><span className="state-symbol">+</span><h2>Một câu chuyện mới?</h2><p className="muted">Khám phá thêm tiếng Việt qua những điều bạn yêu thích.</p><Link className="button secondary" to="/courses">Khám phá khóa học</Link></div>
      </div>}
      {tab === 'vocabulary' && <section className="card"><div className="builder-heading"><div><h2>Từ vựng đã lưu ({data.savedVocabCount ?? 0})</h2><p className="muted">Những từ quen thuộc trên hành trình học của bạn.</p></div><div className="actions"><Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}>Mở sổ tay</Link><Link className="button" to={ROUTES.VOCABULARY_REVIEW}>Ôn tập →</Link></div></div>
        {data.recentVocab?.length ? <div className="mylearning-vocab-grid">{data.recentVocab.map((word,index) => <div className="mylearning-word-chip" key={index}><span className="badge">{word.mastered ? 'Đã thuộc' : 'Đang ôn tập'}</span><h3>{word.vi}</h3><p className="muted">{word.en}</p></div>)}</div> : <EmptyState title="Sổ tay đang chờ những từ đầu tiên" description="Lưu từ mới trong bài học hoặc thêm vào sổ tay."/>}
      </section>}
      {tab === 'journey' && <div className="journey-learning card"><Artwork kind="lanterns"/><div><span className="eyebrow">Hành trình văn hóa</span><h2>{data.journeyCity || 'Khám phá Việt Nam'}</h2>{data.journeyProgress != null ? <ProgressBar value={data.journeyProgress} label="Tiến độ hành trình"/> : <p className="muted">Chưa có dữ liệu tiến độ hành trình.</p>}<div className="actions"><Link className="button" to="/explore">Xem các điểm đến →</Link><Link className="button secondary" to="/achievements">Hộ chiếu & thành tích</Link></div></div></div>}
      {tab === 'quiz' && <section className="card"><h2>Nhìn lại những điều đã học</h2>{data.quizHistory?.length ? data.quizHistory.map(quiz => <div className="list-row" key={quiz.id}><div><strong>{quiz.quizName}</strong><p className="muted">{quiz.date}</p></div><div className="actions"><span className="badge">{quiz.score}/100 · {quiz.passed ? 'Đạt' : 'Cần ôn tập'}</span><Link className="text-link" to={`/quiz-attempts/${quiz.id}/result`}>Xem kết quả →</Link></div></div>) : <EmptyState title="Chưa có bài kiểm tra đã hoàn thành" description="Các kết quả quiz sẽ xuất hiện tại đây."/>}</section>}
    </>}</ResourceState>
  </section>;
}

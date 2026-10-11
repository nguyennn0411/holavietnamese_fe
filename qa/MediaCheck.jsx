import { useState } from 'react';
import { ContentImage } from '../src/components/common/ContentImage';
import { CourseThumbnail } from '../src/components/course/CourseInfo';
import { QuestionInput } from '../src/components/learning/QuestionInput';
import { MediaPlayer } from '../src/components/learning/MediaPlayer';
import { SpeakButton } from '../src/components/common/Ui';

// QA-only failures exercise recovery without altering any application data.
export function MediaCheck() {
  const [src, setSrc] = useState('/qa/missing-photo.jpg'), [answer, setAnswer] = useState({}), [matchingAnswer, setMatchingAnswer] = useState({});
  return <main className="layout-main" style={{ margin: '30px auto' }}>
    <h1>Kiểm tra ảnh và thuộc tính media</h1>
    <p>Trang kiểm tra riêng. Không ghi dữ liệu vào ứng dụng.</p>
    <div className="actions">
      <button onClick={() => setSrc('/design/coffee.svg')}>Dùng ảnh hợp lệ</button>
      <button onClick={() => setSrc('/qa/missing-photo.jpg')}>Dùng ảnh lỗi</button>
      <button onClick={() => setSrc('')}>Đường dẫn trống</button>
      <button onClick={() => setSrc('javascript:alert(1)')}>URL không hợp lệ</button>
    </div>
    <label>URL đang xem trước<input value={src} onChange={event => setSrc(event.target.value)} /></label>
    <div className="card-grid">
      <section className="card"><h2>Ảnh nội dung</h2><ContentImage src={src} alt="Ảnh kiểm tra" className="figma-art" style={{ height: 180 }} /></section>
      <section className="card"><h2>Ảnh khóa học</h2><CourseThumbnail course={{title:'Khóa học kiểm tra',thumbnailUrl:src}} /></section>
      <section className="card"><h2>Avatar</h2><div className="profile-avatar"><ContentImage src={src} alt="Avatar kiểm tra" fallback="A" style={{width:'100%',height:'100%',objectFit:'cover'}} /></div></section>
    </div>
    <section className="card"><h2>Lựa chọn bằng ảnh</h2><QuestionInput question={{id:999,questionType:'IMAGE_SELECTION',options:[{id:1,textVi:'Cà phê',imageUrl:'/design/coffee.svg'},{id:2,textVi:'Ảnh không khả dụng',imageUrl:'/qa/missing-option.jpg'}]}} answer={answer} onChange={setAnswer} /><p role="status">Đã chọn: {answer.optionIds?.[0] || 'Chưa chọn'}</p></section>
    <section className="card"><h2>Ghép cặp có ảnh</h2><QuestionInput question={{id:998,questionType:'MATCHING',options:[{id:'l1',side:'left',textVi:'Chọn cà phê',imageUrl:'/design/coffee.svg'},{id:'r1',side:'right',textVi:'Cà phê',imageUrl:'/design/coffee.svg'},{id:'r2',side:'right',textVi:'Phở',imageUrl:'/design/food.svg'}]}} answer={matchingAnswer} onChange={setMatchingAnswer} /><p role="status">Cặp đã chọn: {matchingAnswer.pairs?.l1 || 'Chưa chọn'}</p></section>
    <section className="card"><h2>Âm thanh và video lỗi</h2><MediaPlayer audioUrl="/qa/missing-audio.mp3" videoUrl="/qa/missing-video.mp4" /><SpeakButton text="xin chào" audioUrl="javascript:alert(1)" /></section>
  </main>;
}

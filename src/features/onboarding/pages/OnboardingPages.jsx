import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Check, ChevronRight, Medal, Play, ShieldCheck, Volume2 } from 'lucide-react';
import { benefits, dailyGoals, firstLessonQuestions, learningReasons, levelOptions, placementBands, placementQuestions } from '../data/onboardingData';
import { useOnboarding } from '../context/OnboardingContext';
import { Brand, Confetti, LessonHeader, Mascot, OnboardingLayout, PrimaryButton, SelectionCard } from '../components/OnboardingUI';
import { onboardingService } from '../services/onboardingService';
import { toast } from 'sonner';
import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';

const speak = (text) => {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN'; utterance.rate = 0.78;
  window.speechSynthesis.speak(utterance);
  return true;
};

const playFeedbackTone = (correct) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = correct ? 660 : 190;
    gain.gain.setValueAtTime(0.06, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + 0.16);
    oscillator.addEventListener('ended', () => context.close());
  } catch { /* Audio feedback is an optional enhancement. */ }
};

export function WelcomePage() {
  const navigate = useNavigate();
  return <div className="ob-welcome">
    <header><Brand /><button onClick={() => navigate('/login')} type="button" className="ob-login-link"><BilingualText vi="ĐĂNG NHẬP" en="LOG IN" /></button></header>
    <main>
      <motion.div className="ob-welcome-art" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="ob-sun" />
        <Mascot message={<BilingualText vi="Xin chào! Bạn đã sẵn sàng khám phá chưa?" en="Xin chào! Ready for an adventure?" />} />
      </motion.div>
      <motion.div className="ob-welcome-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}>
        <span className="ob-kicker"><BilingualText vi="HÀNH TRÌNH TIẾNG VIỆT CỦA BẠN BẮT ĐẦU TẠI ĐÂY" en="YOUR VIETNAMESE ADVENTURE STARTS HERE" /></span>
        <h1><BilingualText vi={<>Học tiếng Việt<br /><em>theo cách thật vui!</em></>} en={<>Learn Vietnamese<br /><em>the fun way!</em></>} /></h1>
        <p><BilingualText vi="Khám phá Việt Nam, tự tin giao tiếp và kết nối với hàng triệu người nói tiếng Việt qua các bài học tương tác đầy thú vị." en="Discover Vietnam, speak confidently, and connect with millions of Vietnamese speakers through fun, interactive lessons." /></p>
        <PrimaryButton onClick={() => navigate('/register', { state: { from: '/onboarding/reason' } })}>
          <BilingualText vi="TẠO TÀI KHOẢN ĐỂ BẮT ĐẦU" en="CREATE ACCOUNT TO START" />
        </PrimaryButton>
        <button className="ob-outline" type="button" onClick={() => navigate('/login', { state: { from: '/onboarding/reason' } })}>
          <BilingualText vi="TÔI ĐÃ CÓ TÀI KHOẢN" en="I ALREADY HAVE AN ACCOUNT" />
        </button>
        <button className="ob-text-link" type="button" onClick={() => navigate('/')}>
          <BilingualText vi="Khám phá với tư cách khách" en="Explore as guest" /> <ChevronRight size={16} />
        </button>
        <div className="ob-trust">
          <span><ShieldCheck /> <BilingualText vi="Bài học đầu miễn phí" en="Free first lesson" /></span>
          <span><Play /> <BilingualText vi="Học qua thực hành" en="Learn by doing" /></span>
          <span><Medal /> <BilingualText vi="Tiến bộ thực tế vững chắc" en="Built for real progress" /></span>
        </div>
      </motion.div>
    </main>
  </div>;
}

export function ReasonPage() {
  const { data, update } = useOnboarding(); const navigate = useNavigate();
  const toggle = (id) => update({ learningReasons: data.learningReasons.includes(id) ? data.learningReasons.filter((item) => item !== id) : [...data.learningReasons, id] });
  return <OnboardingLayout
    eyebrow={<BilingualText vi="CÁ NHÂN HÓA HÀNH TRÌNH CỦA BẠN" en="LET'S PERSONALIZE YOUR JOURNEY" />}
    title={<BilingualText vi="Tại sao bạn muốn học tiếng Việt?" en="Why do you want to learn Vietnamese?" />}
    mascotMessage={data.learningReasons.length
      ? <BilingualText vi="Những lý do thật tuyệt! Tôi sẽ đồng hành cùng bạn." en="Great reasons! I’ll shape the journey around you." />
      : <BilingualText vi="Hãy chọn bao nhiêu lý do tùy thích nhé!" en="Choose as many as you like!" />}
    wide
  >
    <div className="ob-grid two">{learningReasons.map((item) => <SelectionCard key={item.id} {...item} selected={data.learningReasons.includes(item.id)} onClick={() => toggle(item.id)} />)}</div>
    <div className="ob-actions"><PrimaryButton disabled={!data.learningReasons.length} onClick={() => navigate('/onboarding/level')} /></div>
  </OnboardingLayout>;
}

export function LevelPage() {
  const { data, update } = useOnboarding(); const navigate = useNavigate();
  if (!data.learningReasons.length) return <Navigate to="/onboarding/reason" replace />;
  return <OnboardingLayout
    eyebrow={<BilingualText vi="ĐIỂM BẮT ĐẦU CỦA BẠN" en="YOUR STARTING POINT" />}
    title={<BilingualText vi="Bạn đã biết bao nhiêu tiếng Việt rồi?" en="How much Vietnamese do you already know?" />}
    mascotMessage={data.currentLevel
      ? <BilingualText vi="Tuyệt vời — bạn vẫn có thể chọn nơi bắt đầu sau." en="Perfect — you’ll still get to choose where to begin." />
      : <BilingualText vi="Không có câu trả lời nào sai cả. Hãy chọn đúng với bạn nhé!" en="There is no wrong answer. Be honest!" />}
  >
    <div className="ob-stack">{levelOptions.map((item) => <SelectionCard key={item.id} {...item} selected={data.currentLevel === item.id} onClick={() => update({ currentLevel: item.id })} />)}</div>
    <p className="ob-note"><BilingualText vi="Đánh giá nhanh này chỉ giúp gợi ý lộ trình phù hợp, không phải chứng chỉ chính thức." en="This self-assessment only helps us recommend a path. It does not certify your level." /></p>
    <div className="ob-actions"><PrimaryButton disabled={!data.currentLevel} onClick={() => navigate('/onboarding/benefits')} /></div>
  </OnboardingLayout>;
}

export function BenefitsPage() {
  const navigate = useNavigate(); const { data } = useOnboarding();
  if (!data.currentLevel) return <Navigate to="/onboarding/level" replace />;
  return <OnboardingLayout
    eyebrow={<BilingualText vi="MỖI NGÀY MỘT CHÚT" en="A LITTLE EVERY DAY" />}
    title={<BilingualText vi="Đây là những gì bạn sẽ làm được!" en="Here's what you'll be able to do!" />}
    mascotMessage={<BilingualText vi="Từng bước nhỏ mỗi ngày sẽ tạo nên tiến bộ vượt bậc!" en="Small steps every day can lead to amazing progress!" />}
    wide
  >
    <div className="ob-benefits">
      {benefits.map(({ icon: Icon, title, titleVi, detail, detailVi }, index) => (
        <motion.article key={title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }}>
          <Icon />
          <div>
            <strong><BilingualText vi={titleVi || title} en={title} /></strong>
            <span><BilingualText vi={detailVi || detail} en={detail} /></span>
          </div>
          <Check />
        </motion.article>
      ))}
    </div>
    <div className="ob-quote">
      <BilingualText vi="Kết quả sẽ tăng lên theo trình độ, sự đều đặn và luyện tập của bạn — không hứa hẹn viển vông, chỉ có lộ trình rõ ràng." en="Your results will grow with your level, consistency, and practice — no unrealistic promises, just a clear path forward." />
    </div>
    <div className="ob-actions"><PrimaryButton onClick={() => navigate('/onboarding/daily-goal')} /></div>
  </OnboardingLayout>;
}

export function DailyGoalPage() {
  const { data, update } = useOnboarding(); const navigate = useNavigate();
  if (!data.currentLevel) return <Navigate to="/onboarding/level" replace />;
  const selected = dailyGoals.find((goal) => goal.minutes === data.dailyGoalMinutes);
  return <OnboardingLayout
    eyebrow={<BilingualText vi="XÂY DỰNG THÓI QUEN" en="BUILD YOUR HABIT" />}
    title={<BilingualText vi="Mỗi ngày bạn có thể dành bao nhiêu thời gian học tiếng Việt?" en="How much time can you spend learning Vietnamese each day?" />}
    mascotMessage={<BilingualText vi={`${data.dailyGoalMinutes} phút là mục tiêu tuyệt vời. Cố lên nhé!`} en={`${data.dailyGoalMinutes} minutes is a wonderful goal. You've got this!`} />}
    wide
  >
    <div className="ob-grid four">
      {dailyGoals.map((goal) => (
        <SelectionCard
          key={goal.minutes}
          {...goal}
          title={`${goal.minutes} minutes/day`}
          titleVi={`${goal.minutes} phút/ngày`}
          detail={`${goal.label} · ${goal.detail}`}
          detailVi={`${goal.labelVi || goal.label} · ${goal.detailVi || goal.detail}`}
          badge={goal.recommended ? 'RECOMMENDED' : null}
          badgeVi={goal.recommended ? 'KHUYÊN DÙNG' : null}
          selected={data.dailyGoalMinutes === goal.minutes}
          onClick={() => update({ dailyGoalMinutes: goal.minutes })}
          style={{ '--goal-color': goal.color }}
        />
      ))}
    </div>
    <div className="ob-goal-meter">
      <div>
        <span><BilingualText vi="Nhịp độ hàng ngày" en="Your daily rhythm" /></span>
        <strong><BilingualText vi={selected?.labelVi || selected?.label} en={selected?.label} /></strong>
      </div>
      <div className="ob-meter"><motion.span animate={{ width: `${Math.min(100, data.dailyGoalMinutes / 30 * 100)}%` }} /></div>
      <small><BilingualText vi="Đều đặn quan trọng hơn sự hoàn hảo." en="Consistency matters more than perfection." /></small>
    </div>
    <div className="ob-actions"><PrimaryButton onClick={() => navigate('/onboarding/learning-path')} /></div>
  </OnboardingLayout>;
}

export function LearningPathPage() {
  const { data, update } = useOnboarding(); const navigate = useNavigate();
  if (!data.learningReasons.length || !data.currentLevel) return <Navigate to="/onboarding/reason" replace />;
  const choose = (path) => { update({ learningPath: path }); window.setTimeout(() => navigate(path === 'beginner' ? '/onboarding/first-lesson' : '/onboarding/placement-test'), 180); };
  return <OnboardingLayout
    eyebrow={<BilingualText vi="CHỌN HƯỚNG ĐI CỦA BẠN" en="CHOOSE YOUR ADVENTURE" />}
    title={<BilingualText vi="Bạn muốn bắt đầu từ đâu?" en="Where would you like to start?" />}
    mascotMessage={<BilingualText vi="Cả hai hướng đi đều mở — bạn luôn có thể đổi hướng sau này." en="Both paths are yours — you can always change direction." />}
    wide
  >
    <div className="ob-paths">
      <motion.button whileHover={{ y: -6 }} type="button" className={`ob-path-card beginner ${data.learningPath === 'beginner' ? 'is-selected' : ''}`} onClick={() => choose('beginner')}>
        <em><BilingualText vi="KHUYÊN DÙNG CHO NGƯỜI MỚI BẮT ĐẦU" en="RECOMMENDED FOR BEGINNERS" /></em>
        <h2><BilingualText vi="Bắt đầu từ số 0" en="Start from Scratch" /></h2>
        <p><BilingualText vi="Học tiếng Việt từng bước một, bắt đầu với lời chào, từ vựng thiết yếu và câu đơn giản." en="Learn Vietnamese step by step, starting with greetings, essential vocabulary, and simple sentences." /></p>
        <strong><BilingualText vi="BẮT ĐẦU BÀI HỌC" en="START LESSON" /> <ChevronRight /></strong>
      </motion.button>
      <motion.button whileHover={{ y: -6 }} type="button" className={`ob-path-card placement ${data.learningPath === 'placement' ? 'is-selected' : ''}`} onClick={() => choose('placement')}>
        <em><BilingualText vi="KHOẢNG 5 PHÚT" en="ABOUT 5 MINUTES" /></em>
        <h2><BilingualText vi="Kiểm tra trình độ" en="Find My Level" /></h2>
        <p><BilingualText vi="Làm bài kiểm tra trình độ tiếng Việt nhanh để tìm điểm xuất phát phù hợp với bạn." en="Take a quick Vietnamese placement test and discover the right starting point for your learning journey." /></p>
        <strong><BilingualText vi="LÀM BÀI KIỂM TRA" en="TAKE THE TEST" /> <ChevronRight /></strong>
      </motion.button>
    </div>
  </OnboardingLayout>;
}

function ExerciseRunner({ mode }) {
  const questions = mode === 'lesson' ? firstLessonQuestions : placementQuestions;
  const { data, update } = useOnboarding(); const navigate = useNavigate();
  const storedIndex = mode === 'lesson' ? data.lessonQuestionIndex : data.placementQuestionIndex;
  const [index, setIndex] = useState(Math.min(storedIndex || 0, questions.length - 1));
  const [answers, setAnswers] = useState(mode === 'lesson' ? (data.lessonAnswers || []) : (data.placementAnswers || []));
  const [selected, setSelected] = useState(''); const [tokens, setTokens] = useState([]); const [checked, setChecked] = useState(false); const [sound, setSound] = useState(true);
  const question = questions[index]; const response = question.type === 'arrange' ? tokens.join(' ') : selected;
  const correct = response === question.answer;
  const chooseToken = (token) => { if (!checked && !tokens.includes(token)) setTokens([...tokens, token]); };
  const onCheck = () => { if (!response) return; setChecked(true); if (sound) playFeedbackTone(correct); };
  const onContinue = () => {
    const nextAnswers = [...answers]; nextAnswers[index] = { questionId: question.id, response, correct }; setAnswers(nextAnswers);
    if (index === questions.length - 1) {
      const score = nextAnswers.filter((item) => item?.correct).length; const accuracy = Math.round(score / questions.length * 100);
      if (mode === 'lesson') update({ firstLessonCompleted: true, firstLessonResult: { correct: score, total: questions.length, accuracy, xp: 20 }, guestExperienceCompleted: true, lessonAnswers: nextAnswers });
      else { const band = [...placementBands].reverse().find((item) => score >= item.min); update({ placementTestCompleted: true, placementResult: { correct: score, total: questions.length, accuracy, level: band.label, targetLevel: band.targetLevel, recommendation: band.recommendation, xp: 30 }, guestExperienceCompleted: true, placementAnswers: nextAnswers }); }
      navigate('/onboarding/completed', { state: { mode } }); return;
    }
    const next = index + 1; setIndex(next); setSelected(''); setTokens([]); setChecked(false);
    update(mode === 'lesson' ? { lessonQuestionIndex: next, lessonAnswers: nextAnswers } : { placementQuestionIndex: next, placementAnswers: nextAnswers });
  };
  const exit = () => {
    if (window.confirm(bilingualLabel(`Rời khỏi ${mode === 'lesson' ? 'bài học' : 'bài kiểm tra'}? Các câu trả lời của bạn đã được lưu.`, `Leave this ${mode === 'lesson' ? 'lesson' : 'test'}? Your answered questions are saved.`))) {
      navigate('/onboarding/learning-path');
    }
  };

  return <div className="ob-exercise-shell">
    <LessonHeader current={index + 1} total={questions.length} onExit={exit} sound={sound} onSound={() => setSound(!sound)} />
    <main className="ob-exercise">
      <div className="ob-exercise-title">
        <span>{mode === 'lesson' ? <BilingualText vi="BÀI 1 · LỜI CHÀO CĂN BẢN" en="LESSON 1 · BASIC GREETINGS" /> : <BilingualText vi="KIỂM TRA NHANH TRÌNH ĐỘ" en="QUICK PLACEMENT CHECK" />}</span>
        <strong>{mode === 'lesson' ? <BilingualText vi="Học qua thực hành" en="Learn by doing" /> : <BilingualText vi={`Câu hỏi ${index + 1} / ${questions.length}`} en={`Question ${index + 1} of ${questions.length}`} />}</strong>
      </div>
      <div className="ob-coach">
        <Mascot compact message={question.type === 'listen' ? <BilingualText vi="Chạm vào loa và lắng nghe kỹ nhé!" en="Tap the speaker and listen closely!" /> : index === 0 ? <BilingualText vi="Bình tĩnh làm nhé — tôi ở ngay đây!" en="Take your time — I’m right here!" /> : <BilingualText vi="Làm tốt lắm. Tiếp tục nào!" en="Nice momentum. Keep going!" />} />
      </div>
      <AnimatePresence mode="wait">
        <motion.section key={question.id} className="ob-question" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          {question.type === 'listen' && <button type="button" className="ob-listen" onClick={() => speak(question.speak)}><Volume2 /> <BilingualText vi="NGHE ÂM THANH" en="PLAY AUDIO" /></button>}
          <h1>{question.promptVi ? <BilingualText vi={question.promptVi} en={question.prompt} /> : question.prompt}</h1>
          {question.type === 'arrange' ? (
            <>
              <div className="ob-sentence">
                {tokens.length ? tokens.map((token) => <button key={token} type="button" onClick={() => !checked && setTokens(tokens.filter((item) => item !== token))}>{token}</button>) : <span><BilingualText vi="Chạm vào các từ bên dưới để ghép câu" en="Tap the words below to build the sentence" /></span>}
              </div>
              <div className="ob-token-bank">
                {question.tokens.map((token) => <button type="button" key={token} disabled={tokens.includes(token) || checked} onClick={() => chooseToken(token)}>{token}</button>)}
              </div>
            </>
          ) : (
            <div className="ob-answer-grid">
              {question.options.map((option, optionIndex) => (
                <button type="button" key={option} disabled={checked} onClick={() => setSelected(option)} className={`${selected === option ? 'is-selected' : ''} ${checked && option === question.answer ? 'is-correct' : ''} ${checked && selected === option && !correct ? 'is-wrong' : ''}`}>
                  <kbd>{optionIndex + 1}</kbd>
                  <span>{option}</span>
                  {checked && option === question.answer && <Check />}
                </button>
              ))}
            </div>
          )}
        </motion.section>
      </AnimatePresence>
    </main>
    <footer className={`ob-feedback ${checked ? (correct ? 'correct' : 'wrong') : ''}`}>
      <div>
        {checked && (
          <>
            <span className="ob-feedback-icon">{correct ? <Check /> : '!'}</span>
            <div>
              <strong>{correct ? <BilingualText vi="Tuyệt vời!" en="Excellent!" /> : <BilingualText vi="Chưa chính xác" en="Not quite yet" />}</strong>
              <p>
                {correct
                  ? (question.noteVi ? <BilingualText vi={question.noteVi} en={question.note} /> : (question.note || <BilingualText vi="Chính xác rồi!" en="That is correct!" />))
                  : <BilingualText vi={<>Đáp án đúng: <b>{question.answer}</b></>} en={<>Correct answer: <b>{question.answer}</b></>} />}
              </p>
            </div>
          </>
        )}
      </div>
      {!checked
        ? <PrimaryButton disabled={!response} onClick={onCheck}><BilingualText vi="KIỂM TRA" en="CHECK" /></PrimaryButton>
        : <PrimaryButton onClick={onContinue}>{index === questions.length - 1 ? <BilingualText vi="XEM KẾT QUẢ" en="SEE RESULTS" /> : <BilingualText vi="TIẾP TỤC" en="CONTINUE" />}</PrimaryButton>}
    </footer>
  </div>;
}

export const FirstLessonPage = () => { const { data } = useOnboarding(); return data.learningPath !== 'beginner' ? <Navigate to="/onboarding/learning-path" replace /> : <ExerciseRunner mode="lesson" />; };
export const PlacementTestPage = () => <ExerciseRunner mode="placement" />;

export function CompletionPage() {
  const { data } = useOnboarding(); const location = useLocation(); const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const mode = location.state?.mode || (data.placementTestCompleted ? 'placement' : 'lesson');
  const result = mode === 'placement' ? data.placementResult : data.firstLessonResult;
  if (!result) return <Navigate to="/onboarding/learning-path" replace />;

  const handleShowRecommendations = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onboardingService.syncGuestProgress();
      toast.success(bilingualLabel('Đã lưu kết quả kiểm tra và cá nhân hóa gợi ý khóa học.', 'Assessment results saved and course recommendations personalized.'));
    } catch {
      toast.error(bilingualLabel('Chưa thể đồng bộ kết quả, nhưng bạn vẫn có thể xem khóa học được gợi ý.', 'Could not sync results yet, but you can still view recommended courses.'));
    } finally {
      const targetLevel = result.targetLevel || 'A1';
      navigate(`/courses?level=${encodeURIComponent(targetLevel)}&recommended=1`, { replace: true });
    }
  };

  return <div className="ob-complete">
    <Confetti /><Brand />
    <main>
      <div className="ob-celebrate"><Mascot celebration /></div>
      <span className="ob-complete-kicker">
        <Medal /> {mode === 'lesson' ? <BilingualText vi="HOÀN THÀNH BÀI HỌC ĐẦU TIÊN" en="FIRST LESSON COMPLETE" /> : <BilingualText vi="ĐÃ TÌM THẤY ĐIỂM XUẤT PHÁT" en="STARTING POINT FOUND" />}
      </span>
      <h1>
        {mode === 'lesson'
          ? <BilingualText vi="Tuyệt vời! Bạn đã hoàn thành bài học tiếng Việt đầu tiên!" en="Fantastic! You've completed your first Vietnamese lesson!" />
          : <BilingualText vi="Làm tốt lắm! Chúng tôi đã tìm thấy điểm xuất phát cho bạn!" en="Great job! We've found a starting point for you!" />}
      </h1>
      <p>
        <BilingualText vi="Kết quả đã sẵn sàng. HolaVietnamese sẽ dùng trình độ này để gợi ý các khóa học phù hợp với bạn." en="Your results are ready. HolaVietnamese will use this level to recommend matching courses." />
      </p>
      <div className="ob-stats">
        <article><strong>+{result.xp}</strong><span><BilingualText vi="XP ĐẠT ĐƯỢC" en="XP EARNED" /></span></article>
        <article><strong>{result.correct}/{result.total}</strong><span><BilingualText vi="CÂU ĐÚNG" en="CORRECT" /></span></article>
        <article><strong>{result.accuracy}%</strong><span><BilingualText vi="ĐỘ CHÍNH XÁC" en="ACCURACY" /></span></article>
      </div>
      <div className="ob-recommend">
        <BookOpen />
        <div>
          <span><BilingualText vi="LỘ TRÌNH GỢI Ý CHO BẠN" en="YOUR RECOMMENDED START" /></span>
          <strong>{result.recommendation || 'Vietnamese Foundations · Lesson 2'}</strong>
          {result.level && <small><BilingualText vi={`Nhóm gợi ý: ${result.level}. Đây là kết quả sơ bộ, không phải chứng chỉ CEFR chính thức.`} en={`Suggested group: ${result.level}. This is a preliminary result, not an official CEFR certification.`} /></small>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center' }}>
        <PrimaryButton disabled={saving} onClick={handleShowRecommendations}>
          {saving ? <BilingualText vi="ĐANG LƯU KẾT QUẢ…" en="SAVING RESULTS…" /> : <BilingualText vi="XEM KHÓA HỌC ĐƯỢC GỢI Ý" en="VIEW RECOMMENDED COURSES" />}
        </PrimaryButton>
      </div>
    </main>
  </div>;
}

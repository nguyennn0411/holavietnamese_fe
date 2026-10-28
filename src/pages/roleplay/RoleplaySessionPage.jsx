import { BilingualText, bilingualLabel, useBilingualLabel } from '@/components/common/BilingualText';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { aiRoleplayService, evaluateObjectives } from '@/services/aiRoleplayService';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Mic,
  Send,
  RotateCcw,
  Sparkles,
  Languages,
  HelpCircle,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Flag,
  Award,
  Lightbulb,
  MapPin,
  Smile
} from 'lucide-react';

export function RoleplaySessionPage() {
  const { i18n } = useTranslation();
  const isVi = (i18n?.resolvedLanguage || i18n?.language || 'vi').startsWith('vi');
  const bLabel = useBilingualLabel();
  const { confirm, confirmationDialog } = useConfirmDialog();
  const { id } = useParams();
  const navigate = useNavigate();
  const scenario = aiRoleplayService.getScenario(id);

  const [session, setSession] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [showTranslations, setShowTranslations] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [playingMsgId, setPlayingMsgId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const messagesContainerRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const prevMsgCountRef = useRef(null);

  useEffect(() => {
    prevMsgCountRef.current = null;
    const scrollToPageTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.getElementById('main-content')?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    scrollToPageTop();
    const rafId = requestAnimationFrame(scrollToPageTop);
    const timerId = setTimeout(scrollToPageTop, 80);
    if (id) {
      const currentSession = aiRoleplayService.getRoleplaySession(id);
      setSession(currentSession);
      aiRoleplayService.initRoleplaySession(id).then(updated => {
        if (updated) setSession(updated);
      }).catch(() => {});
    }
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [id]);

  // Khi learner hoàn thành 100% mục tiêu → tự báo hoàn thành lên backend
  // để Admin cập nhật "Lượt hoàn thành" (chỉ báo 1 lần mỗi phiên).
  useEffect(() => {
    if (!id || !session || session.completionReported) return;
    if (!aiRoleplayService.isProgressComplete(id, session)) return;

    aiRoleplayService.reportCompletion(id).then(res => {
      setSession(aiRoleplayService.getRoleplaySession(id));
      if (res && !res.alreadyReported) {
        showToast(isVi ? '🎉 Bạn đã hoàn thành 100% mục tiêu! Tiến độ đã được ghi nhận.' : '🎉 You completed 100% of objectives! Progress saved.');
      }
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, session?.completedTasks?.length, session?.completionReported]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (!session?.messages) return;
    const currentCount = session.messages.length;
    if (prevMsgCountRef.current === null) {
      prevMsgCountRef.current = currentCount;
      container.scrollTop = 0;
      return;
    }
    if (currentCount > prevMsgCountRef.current || isSending) {
      prevMsgCountRef.current = currentCount;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
    if (false) container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [session?.messages, isSending]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      speechRecognitionRef.current = recognition;
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSpeak = (text, msgId = null) => {
    if (!('speechSynthesis' in window)) {
      showToast(bLabel('Trình duyệt không hỗ trợ phát âm.', 'Browser does not support text-to-speech.'));
      return;
    }
    window.speechSynthesis.cancel();
    setPlayingMsgId(msgId);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = speechRate;
    utterance.onend = () => setPlayingMsgId(null);
    utterance.onerror = () => setPlayingMsgId(null);

    window.speechSynthesis.speak(utterance);
    showToast(bLabel('Đang phát âm tiếng Việt...', 'Playing Vietnamese audio...'));
  };

  const handleToggleVoiceInput = () => {
    if (!speechRecognitionRef.current) {
      showToast(bLabel('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói tiếng Việt.', 'Your browser does not support Vietnamese voice recognition.'));
      return;
    }
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechRecognitionRef.current.start();
      showToast(bLabel('Đang lắng nghe giọng nói của bạn...', 'Listening to your voice...'));
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending || !id) return;

    setIsSending(true);
    setInputText('');

    // Cập nhật tức thì tiến độ mục tiêu ngay khi học viên gửi câu thoại
    setSession(prev => {
      if (!prev) return prev;
      const nextCompleted = evaluateObjectives(scenario, prev.completedTasks || [], text);
      const optimistic = { ...prev, completedTasks: nextCompleted };
      aiRoleplayService.saveRoleplaySession(id, optimistic);
      return optimistic;
    });

    try {
      const { session: updatedSession } = await aiRoleplayService.sendRoleplayMessage(id, text);
      setSession(updatedSession);
    } catch (e) {
      console.error(e);
      showToast(bLabel('Lỗi khi gửi tin nhắn roleplay.', 'Error sending roleplay message.'));
    } finally {
      setIsSending(false);
    }
  };

  const handleFinishSession = async () => {
    try {
      await aiRoleplayService.finishRoleplayAndGetResult(id);
    } catch (e) {
      console.error('Error completing roleplay:', e);
    }
    navigate(`/ai-sessions/${id}/result`);
  };

  const handleResetSession = async () => {
    if (await confirm({
      title: bilingualLabel('Bắt đầu lại phiên roleplay?', 'Restart roleplay session?'),
      description: bilingualLabel('Toàn bộ hội thoại và tiến độ trong phiên hiện tại sẽ được đặt lại.', 'All conversation history and progress in this session will be reset.'),
      confirmLabel: bilingualLabel('Bắt đầu lại', 'Restart'),
      tone: 'warning'
    })) {
      const fresh = aiRoleplayService.resetRoleplaySession(id);
      setSession(fresh);
      showToast(bilingualLabel('Đã đặt lại phiên hội thoại kịch bản!', 'Roleplay session reset!'));
    }
  };

  const toggleTranslation = (msgId) => {
    setShowTranslations(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const toggleExplanation = (msgId) => {
    setShowExplanations(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  if (!scenario) return null;

  const suggestions = aiRoleplayService.getSuggestions(id, session?.messages?.length || 0);
  const totalTasks = scenario.objectives?.length || 1;
  const completedCount = session?.completedTasks?.length || 0;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="relative min-h-screen bg-[#FFF9ED] text-[#202124] w-full max-w-full px-0 py-6 space-y-6">
      {confirmationDialog}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#202124] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xl border border-white/10"
          >
            <Sparkles size={16} className="text-[#FFCD00]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Header Bar */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EADCC7]">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#715A4F] mb-1.5">
            <Link
              to="/ai-scenarios"
              className="inline-flex items-center gap-1 font-semibold text-[#DA251D] hover:underline transition-colors"
            >
              <ArrowLeft size={13} />
              <BilingualText vi="Thoát kịch bản" en="Exit scenario" />
            </Link>
            <span>/</span>
            <span className="font-medium text-[#4A3B32]">
              <BilingualText vi={scenario.titleVi || scenario.title} en={scenario.titleEn || scenario.title} />
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
              <BilingualText
                vi={<>Phiên Roleplay: {scenario.titleVi || scenario.title}</>}
                en={<>Roleplay session: {scenario.titleEn || scenario.title}</>}
              />
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DA251D]/10 text-[#DA251D] text-[11px] font-bold">
              {scenario.level || 'A1 - A2'}
            </span>
          </div>
        </div>

        {/* Speed & Global Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Audio speed pill */}
          <button
            type="button"
            onClick={() => {
              const newRate = speechRate >= 0.9 ? 0.7 : 0.95;
              setSpeechRate(newRate);
              showToast(bLabel(`Tốc độ phát âm: ${newRate >= 0.9 ? '1.0x Chuẩn' : '0.7x Chậm'}`, `Speech rate: ${newRate >= 0.9 ? '1.0x Normal' : '0.7x Slow'}`));
            }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '38px', minHeight: '38px', padding: '0 14px', borderRadius: '12px', background: '#FFFFFF', color: '#DA251D', border: '1px solid #DECBB4', fontSize: '12.5px', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            title={bLabel('Chuyển đổi tốc độ phát âm (1.0x Chuẩn / 0.7x Chậm)', 'Toggle speech rate (1.0x Normal / 0.7x Slow)')}
          >
            <span>{speechRate >= 0.9 ? bLabel('⚡ 1.0x Chuẩn', '⚡ 1.0x Normal') : bLabel('🐢 0.7x Chậm', '🐢 0.7x Slow')}</span>
          </button>
          <div style={{ display: 'none' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '0 8px 0 9px', color: '#64748B', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}><Volume2 size={13} style={{ color: '#F97316' }} />{bLabel('Tốc độ đọc:', 'Speed:')}</span>
            <button
              type="button"
              onClick={() => setSpeechRate(0.7)}
              style={{ height: '30px', minHeight: '30px', padding: '0 11px', borderRadius: '9px', fontSize: '12px', fontWeight: 700, border: 'none', whiteSpace: 'nowrap', background: speechRate === 0.7 ? '#F97316' : 'transparent', color: speechRate === 0.7 ? '#FFFFFF' : '#475569', boxShadow: speechRate === 0.7 ? '0 2px 5px rgba(249,115,22,0.3)' : 'none' }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                speechRate === 0.7
                  ? 'bg-[#DA251D] text-white font-bold shadow-xs'
                  : 'text-[#431914] hover:bg-[#FFF9ED]'
              }`}
            >
              <span>{bLabel('0.7x Chậm', '0.7x Slow')}</span>
            </button>
            <button
              type="button"
              onClick={() => setSpeechRate(0.95)}
              style={{ height: '30px', minHeight: '30px', padding: '0 11px', borderRadius: '9px', fontSize: '12px', fontWeight: 700, border: 'none', whiteSpace: 'nowrap', background: speechRate >= 0.9 ? '#F97316' : 'transparent', color: speechRate >= 0.9 ? '#FFFFFF' : '#475569', boxShadow: speechRate >= 0.9 ? '0 2px 5px rgba(249,115,22,0.3)' : 'none' }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                speechRate >= 0.9
                  ? 'bg-[#DA251D] text-white font-bold shadow-xs'
                  : 'text-[#431914] hover:bg-[#FFF9ED]'
              }`}
            >
              <span>{bLabel('1.0x Chuẩn', '1.0x Normal')}</span>
            </button>
          </div>

          <button
            onClick={handleResetSession}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '38px', minHeight: '38px', padding: '0 14px', borderRadius: '12px', background: '#FFFFFF', color: '#475569', border: '1px solid #E2D5C3', fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFF4E0] text-[#715A4F] hover:text-[#202124] border border-[#DECBB4] font-semibold text-xs shadow-xs transition-all"
          >
            <RotateCcw size={13} />
            <span>{bLabel('Bắt đầu lại', 'Restart')}</span>
          </button>

          <button
            onClick={handleFinishSession}
            className="roleplay-header-finish-btn"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '38px', minHeight: '38px', padding: '0 15px', borderRadius: '12px', background: '#253044', color: '#FFFFFF', border: '1px solid #253044', fontSize: '12.5px', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(37,48,68,0.18)' }}
          >
            <Award size={14} className="text-[#FFCD00]" />
            <span>{bLabel('Kết thúc & Xem kết quả', 'Finish & View Results')}</span>
          </button>
        </div>
      </header>

      {/* 2-Column Live Roleplay Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Dialogue Chat Window (Col 8) */}
        <main className="lg:col-span-8 flex flex-col bg-white rounded-3xl border border-[#DECBB4] shadow-md overflow-hidden min-h-[720px]">
          {/* Partner Status Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#FFF9EE] to-white border-b border-[#EADCC7] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl bg-[#FFF2D6] border-2 border-[#FFCD00] flex items-center justify-center text-2xl shadow-xs">
                {scenario.aiRole.avatar}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#202124] leading-tight">
                    {scenario.aiRole.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#DA251D]/10 text-[#DA251D]">
                    AI Partner
                  </span>
                </div>
                <p className="text-xs text-[#715A4F] leading-tight mt-0.5">
                  {scenario.aiRole.role}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHints(!showHints)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '32px', minHeight: '32px', padding: '0 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, background: showHints ? '#FFF2D6' : '#FFFFFF', color: showHints ? '#A62A24' : '#715A4F', border: showHints ? '1px solid #FFCD00' : '1px solid #DECBB4', whiteSpace: 'nowrap' }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showHints
                  ? 'bg-[#FFF2D6] text-[#A62A24] border-[#FFCD00]'
                  : 'bg-white text-[#715A4F] border-[#DECBB4] hover:bg-[#FFF9EE]'
              }`}
            >
              <Lightbulb size={14} className={showHints ? 'text-[#DA251D]' : 'text-[#715A4F]'} />
              <span>{bLabel(showHints ? 'Ẩn gợi ý' : 'Hiện gợi ý trả lời', showHints ? 'Hide hints' : 'Show response hints')}</span>
            </button>
          </div>

          {/* Messages Flow Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 p-5 sm:p-6 overflow-y-auto max-h-[640px] min-h-[460px] space-y-4 bg-gradient-to-b from-[#FFFDF9] to-white"
          >
            {session?.messages?.map((msg) => {
              const isAi = msg.sender === 'ai';
              const isTranslating = !!showTranslations[msg.id];
              const isExplaining = !!showExplanations[msg.id];
              const isPlayingThis = playingMsgId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-9 h-9 rounded-xl bg-[#FFF2D6] border border-[#FFCD00] flex items-center justify-center text-xl shrink-0 shadow-xs">
                      {scenario.aiRole.avatar}
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[82%] xl:max-w-[78%] rounded-3xl p-5 sm:p-6 shadow-xs text-sm sm:text-base leading-relaxed transition-all ${
                      isAi
                        ? 'bg-white border border-[#E8DCCF] text-[#202124]'
                        : 'bg-gradient-to-br from-[#DA251D] to-[#B71C1C] text-white shadow-sm'
                    }`}
                  >
                    {/* Header sender label */}
                    <div
                      className={`text-[11px] font-bold mb-1.5 flex items-center justify-between gap-2 ${
                        isAi ? 'text-[#DA251D]' : 'text-white/80'
                      }`}
                    >
                      <span>
                        <BilingualText vi={isAi ? scenario.aiRole.name : 'Bạn (Learner)'} en={isAi ? scenario.aiRole.name : 'You (Learner)'} />
                      </span>
                      {isPlayingThis && (
                        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] text-[10px] font-bold animate-pulse">
                          <span className="w-1 h-2 bg-[#FF7A00] rounded-full animate-bounce" />
                          <span className="w-1 h-3.5 bg-[#FF7A00] rounded-full animate-bounce delay-100" />
                          <span className="w-1 h-2 bg-[#FF7A00] rounded-full animate-bounce delay-200" />
                          <span className="ml-1"><BilingualText vi="Đang đọc" en="Playing" /></span>
                        </span>
                      )}
                    </div>

                    {/* Main Message Text */}
                    <p className="text-sm sm:text-base leading-relaxed font-medium">
                      {msg.text}
                    </p>

                    {/* Translation foldout */}
                    {isTranslating && msg.translation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`mt-2.5 p-2.5 rounded-xl text-xs sm:text-sm border ${
                          isAi
                            ? 'bg-[#FFF9EE] border-[#FFCD00]/50 text-[#5B3E31]'
                            : 'bg-white/15 border-white/20 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-0.5 text-[11px]">
                          <Languages size={12} />
                          <span><BilingualText vi="Dịch nghĩa (English):" en="English Translation:" /></span>
                        </div>
                        <p className="italic">{msg.translation}</p>
                      </motion.div>
                    )}

                    {/* Explanation foldout */}
                    {isExplaining && msg.explanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`mt-2.5 p-2.5 rounded-xl text-xs border ${
                          isAi
                            ? 'bg-[#F2F7F2] border-[#C3DEC3] text-[#24382B]'
                            : 'bg-white/15 border-white/20 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-0.5 text-[11px]">
                          <HelpCircle size={12} />
                          <BilingualText vi="Giải thích ngữ cảnh & cách dùng:" en="Context & usage explanation:" />
                        </div>
                        <p>{msg.explanation}</p>
                      </motion.div>
                    )}

                    {/* Message Actions */}
                    <div
                      className={`mt-3 pt-2.5 flex flex-wrap items-center gap-1.5 border-t ${
                        isAi ? 'border-[#F0E6D8]' : 'border-white/20'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.text, msg.id)}
                        style={{ minHeight: '28px', height: '28px', padding: '0 10px', fontSize: '11.5px', borderRadius: '8px', background: isAi ? '#FFF9EE' : 'rgba(255,255,255,0.2)', color: isAi ? '#715A4F' : '#FFFFFF', border: isAi ? '1px solid #E8DCCF' : '1px solid rgba(255,255,255,0.3)' }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isAi
                            ? 'bg-[#FFF9EE] hover:bg-[#FFEEC9] text-[#715A4F] hover:text-[#DA251D] border border-[#E8DCCF]'
                            : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                        }`}
                        title={bilingualLabel("Nghe phát âm chuẩn", "Listen to standard pronunciation")}
                      >
                        <Volume2 size={13} className={isPlayingThis ? 'text-[#DA251D] animate-spin' : ''} />
                        <span>{bLabel('Nghe', 'Listen')}</span>
                      </button>

                      {msg.translation && (
                        <button
                          type="button"
                          onClick={() => toggleTranslation(msg.id)}
                          style={{ minHeight: '28px', height: '28px', padding: '0 10px', fontSize: '11.5px', borderRadius: '8px', background: isAi ? (isTranslating ? '#DA251D' : '#FFF9EE') : (isTranslating ? '#FFFFFF' : 'rgba(255,255,255,0.2)'), color: isAi ? (isTranslating ? '#FFFFFF' : '#715A4F') : (isTranslating ? '#DA251D' : '#FFFFFF'), border: isAi ? '1px solid #E8DCCF' : '1px solid rgba(255,255,255,0.3)' }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            isAi
                              ? isTranslating
                                ? 'bg-[#DA251D] text-white'
                                : 'bg-[#FFF9EE] hover:bg-[#FFEEC9] text-[#715A4F] border border-[#E8DCCF]'
                              : isTranslating
                              ? 'bg-white text-[#DA251D]'
                              : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                          }`}
                          title={bilingualLabel("Dịch câu nói sang tiếng Anh", "Translate sentence to English")}
                        >
                          <Languages size={13} />
                          <span>{bLabel(isTranslating ? 'Đóng dịch' : 'Dịch', isTranslating ? 'Hide translation' : 'Translate')}</span>
                        </button>
                      )}

                      {msg.explanation && (
                        <button
                          type="button"
                          onClick={() => toggleExplanation(msg.id)}
                          style={{ minHeight: '28px', height: '28px', padding: '0 10px', fontSize: '11.5px', borderRadius: '8px', background: isAi ? (isExplaining ? '#24382B' : '#FFF9EE') : (isExplaining ? '#FFFFFF' : 'rgba(255,255,255,0.2)'), color: isAi ? (isExplaining ? '#FFFFFF' : '#715A4F') : (isExplaining ? '#24382B' : '#FFFFFF'), border: isAi ? '1px solid #E8DCCF' : '1px solid rgba(255,255,255,0.3)' }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            isAi
                              ? isExplaining
                                ? 'bg-[#24382B] text-white'
                                : 'bg-[#FFF9EE] hover:bg-[#FFEEC9] text-[#715A4F] border border-[#E8DCCF]'
                              : isExplaining
                              ? 'bg-white text-[#24382B]'
                              : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                          }`}
                          title={bilingualLabel("Giải thích từ vựng & sắc thái văn hóa", "Explain vocabulary & cultural nuances")}
                        >
                          <HelpCircle size={13} />
                          <span>{bLabel(isExplaining ? 'Đóng giải thích' : 'Giải thích', isExplaining ? 'Hide explanation' : 'Explain')}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-9 h-9 rounded-xl bg-[#DA251D] text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
                      👤
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isSending && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF2D6] border border-[#FFCD00] flex items-center justify-center text-xl shrink-0 shadow-xs">
                  {scenario.aiRole.avatar}
                </div>
                <div className="bg-white border border-[#E8DCCF] rounded-2xl px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#715A4F]">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#DA251D] animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-[#DA251D] animate-ping delay-150" />
                      <span className="w-2 h-2 rounded-full bg-[#DA251D] animate-ping delay-300" />
                    </div>
                    <span><BilingualText vi={`${scenario.aiRole.name} đang suy nghĩ câu trả lời...`} en={`${scenario.aiRole.name} is thinking of a response...`} /></span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Suggested Hints for User */}
          <AnimatePresence>
            {showHints && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-5 py-3.5 bg-[#FFF9EE] border-t border-[#EADCC7] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A62A24] uppercase tracking-wider">
                    <Lightbulb size={13} className="text-[#DA251D]" />
                    <BilingualText vi="Gợi ý câu trả lời tự nhiên (Bấm để gửi ngay):" en="Natural response hints (Click to send):" />
                  </div>
                  <span className="text-[10px] text-[#64748B]"><BilingualText vi="Chạm 1 lần để nói" en="Tap once to speak" /></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sug.text)}
                      disabled={isSending}
                      className="group flex flex-col text-left p-2.5 rounded-xl bg-white hover:bg-[#FFF2D6] border border-[#DECBB4] hover:border-[#FFCD00] shadow-xs hover:shadow-sm transition-all"
                    >
                      <span className="text-xs font-bold text-[#202124] group-hover:text-[#DA251D] transition-colors leading-tight">
                        "{sug.text}"
                      </span>
                      <span className="text-[11px] text-[#715A4F] italic mt-0.5 line-clamp-1">
                        ({sug.meaning})
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Input Console */}
          <div className="roleplay-input-console p-3 sm:p-4 bg-white border-t border-[#EADCC7]">
            <div className="flex items-center gap-2.5">
              {/* Mic Speech Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                disabled={isSending}
                className={`relative h-11 w-11 min-h-0 p-0 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  isListening
                    ? 'bg-[#DA251D] text-white shadow-lg ring-4 ring-[#DA251D]/25 animate-pulse'
                    : 'bg-[#FFF9EE] hover:bg-[#FFEEC9] text-[#715A4F] hover:text-[#DA251D] border border-[#DECBB4]'
                }`}
                title={isListening ? bilingualLabel('Đang nghe giọng nói... Bấm để dừng', 'Listening... Click to stop') : bilingualLabel('Bấm để nói tiếng Việt (Microphone)', 'Click to speak Vietnamese (Microphone)')}
              >
                <Mic size={18} className={isListening ? 'animate-bounce' : ''} />
                {isListening && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FFCD00] border-2 border-white" />
                )}
              </button>

              {/* Textarea */}
              <div className="relative flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  disabled={isSending}
                  placeholder={bLabel(`Nhập câu thoại tiếng Việt của bạn với ${scenario.aiRole.name}...`, `Type your Vietnamese response to ${scenario.aiRole.name}...`)}
                  className="w-full resize-none px-4 py-2.5 bg-[#FFF7E8] border border-[#E8E5DF] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/10 rounded-2xl text-xs sm:text-sm text-[#253044] placeholder-[#64748B]/60 transition-all outline-hidden leading-relaxed"
                />
                <span className="absolute right-3 bottom-2 text-[10px] text-[#64748B]/70 hidden sm:inline">
                  <BilingualText vi="Enter ↵ để gửi" en="Enter ↵ to send" />
                </span>
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isSending}
                className={`inline-flex items-center justify-center gap-1.5 h-11 min-h-0 px-4 sm:px-5 rounded-xl font-bold text-xs sm:text-sm shrink-0 transition-all ${
                  inputText.trim() && !isSending
                    ? 'bg-[#DA251D] hover:bg-[#B71C1C] text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}
              >
                <span><BilingualText vi="Gửi" en="Send" /></span>
                <Send size={15} />
              </button>
            </div>
          </div>
        </main>

        {/* Right Mission Sidebar (Col 4) */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Mission Progress Card */}
          <div className="bg-white rounded-3xl border border-[#DECBB4] p-5 sm:p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-[#DA251D] uppercase tracking-wider">
                  <BilingualText vi="Tiến độ kịch bản" en="Scenario progress" />
                </span>
                <span className="text-xs font-bold text-[#253044]">
                  <BilingualText
                    vi={`${completedCount}/${totalTasks} mục tiêu (${progressPercent}%)`}
                    en={`${completedCount}/${totalTasks} goals (${progressPercent}%)`}
                  />
                </span>
              </div>
              <h3 className="text-base font-black text-[#202124] tracking-tight">
                <BilingualText vi="Mục tiêu đối thoại" en="Dialogue objectives" />
              </h3>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#EADCC7] overflow-hidden mt-2.5">
                <div
                  className="h-full bg-gradient-to-r from-[#DA251D] to-[#FFCD00] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {session?.completionReported && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  <CheckCircle2 size={12} />
                  <BilingualText>{"Đã ghi nhận hoàn thành kịch bản"}</BilingualText>
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 pt-1">
              {scenario.objectives?.map((task, idx) => {
                const isDone = session?.completedTasks?.includes(task.id);
                return (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-[#F2F7F2] border-[#C3DEC3] text-[#24382B]'
                        : 'bg-[#FFF9EE] border-[#DECBB4] text-[#4A3B32]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-[#DECBB4] text-[#715A4F]'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </span>

                    <div className="flex-1 text-xs leading-snug">
                      <div className={`font-semibold ${isDone ? 'line-through opacity-80' : ''}`}>
                        {isVi ? (task.labelVi || task.label) : (task.labelEn || task.label)}
                      </div>
                      {isDone && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700">
                          ✨ <BilingualText vi="Đã hoàn thành!" en="Completed!" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roleplay Persona Card */}
          <div className="bg-gradient-to-br from-[#FFF9EE] to-[#FFF2D6] rounded-3xl border border-[#FFCD00]/50 p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#A62A24]">
              <span>🎭</span>
              <BilingualText vi="Nhắc nhở vai diễn của bạn:" en="Your role reminder:" />
            </div>

            <div className="text-xs text-[#5B3E31] leading-relaxed">
              <BilingualText vi="Bạn đang đóng vai:" en="You are playing:" />{' '}
              <strong className="text-[#FF7A00] font-bold">
                <BilingualText
                  vi={scenario.learnerRole?.roleVi || scenario.learnerRole?.role || 'Du khách'}
                  en={scenario.learnerRole?.roleEn || scenario.learnerRole?.role || 'Traveler'}
                />
              </strong>.
              <p className="mt-1">
                <BilingualText
                  vi={'Hãy xưng hô tự nhiên và dùng kính ngữ lịch sự như "Dạ", "ạ", "cho em hỏi" để ghi điểm tối đa nhé!'}
                  en={'Use natural address terms and polite honorifics like "Dạ", "ạ", "cho em hỏi" to maximize your score!'}
                />
              </p>
            </div>
          </div>

          {/* Finish & View Results CTA */}
          <button
            type="button"
            onClick={handleFinishSession}
            style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '44px', minHeight: '44px', padding: '0 20px', borderRadius: '16px', background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#FFFFFF', border: 'none', fontSize: '13.5px', fontWeight: 800, boxShadow: '0 4px 12px rgba(249,115,22,0.28)' }}
          >
            <Award size={16} className="text-[#FFCD00]" />
            <span>{bLabel('Hoàn tất & Nhận đánh giá ➔', 'Complete & View Evaluation ➔')}</span>
          </button>
        </aside>
      </div>
    </div>
  );
}

import { BilingualText, bilingualLabel, useBilingualLabel } from '@/shared/components/common/BilingualText';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { aiRoleplayService, evaluateObjectives } from '@/features/ai/api/aiRoleplayService';
import { useConfirmDialog } from '@/shared/components/common/ConfirmDialog';
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

  useEffect(() => {
    if (id) {
      const currentSession = aiRoleplayService.getRoleplaySession(id);
      setSession(currentSession);
      aiRoleplayService.initRoleplaySession(id).then(updated => {
        if (updated) setSession(updated);
      }).catch(() => {});
    }
  }, [id]);

  // Khi learner hoàn thành 100% mục tiêu → tự báo hoàn thành lên backend
  // để Admin cập nhật "Lượt hoàn thành" (chỉ báo 1 lần mỗi phiên).
  useEffect(() => {
    if (!id || !session || session.completionReported) return;
    if (!aiRoleplayService.isProgressComplete(id, session)) return;

    aiRoleplayService.reportCompletion(id).then(res => {
      setSession(aiRoleplayService.getRoleplaySession(id));
      if (res && !res.alreadyReported) {
        showToast('🎉 Bạn đã hoàn thành 100% mục tiêu! Tiến độ đã được ghi nhận.');
      }
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, session?.completedTasks?.length, session?.completionReported]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF2D6] text-[#EA580C] border border-[#FDE68A] text-xs font-bold">
              {scenario.level || 'A1 - A2'}
            </span>
          </div>
        </div>

        {/* Speed & Global Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Audio speed pill */}
          <div className="rp-speed-group shadow-xs">
            <span className="px-2 text-[#64748B] text-[11px] font-semibold"><BilingualText vi="Tốc độ đọc:" en="Audio speed:" /></span>
            <button
              type="button"
              onClick={() => setSpeechRate(0.7)}
              className={`rp-speed-btn ${speechRate === 0.7 ? 'is-active' : ''}`}
            >
              <BilingualText vi="0.7x Chậm" en="0.7x Slow" />
            </button>
            <button
              type="button"
              onClick={() => setSpeechRate(0.95)}
              className={`rp-speed-btn ${speechRate >= 0.9 ? 'is-active' : ''}`}
            >
              <BilingualText vi="1.0x Chuẩn" en="1.0x Normal" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetSession}
            className="rp-header-btn"
          >
            <RotateCcw size={14} />
            <BilingualText vi="Bắt đầu lại" en="Restart" />
          </button>

          <button
            type="button"
            onClick={handleFinishSession}
            className="rp-primary-btn"
          >
            <Award size={15} />
            <BilingualText vi="Kết thúc & Xem kết quả" en="Finish & View Results" />
          </button>
        </div>
      </header>

      {/* 2-Column Live Roleplay Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Dialogue Chat Window (Col 8) */}
        <main className="lg:col-span-8 flex flex-col bg-white rounded-3xl border border-[#DECBB4] shadow-md overflow-hidden min-h-[720px]">
          {/* Partner Status Header */}
          <div className="px-6 py-4 bg-white border-b border-[#E8E5DF] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-2xl shadow-xs shrink-0">
                {scenario.aiRole.avatar}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-[#1E293B] leading-tight">
                    {scenario.aiRole.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    AI Partner
                  </span>
                </div>
                <p className="text-xs text-[#64748B] leading-tight mt-1">
                  {scenario.aiRole.role}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHints(!showHints)}
              className={`rp-hints-btn ${showHints ? 'is-active' : ''}`}
            >
              <Lightbulb size={14} className={showHints ? 'text-[#EA580C]' : 'text-[#64748B]'} />
              <BilingualText vi={showHints ? 'Ẩn gợi ý' : 'Hiện gợi ý trả lời'} en={showHints ? 'Hide hints' : 'Show response hints'} />
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
                        ? 'bg-white border border-[#E2E8F0] text-[#1E293B]'
                        : 'bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-white shadow-sm'
                    }`}
                  >
                    {/* Header sender label */}
                    <div
                      className={`text-[11px] font-bold mb-1.5 flex items-center justify-between gap-2 ${
                        isAi ? 'text-[#EA580C]' : 'text-white/80'
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
                        className={`mt-2.5 p-3 rounded-xl text-xs sm:text-sm border ${
                          isAi
                            ? 'bg-[#FFFDF5] border-[#FDE68A] text-[#78350F]'
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
                        className={`mt-2.5 p-3 rounded-xl text-xs border ${
                          isAi
                            ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#14532D]'
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
                        isAi ? 'border-slate-100' : 'border-white/20'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.text, msg.id)}
                        className={isAi ? `rp-msg-action-btn ${isPlayingThis ? 'is-speaking' : ''}` : 'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/30'}
                        title={bilingualLabel("Nghe phát âm chuẩn", "Listen to standard pronunciation")}
                      >
                        <Volume2 size={13} className={isPlayingThis ? 'text-[#EA580C] animate-spin' : ''} />
                        <BilingualText vi="Nghe" en="Listen" />
                      </button>

                      {msg.translation && (
                        <button
                          type="button"
                          onClick={() => toggleTranslation(msg.id)}
                          className={isAi ? `rp-msg-action-btn ${isTranslating ? 'is-translating' : ''}` : `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${isTranslating ? 'bg-white text-[#EA580C]' : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'}`}
                          title={bilingualLabel("Dịch câu nói sang tiếng Anh", "Translate sentence to English")}
                        >
                          <Languages size={13} />
                          <BilingualText vi={isTranslating ? 'Đóng dịch' : 'Dịch'} en={isTranslating ? 'Hide translation' : 'Translate'} />
                        </button>
                      )}

                      {msg.explanation && (
                        <button
                          type="button"
                          onClick={() => toggleExplanation(msg.id)}
                          className={isAi ? `rp-msg-action-btn ${isExplaining ? 'is-explaining' : ''}` : `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${isExplaining ? 'bg-white text-[#166534]' : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'}`}
                          title={bilingualLabel("Giải thích từ vựng & sắc thái văn hóa", "Explain vocabulary & cultural nuances")}
                        >
                          <HelpCircle size={13} />
                          <BilingualText vi={isExplaining ? 'Đóng giải thích' : 'Giải thích'} en={isExplaining ? 'Hide explanation' : 'Explain'} />
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
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
                className="px-6 py-4 bg-[#FFFDF9] border-t border-[#E8E5DF] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#EA580C] uppercase tracking-wider">
                    <Lightbulb size={13} className="text-[#EA580C]" />
                    <BilingualText vi="Gợi ý câu trả lời tự nhiên (Bấm để gửi ngay):" en="Natural response hints (Click to send):" />
                  </div>
                  <span className="text-[10px] text-[#64748B]"><BilingualText vi="Chạm 1 lần để nói" en="Tap once to speak" /></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(sug.text)}
                      disabled={isSending}
                      className="rp-suggestion-btn group"
                    >
                      <span className="text-xs font-bold text-[#1E293B] group-hover:text-[#EA580C] transition-colors leading-tight">
                        "{sug.text}"
                      </span>
                      <span className="text-[11px] text-[#64748B] italic mt-0.5 line-clamp-1">
                        ({sug.meaning})
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Input Console */}
          <div className="roleplay-input-console p-4 sm:p-5 bg-white border-t border-[#E8E5DF]">
            <div className="flex items-center gap-3">
              {/* Mic Speech Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                disabled={isSending}
                className={`rp-mic-btn relative ${isListening ? 'is-active' : ''}`}
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
                  className="w-full resize-none px-4 py-2.5 bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/10 rounded-2xl text-xs sm:text-sm text-[#1E293B] placeholder-[#64748B]/60 transition-all outline-hidden leading-relaxed"
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
                className="rp-send-btn"
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
          <div className="bg-white rounded-3xl border border-[#E8E5DF] p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#EA580C] uppercase tracking-wider">
                  <BilingualText vi="Tiến độ kịch bản" en="Scenario progress" />
                </span>
                <span className="text-xs font-bold text-[#1E293B]">
                  <BilingualText
                    vi={`${completedCount}/${totalTasks} mục tiêu (${progressPercent}%)`}
                    en={`${completedCount}/${totalTasks} goals (${progressPercent}%)`}
                  />
                </span>
              </div>
              <h3 className="text-base font-black text-[#1E293B] tracking-tight">
                <BilingualText vi="Mục tiêu đối thoại" en="Dialogue objectives" />
              </h3>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2.5 border border-slate-200/50">
                <div
                  className="h-full bg-gradient-to-r from-[#FF7A00] to-[#10B981] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {session?.completionReported && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/60">
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
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 shadow-2xs'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-500'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </span>

                    <div className="flex-1 text-xs leading-snug">
                      <div className={`font-semibold ${isDone ? 'line-through opacity-75' : 'text-slate-800'}`}>
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
          <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFF7ED] rounded-3xl border border-[#FED7AA] p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C2410C]">
              <span>🎭</span>
              <BilingualText vi="Nhắc nhở vai diễn của bạn:" en="Your role reminder:" />
            </div>

            <div className="text-xs text-[#78350F] leading-relaxed">
              <BilingualText vi="Bạn đang đóng vai:" en="You are playing:" />{' '}
              <strong className="text-[#EA580C] font-black">
                <BilingualText
                  vi={scenario.learnerRole?.roleVi || scenario.learnerRole?.role || 'Du khách'}
                  en={scenario.learnerRole?.roleEn || scenario.learnerRole?.role || 'Traveler'}
                />
              </strong>.
              <p className="mt-1.5 text-slate-600 font-normal">
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
            className="rp-cta-btn"
          >
            <Award size={16} />
            <BilingualText vi="Hoàn tất & Nhận đánh giá ➔" en="Complete & View Evaluation ➔" />
          </button>
        </aside>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  Copy,
  Check,
  Trash2,
  Edit3,
  Plus,
  Search,
  Bot,
  User,
  BookOpen,
  MessageSquare,
  Compass,
  ArrowRight,
  BookmarkPlus,
  Globe,
  Award,
  Flame,
  Zap,
  VolumeX,
} from 'lucide-react';
import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { aiTutorService } from '@/services/aiTutorService';
import { vocabularyService } from '@/services/vocabularyService';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';
import { audioFeedback } from '@/utils/audioFeedback';
import { TutorMascotAvatar } from '@/components/mascot';

/**
 * FormattedMessageText - Renders markdown bold keywords, bullet points,
 * and code tags with rich EdTech styling.
 */
function FormattedMessageText({ text, isAi }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
      {lines.map((line, lIdx) => {
        if (!line.trim()) {
          return <div key={lIdx} className="h-1.5" />;
        }

        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
        const cleanedLine = isBullet ? line.trim().replace(/^[-*]\s+/, '') : line;

        // Split by **bold** and `code`
        const parts = cleanedLine.split(/(\*\*.*?\*\*|`.*?`)/g);

        const content = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const inner = part.slice(2, -2);
            return (
              <strong
                key={pIdx}
                className={isAi ? 'font-black text-[#DA251D]' : 'font-black text-[#FFCD00]'}
              >
                {inner}
              </strong>
            );
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            const inner = part.slice(1, -1);
            return (
              <code
                key={pIdx}
                className={`px-1.5 py-0.5 rounded-md font-mono text-[11px] ${
                  isAi
                    ? 'bg-[#FFF9ED] text-[#DA251D] border border-[#DECBB4]/70'
                    : 'bg-white/20 text-[#FFF9ED] border border-white/30'
                }`}
              >
                {inner}
              </code>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-1">
              <span className={`text-xs mt-0.5 shrink-0 ${isAi ? 'text-[#DA251D]' : 'text-[#FFCD00]'}`}>
                ✦
              </span>
              <span className="flex-1">{content}</span>
            </div>
          );
        }

        return <p key={lIdx}>{content}</p>;
      })}
    </div>
  );
}

export function AiTutorPage() {
  const { confirm, confirmationDialog } = useConfirmDialog();
  const modes = aiTutorService.getModes();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [currentSession, setCurrentSession] = useState(null);
  const [currentMode, setCurrentMode] = useState('tutor');
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Load sessions on mount
  useEffect(() => {
    const loadedSessions = aiTutorService.getAllSessions();
    const activeId = aiTutorService.getActiveSessionId();
    setSessions(loadedSessions);
    setActiveSessionId(activeId);

    const active = loadedSessions.find((s) => s.id === activeId) || loadedSessions[0];
    if (active) {
      setCurrentSession(active);
      setCurrentMode(active.mode || 'tutor');
    }
  }, []);

  // Scroll to bottom on new message or sending state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isSending]);

  // Setup Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        audioFeedback.playTap();
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSelectSession = (id) => {
    audioFeedback.playTap();
    aiTutorService.setActiveSessionId(id);
    setActiveSessionId(id);
    const session = aiTutorService.getSession(id);
    setCurrentSession(session);
    if (session?.mode) {
      setCurrentMode(session.mode);
    }
  };

  const handleCreateNewChat = (modeToUse = currentMode) => {
    audioFeedback.playSuccessChime();
    const newSession = aiTutorService.createSession(modeToUse);
    setSessions(aiTutorService.getAllSessions());
    setActiveSessionId(newSession.id);
    setCurrentSession(newSession);
    setCurrentMode(newSession.mode);
    showToast(
      `Đã tạo phiên trò chuyện mới với chế độ ${aiTutorService.getMode(modeToUse).name}!`
    );
  };

  const handleSwitchMode = (modeId) => {
    audioFeedback.playTap();
    setCurrentMode(modeId);
    if (currentSession) {
      const updated = aiTutorService.updateSessionMode(currentSession.id, modeId);
      setCurrentSession(updated);
      setSessions(aiTutorService.getAllSessions());
    }
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    if (
      await confirm({
        title: 'Xóa cuộc trò chuyện?',
        description: 'Lịch sử của phiên hội thoại này sẽ bị xóa vĩnh viễn.',
        confirmLabel: 'Xóa cuộc trò chuyện',
      })
    ) {
      audioFeedback.playPopSound(0.8);
      const remaining = aiTutorService.deleteSession(id);
      setSessions(remaining);
      const newActiveId = aiTutorService.getActiveSessionId();
      setActiveSessionId(newActiveId);
      setCurrentSession(aiTutorService.getSession(newActiveId));
      showToast('Đã xóa hội thoại thành công.');
    }
  };

  const handleStartRename = (e, session) => {
    e.stopPropagation();
    setEditingTitleId(session.id);
    setNewTitleInput(session.title);
  };

  const handleSaveRename = (e, id) => {
    e.stopPropagation();
    if (newTitleInput.trim()) {
      const updated = aiTutorService.renameSession(id, newTitleInput);
      setSessions(aiTutorService.getAllSessions());
      if (currentSession?.id === id) {
        setCurrentSession(updated);
      }
      audioFeedback.playTap();
    }
    setEditingTitleId(null);
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending || !currentSession) return;

    audioFeedback.playTap();
    setIsSending(true);
    setInputText('');

    try {
      const { updatedSession } = await aiTutorService.sendMessage(
        currentSession.id,
        text,
        currentMode
      );
      setCurrentSession(updatedSession);
      setSessions(aiTutorService.getAllSessions());
      audioFeedback.playPopSound(1.2);
    } catch (error) {
      console.error(error);
      showToast('Không thể gửi tin nhắn. Vui lòng thử lại!');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSpeak = (msgId, text) => {
    if (!('speechSynthesis' in window)) {
      showToast('Trình duyệt của bạn chưa hỗ trợ phát âm (Speech Synthesis).');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/#|\*|`|>|---/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = speechRate;

    utterance.onstart = () => {
      setSpeakingMessageId(msgId);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
    showToast(`Đang phát âm giọng đọc tiếng Việt (${speechRate}x)...`);
  };

  const handleCopy = (msgId, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(msgId);
    audioFeedback.playTap();
    showToast('Đã sao chép nội dung vào khay nhớ tạm!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleVoiceInput = () => {
    if (!speechRecognitionRef.current) {
      showToast('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói tiếng Việt.');
      return;
    }
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechRecognitionRef.current.start();
      audioFeedback.playTap();
      showToast('Đang lắng nghe... Hãy nói tiếng Việt!');
    }
  };

  const handleSaveWordToVocabulary = async (word, meaning) => {
    try {
      await vocabularyService.add({
        word: word.trim(),
        meaning: meaning.trim() || 'Học từ AI Tutor',
        notes: `Chế độ AI: ${aiTutorService.getMode(currentMode).name}`,
      });
      audioFeedback.playSuccessChime();
      showToast(`⭐ Đã lưu "${word}" vào Sổ từ vựng (+5 XP)!`);
    } catch (err) {
      showToast(`Lưu từ vựng: ${err.message || 'Thành công!'}`);
    }
  };

  const activeModeConfig = aiTutorService.getMode(currentMode);

  const filteredSessions = sessions.filter((s) => {
    const title = (s.titleVi || s.title || '').toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="ai-tutor-screen-root relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Subtle Heritage Dong Son Bronze Drum Background Watermark (4-6% opacity) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <div
          className="w-[min(96vw,1000px)] h-[min(96vw,1000px)] sm:w-[920px] sm:h-[920px] lg:w-[1100px] lg:h-[1100px] aspect-square opacity-[0.05] bg-contain bg-center bg-no-repeat transform-gpu"
          style={{
            backgroundImage: `url('/design/dong-son-drum.webp')`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {confirmationDialog}

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#431914] text-white text-xs font-bold shadow-xl border border-[#DECBB4]/40"
          >
            <Sparkles size={15} className="text-[#FFCD00] animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DECBB4]/60 pb-5">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#DA251D] text-xs font-black uppercase tracking-wider">
            <Bot size={14} className="text-[#DA251D]" />
            <span>AI Speaking Partner • 7 Chế Độ Học</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#202124] tracking-tight">
            Gia Sư AI Tiếng Việt Thông Minh
          </h1>
          <p className="text-xs sm:text-sm text-[#78685B] max-w-2xl">
            Luyện đàm thoại, giải đáp ngữ pháp, trau chuốt câu văn và học văn hóa 3 miền cùng gia sư AI bản xứ 24/7.
          </p>
        </div>

        {/* Action Link to Scenarios Roleplay */}
        <div className="flex items-center gap-3">
          <Link
            to="/ai-scenarios"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF9EE] border border-[#DECBB4] text-[#202124] hover:text-[#DA251D] text-xs font-bold shadow-2xs transition-all"
          >
            <Compass size={15} className="text-[#DA251D]" />
            <span>Kịch bản nhập vai tình huống</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Main 2-Column AI Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar (4 cols on lg ~ 30%): Chat History & Sessions */}
        <aside className="lg:col-span-4 bg-white/95 backdrop-blur-md rounded-3xl border border-[#DECBB4]/80 p-4 sm:p-5 shadow-sm space-y-4 text-left">
          {/* Top Button: New Chat */}
          <button
            type="button"
            onClick={() => handleCreateNewChat(currentMode)}
            className="w-full py-3 px-4 rounded-2xl bg-[#DA251D] hover:bg-[#89221E] text-white font-black text-xs shadow-[0_3px_0_#89221E] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Cuộc trò chuyện mới</span>
          </button>

          {/* Search Bar for Sessions */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78685B]"
            />
            <input
              type="text"
              placeholder="Tìm kiếm hội thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DECBB4]/70 text-xs text-[#202124] placeholder:text-[#78685B]/60 focus:outline-none focus:border-[#DA251D] transition-colors"
            />
          </div>

          {/* Sessions List Header */}
          <div className="flex items-center justify-between text-[11px] font-bold text-[#78685B] px-1 pt-1">
            <span className="uppercase tracking-wider">Lịch sử hội thoại</span>
            <span className="bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#DECBB4]/60">
              {sessions.length} phiên
            </span>
          </div>

          {/* Session Cards Stream */}
          <div className="space-y-2 max-h-[calc(100vh-360px)] overflow-y-auto pr-1">
            {filteredSessions.map((s) => {
              const sessionMode = aiTutorService.getMode(s.mode);
              const isActive = s.id === activeSessionId;
              const isEditing = editingTitleId === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSession(s.id)}
                  className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-[#FFF9EE] border-2 border-[#DA251D] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#DECBB4]/60 hover:border-[#DA251D]/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-white border border-[#DECBB4]/60 flex items-center justify-center text-base shrink-0 shadow-2xs">
                      {sessionMode?.icon || '💬'}
                    </span>
                    <div className="min-w-0">
                      {isEditing ? (
                        <input
                          type="text"
                          value={newTitleInput}
                          onChange={(e) => setNewTitleInput(e.target.value)}
                          onBlur={(e) => handleSaveRename(e, s.id)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleSaveRename(e, s.id)
                          }
                          autoFocus
                          className="px-2 py-0.5 text-xs font-bold bg-white border border-[#DA251D] rounded-md focus:outline-none w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h4 className="text-xs font-bold text-[#202124] truncate">
                          {s.titleVi || s.title}
                        </h4>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] text-[#78685B] mt-0.5">
                        <span className="font-semibold text-[#DA251D]">
                          {sessionMode?.name}
                        </span>
                        <span>•</span>
                        <span>{s.messages?.length || 0} tin nhắn</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Rename & Delete */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(e, s)}
                      className="p-1.5 rounded-lg text-[#78685B] hover:text-[#202124] hover:bg-white transition-colors"
                      title="Đổi tên hội thoại"
                    >
                      <Edit3 size={13} />
                    </button>
                    {sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(e, s.id)}
                        className="p-1.5 rounded-lg text-[#78685B] hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa hội thoại"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Main Column (8 cols on lg ~ 70%): Studio Chat Console */}
        <main className="lg:col-span-8 bg-white/95 backdrop-blur-md rounded-3xl border border-[#DECBB4]/80 shadow-[0_10px_30px_rgba(67,25,20,0.04)] overflow-hidden flex flex-col min-h-[640px] text-left">
          {/* Top Console Bar with Mode Info & Speed Toggle */}
          <div className="p-4 sm:p-5 border-b border-[#DECBB4]/60 bg-gradient-to-r from-[#FFF9EE] via-white to-[#FFF9EE] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Mascot Status */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <TutorMascotAvatar state={isListening ? 'listening' : isSending ? 'thinking' : speakingMessageId ? 'speaking' : 'idle'} size="small" />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"
                    title="Online • Sẵn sàng giải đáp"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#202124]">
                      Hola AI Tutor
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase"
                      style={{
                        background: activeModeConfig.bg,
                        color: activeModeConfig.color,
                      }}
                    >
                      {activeModeConfig.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#78685B] leading-tight mt-0.5">
                    {activeModeConfig.title} — {activeModeConfig.description}
                  </p>
                </div>
              </div>

              {/* Speed Controller & Sound Mode */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="text-[11px] font-bold text-[#78685B]">Tốc độ đọc:</span>
                <button
                  type="button"
                  onClick={() => {
                    const newRate = speechRate === 0.95 ? 0.65 : 0.95;
                    setSpeechRate(newRate);
                    audioFeedback.playTap();
                    showToast(`Tốc độ phát âm: ${newRate}x`);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#DECBB4] text-[#DA251D] text-xs font-bold hover:bg-[#FFF9EE] transition-colors shadow-2xs cursor-pointer"
                  title="Chuyển đổi tốc độ phát âm (1.0x Chuẩn / 0.65x Chậm)"
                >
                  {speechRate === 0.95 ? '⚡ 1.0x Chuẩn' : '🐢 0.65x Chậm'}
                </button>
              </div>
            </div>

            {/* 7 Modes Horizontal Pill Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
              {modes.map((mode) => {
                const isSelected = mode.id === currentMode;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleSwitchMode(mode.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#DA251D] text-white shadow-xs scale-102'
                        : 'bg-white hover:bg-[#FAF8F5] text-[#202124] border border-[#DECBB4]/60'
                    }`}
                    title={bilingualLabel(mode.description)}
                  >
                    <span>{mode.icon}</span>
                    <span>{mode.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 max-h-[520px] bg-gradient-to-b from-[#FAF8F5]/40 via-white to-[#FAF8F5]/40">
            {currentSession?.messages?.map((msg) => {
              const isAi = msg.sender === 'ai';
              const isSpeaking = speakingMessageId === msg.id;
              const isCopied = copiedId === msg.id;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 ${
                    isAi ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Left AI Avatar */}
                  {isAi && (
                    <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-2xs border border-[#DECBB4]">
                      <TutorMascotAvatar state={isSpeaking ? 'speaking' : 'idle'} size="tiny" />
                    </div>
                  )}

                  {/* Message Bubble Card */}
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-white border border-[#DECBB4]/80 text-[#202124] rounded-tl-sm'
                        : 'bg-gradient-to-r from-[#DA251D] to-[#89221E] text-white rounded-tr-sm shadow-md'
                    }`}
                  >
                    {/* Message Body with rich Markdown formatting */}
                    <FormattedMessageText text={msg.text} isAi={isAi} />

                    {/* Useful Vocabulary Cards extracted from message */}
                    {msg.savedWords && msg.savedWords.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#DECBB4]/40 space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-[#DA251D]">
                          <BookOpen size={13} />
                          <span>Từ vựng hữu ích gợi ý:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.savedWords.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                handleSaveWordToVocabulary(item.word, item.meaning)
                              }
                              className="px-2.5 py-1 rounded-xl bg-[#FFF9EE] hover:bg-[#F5E1D8] border border-[#DECBB4] text-[#431914] text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer group/vocab"
                              title={`Lưu từ "${item.word}" vào sổ từ vựng`}
                            >
                              <BookmarkPlus
                                size={12}
                                className="text-[#DA251D] group-hover/vocab:scale-115 transition-transform"
                              />
                              <span>
                                <strong>{item.word}</strong>: {item.meaning}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Bar for AI Messages */}
                    {isAi && (
                      <div className="mt-3 pt-2.5 border-t border-[#DECBB4]/40 flex items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-2">
                          {/* Speak Button */}
                          <button
                            type="button"
                            onClick={() => handleSpeak(msg.id, msg.text)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                              isSpeaking
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-[#FAF8F5] hover:bg-[#F5E1D8] text-[#DA251D] border border-[#DECBB4]/60'
                            }`}
                            title={isSpeaking ? 'Dừng phát âm' : 'Nghe giọng đọc tiếng Việt'}
                          >
                            <Volume2
                              size={13}
                              className={isSpeaking ? 'animate-pulse' : ''}
                            />
                            <span>{isSpeaking ? 'Đang đọc...' : 'Nghe phát âm'}</span>
                          </button>

                          {/* Sound wave bars animation while speaking */}
                          {isSpeaking && (
                            <div className="flex items-center gap-0.5 h-4 px-1.5 bg-amber-50 rounded-md">
                              {[40, 90, 60, 100, 50].map((h, i) => (
                                <motion.span
                                  key={i}
                                  animate={{
                                    height: [`${h}%`, `${Math.max(20, 105 - h)}%`, `${h}%`],
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                  }}
                                  className="w-1 bg-[#DA251D] rounded-full"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[#78685B] hover:text-[#202124] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                          title="Sao chép nội dung tin nhắn"
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} className="text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right User Avatar */}
                  {!isAi && (
                    <div className="w-9 h-9 rounded-xl bg-[#431914] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      <User size={16} />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Sending Thinking Animation */}
            {isSending && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-2xs border border-[#DECBB4]">
                  <TutorMascotAvatar state="thinking" size="tiny" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#DECBB4]/80 shadow-xs flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#DA251D] animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-[#DA251D] animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-[#DA251D] animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#78685B]">
                    Hola AI đang suy nghĩ và chuẩn bị câu trả lời...
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips Carousel */}
          <div className="p-3 bg-[#FAF8F5] border-t border-[#DECBB4]/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-black uppercase text-[#DA251D] shrink-0 pl-1 flex items-center gap-1">
              <Sparkles size={12} />
              <span>Gợi ý:</span>
            </span>
            {activeModeConfig.quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isSending}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF9EE] border border-[#DECBB4]/70 hover:border-[#DA251D] text-xs font-semibold text-[#202124] shrink-0 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#DECBB4]/60 flex items-center gap-2 sm:gap-3">
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              disabled={isSending}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                  : 'bg-[#FAF8F5] hover:bg-[#F5E1D8] text-[#DA251D] border border-[#DECBB4]'
              }`}
              title={
                isListening
                  ? 'Đang lắng nghe... Bấm để dừng'
                  : 'Nói tiếng Việt qua Micro'
              }
              aria-label="Thu âm giọng nói tiếng Việt"
            >
              {isListening ? (
                <MicOff size={18} strokeWidth={2.5} />
              ) : (
                <Mic size={18} strokeWidth={2.5} />
              )}
            </button>

            {/* Input Textarea */}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={bilingualLabel(activeModeConfig.placeholder)}
              rows={1}
              disabled={isSending}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4]/80 text-xs sm:text-sm text-[#202124] placeholder:text-[#78685B]/60 focus:outline-none focus:border-[#DA251D] focus:bg-white resize-none transition-all"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isSending}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                inputText.trim() && !isSending
                  ? 'bg-[#DA251D] hover:bg-[#89221E] text-white shadow-[0_3px_0_#89221E] active:translate-y-0.5 active:shadow-none'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
              title="Gửi tin nhắn (Enter)"
              aria-label="Gửi tin nhắn"
            >
              <Send size={18} strokeWidth={2.5} />
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
}

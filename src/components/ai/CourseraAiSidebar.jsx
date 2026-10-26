import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ArrowUp,
  Bot,
  Check,
  Copy,
  Info,
  Maximize2,
  Mic,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAiSidebar } from '@/contexts/AiSidebarContext';
import { aiTutorService } from '@/services/aiTutorService';
import ngheIdleMascot from '@/assets/mascot/nghe-idle.webp';

function cleanAiText(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/^\s*(?:user|response)\s+safety\s*:\s*(?:safe|unsafe|blocked|unknown)\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Lightweight safe markdown formatter for AI chat messages.
 * Handles bolding **text**, bullet points, and paragraphs.
 */
function FormattedAiMessage({ text }) {
  if (!text) return null;

  const paragraphs = text.split('\n\n');

  return (
    <div className="coursera-ai-msg__bubble">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        const isBulletList = lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '));

        if (isBulletList) {
          return (
            <ul key={pIdx}>
              {lines.map((line, lIdx) => {
                const itemText = line.trim().replace(/^[-*]\s+/, '');
                return <li key={lIdx} dangerouslySetInnerHTML={{ __html: renderInline(itemText) }} />;
              })}
            </ul>
          );
        }

        return (
          <p
            key={pIdx}
            dangerouslySetInnerHTML={{ __html: renderInline(para.replace(/\n/g, '<br/>')) }}
          />
        );
      })}
    </div>
  );
}

function renderInline(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-stone-100 px-1 py-0.5 rounded text-xs text-orange-700 font-mono">$1</code>');
}

export function CourseraAiSidebar({ width, onResize, onClose }) {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const { learningContext, pendingPrompt, clearPendingPrompt } = useAiSidebar();
  const isVi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi');

  const [session, setSession] = useState(() => {
    return aiTutorService.getSession(aiTutorService.getActiveSessionId());
  });
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showBanner, setShowBanner] = useState(() => {
    try {
      return localStorage.getItem('hola:ai-banner-dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const resizeStartRef = useRef({ startX: 0, startWidth: 420 });

  // Quick prompt suggestions matching Coursera
  const suggestions = isVi
    ? [
        { icon: '✨', text: 'Hãy trò chuyện cùng tôi' },
        { icon: '📖', text: 'Giải thích ngữ pháp trọng tâm bài này' },
        { icon: '🗣️', text: 'Luyện phát âm chuẩn dấu hỏi và dấu ngã' },
        { icon: '📝', text: 'Cho 3 ví dụ câu giao tiếp tự nhiên hàng ngày' },
        { icon: '💡', text: 'Sửa lỗi và nâng cấp câu tiếng Việt của tôi' },
      ]
    : [
        { icon: '✨', text: "Let's practice a real conversation" },
        { icon: '📖', text: 'Explain key grammar in this lesson' },
        { icon: '🗣️', text: 'How to pronounce Vietnamese tones correctly?' },
        { icon: '📝', text: 'Give 3 natural everyday example sentences' },
        { icon: '💡', text: 'Help correct and polish my Vietnamese sentence' },
      ];

  // Auto-focus input when opened
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, []);

  // Handle Escape key to close & lock body scroll in drawer overlay mode (< 1600px)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);

    const isOverlayMode = typeof window !== 'undefined' && window.innerWidth < 1600;
    const prevOverflow = document.body.style.overflow;
    if (isOverlayMode) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      if (isOverlayMode) {
        document.body.style.overflow = prevOverflow;
      }
    };
  }, [onClose]);

  // Handle incoming pending prompt (e.g. from lesson page)
  useEffect(() => {
    if (pendingPrompt) {
      setInput(pendingPrompt);
      clearPendingPrompt();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pendingPrompt, clearPendingPrompt]);

  // Dismiss Coursera announcement banner
  const dismissBanner = () => {
    setShowBanner(false);
    try {
      localStorage.setItem('hola:ai-banner-dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  // New Chat session
  const handleNewSession = () => {
    const newSess = aiTutorService.createSession('tutor');
    setSession(newSess);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  // Submit message
  const handleSendMessage = async (textToSend) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isSending) return;

    const activeSession = session || aiTutorService.getSession(aiTutorService.getActiveSessionId());
    setInput('');
    setIsSending(true);

    try {
      // Provide lesson context if active
      let promptWithContext = messageText;
      if (learningContext?.lessonTitle && !activeSession?.messages?.length) {
        promptWithContext = `[Ngữ cảnh: Đang học bài "${learningContext.lessonTitle}"${learningContext.courseTitle ? ` trong khóa "${learningContext.courseTitle}"` : ''}]\n\n${messageText}`;
      }

      const result = await aiTutorService.sendMessage(
        activeSession.id,
        promptWithContext,
        activeSession.mode || 'tutor',
        isVi ? 'vi' : 'en',
      );
      setSession(result.updatedSession);
    } catch (error) {
      setSession((current) => ({
        ...activeSession,
        messages: [
          ...(current?.messages || activeSession.messages || []),
          {
            id: `msg-${Date.now()}-err`,
            sender: 'ai',
            text: error?.message || (isVi ? 'Không thể kết nối với AI Tutor lúc này. Vui lòng thử lại!' : 'Cannot reach AI Tutor. Please try again!'),
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    } finally {
      setIsSending(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Copy message
  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Text-to-speech pronunciation
  const handleSpeak = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice speech-to-text recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isVi ? 'Trình duyệt không hỗ trợ nhận diện giọng nói.' : 'Speech recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // ==========================================
  // Resizer drag handler (Left border)
  // ==========================================
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startWidth: width,
    };
    document.body.classList.add('is-resizing-ai-sidebar');

    const handleMouseMove = (moveEvent) => {
      const deltaX = resizeStartRef.current.startX - moveEvent.clientX;
      const newWidth = resizeStartRef.current.startWidth + deltaX;
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.classList.remove('is-resizing-ai-sidebar');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [width, onResize]);

  // Touch drag support for tablet/touch devices
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    resizeStartRef.current = {
      startX: touch.clientX,
      startWidth: width,
    };
    setIsResizing(true);

    const handleTouchMove = (moveEvent) => {
      if (moveEvent.touches.length !== 1) return;
      const moveTouch = moveEvent.touches[0];
      const deltaX = resizeStartRef.current.startX - moveTouch.clientX;
      const newWidth = resizeStartRef.current.startWidth + deltaX;
      onResize(newWidth);
    };

    const handleTouchEnd = () => {
      setIsResizing(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  }, [width, onResize]);

  const messages = (session?.messages || [])
    .map((msg) => ({ ...msg, text: cleanAiText(msg.text) }))
    .filter((msg) => msg.text);

  const greetingName = user?.fullName || user?.name || (isVi ? 'bạn' : 'there');

  return (
    <>
      {/* Mobile backdrop */}
      <div className="coursera-ai-backdrop" onClick={onClose} aria-hidden="true" />

      <aside
        className="coursera-ai-sidebar"
        style={{ width: `${width}px` }}
        aria-label={isVi ? 'Trợ lý AI Hola' : 'Hola AI Coach'}
      >
        {/* Drag Resizer on left border */}
        <div
          className={`coursera-ai-resizer ${isResizing ? 'is-active' : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          title={isVi ? 'Kéo để chỉnh độ rộng' : 'Drag to resize panel'}
          aria-label={isVi ? 'Thanh kéo chỉnh độ rộng' : 'Resize handle'}
          role="separator"
          tabIndex={0}
        >
          <div className="coursera-ai-resizer__grip" />
        </div>

        {/* Top Header */}
        <header className="coursera-ai-header">
          <div className="coursera-ai-header__brand">
            <div className="coursera-ai-header__icon-badge">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="coursera-ai-header__title">
                {isVi ? 'Trợ lý AI Hola' : 'Hola AI Coach'}
                <span className="coursera-ai-header__badge">BETA</span>
              </h2>
            </div>
          </div>

          <div className="coursera-ai-header__actions">
            <button
              type="button"
              className="coursera-ai-header__btn"
              onClick={handleNewSession}
              title={isVi ? 'Bắt đầu cuộc trò chuyện mới' : 'New chat'}
              aria-label={isVi ? 'Cuộc trò chuyện mới' : 'New chat'}
            >
              <RotateCcw size={16} />
            </button>

            <Link
              to="/ai-tutor"
              className="coursera-ai-header__btn"
              title={isVi ? 'Mở phòng học AI toàn màn hình' : 'Open full AI studio'}
              aria-label={isVi ? 'Mở phòng học AI' : 'Open full AI studio'}
            >
              <Maximize2 size={16} />
            </Link>

            <button
              type="button"
              className="coursera-ai-header__btn"
              onClick={onClose}
              title={isVi ? 'Đóng trợ lý AI' : 'Close AI assistant'}
              aria-label={isVi ? 'Đóng' : 'Close'}
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="coursera-ai-body">
          {/* Blue Announcement Banner (Matching Coursera screenshot) */}
          {showBanner && (
            <div className="coursera-ai-banner" role="region" aria-label="Thông báo mới">
              <div className="coursera-ai-banner__header">
                <Sparkles size={16} />
                <span>{isVi ? 'Mới! Trợ lý AI nay đã hiểu bài học của bạn' : 'New! AI Assistant is now lesson-aware'}</span>
              </div>
              <p className="coursera-ai-banner__desc">
                {isVi
                  ? 'Trợ lý có thể giải thích ngữ pháp bài học hiện tại, phát âm, dịch thuật và đồng hành luyện nói cùng bạn theo thời gian thực.'
                  : 'Your AI coach understands your active lesson context, provides instant grammar explanations, audio pronunciation, and interactive practice.'}
              </p>
              <div className="coursera-ai-banner__actions">
                <button
                  type="button"
                  className="coursera-ai-banner__btn-ok"
                  onClick={dismissBanner}
                >
                  {isVi ? 'Nghe có vẻ tuyệt' : 'Sounds great'}
                </button>
                <button
                  type="button"
                  className="coursera-ai-banner__btn-dismiss"
                  onClick={dismissBanner}
                >
                  {isVi ? 'Tắt nó đi' : 'Dismiss'}
                </button>
              </div>
            </div>
          )}

          {/* Active Lesson Context indicator if available */}
          {learningContext?.lessonTitle && (
            <div className="coursera-ai-context-pill">
              <Info size={13} className="text-orange-500" />
              <span>{isVi ? 'Đang học:' : 'Active lesson:'}</span>
              <strong>{learningContext.lessonTitle}</strong>
            </div>
          )}

          {/* Large Welcoming Greeting (Matching Coursera screenshot) */}
          {messages.length === 0 && (
            <div className="coursera-ai-greeting">
              <h3 className="coursera-ai-greeting__title">
                {isVi ? `Chào, ${greetingName}. Tôi có thể giúp gì?` : `Hi ${greetingName}. How can I help today?`}
              </h3>
              <p className="coursera-ai-greeting__sub">
                {isVi
                  ? 'Hỏi bất kỳ điều gì về bài học, từ vựng hoặc ngữ pháp tiếng Việt.'
                  : 'Ask anything about your lessons, vocabulary, grammar, or speaking practice.'}
              </p>
            </div>
          )}

          {/* Suggestion Chips */}
          {messages.length === 0 && (
            <div className="coursera-ai-suggestions">
              <span className="coursera-ai-suggestions__label">
                {isVi ? 'Gợi ý câu hỏi' : 'Suggested prompts'}
              </span>
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="coursera-ai-chip"
                  onClick={() => handleSendMessage(item.text)}
                >
                  <span>
                    <span className="mr-2">{item.icon}</span>
                    {item.text}
                  </span>
                  <ArrowRight size={14} className="coursera-ai-chip__arrow" />
                </button>
              ))}
            </div>
          )}

          {/* Message Thread */}
          <div className="coursera-ai-messages" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.sender === 'user' ? 'coursera-ai-msg--user' : 'coursera-ai-msg--ai'}
              >
                {msg.sender === 'ai' && (
                  <div className="coursera-ai-msg__avatar">
                    <img src={ngheIdleMascot} alt="Nghé" />
                  </div>
                )}

                <div className="coursera-ai-msg__content">
                  {msg.sender === 'user' ? (
                    <div>{msg.text}</div>
                  ) : (
                    <>
                      <FormattedAiMessage text={msg.text} />

                      {/* Native alternative or Grammar correction if returned */}
                      {msg.nativeAlternative && (
                        <div className="coursera-ai-msg__addon coursera-ai-msg__addon--native">
                          <strong>{isVi ? 'Cách nói tự nhiên hơn: ' : 'More natural phrasing: '}</strong>
                          <span>{msg.nativeAlternative}</span>
                        </div>
                      )}

                      {msg.grammarCorrection && (
                        <div className="coursera-ai-msg__addon coursera-ai-msg__addon--grammar">
                          <strong>{isVi ? 'Lưu ý ngữ pháp: ' : 'Grammar note: '}</strong>
                          <span>{msg.grammarCorrection}</span>
                        </div>
                      )}

                      <div className="coursera-ai-msg__footer">
                        <button
                          type="button"
                          className="coursera-ai-msg__action"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          title={isVi ? 'Sao chép câu trả lời' : 'Copy answer'}
                        >
                          {copiedId === msg.id ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                          <span>{copiedId === msg.id ? (isVi ? 'Đã chép' : 'Copied') : (isVi ? 'Sao chép' : 'Copy')}</span>
                        </button>

                        <button
                          type="button"
                          className="coursera-ai-msg__action"
                          onClick={() => handleSpeak(msg.text)}
                          title={isVi ? 'Nghe phát âm tiếng Việt' : 'Listen pronunciation'}
                        >
                          <Volume2 size={12} />
                          <span>{isVi ? 'Nghe' : 'Listen'}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="coursera-ai-thinking">
                <div className="coursera-ai-thinking__dot" />
                <div className="coursera-ai-thinking__dot" />
                <div className="coursera-ai-thinking__dot" />
                <span>{isVi ? 'Trợ lý AI đang suy nghĩ…' : 'AI Coach is thinking…'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Sticky Bottom Input Dock */}
        <footer className="coursera-ai-footer">
          <form className="coursera-ai-input-wrap" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="coursera-ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isVi ? 'Hãy hỏi tôi bất kỳ điều gì…' : 'Ask me anything about your learning…'}
              disabled={isSending}
              aria-label={isVi ? 'Nội dung câu hỏi cho AI' : 'Question for AI'}
            />

            <button
              type="button"
              className={`coursera-ai-input__mic ${isListening ? 'is-listening' : ''}`}
              onClick={toggleSpeechRecognition}
              title={isListening ? (isVi ? 'Dừng thu âm' : 'Stop listening') : (isVi ? 'Nhập bằng giọng nói' : 'Speak')}
              aria-label={isVi ? 'Nhập giọng nói' : 'Voice input'}
            >
              <Mic size={17} />
            </button>

            <button
              type="submit"
              className="coursera-ai-input__send"
              disabled={!input.trim() || isSending}
              title={isVi ? 'Gửi câu hỏi' : 'Send'}
              aria-label={isVi ? 'Gửi' : 'Send'}
            >
              <ArrowUp size={18} />
            </button>
          </form>

          <p className="coursera-ai-disclaimer">
            {isVi
              ? 'Công cụ được hỗ trợ bởi AI, có thể tạo nội dung không chính xác. Hãy kiểm tra các thông tin quan trọng.'
              : 'AI-powered assistant. Answers may occasionally be inaccurate. Please verify important information.'}
          </p>
        </footer>
      </aside>
    </>
  );
}

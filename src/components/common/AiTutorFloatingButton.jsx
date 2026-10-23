import { useLocation } from 'react-router-dom';
import { useLayoutEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { aiTutorService, detectInputLanguage, enforceLanguageConsistency } from '@/services/aiTutorService';
import ngheIdleMascot from '@/assets/mascot/nghe-idle.webp';

function cleanMiniChatText(value) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/^\s*(?:user|response)\s+safety\s*:\s*(?:safe|unsafe|blocked|unknown)\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function AiTutorFloatingButton() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [session, setSession] = useState(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // The AI Tutor page already has its own full conversation UI. Never expose
  // the helper during a quiz attempt, where it could be used as a shortcut.
  const isQuizRoute = location.pathname.startsWith('/quizzes/')
    || location.pathname.startsWith('/quiz-attempts/');

  const rawMessages = session?.messages || [];
  const visibleMessages = rawMessages
    .map((message, idx) => {
      let text = cleanMiniChatText(message.text);
      if (message.sender === 'ai' && idx > 0) {
        const prevUser = rawMessages.slice(0, idx).reverse().find((m) => m.sender === 'user');
        if (prevUser?.text) {
          text = enforceLanguageConsistency(text, detectInputLanguage(prevUser.text));
        }
      }
      return { ...message, text };
    })
    .filter((message) => message.text);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const scrollToLatest = () => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };
    scrollToLatest();
    const rafId = window.requestAnimationFrame(scrollToLatest);
    return () => window.cancelAnimationFrame(rafId);
  }, [isOpen, visibleMessages.length, isSending]);

  if (location.pathname === '/ai-tutor' || isQuizRoute) return null;

  const openChat = () => {
    const activeSession = aiTutorService.getOrCreateTodayMiniSession(session?.id);
    setSession(activeSession);
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const activeSession = aiTutorService.getOrCreateTodayMiniSession(session?.id);
    setInput('');
    setIsSending(true);
    try {
      const result = await aiTutorService.sendMessage(activeSession.id, text, activeSession.mode || 'tutor');
      setSession(result.updatedSession);
    } catch (error) {
      setInput(text);
      setSession((current) => ({
        ...activeSession,
        messages: [
          ...(current?.messages || activeSession.messages || []),
          {
            id: `msg-${Date.now()}-error`,
            sender: 'ai',
            text: error?.message || 'Không thể kết nối với AI Tutor lúc này.',
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`ai-tutor-widget ${isOpen ? 'is-open' : ''}`}>
      {isOpen && (
        <section className="ai-tutor-chat" aria-label="Chat với AI Tutor">
          <header className="ai-tutor-chat__header">
            <div>
              <strong>Hola AI Tutor</strong>
              <small>Hỏi nhanh trong lúc học</small>
            </div>
            <button type="button" className="ai-tutor-chat__close" onClick={() => setIsOpen(false)} aria-label="Đóng chat">
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div ref={messagesContainerRef} className="ai-tutor-chat__messages" aria-live="polite">
            {visibleMessages.map((message) => (
              <div key={message.id} className={`ai-tutor-chat__message ${message.sender === 'user' ? 'is-user' : ''}`}>
                {message.text}
              </div>
            ))}
            {isSending && <div className="ai-tutor-chat__message">AI Tutor đang suy nghĩ…</div>}
          </div>

          <form className="ai-tutor-chat__form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Bạn đang thắc mắc gì?"
              aria-label="Nhập câu hỏi cho AI Tutor"
              disabled={isSending}
            />
            <button type="submit" aria-label="Gửi câu hỏi" disabled={!input.trim() || isSending}>
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="ai-tutor-fab"
        onClick={() => (isOpen ? setIsOpen(false) : openChat())}
        aria-label={isOpen ? 'Đóng chat AI Tutor' : 'Mở chat AI Tutor'}
        aria-expanded={isOpen}
        title={isOpen ? 'Đóng chat AI Tutor' : 'Hỏi AI Tutor'}
      >
        <img src={ngheIdleMascot} alt="" aria-hidden="true" />
        <span className="ai-tutor-fab__content">
          <strong>{isOpen ? 'Đóng chat' : 'Hỏi AI Tutor'}</strong>
          {!isOpen && <small>Đang thắc mắc?</small>}
        </span>
      </button>
    </div>
  );
}

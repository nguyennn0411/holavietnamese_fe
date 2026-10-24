import { useLocation, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Send, X, Sparkles, Maximize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { aiTutorService } from '@/services/aiTutorService';
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
  const { i18n } = useTranslation();
  const isVi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi');

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [session, setSession] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // The AI Tutor page already has its own full conversation UI. Never expose
  // the helper during a quiz attempt, where it could be used as a shortcut.
  const isQuizRoute = location.pathname.startsWith('/quizzes/')
    || location.pathname.startsWith('/quiz-attempts/');
  if (location.pathname === '/ai-tutor' || isQuizRoute) return null;

  const quickPrompts = isVi
    ? ['Giải thích ngữ pháp này', 'Cách phát âm chuẩn?', 'Cho một ví dụ câu']
    : ['Explain grammar', 'How to pronounce this?', 'Give an example sentence'];

  const openChat = () => {
    const activeSession = aiTutorService.getSession(aiTutorService.getActiveSessionId());
    setSession(activeSession);
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 60);
  };

  const handleQuickPrompt = (promptText) => {
    setInput(promptText);
    inputRef.current?.focus();
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const activeSession = session || aiTutorService.getSession(aiTutorService.getActiveSessionId());
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
            text: error?.message || (isVi ? 'Không thể kết nối với AI Tutor lúc này.' : 'Cannot connect to AI Tutor at the moment.'),
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    } finally {
      setIsSending(false);
      window.setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const visibleMessages = (session?.messages || [])
    .map((message) => ({ ...message, text: cleanMiniChatText(message.text) }))
    .filter((message) => message.text);

  return (
    <div className={`ai-tutor-widget ${isOpen ? 'is-open' : ''}`}>
      {isOpen && (
        <section className="ai-tutor-chat" aria-label={isVi ? 'Chat với Gia sư AI Nghé' : 'Chat with Nghé AI Tutor'}>
          <header className="ai-tutor-chat__header">
            <div className="ai-tutor-chat__identity">
              <div className="ai-tutor-chat__avatar">
                <img src={ngheIdleMascot} alt="Nghé" aria-hidden="true" />
                <span className="ai-tutor-chat__status-dot" aria-hidden="true" />
              </div>
              <div>
                <strong>Hola AI Tutor</strong>
                <small>{isVi ? 'Hỏi nhanh trong lúc học' : 'Quick help while learning'}</small>
              </div>
            </div>
            <div className="ai-tutor-chat__header-actions">
              <Link
                to="/ai-tutor"
                className="ai-tutor-chat__action-btn"
                title={isVi ? 'Mở phòng học Gia sư AI đầy đủ' : 'Open full AI Tutor room'}
                aria-label={isVi ? 'Mở phòng học Gia sư AI đầy đủ' : 'Open full AI Tutor room'}
              >
                <Maximize2 size={16} aria-hidden="true" />
              </Link>
              <button
                type="button"
                className="ai-tutor-chat__action-btn ai-tutor-chat__close"
                onClick={() => setIsOpen(false)}
                aria-label={isVi ? 'Đóng chat' : 'Close chat'}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="ai-tutor-chat__body">
            {visibleMessages.length === 0 && (
              <div className="ai-tutor-chat__welcome">
                <p>
                  {isVi
                    ? 'Chào bạn! Mình là Gia sư AI Nghé. Bạn có thắc mắc gì về bài học hay từ vựng không?'
                    : "Xin chào! I'm Nghé AI Tutor. Need any help with grammar, vocabulary, or speaking?"}
                </p>
                <div className="ai-tutor-chat__chips">
                  {quickPrompts.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="ai-tutor-chat__chip"
                      onClick={() => handleQuickPrompt(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="ai-tutor-chat__messages" aria-live="polite">
              {visibleMessages.map((message) => (
                <div key={message.id} className={`ai-tutor-chat__message ${message.sender === 'user' ? 'is-user' : ''}`}>
                  {message.text}
                </div>
              ))}
              {isSending && (
                <div className="ai-tutor-chat__message ai-tutor-chat__message--thinking">
                  {isVi ? 'Gia sư AI đang suy nghĩ…' : 'AI Tutor is thinking…'}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form className="ai-tutor-chat__form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={isVi ? 'Bạn đang thắc mắc gì?…' : 'Ask AI Tutor anything…'}
              aria-label={isVi ? 'Nhập câu hỏi cho AI Tutor' : 'Type question for AI Tutor'}
              disabled={isSending}
            />
            <button
              type="submit"
              aria-label={isVi ? 'Gửi câu hỏi' : 'Send question'}
              disabled={!input.trim() || isSending}
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`ai-tutor-fab ${isOpen ? 'is-active' : ''}`}
        onClick={() => (isOpen ? setIsOpen(false) : openChat())}
        aria-label={isOpen ? (isVi ? 'Đóng chat Gia sư AI' : 'Close AI Tutor chat') : (isVi ? 'Mở chat Gia sư AI' : 'Open AI Tutor chat')}
        aria-expanded={isOpen}
        title={isOpen ? (isVi ? 'Đóng chat' : 'Close chat') : (isVi ? 'Hỏi Gia sư AI Nghé' : 'Ask Nghé AI Tutor')}
      >
        <div className="ai-tutor-fab__avatar-wrap">
          <img src={ngheIdleMascot} alt="" aria-hidden="true" />
          <span className="ai-tutor-fab__ai-badge" aria-hidden="true">
            <Sparkles size={8} /> AI
          </span>
        </div>
        <span className="ai-tutor-fab__content">
          <strong>{isOpen ? (isVi ? 'Đóng chat' : 'Close') : (isVi ? 'Gia sư AI' : 'AI Tutor')}</strong>
          {!isOpen && <small>{isVi ? 'Hỏi nhanh' : 'Quick help'}</small>}
        </span>
      </button>
    </div>
  );
}

import { useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, X, Copy, Check, Volume2, VolumeX } from 'lucide-react';
import { aiTutorService, detectInputLanguage, enforceLanguageConsistency, getCurrentUserStorageKey } from '@/services/aiTutorService';
import { useAuth } from '@/application/context/AuthContext';
import ngheIdleMascot from '@/assets/mascot/nghe-idle.webp';

function cleanMiniChatText(value) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/^\s*(?:user|response)\s+safety\s*:\s*(?:safe|unsafe|blocked|unknown)\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatInlineText(text) {
  // Render React text nodes so AI output cannot inject HTML into the page.
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function MiniChatAnswer({ text }) {
  const blocks = [];
  for (const line of text.replace(/\r\n?/g, '\n').split('\n')) {
    if (!line.trim()) {
      blocks.push({ type: 'break' });
      continue;
    }
    const bullet = line.match(/^\s*[-*+]\s+(.+)$/);
    const numbered = line.match(/^\s*(\d+)[.)]\s+(.+)$/);
    if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol';
      const content = bullet ? bullet[1] : numbered[2];
      const previous = blocks[blocks.length - 1];
      if (previous?.type === type) previous.items.push(content);
      else blocks.push({ type, start: numbered ? Number(numbered[1]) : undefined, items: [content] });
    } else {
      const heading = line.match(/^#{1,6}\s+(.+)$/);
      blocks.push({ type: heading ? 'heading' : 'p', text: heading ? heading[1] : line });
    }
  }
  return <div className="ai-tutor-chat__answer">
    {blocks.map((block, index) => {
      if (block.type === 'break') return null;
      if (block.items) {
        const List = block.type;
        return <List key={index} start={block.start}>{block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{formatInlineText(item)}</li>
        ))}</List>;
      }
      return <p key={index}>{block.type === 'heading'
        ? <strong>{formatInlineText(block.text)}</strong>
        : formatInlineText(block.text)}</p>;
    })}
  </div>;
}

export function AiTutorFloatingButton() {
  const location = useLocation();
  const { user, accessToken, isAuthenticated } = useAuth();
  const { i18n } = useTranslation();
  const isEn = (i18n?.resolvedLanguage || i18n?.language || 'en').startsWith('en');

  const activeUserKey = String(user?.userId ?? user?.id ?? user?.username ?? getCurrentUserStorageKey());
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [session, setSession] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    setSession(null);
    setIsOpen(false);
    setInput('');
  }, [activeUserKey, accessToken]);

  // The AI Tutor page already has its own full conversation UI. Never expose
  // the helper during a quiz attempt, where it could be used as a shortcut.
  const isQuizRoute = location.pathname.includes('/quizzes/')
    || location.pathname.includes('/quiz-attempts/')
    || location.pathname.includes('/quiz/');

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

  if (!isAuthenticated || location.pathname === '/ai-tutor' || isQuizRoute) return null;

  const handleCopy = (id, text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSpeak = (id, text) => {
    if (speakingId === id) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis?.cancel();
    const clean = text.replace(/[*#`_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis?.speak(utterance);
  };

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
            text: error?.message || (isEn ? 'Unable to connect to Hola AI right now.' : 'Không thể kết nối với Hola AI lúc này.'),
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
        <section className="ai-tutor-chat" aria-label={isEn ? "Chat with Hola AI" : "Chat với Hola AI"}>
          <header className="ai-tutor-chat__header">
            <div className="ai-tutor-chat__identity">
              <div className="ai-tutor-chat__avatar">
                <img src={ngheIdleMascot} alt="Bé Trâu Mascot" />
                <span className="ai-tutor-chat__status-dot" aria-hidden="true" />
              </div>
              <div>
                <strong>Hola AI</strong>
                <small>{isEn ? 'Lesson assistant' : 'Hỏi nhanh trong lúc học'}</small>
              </div>
            </div>
            <button
              type="button"
              className="ai-tutor-chat__close"
              onClick={() => setIsOpen(false)}
              aria-label={isEn ? "Close chat" : "Đóng chat"}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div ref={messagesContainerRef} className="ai-tutor-chat__messages" aria-live="polite">
            {visibleMessages.map((message) => {
              const isAi = message.sender === 'ai';
              const isUser = !isAi;
              const isCopied = copiedId === message.id;
              const isSpeaking = speakingId === message.id;

              if (isUser) {
                return (
                  <div key={message.id} className="ai-tutor-chat__msg-row ai-tutor-chat__msg-row--user">
                    <div className="ai-tutor-chat__message is-user">
                      {message.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className="ai-tutor-chat__msg-row ai-tutor-chat__msg-row--ai">
                  <div className="ai-tutor-chat__msg-avatar">
                    <img src={ngheIdleMascot} alt="Bé Trâu Mascot" />
                  </div>
                  <div className="ai-tutor-chat__msg-content">
                    <div className="ai-tutor-chat__message">
                      <MiniChatAnswer text={message.text} />
                    </div>
                    <div className="ai-tutor-chat__msg-actions">
                      <button
                        type="button"
                        className="ai-tutor-chat__msg-action-btn hover:!bg-transparent focus:!bg-transparent hover:!shadow-none"
                        onClick={() => handleCopy(message.id, message.text)}
                        title={isEn ? "Copy response" : "Sao chép câu trả lời"}
                      >
                        {isCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{isCopied ? (isEn ? 'Copied' : 'Đã chép') : (isEn ? 'Copy' : 'Sao chép')}</span>
                      </button>
                      <button
                        type="button"
                        className={`ai-tutor-chat__msg-action-btn hover:!bg-transparent focus:!bg-transparent hover:!shadow-none ${isSpeaking ? 'is-speaking' : ''}`}
                        onClick={() => handleSpeak(message.id, message.text)}
                        title={isEn ? "Listen to pronunciation" : "Nghe phát âm"}
                      >
                        {isSpeaking ? <VolumeX size={12} className="text-orange-600 animate-pulse" /> : <Volume2 size={12} />}
                        <span>{isSpeaking ? (isEn ? 'Stop' : 'Dừng') : (isEn ? 'Listen' : 'Nghe')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="ai-tutor-chat__msg-row ai-tutor-chat__msg-row--ai">
                <div className="ai-tutor-chat__msg-avatar">
                  <img src={ngheIdleMascot} alt="Bé Trâu Mascot" />
                </div>
                <div className="ai-tutor-chat__bubble--loading">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          <form className="ai-tutor-chat__form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={isEn ? 'What are you wondering about?' : 'Bạn đang thắc mắc gì?'}
              aria-label={isEn ? 'Enter question for Hola AI' : 'Nhập câu hỏi cho Hola AI'}
              disabled={isSending}
            />
            <button
              type="submit"
              aria-label={isEn ? 'Send question' : 'Gửi câu hỏi'}
              disabled={!input.trim() || isSending}
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="ai-tutor-fab"
        onClick={() => (isOpen ? setIsOpen(false) : openChat())}
        aria-label={isOpen ? (isEn ? 'Close Hola AI chat' : 'Đóng chat Hola AI') : (isEn ? 'Ask Hola AI' : 'Hỏi Hola AI')}
        aria-expanded={isOpen}
        title={isOpen ? (isEn ? 'Close Hola AI chat' : 'Đóng chat Hola AI') : (isEn ? 'Ask Hola AI' : 'Hỏi Hola AI')}
      >
        <img src={ngheIdleMascot} alt="" aria-hidden="true" />
      </button>
    </div>
  );
}

import { BilingualText } from '@/components/common/BilingualText';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { aiRoleplayService } from '@/services/aiRoleplayService';

export function RoleplaySessionPage() {
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
  const [toastMessage, setToastMessage] = useState('');

  const messagesEndRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  useEffect(() => {
    if (id) {
      const currentSession = aiRoleplayService.getRoleplaySession(id);
      setSession(currentSession);
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      showToast('Trình duyệt không hỗ trợ phát âm.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    showToast('Đang phát âm hội thoại tiếng Việt...');
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
      showToast('Đang lắng nghe giọng nói của bạn...');
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending || !id) return;

    setIsSending(true);
    setInputText('');

    try {
      const { session: updatedSession } = await aiRoleplayService.sendRoleplayMessage(id, text);
      setSession(updatedSession);
    } catch (e) {
      console.error(e);
      showToast('Lỗi khi gửi tin nhắn roleplay.');
    } finally {
      setIsSending(false);
    }
  };

  const handleFinishSession = () => {
    aiRoleplayService.finishRoleplayAndGetResult(id);
    navigate(`/ai-sessions/${id}/result`);
  };

  const handleResetSession = () => {
    if (window.confirm('Bạn muốn bắt đầu lại phiên roleplay này từ đầu?')) {
      const fresh = aiRoleplayService.resetRoleplaySession(id);
      setSession(fresh);
      showToast('Đã đặt lại phiên hội thoại kịch bản!');
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

  return (
    <div className="p4-container">
      {toastMessage && (
        <div className="p4-toast">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-forest)', marginBottom: '4px' }}>
            <Link to="/ai-scenarios" style={{ color: 'var(--color-red-hover)', textDecoration: 'none' }}><BilingualText>{"← Thoát kịch bản"}</BilingualText></Link>
            <span>/</span>
            <span><BilingualText vi={scenario.titleVi || scenario.title} en={scenario.title} /></span>
          </nav>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}><BilingualText vi={<>Phiên Roleplay: {scenario.titleVi || scenario.title}</>} en={<>Roleplay session: {scenario.title}</>} />
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="button secondary" onClick={handleResetSession} style={{ fontSize: '13px', padding: '8px 14px' }}><BilingualText>{"🔄 Bắt đầu lại"}</BilingualText></button>
          <button className="button" onClick={handleFinishSession} style={{ background: 'var(--color-ink)', borderColor: 'var(--color-ink)', fontSize: '13px', padding: '8px 16px' }}><BilingualText>{"🏁 Kết thúc & Xem kết quả"}</BilingualText></button>
        </div>
      </div>

      {/* 2-Column Live Roleplay Workspace */}
      <div className="roleplay-screen">
        {/* Main Dialogue Chat Window */}
        <main className="roleplay-chat">
          <div className="roleplay-chat__header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>{scenario.aiRole.avatar}</span>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--color-ink)' }}>{scenario.aiRole.name}</strong>
                <div style={{ fontSize: '11.5px', color: 'var(--color-forest)' }}>{scenario.aiRole.role}</div>
              </div>
            </div>

            <button
              className="message-action-btn"
              onClick={() => setShowHints(!showHints)}
              style={{ background: showHints ? 'var(--color-cream)' : 'var(--color-surface)', color: showHints ? 'var(--color-red-hover)' : 'var(--color-red-hover)' }}
            >
              💡 <BilingualText>{showHints ? 'Ẩn gợi ý' : 'Hiện gợi ý trả lời'}</BilingualText>
            </button>
          </div>

          {/* Messages Flow */}
          <div className="tutor-messages" style={{ minHeight: '380px' }}>
            {session?.messages?.map(msg => {
              const isAi = msg.sender === 'ai';
              const isTranslating = !!showTranslations[msg.id];
              const isExplaining = !!showExplanations[msg.id];

              return (
                <div key={msg.id} className={`message-row ${isAi ? 'ai' : 'user'}`}>
                  <div className="message-avatar">
                    {isAi ? scenario.aiRole.avatar : '👤'}
                  </div>

                  <div className="message-bubble">
                    <div style={{ fontWeight: 700, fontSize: '11px', color: isAi ? 'var(--color-red-hover)' : 'var(--color-border)', marginBottom: '4px' }}>
                      <BilingualText>{isAi ? scenario.aiRole.name : 'Bạn'}</BilingualText>
                    </div>

                    <div style={{ fontSize: '15px', lineHeight: 1.6 }}>{msg.text}</div>

                    {/* Translation foldout */}
                    {isTranslating && msg.translation && (
                      <div style={{ marginTop: '8px', padding: '8px 12px', background: 'var(--color-red-soft)', borderRadius: '8px', fontSize: '13px', color: 'var(--color-ink)' }}>
                        🌐 <em>{msg.translation}</em>
                      </div>
                    )}

                    {/* Explanation foldout */}
                    {isExplaining && msg.explanation && (
                      <div style={{ marginTop: '8px', padding: '8px 12px', background: 'var(--color-sage-soft)', borderRadius: '8px', fontSize: '12.5px', color: 'var(--color-ink)' }}>
                        💡 <strong><BilingualText>{"Giải thích ngữ cảnh:"}</BilingualText></strong> {msg.explanation}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="message-actions">
                      <button
                        className="message-action-btn"
                        onClick={() => handleSpeak(msg.text)}
                        title="Nghe phát âm"
                      >
                        <span>🔊</span><BilingualText>{"Nghe"}</BilingualText></button>

                      {msg.translation && (
                        <button
                          className="message-action-btn"
                          onClick={() => toggleTranslation(msg.id)}
                          title="Dịch câu nói"
                        >
                          <span>🌐</span> <BilingualText>{isTranslating ? 'Đóng dịch' : 'Dịch'}</BilingualText>
                        </button>
                      )}

                      {msg.explanation && (
                        <button
                          className="message-action-btn"
                          onClick={() => toggleExplanation(msg.id)}
                          title="Giải thích từ vựng & sắc thái"
                        >
                          <span>ℹ️</span> <BilingualText>{isExplaining ? 'Đóng giải thích' : 'Giải thích'}</BilingualText>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="message-row ai">
                <div className="message-avatar">{scenario.aiRole.avatar}</div>
                <div className="message-bubble">
                  <div style={{ color: 'var(--color-forest)' }}>✨ {scenario.aiRole.name}<BilingualText>{"đang trả lời..."}</BilingualText></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Hints for user */}
          {showHints && (
            <div className="roleplay-hints">
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}><BilingualText>{"💡 Gợi ý câu trả lời tự nhiên (Bấm vào để gửi ngay):"}</BilingualText></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    className="hint-chip-btn"
                    onClick={() => handleSendMessage(sug.text)}
                    disabled={isSending}
                  >
                    <span>"{sug.text}"</span>
                    <span className="hint-meaning">({sug.meaning})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Input Area */}
          <div className="tutor-input-area">
            <button
              className={`btn-mic ${isListening ? 'listening' : ''}`}
              title={isListening ? 'Đang nghe... Bấm để dừng' : 'Nói tiếng Việt (Mic)'}
              onClick={handleToggleVoiceInput}
              disabled={isSending}
            >
              🎤
            </button>

            <textarea
              className="tutor-textarea"
              placeholder={`Nhập câu thoại của bạn với ${scenario.aiRole.name}...`}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
              disabled={isSending}
            />

            <button
              className="btn-send"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isSending}
            >
              <span><BilingualText>{"Nói"}</BilingualText></span>
              <span>➔</span>
            </button>
          </div>
        </main>

        {/* Right Mission Sidebar */}
        <aside className="roleplay-mission-panel">
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-red-hover)', textTransform: 'uppercase', marginBottom: '4px' }}><BilingualText>{"Tiến độ kịch bản"}</BilingualText></div>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--color-ink)' }}><BilingualText>{"Mục tiêu đối thoại"}</BilingualText></h3>
          </div>

          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {scenario.objectives.map((task, idx) => {
              const isDone = session?.completedTasks?.includes(task.id);
              return (
                <div key={task.id} className={`objective-item ${isDone ? 'done' : ''}`}>
                  <span className="objective-checkbox">
                    {isDone ? '✓' : idx + 1}
                  </span>
                  <div>
                    <div><BilingualText>{task.label}</BilingualText></div>
                    {isDone && <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink)' }}><BilingualText>{"Đã hoàn thành!"}</BilingualText></span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Roles reminder */}
          <div style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '14px', fontSize: '12.5px' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-ink)', marginBottom: '4px' }}><BilingualText>{"🎭 Nhắc nhở vai diễn:"}</BilingualText></div>
            <div style={{ color: 'var(--color-red-hover)', lineHeight: 1.5 }}><BilingualText>{"Bạn đang đóng vai:"}</BilingualText><strong>{scenario.learnerRole.role}</strong><BilingualText>{". Hãy giao tiếp tự nhiên và nhớ dùng kính ngữ phù hợp nhé!"}</BilingualText></div>
          </div>

          {/* Finish Button */}
          <button
            className="button"
            onClick={handleFinishSession}
            style={{ width: '100%', background: 'var(--color-red-hover)', borderColor: 'var(--color-red-hover)', marginTop: 'auto' }}
          ><BilingualText>{"Hoàn tất & Nhận đánh giá ➔"}</BilingualText></button>
        </aside>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { aiRoleplayService } from '@/services/aiRoleplayService';
import '@/presentation/styles/ai-tutor.css';

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
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7a6458', marginBottom: '4px' }}>
            <Link to="/ai-scenarios" style={{ color: '#9f2d20', textDecoration: 'none' }}>← Thoát kịch bản</Link>
            <span>/</span>
            <span>{scenario.title}</span>
          </nav>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#321b17', margin: 0 }}>
            Phiên Roleplay: {scenario.title}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="button secondary" onClick={handleResetSession} style={{ fontSize: '13px', padding: '8px 14px' }}>
            🔄 Bắt đầu lại
          </button>
          <button className="button" onClick={handleFinishSession} style={{ background: '#245c48', borderColor: '#245c48', fontSize: '13px', padding: '8px 16px' }}>
            🏁 Kết thúc & Xem kết quả
          </button>
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
                <strong style={{ fontSize: '14px', color: '#381e18' }}>{scenario.aiRole.name}</strong>
                <div style={{ fontSize: '11.5px', color: '#7a6256' }}>{scenario.aiRole.role}</div>
              </div>
            </div>

            <button
              className="message-action-btn"
              onClick={() => setShowHints(!showHints)}
              style={{ background: showHints ? '#fcedeb' : '#fff', color: showHints ? '#9f2d20' : '#684d40' }}
            >
              💡 {showHints ? 'Ẩn gợi ý' : 'Hiện gợi ý trả lời'}
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
                    <div style={{ fontWeight: 700, fontSize: '11px', color: isAi ? '#9f2d20' : '#d2eed2', marginBottom: '4px' }}>
                      {isAi ? scenario.aiRole.name : 'Bạn'}
                    </div>

                    <div style={{ fontSize: '15px', lineHeight: 1.6 }}>{msg.text}</div>

                    {/* Translation foldout */}
                    {isTranslating && msg.translation && (
                      <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f5ebe0', borderRadius: '8px', fontSize: '13px', color: '#4a2f24' }}>
                        🌐 <em>{msg.translation}</em>
                      </div>
                    )}

                    {/* Explanation foldout */}
                    {isExplaining && msg.explanation && (
                      <div style={{ marginTop: '8px', padding: '8px 12px', background: '#edf4ef', borderRadius: '8px', fontSize: '12.5px', color: '#245c48' }}>
                        💡 <strong>Giải thích ngữ cảnh:</strong> {msg.explanation}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="message-actions">
                      <button
                        className="message-action-btn"
                        onClick={() => handleSpeak(msg.text)}
                        title="Nghe phát âm"
                      >
                        <span>🔊</span> Nghe
                      </button>

                      {msg.translation && (
                        <button
                          className="message-action-btn"
                          onClick={() => toggleTranslation(msg.id)}
                          title="Dịch câu nói"
                        >
                          <span>🌐</span> {isTranslating ? 'Đóng dịch' : 'Dịch'}
                        </button>
                      )}

                      {msg.explanation && (
                        <button
                          className="message-action-btn"
                          onClick={() => toggleExplanation(msg.id)}
                          title="Giải thích từ vựng & sắc thái"
                        >
                          <span>ℹ️</span> {isExplaining ? 'Đóng giải thích' : 'Giải thích'}
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
                  <div style={{ color: '#7a5a4a' }}>✨ {scenario.aiRole.name} đang trả lời...</div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Hints for user */}
          {showHints && (
            <div className="roleplay-hints">
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8c7367', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                💡 Gợi ý câu trả lời tự nhiên (Bấm vào để gửi ngay):
              </div>
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
              <span>Nói</span>
              <span>➔</span>
            </button>
          </div>
        </main>

        {/* Right Mission Sidebar */}
        <aside className="roleplay-mission-panel">
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#9f2d20', textTransform: 'uppercase', marginBottom: '4px' }}>
              Tiến độ kịch bản
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#2d1813' }}>
              Mục tiêu đối thoại
            </h3>
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
                    <div>{task.label}</div>
                    {isDone && <span style={{ fontSize: '11px', fontWeight: 700, color: '#2e7d32' }}>Đã hoàn thành!</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Roles reminder */}
          <div style={{ background: '#fcf6ee', border: '1px solid #eedecf', borderRadius: '12px', padding: '14px', fontSize: '12.5px' }}>
            <div style={{ fontWeight: 700, color: '#4a281e', marginBottom: '4px' }}>
              🎭 Nhắc nhở vai diễn:
            </div>
            <div style={{ color: '#685044', lineHeight: 1.5 }}>
              Bạn đang đóng vai: <strong>{scenario.learnerRole.role}</strong>. Hãy giao tiếp tự nhiên và nhớ dùng kính ngữ phù hợp nhé!
            </div>
          </div>

          {/* Finish Button */}
          <button
            className="button"
            onClick={handleFinishSession}
            style={{ width: '100%', background: '#9f2d20', borderColor: '#9f2d20', marginTop: 'auto' }}
          >
            Hoàn tất & Nhận đánh giá ➔
          </button>
        </aside>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { aiTutorService } from '@/services/aiTutorService';
import { vocabularyService } from '@/services/vocabularyService';

export function AiTutorPage() {
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

  const messagesEndRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Load sessions on mount
  useEffect(() => {
    const loadedSessions = aiTutorService.getAllSessions();
    const activeId = aiTutorService.getActiveSessionId();
    setSessions(loadedSessions);
    setActiveSessionId(activeId);

    const active = loadedSessions.find(s => s.id === activeId) || loadedSessions[0];
    if (active) {
      setCurrentSession(active);
      setCurrentMode(active.mode || 'tutor');
    }
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isSending]);

  // Setup Web Speech Recognition if available
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
    aiTutorService.setActiveSessionId(id);
    setActiveSessionId(id);
    const session = aiTutorService.getSession(id);
    setCurrentSession(session);
    if (session?.mode) {
      setCurrentMode(session.mode);
    }
  };

  const handleCreateNewChat = (modeToUse = currentMode) => {
    const newSession = aiTutorService.createSession(modeToUse);
    setSessions(aiTutorService.getAllSessions());
    setActiveSessionId(newSession.id);
    setCurrentSession(newSession);
    setCurrentMode(newSession.mode);
    showToast(`Đã tạo phiên trò chuyện mới với chế độ ${aiTutorService.getMode(modeToUse).name}!`);
  };

  const handleSwitchMode = (modeId) => {
    setCurrentMode(modeId);
    if (currentSession) {
      const updated = aiTutorService.updateSessionMode(currentSession.id, modeId);
      setCurrentSession(updated);
      setSessions(aiTutorService.getAllSessions());
    }
  };

  const handleDeleteSession = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa phiên hội thoại này?')) {
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
    }
    setEditingTitleId(null);
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending || !currentSession) return;

    setIsSending(true);
    setInputText('');

    try {
      const { updatedSession } = await aiTutorService.sendMessage(currentSession.id, text, currentMode);
      setCurrentSession(updatedSession);
      setSessions(aiTutorService.getAllSessions());
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

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      showToast('Trình duyệt của bạn không hỗ trợ phát âm (Speech Synthesis).');
      return;
    }
    window.speechSynthesis.cancel();
    // Clean markdown hashes and asterisks for smooth TTS
    const cleanText = text.replace(/#|\*|`|>|---/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    showToast('Đang phát âm giọng đọc tiếng Việt...');
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    showToast('Đã sao chép nội dung vào khay nhớ tạm!');
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
      showToast('Đang lắng nghe giọng nói của bạn... Hãy nói tiếng Việt!');
    }
  };

  const handleSaveWordToVocabulary = async (word, meaning) => {
    try {
      await vocabularyService.add({
        word: word.trim(),
        meaning: meaning.trim() || 'Học từ AI Tutor',
        notes: `Chế độ AI: ${aiTutorService.getMode(currentMode).name}`,
      });
      showToast(`Đã lưu "${word}" vào Sổ từ vựng của bạn!`);
    } catch (err) {
      showToast(`Lưu từ vựng: ${err.message || 'Thành công!'}`);
    }
  };

  const activeModeConfig = aiTutorService.getMode(currentMode);

  return (
    <div className="p4-container">
      {toastMessage && (
        <div className="p4-toast">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div>
        <span className="p4-header-badge">AI Assistant • 7 Modes</span>
        <h1 className="p4-title">Một cuộc trò chuyện nhỏ, một bước tiến xa.</h1>
        <p className="p4-subtitle">
          Gia sư AI thông minh chuyên sâu tiếng Việt. Chọn chế độ phù hợp từ ngữ pháp, dịch thuật, hội thoại đời thường cho đến văn hóa và tiếng Việt 3 miền.
        </p>
      </div>

      {/* Main 2-column Tutor workspace */}
      <div className="tutor-layout">
        {/* Sidebar: Conversation history */}
        <aside className="tutor-sidebar">
          <div className="tutor-sidebar__header">
            <span className="tutor-sidebar__title">
              💬 Lịch sử trò chuyện
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>{sessions.length} phiên</span>
          </div>

          <button
            className="btn-new-chat"
            onClick={() => handleCreateNewChat(currentMode)}
          >
            <span>+</span> Cuộc trò chuyện mới
          </button>

          {/* 7 Modes Switcher Bar */}
          <div className="tutor-modes-bar" role="tablist" aria-label="Các chế độ AI Tutor">
            {modes.map(mode => {
              const isSelected = mode.id === currentMode;
              return (
                <button
                  key={mode.id}
                  role="tab"
                  aria-selected={isSelected}
                  className={`mode-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSwitchMode(mode.id)}
                  title={mode.description}
                >
                  <span className="mode-icon">{mode.icon}</span>
                  <span>{mode.name}</span>
                </button>
              );
            })}
          </div>

          <p className="eyebrow">Cuộc trò chuyện gần đây</p>
          <div className="tutor-history-list">
            {sessions.map(s => {
              const sessionMode = aiTutorService.getMode(s.mode);
              const isActive = s.id === activeSessionId;
              const isEditing = editingTitleId === s.id;

              return (
                <div
                  key={s.id}
                  className={`tutor-history-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectSession(s.id)}
                >
                  <div className="tutor-history-item__info">
                    {isEditing ? (
                      <input
                        type="text"
                        value={newTitleInput}
                        onChange={e => setNewTitleInput(e.target.value)}
                        onBlur={e => handleSaveRename(e, s.id)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveRename(e, s.id)}
                        autoFocus
                        style={{ padding: '2px 6px', fontSize: '12px' }}
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span className="tutor-history-item__title">{s.title}</span>
                    )}
                    <span className="tutor-history-item__meta">
                      <span>{sessionMode?.icon} {sessionMode?.name}</span>
                      <span>•</span>
                      <span>{s.messages?.length || 0} tin</span>
                    </span>
                  </div>

                  <div className="tutor-history-item__actions">
                    <button
                      className="btn-icon-subtle"
                      title="Đổi tên"
                      onClick={e => handleStartRename(e, s)}
                    >
                      ✏️
                    </button>
                    {sessions.length > 1 && (
                      <button
                        className="btn-icon-subtle danger"
                        title="Xóa"
                        onClick={e => handleDeleteSession(e, s.id)}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Chat area with 7 Modes Switcher */}
        <main className="tutor-chat-box">
          {/* Current Mode Banner */}
          <div className="tutor-current-mode-banner">
            <div className="current-mode-info">
              <div className="current-mode-icon" style={{ background: activeModeConfig.bg, color: activeModeConfig.color }}>
                {activeModeConfig.icon}
              </div>
              <div>
                <div className="current-mode-title">
                  Chế độ {activeModeConfig.name} — {activeModeConfig.title}
                </div>
                <div className="current-mode-desc">{activeModeConfig.description}</div>
              </div>
            </div>
            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: activeModeConfig.bg, color: activeModeConfig.color, fontWeight: 700 }}>
              {activeModeConfig.badge}
            </span>
          </div>

          {/* Chat Messages Stream */}
          <div className="tutor-messages">
            {currentSession?.messages?.map(msg => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={msg.id} className={`message-row ${isAi ? 'ai' : 'user'}`}>
                  <div className="message-avatar">
                    {isAi ? activeModeConfig.icon : '👤'}
                  </div>
                  <div className="message-bubble">
                    {/* Render plain / structured markdown format */}
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>

                    {/* Word tags saved */}
                    {msg.savedWords && msg.savedWords.length > 0 && (
                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed var(--color-border)' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-red-hover)', marginBottom: '6px' }}>
                          📚 Từ vựng hữu ích gợi ý trong tin nhắn này:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {msg.savedWords.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSaveWordToVocabulary(item.word, item.meaning)}
                              className="message-action-btn"
                              title="Bấm để lưu nhanh vào Sổ từ vựng"
                              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-red-hover)' }}
                            >
                              <span>⭐</span>
                              <strong>{item.word}</strong>: {item.meaning} (Lưu từ)
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Message Action Buttons */}
                    {isAi && (
                      <div className="message-actions">
                        <button
                          className="message-action-btn"
                          onClick={() => handleSpeak(msg.text)}
                          title="Nghe phát âm tiếng Việt chuẩn"
                        >
                          <span>🔊</span> Nghe giọng đọc
                        </button>
                        <button
                          className="message-action-btn"
                          onClick={() => handleCopy(msg.text)}
                          title="Sao chép nội dung"
                        >
                          <span>📋</span> Sao chép
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="message-row ai">
                <div className="message-avatar">{activeModeConfig.icon}</div>
                <div className="message-bubble">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-sage)' }}>
                    <span>✨ Hola AI đang suy nghĩ và phản hồi...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="tutor-quick-prompts">
            <span className="quick-prompt-label">Gợi ý:</span>
            {activeModeConfig.quickPrompts.map((prompt, index) => (
              <button
                key={index}
                className="prompt-chip"
                onClick={() => handleSendMessage(prompt)}
                disabled={isSending}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* User Input Bar */}
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
              placeholder={activeModeConfig.placeholder}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isSending}
            />

            <button
              className="btn-send"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isSending}
            >
              <span>Gửi</span>
              <span>➔</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

import { BilingualText, bilingualLabel, useTextLanguage } from '@/shared/components/common/BilingualText';
import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Notice } from '@/shared/components/common/Ui';
import { HolaSelect } from '@/shared/components/common/HolaSelect';
import { moveItem } from '@/features/learning/components/learning/answerUtils';
import { ContentImage } from '@/shared/components/common/ContentImage';
import { contentService } from '@/features/learning/api/contentService';
import './question-form.css';

const types = ['MULTIPLE_CHOICE', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'FILL_BLANK', 'MATCHING', 'LISTENING', 'TRANSLATION', 'REORDER_SENTENCE', 'IMAGE_SELECTION'];
const isText = (type) => ['FILL_BLANK', 'TRANSLATION'].includes(type);

export function QuestionForm({ initial = {}, onSave, onCancel }) {
  useTextLanguage();
  const snapshot = initial.versions?.[0] || initial;
  const [form, setForm] = useState({
    questionType: 'MULTIPLE_CHOICE',
    prompt: '',
    explanation: '',
    difficulty: 'EASY',
    topic: '',
    status: 'DRAFT',
    imageUrl: '',
    audioUrl: '',
    ...initial,
    ...snapshot,
  });
  const [options, setOptions] = useState(
    (snapshot.options || [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }]).map((option) => ({
      ...option,
      id: String(option.id),
      ...(option.side ? { side: String(option.side).toLowerCase() } : {}),
    }))
  );
  const [correct, setCorrect] = useState(snapshot.correctAnswerJson || snapshot.correctAnswer || { optionIds: [] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [questionFiles, setQuestionFiles] = useState({});
  const [optionFiles, setOptionFiles] = useState({});

  const choice =
    ['MULTIPLE_CHOICE', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'IMAGE_SELECTION'].includes(form.questionType) ||
    (form.questionType === 'LISTENING' && options.length > 0);
  const reorder = ['REORDER', 'REORDER_SENTENCE'].includes(form.questionType);
  const left = options.filter((option) => option.side === 'left');
  const right = options.filter((option) => option.side === 'right');

  function changeType(type) {
    setForm({ ...form, questionType: type });
    setCorrect({});
    setOptionFiles({});
    if (isText(type)) setOptions([]);
    else if (type === 'TRUE_FALSE')
      setOptions([
        { id: 'true', text: bilingualLabel('Đúng', 'True') },
        { id: 'false', text: bilingualLabel('Sai', 'False') },
      ]);
    else if (type === 'MATCHING')
      setOptions([
        { id: 'l1', text: '', side: 'left' },
        { id: 'l2', text: '', side: 'left' },
        { id: 'r1', text: '', side: 'right' },
        { id: 'r2', text: '', side: 'right' },
      ]);
    else if (options.length === 0)
      setOptions([
        { id: 'a', text: '' },
        { id: 'b', text: '' },
      ]);
  }

  function remove(index) {
    const id = options[index].id;
    setOptions(options.filter((_, i) => i !== index));
    setOptionFiles((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== id)));
    setCorrect({
      ...correct,
      optionIds: correct.optionIds?.filter((value) => String(value) !== id),
      sequence: correct.sequence?.filter((value) => value !== id),
      pairs: Object.fromEntries(Object.entries(correct.pairs || {}).filter(([key, value]) => key !== id && value !== id)),
    });
  }

  function chooseFile(event, key, optionId) {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = key === 'imageUrl';
    const valid = image
      ? ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      : file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|webm)$/i.test(file.name);
    const maxMb = image ? 5 : 20;
    if (!valid || file.size > maxMb * 1024 * 1024) {
      setError(
        image
          ? bilingualLabel('Chọn ảnh JPG, PNG, WebP (tối đa 5 MB).', 'Select a JPG, PNG, or WebP image (max 5 MB).')
          : bilingualLabel(
              'Chọn âm thanh MP3, WAV, M4A, AAC, OGG hoặc WebM (tối đa 20 MB).',
              'Select MP3, WAV, M4A, AAC, OGG or WebM audio (max 20 MB).'
            )
      );
      if (optionId) setOptionFiles((current) => ({ ...current, [optionId]: { ...current[optionId], [key]: null } }));
      else setQuestionFiles((current) => ({ ...current, [key]: null }));
      event.target.value = '';
      return;
    }
    setError('');
    if (optionId) setOptionFiles((current) => ({ ...current, [optionId]: { ...current[optionId], [key]: file } }));
    else setQuestionFiles((current) => ({ ...current, [key]: file }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (choice && !correct.optionIds?.length)
        throw new Error(bilingualLabel('Vui lòng chọn ít nhất một đáp án đúng.', 'Please select at least one correct option.'));
      const body = Object.fromEntries(
        ['questionType', 'prompt', 'promptVi', 'explanation', 'explanationVi', 'difficulty', 'topic', 'status', 'imageUrl', 'audioUrl'].map(
          (key) => [key, form[key] || '']
        )
      );
      for (const key of ['imageUrl', 'audioUrl']) {
        if (questionFiles[key]) body[key] = await contentService.uploadQuestionMedia(questionFiles[key], key === 'imageUrl' ? 'image' : 'audio');
      }
      body.options = await Promise.all(
        options.map(async (option) => {
          const result = { ...option };
          for (const key of ['imageUrl', 'audioUrl']) {
            const file = optionFiles[option.id]?.[key];
            if (file) result[key] = await contentService.uploadQuestionMedia(file, key === 'imageUrl' ? 'image' : 'audio');
          }
          return result;
        })
      );
      body.correctAnswerJson = correct;
      await onSave(body);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-question-form" onSubmit={submit}>
      <div className="admin-question-modal-body">
        <fieldset disabled={busy} className="admin-question-fieldset">
          <div className="admin-q-grid-2">
            <div className="admin-q-field">
              <span className="admin-q-label"><BilingualText>{"Loại câu hỏi"}</BilingualText></span>
              <HolaSelect
                disabled={busy}
                value={form.questionType}
                onChange={(val) => changeType(val)}
                options={types.map((type) => ({ value: type, label: bilingualLabel(type) }))}
                fullWidth
                align="left"
                ariaLabel={bilingualLabel('Loại câu hỏi', 'Question type')}
              />
            </div>

            <div className="admin-q-field">
              <span className="admin-q-label"><BilingualText>{"Độ khó"}</BilingualText></span>
              <HolaSelect
                disabled={busy}
                value={form.difficulty}
                onChange={(val) => setForm({ ...form, difficulty: val })}
                options={['EASY', 'MEDIUM', 'HARD'].map((type) => ({ value: type, label: bilingualLabel(type) }))}
                fullWidth
                align="left"
                ariaLabel={bilingualLabel('Độ khó', 'Difficulty')}
              />
            </div>

            <label className="is-wide">
              <span><BilingualText>{"Nội dung câu hỏi"}</BilingualText> <span className="studio-required">*</span></span>
              <textarea required rows={3} value={form.prompt} onChange={(event) => setForm({ ...form, prompt: event.target.value })} />
            </label>

            <label className="is-wide">
              <span><BilingualText>{"Câu hỏi tiếng Việt"}</BilingualText></span>
              <textarea rows={2} value={form.promptVi || ''} onChange={(event) => setForm({ ...form, promptVi: event.target.value })} />
            </label>

            <label>
              <span><BilingualText>{"Chủ đề"}</BilingualText></span>
              <input value={form.topic || ''} onChange={(event) => setForm({ ...form, topic: event.target.value })} />
            </label>

            <div className="admin-q-field">
              <span className="admin-q-label"><BilingualText>{"Trạng thái"}</BilingualText></span>
              <HolaSelect
                disabled={busy}
                value={form.status}
                onChange={(val) => setForm({ ...form, status: val })}
                options={['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((type) => ({ value: type, label: bilingualLabel(type) }))}
                fullWidth
                align="left"
                ariaLabel={bilingualLabel('Trạng thái', 'Status')}
              />
            </div>

            <label className="admin-q-file-label">
              <span><BilingualText>Tải âm thanh câu hỏi</BilingualText></span>
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm"
                disabled={busy}
                onChange={(event) => chooseFile(event, 'audioUrl')}
              />
              <small>{questionFiles.audioUrl?.name || bilingualLabel('Tối đa 20 MB · lưu trên Cloudinary khi lưu câu hỏi.')}</small>
            </label>

            <label className="admin-q-file-label">
              <span><BilingualText>Tải hình ảnh câu hỏi</BilingualText></span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={(event) => chooseFile(event, 'imageUrl')}
              />
              <small>{questionFiles.imageUrl?.name || bilingualLabel('JPG, PNG, WebP · tối đa 5 MB.')}</small>
            </label>

            <label>
              <span><BilingualText>Hoặc URL âm thanh</BilingualText></span>
              <input
                value={form.audioUrl || ''}
                placeholder={bilingualLabel('/media/… hoặc https://…', '/media/… or https://…')}
                onChange={(event) => setForm({ ...form, audioUrl: event.target.value })}
              />
            </label>

            <label>
              <span><BilingualText>Hoặc URL hình ảnh</BilingualText></span>
              <input
                value={form.imageUrl || ''}
                placeholder={bilingualLabel('/media/… hoặc https://…', '/media/… or https://…')}
                onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
              />
            </label>
          </div>

          {form.imageUrl && (
            <ContentImage
              src={form.imageUrl}
              className="question-media"
              alt={form.promptVi || form.prompt || bilingualLabel('Ảnh câu hỏi', 'Question image')}
            />
          )}

          {!isText(form.questionType) && (
            <section className="admin-q-options-section">
              <div className="admin-q-section-header">
                <h3><BilingualText>{reorder ? 'Các từ cần sắp xếp' : 'Các lựa chọn và đáp án đúng'}</BilingualText></h3>
                {choice && (
                  <p className="admin-q-hint">
                    <BilingualText
                      vi="Nhập các lựa chọn, sau đó đánh dấu đáp án đúng. Câu nhiều đáp án cho phép chọn nhiều ô."
                      en="Enter options, then mark correct answers. Multiple select questions allow checking multiple boxes."
                    />
                  </p>
                )}
              </div>

              <div className="admin-q-options-list">
                {options.map((option, index) => {
                  const isCorrectOpt = correct.optionIds?.map(String).includes(option.id) || false;
                  const badgeText = option.id.length <= 3 ? option.id.toUpperCase() : String.fromCharCode(65 + index);
                  return (
                    <div className={`admin-q-option-card ${isCorrectOpt ? 'is-correct' : ''}`} key={option.id}>
                      <div className="admin-q-option-row">
                        <span className="admin-q-option-badge">{badgeText}</span>
                        <input
                          className="admin-q-option-input"
                          aria-label={bilingualLabel(`Lựa chọn ${index + 1}`)}
                          required
                          value={option.text || ''}
                          onChange={(event) =>
                            setOptions(options.map((item, i) => (i === index ? { ...item, text: event.target.value } : item)))
                          }
                        />
                        {form.questionType === 'MATCHING' && (
                          <div style={{ minWidth: '115px' }}>
                            <HolaSelect
                              ariaLabel={bilingualLabel(`Cột lựa chọn ${index + 1}`)}
                              value={option.side || 'left'}
                              onChange={(val) =>
                                setOptions(options.map((item, i) => (i === index ? { ...item, side: val } : item)))
                              }
                              options={[
                                { value: 'left', label: bilingualLabel('Trái') },
                                { value: 'right', label: bilingualLabel('Phải') },
                              ]}
                              fullWidth
                              align="left"
                            />
                          </div>
                        )}
                        {choice && (
                          <label className="admin-q-correct-toggle">
                            <input
                              type={form.questionType === 'MULTIPLE_SELECT' ? 'checkbox' : 'radio'}
                              name="correct-options"
                              aria-label={bilingualLabel(`Đáp án đúng ${index + 1}`)}
                              checked={isCorrectOpt}
                              onChange={(event) =>
                                setCorrect({
                                  optionIds:
                                    form.questionType === 'MULTIPLE_SELECT'
                                      ? event.target.checked
                                        ? [...(correct.optionIds || []), option.id]
                                        : (correct.optionIds || []).filter((id) => id !== option.id)
                                      : [option.id],
                                })
                              }
                            />
                            <span><BilingualText>{"Đáp án đúng"}</BilingualText></span>
                          </label>
                        )}
                        <button
                          className="admin-row-action admin-row-action--delete admin-row-action--icon"
                          type="button"
                          aria-label={bilingualLabel(`Xóa lựa chọn ${index + 1}`)}
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {!reorder && (
                        <details className="option-media-editor">
                          <summary>
                            <BilingualText>{"Hình ảnh & âm thanh của lựa chọn"}</BilingualText> {index + 1}
                          </summary>
                          <div className="admin-q-grid-2 option-media-grid">
                            <label className="admin-q-file-label">
                              <span><BilingualText>Tải hình ảnh</BilingualText></span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                disabled={busy}
                                onChange={(event) => chooseFile(event, 'imageUrl', option.id)}
                              />
                              <small>{optionFiles[option.id]?.imageUrl?.name || bilingualLabel('JPG, PNG, WebP · tối đa 5 MB.')}</small>
                            </label>
                            <label className="admin-q-file-label">
                              <span><BilingualText>Tải âm thanh</BilingualText></span>
                              <input
                                type="file"
                                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm"
                                disabled={busy}
                                onChange={(event) => chooseFile(event, 'audioUrl', option.id)}
                              />
                              <small>{optionFiles[option.id]?.audioUrl?.name || bilingualLabel('Tối đa 20 MB.')}</small>
                            </label>
                            <label>
                              <span><BilingualText>{"URL hình ảnh"}</BilingualText></span>
                              <input
                                value={option.imageUrl || ''}
                                placeholder={bilingualLabel('/media/… hoặc https://…', '/media/… or https://…')}
                                onChange={(event) =>
                                  setOptions(options.map((item, i) => (i === index ? { ...item, imageUrl: event.target.value } : item)))
                                }
                              />
                            </label>
                            <label>
                              <span><BilingualText>{"URL âm thanh"}</BilingualText></span>
                              <input
                                value={option.audioUrl || ''}
                                placeholder={bilingualLabel('/media/… hoặc https://…', '/media/… or https://…')}
                                onChange={(event) =>
                                  setOptions(options.map((item, i) => (i === index ? { ...item, audioUrl: event.target.value } : item)))
                                }
                              />
                            </label>
                          </div>
                          {option.imageUrl && (
                            <ContentImage
                              className="option-image"
                              src={option.imageUrl}
                              alt={option.text || bilingualLabel(`Lựa chọn ${index + 1}`)}
                            />
                          )}
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="admin-q-option-actions">
                <button
                  type="button"
                  className="admin-q-dashed-btn"
                  onClick={() =>
                    setOptions([
                      ...options,
                      { id: `option-${Date.now()}`, text: '', ...(form.questionType === 'MATCHING' ? { side: 'left' } : {}) },
                    ])
                  }
                >
                  <Plus size={15} />
                  <BilingualText vi="Thêm lựa chọn" en="Add option" />
                </button>
                {form.questionType === 'LISTENING' && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => {
                      setOptions([]);
                      setCorrect({ acceptedAnswers: [] });
                    }}
                  >
                    <BilingualText>{"Trả lời bằng văn bản"}</BilingualText>
                  </button>
                )}
              </div>
            </section>
          )}

          {(isText(form.questionType) || (form.questionType === 'LISTENING' && !options.length)) && (
            <div className="admin-q-box">
              <label>
                <span><BilingualText>{"Các đáp án chấp nhận (mỗi dòng một đáp án)"}</BilingualText></span>
                <textarea
                  required
                  rows={3}
                  value={(correct.acceptedAnswers || []).join('\n')}
                  onChange={(event) => setCorrect({ ...correct, acceptedAnswers: event.target.value.split('\n') })}
                />
              </label>
              <label className="admin-q-checkbox-row">
                <input
                  type="checkbox"
                  checked={!!correct.caseSensitive}
                  onChange={(event) => setCorrect({ ...correct, caseSensitive: event.target.checked })}
                />
                <span><BilingualText>{"Phân biệt chữ hoa, chữ thường"}</BilingualText></span>
              </label>
            </div>
          )}

          {reorder && (
            <div className="admin-q-box">
              <div className="admin-q-box-header">
                <h3><BilingualText>{"Thứ tự đúng"}</BilingualText></h3>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setCorrect({ sequence: options.map((option) => option.id) })}
                >
                  <BilingualText>{"Dùng thứ tự lựa chọn hiện tại"}</BilingualText>
                </button>
              </div>
              <div className="admin-q-sequence-list">
                {(correct.sequence || []).map((id, index) => (
                  <div className="admin-q-sequence-row" key={id}>
                    <span>{options.find((option) => String(option.id) === String(id))?.text || id}</span>
                    <div className="admin-q-sequence-actions">
                      <button
                        type="button"
                        className="admin-row-action admin-row-action--neutral admin-row-action--icon"
                        disabled={index === 0}
                        aria-label={bilingualLabel(`Đưa từ ${index + 1} lên`)}
                        onClick={() => setCorrect({ sequence: moveItem(correct.sequence, index, -1) })}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="admin-row-action admin-row-action--neutral admin-row-action--icon"
                        disabled={index === correct.sequence.length - 1}
                        aria-label={bilingualLabel(`Đưa từ ${index + 1} xuống`)}
                        onClick={() => setCorrect({ sequence: moveItem(correct.sequence, index, 1) })}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.questionType === 'MATCHING' && (
            <div className="admin-q-box">
              <h3><BilingualText>{"Ghép đáp án đúng"}</BilingualText></h3>
              <div className="admin-q-grid-2">
                {left.map((option) => (
                  <div key={option.id} className="admin-q-field">
                    <span className="admin-q-label">{option.text || option.id}</span>
                    <HolaSelect
                      value={correct.pairs?.[option.id] || ''}
                      onChange={(val) => setCorrect({ pairs: { ...correct.pairs, [option.id]: val } })}
                      placeholder={bilingualLabel('Chọn đáp án')}
                      options={right.map((item) => ({
                        value: item.id,
                        label: bilingualLabel(item.text || item.id),
                      }))}
                      fullWidth
                      align="left"
                      ariaLabel={option.text || option.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="admin-q-grid-2">
            <label>
              <span><BilingualText>{"Giải thích đáp án"}</BilingualText></span>
              <textarea rows={3} value={form.explanation || ''} onChange={(event) => setForm({ ...form, explanation: event.target.value })} />
            </label>
            <label>
              <span><BilingualText>{"Giải thích tiếng Việt"}</BilingualText></span>
              <textarea rows={3} value={form.explanationVi || ''} onChange={(event) => setForm({ ...form, explanationVi: event.target.value })} />
            </label>
          </div>

          {initial.versions?.length > 0 && (
            <Notice>
              <BilingualText>{"Phiên bản hiện tại v"}</BilingualText>
              {initial.currentVersion}
              <BilingualText>{". Khi sửa, hệ thống tạo phiên bản mới; các lượt làm bài cũ giữ nguyên nội dung gốc."}</BilingualText>
            </Notice>
          )}
        </fieldset>
      </div>

      {error && <Notice kind="error"><BilingualText>{error}</BilingualText></Notice>}

      <div className="admin-question-modal-footer">
        <button className="admin-btn admin-btn-secondary" type="button" disabled={busy} onClick={onCancel}>
          <BilingualText>{"Hủy"}</BilingualText>
        </button>
        <button className="admin-btn admin-btn-primary" type="submit" disabled={busy}>
          <BilingualText>{busy ? 'Đang lưu…' : 'Lưu câu hỏi'}</BilingualText>
        </button>
      </div>
    </form>
  );
}

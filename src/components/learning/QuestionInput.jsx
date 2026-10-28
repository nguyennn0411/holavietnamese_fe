import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { moveItem } from './answerUtils';
import { ContentImage } from '@/components/common/ContentImage';
import { MediaPlayer } from './MediaPlayer';
import { Check, ArrowUp, ArrowDown, X } from 'lucide-react';

export function QuestionInput({ question, answer = {}, onChange, disabled = false }) {
  const type = question.questionType || 'FILL_BLANK';
  const options = question.options || [];
  const choice =
    ['MULTIPLE_CHOICE', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'IMAGE_SELECTION'].includes(type) ||
    (type === 'LISTENING' && options.length > 0);

  // 1. TRẮC NGHIỆM / LỰA CHỌN (Multiple Choice, Multiple Select, True/False, Image Selection)
  if (choice) {
    const isMulti = type === 'MULTIPLE_SELECT';
    const currentOptionIds = (answer?.optionIds || []).map(String);

    const handleSelect = (optionId) => {
      if (disabled) return;
      const idStr = String(optionId);
      if (isMulti) {
        const next = currentOptionIds.includes(idStr)
          ? answer.optionIds.filter((id) => String(id) !== idStr)
          : [...(answer?.optionIds || []), optionId];
        onChange({ optionIds: next });
      } else {
        onChange({ optionIds: [optionId] });
      }
    };

    return (
      <div className="question-options grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4 max-w-3xl mx-auto" role="radiogroup">
        {options.map((option, index) => {
          const selected = currentOptionIds.includes(String(option.id));
          const letter = String.fromCharCode(65 + index);

          return (
            <label
              key={option.id}
              onClick={(e) => {
                e.preventDefault();
                handleSelect(option.id);
              }}
              className={`question-option group relative flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                selected
                  ? 'bg-[#FFF7E8] border-[#FF7A00] shadow-md ring-2 ring-[#FF7A00]/15 translate-y-[-1px]'
                  : 'bg-white border-[#E8E5DF]/80 hover:border-[#FF7A00]/60 hover:bg-[#FFFDF9] shadow-2xs hover:shadow-xs'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.99]'}`}
            >
              <input
                type={isMulti ? 'checkbox' : 'radio'}
                name={`question-${question.questionId || question.id || 'activity'}`}
                disabled={disabled}
                checked={selected}
                onChange={() => {}}
                className="sr-only"
              />

              {/* Letter Badge */}
              <span
                className={`option-letter w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all duration-200 ${
                  selected
                    ? 'bg-[#FF7A00] text-white shadow-2xs scale-105'
                    : 'bg-[#FFF2D6] text-[#EA580C] border border-[#FFCD00]/40 group-hover:bg-[#FF7A00]/10'
                }`}
              >
                {selected ? (
                  isMulti ? (
                    <Check size={16} strokeWidth={3} />
                  ) : (
                    letter
                  )
                ) : (
                  letter
                )}
              </span>

              {/* Option Text and Media */}
              <div className="question-option-content flex-1 min-w-0 space-y-2">
                {option.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-[#E8E5DF]/60 max-h-40 bg-[#FFFDF9] flex items-center justify-center p-1.5 shadow-2xs">
                    <ContentImage
                      className="option-image max-h-36 w-auto object-contain rounded-lg"
                      src={option.imageUrl}
                      alt={option.textVi || option.text || option.textEn || `Lựa chọn ${index + 1}`}
                    />
                  </div>
                )}

                <div className="text-sm sm:text-base font-bold text-[#253044] group-hover:text-[#FF7A00] transition-colors leading-snug">
                  {option.textEn ? (<BilingualText vi={option.textVi || option.text} en={option.textEn} />) : (<span>{option.textVi || option.text || option.id}</span>)}
                </div>

                {option.audioUrl && (
                  <div className="pt-1">
                    <MediaPlayer audioUrl={option.audioUrl} />
                  </div>
                )}
              </div>

              {/* Checked circle for single choice */}
              {!isMulti && (
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selected ? 'border-[#FF7A00] bg-[#FF7A00]' : 'border-stone-300 bg-white'
                  }`}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
              )}
            </label>
          );
        })}
      </div>
    );
  }

  // 2. SẮP XẾP TỪ / CÂU (Reorder Sentence / Word Bank)
  if (['REORDER', 'REORDER_SENTENCE'].includes(type)) {
    const sequence = answer?.sequence || [];

    const handleAddWord = (id) => {
      if (disabled) return;
      onChange({ sequence: [...sequence, id] });
    };

    const handleRemoveWord = (id) => {
      if (disabled) return;
      onChange({ sequence: sequence.filter((value) => value !== id) });
    };

    const unusedOptions = options.filter(
      (opt) => !sequence.map(String).includes(String(opt.id))
    );

    return (
      <div className="reorder-question space-y-5 my-4 max-w-3xl mx-auto">
        {/* Selected Word Sequence Tray */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
            <BilingualText>{"Câu của bạn (bấm vào từ để bỏ chọn):"}</BilingualText>
          </label>
          <div className="reorder-answer min-h-[90px] p-4 rounded-2xl bg-[#FFF7E8] border-2 border-dashed border-[#E8E5DF] flex flex-wrap gap-2.5 items-center transition-all">
            {sequence.length > 0 ? (
              sequence.map((id, index) => {
                const opt = options.find((o) => String(o.id) === String(id));
                const text = opt?.textVi || opt?.text || id;
                return (
                  <button
                    key={`${id}-${index}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleRemoveWord(id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#253044] font-bold text-sm shadow-xs border border-[#E8E5DF] hover:border-[#FF7A00] hover:bg-rose-50 hover:text-[#FF7A00] transition-all cursor-pointer group active:scale-95"
                    title={bilingualLabel("Bấm để loại bỏ", "Click to remove")}
                  >
                    <span>{text}</span>
                    <X size={13} className="text-stone-400 group-hover:text-[#FF7A00] transition-colors" />
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-[#64748B] italic m-auto text-center py-2">
                <BilingualText>{"Chọn các từ bên dưới theo thứ tự đúng để ghép thành câu hoàn chỉnh."}</BilingualText>
              </p>
            )}
          </div>
        </div>

        {/* Available Word Bank */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
            Kho từ vựng có sẵn:
          </label>
          <div className="actions flex flex-wrap gap-2.5 p-3 rounded-2xl bg-white border border-[#E8E5DF]/80 shadow-2xs">
            {unusedOptions.length > 0 ? (
              unusedOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleAddWord(opt.id)}
                  className="px-4 py-2.5 rounded-xl bg-[#FFF7E8] text-[#253044] hover:bg-[#FFF2D6] font-bold text-sm border border-[#E8E5DF] hover:border-[#FFCD00] shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <span>{opt.textVi || opt.text || opt.textEn || opt.id}</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-stone-400 italic py-1 px-2">
                <BilingualText>{"Tất cả các từ đã được đặt vào câu."}</BilingualText>
              </p>
            )}
          </div>
        </div>

        {/* Reorder Arrows Controls for Fine Tuning */}
        {sequence.length > 1 && (
          <div className="reorder-controls pt-2 flex flex-wrap gap-2 items-center text-xs">
            <span className="font-semibold text-stone-500 mr-1 text-[11px]"><BilingualText vi="Đổi thứ tự:" en="Reorder:" /></span>
            {sequence.map((id, index) => {
              const opt = options.find((o) => String(o.id) === String(id));
              const text = opt?.textVi || opt?.text || id;
              return (
                <div
                  key={`ctrl-${id}-${index}`}
                  className="inline-flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-lg border border-stone-200"
                >
                  <span className="font-bold text-[#EA580C] text-[11px] truncate max-w-[80px]">
                    {index + 1}. {text}
                  </span>
                  <button
                    type="button"
                    disabled={disabled || index === 0}
                    onClick={() => onChange({ sequence: moveItem(sequence, index, -1) })}
                    className="p-1 rounded text-stone-600 hover:bg-white disabled:opacity-30 cursor-pointer"
                    aria-label={`Đưa từ ${index + 1} lên`}
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={disabled || index === sequence.length - 1}
                    onClick={() => onChange({ sequence: moveItem(sequence, index, 1) })}
                    className="p-1 rounded text-stone-600 hover:bg-white disabled:opacity-30 cursor-pointer"
                    aria-label={`Đưa từ ${index + 1} xuống`}
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 3. NỐI CẶP TƯƠNG ỨNG (Matching Pairs)
  if (type === 'MATCHING') {
    const left = options.filter((option) => String(option.side).toUpperCase() === 'LEFT');
    const right = options.filter((option) => String(option.side).toUpperCase() === 'RIGHT');
    const targets = right.length ? right : options;
    const sourceItems = left.length ? left : options;

    return (
      <div className="matching-question space-y-5 my-4 max-w-3xl mx-auto">
        {targets.some((option) => option.imageUrl || option.audioUrl) && (
          <div className="matching-media-options grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {targets.map((option, index) => (
              <div key={option.id} className="p-3.5 rounded-2xl bg-[#FFF7E8] border border-[#E8E5DF] space-y-2 shadow-2xs">
                <strong className="block text-xs font-bold text-[#253044]">
                  {option.textEn ? (<BilingualText vi={option.textVi || option.text || `Lựa chọn ${index + 1}`} en={option.textEn} />) : (<span>{option.textVi || option.text || `Lựa chọn ${index + 1}`}</span>)}
                </strong>
                <OptionMedia option={option} index={index} />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {sourceItems.map((option, index) => (
            <div
              key={option.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-2xs hover:border-[#FFCD00] transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <span className="font-bold text-sm text-[#253044] block">
                  {option.textEn ? (<BilingualText vi={option.textVi || option.text || `Mục ${index + 1}`} en={option.textEn} />) : (<span>{option.textVi || option.text || `Mục ${index + 1}`}</span>)}
                </span>
                <OptionMedia option={option} index={index} />
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <select
                  disabled={disabled}
                  value={answer?.pairs?.[option.id] || ''}
                  onChange={(event) =>
                    onChange({
                      pairs: { ...(answer?.pairs || {}), [option.id]: event.target.value },
                    })
                  }
                  className="w-full sm:w-60 py-2.5 px-3.5 rounded-xl bg-[#FFF7E8] border border-[#E8E5DF] focus:border-[#FF7A00] text-xs font-semibold text-[#253044] outline-none transition-all cursor-pointer"
                >
                  <option value="">{bilingualLabel("— Chọn cặp tương ứng —")}</option>
                  {targets
                    .filter((item) => String(item.id) !== String(option.id))
                    .map((item, i) => (
                      <option key={item.id} value={item.id}>
                        {item.textVi || item.text || item.textEn || bilingualLabel(`Lựa chọn ${i + 1}`)}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. ĐIỀN TỪ / TỰ LUẬN (Fill in the blank / Free text answer)
  return (
    <div className="text-answer space-y-3 my-4 max-w-3xl mx-auto">
      <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
        <BilingualText>{"Nhập câu trả lời của bạn:"}</BilingualText>
      </label>
      <div className="relative">
        <textarea
          rows={3}
          disabled={disabled}
          value={typeof answer === 'string' ? answer : answer?.text || ''}
          onChange={(event) => onChange({ text: event.target.value })}
          placeholder={bilingualLabel("Gõ câu trả lời bằng tiếng Việt tại đây…")}
          className="w-full p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8E5DF] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/15 text-sm sm:text-base font-semibold text-[#253044] placeholder-stone-400 outline-none transition-all vn-diacritic-safe"
        />
      </div>
      <p className="text-[11px] text-[#64748B] italic">
        <BilingualText>{"Gợi ý: Chú ý dấu câu và thanh điệu tiếng Việt (Sắc, Huyền, Hỏi, Ngã, Nặng)."}</BilingualText>
      </p>
    </div>
  );
}

function OptionMedia({ option, index }) {
  if (!option.imageUrl && !option.audioUrl) return null;
  return (
    <div className="pt-1 space-y-1.5">
      {option.imageUrl && (
        <div className="rounded-xl overflow-hidden border border-[#E8E5DF]/60 max-h-36 bg-[#FFFDF9] p-1 flex items-center justify-center shadow-2xs">
          <ContentImage
            className="option-image max-h-32 w-auto object-contain rounded-lg"
            src={option.imageUrl}
            alt={option.textVi || option.text || option.textEn || `Lựa chọn ${index + 1}`}
          />
        </div>
      )}
      {option.audioUrl && <MediaPlayer audioUrl={option.audioUrl} />}
    </div>
  );
}

export default QuestionInput;

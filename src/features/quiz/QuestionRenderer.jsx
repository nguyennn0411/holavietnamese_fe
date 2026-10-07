import { BilingualText } from "../shared/BilingualText";
export const questionTypes = [
  "MULTIPLE_CHOICE",
  "MULTIPLE_SELECT",
  "TRUE_FALSE",
  "FILL_BLANK",
  "MATCHING",
  "LISTENING",
  "TRANSLATION",
  "REORDER_SENTENCE",
  "REORDER",
  "IMAGE_SELECTION",
];
export function QuestionRenderer({
  question: q,
  value = {},
  onChange,
  disabled = false,
}) {
  const type =
      q.questionType === "REORDER" ? "REORDER_SENTENCE" : q.questionType,
    options = q.options || [],
    selected = value.optionIds || [];
  const choice =
    [
      "MULTIPLE_CHOICE",
      "MULTIPLE_SELECT",
      "TRUE_FALSE",
      "IMAGE_SELECTION",
    ].includes(type) ||
    (type === "LISTENING" && options.length > 0);
  return (
    <div className="m2-question">
      <h2><BilingualText vi={q.promptVi} en={q.promptEn || q.prompt} variant="title" /></h2>
      {q.imageUrl && (
        <img
          className="m2-question-image"
          src={q.imageUrl}
          alt="Hình minh họa câu hỏi / Question illustration"
        />
      )}
      {q.audioUrl && <audio controls src={q.audioUrl} />}
      <fieldset disabled={disabled}>
        <legend className="sr-only">Câu trả lời của bạn / Your answer</legend>
        {choice ? (
          <div className="m2-options">
            {options.map((o) => (
              <label
                key={o.id}
                className={selected.includes(o.id) ? "selected" : ""}
              >
                <input
                  type={type === "MULTIPLE_SELECT" ? "checkbox" : "radio"}
                  name={`question-${q.questionId || q.id || "practice"}`}
                  checked={selected.includes(o.id)}
                  onChange={() =>
                    onChange({
                      optionIds:
                        type === "MULTIPLE_SELECT"
                          ? selected.includes(o.id)
                            ? selected.filter((id) => id !== o.id)
                            : [...selected, o.id]
                          : [o.id],
                    })
                  }
                />
                {o.imageUrl && (
                  <img src={o.imageUrl} alt={o.text || "Option"} />
                )}
                <BilingualText vi={o.textVi || (!o.textEn ? o.text : null)} en={o.textEn} />
                {o.audioUrl && <audio controls src={o.audioUrl} />}
              </label>
            ))}
          </div>
        ) : type === "MATCHING" ? (
          <div className="m2-matching">
            {options
              .filter((o) => o.side === "left")
              .map((o) => (
                <fieldset key={o.id} className="m2-match-group">
                  <legend><BilingualText vi={o.textVi || o.text} en={o.textEn} /></legend>
                  <div className="m2-options">
                    {options.filter((x) => x.side === "right").map((x) => (
                      <label key={x.id} className={value.pairs?.[o.id] === x.id ? "selected" : ""}>
                        <input type="radio" name={`match-${q.questionId || q.id}-${o.id}`}
                          checked={value.pairs?.[o.id] === x.id}
                          onChange={() => onChange({pairs: {...value.pairs, [o.id]: x.id}})} />
                        <BilingualText vi={x.textVi || x.text} en={x.textEn} />
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
          </div>
        ) : type === "REORDER_SENTENCE" ? (
          <>
            <p>
              <BilingualText vi="Chọn các từ theo đúng thứ tự. Nhấn vào từ đã chọn để bỏ chọn." en="Choose words in order. Click a selected word to remove it." variant="caption" />
            </p>
            <div className="m2-token-row">
              {(value.sequence || []).map((id) => (
                <button
                  type="button"
                  key={id}
                  className="secondary"
                  onClick={() =>
                    onChange({
                      sequence: value.sequence.filter((x) => x !== id),
                    })
                  }
                >
                  <BilingualText vi={options.find((o) => o.id === id)?.textVi || options.find((o) => o.id === id)?.text} en={options.find((o) => o.id === id)?.textEn} variant="caption" />
                </button>
              ))}
            </div>
            <div className="m2-token-row">
              {options
                .filter((o) => !value.sequence?.includes(o.id))
                .map((o) => (
                  <button
                    type="button"
                    key={o.id}
                    className="secondary"
                    onClick={() =>
                      onChange({ sequence: [...(value.sequence || []), o.id] })
                    }
                  >
                    <BilingualText vi={o.textVi || (!o.textEn ? o.text : null)} en={o.textEn} variant="caption" />
                  </button>
                ))}
            </div>
          </>
        ) : (
          <textarea
            aria-label="Câu trả lời của bạn / Your answer"
            rows={3}
            value={value.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
          />
        )}
      </fieldset>
    </div>
  );
}
export function answerText(answer, options = [], language = "vi") {
  const text = (id) => {
    const option = options.find(o => o.id === id);
    return language === "en" ? option?.textEn || "" : option?.textVi || option?.text || id;
  };
  if (!answer || Object.keys(answer).length === 0) return language === "en" ? "Unanswered" : "Chưa trả lời";
  if (answer.optionIds)
    return answer.optionIds
      .map(text)
      .join(", ");
  if (answer.acceptedAnswers) return language === "en" ? "" : answer.acceptedAnswers.join(" / ");
  if (answer.sequence)
    return answer.sequence
      .map(text)
      .join(" ");
  if (answer.pairs)
    return Object.entries(answer.pairs)
      .map(
        ([a, b]) =>
          `${text(a)} → ${text(b)}`,
      )
      .join("; ");
  return language === "en" ? "" : answer.text || JSON.stringify(answer);
}

export const QuizQuestion = QuestionRenderer;

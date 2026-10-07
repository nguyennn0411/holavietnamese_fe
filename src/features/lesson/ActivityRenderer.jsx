import { BilingualText } from "../shared/BilingualText";
import { GrammarExample } from "../grammar/GrammarPages";
import { useState } from "react";
import { Link } from "react-router-dom";
import { QuestionRenderer } from "../quiz/QuestionRenderer";
import { useLoad, State, useAction, Badge } from "../shared/ui";
import { vocabularyIntegrationService as vocabulary } from "../integrations/vocabularyIntegrationService";
import { aiIntegrationService } from "../integrations/aiIntegrationService";
const practice = [
  "MULTIPLE_CHOICE",
  "FILL_BLANK",
  "MATCHING",
  "REORDER_SENTENCE",
  "LISTEN_AND_CHOOSE",
  "LISTEN_AND_TYPE",
  "LISTENING",
  "TRANSLATION",
  "PRACTICE",
];
export const activityTypes = [
  "TEXT",
  "IMAGE",
  "AUDIO",
  "VIDEO",
  "VOCABULARY",
  "FLASHCARD",
  "DIALOGUE",
  "GRAMMAR",
  "SOUND_PATTERN",
  ...practice,
  "QUIZ",
  "PRONUNCIATION",
  "AI_CONVERSATION",
  "AI_ROLEPLAY",
];
function VocabularyActivity({ ids, preview, flashcard }) {
  const resource = useLoad(() => vocabulary.getByIds(ids), [ids.join(",")]);
  const action = useAction();
  const [flipped, setFlipped] = useState({}),
    [saved, setSaved] = useState({});
  return (
    <>
      <p className="m2-muted">
        {vocabulary.demo
          ? "Demo vocabulary adapter · Member 3 integration"
          : "Vocabulary by Member 3"}
      </p>
      <State resource={resource}>
        {(words) =>
          words.length ? (
            <div className="m2-grid">
              {words.map((w) => (
                <article className="m2-panel" key={w.id}>
                  <h2>{w.word}</h2>
                  <p>{w.pronunciation}</p>
                  {(!flashcard || flipped[w.id]) && (
                    <>
                      <strong>{w.meaning}</strong>
                      <p>{w.example}</p>
                    </>
                  )}
                  {w.audioUrl && <audio controls src={w.audioUrl} />}
                  <div className="actions">
                    {flashcard && (
                      <button
                        className="secondary"
                        onClick={() =>
                          setFlipped({ ...flipped, [w.id]: !flipped[w.id] })
                        }
                      >
                        Flip card
                      </button>
                    )}
                    <button
                      disabled={preview || action.busy || saved[w.id]}
                      onClick={() =>
                        action.run(async () => {
                          await vocabulary.saveToNotebook(w.id);
                          setSaved({ ...saved, [w.id]: true });
                        })
                      }
                    >
                      {saved[w.id] ? "Saved" : "Save to notebook"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No vocabulary supplied by the integration.</p>
          )
        }
      </State>
      {action.error && <p role="alert">{action.error}</p>}
    </>
  );
}
function AIActivity({ content, preview }) {
  const [message, setMessage] = useState("");
  return (
    <div className="m2-panel">
      <Badge>Member 4 integration preview</Badge>
      <p>
        Practice conversation and pronunciation with the connected AI module.
      </p>
      <button
        disabled={preview}
        onClick={async () =>
          setMessage((await aiIntegrationService.start(content)).message)
        }
      >
        Start AI Practice
      </button>
      {message && <p role="status">{message}</p>}
      <small>
        This demo does not produce a verified score or completion reward.
      </small>
    </div>
  );
}
export function LessonActivity({
  activity: a,
  answer,
  onAnswer,
  preview = false,
}) {
  const c = a.contentJson || {};
  let body;
  switch (a.activityType) {
    case "SOUND_PATTERN":
    case "TEXT":
      body = (
        <>
          <p><BilingualText vi={c.textVi || (!c.textEn ? c.body : null)} en={c.textEn || c.translation} /></p>
          {c.imageUrl && (
            <img
              className="m2-question-image"
              src={c.imageUrl}
              alt={c.caption || ""}
            />
          )}
        </>
      );
      break;
    case "IMAGE":
      body = (
        <figure>
          <img
            className="m2-question-image"
            src={c.imageUrl}
            alt={c.caption || a.title}
          />
          <figcaption>{c.caption}</figcaption>
        </figure>
      );
      break;
    case "AUDIO":
    case "VIDEO":
      body = (
        <>
          {a.activityType === "AUDIO" ? (
            <audio controls src={c.audioUrl} />
          ) : (
            <video controls src={c.videoUrl} />
          )}
          <p><BilingualText vi={c.transcriptVi || c.transcript} en={c.transcriptEn || c.translation} /></p>
          <p><BilingualText vi={c.captionVi} en={c.captionEn} variant="caption" /></p>
        </>
      );
      break;
    case "DIALOGUE":
      body = (
        <>
          <div className="m2-dialogue">
            {(c.lines || []).map((line, i) => (
              <div key={i} className={i % 2 ? "right" : ""}>
                <small>{line.speaker}</small>
                <p><BilingualText vi={line.textVi || line.text} en={line.textEn || line.translation} /></p>
                {line.audioUrl && <audio controls src={line.audioUrl} />}
              </div>
            ))}
          </div>
        </>
      );
      break;
    case "VOCABULARY":
    case "FLASHCARD":
      body = c.items?.length ? <div className="m2-vocabulary">{c.items.map((w,i)=><article className="m2-panel" key={i}>
        <h2><BilingualText vi={w.wordVi} en={w.meaningEn} variant="title" /></h2>
        {w.pronunciation && <p>{w.pronunciation}</p>}{w.wordType && <small>{w.wordType}</small>}
        <p><BilingualText vi={w.exampleVi} en={w.exampleEn} /></p>
        {w.imageUrl && <img className="m2-question-image" src={w.imageUrl} alt={w.wordVi}/>} {w.audioUrl && <audio controls src={w.audioUrl}/>}
      </article>)}</div> : <VocabularyActivity ids={c.vocabularyIds || []} preview={preview} flashcard={a.activityType === "FLASHCARD"} />;
      break;
    case "GRAMMAR":
      body = (
        <>
          {(a.grammarTopics || []).map((g) => (
            <article key={g.id} className="m2-panel">
              <Badge>{g.level}</Badge>
              <h2><BilingualText vi={g.titleVi} en={g.titleEn || g.title} variant="title" /></h2>
              <div className="m2-pattern"><BilingualText vi={g.structurePattern} en={g.structurePatternEn} /></div>
              <p><BilingualText vi={g.explanationVi} en={g.explanationEn || g.explanation} /></p>
              {(g.examples || []).map(e => <GrammarExample key={e.id} example={e} />)}
              <p><BilingualText vi={g.commonMistakesVi} en={g.commonMistakesEn || g.commonMistakes} /></p>
              <Link to={`/grammar/${g.id}`}><BilingualText vi="Xem thêm ví dụ →" en="Explore examples" variant="caption" /></Link>
            </article>
          ))}
        </>
      );
      break;
    case "QUIZ":
      body = (
        <div className="m2-panel">
          <h2><BilingualText vi="Sẵn sàng kiểm tra kiến thức?" en="Ready to put it into practice?" variant="title" /></h2>
          <p>
            <BilingualText vi="Vượt qua bài kiểm tra để hoàn thành hoạt động. Câu trả lời được lưu tự động." en="Pass this quiz to complete the activity. Answers are saved automatically." />
          </p>
          {preview ? (
            <p>Preview mode: attempts and progress are disabled.</p>
          ) : (
            <Link className="button" to={`/quiz/${a.quizId}`}>
              <BilingualText vi="Bắt đầu / tiếp tục kiểm tra →" en="Start / resume quiz" variant="caption" />
            </Link>
          )}
        </div>
      );
      break;
    case "PRONUNCIATION":
    case "AI_CONVERSATION":
    case "AI_ROLEPLAY":
      body = <AIActivity content={c} preview={preview} />;
      break;
    default:
      body = practice.includes(a.activityType) ? (
        <QuestionRenderer
          question={{
            ...c,
            questionType:
              a.activityType === "PRACTICE"
                ? c.questionType || "FILL_BLANK"
                : a.activityType.startsWith("LISTEN_")
                  ? "LISTENING"
                  : a.activityType,
            id: a.id,
          }}
          value={answer}
          onChange={onAnswer}
          disabled={preview}
        />
      ) : (
        <p>Unsupported activity type: {a.activityType}</p>
      );
  }
  return (
    <div className="m2-activity">
      <Badge>{a.activityType.replace(/_/g, " ")}</Badge>
      <h1><BilingualText vi={a.titleVi} en={a.titleEn || a.title} variant="title" /></h1>
      <p><BilingualText vi={a.instructionVi} en={a.instructionEn || a.instruction} /></p>
      {body}
    </div>
  );
}

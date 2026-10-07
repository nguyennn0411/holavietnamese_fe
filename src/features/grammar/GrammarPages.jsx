import { BilingualText } from "../shared/BilingualText";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { grammarService } from "../shared/services";
import {
  Badge,
  Empty,
  Pagination,
  Select,
  State,
  levels,
  useLoad,
} from "../shared/ui";
export function GrammarCard({ grammar: g }) {
  return (
    <article className="m2-panel">
      <Badge>{g.level}</Badge>
      <h2>
        <BilingualText
          vi={g.titleVi}
          en={g.titleEn || g.title}
          variant="title"
        />
      </h2>
      <div className="m2-pattern">
        <BilingualText vi={g.structurePattern} en={g.structurePatternEn} />
      </div>
      <p>
        <BilingualText
          vi={g.descriptionVi || g.explanationVi}
          en={g.descriptionEn || g.explanationEn || g.explanation}
        />
      </p>
      <Link className="m2-text-link" to={"/grammar/" + g.id}>
        <BilingualText
          vi="Học ngữ pháp →"
          en="Learn Grammar"
          variant="caption"
        />
      </Link>
    </article>
  );
}
export function GrammarExample({ example: e }) {
  return (
    <div className="m2-panel">
      <p>
        <BilingualText vi={e.vietnameseText} en={e.translation} />
      </p>
      <small>{e.explanation}</small>
    </div>
  );
}
export function GrammarListPage() {
  const [q, setQ] = useState(""),
    [level, setLevel] = useState(""),
    [page, setPage] = useState(0);
  const resource = useLoad(
    () => grammarService.list({ q, level, page, size: 9 }),
    [q, level, page],
  );
  return (
    <div className="m2">
      <p className="eyebrow">
        <BilingualText
          vi="NỀN TẢNG GIAO TIẾP"
          en="THE BUILDING BLOCKS OF CONVERSATION"
          variant="caption"
        />
      </p>
      <h1>
        <BilingualText
          vi="Ngữ pháp tiếng Việt"
          en="Vietnamese Grammar"
          variant="title"
        />
      </h1>
      <p>
        <BilingualText
          vi="Khám phá cách tạo câu tiếng Việt."
          en="Understand how Vietnamese sentences work."
        />
      </p>
      <div className="m2-filters">
        <input
          aria-label="Tìm ngữ pháp / Search grammar"
          placeholder="Tìm ngữ pháp / Search grammar..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
        />
        <Select
          label="Trình độ / Level"
          values={levels}
          value={level}
          onChange={(v) => {
            setLevel(v);
            setPage(0);
          }}
        />
      </div>
      <State resource={resource}>
        {(data) => (
          <>
            {data.content.length ? (
              <div className="m2-grid">
                {data.content.map((g) => (
                  <GrammarCard key={g.id} grammar={g} />
                ))}
              </div>
            ) : (
              <Empty />
            )}
            <Pagination data={data} onChange={setPage} />
          </>
        )}
      </State>
    </div>
  );
}
export function GrammarDetailPage() {
  const { id } = useParams();
  const resource = useLoad(() => grammarService.detail(id), [id]);
  return (
    <div className="m2">
      <Link to="/grammar">
        <BilingualText
          vi="← Thư viện ngữ pháp"
          en="Grammar library"
          variant="caption"
        />
      </Link>
      <State resource={resource}>
        {(g) => (
          <article className="m2-grammar-detail">
            <Badge>{g.level}</Badge>
            <h1>
              <BilingualText
                vi={g.titleVi}
                en={g.titleEn || g.title}
                variant="display"
              />
            </h1>
            <p>
              <BilingualText
                vi={g.descriptionVi}
                en={g.descriptionEn || g.description}
              />
            </p>
            <section className="m2-panel">
              <h2>
                <BilingualText
                  vi="Cấu trúc"
                  en="Grammar Structure"
                  variant="title"
                />
              </h2>
              <div className="m2-pattern">
                <BilingualText
                  vi={g.structurePattern}
                  en={g.structurePatternEn}
                />
              </div>
              <h2>
                <BilingualText
                  vi="Giải thích"
                  en="Explanation"
                  variant="title"
                />
              </h2>
              <p>
                <BilingualText
                  vi={g.explanationVi}
                  en={g.explanationEn || g.explanation}
                />
              </p>
            </section>
            <h2>
              <BilingualText
                vi="Ví dụ hằng ngày"
                en="Examples in everyday Vietnamese"
                variant="title"
              />
            </h2>
            {g.examples.map((e) => (
              <GrammarExample key={e.id} example={e} />
            ))}
            <section className="m2-panel">
              <h2>
                <BilingualText vi="Ghi chú" en="Notes" variant="title" />
              </h2>
              <p className="m2-prewrap">
                {g.notes || (
                  <BilingualText
                    vi="Không có ghi chú bổ sung."
                    en="No additional notes."
                    variant="caption"
                  />
                )}
              </p>
              <h2>
                <BilingualText
                  vi="Lỗi thường gặp"
                  en="Common Mistakes"
                  variant="title"
                />
              </h2>
              <p className="m2-prewrap">
                <BilingualText
                  vi={g.commonMistakesVi}
                  en={g.commonMistakesEn || g.commonMistakes}
                />
              </p>
            </section>
            <h2>
              <BilingualText
                vi="Luyện tập"
                en="Practice This Grammar"
                variant="title"
              />
            </h2>
            {g.relatedLessons.length ? (
              g.relatedLessons.map((l) => (
                <Link className="button" key={l.id} to={`/lesson/${l.id}`}>
                  <BilingualText
                    vi={l.titleVi}
                    en={l.titleEn || l.title}
                    variant="caption"
                  />{" "}
                  →
                </Link>
              ))
            ) : (
              <p>
                <BilingualText
                  vi="Chưa có bài luyện tập liên kết."
                  en="No linked practice is available."
                />
              </p>
            )}
          </article>
        )}
      </State>
    </div>
  );
}

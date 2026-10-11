import { useState } from "react";
import { Headphones, RotateCcw, Square, Volume2 } from "lucide-react";
import { AUDIO_BASE, usePronunciationPlayer } from "./pronunciation";

const finals = [
  ["a", "a", "simple"], ["e", "ɛ", "simple"], ["ê", "e", "simple"],
  ["i", "i", "simple"], ["o", "ɔ", "simple"], ["ô", "o", "simple"],
  ["ơ", "ɤ", "simple"], ["u", "u", "simple"], ["ư", "ɯ", "simple"],
  ["y", "i", "simple"], ["ai", "aj", "complex"], ["ao", "aw", "complex"],
  ["au", "ɐw", "complex"], ["ay", "ɐj", "complex"], ["âu", "ʌw", "complex"],
  ["ây", "ʌj", "complex"], ["eo", "ɛw", "complex"], ["êu", "ew", "complex"],
  ["ia", "iə", "complex"], ["iêu", "iəw", "complex"], ["oa", "ʷa", "complex"],
  ["oi", "ɔj", "complex"], ["ôi", "oj", "complex"], ["ơi", "ɤj", "complex"],
  ["am", "am", "nasal"], ["an", "an", "nasal"], ["ang", "aŋ", "nasal"],
  ["anh", "ɐjŋ", "nasal"], ["em", "ɛm", "nasal"], ["ên", "en", "nasal"],
  ["ong", "ɐwŋ", "nasal"], ["ương", "ɯəŋ", "nasal"],
  ["ap", "ap", "stop"], ["at", "at", "stop"], ["ac", "ak", "stop"],
  ["ach", "ɐjk", "stop"], ["ep", "ɛp", "stop"], ["et", "ɛt", "stop"],
  ["oc", "ɐwk", "stop"], ["uc", "uk", "stop"],
];
const initials = ["∅", "b", "c", "ch", "d", "đ", "g", "gh", "gi", "h", "k", "kh", "l", "m", "n", "ng", "ngh", "nh", "p", "ph", "qu", "r", "s", "t", "th", "tr", "v", "x"];
// Availability mirrors the recorded cells on VietSyllables for the selected finals.
// Each hexadecimal digit covers four finals in the order above.
const recorded = {
  "∅": "fffff7ffff", b: "fffffffdff", c: "cfcfe0fdf1",
  ch: "fffffdfdff", d: "fffffdfdff", "đ": "fffffffdff",
  g: "cfcfe0fdf1", gh: "303001000e", gi: "cfcfe9fdff",
  h: "ffffffffff", k: "30300f020e", kh: "fffffffdff",
  l: "ffffffffff", m: "fffffffeff", n: "ffffefffff",
  ng: "cfcff0fdf1", ngh: "30300f000e", nh: "fffffffdff",
  p: "f0f00004d", ph: "ffffeffcff", qu: "3f1f03fc1b",
  r: "ffffe7fcff", s: "fffff7ffff", t: "fffff7ffff",
  th: "ffffffffff", tr: "ffffeffdff", v: "ffffe7efff",
  x: "fffffdffff",
};
const tones = [
  ["none", "Ngang", "◌"], ["grave", "Huyền", "◌̀"],
  ["acute", "Sắc", "◌́"], ["hook", "Hỏi", "◌̉"],
  ["tilde", "Ngã", "◌̃"], ["dot", "Nặng", "◌̣"],
];
const categories = [
  ["simple", "Nguyên âm đơn"], ["complex", "Vần phức"],
  ["nasal", "+ Âm cuối mũi"], ["stop", "+ Âm cuối tắc"],
];

function isAvailable(initial, final) {
  const index = finals.findIndex(([value]) => value === final);
  return index >= 0 && Math.floor(Number.parseInt(recorded[initial], 16) / 2 ** index) % 2 === 1;
}

function syllableFor(initial, final) {
  if (initial === "∅") return final;
  if (initial === "gi" && final === "i") return "gi";
  if (initial === "gi" && final === "iêu") return "giêu";
  return initial + final;
}

export function SyllableChart() {
  const { current, status, error, playQueue, stop, queueRef } = usePronunciationPlayer();
  const [filters, setFilters] = useState(["simple", "complex"]);
  const [enabledTones, setEnabledTones] = useState(tones.map(([id]) => id));

  function playSyllable(initial, final, category) {
    const selected = tones.filter(([id]) => enabledTones.includes(id) &&
      (category !== "stop" || ["acute", "dot"].includes(id)));
    const audibleTones = selected.length ? selected : tones.filter(([id]) =>
      id === (category === "stop" ? "acute" : "none"));
    const syllable = syllableFor(initial, final);
    playQueue(audibleTones.map(([id, label]) => ({
      key: `${initial}-${final}-${id}`,
      syllable,
      tone: label,
      toneId: id,
      url: `${AUDIO_BASE}/${encodeURIComponent(initial)}/${encodeURIComponent(final)}_${id}.mp3`,
    })));
  }

  function toggle(value, setter) {
    setter((values) => values.includes(value)
      ? values.filter((item) => item !== value) : [...values, value]);
  }

  const visibleFinals = finals.filter(([, , category]) => filters.includes(category));
  return (
    <section className="syllable-chart-section" aria-labelledby="syllable-chart-title">
      <div className="syllable-chart-heading">
        <div><span className="syllable-step">01 / BẢNG ÂM TƯƠNG TÁC</span><h2 id="syllable-chart-title">Ghép âm và nghe</h2><p>Chọn nhóm vần, chọn thanh điệu rồi bấm vào một ô để nghe.</p></div>
        <span className="syllable-accent"><Headphones size={17} aria-hidden="true" /> Hà Nội · nữ</span>
      </div>
      <div className="syllable-toolbar">
        <div className="syllable-filters" aria-label="Nhóm vần">
          {categories.map(([id, label]) => <button type="button" key={id}
            className={`syllable-filter syllable-${id}${filters.includes(id) ? " active" : ""}`}
            aria-pressed={filters.includes(id)} onClick={() => toggle(id, setFilters)}>
            <span aria-hidden="true">{filters.includes(id) ? "✓" : ""}</span>{label}
          </button>)}
        </div>
        <div className="syllable-tones" aria-label="Thanh điệu phát khi chọn ô">
          {tones.map(([id, label, mark]) => <button type="button" key={id}
            className={`syllable-tone${enabledTones.includes(id) ? " active" : ""}`}
            aria-label={`${label} (${mark})`} aria-pressed={enabledTones.includes(id)}
            onClick={() => toggle(id, setEnabledTones)}><strong>{mark}</strong><small>{label}</small></button>)}
        </div>
      </div>
      <p className="syllable-hint">Kéo ngang để xem thêm vần ↔ · Bỏ hết dấu vẫn nghe thanh ngang; vần kết thúc bằng p, t, c, ch dùng thanh sắc.</p>
      {visibleFinals.length ? <div className="syllable-table-scroll" role="region" aria-label="Bảng ghép phụ âm và vần" tabIndex={0}>
        <table className="syllable-table"><thead><tr><th className="syllable-corner" scope="col">Vần →<br />Âm đầu ↓</th>
          {visibleFinals.map(([value, ipa, category]) => <th key={value} scope="col" className={`syllable-head-${category}`}><strong>{value}</strong><small>/{ipa}/</small></th>)}
        </tr></thead><tbody>{initials.map((initial) => <tr key={initial}><th scope="row"><strong>{initial === "∅" ? "—" : initial}</strong><small>{initial === "∅" ? "không âm đầu" : ""}</small></th>
          {visibleFinals.map(([value, , category]) => <td key={value} className={`syllable-cell-${category}`}>
            {isAvailable(initial, value) && <button type="button"
              className={`syllable-cell-button${current?.key.startsWith(`${initial}-${value}-`) ? " selected" : ""}`}
              aria-label={`Nghe ${syllableFor(initial, value)} với các thanh đã chọn`}
              onClick={() => playSyllable(initial, value, category)}>{syllableFor(initial, value)}</button>}
          </td>)}
        </tr>)}</tbody></table>
      </div> : <div className="syllable-empty">Chọn ít nhất một nhóm vần để xem bảng âm.</div>}
        <div className="syllable-bottom"><div className="syllable-now"><Volume2 size={20} aria-hidden="true" /><span role="status" aria-live="polite"><strong>{current ? `${status === "loading" ? "Đang tải" : status === "playing" ? "Đang phát" : "Đã chọn"}: ${current.syllable}` : "Chọn một ô để bắt đầu nghe"}</strong><small>{current ? `${current.tone} · ${current.index}/${current.total} · ${current.fallback ? "Giọng tổng hợp trên thiết bị" : "Giọng Hà Nội"}` : "Âm tiết sẽ phát theo các thanh bạn đã chọn."}</small></span></div>
        <div className="syllable-actions"><button type="button" disabled={!queueRef.current.length} onClick={() => playQueue(queueRef.current)}><RotateCcw size={16} aria-hidden="true" /> Nghe lại</button><button type="button" disabled={status !== "loading" && status !== "playing"} onClick={stop}><Square size={15} aria-hidden="true" /> Dừng</button></div></div>
      {error && <p className="syllable-error" role="alert">{error}</p>}
      <p className="syllable-credit">Âm mẫu từ <a href="https://vietsyllables.com/" target="_blank" rel="noreferrer">VietSyllables</a>. Nếu nguồn này không tải được, trình duyệt dùng giọng tổng hợp tiếng Việt trên thiết bị.</p>
    </section>
  );
}

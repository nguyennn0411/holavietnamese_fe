import { Link } from "react-router-dom";
import {
  ArrowLeft,
  AudioLines,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Headphones,
  Play,
  RotateCcw,
  Square,
  Volume2,
} from "lucide-react";
import data from "./alphabet.json";
import { SyllableChart } from "./SyllableChart";
import { entriesForTile, usePronunciationPlayer } from "./pronunciation";
import "./alphabet.css";

const vowels = data.letters.filter((letter) =>
  data.vowels.includes(letter.symbol),
);
const consonants = data.letters.filter(
  (letter) => !data.vowels.includes(letter.symbol),
);

export function AlphabetPage() {
  const { current: selected, status: state, error, playQueue, stop } = usePronunciationPlayer();

  function play(items, group) {
    playQueue(items.flatMap((item) => entriesForTile(item, group)));
  }

  function tiles(items, group, uppercase = false) {
    return items.map((item) => {
      const active = selected?.id === item.id && selected?.group === group;
      return (
        <button
          type="button"
          key={item.id}
          className={`alphabet-tile${active ? " is-selected" : ""}${active && state === "playing" ? " is-playing" : ""}`}
          aria-label={`Nghe ${item.label ? `thanh ${item.label}` : `chữ ${item.symbol}`}: ${item.reading}`}
          aria-pressed={active}
          title={`Cách đọc: ${item.reading}`}
          onClick={() => play([item], group)}
        >
          {item.label && (
            <span className="alphabet-tone-label">{item.label}</span>
          )}
          <span className="alphabet-symbol" lang="vi">
            {uppercase ? item.symbol.toLocaleUpperCase("vi") : item.symbol}
          </span>
          <Volume2
            className="alphabet-tile-speaker"
            size={13}
            aria-hidden="true"
          />
        </button>
      );
    });
  }

  const busy = state === "playing" || state === "loading";
  return (
    <div className="alphabet-surface">
      <div className="alphabet-page">
        <header className="alphabet-header">
          <div>
            <p className="alphabet-eyebrow">HOLA VIETNAMESE · LUYỆN PHÁT ÂM</p>
            <h1>Nghe tiếng Việt, <em>từng âm một.</em></h1>
            <p className="alphabet-subtitle">
              Khám phá 29 chữ cái, ghép phụ âm với vần và nghe sáu thanh điệu.
            </p>
          </div>
          <div className="alphabet-meta">
            <span>
              <BookOpen size={16} aria-hidden="true" />
              29 chữ cái
            </span>
            <span>
              <Headphones size={16} aria-hidden="true" />
              Bấm vào chữ để nghe
            </span>
            <span>
              <ChartNoAxesColumnIncreasing size={16} aria-hidden="true" />
              Cơ bản · A0
            </span>
          </div>
        </header>

        <SyllableChart />

        <section
          className="alphabet-card alphabet-red"
          aria-labelledby="alphabet-title"
        >
          <div className="alphabet-card-heading">
            <span className="alphabet-icon" aria-hidden="true">
              Aa
            </span>
            <div>
              <h2 id="alphabet-title">Bảng chữ cái</h2>
              <p>
                29 chữ cái tiếng Việt. Chọn một chữ để nghe cách đọc của chữ đó.
              </p>
            </div>
            <button
              className="alphabet-play-all"
              type="button"
              onClick={() =>
                play(data.letters, "letters")
              }
            >
              <Play size={15} aria-hidden="true" />
              Nghe lần lượt
            </button>
          </div>
          <div className="alphabet-grid alphabet-letters">
            {tiles(data.letters, "letters", true)}
          </div>
        </section>

        <section
          className="alphabet-card alphabet-amber"
          aria-labelledby="vowels-title"
        >
          <div className="alphabet-card-heading">
            <span className="alphabet-icon" aria-hidden="true">
              ă
            </span>
            <div>
              <h2 id="vowels-title">Nguyên âm</h2>
              <p>
                12 chữ cái ghi nguyên âm. Nghe và so sánh những chữ dễ nhầm.
              </p>
            </div>
          </div>
          <div className="alphabet-grid alphabet-vowels">
            {tiles(vowels, "vowels")}
          </div>
        </section>

        <section
          className="alphabet-card alphabet-blue"
          aria-labelledby="consonants-title"
        >
          <div className="alphabet-card-heading">
            <span className="alphabet-icon" aria-hidden="true">
              <Volume2 size={23} />
            </span>
            <div>
              <h2 id="consonants-title">Phụ âm</h2>
              <p>17 chữ cái ghi phụ âm và 11 nhóm chữ thường gặp.</p>
            </div>
          </div>
          <div className="alphabet-consonants">
            <div className="alphabet-subgroup">
              <h3>
                Phụ âm đơn <span>(17 chữ)</span>
              </h3>
              <div className="alphabet-grid alphabet-single">
                {tiles(consonants, "consonants")}
              </div>
            </div>
            <div className="alphabet-subgroup">
              <h3>
                Phụ âm ghép <span>(11 nhóm chữ)</span>
              </h3>
              <div className="alphabet-grid alphabet-compound">
                {tiles(data.consonantGroups, "groups")}
              </div>
            </div>
          </div>
        </section>

        <section
          className="alphabet-card alphabet-green"
          aria-labelledby="tones-title"
        >
          <div className="alphabet-card-heading">
            <span className="alphabet-icon" aria-hidden="true">
              <AudioLines size={23} />
            </span>
            <div>
              <h2 id="tones-title">Thanh điệu</h2>
              <p>
                6 thanh điệu, 5 dấu thanh. Chọn từng ô để nghe biến thể tương
                ứng của âm “a”.
              </p>
            </div>
          </div>
          <div className="alphabet-grid alphabet-tones">
            {tiles(data.tones, "tones")}
          </div>
        </section>

        <div className="alphabet-player" aria-label="Điều khiển âm thanh">
          <span className="alphabet-player-symbol" aria-hidden="true">
            {selected?.symbol || <Headphones size={24} />}
          </span>
          <div
            className="alphabet-player-copy"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <strong>
              {selected
                ? `${state === "loading" ? "Đang tải" : state === "playing" ? "Đang phát" : "Nghe lại"}: ${selected.label || selected.symbol}${selected.total > 1 ? ` · ${selected.index}/${selected.total}` : ""}`
                : "Chạm vào một chữ, nghe một âm mới"}
            </strong>
            <span>
              {selected
                ? `Cách đọc: ${selected.reading} · ${selected.fallback || !selected.url ? "Giọng tổng hợp trên thiết bị" : selected.source}`
                : "Nghe cách đọc, rồi thử nhắc lại. / Tap a tile to listen."}
            </span>
          </div>
          <div className="alphabet-player-actions">
            <button
              type="button"
              aria-label="Nghe lại âm đã chọn"
              disabled={!selected}
              onClick={() => play([selected], selected.group)}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Nghe lại
            </button>
            <button
              type="button"
              aria-label="Dừng phát âm thanh"
              disabled={!busy}
              onClick={stop}
            >
              <Square size={15} aria-hidden="true" />
              Dừng
            </button>
          </div>
        </div>
        {error && (
          <p className="alphabet-error" role="alert">
            {error}
          </p>
        )}
        <footer className="alphabet-footer">
          <Link to="/courses">
            <ArrowLeft size={16} aria-hidden="true" />
            Về khóa học
          </Link>
          <span>Âm mẫu VietSyllables · Dự phòng bằng giọng tiếng Việt trên thiết bị</span>
        </footer>
      </div>
    </div>
  );
}

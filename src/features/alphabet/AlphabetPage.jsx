import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AudioLines, Headphones, Play, RotateCcw, Square, Volume2 } from 'lucide-react';
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
  const { i18n } = useTranslation();
  const isVi = (i18n?.resolvedLanguage || i18n?.language || 'en').startsWith('vi');

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
          aria-label={isVi ? `Nghe ${item.label ? `thanh ${item.label}` : `chữ ${item.symbol}`}: ${item.reading}` : `Listen to ${item.label ? `tone ${item.label}` : `letter ${item.symbol}`}: ${item.reading}`}
          aria-pressed={active}
          title={isVi ? `Cách đọc: ${item.reading}` : `Pronunciation: ${item.reading}`}
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
            <p className="alphabet-eyebrow"><BilingualText vi="HOLA VIETNAMESE · LUYỆN PHÁT ÂM" en="HOLA VIETNAMESE · PRONUNCIATION PRACTICE" /></p>
            <h1><BilingualText vi={<>Nghe tiếng Việt, <em>từng âm một.</em></>} en={<>Hear Vietnamese, <em>one sound at a time.</em></>} /></h1>
            <p className="alphabet-subtitle">
              <BilingualText
                vi="Khám phá 29 chữ cái, ghép phụ âm với vần và nghe sáu thanh điệu."
                en="Explore the 29 letters, combine consonants with rhymes, and hear the six tones."
              />
            </p>
          </div>
          <div className="alphabet-meta">
            <span>
              <BilingualText vi="29 chữ cái" en="29 letters" />
            </span>
            <span>
              <BilingualText vi="Bấm vào chữ để nghe" en="Click a letter to listen" />
            </span>
            <span>
              <BilingualText vi="Cơ bản · A0" en="Beginner · A0" />
            </span>
          </div>
        </header>

        <section
          className="alphabet-card alphabet-red"
          aria-labelledby="alphabet-title"
        >
          <div className="alphabet-card-heading">
            <span className="alphabet-icon" aria-hidden="true">
              Aa
            </span>
            <div>
              <h2 id="alphabet-title"><BilingualText vi="Bảng chữ cái" en="Alphabet" /></h2>
              <p>
                <BilingualText
                  vi="29 chữ cái tiếng Việt. Chọn một chữ để nghe cách đọc của chữ đó."
                  en="29 Vietnamese letters. Select a letter to hear its pronunciation."
                />
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
              <BilingualText vi="Nghe lần lượt" en="Play in order" />
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
              <h2 id="vowels-title"><BilingualText vi="Nguyên âm" en="Vowels" /></h2>
              <p>
                <BilingualText
                  vi="12 chữ cái ghi nguyên âm. Nghe và so sánh những chữ dễ nhầm."
                  en="12 vowel letters. Listen and compare easily confused letters."
                />
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
              <h2 id="consonants-title"><BilingualText vi="Phụ âm" en="Consonants" /></h2>
              <p><BilingualText vi="17 chữ cái ghi phụ âm và 11 nhóm chữ thường gặp." en="17 consonant letters and 11 common digraphs." /></p>
            </div>
          </div>
          <div className="alphabet-consonants">
            <div className="alphabet-subgroup">
              <h3>
                <BilingualText vi="Phụ âm đơn" en="Single consonants" /> <span><BilingualText vi="(17 chữ)" en="(17 letters)" /></span>
              </h3>
              <div className="alphabet-grid alphabet-single">
                {tiles(consonants, "consonants")}
              </div>
            </div>
            <div className="alphabet-subgroup">
              <h3>
                <BilingualText vi="Phụ âm ghép" en="Compound consonants" /> <span><BilingualText vi="(11 nhóm chữ)" en="(11 digraphs)" /></span>
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
              <h2 id="tones-title"><BilingualText vi="Thanh điệu" en="Tones" /></h2>
              <p>
                <BilingualText
                  vi="6 thanh điệu, 5 dấu thanh. Chọn từng ô để nghe biến thể tương ứng của âm “a”."
                  en="6 tones, 5 tone marks. Select each tile to hear the variations of the sound “a”."
                />
              </p>
            </div>
          </div>
          <div className="alphabet-grid alphabet-tones">
            {tiles(data.tones, "tones")}
          </div>
        </section>

        <SyllableChart />

        <div className="alphabet-player" aria-label={bilingualLabel("Điều khiển âm thanh", "Audio controls")}>
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
              {selected ? (
                <>
                  <BilingualText
                    vi={state === "loading" ? "Đang tải" : state === "playing" ? "Đang phát" : "Nghe lại"}
                    en={state === "loading" ? "Loading" : state === "playing" ? "Playing" : "Replay"}
                  />
                  : {selected.label || selected.symbol}{selected.total > 1 ? ` · ${selected.index}/${selected.total}` : ""}
                </>
              ) : (
                <BilingualText vi="Chạm vào một chữ, nghe một âm mới" en="Tap a letter to hear a new sound" />
              )}
            </strong>
            <span>
              {selected ? (
                <>
                  <BilingualText vi="Cách đọc: " en="Pronunciation: " />
                  {selected.reading} · {selected.fallback || !selected.url ? <BilingualText vi="Giọng tổng hợp trên thiết bị" en="Device synthesized voice" /> : selected.source}
                </>
              ) : (
                <BilingualText vi="Nghe cách đọc, rồi thử nhắc lại." en="Listen to the pronunciation, then repeat." />
              )}
            </span>
          </div>
          <div className="alphabet-player-actions">
            <button
              type="button"
              aria-label={bilingualLabel("Nghe lại âm đã chọn", "Replay selected sound")}
              disabled={!selected}
              onClick={() => play([selected], selected.group)}
            >
              <RotateCcw size={16} aria-hidden="true" />
              <BilingualText vi="Nghe lại" en="Replay" />
            </button>
            <button
              type="button"
              aria-label={bilingualLabel("Dừng phát âm thanh", "Stop audio")}
              disabled={!busy}
              onClick={stop}
            >
              <Square size={15} aria-hidden="true" />
              <BilingualText vi="Dừng" en="Stop" />
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
            <BilingualText vi="Về khóa học" en="Back to courses" />
          </Link>
          <span><BilingualText vi="Âm mẫu VietSyllables · Dự phòng bằng giọng tiếng Việt trên thiết bị" en="VietSyllables sample audio · Fallback using device Vietnamese TTS" /></span>
        </footer>
      </div>
    </div>
  );
}

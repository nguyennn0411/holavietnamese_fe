import { createContext, useContext } from 'react';
import { UI_TRANSLATIONS } from './uiTranslations';

const TextLanguageContext = createContext('bilingual');

export function BilingualTextProvider({ language = 'bilingual', children }) {
  return <TextLanguageContext.Provider value={language}>{children}</TextLanguageContext.Provider>;
}

const patterns = [
  [/^Xin chào, (.+)!$/, match => `Hello, ${match[1]}!`],
  [/^Đã lưu “(.+)” vào sổ tay\.$/, match => `Saved “${match[1]}” to your notebook.`],
  [/^Đã xóa “(.+)” khỏi sổ tay\.$/, match => `Removed “${match[1]}” from your notebook.`],
  [/^Nghĩa (\d+):$/, match => `Meaning ${match[1]}:`],
  [/^(\d+) phút$/, match => `${match[1]} minutes`],
  [/^Cấp độ (.+)$/, match => `Level ${match[1]}`],
  [/^Lựa chọn (\d+)$/, match => `Option ${match[1]}`],
  [/^Mục (\d+)$/, match => `Item ${match[1]}`],
  [/^Tối đa (\d+) lần$/, match => `Up to ${match[1]} attempts`],
  [/^Còn (\d+) phút để ngày hôm nay thêm ý nghĩa\.$/, match => `${match[1]} minutes left to make today count.`],
  [/^Thêm (\d+) phút cho hành trình của bạn\.$/, match => `Add ${match[1]} minutes to your journey.`],
  [/^Mã xác nhận 6 số đã được gửi tới (.+)\.$/, match => `A six-digit verification code was sent to ${match[1]}.`],
  [/^Biên tập: (.*)$/, match => `Editing: ${match[1]}`],
  [/^(\d+) min$/, match => `${match[1]} minutes`],
  [/^(\d+) \/ (\d+) hoạt động$/, match => `${match[1]} / ${match[2]} activities`],
  [/^(\d+) \/ (\d+) từ$/, match => `${match[1]} / ${match[2]} words`],
  [/^(\d+) \/ (\d+) bài học đã hoàn thành$/, match => `${match[1]} / ${match[2]} lessons completed`],
  [/^Tạo (.+)$/, match => `Create ${UI_TRANSLATIONS[match[1]]?.[1] || match[1]}`],
];

export function bilingualPair(value) {
  if (typeof value !== 'string') return null;
  const text = value.replace(/\s+/g, ' ').trim();
  if (UI_TRANSLATIONS[text]) return UI_TRANSLATIONS[text];
  for (const [pattern, translate] of patterns) {
    const match = text.match(pattern);
    if (match) return [/^\d+ min$/.test(text) ? text.replace(' min', ' phút') : text, translate(match)];
  }
  return null;
}

// Native select options and placeholders accept text rather than nested markup.
export function bilingualLabel(value) {
  const pair = bilingualPair(value);
  return pair && pair[0].toLowerCase() !== pair[1].toLowerCase() ? `${pair[0]} · ${pair[1]}` : value;
}

export function vietnameseLabel(value) {
  return bilingualPair(value)?.[0] ?? value;
}

export function useBilingualLabel() {
  return useContext(TextLanguageContext) === 'vi' ? vietnameseLabel : bilingualLabel;
}

export function BilingualText({ children, vi, en, className = '' }) {
  const language = useContext(TextLanguageContext);
  const pair = en ? [vi ?? children, en] : vi !== undefined ? null : bilingualPair(children);
  if (language === 'vi') return pair ? pair[0] : vi ?? children ?? null;
  if (!pair || (typeof pair[0] === 'string' && pair[0].toLowerCase() === pair[1].toLowerCase())) return children ?? vi ?? null;
  return <span className={`bilingual-text ${className}`.trim()}>
    <span className="bilingual-text__vi" lang="vi">{pair[0]}</span>
    <span className="bilingual-text__en" lang="en">{pair[1]}</span>
  </span>;
}

import { createContext, useContext, useCallback } from 'react';
import { UI_TRANSLATIONS } from '@/shared/components/common/uiTranslations';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const TextLanguageContext = createContext('bilingual');

export function BilingualTextProvider({ language, children }) {
  const { i18n: activeI18n } = useTranslation();
  const currentLang = (activeI18n?.resolvedLanguage || activeI18n?.language || 'en').startsWith('vi') ? 'vi' : 'en';
  const effectiveLanguage = language || currentLang;
  return <TextLanguageContext.Provider value={effectiveLanguage}>{children}</TextLanguageContext.Provider>;
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
  [/^Đã hoàn thành (\d+)\/([^\s]+) bài học \((\d+)%\)$/, match => `Completed ${match[1]}/${match[2]} lessons (${match[3]}%)`],
  [/^(\d+) bài học$/, match => `${match[1]} lessons`],
  [/^(\d+) bài$/, match => `${match[1]} lessons`],
  [/^(\d+) câu hỏi$/, match => `${match[1]} questions`],
  [/^(\d+) học phần$/, match => `${match[1]} modules`],
  [/^(\d+) ngày trước$/, match => `${match[1]} days ago`],
  [/^(\d+) giờ trước$/, match => `${match[1]} hours ago`],
  [/^(\d+) phút trước$/, match => `${match[1]} minutes ago`],
  [/^Học phần (\d+)$/i, match => `Module ${match[1]}`],
  [/^Bài (\d+)$/i, match => `Lesson ${match[1]}`],
  [/^Câu (\d+)$/i, match => `Question ${match[1]}`],
  [/^Đưa học phần (\d+) lên$/, match => `Move module ${match[1]} up`],
  [/^Đưa học phần (\d+) xuống$/, match => `Move module ${match[1]} down`],
  [/^Đưa bài (\d+) lên$/, match => `Move lesson ${match[1]} up`],
  [/^Đưa bài (\d+) xuống$/, match => `Move lesson ${match[1]} down`],
  [/^Đưa câu (\d+) lên$/, match => `Move question ${match[1]} up`],
  [/^Đưa câu (\d+) xuống$/, match => `Move question ${match[1]} down`],
  [/^Gỡ câu (\d+)$/, match => `Remove question ${match[1]}`],
  [/^Điểm câu (\d+)$/, match => `Points for question ${match[1]}`],
  [/^Xem trước (.*)$/, match => `Preview ${match[1]}`],
  [/^Lưu trữ “(.*)”\? Nội dung sẽ ngừng hiển thị với học viên\.$/, match => `Archive “${match[1]}”? Content will no longer appear for learners.`],
  [/^Tạo (.+)$/, match => `Create ${UI_TRANSLATIONS[match[1]]?.[1] || match[1]}`],
];

const REVERSE_TRANSLATIONS = {};
for (const key of Object.keys(UI_TRANSLATIONS)) {
  const pair = UI_TRANSLATIONS[key];
  if (pair && pair[1] && !REVERSE_TRANSLATIONS[pair[1]]) {
    REVERSE_TRANSLATIONS[pair[1]] = pair;
  }
}

export function bilingualPair(value) {
  if (typeof value !== 'string') return null;
  const text = value.replace(/\s+/g, ' ').trim();
  if (UI_TRANSLATIONS[text]) return UI_TRANSLATIONS[text];
  if (REVERSE_TRANSLATIONS[text]) return REVERSE_TRANSLATIONS[text];
  for (const [pattern, translate] of patterns) {
    const match = text.match(pattern);
    if (match) return [/^\d+ min$/.test(text) ? text.replace(' min', ' phút') : text, translate(match)];
  }
  return null;
}

// Native select options and placeholders accept text rather than nested markup.
export function bilingualLabel(value, enFallback) {
  if (value && typeof value === 'object' && value.vi) {
    const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi') ? 'vi' : 'en';
    return currentLang === 'vi' ? value.vi : (value.en || value.vi);
  }
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi') ? 'vi' : 'en';
  if (enFallback !== undefined) {
    return currentLang === 'vi' ? value : enFallback;
  }
  const pair = bilingualPair(value);
  if (!pair) return value;
  return currentLang === 'vi' ? pair[0] : pair[1];
}

export function vietnameseLabel(value) {
  if (value && typeof value === 'object' && value.vi) return value.vi;
  return bilingualPair(value)?.[0] ?? value;
}

export function englishLabel(value) {
  if (value && typeof value === 'object' && (value.en || value.vi)) return value.en || value.vi;
  return bilingualPair(value)?.[1] ?? value;
}

export function useBilingualLabel() {
  const { i18n: activeI18n } = useTranslation();
  const contextLanguage = useContext(TextLanguageContext);
  const currentLang = contextLanguage === 'vi' || contextLanguage === 'en'
    ? contextLanguage
    : ((activeI18n?.resolvedLanguage || activeI18n?.language || 'en').startsWith('vi') ? 'vi' : 'en');
  return useCallback((value, enFallback) => {
    if (value && typeof value === 'object' && value.vi) {
      return currentLang === 'vi' ? value.vi : (value.en || value.vi);
    }
    if (enFallback !== undefined) {
      return currentLang === 'vi' ? value : enFallback;
    }
    if (currentLang === 'vi') return vietnameseLabel(value);
    const pair = bilingualPair(value);
    if (!pair) return value;
    return pair[1];
  }, [currentLang]);
}

export function BilingualText({ children, vi, en, className = '' }) {
  const { i18n: activeI18n } = useTranslation();
  const contextLanguage = useContext(TextLanguageContext);
  const currentLang = contextLanguage === 'vi' || contextLanguage === 'en'
    ? contextLanguage
    : ((activeI18n?.resolvedLanguage || activeI18n?.language || 'en').startsWith('vi') ? 'vi' : 'en');

  const pair = en ? [vi ?? children, en] : bilingualPair(vi !== undefined ? vi : children);
  if (!pair || (typeof pair[0] === 'string' && pair[0].toLowerCase() === pair[1].toLowerCase())) {
    return children ?? vi ?? null;
  }
  return (
    <span className={`bilingual-text ${className}`.trim()}>
      <span className="bilingual-text__current" lang={currentLang}>
        {currentLang === 'vi' ? pair[0] : pair[1]}
      </span>
    </span>
  );
}

import { useMemo } from 'react';

const ALLOWED_TAGS = new Set([
  'A', 'ABBR', 'B', 'BLOCKQUOTE', 'BR', 'CAPTION', 'CODE', 'COL', 'COLGROUP', 'DD', 'DEL', 'DETAILS',
  'DIV', 'DL', 'DT', 'EM', 'FIGCAPTION', 'FIGURE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HR', 'I',
  'IMG', 'LI', 'MARK', 'OL', 'P', 'PRE', 'S', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUMMARY', 'SUP',
  'TABLE', 'TBODY', 'TD', 'TFOOT', 'TH', 'THEAD', 'TR', 'U', 'UL',
]);
const ALLOWED_ATTRIBUTES = new Set(['alt', 'colspan', 'dir', 'height', 'href', 'lang', 'rel', 'rowspan', 'scope', 'src', 'title', 'width']);

function safeUrl(value) {
  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:'].includes(url.protocol) || url.origin === window.location.origin;
  } catch { return false; }
}

export function sanitizeImportedHtml(html = '') {
  if (typeof DOMParser === 'undefined') return '';
  const document = new DOMParser().parseFromString(String(html), 'text/html');
  [...document.body.querySelectorAll('*')].forEach((element) => {
    if (!ALLOWED_TAGS.has(element.tagName)) {
      element.replaceWith(...element.childNodes);
      return;
    }
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      if (!ALLOWED_ATTRIBUTES.has(name) || ((name === 'href' || name === 'src') && !safeUrl(attribute.value))) {
        element.removeAttribute(attribute.name);
      }
    });
    if (element.tagName === 'A') element.setAttribute('rel', 'noopener noreferrer');
  });
  return document.body.innerHTML;
}

export function SafeImportedHtml({ html, className = '' }) {
  const safe = useMemo(() => sanitizeImportedHtml(html), [html]);
  return <div className={`imported-rich-html ${className}`.trim()} dangerouslySetInnerHTML={{ __html: safe }} />;
}

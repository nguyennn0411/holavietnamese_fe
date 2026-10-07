/** Vietnamese first. Missing translations never duplicate the other language. */
export function BilingualText({ vi, en, variant = "body", className = "" }) {
  if (!vi && !en) return null;
  return (
    <span className={`bilingual bilingual-${variant} ${className}`}>
      {vi && <span className="bilingual-vi" lang="vi">{vi}</span>}
      {en && <span className="bilingual-en" lang="en">{en}</span>}
    </span>
  );
}

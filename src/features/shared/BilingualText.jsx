/** Vietnamese is always the primary learning content. */
export function BilingualText({
  vi,
  en,
  variant = "body",
  align = "start",
  gap,
  className = "",
}) {
  if (!vi && !en) return null;
  return (
    <span
      className={`bilingual bilingual-${variant} bilingual-align-${align} ${className}`}
      style={gap !== undefined ? { "--bilingual-gap": gap } : undefined}
    >
      {vi && <span className="bilingual-vi" lang="vi">{vi}</span>}
      {en && <span className="bilingual-en" lang="en">{en}</span>}
    </span>
  );
}

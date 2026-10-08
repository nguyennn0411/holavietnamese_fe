import { Fragment } from 'react';

function inline(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => part.startsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part.startsWith('*') ? <em key={index}>{part.slice(1, -1)}</em> : <Fragment key={index}>{part}</Fragment>);
}
export function RichText({ text = '' }) {
  return <div className="rich-text">{String(text).split(/\n\s*\n/).map((block, index) => {
    if (/^#{1,3}\s/.test(block)) return <h2 key={index}>{inline(block.replace(/^#{1,3}\s+/, ''))}</h2>;
    if (/^-{3,}$/.test(block.trim())) return <hr key={index} />;
    return <p className="preserve-lines" key={index}>{inline(block)}</p>;
  })}</div>;
}

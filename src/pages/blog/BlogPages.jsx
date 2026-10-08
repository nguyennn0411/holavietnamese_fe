import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cultureService } from '@/services/cultureService';
import { PageHeader, EmptyState, Breadcrumb } from '@/components/common/Ui';
import { RichText } from '@/components/common/RichText';


export function BlogHomePage() {
  const [search, setSearch] = useState(''); const articles = cultureService.listArticles({ search }); const featured = articles[0];
  return <section><PageHeader eyebrow="Những câu chuyện từ Việt Nam" title="Câu chuyện đáng mang theo." description="Ngôn ngữ, món ăn, những nơi chốn và các điều nhỏ khiến Việt Nam gần hơn." /><div className="library-toolbar"><input aria-label="Tìm bài blog" placeholder="⌕ Tìm câu chuyện…" value={search} onChange={event => setSearch(event.target.value)} /></div>{featured && <Link className="blog-feature card" to={`/blog/${featured.id}`}><div className="blog-feature-media"><ContentImage src={featured.coverImage} alt={featured.title} className="figma-art" loading="eager" /></div><div><span className="badge">{featured.categoryName}</span><h2>{featured.title}</h2><p>{featured.summary}</p><span className="text-link">{featured.readTime} · Đọc câu chuyện →</span></div></Link>}<h2>Câu chuyện mới</h2>{articles.length ? <div className="card-grid blog-grid">{articles.map(article => <Link className="card blog-card" key={article.id} to={`/blog/${article.id}`}><ContentImage src={article.coverImage} alt={article.title} className="figma-art" /><div><p className="eyebrow">{article.categoryName}</p><h3>{article.title}</h3><span className="text-link">Đọc câu chuyện →</span></div></Link>)}</div> : <EmptyState title="Không tìm thấy câu chuyện" description="Thử một từ khóa khác." />}</section>;
}
export function BlogDetailPage() {
  const { id } = useParams(); const article = cultureService.getArticle(id); const related = cultureService.getRelatedArticles(id);
  if (!article) return <EmptyState title="Không tìm thấy câu chuyện"><Link className="button" to="/blog">Về Blog</Link></EmptyState>;
  return <article className="blog-detail"><Breadcrumb items={[{ label: 'Blog', to: '/blog' },{ label: article.categoryName }]} /><p className="eyebrow">{article.categoryName} · {article.destinationName}</p><h1>{article.title}</h1><p className="lead">{article.subtitle}</p><p className="muted">{article.author} · {article.publishedDate} · {article.readTime}</p><div className="blog-cover"><ContentImage src={article.coverImage} alt={article.title} className="figma-art" loading="eager" /></div><div className="split-grid"><div><RichText text={article.content} /><div className="ui-notice"><strong>Mang một chút tiếng Việt theo bạn.</strong><p>{article.usefulPhrases?.[0]?.word}</p><Link className="text-link" to={`/culture/${article.id}`}>Nghe và lưu cụm từ hữu ích →</Link></div></div><aside className="card"><p className="eyebrow">Câu chuyện liên quan</p>{related.map(item => <Link className="text-link" key={item.id} to={`/blog/${item.id}`}>{item.title} →</Link>)}</aside></div><div className="story-callout"><p>Một câu hỏi, một từ mới hay một chút luyện tập.</p><Link className="button secondary" to="/ai-tutor">Hỏi AI Tutor</Link></div></article>;
}

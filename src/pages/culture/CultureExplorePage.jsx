import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cultureService } from '@/services/cultureService';
import { PageHeader, Tabs, EmptyState } from '@/components/common/Ui';

export function CultureExplorePage(){
 const[search,setSearch]=useState(''),[selectedCategory,setSelectedCategory]=useState('all'),[selectedDestination,setSelectedDestination]=useState('all');
 const categories=cultureService.getCategories(),destinations=cultureService.getDestinations();
 const articles=cultureService.listArticles({search,category:selectedCategory,destination:selectedDestination});
 const featured=cultureService.getFeaturedArticles()[0];
 return <section className="p4-container culture-page"><PageHeader eyebrow="Nhiều hơn những từ ngữ" title="Khám phá văn hóa Việt Nam" description="Ngôn ngữ trở nên gần gũi khi bạn biết những câu chuyện phía sau."/>{!search&&selectedCategory==='all'&&selectedDestination==='all'&&featured&&<Link className="culture-feature" to={`/culture/${featured.id}`}><ContentImage src={featured.coverImage} alt={featured.title} className="figma-art" loading="eager"/><div><span className="badge">{featured.categoryName}</span><h2>{featured.title}</h2><p>{featured.summary}</p><span>Khám phá câu chuyện →</span></div></Link>}
 <div className="library-toolbar"><Tabs label="Chủ đề văn hóa" value={selectedCategory} onChange={setSelectedCategory} items={categories.map(category=>({id:category.id,label:category.label}))}/><input aria-label="Tìm câu chuyện văn hóa" placeholder="⌕ Tìm câu chuyện…" value={search} onChange={event=>setSearch(event.target.value)}/></div><div className="culture-destination-filter"><label>Điểm đến<select value={selectedDestination} onChange={event=>setSelectedDestination(event.target.value)}>{destinations.map(destination=><option key={destination.id} value={destination.id}>{destination.label}</option>)}</select></label><span className="muted">{articles.length} câu chuyện</span>{(search||selectedCategory!=='all'||selectedDestination!=='all')&&<button className="secondary" onClick={()=>{setSearch('');setSelectedCategory('all');setSelectedDestination('all');}}>Xóa bộ lọc</button>}</div>
 {articles.length?<div className="culture-grid">{articles.map(article=><Link className="card culture-story-card" key={article.id} to={`/culture/${article.id}`}><ContentImage src={article.coverImage} alt={article.title} className="figma-art"/><div><p className="eyebrow">{article.categoryName} · {article.readTime}</p><h3>{article.title}</h3><p>{article.summary}</p><span className="text-link">Khám phá câu chuyện →</span><small>{article.destinationName} · {article.publishedDate}</small></div></Link>)}</div>:<EmptyState title="Không tìm thấy câu chuyện phù hợp" description="Thử một từ khóa, chủ đề hoặc điểm đến khác."/>}</section>;
}

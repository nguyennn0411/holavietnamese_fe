import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cultureService } from '@/services/cultureService';
import { vocabularyService } from '@/services/vocabularyService';
import { aiTutorService } from '@/services/aiTutorService';
import { Breadcrumb, SpeakButton, Notice, EmptyState } from '@/components/common/Ui';
import { RichText } from '@/components/common/RichText';

export function CultureDetailPage(){
 const{id}=useParams();const navigate=useNavigate();const article=cultureService.getArticle(id),relatedArticles=cultureService.getRelatedArticles(id);
 const[toastMessage,setToastMessage]=useState('');
 if(!article)return <EmptyState title="Không tìm thấy bài viết văn hóa"><Link className="button" to="/culture">Về thư viện văn hóa</Link></EmptyState>;
 const showToast=message=>{setToastMessage(message);setTimeout(()=>setToastMessage(''),3500);};
 async function save(phrase){try{await vocabularyService.add({word:phrase.word,meaning:phrase.meaning,notes:`Từ vựng văn hóa: ${article.title} (${phrase.context||''})`});showToast(`Đã lưu “${phrase.word}” vào sổ từ vựng.`);}catch(err){showToast(`Không lưu được từ vựng: ${err.message}`);}}
 function ask(){aiTutorService.createSession('culture_guide',`Tìm hiểu: ${article.title.slice(0,24)}...`);navigate('/ai-tutor');}
 return <article className="culture-detail-page"><Breadcrumb items={[{label:'Văn hóa',to:'/culture'},{label:article.categoryName}]}/><p className="eyebrow">{article.categoryName} · {article.destinationName}</p><h1>{article.title}</h1><p className="lead">{article.subtitle}</p><p className="muted">{article.author} · {article.authorRole} · {article.publishedDate} · {article.readTime}</p>{toastMessage&&<Notice>{toastMessage}</Notice>}<div className="culture-cover"><ContentImage src={article.coverImage} alt={article.title} className="figma-art" loading="eager"/></div><div className="culture-detail-layout"><div><RichText text={article.content}/><section className="culture-phrases"><h2>Những cụm từ hữu ích</h2><p className="muted">Lắng nghe và mang theo những từ mới.</p>{article.usefulPhrases?.map((phrase,index)=><div className="list-row" key={index}><div><strong>{phrase.word}</strong><small>{phrase.pronunciation} · {phrase.meaning}</small>{phrase.context&&<p className="muted">{phrase.context}</p>}</div><div className="actions"><SpeakButton text={phrase.word} audioUrl={phrase.audioUrl}/><button className="secondary" onClick={()=>save(phrase)}>Lưu từ</button></div></div>)}</section><div className="story-callout"><div><h3>Muốn biết thêm về câu chuyện?</h3><p className="muted">Cùng AI Tutor tìm hiểu về văn hóa Việt Nam.</p></div><button onClick={ask}>Hỏi AI Tutor →</button></div></div><aside><section className="card culture-note"><p className="eyebrow">Góc văn hóa</p><h2>Dành một chút thời gian.</h2><p className="muted">Từng câu chuyện nhỏ giúp ngôn ngữ trở nên gần hơn.</p><button className="secondary" onClick={ask}>Hỏi về câu chuyện này</button></section><section className="card"><h2>{article.destinationName}</h2><Link className="text-link" to={article.destination && article.destination !== 'all' ? `/explore/${article.destination}` : '/explore'}>Khám phá điểm đến →</Link></section>{relatedArticles.length>0&&<section className="card"><h2>Câu chuyện liên quan</h2>{relatedArticles.map(related=><Link className="text-link" key={related.id} to={`/culture/${related.id}`}>{related.title} →</Link>)}</section>}</aside></div></article>;
}

import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cultureService } from '@/services/cultureService';
import { vocabularyService } from '@/services/vocabularyService';
import { aiTutorService } from '@/services/aiTutorService';
import { Breadcrumb, SpeakButton, Notice, EmptyState, Artwork } from '@/components/common/Ui';
import { RichText } from '@/components/common/RichText';
import { Clock, MapPin, ArrowLeft, Compass } from 'lucide-react';

export function CultureDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isVi = (i18n?.resolvedLanguage || i18n?.language || 'en').startsWith('vi');
  const article = cultureService.getArticle(id);
  const relatedArticles = cultureService.getRelatedArticles(id);
  const [toastMessage, setToastMessage] = useState('');

  if (!article) {
    return (
      <EmptyState title={bilingualLabel("Không tìm thấy bài viết văn hóa", "Cultural article not found")}>
        <Link className="button" to="/culture">
          <BilingualText vi="Về thư viện văn hóa" en="Back to Culture Library" />
        </Link>
      </EmptyState>
    );
  }

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3500);
  };

  async function save(phrase) {
    try {
      await vocabularyService.add({
        word: phrase.word,
        meaning: phrase.meaning,
        notes: `Từ vựng văn hóa: ${article.title} (${phrase.context || ''})`,
      });
      showToast(bilingualLabel(`Đã lưu “${phrase.word}” vào sổ từ vựng.`, `Saved "${phrase.word}" to vocabulary notebook.`));
    } catch (err) {
      showToast(bilingualLabel(`Không lưu được từ vựng: ${err.message}`, `Failed to save vocabulary: ${err.message}`));
    }
  }

  function ask() {
    aiTutorService.createSession('culture_guide', `Tìm hiểu: ${article.title.slice(0, 24)}...`);
    navigate('/ai-tutor');
  }

  return (
    <article className="culture-detail-page w-full max-w-[1560px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
        <Link
          className="inline-flex items-center gap-1.5 text-[#F97316] font-bold hover:underline transition-colors"
          to="/culture"
        >
          <ArrowLeft size={13} />
          <BilingualText vi="Thư viện văn hóa" en="Culture Library" />
        </Link>
        <span>/</span>
        <span className="text-[#253044] truncate max-w-xs sm:max-w-md">
          <BilingualText vi={article.categoryNameVi || article.categoryName} en={article.categoryNameEn || article.categoryName} />
        </span>
      </nav>

      {/* Article Header Card */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FFF7E8] to-[#FFF0DC] border border-[#E8E5DF] p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#FFF0DC] text-[#F97316] border border-[#F97316]/30 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <BilingualText vi={article.categoryNameVi || article.categoryName} en={article.categoryNameEn || article.categoryName} />
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#EA580C] border border-[#E8E5DF] text-xs font-semibold">
            <MapPin size={12} className="text-[#EA580C]" />
            <BilingualText vi={article.destinationNameVi || article.destinationName} en={article.destinationNameEn || article.destinationName} />
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-[#64748B] font-medium ml-auto">
            <Clock size={13} className="text-[#EA580C]" />
            <BilingualText vi={article.readTimeVi || article.readTime} en={article.readTimeEn || article.readTime} />
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#253044] tracking-tight leading-tight">
          <BilingualText vi={article.titleVi || article.title} en={article.titleEn || article.title} />
        </h1>

        <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-3xl">
          <BilingualText vi={article.subtitleVi || article.subtitle} en={article.subtitleEn || article.subtitle} />
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#64748B] border-t border-[#E8E5DF]/50">
          <span className="font-bold text-[#253044]">{article.author}</span>
          <span>•</span>
          <span><BilingualText vi={article.authorRoleVi || article.authorRole} en={article.authorRoleEn || article.authorRole} /></span>
          <span>•</span>
          <span><BilingualText vi="Ngày đăng:" en="Published:" /> {article.publishedDate}</span>
        </div>
      </header>

      {toastMessage && <Notice>{toastMessage}</Notice>}

      {/* Main Cover Photo */}
      <div className="culture-cover w-full aspect-video max-h-[460px] rounded-3xl overflow-hidden shadow-md border border-[#E8E5DF] bg-white">
        <ContentImage
          src={article.coverImage}
          alt={article.title}
          className="figma-art w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Content Layout (Article + Sidebar) */}
      <div className="culture-detail-layout grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Body */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 sm:p-10 shadow-xs">
            <RichText text={isVi ? (article.contentVi || article.content) : (article.contentEn || article.content)} />
          </div>

          {/* Useful Phrases Box */}
          {article.usefulPhrases?.length > 0 && (
            <section className="culture-phrases bg-white rounded-3xl border border-[#E8E5DF] p-6 sm:p-8 shadow-xs space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg sm:text-xl font-black text-[#253044]">
                    <BilingualText>{"Những cụm từ văn hóa hữu ích"}</BilingualText>
                  </h2>
                </div>
                <p className="text-xs text-[#64748B]">
                  <BilingualText>{"Lắng nghe phát âm chuẩn và lưu vào sổ từ để ôn tập sau."}</BilingualText>
                </p>
              </div>

              <div className="space-y-3">
                {article.usefulPhrases.map((phrase, index) => (
                  <div
                    className="list-row flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFF7E8] border border-[#E8E5DF]/60 hover:border-[#FFCD00] transition-colors"
                    key={index}
                  >
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <strong className="text-base font-black text-[#FF7A00]">{phrase.word}</strong>
                        <small className="text-xs text-[#64748B] font-mono">{phrase.pronunciation}</small>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[#253044]">
                        = {phrase.meaning}
                      </div>
                      {phrase.context && (
                        <p className="muted text-xs text-[#64748B] italic">{phrase.context}</p>
                      )}
                    </div>

                    <div className="actions flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <SpeakButton text={phrase.word} audioUrl={phrase.audioUrl} />
                      <button
                        className="secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF7E8] text-[#253044] border border-[#E8E5DF] text-xs font-semibold shadow-xs transition-all"
                        onClick={() => save(phrase)}
                      >
                        <BilingualText>{"Lưu từ"}</BilingualText>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ask AI Tutor Callout */}
          <div className="story-callout rounded-3xl bg-gradient-to-r from-[#FFF2D6] via-[#FFEEC9] to-[#FFF7E8] border border-[#FFCD00] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-black text-[#253044] flex items-center justify-center sm:justify-start gap-2">
                <BilingualText>{"Muốn tìm hiểu sâu hơn về câu chuyện này?"}</BilingualText>
              </h3>
              <p className="muted text-xs sm:text-sm text-[#64748B]">
                <BilingualText>{"Cùng AI Tutor trò chuyện, giải đáp thắc mắc phong tục và tập quán Việt Nam."}</BilingualText>
              </p>
            </div>
            <button
              onClick={ask}
              className="px-5 py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              <BilingualText>{"Hỏi AI Tutor →"}</BilingualText>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Cultural Tip Card */}
          <section className="card culture-note bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-3">
            <p className="eyebrow text-xs font-bold text-[#FF7A00] uppercase tracking-wider">
              <BilingualText>{"Góc văn hóa"}</BilingualText>
            </p>
            <h2 className="text-lg font-black text-[#253044] leading-snug">
              <BilingualText>{"Dành một chút thời gian."}</BilingualText>
            </h2>
            <p className="muted text-xs text-[#64748B] leading-relaxed">
              <BilingualText>{"Từng câu chuyện nhỏ giúp ngôn ngữ trở nên gần gũi và sâu sắc hơn."}</BilingualText>
            </p>
            <button
              className="secondary w-full py-2.5 px-4 rounded-xl bg-[#FFF7E8] hover:bg-[#FFEEC9] text-[#253044] border border-[#E8E5DF] font-bold text-xs transition-all"
              onClick={ask}
            >
              <BilingualText>{"Hỏi về câu chuyện này"}</BilingualText>
            </button>
          </section>

          {/* Destination Connection */}
          <section className="card bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-[#FF7A00]" />
              <h2 className="text-base font-black text-[#253044]">
                <BilingualText vi={article.destinationNameVi || article.destinationName} en={article.destinationNameEn || article.destinationName} />
              </h2>
            </div>
            <p className="text-xs text-[#64748B]">
              <BilingualText
                vi="Khám phá vùng đất và những nét văn hóa địa phương đặc trưng."
                en="Explore the land and unique local cultural characteristics."
              />
            </p>
            <Link
              className="text-link inline-flex items-center gap-1 text-xs font-bold text-[#FF7A00] hover:underline"
              to={article.destination && article.destination !== 'all' ? `/explore/${article.destination}` : '/explore'}
            >
              <BilingualText>{"Khám phá điểm đến →"}</BilingualText>
            </Link>
          </section>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="card bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#253044] flex items-center gap-2">
                <Compass size={16} className="text-[#EA580C]" />
                <BilingualText>{"Câu chuyện liên quan"}</BilingualText>
              </h2>
              <div className="space-y-2.5">
                {relatedArticles.map(related => (
                  <Link
                    className="group block p-3 rounded-xl bg-[#FFF7E8]/70 hover:bg-[#FFF7E8] border border-[#E8E5DF]/40 hover:border-[#E8E5DF] transition-all"
                    key={related.id}
                    to={`/culture/${related.id}`}
                  >
                    <span className="text-xs font-bold text-[#253044] group-hover:text-[#FF7A00] transition-colors line-clamp-2">
                      <BilingualText vi={related.titleVi || related.title} en={related.title} /> →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}

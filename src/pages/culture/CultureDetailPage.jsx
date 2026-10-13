import { BilingualText } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cultureService } from '@/services/cultureService';
import { vocabularyService } from '@/services/vocabularyService';
import { aiTutorService } from '@/services/aiTutorService';
import { Breadcrumb, SpeakButton, Notice, EmptyState, Artwork } from '@/components/common/Ui';
import { RichText } from '@/components/common/RichText';
import {
  Sparkles,
  Clock,
  MapPin,
  Bookmark,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Volume2,
  BookOpen,
  Compass
} from 'lucide-react';

export function CultureDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = cultureService.getArticle(id);
  const relatedArticles = cultureService.getRelatedArticles(id);
  const [toastMessage, setToastMessage] = useState('');

  if (!article) {
    return (
      <EmptyState title="Không tìm thấy bài viết văn hóa">
        <Link className="button" to="/culture">
          <BilingualText>{"Về thư viện văn hóa"}</BilingualText>
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
      showToast(`Đã lưu “${phrase.word}” vào sổ từ vựng.`);
    } catch (err) {
      showToast(`Không lưu được từ vựng: ${err.message}`);
    }
  }

  function ask() {
    aiTutorService.createSession('culture_guide', `Tìm hiểu: ${article.title.slice(0, 24)}...`);
    navigate('/ai-tutor');
  }

  return (
    <article className="culture-detail-page w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#78685B]">
        <Link
          className="inline-flex items-center gap-1.5 text-[#DA251D] hover:underline transition-colors"
          to="/culture"
        >
          <ArrowLeft size={13} />
          <BilingualText>{"Thư viện văn hóa"}</BilingualText>
        </Link>
        <span>/</span>
        <span className="text-[#431914] truncate max-w-xs sm:max-w-md">
          {article.categoryName}
        </span>
      </nav>

      {/* Article Header Card */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9EE] via-[#F7F0E3] to-[#EEE3D1] border border-[#DECBB4] p-6 sm:p-10 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge px-3 py-1 rounded-full bg-[#24382B] text-[#FFF9EE] text-xs font-bold uppercase tracking-wider shadow-xs">
            {article.categoryName}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#A62A24] border border-[#DECBB4] text-xs font-semibold">
            <MapPin size={12} className="text-[#A62A24]" />
            {article.destinationName}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-[#78685B] font-medium ml-auto">
            <Clock size={13} className="text-[#A62A24]" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#431914] tracking-tight leading-tight">
          <BilingualText vi={article.titleVi || article.title} en={article.title} />
        </h1>

        <p className="text-sm sm:text-base text-[#78685B] leading-relaxed max-w-3xl">
          {article.subtitle}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#78685B] border-t border-[#DECBB4]/50">
          <span className="font-bold text-[#431914]">{article.author}</span>
          <span>•</span>
          <span>{article.authorRole}</span>
          <span>•</span>
          <span>Ngày đăng: {article.publishedDate}</span>
        </div>
      </header>

      {toastMessage && <Notice>{toastMessage}</Notice>}

      {/* Main Cover Photo */}
      <div className="culture-cover w-full aspect-video max-h-[460px] rounded-3xl overflow-hidden shadow-md border border-[#DECBB4] bg-white">
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
          <div className="bg-white rounded-3xl border border-[#DECBB4] p-6 sm:p-10 shadow-xs">
            <RichText text={article.content} />
          </div>

          {/* Useful Phrases Box */}
          {article.usefulPhrases?.length > 0 && (
            <section className="culture-phrases bg-white rounded-3xl border border-[#DECBB4] p-6 sm:p-8 shadow-xs space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={20} className="text-[#DA251D]" />
                  <h2 className="text-lg sm:text-xl font-black text-[#431914]">
                    <BilingualText>{"Những cụm từ văn hóa hữu ích"}</BilingualText>
                  </h2>
                </div>
                <p className="text-xs text-[#78685B]">
                  <BilingualText>{"Lắng nghe phát âm chuẩn và lưu vào sổ từ để ôn tập sau."}</BilingualText>
                </p>
              </div>

              <div className="space-y-3">
                {article.usefulPhrases.map((phrase, index) => (
                  <div
                    className="list-row flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFF9EE] border border-[#DECBB4]/60 hover:border-[#FFCD00] transition-colors"
                    key={index}
                  >
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <strong className="text-base font-black text-[#DA251D]">{phrase.word}</strong>
                        <small className="text-xs text-[#78685B] font-mono">{phrase.pronunciation}</small>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[#431914]">
                        = {phrase.meaning}
                      </div>
                      {phrase.context && (
                        <p className="muted text-xs text-[#78685B] italic">{phrase.context}</p>
                      )}
                    </div>

                    <div className="actions flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <SpeakButton text={phrase.word} audioUrl={phrase.audioUrl} />
                      <button
                        className="secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF9EE] text-[#431914] border border-[#DECBB4] text-xs font-semibold shadow-xs transition-all"
                        onClick={() => save(phrase)}
                      >
                        <Bookmark size={13} className="text-[#DA251D]" />
                        <BilingualText>{"Lưu từ"}</BilingualText>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ask AI Tutor Callout */}
          <div className="story-callout rounded-3xl bg-gradient-to-r from-[#FFF2D6] via-[#FFEEC9] to-[#FFF9EE] border border-[#FFCD00] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-black text-[#431914] flex items-center justify-center sm:justify-start gap-2">
                <Sparkles size={18} className="text-[#DA251D]" />
                <BilingualText>{"Muốn tìm hiểu sâu hơn về câu chuyện này?"}</BilingualText>
              </h3>
              <p className="muted text-xs sm:text-sm text-[#78685B]">
                <BilingualText>{"Cùng AI Tutor trò chuyện, giải đáp thắc mắc phong tục và tập quán Việt Nam."}</BilingualText>
              </p>
            </div>
            <button
              onClick={ask}
              className="px-5 py-3 rounded-2xl bg-[#DA251D] hover:bg-[#B71C1C] text-white font-black text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              <BilingualText>{"Hỏi AI Tutor →"}</BilingualText>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Cultural Tip Card */}
          <section className="card culture-note bg-white rounded-3xl border border-[#DECBB4] p-6 shadow-xs space-y-3">
            <p className="eyebrow text-xs font-bold text-[#DA251D] uppercase tracking-wider">
              <BilingualText>{"Góc văn hóa"}</BilingualText>
            </p>
            <h2 className="text-lg font-black text-[#431914] leading-snug">
              <BilingualText>{"Dành một chút thời gian."}</BilingualText>
            </h2>
            <p className="muted text-xs text-[#78685B] leading-relaxed">
              <BilingualText>{"Từng câu chuyện nhỏ giúp ngôn ngữ trở nên gần gũi và sâu sắc hơn."}</BilingualText>
            </p>
            <button
              className="secondary w-full py-2.5 px-4 rounded-xl bg-[#FFF9EE] hover:bg-[#FFEEC9] text-[#431914] border border-[#DECBB4] font-bold text-xs transition-all"
              onClick={ask}
            >
              <BilingualText>{"Hỏi về câu chuyện này"}</BilingualText>
            </button>
          </section>

          {/* Destination Connection */}
          <section className="card bg-white rounded-3xl border border-[#DECBB4] p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-[#DA251D]" />
              <h2 className="text-base font-black text-[#431914]">{article.destinationName}</h2>
            </div>
            <p className="text-xs text-[#78685B]">
              Khám phá vùng đất và những nét văn hóa địa phương đặc trưng.
            </p>
            <Link
              className="text-link inline-flex items-center gap-1 text-xs font-bold text-[#DA251D] hover:underline"
              to={article.destination && article.destination !== 'all' ? `/explore/${article.destination}` : '/explore'}
            >
              <BilingualText>{"Khám phá điểm đến →"}</BilingualText>
            </Link>
          </section>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="card bg-white rounded-3xl border border-[#DECBB4] p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#431914] flex items-center gap-2">
                <Sparkles size={16} className="text-[#FFCD00]" />
                <BilingualText>{"Câu chuyện liên quan"}</BilingualText>
              </h2>
              <div className="space-y-2.5">
                {relatedArticles.map(related => (
                  <Link
                    className="group block p-3 rounded-xl bg-[#FFF9EE]/70 hover:bg-[#FFF9EE] border border-[#DECBB4]/40 hover:border-[#DECBB4] transition-all"
                    key={related.id}
                    to={`/culture/${related.id}`}
                  >
                    <span className="text-xs font-bold text-[#431914] group-hover:text-[#DA251D] transition-colors line-clamp-2">
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

import { BilingualText, bilingualLabel, useBilingualLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cultureService } from '@/services/cultureService';
import { PageHeader, EmptyState, Breadcrumb } from '@/components/common/Ui';
import { RichText } from '@/components/common/RichText';
import { useTranslation } from 'react-i18next';

export function BlogHomePage() {
  const { i18n } = useTranslation();
  const isVi = (i18n?.resolvedLanguage || i18n?.language || 'vi').startsWith('vi');
  const bLabel = useBilingualLabel();
  const [search, setSearch] = useState('');
  const articles = cultureService.listArticles({ search });
  const featured = articles[0];

  return (
    <section>
      <PageHeader
        eyebrow={<BilingualText vi="Những câu chuyện từ Việt Nam" en="Stories from Vietnam" />}
        title={<BilingualText vi="Câu chuyện đáng mang theo." en="Stories worth taking along." />}
        description={<BilingualText vi="Ngôn ngữ, món ăn, những nơi chốn và các điều nhỏ khiến Việt Nam gần hơn." en="Language, cuisine, places, and small things that bring Vietnam closer." />}
      />

      <div className="library-toolbar">
        <input
          aria-label={bLabel("Tìm bài blog", "Search blog articles")}
          placeholder={bLabel("⌕ Tìm câu chuyện…", "⌕ Search stories…")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {featured && (
        <Link className="blog-feature card" to={`/blog/${featured.id}`}>
          <div className="blog-feature-media">
            <ContentImage
              src={featured.coverImage}
              alt={isVi ? (featured.titleVi || featured.title) : (featured.titleEn || featured.title)}
              className="figma-art"
              loading="eager"
            />
          </div>
          <div>
            <span className="badge">
              <BilingualText
                vi={featured.categoryNameVi || featured.categoryName}
                en={featured.categoryNameEn || featured.categoryName}
              />
            </span>
            <h2>
              <BilingualText vi={featured.titleVi || featured.title} en={featured.titleEn || featured.title} />
            </h2>
            <p>
              {isVi ? (featured.summaryVi || featured.summary) : (featured.summaryEn || featured.summary)}
            </p>
            <span className="text-link">
              {isVi ? (featured.readTimeVi || featured.readTime) : (featured.readTimeEn || featured.readTime)}{' '}
              <BilingualText vi="· Đọc câu chuyện →" en="· Read story →" />
            </span>
          </div>
        </Link>
      )}

      <h2>
        <BilingualText vi="Câu chuyện mới" en="Latest stories" />
      </h2>

      {articles.length ? (
        <div className="card-grid blog-grid">
          {articles.map((article) => (
            <Link className="card blog-card" key={article.id} to={`/blog/${article.id}`}>
              <ContentImage
                src={article.coverImage}
                alt={isVi ? (article.titleVi || article.title) : (article.titleEn || article.title)}
                className="figma-art"
              />
              <div>
                <p className="eyebrow">
                  <BilingualText
                    vi={article.categoryNameVi || article.categoryName}
                    en={article.categoryNameEn || article.categoryName}
                  />
                </p>
                <h3>
                  <BilingualText vi={article.titleVi || article.title} en={article.titleEn || article.title} />
                </h3>
                <span className="text-link">
                  <BilingualText vi="Đọc câu chuyện →" en="Read story →" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title={bLabel("Không tìm thấy câu chuyện", "No stories found")}
          description={bLabel("Thử một từ khóa khác.", "Try another keyword.")}
        />
      )}
    </section>
  );
}

export function BlogDetailPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const isVi = (i18n?.resolvedLanguage || i18n?.language || 'vi').startsWith('vi');
  const bLabel = useBilingualLabel();
  const article = cultureService.getArticle(id);
  const related = cultureService.getRelatedArticles(id);

  if (!article) {
    return (
      <EmptyState title={bLabel("Không tìm thấy câu chuyện", "No stories found")}>
        <Link className="button" to="/blog">
          <BilingualText vi="Về Blog" en="Back to Blog" />
        </Link>
      </EmptyState>
    );
  }

  const categoryName = isVi
    ? (article.categoryNameVi || article.categoryName)
    : (article.categoryNameEn || article.categoryName);
  const destinationName = isVi
    ? (article.destinationNameVi || article.destinationName)
    : (article.destinationNameEn || article.destinationName);
  const subtitle = isVi
    ? (article.subtitleVi || article.subtitle)
    : (article.subtitleEn || article.subtitle);
  const readTime = isVi
    ? (article.readTimeVi || article.readTime)
    : (article.readTimeEn || article.readTime);
  const content = isVi
    ? (article.contentVi || article.content)
    : (article.contentEn || article.content);

  return (
    <article className="blog-detail">
      <Breadcrumb
        items={[
          { label: 'Blog', to: '/blog' },
          { label: categoryName },
        ]}
      />
      <p className="eyebrow">
        {categoryName} {destinationName ? `· ${destinationName}` : ''}
      </p>
      <h1>
        <BilingualText vi={article.titleVi || article.title} en={article.titleEn || article.title} />
      </h1>
      {subtitle && <p className="lead">{subtitle}</p>}
      <p className="muted">
        {article.author} · {article.publishedDate} · {readTime}
      </p>

      <div className="blog-cover">
        <ContentImage
          src={article.coverImage}
          alt={isVi ? (article.titleVi || article.title) : (article.titleEn || article.title)}
          className="figma-art"
          loading="eager"
        />
      </div>

      <div className="split-grid">
        <div>
          <RichText text={content} />
          <div className="ui-notice">
            <strong>
              <BilingualText vi="Mang một chút tiếng Việt theo bạn." en="Take a bit of Vietnamese with you." />
            </strong>
            <p>{article.usefulPhrases?.[0]?.word}</p>
            <Link className="text-link" to={`/culture/${article.id}`}>
              <BilingualText vi="Nghe và lưu cụm từ hữu ích →" en="Listen and save useful phrases →" />
            </Link>
          </div>
        </div>

        <aside className="card">
          <p className="eyebrow">
            <BilingualText vi="Câu chuyện liên quan" en="Related stories" />
          </p>
          {related.map((item) => (
            <Link className="text-link" key={item.id} to={`/blog/${item.id}`}>
              <BilingualText vi={item.titleVi || item.title} en={item.titleEn || item.title} /> →
            </Link>
          ))}
        </aside>
      </div>

      <div className="story-callout">
        <p>
          <BilingualText
            vi="Một câu hỏi, một từ mới hay một chút luyện tập."
            en="A question, a new word, or a little practice."
          />
        </p>
        <Link className="button secondary" to="/ai-tutor">
          <BilingualText vi="Hỏi AI Tutor" en="Ask AI Tutor" />
        </Link>
      </div>
    </article>
  );
}

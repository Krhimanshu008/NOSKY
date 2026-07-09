import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import ArticleClient from './ArticleClient';
import cache, { CACHE_TTL, CACHE_KEYS } from '@/lib/cache';

// ISR: rebuild individual articles every 5 minutes
export const revalidate = 300;

// Pre-generate the most recent articles at build time
export async function generateStaticParams() {
  try {
    const db = await getDb();
    const articles = await db.all(
      "SELECT slug FROM Article WHERE published = 1 AND category = 'article' ORDER BY createdAt DESC LIMIT 20"
    );
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

async function getArticleBySlug(slug) {
  const cacheKey = CACHE_KEYS.articleBySlug(slug);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  const article = await db.get('SELECT * FROM Article WHERE slug = ?', [slug]);

  if (article) {
    cache.set(cacheKey, article, CACHE_TTL.ARTICLE_DETAIL);
  }
  return article;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | NoSky`,
    description: article.metaDescription || article.content.substring(0, 160),
    keywords: article.metaKeywords,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
      publishedTime: new Date(article.createdAt).toISOString(),
      modifiedTime: new Date(article.updatedAt).toISOString(),
    }
  };
}

export default async function ArticleSinglePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.coverImage ? [article.coverImage] : [],
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    contentLocation: {
      '@type': 'Place',
      name: article.geoRegion || article.cityLocation || 'Global'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClient article={article} />
    </>
  );
}

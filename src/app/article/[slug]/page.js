import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import ArticleClient from './ArticleClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const db = await getDb();
  const article = await db.get('SELECT * FROM Article WHERE slug = ?', [slug]);

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
  const db = await getDb();
  const article = await db.get('SELECT * FROM Article WHERE slug = ?', [slug]);

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

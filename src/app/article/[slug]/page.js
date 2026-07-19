import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import ArticleClient from './ArticleClient';
import { verifyAuth } from '@/lib/auth';

// ISR: rebuild individual articles every 5 minutes
export const revalidate = 300;

// Pre-generate the most recent articles at build time
export async function generateStaticParams() {
  try {
    const collection = await getDb();
    const articles = await collection.find({ published: 1, category: 'article' }).sort({ createdAt: -1 }).limit(20).project({ slug: 1 }).toArray();
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

async function getArticleBySlug(slug) {
  const collection = await getDb();
  return await collection.findOne({ slug }, { projection: { _id: 0 } });
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

  if (!article) {
    notFound();
  }

  if (!article.published) {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      notFound();
    }
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

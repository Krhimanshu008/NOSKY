import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import ArticleClient from './ArticleClient';
import { verifyAuth } from '@/lib/auth';
import JsonLdScript from '@/components/seo/JsonLdScript';
import { getArticleSchema } from '@/lib/schema';

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

const getArticleBySlug = cache(async (slug) => {
  try {
    const collection = await getDb();
    return await collection.findOne({ slug }, { projection: { _id: 0 } });
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | NoSky Knowledge Hub`,
    description: article.metaDescription || article.content.substring(0, 160),
    keywords: article.metaKeywords,
    alternates: {
      canonical: `https://nosky.io/article/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      images: article.coverImage ? [article.coverImage] : ['/og-image.png'],
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

  const jsonLd = getArticleSchema(article);

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ArticleClient article={article} />
    </>
  );
}

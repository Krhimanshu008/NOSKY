import { getDb } from '@/lib/db';

const BASE_URL = 'https://nosky.io';

export default async function sitemap() {
  // Static pages with their priorities
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/security`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/testimonials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/article`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/achievements`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    // Product pages
    { url: `${BASE_URL}/product/nosky-backup-pro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/product/nosky-crm`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/product/nosky-manage`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/product/nosky-finvault`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Dynamic pages from database
  let articlePages = [];
  try {
    const db = await getDb();
    const articles = await db.all(
      "SELECT slug, category, updatedAt FROM Article WHERE published = 1 ORDER BY createdAt DESC"
    );

    articlePages = articles.map((article) => {
      const prefix = article.category === 'achievement' ? 'achievement' : 'article';
      return {
        url: `${BASE_URL}/${prefix}/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return [...staticPages, ...articlePages];
}

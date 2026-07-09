import Link from 'next/link';
import { getDb } from '@/lib/db';
import { format } from 'date-fns';
import cache, { CACHE_TTL, CACHE_KEYS } from '@/lib/cache';
import FadeImage from '@/components/ui/FadeImage';

// ISR: rebuild this page at most every 60 seconds
export const revalidate = 60;

export const metadata = {
  title: 'Articles & Blog | NoSky Cloud Backup',
  description: 'Read the latest insights on cloud backup, ransomware protection, and data security from the NoSky team.',
};

async function getArticles() {
  const cacheKey = CACHE_KEYS.articlesList();
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const collection = await getDb();
  const articles = await collection.find({ published: 1, category: 'article' }).project({ _id: 0 }).sort({ createdAt: -1 }).toArray();

  cache.set(cacheKey, articles, CACHE_TTL.ARTICLES_LIST);
  return articles;
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="container" style={{ padding: 'var(--space-12) 0', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
        <h1 style={{ marginTop: 'var(--space-4)' }}>Latest Articles</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', maxWidth: '600px', margin: 'var(--space-4) auto 0' }}>
          Insights on data protection, disaster recovery, and navigating compliance changes.
        </p>
      </div>

      {articles.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No articles published yet.</p>
      ) : (
        <div className="grid grid-3">
          {articles.map(article => (
            <Link key={article.id} href={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {article.coverImage && (
                  <div style={{ height: '200px', position: 'relative', margin: 'calc(var(--space-6) * -1) calc(var(--space-6) * -1) var(--space-4)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <FadeImage
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                )}
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>{article.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', flex: 1, marginBottom: 'var(--space-4)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {article.metaDescription || article.content.substring(0, 120) + '...'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

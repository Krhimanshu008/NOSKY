import Link from 'next/link';
import { getDb } from '@/lib/db';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Achievements | NoSky Cloud Backup',
  description: 'Read the latest milestones and achievements from the NoSky team.',
};

export default async function AchievementsPage() {
  const db = await getDb();
  
  const articles = await db.all("SELECT * FROM Article WHERE published = 1 AND category = 'achievement' ORDER BY createdAt DESC");

  return (
    <div className="container" style={{ padding: 'var(--space-12) 0', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
        <h1 style={{ marginTop: 'var(--space-4)' }}>Our Achievements</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', maxWidth: '600px', margin: 'var(--space-4) auto 0' }}>
          Milestones, partnerships, and recognitions for our commitment to data protection.
        </p>
      </div>

      {articles.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No achievements published yet.</p>
      ) : (
        <div className="grid grid-3">
          {articles.map(article => (
            <Link key={article.id} href={`/achievement/${article.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {article.coverImage && (
                  <div style={{ height: '200px', background: `url(${article.coverImage}) center/cover no-repeat`, margin: 'calc(var(--space-6) * -1) calc(var(--space-6) * -1) var(--space-4)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }} />
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

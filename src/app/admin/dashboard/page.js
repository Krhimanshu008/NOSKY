'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles?all=true');
      if (res.status === 401) {
        router.push('/admin');
        return;
      }
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error('Failed to fetch articles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArticles();
      } else {
        alert('Failed to delete article');
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  if (loading) {
    return <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: 'var(--space-12)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <h1>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Link href="/admin/editor" className="btn btn-primary">
            + New Article
          </Link>
          <button onClick={handleLogout} className="btn btn-ghost">
            Logout
          </button>
        </div>
      </div>

      <div className="card">
        {articles.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-8) 0' }}>
            No articles found. Create one to get started!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {articles.map(article => (
              <div key={article.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{article.title}</h3>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    <span>Status: {article.published ? <span style={{ color: 'var(--color-success)' }}>Published</span> : <span style={{ color: 'var(--color-accent)' }}>Draft</span>}</span>
                    <span>Date: {new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Link href={`/admin/editor/${article.id}`} className="btn btn-secondary btn-sm">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(article.id)} className="btn btn-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-accent)' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

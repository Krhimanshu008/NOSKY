'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ArticleEditor({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaDescription: '',
    metaKeywords: '',
    coverImage: '',
    geoRegion: '',
    cityLocation: '',
    published: false
  });

  useEffect(() => {
    // We unwrap params properly in Next.js 15+ if needed, but for simple client fetch we can just check if params.id exists
    // However, this is a shared component, we need to handle the unwrapping carefully.
    async function init() {
      const p = await params;
      if (p?.id) {
        setIsEditing(true);
        fetchArticle(p.id);
      }
    }
    init();
  }, [params]);

  const fetchArticle = async (id) => {
    try {
      const res = await fetch('/api/articles?all=true');
      const data = await res.json();
      const article = data.find(a => a.id === id);
      if (article) {
        setFormData(article);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const p = await params;
      const url = isEditing ? `/api/articles/${p.id}` : '/api/articles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Failed to save article');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: 'var(--space-8)', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1>{isEditing ? 'Edit Article' : 'New Article'}</h1>
        <Link href="/admin/dashboard" className="btn btn-ghost">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Slug (Auto-generated if empty)</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Content (Markdown) *</label>
          <textarea name="content" value={formData.content} onChange={handleChange} required rows={15} style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Cover Image URL</label>
            <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <hr style={{ borderColor: 'var(--color-border)', margin: 'var(--space-4) 0' }} />
        <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)' }}>SEO & GEO Optimization</h3>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Meta Description</label>
          <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={2} style={inputStyle} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Meta Keywords (Comma separated)</label>
          <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Geo Region (e.g. India, Middle East)</label>
            <input type="text" name="geoRegion" value={formData.geoRegion} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>City Location (e.g. Mumbai, Dubai)</label>
            <input type="text" name="cityLocation" value={formData.cityLocation} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <input type="checkbox" id="published" name="published" checked={formData.published} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
          <label htmlFor="published" style={{ fontSize: 'var(--text-base)' }}>Publish immediately</label>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-4)' }}>
          {loading ? 'Saving...' : 'Save Article'}
        </button>
      </form>
    </div>
  );
}

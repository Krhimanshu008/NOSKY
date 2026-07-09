'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FadeImage from '@/components/ui/FadeImage';

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'published', 'draft'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'article', 'achievement'
  const [selectedItems, setSelectedItems] = useState([]);
  
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
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArticles();
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedItems.length) return;
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} posts?`)) return;
    
    // In a real app, you'd have a bulk delete API. Here we just delete sequentially.
    try {
      await Promise.all(selectedItems.map(id => 
        fetch(`/api/articles/${id}`, { method: 'DELETE' })
      ));
      setSelectedItems([]);
      fetchArticles();
    } catch (err) {
      console.error('Bulk delete error', err);
      alert('Some posts failed to delete.');
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredArticles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredArticles.map(a => a.id));
    }
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Search
      const matchesSearch = !searchQuery || 
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        article.category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'published' && article.published) ||
        (filterStatus === 'draft' && !article.published);
        
      // Category
      const articleCat = article.category?.toLowerCase() || 'article';
      const matchesCategory = filterCategory === 'all' || articleCat === filterCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [articles, searchQuery, filterStatus, filterCategory]);

  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter(a => a.published).length;
    const drafts = total - published;
    const achievements = articles.filter(a => a.category?.toLowerCase() === 'achievement').length;
    return { total, published, drafts, achievements };
  }, [articles]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', background: '#05070a' }}>
        <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', width: '24px', height: '24px' }} />
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* ━━━ SIDEBAR ━━━ */}
      <aside className="admin-sidebar">
        <div style={{ padding: 'var(--space-2) var(--space-4)', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-accent)' }}>
            NoSky<span style={{ color: 'var(--color-text-primary)' }}>Admin</span>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Link href="/admin/dashboard" className="admin-nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </Link>
          <Link href="/admin/editor" className="admin-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Create Post
          </Link>
          
          <div style={{ margin: 'var(--space-6) 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}></div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 var(--space-4) var(--space-2)' }}>Future Features</div>
          
          <div className="admin-nav-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Media Library
          </div>
          <div className="admin-nav-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Analytics
          </div>
          <div className="admin-nav-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Settings
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <Link href="/" className="admin-nav-item" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* ━━━ MAIN CONTENT ━━━ */}
      <main className="admin-main">
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>Content Dashboard</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Manage your articles, achievements, and site content.</p>
          </div>
          <Link href="/admin/editor" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Post
          </Link>
        </div>

        {/* STATS ROW */}
        <div className="grid-4" style={{ gap: 'var(--space-4)' }}>
          <div className="admin-glass-panel">
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Total Posts</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.total}</div>
          </div>
          <div className="admin-glass-panel">
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Published</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-success)' }}>{stats.published}</div>
          </div>
          <div className="admin-glass-panel">
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Drafts</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-warning)' }}>{stats.drafts}</div>
          </div>
          <div className="admin-glass-panel">
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Achievements</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-blue)' }}>{stats.achievements}</div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="admin-glass-panel" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                type="text" 
                placeholder="Search posts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', color: '#fff', 
                  padding: '8px 12px 8px 36px', borderRadius: 'var(--radius-md)', outline: 'none', width: '250px' 
                }}
              />
            </div>
            
            {/* Filters */}
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', color: '#fff', padding: '8px 12px', borderRadius: 'var(--radius-md)', outline: 'none' }}
            >
              <option value="all">All Status</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>

            <select 
              value={filterCategory} 
              onChange={e => setFilterCategory(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', color: '#fff', padding: '8px 12px', borderRadius: 'var(--radius-md)', outline: 'none' }}
            >
              <option value="all">All Categories</option>
              <option value="article">Articles</option>
              <option value="achievement">Achievements</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            {selectedItems.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '8px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete Selected ({selectedItems.length})
              </button>
            )}

            {/* View Toggle */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <button 
                onClick={() => setViewMode('list')} 
                style={{ background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: viewMode === 'list' ? '#fff' : 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
              <button 
                onClick={() => setViewMode('grid')} 
                style={{ background: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: viewMode === 'grid' ? '#fff' : 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        {filteredArticles.length === 0 ? (
          <div className="admin-glass-panel" style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ width: '64px', height: '64px', margin: '0 auto 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontWeight: '600' }}>No posts found</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>Adjust your search or filters, or create a new post.</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="admin-glass-panel admin-table-container" style={{ padding: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input type="checkbox" checked={selectedItems.length === filteredArticles.length} onChange={toggleSelectAll} style={{ cursor: 'pointer' }} />
                  </th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map(article => {
                  const cat = article.category?.toLowerCase() || 'article';
                  return (
                    <tr key={article.id}>
                      <td>
                        <input type="checkbox" checked={selectedItems.includes(article.id)} onChange={() => toggleSelect(article.id)} style={{ cursor: 'pointer' }} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {article.coverImage ? (
                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: `url(${article.coverImage}) center/cover` }}></div>
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            </div>
                          )}
                          <Link href={`/admin/editor/${article.id}`} style={{ fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
                            {article.title}
                          </Link>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                          background: cat === 'achievement' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 166, 35, 0.1)',
                          color: cat === 'achievement' ? '#60a5fa' : '#fbbf24',
                          border: `1px solid ${cat === 'achievement' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 166, 35, 0.2)'}`
                        }}>
                          {cat}
                        </span>
                      </td>
                      <td>
                        {article.published ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#34d399' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }}></span> Published
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}></span> Draft
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                        {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <Link href={cat === 'achievement' ? `/achievement/${article.slug}` : `/article/${article.slug}`} target="_blank" style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#fff', display: 'flex' }} title="View Post">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </Link>
                          <Link href={`/admin/editor/${article.id}`} style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#fff', display: 'flex' }} title="Edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </Link>
                          <button onClick={() => handleDelete(article.id)} style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '4px', color: '#f87171', cursor: 'pointer', display: 'flex' }} title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid-3" style={{ gap: 'var(--space-6)' }}>
            {filteredArticles.map(article => {
              const cat = article.category?.toLowerCase() || 'article';
              return (
                <div key={article.id} className="admin-glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '160px', position: 'relative', background: 'rgba(255,255,255,0.02)' }}>
                    {article.coverImage ? (
                      <FadeImage src={article.coverImage} alt={article.title} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                    )}
                    
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', backdropFilter: 'blur(10px)',
                        background: cat === 'achievement' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(245, 166, 35, 0.4)',
                        color: '#fff', border: '1px solid rgba(255,255,255,0.2)'
                      }}>
                        {cat}
                      </span>
                    </div>

                    {/* Gradient Overlay */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 var(--space-2) 0', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {article.title}
                    </h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', fontSize: '12px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {article.published ? (
                        <span style={{ color: '#34d399', fontWeight: 500 }}>Published</span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Draft</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/admin/editor/${article.id}`} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none' }} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(article.id)} style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '4px', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

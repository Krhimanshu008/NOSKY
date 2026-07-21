'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ContentDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nosky_admin_content_view_mode') || 'list';
    }
    return 'list';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nosky_admin_content_filter_status') || 'all';
    }
    return 'all';
  }); 
  const [filterCategory, setFilterCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nosky_admin_content_filter_category') || 'all';
    }
    return 'all';
  }); 
  const [selectedItems, setSelectedItems] = useState([]);
  
  const router = useRouter();

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nosky_admin_content_view_mode', mode);
    }
  };

  const handleFilterStatusChange = (status) => {
    setFilterStatus(status);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nosky_admin_content_filter_status', status);
    }
  };

  const handleFilterCategoryChange = (cat) => {
    setFilterCategory(cat);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nosky_admin_content_filter_category', cat);
    }
  };

  const fetchArticles = useCallback(async () => {
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
  }, [router]);

  useEffect(() => {
    setTimeout(() => fetchArticles(), 0);
  }, [fetchArticles]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Failed to delete post');
        return;
      }

      fetchArticles();
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedItems.length) return;
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} posts?`)) return;
    
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

  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && article.published) ||
      (filterStatus === 'draft' && !article.published);
      
    const articleCat = article.category?.toLowerCase() || 'article';
    const matchesCategory = filterCategory === 'all' || articleCat === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter(a => a.published).length;
    const drafts = total - published;
    const articleCount = articles.filter(a => (a.category?.toLowerCase() || 'article') === 'article').length;
    const achievements = articles.filter(a => a.category?.toLowerCase() === 'achievement').length;
    return { total, published, drafts, articles: articleCount, achievements };
  }, [articles]);

  if (loading) {
    return (
      <div className="neo-flex-center w-full h-full">
        <Loader2 className="animate-spin text-ink" size={32} />
      </div>
    );
  }

  return (
    <section className="neo-container neo-section-spacing">
      {/* HEADER */}
      <div className="relative pb-6 border-b border-ink/20 flex justify-between items-end">
        <span className="absolute -bottom-2 -left-2 text-ink opacity-40 font-heading text-lg">+</span>
        <div>
          <h1 className="neo-title">Content Management</h1>
          <p className="neo-subtitle">Manage your articles, achievements, and site content.</p>
        </div>
        
        {/* HIGHLIGHTED + NEW POST BUTTON WITH CURVED EDGES */}
        <Link 
          href="/admin/editor" 
          style={{
            height: '2.5rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
            fontFamily: 'var(--font-heading)',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #1A1A1A',
            borderRadius: '6px',
            boxShadow: '4px 4px 0px 0px #000000',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}
          className="active:translate-x-[2px] active:translate-y-[2px]"
        >
          + New Post
        </Link>
      </div>

      {/* STATS ROW (5 CARDS WITH LARGER TEXT & HOVER LIFT) */}
      <div className="neo-grid-5">
        <div className="neo-card p-4">
          <div className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Total Posts</div>
          <div className="font-heading text-4xl font-bold text-ink">{stats.total}</div>
        </div>
        <div className="neo-card p-4">
          <div className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Published</div>
          <div className="font-heading text-4xl font-bold text-ink">{stats.published}</div>
        </div>
        <div className="neo-card p-4">
          <div className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Drafts</div>
          <div className="font-heading text-4xl font-bold text-ink">{stats.drafts}</div>
        </div>
        <div className="neo-card p-4">
          <div className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Articles</div>
          <div className="font-heading text-4xl font-bold text-ink">{stats.articles}</div>
        </div>
        <div className="neo-card p-4">
          <div className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Achievements</div>
          <div className="font-heading text-4xl font-bold text-ink">{stats.achievements}</div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="neo-card neo-flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="flex gap-4 items-center">
          {/* Search Bar - Centered Search Icon */}
          <div className="relative">
            <svg className="absolute top-1/2 -translate-y-1/2 opacity-60 text-ink" style={{ left: '0.875rem' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface border-2 border-ink text-ink py-2 outline-none text-sm font-body focus:bg-white"
              style={{ width: '260px', paddingLeft: '2.5rem', paddingRight: '0.75rem', borderRadius: '6px' }}
            />
          </div>
          
          {/* Filters */}
          <select 
            value={filterStatus} 
            onChange={e => handleFilterStatusChange(e.target.value)}
            className="bg-surface border-2 border-ink text-ink py-2 px-3 outline-none text-sm font-body font-bold uppercase focus:bg-white cursor-pointer"
            style={{ borderRadius: '6px' }}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          <select 
            value={filterCategory} 
            onChange={e => handleFilterCategoryChange(e.target.value)}
            className="bg-surface border-2 border-ink text-ink py-2 px-3 outline-none text-sm font-body font-bold uppercase focus:bg-white cursor-pointer"
            style={{ borderRadius: '6px' }}
          >
            <option value="all">All Categories</option>
            <option value="article">Articles</option>
            <option value="achievement">Achievements</option>
          </select>
        </div>

        <div className="flex gap-4 items-center">
          {selectedItems.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              style={{
                backgroundColor: '#FF3B30',
                color: '#FFFFFF',
                border: '2px solid #1A1A1A',
                boxShadow: '2px 2px 0px 0px #1A1A1A',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Delete Selected ({selectedItems.length})
            </button>
          )}

          {/* View Toggle */}
          <div className="flex gap-2 bg-surface border-2 border-ink p-1.5" style={{ borderRadius: '6px' }}>
            <button 
              onClick={() => handleViewModeChange('list')} 
              style={{
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #1A1A1A',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'list' ? '#FFCC00' : '#FFFFFF',
                color: '#1A1A1A',
                boxShadow: viewMode === 'list' ? '3px 3px 0px 0px #1A1A1A' : 'none',
                transition: 'all 0.15s ease'
              }}
              title="List View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
            <button 
              onClick={() => handleViewModeChange('grid')} 
              style={{
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #1A1A1A',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'grid' ? '#FFCC00' : '#FFFFFF',
                color: '#1A1A1A',
                boxShadow: viewMode === 'grid' ? '3px 3px 0px 0px #1A1A1A' : 'none',
                transition: 'all 0.15s ease'
              }}
              title="Grid View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      {filteredArticles.length === 0 ? (
        <div className="neo-card">
          <div className="w-16 h-16 mx-auto mb-4 border-2 border-ink flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 className="font-heading text-xl font-bold uppercase mb-2 text-center">No posts found</h3>
          <p className="text-muted text-sm font-body text-center">Adjust your search or filters, or create a new post.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="neo-card">
          <table className="neo-table">
            <thead>
              <tr className="table-head-row">
                <th className="p-3 border-r border-ink/20 w-10 text-center">
                  <input type="checkbox" checked={selectedItems.length === filteredArticles.length} onChange={toggleSelectAll} className="cursor-pointer" />
                </th>
                <th className="p-3 text-[10px] font-bold text-ink uppercase tracking-wider border-r border-ink/20">Title</th>
                <th className="p-3 text-[10px] font-bold text-ink uppercase tracking-wider border-r border-ink/20">Category</th>
                <th className="p-3 text-[10px] font-bold text-ink uppercase tracking-wider border-r border-ink/20">Status</th>
                <th className="p-3 text-[10px] font-bold text-ink uppercase tracking-wider border-r border-ink/20">Date</th>
                <th className="">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-body">
              {filteredArticles.map(article => {
                const cat = article.category?.toLowerCase() || 'article';
                const imgSrc = article.coverImage || article.image || article.thumbnail;
                return (
                  <tr key={article.id} className="border-b border-ink/20 hover:bg-surface/50 transition-colors">
                    <td className="p-3 border-r border-ink/20 text-center">
                      <input type="checkbox" checked={selectedItems.includes(article.id)} onChange={() => toggleSelect(article.id)} className="cursor-pointer" />
                    </td>
                    <td className="p-3 border-r border-ink/20">
                      <div className="flex items-center gap-3">
                        {imgSrc ? (
                          <div className="w-10 h-10 border border-ink overflow-hidden flex-shrink-0">
                            <img src={imgSrc} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 border border-ink bg-surface flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                        )}
                        <Link href={`/admin/editor/${article.id}`} className="font-bold text-ink hover:underline">
                          {article.title}
                        </Link>
                      </div>
                    </td>
                    <td className="p-3 border-r border-ink/20">
                      <span 
                        style={{
                          padding: '3px 9px',
                          border: '2px solid #1A1A1A',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          boxShadow: '2px 2px 0px 0px #1A1A1A',
                          backgroundColor: cat === 'achievement' ? '#FFCC00' : '#2563EB',
                          color: cat === 'achievement' ? '#1A1A1A' : '#FFFFFF',
                          display: 'inline-block'
                        }}
                      >
                        {cat}
                      </span>
                    </td>
                    <td className="p-3 border-r border-ink/20">
                      {article.published ? (
                        <span className="flex items-center gap-2 text-xs font-bold text-ink">
                          <span className="w-2 h-2 bg-ink rounded-full"></span> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-xs font-bold text-muted">
                          <span className="w-2 h-2 border border-muted rounded-full"></span> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 border-r border-ink/20 text-muted text-xs">
                      {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-3 text-right">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <Link 
                          href={cat === 'achievement' ? `/achievement/${article.slug}` : `/article/${article.slug}`} 
                          target="_blank" 
                          style={{ background: 'transparent', border: 'none', padding: '0.25rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease' }} 
                          className="hover:scale-110" 
                          title="View Post"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </Link>
                        <Link 
                          href={`/admin/editor/${article.id}`} 
                          style={{ background: 'transparent', border: 'none', padding: '0.25rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease' }} 
                          className="hover:scale-110" 
                          title="Edit Post"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </Link>
                        <button 
                          onClick={() => handleDelete(article.id)} 
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '0.25rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.15s ease'
                          }}
                          className="hover:scale-110"
                          title="Delete Post"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
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
        <div className="neo-grid-3">
          {filteredArticles.map(article => {
            const cat = article.category?.toLowerCase() || 'article';
            const imgSrc = article.coverImage || article.image || article.thumbnail;

            return (
              <div key={article.id} className="neo-card flex flex-col justify-between">
                <div>
                  {/* ALWAYS RENDER COVER IMAGE HEADER BANNER */}
                  <div style={{ height: '11rem', borderBottom: '2px solid #1A1A1A', position: 'relative', backgroundColor: '#F5F5F5', overflow: 'hidden' }}>
                    {imgSrc ? (
                      <img src={imgSrc} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', marginTop: '4px' }}>No Cover Image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* HIGHLIGHTED CATEGORY BADGE */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span 
                        style={{
                          padding: '4px 10px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          border: '2px solid #1A1A1A',
                          boxShadow: '2px 2px 0px 0px #1A1A1A',
                          display: 'inline-block',
                          backgroundColor: cat === 'achievement' ? '#FFCC00' : '#2563EB',
                          color: cat === 'achievement' ? '#1A1A1A' : '#FFFFFF'
                        }}
                      >
                        {cat}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg leading-tight mb-3 line-clamp-2 text-ink">
                      {article.title}
                    </h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span className="text-muted text-xs font-body">
                        {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION ROW */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', paddingTop: 0 }}>
                  {/* Left: 3 Action Icons (View, Edit, Delete) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link 
                      href={cat === 'achievement' ? `/achievement/${article.slug}` : `/article/${article.slug}`} 
                      target="_blank" 
                      style={{ background: 'transparent', border: 'none', padding: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease' }} 
                      className="hover:scale-110" 
                      title="View Post"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </Link>
                    <Link 
                      href={`/admin/editor/${article.id}`} 
                      style={{ background: 'transparent', border: 'none', padding: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease' }} 
                      className="hover:scale-110" 
                      title="Edit Post"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </Link>
                    <button 
                      onClick={() => handleDelete(article.id)} 
                      style={{ background: 'transparent', border: 'none', padding: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease' }}
                      className="hover:scale-110"
                      title="Delete Post"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>

                  {/* Right: 3D Green Published Status Badge */}
                  <div>
                    {article.published ? (
                      <span style={{ padding: '3px 8px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#10B981', color: '#FFFFFF', border: '2px solid #1A1A1A', boxShadow: '2px 2px 0px 0px #1A1A1A', display: 'inline-block' }}>
                        Published
                      </span>
                    ) : (
                      <span style={{ padding: '3px 8px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#71717A', color: '#FFFFFF', border: '2px solid #1A1A1A', boxShadow: '2px 2px 0px 0px #1A1A1A', display: 'inline-block' }}>
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

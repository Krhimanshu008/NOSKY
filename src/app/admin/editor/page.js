'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const processFile = async (file) => {
  if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
    try {
      const heic2any = (await import('heic2any')).default;
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      return new File([blob], file.name.replace(/\.heic$|\.heif$/i, '.jpg'), { type: 'image/jpeg' });
    } catch (e) {
      console.error('HEIC conversion error', e);
      return file;
    }
  }
  return file;
};

const TiptapEditor = dynamic(
  () => import('./TiptapEditor'),
  { ssr: false }
);

export default function ArticleEditor({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // AI Content State
  const [isContentAIOpen, setIsContentAIOpen] = useState(false);
  const [contentAIPrompt, setContentAIPrompt] = useState('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generationType, setGenerationType] = useState('generate');
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef(null);
  
  const [gallery, setGallery] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaDescription: '',
    metaKeywords: '',
    coverImage: '',
    geoRegion: '',
    cityLocation: '',
    published: false,
    category: 'article',
    aiSummary: ''
  });

  const fileInputRef = useRef(null);

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

  useEffect(() => {
    async function init() {
      const p = await params;
      if (p?.id) {
        setIsEditing(true);
        setIsFetching(true);
        await fetchArticle(p.id);
        setIsFetching(false);
      }
    }
    init();
  }, [params]);

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const slugify = (text) => {
    return (text || '')
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'slug') {
      setIsSlugManuallyEdited(true);
    }
    if (name === 'title' && !isSlugManuallyEdited && !isEditing) {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: slugify(value)
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCoverUpload = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;

    file = await processFile(file);

    setIsUploadingImage(true);
    try {
      const body = new FormData();
      body.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body
      });
      
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, coverImage: data.url }));
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 10) {
      alert('You can only upload up to 10 images at once.');
      e.target.value = '';
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map(async (rawFile) => {
        const file = await processFile(rawFile);
        const body = new FormData();
        body.append('file', file);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body
        });
        
        const data = await res.json();
        if (res.ok && data.url) {
          return data.url;
        } else {
          console.error(data.error || 'Failed to upload image');
          return null;
        }
      });

      const urls = await Promise.all(uploadPromises);
      const successfulUrls = urls.filter(url => url !== null);
      
      if (successfulUrls.length > 0) {
        setGallery(prev => [...prev, ...successfulUrls]);
      }
      
      if (successfulUrls.length !== files.length) {
        alert(`Uploaded ${successfulUrls.length} out of ${files.length} images successfully.`);
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading images');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.title || !formData.content) {
      alert('Please enter a Title and Content first so the AI has context to generate SEO data.');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, content: formData.content })
      });
      
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          metaDescription: data.metaDescription || prev.metaDescription,
          metaKeywords: data.metaKeywords || prev.metaKeywords,
          geoRegion: data.geoRegion || prev.geoRegion,
          cityLocation: data.cityLocation || prev.cityLocation
        }));
      } else {
        alert(data.error || 'Failed to generate SEO');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating SEO');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleContentAIGenerate = async (overridePrompt) => {
    const finalPrompt = typeof overridePrompt === 'string' ? overridePrompt : contentAIPrompt;
    const type = typeof overridePrompt === 'string' ? 'refine' : 'generate';
    setGenerationType(type);
    
    if (!finalPrompt && !formData.content && !formData.title) {
      alert('Please enter a prompt or have some existing content/title to refine.');
      return;
    }

    setIsGeneratingContent(true);
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: finalPrompt,
          existingTitle: formData.title,
          existingContent: formData.content 
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          slug: data.slug || prev.slug
        }));
        setIsContentAIOpen(false);
        setContentAIPrompt('');
        
        if (data.content) {
          if (editorRef.current) {
            editorRef.current.simulateTyping(data.content);
          } else {
            setFormData(prev => ({ ...prev, content: data.content }));
            setEditorKey(prev => prev + 1);
          }
        }
      } else {
        alert(data.error || 'Failed to generate content');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating content');
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!formData.content) {
      alert('Please enter some content first so the AI has context to generate a summary.');
      return;
    }
    
    setIsGeneratingContent(true);
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Summarize the following content into 3-5 concise bullet points. Provide ONLY the bullet points formatted as markdown list, no introductory text.',
          existingTitle: formData.title,
          existingContent: formData.content
        })
      });
      
      const data = await res.json();
      if (res.ok && data.content) {
        setFormData(prev => ({ ...prev, aiSummary: data.content }));
      } else {
        alert(data.error || 'Failed to generate summary');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating summary');
    } finally {
      setIsGeneratingContent(false);
    }
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
  const wordCount = (formData.content || '').trim() ? (formData.content || '').trim().split(/\s+/).length : 0;
  const charCount = (formData.content || '').length;

  return (
    <div style={{ paddingTop: '1.5rem', paddingBottom: 'var(--space-8)', paddingLeft: 'var(--space-8)', paddingRight: 'var(--space-8)', width: '100%', boxSizing: 'border-box' }}>
      
      {/* HEADER BAR */}
      <div className="neo-header" style={{ marginBottom: '1.5rem' }}>
        <Link 
          href="/admin/content" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.375rem', 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 'bold', 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            color: 'var(--color-ink)', 
            textDecoration: 'none', 
            marginBottom: '0.5rem' 
          }}
        >
          ← Back to Content
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="neo-title">{isEditing ? 'Edit Post' : 'New Post'}</h1>
            <p className="neo-subtitle">Create, refine with AI, optimize SEO, and publish your content.</p>
          </div>
          <Link 
            href="/admin/content" 
            style={{
              padding: '0.5rem 1rem',
              border: '2px solid var(--color-ink)',
              borderRadius: '6px',
              backgroundColor: 'var(--color-panel)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              color: 'var(--color-ink)',
              textDecoration: 'none',
              boxShadow: '2px 2px 0px 0px #000'
            }}
          >
            Cancel
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN - 70% */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          
          {/* BOX 1: POST DETAILS (Title & Slug) */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '350px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', margin: 0, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Post Details</h2>
              
              {!formData.aiSummary && (
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingContent}
                  style={{
                    backgroundColor: '#FFCC00',
                    color: '#1A1A1A',
                    border: '2px solid #1A1A1A',
                    borderRadius: '6px',
                    boxShadow: '2px 2px 0px 0px #000',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    cursor: isGeneratingContent ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: isGeneratingContent ? 0.7 : 1
                  }}
                >
                  {isGeneratingContent ? '✨ Generating...' : '✨ Generate AI Summary'}
                </button>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                required 
                style={{ ...inputStyle, fontSize: '1.1rem', fontWeight: 'bold' }} 
                placeholder="Enter article title here..." 
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', margin: 0 }}>Slug</label>
                {!isEditing && (
                  <span style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                    {isSlugManuallyEdited ? 'Manual Mode' : 'Auto-generated from title'}
                  </span>
                )}
              </div>
              <input 
                type="text" 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                style={inputStyle} 
                placeholder="url-friendly-slug" 
              />
            </div>
          </div>

          {/* CONDITIONAL BOX: AI SUMMARY (Only shown when summary exists) */}
          {(formData.aiSummary && formData.aiSummary.trim().length > 0) && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderColor: '#2563EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ padding: '2px 8px', backgroundColor: '#2563EB', color: '#FFF', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>AI Summary</span>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', margin: 0, fontFamily: 'var(--font-heading)' }}>Bullet Points Preview</label>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, aiSummary: '' }))}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  Discard Summary
                </button>
              </div>
              <textarea
                name="aiSummary"
                value={formData.aiSummary}
                onChange={handleChange}
                placeholder="Bullet points summarizing the article..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px', fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}
              />
            </div>
          )}

          {/* BOX 2: CONTENT EDITOR */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: '474px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', margin: 0, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Content Writer</h2>
              <button 
                type="button" 
                onClick={() => setIsContentAIOpen(!isContentAIOpen)}
                style={{ 
                  backgroundColor: '#FFCC00', 
                  color: '#1A1A1A', 
                  border: '2px solid #1A1A1A', 
                  borderRadius: '6px', 
                  boxShadow: '2px 2px 0px 0px #000',
                  padding: '6px 14px', 
                  fontSize: '0.8rem', 
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'bold', 
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ✨ AI Content Generate
              </button>
            </div>

            {/* AI Generator Drawer */}
            {isContentAIOpen && (
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)', border: '2px solid var(--color-ink)', boxShadow: '3px 3px 0px 0px #000' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>What would you like the AI to write or refine?</label>
                <textarea 
                  value={contentAIPrompt} 
                  onChange={e => setContentAIPrompt(e.target.value)}
                  placeholder="e.g. Write a detailed guide on Next.js 14, or 'Refine my current draft to be more professional'"
                  style={{ ...inputStyle, marginBottom: 'var(--space-3)', resize: 'vertical', minHeight: '80px', fontSize: 'var(--text-sm)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsContentAIOpen(false)}
                    style={{
                      background: 'transparent',
                      border: '2px solid var(--color-ink)',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'bold',
                      color: 'var(--color-ink)',
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleContentAIGenerate()} 
                    disabled={isGeneratingContent} 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      padding: '0.5rem 1.25rem',
                      backgroundColor: '#1A1A1A',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      border: '2px solid #1A1A1A',
                      borderRadius: '6px',
                      boxShadow: '3px 3px 0px 0px #000000',
                      cursor: isGeneratingContent ? 'wait' : 'pointer',
                      opacity: isGeneratingContent ? 0.7 : 1,
                      boxSizing: 'border-box'
                    }}
                  >
                    {isGeneratingContent ? 'Generating...' : <>✨ Generate</>}
                  </button>
                </div>
              </div>
            )}

            {/* Markdown Content Writer Container */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} data-color-mode="dark">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', margin: 0 }}>Content (Markdown) *</label>
                {formData.content && formData.content.trim().length > 0 && (
                  <button
                    type="button"
                    disabled={isGeneratingContent}
                    onClick={() => {
                      handleContentAIGenerate('Refine the current content to be more professional and well-structured, fixing any grammar issues. DO NOT add a title heading to the content.');
                    }}
                    style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: '2px solid #1A1A1A',
                      borderRadius: '6px',
                      boxShadow: '2px 2px 0px 0px #000',
                      padding: '4px 12px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      cursor: isGeneratingContent ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: isGeneratingContent ? 0.7 : 1
                    }}
                  >
                    {isGeneratingContent ? '✨ Refining...' : '✨ Refine Content'}
                  </button>
                )}
              </div>
              
              {isFetching ? (
                <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)' }}>Loading content...</div>
              ) : (
                <TiptapEditor
                  ref={editorRef}
                  isGenerating={isGeneratingContent}
                  generationType={generationType}
                  key={editorKey}
                  initialMarkdown={formData.content}
                  onChange={(val) => setFormData(prev => ({ ...prev, content: val || '' }))}
                />
              )}
            </div>

            {/* Editor Footer Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
              <span>Words: <strong>{wordCount}</strong></span>
              <span>Characters: <strong>{charCount}</strong></span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - 30% */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '1rem' }}>
          
          {/* 1. TOP MODULE: SEO & GEO Optimization */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '350px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', margin: 0, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>SEO & GEO</h3>
              <button 
                type="button" 
                onClick={handleAIGenerate} 
                disabled={isGeneratingAI}
                style={{ 
                  backgroundColor: '#FFCC00', 
                  color: '#1A1A1A', 
                  border: '2px solid #1A1A1A', 
                  borderRadius: '6px', 
                  boxShadow: '2px 2px 0px 0px #000',
                  padding: '4px 12px', 
                  fontSize: '0.75rem', 
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'bold', 
                  textTransform: 'uppercase',
                  cursor: isGeneratingAI ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isGeneratingAI ? 'Generating...' : (
                  <>
                    <span>✨</span> AI Auto-fill
                  </>
                )}
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '0.25rem', color: 'var(--color-text-secondary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Meta Description</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3} style={{...inputStyle, fontSize: 'var(--text-sm)'}} placeholder="Brief description for search engines..." />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '0.25rem', color: 'var(--color-text-secondary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Meta Keywords</label>
              <input 
                type="text" 
                name="metaKeywords" 
                value={formData.metaKeywords} 
                onChange={handleChange} 
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                style={{...inputStyle, fontSize: 'var(--text-sm)'}} 
                placeholder="nextjs, react, tutorial..."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '0.25rem', color: 'var(--color-text-secondary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Geo Region</label>
              <input 
                type="text" 
                name="geoRegion" 
                value={formData.geoRegion} 
                onChange={handleChange} 
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                style={{...inputStyle, fontSize: 'var(--text-sm)'}} 
                placeholder="e.g. US-CA"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '0.25rem', color: 'var(--color-text-secondary)', fontWeight: 'bold', textTransform: 'uppercase' }}>City Location</label>
              <input 
                type="text" 
                name="cityLocation" 
                value={formData.cityLocation} 
                onChange={handleChange} 
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                style={{...inputStyle, fontSize: 'var(--text-sm)'}} 
                placeholder="e.g. Los Angeles"
              />
            </div>
          </div>

          {/* 2. MIDDLE MODULE: Images & Media */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', margin: 0, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Images & Media</h3>
            
            {/* Cover Image Section */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <span>Cover Image (Hero)</span>
                {formData.coverImage && (
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))} style={{ fontSize: '11px', color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                )}
              </label>
              
              {formData.coverImage ? (
                <div style={{ width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-secondary)', overflow: 'hidden' }}>
                  <img src={formData.coverImage} alt="Cover" style={{ width: '100%', height: 'auto', maxHeight: '180px', objectFit: 'cover', display: 'block' }} />
                </div>
              ) : (
                <div>
                  <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ ...inputStyle, padding: 'var(--space-2)', fontSize: '12px' }} disabled={isUploadingImage} />
                </div>
              )}
            </div>
            
            {/* Gallery Section */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Gallery</label>
              
              <style>{`
                .gallery-item-container .gallery-remove-btn { opacity: 0; transition: opacity 0.2s ease; pointer-events: none; }
                .gallery-item-container:hover .gallery-remove-btn { opacity: 1; pointer-events: auto; }
              `}</style>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.5rem' }}>
                {gallery.map((url, i) => (
                  <div key={i} className="gallery-item-container" style={{ position: 'relative', width: '48px', height: '48px' }}>
                    <img 
                      src={url}
                      alt="Gallery item"
                      draggable="true"
                      title="Drag into editor or click to copy markdown" 
                      onClick={() => { navigator.clipboard.writeText(`![Image](${url})`); alert('Copied markdown! Paste it in the editor.'); }} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'grab', transition: 'transform 0.1s' }} 
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} 
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} 
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', `![Image](${url})`);
                        e.dataTransfer.setData('text/uri-list', url);
                      }}
                    />
                    <button
                      type="button"
                      className="gallery-remove-btn"
                      onClick={() => setGallery(prev => prev.filter((_, idx) => idx !== i))}
                      style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#EF4444', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', cursor: 'pointer', zIndex: 10, padding: 0, lineHeight: 1 }}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} style={{ ...inputStyle, padding: 'var(--space-2)', fontSize: '12px' }} disabled={isUploadingImage} />
              
              {isUploadingImage && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', marginTop: '0.25rem' }}>Uploading...</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>Or enter Cover Image URL</label>
              <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} style={{ ...inputStyle, fontSize: '12px' }} placeholder="https://..." />
            </div>
          </div>

          {/* 3. BOTTOM MODULE: Publish Settings */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', margin: 0, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Publish Settings</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} style={{ ...inputStyle, fontWeight: 'bold' }} required>
                <option value="article">Article</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>

            {/* Interactive Publish Checkbox Card */}
            <label 
              htmlFor="published" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.625rem', 
                cursor: 'pointer', 
                userSelect: 'none',
                padding: '0.75rem 1rem',
                border: '2px solid var(--color-ink)',
                borderRadius: '6px',
                backgroundColor: formData.published ? '#FFCC00' : 'var(--color-surface)',
                boxShadow: formData.published ? '3px 3px 0px 0px #1A1A1A' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <input 
                type="checkbox" 
                id="published" 
                name="published" 
                checked={formData.published} 
                onChange={handleChange} 
                style={{ width: '20px', height: '20px', accentColor: '#1A1A1A', cursor: 'pointer' }} 
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--color-ink)' }}>
                Publish immediately
              </span>
            </label>

            <button 
              type="submit" 
              disabled={loading} 
              style={{
                width: '100%',
                marginTop: '0.25rem',
                padding: '0.875rem 1.5rem',
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading)',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: '2px solid #1A1A1A',
                borderRadius: '6px',
                boxShadow: '4px 4px 0px 0px #000000',
                cursor: loading ? 'wait' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Post' : (formData.published ? 'Publish Post' : 'Save Draft'))}
            </button>
          </div>
          
        </div>
      </form>
    </div>
  );
}

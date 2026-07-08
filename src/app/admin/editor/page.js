'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

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
  const [editorKey, setEditorKey] = useState(0);
  
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
    category: 'article'
  });

  const fileInputRef = useRef(null);

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

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      const uploadPromises = Array.from(files).map(async (file) => {
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

  const handleContentAIGenerate = async () => {
    if (!contentAIPrompt && !formData.content && !formData.title) {
      alert('Please enter a prompt or have some existing content/title to refine.');
      return;
    }

    setIsGeneratingContent(true);
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: contentAIPrompt,
          existingTitle: formData.title,
          existingContent: formData.content 
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          slug: data.slug || prev.slug,
          content: data.content || prev.content
        }));
        setEditorKey(prev => prev + 1); // Force remount TiptapEditor to show new content
        setIsContentAIOpen(false);
        setContentAIPrompt('');
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
    <div style={{ paddingTop: '100px', paddingBottom: 'var(--space-8)', paddingLeft: 'var(--space-8)', paddingRight: 'var(--space-8)', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ margin: 0 }}>{isEditing ? 'Edit Post' : 'New Post'}</h1>
        <Link href="/admin/dashboard" className="btn btn-ghost">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: 'var(--space-8)' }}>
        
        {/* LEFT COLUMN - 70% */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', height: '100%', minWidth: 0 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1 }}>
            
            {/* AI Generate Prompt Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Content Editor</h2>
              <button 
                type="button" 
                onClick={() => setIsContentAIOpen(!isContentAIOpen)}
                style={{ 
                  background: 'linear-gradient(135deg, #fcd34d, #f59e0b)', 
                  color: '#000', 
                  border: 'none', 
                  borderRadius: 'var(--radius-full)', 
                  padding: '6px 16px', 
                  fontSize: 'var(--text-sm)', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ✨ AI Content Generate
              </button>
            </div>

            {isContentAIOpen && (
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>What would you like the AI to write or refine?</label>
                <textarea 
                  value={contentAIPrompt} 
                  onChange={e => setContentAIPrompt(e.target.value)}
                  placeholder="e.g. Write a detailed guide on Next.js 14, or 'Refine my current draft to be more professional'"
                  style={{ ...inputStyle, marginBottom: 'var(--space-3)', resize: 'vertical', minHeight: '80px', fontSize: 'var(--text-sm)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsContentAIOpen(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleContentAIGenerate} disabled={isGeneratingContent} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isGeneratingContent ? 'Generating...' : <>✨ Generate</>}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ ...inputStyle, fontSize: 'var(--text-lg)' }} placeholder="Enter the title here..." />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} style={inputStyle} placeholder="auto-generated-if-empty" />
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} data-color-mode="dark">
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Content (Markdown) *</label>
              {isFetching ? (
                <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)' }}>Loading content...</div>
              ) : (
                <TiptapEditor
                  key={editorKey}
                  initialMarkdown={formData.content}
                  onChange={(val) => setFormData(prev => ({ ...prev, content: val || '' }))}
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - 30% */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: '100px' }}>
          
          {/* 1. Media Library */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)', margin: 0 }}>Images & Media</h3>
            
            {/* Cover Image Section */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                <span>Cover Image (Hero)</span>
                {formData.coverImage && (
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))} style={{ fontSize: '12px', color: 'var(--color-error)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove</button>
                )}
              </label>
              
              {formData.coverImage ? (
                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', background: `url(${formData.coverImage}) center/cover no-repeat`, border: '1px solid var(--color-border)' }} />
              ) : (
                <div>
                  <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ ...inputStyle, padding: 'var(--space-2)', fontSize: '12px' }} disabled={isUploadingImage} />
                </div>
              )}
            </div>
            
            {/* Gallery Section */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Gallery</label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-3)' }}>
                {gallery.map((url, i) => (
                  <img 
                    key={i} 
                    src={url}
                    alt="Gallery item"
                    draggable="true"
                    title="Drag into editor or click to copy markdown" 
                    onClick={() => { navigator.clipboard.writeText(`![Image](${url})`); alert('Copied markdown! Paste it in the editor where you want.'); }} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'grab', transition: 'transform 0.1s' }} 
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} 
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} 
                    onDragStart={(e) => {
                      // Set data so Tiptap recognizes it as an image drop or markdown text
                      e.dataTransfer.setData('text/plain', `![Image](${url})`);
                      e.dataTransfer.setData('text/uri-list', url);
                    }}
                  />
                ))}
              </div>

              <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} style={{ ...inputStyle, padding: 'var(--space-2)', fontSize: '12px' }} disabled={isUploadingImage} />
              
              {isUploadingImage && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', marginTop: 'var(--space-1)' }}>Uploading...</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-1)', marginTop: 'var(--space-2)' }}>Or enter Cover Image URL</label>
              <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} style={{ ...inputStyle, fontSize: '12px' }} placeholder="https://..." />
            </div>
          </div>

          {/* 2. SEO & GEO Optimization */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>SEO & GEO</h3>
              <button 
                type="button" 
                onClick={handleAIGenerate} 
                disabled={isGeneratingAI}
                style={{ 
                  background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)', 
                  color: '#000', 
                  border: 'none', 
                  borderRadius: 'var(--radius-full)', 
                  padding: '4px 12px', 
                  fontSize: 'var(--text-xs)', 
                  fontWeight: 'bold', 
                  cursor: isGeneratingAI ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isGeneratingAI ? 'Generating...' : (
                  <>
                    <span style={{ fontSize: '14px' }}>✨</span> AI Auto-fill
                  </>
                )}
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-1)', color: 'var(--color-text-secondary)' }}>Meta Description</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3} style={{...inputStyle, fontSize: 'var(--text-sm)'}} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-1)', color: 'var(--color-text-secondary)' }}>Meta Keywords</label>
              <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} style={{...inputStyle, fontSize: 'var(--text-sm)'}} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-1)', color: 'var(--color-text-secondary)' }}>Geo Region</label>
              <input type="text" name="geoRegion" value={formData.geoRegion} onChange={handleChange} style={{...inputStyle, fontSize: 'var(--text-sm)'}} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-1)', color: 'var(--color-text-secondary)' }}>City Location</label>
              <input type="text" name="cityLocation" value={formData.cityLocation} onChange={handleChange} style={{...inputStyle, fontSize: 'var(--text-sm)'}} />
            </div>
          </div>
          
          {/* 3. Publish Settings */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)', margin: 0 }}>Settings</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} style={inputStyle} required>
                <option value="article">Article</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input type="checkbox" id="published" name="published" checked={formData.published} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
              <label htmlFor="published" style={{ fontSize: 'var(--text-base)', cursor: 'pointer' }}>Publish immediately</label>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
              {loading ? 'Saving...' : (isEditing ? 'Update Post' : (formData.published ? 'Publish' : 'Save Draft'))}
            </button>
          </div>
          
        </div>
      </form>
    </div>
  );
}

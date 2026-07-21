'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Markdown } from 'tiptap-markdown';
import TiptapToolbar from './TiptapToolbar';
import { useState, forwardRef, useImperativeHandle, useRef } from 'react';

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

const TiptapEditor = forwardRef(function TiptapEditor({ initialMarkdown, onChange, isGenerating, generationType }, ref) {
  const [isUploading, setIsUploading] = useState(false);
  const isTypingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Markdown,
    ],
    content: initialMarkdown || '',
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown();
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      }
    }
  });

  useImperativeHandle(ref, () => ({
    simulateTyping: async (fullMarkdown) => {
      if (!editor) return;
      isTypingRef.current = true;
      editor.commands.setContent('');
      
      const chunkSize = 4;
      const el = document.querySelector('.tiptap-content-wrapper');
      
      for (let i = 0; i < fullMarkdown.length; i += chunkSize) {
        if (!isTypingRef.current) break; // aborted
        const current = fullMarkdown.substring(0, i + chunkSize);
        editor.commands.setContent(current, false); // false = don't emit update event
        
        if (el) el.scrollTop = el.scrollHeight;
        await new Promise(r => setTimeout(r, 15));
      }
      
      isTypingRef.current = false;
      editor.commands.setContent(fullMarkdown);
      onChange(fullMarkdown);
      if (el) el.scrollTop = el.scrollHeight;
    }
  }));

  const handleEditorClick = () => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
    }
  };

  // Handle async image upload
  const handleImageUpload = async (rawFile) => {
    setIsUploading(true);
    try {
      const file = await processFile(rawFile);
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error('Upload failed');
      return data.url;
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  if (!editor) {
    return <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>Loading editor...</div>;
  }

  return (
    <div className={isGenerating ? 'ai-thinking-border' : ''} style={{ 
      flex: 1,
      position: 'relative', /* needed for the pulse to layer correctly sometimes */
      border: '1px solid var(--color-border)', 
      borderRadius: 'var(--radius-sm)', 
      overflow: 'hidden',
      background: 'var(--color-bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.3s, box-shadow 0.3s'
    }}>
      <TiptapToolbar editor={editor} onImageUpload={handleImageUpload} />
      
      {isUploading && (
        <div style={{ padding: '4px 16px', fontSize: '12px', color: 'var(--color-accent)', background: 'var(--color-bg-secondary)' }}>
          Uploading image...
        </div>
      )}
      
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {isGenerating && generationType === 'generate' && (
          <div className="generate-overlay">
            <div className="ai-spinner"></div>
            <div className="ai-text">✨ AI is generating...</div>
          </div>
        )}
        
        <div className={`tiptap-content-wrapper ${isGenerating && generationType === 'refine' ? 'refine-shimmer' : ''}`} onClick={handleEditorClick} style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg-primary)' }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      <style>{`
        @keyframes shimmerPulse {
          0% { opacity: 0.7; }
          50% { opacity: 0.2; filter: blur(1px); }
          100% { opacity: 0.7; }
        }
        .refine-shimmer {
          animation: shimmerPulse 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes borderPulse {
          0% { box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 15px 2px rgba(59, 130, 246, 0.4); border-color: rgba(59, 130, 246, 0.7); }
          100% { box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.3); }
        }
        .ai-thinking-border {
          animation: borderPulse 2.5s infinite;
        }

        .generate-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 20;
        }
        .ai-spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0%, transparent 40%, #8b5cf6 60%, #3b82f6 100%);
          animation: spin 1s linear infinite;
          mask: radial-gradient(transparent 55%, black 56%);
          -webkit-mask: radial-gradient(transparent 55%, black 56%);
          margin-bottom: 16px;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .ai-text {
          font-weight: 600;
          background: linear-gradient(to right, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.05em;
        }
        .tiptap-content-wrapper .ProseMirror {
          min-height: 600px;
          padding: 1.5rem;
          outline: none;
          color: var(--color-text-primary);
          font-size: 1.1rem;
          line-height: 1.7;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .tiptap-content-wrapper .ProseMirror p {
          margin-bottom: 1em;
        }
        .tiptap-content-wrapper .ProseMirror h1 {
          font-size: 2.2em;
          font-weight: 800;
          margin-top: 1em;
          margin-bottom: 0.5em;
          line-height: 1.2;
        }
        .tiptap-content-wrapper .ProseMirror h2 {
          font-size: 1.6em;
          font-weight: 700;
          margin-top: 1em;
          margin-bottom: 0.5em;
          line-height: 1.3;
        }
        .tiptap-content-wrapper .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .tiptap-content-wrapper .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .tiptap-content-wrapper .ProseMirror blockquote {
          border-left: 3px solid var(--color-primary);
          padding-left: 1.2em;
          font-style: italic;
          color: var(--color-text-secondary);
          margin-bottom: 1em;
          background: rgba(255,255,255,0.03);
          padding-top: 0.5em;
          padding-bottom: 0.5em;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }
        .tiptap-content-wrapper .ProseMirror img {
          width: 200px;
          height: auto;
          display: inline-block;
          vertical-align: middle;
          margin: 0 0.5rem;
          border-radius: var(--radius-sm);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .tiptap-content-wrapper .ProseMirror a {
          color: var(--color-primary);
          text-decoration: underline;
        }
        .tiptap-content-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--color-text-muted);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
});

export default TiptapEditor;

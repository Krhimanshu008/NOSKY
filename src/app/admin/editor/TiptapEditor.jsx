'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Markdown } from 'tiptap-markdown';
import TiptapToolbar from './TiptapToolbar';
import { useState } from 'react';

export default function TiptapEditor({ initialMarkdown, onChange }) {
  const [isUploading, setIsUploading] = useState(false);

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

  // Handle async image upload
  const handleImageUpload = async (file) => {
    setIsUploading(true);
    try {
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
    <div style={{ 
      border: '1px solid var(--color-border)', 
      borderRadius: 'var(--radius-sm)', 
      overflow: 'hidden',
      background: 'var(--color-bg-primary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <TiptapToolbar editor={editor} onImageUpload={handleImageUpload} />
      
      {isUploading && (
        <div style={{ padding: '4px 16px', fontSize: '12px', color: 'var(--color-accent)', background: 'var(--color-bg-secondary)' }}>
          Uploading image...
        </div>
      )}
      
      <div className="tiptap-content-wrapper" style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg-primary)' }}>
        <EditorContent editor={editor} />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />
    </div>
  );
}

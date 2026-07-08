'use client';

import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, 
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon 
} from 'lucide-react';

export default function TiptapToolbar({ editor, onImageUpload }) {
  if (!editor) return null;

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) return; // cancelled
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const url = await onImageUpload(file);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
    e.target.value = '';
  };

  const ToolbarButton = ({ onClick, isActive, children }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: isActive ? 'var(--color-bg-secondary)' : 'transparent',
        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        padding: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
      }}
      onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--color-bg-secondary)'; }}
      onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '4px', 
      padding: '8px', 
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-bg-primary)',
      borderTopLeftRadius: 'var(--radius-sm)',
      borderTopRightRadius: 'var(--radius-sm)',
    }}>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
        <Strikethrough size={18} />
      </ToolbarButton>
      
      <div style={{ width: '1px', background: 'var(--color-border)', margin: '0 4px' }} />
      
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
        <Heading1 size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
        <Heading2 size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', padding: '0 2px' }}>P</span>
      </ToolbarButton>
      
      <div style={{ width: '1px', background: 'var(--color-border)', margin: '0 4px' }} />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
        <ListOrdered size={18} />
      </ToolbarButton>
      
      <div style={{ width: '1px', background: 'var(--color-border)', margin: '0 4px' }} />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
        <Quote size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={toggleLink} isActive={editor.isActive('link')}>
        <LinkIcon size={18} />
      </ToolbarButton>

      <div style={{ width: '1px', background: 'var(--color-border)', margin: '0 4px' }} />

      <label style={{ cursor: 'pointer', display: 'flex' }}>
        <div
          style={{
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-bg-secondary)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <ImageIcon size={18} />
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
      </label>
    </div>
  );
}

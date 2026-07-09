'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BackButton({ label = '← Back', href, fallback = '/', style = {}, className = '' }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const canGoBack = mounted && (
    (document.referrer && document.referrer.includes(window.location.host)) || 
    window.history.length > 2
  );

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 0',
    marginBottom: 'var(--space-4)',
    fontWeight: '600',
    transition: 'color 0.2s',
    ...style
  };

  const handleMouseEnter = (e) => e.target.style.color = 'var(--color-primary)';
  const handleMouseLeave = (e) => e.target.style.color = 'var(--color-text-secondary)';

  if (href) {
    return (
      <Link 
        href={href} 
        style={{ ...buttonStyle, textDecoration: 'none' }}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {label}
      </Link>
    );
  }

  return (
    <button 
      onClick={() => {
        if (canGoBack) {
          router.back();
        } else {
          router.push(fallback);
        }
      }} 
      style={buttonStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Go back"
    >
      {label}
    </button>
  );
}

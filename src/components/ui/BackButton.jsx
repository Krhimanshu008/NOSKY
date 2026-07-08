'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BackButton({ label = '← Back', style = {} }) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // We want to show the back button only if the user has navigated from within our app.
    // If they landed on this page directly from a bookmark or external link, document.referrer will be empty or a different domain.
    if (document.referrer && document.referrer.includes(window.location.host)) {
      setCanGoBack(true);
    } else if (window.history.length > 2) {
      setCanGoBack(true);
    }
  }, []);

  if (!canGoBack) return null;

  return (
    <button 
      onClick={() => router.back()} 
      style={{
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
      }}
      onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
      onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
      aria-label="Go back"
    >
      {label}
    </button>
  );
}

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FloatingConnect() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show on desktop (screens wider than 768px)
    const checkWidth = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setHasScrolledPast(true);
      }
    };
    
    checkWidth();
    handleScroll();
    
    window.addEventListener('resize', checkWidth);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkWidth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hide if on article, achievement, or admin pages
  const isHiddenPage = pathname.startsWith('/article') || pathname.startsWith('/achievement') || pathname.startsWith('/admin');
  
  // Logic: Must be desktop. Must not be a hidden page. If on homepage, must have scrolled past 300px at least once.
  const shouldShow = isDesktop && !isHiddenPage && (pathname !== '/' || hasScrolledPast);

  if (!shouldShow) return null;

  return (
    <>
      <style>{`
        .floating-connect-btn {
          width: 56px;
          padding: 0;
          border-radius: 28px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .floating-connect-btn:hover {
          width: 160px;
          padding: 0 24px;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.6), 0 10px 15px -6px rgba(0, 0, 0, 0.4) !important;
        }
        .floating-connect-text {
          max-width: 0px;
          opacity: 0;
          margin-left: 0px;
          overflow: hidden;
          /* Instantly vanish on hover out */
          transition: none; 
        }
        .floating-connect-btn:hover .floating-connect-text {
          max-width: 150px;
          opacity: 1;
          margin-left: 10px;
          /* Smoothly appear on hover in */
          transition: all 0.3s ease;
          transition-delay: 0.05s;
        }
      `}</style>
      <Link 
        href="/contact"
        className="floating-connect-btn"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: 'var(--color-accent)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          height: '56px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          textDecoration: 'none'
        }}
        aria-label="Connect Us"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          
          <span className="floating-connect-text" style={{ 
            whiteSpace: 'nowrap',
            fontWeight: '600',
            fontSize: '1.05rem',
            letterSpacing: '0.02em',
            display: 'block'
          }}>
            Connect Us
          </span>
        </div>
      </Link>
    </>
  );
}

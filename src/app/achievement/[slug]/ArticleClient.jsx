'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import BackButton from '@/components/ui/BackButton';

export default function ArticleClient({ article }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isTransitioning = useRef(false);
  const downScrollCount = useRef(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll on desktop article page (content scrolls in its own panel)
  useEffect(() => {
    if (!isMobile) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    let lastWheelTime = 0;
    let atTopWhenSequenceStarted = false;
    let accumulatedUpScroll = 0;

    const handleWheel = (e) => {
      if (isTransitioning.current) return;

      const now = Date.now();
      const timeGap = now - lastWheelTime;
      lastWheelTime = now;

      // A gap of > 150ms means the user paused, so this is a new scroll gesture
      if (timeGap > 150) {
        const panel = contentRef.current;
        atTopWhenSequenceStarted = panel && panel.scrollTop <= 5;
        accumulatedUpScroll = 0;
        downScrollCount.current = 0;
      }

      if (!isScrolled) {
        if (e.deltaY > 0) {
          // Scrolling down in hero → enter split
          downScrollCount.current++;
          if (downScrollCount.current >= 3) {
            isTransitioning.current = true;
            setIsScrolled(true);
            setTimeout(() => { isTransitioning.current = false; }, 500);
          }
        }
      }

      if (isScrolled) {
        const panel = contentRef.current;
        const isAtTop = panel && panel.scrollTop <= 5;

        // ONLY allow reverse if this specific scroll gesture STARTED at the top.
        // If they scrolled from the bottom and hit the top, we ignore the momentum
        // because atTopWhenSequenceStarted will be false.
        if (e.deltaY < 0 && isAtTop && atTopWhenSequenceStarted) {

          // Accumulate the upward scroll distance
          accumulatedUpScroll += Math.abs(e.deltaY);

          // Require a deliberate upward scroll (equivalent to 250px) to reverse
          if (accumulatedUpScroll > 250) {
            accumulatedUpScroll = 0;
            isTransitioning.current = true;
            setIsScrolled(false);
            if (panel) panel.scrollTop = 0;
            setTimeout(() => { isTransitioning.current = false; }, 500);
          }
        } else if (e.deltaY > 0) {
          // Scrolling down resets the accumulator
          accumulatedUpScroll = 0;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isScrolled, isMobile]);

  // Mobile layout (unchanged)
  if (isMobile) {
    return (
      <article className="container" style={{ paddingTop: '120px', paddingBottom: 'var(--space-16)', maxWidth: '800px', minHeight: '80vh' }}>
        {article.coverImage && (
          <div style={{ marginBottom: 'var(--space-10)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        <div style={{ marginBottom: 'var(--space-12)' }}>
          <BackButton label="← Back" />
          <h1 style={{ fontSize: 'var(--text-4xl)', lineHeight: 1.15, marginBottom: 'var(--space-6)', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</span>
            {(article.cityLocation || article.geoRegion) && (
              <>
                <span style={{ opacity: 0.5 }}>•</span>
                <span>📍 {article.cityLocation}{article.cityLocation && article.geoRegion ? ', ' : ''}{article.geoRegion}</span>
              </>
            )}
          </div>
        </div>

        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    );
  }

  // ─── Desktop: Two fixed panels with crossfade ───
  return (
    <article style={{ minHeight: '100vh' }}>

      {/* ━━━ HERO VIEW (full-width centered image with headline overlay) ━━━ */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
        opacity: isScrolled ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: isScrolled ? 'none' : 'auto',
        zIndex: isScrolled ? 0 : 2,
      }}>
        <div style={{
          position: 'relative',
          width: '92%',
          maxWidth: '1100px',
          maxHeight: 'calc(100vh - 120px)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {article.coverImage && (
            !isScrolled ? (
              <motion.img 
                layoutId="article-cover-image" 
                src={article.coverImage} 
                alt={article.title} 
                style={{ width: '100%', maxHeight: 'calc(100vh - 120px)', objectFit: 'contain', display: 'block' }} 
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : (
              <div style={{ width: '100%', height: 'calc(100vh - 120px)' }} />
            )
          )}

          {/* Gradient overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}></div>

          {/* Headline overlay */}
          <div style={{ position: 'absolute', bottom: 'var(--space-12)', left: 'var(--space-12)', right: 'var(--space-12)' }}>
            {!isScrolled ? (
              <>
                <motion.h1 
                  layoutId="article-title" 
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} 
                  style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: 'var(--space-4)', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}
                >
                  {article.title}
                </motion.h1>

                <motion.div 
                  layoutId="article-meta" 
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} 
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-8)' }}
                >
                  <span>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</span>
                  {(article.cityLocation || article.geoRegion) && (
                    <>
                      <span style={{ opacity: 0.5 }}>•</span>
                      <span>📍 {article.cityLocation}{article.cityLocation && article.geoRegion ? ', ' : ''}{article.geoRegion}</span>
                    </>
                  )}
                </motion.div>
              </>
            ) : (
              <div style={{ height: '120px' }} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '1.1rem', fontWeight: '600', opacity: 0.9 }}>
              <div style={{ width: '30px', height: '2px', background: 'var(--color-primary)' }}></div>
              Scroll down to read full achievement
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ SPLIT VIEW (image left, scrollable content right) ━━━ */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: 0, right: 0, bottom: 0,
        display: 'flex',
        gap: '32px',
        padding: '24px 4%',
        opacity: isScrolled ? 1 : 0,
        transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: isScrolled ? 'auto' : 'none',
        zIndex: isScrolled ? 2 : 0,
        maxWidth: '1300px',
        margin: '0 auto',
      }}>
        {/* Image — fixed on left side, does not scroll */}
        <div style={{
          width: '38%',
          flexShrink: 0,
          alignSelf: 'flex-start',
          paddingTop: '8px',
        }}>
          <div style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}>
            {article.coverImage && (
              isScrolled ? (
                <motion.img 
                  layoutId="article-cover-image" 
                  src={article.coverImage} 
                  alt={article.title} 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : (
                <div style={{ width: '100%', paddingBottom: '60%' }} />
              )
            )}
          </div>
        </div>

        {/* Content — scrolls independently in its own panel */}
        <div
          ref={contentRef}
          className="article-content-panel"
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '12px',
            paddingBottom: '40px',
          }}
        >
          {/* Custom scrollbar */}
          <style dangerouslySetInnerHTML={{
            __html: `
            .article-content-panel::-webkit-scrollbar {
              width: 6px;
            }
            .article-content-panel::-webkit-scrollbar-track {
              background: transparent;
            }
            .article-content-panel::-webkit-scrollbar-thumb {
              background: rgba(255,255,255,0.15);
              border-radius: 3px;
            }
            .article-content-panel::-webkit-scrollbar-thumb:hover {
              background: rgba(255,255,255,0.25);
            }
            .prose {
              color: var(--color-text-secondary);
              font-size: 1.15rem;
              line-height: 1.8;
              font-weight: 400;
              text-align: justify;
            }
            .prose p {
              margin-bottom: 1.75em;
            }
            .prose h2, .prose h3 {
              color: var(--color-text-primary);
              font-weight: 700;
              margin-top: 2.2em;
              margin-bottom: 1em;
              line-height: 1.3;
              text-align: left;
            }
            .prose h2 {
              font-size: 1.875rem;
              border-bottom: 1px solid var(--color-border);
              padding-bottom: 0.3em;
            }
            .prose h3 {
              font-size: 1.5rem;
            }
            .prose ul, .prose ol {
              margin-bottom: 1.5em;
              padding-left: 1.5em;
              text-align: left;
            }
            .prose li {
              margin-bottom: 0.5em;
            }
            .prose blockquote {
              border-left: 4px solid var(--color-primary);
              padding-left: 1em;
              margin-left: 0;
              font-style: italic;
              color: var(--color-text-primary);
              background: rgba(255,255,255,0.03);
              padding: 1.5em;
              border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
              text-align: left;
            }
            .prose a {
              color: var(--color-primary);
              text-decoration: underline;
              text-underline-offset: 2px;
            }
            .prose a:hover {
              color: var(--color-accent);
            }
            .prose strong {
              color: var(--color-text-primary);
              font-weight: 600;
            }
            .prose img {
              max-width: 100px;
              height: auto;
              display: inline-block;
              vertical-align: middle;
              margin: 0 0.5rem;
              border-radius: var(--radius-sm);
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
          `}} />

          {/* Heading */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            {isScrolled ? (
              <>
                <BackButton label="← Back" />
                <motion.h1 
                  layoutId="article-title" 
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} 
                  style={{ fontSize: '2.25rem', lineHeight: 1.2, marginBottom: 'var(--space-4)', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}
                >
                  {article.title}
                </motion.h1>

                <motion.div 
                  layoutId="article-meta" 
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} 
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  <span>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</span>
                  {(article.cityLocation || article.geoRegion) && (
                    <>
                      <span style={{ opacity: 0.5 }}>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📍 {article.cityLocation}{article.cityLocation && article.geoRegion ? ', ' : ''}{article.geoRegion}
                      </span>
                    </>
                  )}
                </motion.div>
              </>
            ) : (
              <div style={{ height: '100px' }} />
            )}
          </div>

          {/* Article body */}
          <motion.div 
            className="prose"
            initial={false}
            animate={isScrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay: isScrolled ? 0.3 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </div>

    </article>
  );
}

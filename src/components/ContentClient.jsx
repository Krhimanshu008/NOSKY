'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import BackButton from '@/components/ui/BackButton';
import Image from 'next/image';

export default function ContentClient({ item, backPath, backLabel, scrollPromptText }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isTransitioning = useRef(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll on desktop to maintain "app-like" 100vh bounds
  useEffect(() => {
    if (!isMobile) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobile]);

  // Optimized wheel listener for silky smooth transitions
  useEffect(() => {
    if (isMobile) return;

    let lastWheelTime = 0;
    let accumulatedDownScroll = 0;
    let accumulatedUpScroll = 0;
    let atTopWhenSequenceStarted = false;

    const handleWheel = (e) => {
      if (isTransitioning.current) return;

      // Ignore wheel events that happen inside the left scrollable panel
      if (e.target.closest && e.target.closest('.left-panel-scroll')) return;

      const now = Date.now();
      const timeGap = now - lastWheelTime;
      lastWheelTime = now;

      // Reset accumulators if there's a pause in scrolling (e.g. > 150ms)
      if (timeGap > 150) {
        const panel = contentRef.current;
        atTopWhenSequenceStarted = panel && panel.scrollTop <= 5;
        accumulatedDownScroll = 0;
        accumulatedUpScroll = 0;
      }

      if (!isScrolled) {
        if (e.deltaY > 0) {
          accumulatedDownScroll += e.deltaY;
          // Instantly trigger once we accumulate 100px of scroll intention
          if (accumulatedDownScroll > 100) {
            isTransitioning.current = true;
            setIsScrolled(true);
            setTimeout(() => { isTransitioning.current = false; }, 600);
          }
        } else {
          accumulatedDownScroll = 0;
        }
      }

      if (isScrolled) {
        const panel = contentRef.current;
        const isAtTop = panel && panel.scrollTop <= 5;

        // Only allow reverse transition if the scroll sequence started at the very top of the item
        if (e.deltaY < 0 && isAtTop && atTopWhenSequenceStarted) {
          accumulatedUpScroll += Math.abs(e.deltaY);

          if (accumulatedUpScroll > 100) {
            accumulatedUpScroll = 0;
            isTransitioning.current = true;
            setIsScrolled(false);
            if (panel) panel.scrollTop = 0;
            setTimeout(() => { isTransitioning.current = false; }, 600);
          }
        } else if (e.deltaY > 0) {
          accumulatedUpScroll = 0;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isScrolled, isMobile]);

  if (isMobile) {
    return (
      <article className="container" style={{ paddingTop: '120px', paddingBottom: 'var(--space-16)', maxWidth: '800px', minHeight: '80vh' }}>
        {item.coverImage && (
          <div style={{ marginBottom: 'var(--space-10)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <Image src={item.coverImage} alt={item.title} width={800} height={450} priority style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        {item.aiSummary && (
          <div style={{ marginBottom: 'var(--space-10)', padding: 'var(--space-6)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: '600', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '16px' }}>
              ✨ Key Takeaways
            </h3>
            <div className="prose" style={{ fontSize: '1.05rem', lineHeight: '1.6', paddingTop: '12px' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.aiSummary}
              </ReactMarkdown>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 'var(--space-12)' }}>
          <BackButton fallback={backPath} label={backLabel} />
          <h1 style={{ fontSize: 'var(--text-4xl)', lineHeight: 1.15, marginBottom: 'var(--space-6)', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {item.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>{format(new Date(item.createdAt), 'MMMM d, yyyy')}</span>
            {(item.cityLocation || item.geoRegion) && (
              <>
                <span style={{ opacity: 0.5 }}>•</span>
                <span>📍 {item.cityLocation}{item.cityLocation && item.geoRegion ? ', ' : ''}{item.geoRegion}</span>
              </>
            )}
          </div>
        </div>

        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {item.content}
          </ReactMarkdown>
        </div>

        <style dangerouslySetInnerHTML={{
            __html: `
            .prose { color: var(--color-text-secondary); font-size: 1.15rem; line-height: 1.8; font-weight: 400; }
            .prose p { margin-bottom: 1.75em; }
            .prose h2, .prose h3 { color: var(--color-text-primary); font-weight: 700; margin-top: 2.2em; margin-bottom: 1em; line-height: 1.3; }
            .prose h2 { font-size: 1.875rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.3em; }
            .prose h3 { font-size: 1.5rem; }
            .prose ul { margin-bottom: 1.5em; padding-left: 1.5em; list-style-type: disc; color: var(--color-text-primary); }
            .prose ol { margin-bottom: 1.5em; padding-left: 1.5em; list-style-type: decimal; color: var(--color-text-primary); }
            .prose li { margin-bottom: 0.5em; display: list-item; }
            .prose li::marker { color: var(--color-primary); }
            .prose blockquote { border-left: 4px solid var(--color-primary); padding-left: 1em; font-style: italic; color: var(--color-text-primary); background: rgba(255,255,255,0.03); padding: 1.5em; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
            .prose a { color: var(--color-primary); text-decoration: underline; text-underline-offset: 2px; }
            .prose a:hover { color: var(--color-accent); }
            .prose strong { color: var(--color-text-primary); font-weight: 600; }
            .prose img { max-width: 100%; min-width: 280px; height: auto; display: block; margin: 2rem auto; border-radius: var(--radius-md); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
          `}} />
      </article>
    );
  }

  // ─── Desktop: Fixed 100vh Layout with Optimized Wheel Toggle ───
  return (
    <article style={{ minHeight: '100vh' }}>

      {/* Permanent Global Back Button */}
      <div style={{ position: 'fixed', top: '50px', left: '4%', zIndex: 100 }}>
        <BackButton
          fallback={backPath}
          label=""
          style={{
            color: 'var(--color-text-primary)',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.6) 100%)',
            padding: '10px',
            fontSize: '1.25rem',
            borderRadius: '50%',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.8), inset 2px 2px 8px rgba(255,255,255,0.25), 0 10px 24px rgba(0,0,0,0.5)',
            width: '48px',
            height: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
      </div>

      {/* ━━━ HERO VIEW (full-width centered image with headline overlay) ━━━ */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '30px',
        opacity: isScrolled ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: isScrolled ? 'none' : 'auto',
        zIndex: isScrolled ? 0 : 2,
      }}>
        <div style={{
          position: 'relative',
          width: '92%',
          maxWidth: '1100px',
          maxHeight: 'calc(100vh - 80px)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {item.coverImage && (
            !isScrolled ? (
              <motion.img
                layoutId="article-cover-image"
                src={item.coverImage}
                alt={item.title}
                style={{ width: '100%', maxHeight: 'calc(100vh - 80px)', objectFit: 'contain', display: 'block' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : (
              <div style={{ width: '100%', height: 'calc(100vh - 80px)' }} />
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
                  {item.title}
                </motion.h1>

                <motion.div
                  layoutId="article-meta"
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-8)' }}
                >
                  <span>{format(new Date(item.createdAt), 'MMMM d, yyyy')}</span>
                  {(item.cityLocation || item.geoRegion) && (
                    <>
                      <span style={{ opacity: 0.5 }}>•</span>
                      <span>📍 {item.cityLocation}{item.cityLocation && item.geoRegion ? ', ' : ''}{item.geoRegion}</span>
                    </>
                  )}
                </motion.div>
              </>
            ) : (
              <div style={{ height: '120px' }} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '1.1rem', fontWeight: '600', opacity: 0.9 }}>
              <div style={{ width: '30px', height: '2px', background: 'var(--color-primary)' }}></div>
              {scrollPromptText}
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ SPLIT VIEW (image left, scrollable content right) ━━━ */}
      <div style={{
        position: 'fixed',
        top: '60px',
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
        {/* Left Column (Fixed Image) */}
        <div
          className="left-panel-scroll"
          style={{
            width: '38%',
            flexShrink: 0,
            alignSelf: 'stretch',
            paddingTop: '8px',
            overflowY: 'auto',
            paddingBottom: '40px',
            maxHeight: '100%'
          }}
        >
          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            {item.coverImage && (
              isScrolled ? (
                <motion.img
                  layoutId="article-cover-image"
                  src={item.coverImage}
                  alt={item.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : (
                <div style={{ width: '100%', paddingBottom: '60%' }} />
              )
            )}
          </div>

          {item.aiSummary && isScrolled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(10px)' }}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: '600', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '16px' }}>
                ✨ Key Takeaways
              </h3>
              <div className="prose" style={{ fontSize: '1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', paddingTop: '12px' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.aiSummary}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column (Scrollable Content in its own panel) */}
        <div
          ref={contentRef}
          className="article-content-panel"
          style={{ flex: 1, overflowY: 'auto', paddingRight: '12px', paddingBottom: '40px' }}
        >
          {/* Custom scrollbar for the internal panel */}
          <style dangerouslySetInnerHTML={{
            __html: `
            .left-panel-scroll::-webkit-scrollbar { display: none; }
            .left-panel-scroll { -ms-overflow-style: none; scrollbar-width: none; }

            .article-content-panel::-webkit-scrollbar { width: 6px; }
            .article-content-panel::-webkit-scrollbar-track { background: transparent; }
            .article-content-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
            .article-content-panel::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }

            .prose {
              color: var(--color-text-secondary);
              font-size: 1.25rem;
              line-height: 1.8;
              font-weight: 400;
            }
            .prose p { margin-bottom: 1.75em; }
            .prose h2, .prose h3 {
              color: var(--color-text-primary);
              font-weight: 700;
              margin-top: 2.2em;
              margin-bottom: 1em;
              line-height: 1.3;
            }
            .prose h2 { font-size: 2rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.3em; }
            .prose h3 { font-size: 1.5rem; }
            .prose ul { margin-bottom: 1.5em; padding-left: 1.5em; list-style-type: disc; color: var(--color-text-primary); }
            .prose ol { margin-bottom: 1.5em; padding-left: 1.5em; list-style-type: decimal; color: var(--color-text-primary); }
            .prose li { margin-bottom: 0.5em; display: list-item; }
            .prose li::marker { color: var(--color-primary); }
            .prose blockquote {
              border-left: 4px solid var(--color-primary);
              padding-left: 1em;
              font-style: italic;
              color: var(--color-text-primary);
              background: rgba(255,255,255,0.03);
              padding: 1.5em;
              border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            }
            .prose a { color: var(--color-primary); text-decoration: underline; text-underline-offset: 2px; }
            .prose a:hover { color: var(--color-accent); }
            .prose strong { color: var(--color-text-primary); font-weight: 600; }
            .prose img {
              max-width: 100%;
              min-width: 300px;
              height: auto;
              display: block;
              margin: 3rem auto;
              border-radius: var(--radius-lg);
              box-shadow: 0 12px 36px rgba(0,0,0,0.5);
            }
          `}} />

          <div style={{ marginBottom: 'var(--space-8)' }}>
            {isScrolled ? (
              <>
                <motion.h1
                  layoutId="article-title"
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: 'var(--space-4)', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}
                >
                  {item.title}
                </motion.h1>

                <motion.div
                  layoutId="article-meta"
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  <span>{format(new Date(item.createdAt), 'MMMM d, yyyy')}</span>
                  {(item.cityLocation || item.geoRegion) && (
                    <>
                      <span style={{ opacity: 0.5 }}>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📍 {item.cityLocation}{item.cityLocation && item.geoRegion ? ', ' : ''}{item.geoRegion}
                      </span>
                    </>
                  )}
                </motion.div>
              </>
            ) : (
              <div style={{ height: '100px' }} />
            )}
          </div>

          <motion.div
            className="prose"
            initial={false}
            animate={isScrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay: isScrolled ? 0.3 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

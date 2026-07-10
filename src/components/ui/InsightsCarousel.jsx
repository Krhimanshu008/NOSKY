'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';
import Image from 'next/image';

export default function InsightsCarousel({ items = [], type = 'article' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Configuration based on type
  const config = type === 'article' ? {
    title: 'Latest Articles',
    fallbackDesc: 'Read our latest thoughts on cybersecurity, data protection, and enterprise compliance.',
    btnText: 'Read Articles →',
    btnHref: '/article',
    baseHref: '/article',
    iconColor: 'var(--color-text-primary)',
    iconBg: 'rgba(255,255,255,0.05)',
    iconBorder: 'rgba(255,255,255,0.1)',
    iconShadow: 'none',
    btnColor: 'var(--color-text-primary)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    )
  } : {
    title: 'Our Achievements',
    fallbackDesc: 'Discover the partnerships, recognitions, and major milestones NoSky has achieved.',
    btnText: 'View Achievements →',
    btnHref: '/achievements',
    baseHref: '/achievement',
    iconColor: 'var(--color-accent)',
    iconBg: 'rgba(245, 166, 35, 0.1)',
    iconBorder: 'rgba(245, 166, 35, 0.2)',
    iconShadow: '0 0 20px rgba(245, 166, 35, 0.15)',
    btnColor: 'var(--color-accent)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15l-3.09 1.63.59-3.45L7 10.74l3.46-.5L12 7l1.54 3.24 3.46.5-2.5 2.44.59 3.45z"></path>
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    )
  };

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) {
    return (
      <GlassCard style={{ padding: 'var(--space-10)', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: 'var(--radius-md)',
          background: config.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 'var(--space-6)', border: `1px solid ${config.iconBorder}`,
          boxShadow: config.iconShadow, color: config.iconColor
        }}>
          {config.icon}
        </div>
        <h3 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-3)' }}>{config.title}</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.6, marginBottom: 'var(--space-8)', flexGrow: 1 }}>
          {config.fallbackDesc}
        </p>
        <Link href={config.btnHref} className="btn btn-ghost" style={{ alignSelf: 'flex-start', paddingLeft: 0, color: config.btnColor }}>
          {config.btnText}
        </Link>
      </GlassCard>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <GlassCard style={{ position: 'relative', overflow: 'hidden', height: '100%', minHeight: '380px', display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* Render all background images to ensure smooth transitions and preloading */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: currentIndex === idx ? 1 : 0,
              scale: currentIndex === idx ? 1 : 1.05,
              zIndex: currentIndex === idx ? 1 : 0
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          >
            {item.coverImage ? (
              <div style={{ position: 'absolute', inset: 0 }}>
                <Image 
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={idx === 0}
                />
              </div>
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.02)' }} />
            )}
            {/* Heavy gradient overlay for readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,13,24,1) 0%, rgba(10,13,24,0.85) 40%, rgba(10,13,24,0.3) 100%)' }} />
          </motion.div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'auto' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            color: config.iconColor
          }}>
            {config.icon}
          </div>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            {items.map((_, idx) => (
              <div key={idx} style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: idx === currentIndex ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-10)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
            {config.title}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-3)', lineHeight: 1.3, color: '#fff' }}>
                <Link href={`${config.baseHref}/${currentItem.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {currentItem.title}
                </Link>
              </h3>
            </motion.div>
          </AnimatePresence>

          <Link href={`${config.baseHref}/${currentItem.slug}`} className="btn btn-ghost" style={{ alignSelf: 'flex-start', paddingLeft: 0, color: config.btnColor }}>
            Read more <span className="btn-icon">→</span>
          </Link>
        </div>
      </div>
      
      {/* Invisible link overlay for the whole card */}
      <Link href={`${config.baseHref}/${currentItem.slug}`} style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <span style={{ display: 'none' }}>{currentItem.title}</span>
      </Link>
    </GlassCard>
  );
}

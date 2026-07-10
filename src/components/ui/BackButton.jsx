'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BackButton({ label = 'Back', href, fallback = '/', style = {}, className = '' }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    gap: '8px',
    padding: '8px 0',
    marginBottom: 'var(--space-4)',
    fontWeight: '600',
    transition: 'color 0.2s',
    ...style
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.color = 'var(--color-primary)';
    setIsHovered(true);
  };
  
  const handleMouseLeave = (e) => {
    e.currentTarget.style.color = 'var(--color-text-secondary)';
    setIsHovered(false);
  };

  const iconContent = (
    <motion.div
      animate={isHovered ? "hover" : "rest"}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <motion.div
        variants={{
          rest: { 
            x: 0, 
            y: 0,
            scale: 1, 
            opacity: 1, 
            rotateZ: 0
          },
          hover: { 
            x: [0, -25, 25, 0],
            y: [0, -6, -6, 0], // Archives slightly up to match the 3D orbit
            scale: [1, 0.2, 0.2, 1],
            opacity: [1, 0, 0, 1],
            rotateZ: [0, -20, 20, 0],
            transition: { 
              duration: 0.75, 
              ease: "easeInOut",
              times: [0, 0.4, 0.6, 1]
            } 
          }
        }}
        style={{ display: 'inline-flex', position: 'relative' }}
      >
        {/* Curved 3D Beam Trail */}
        <svg 
          width="50" height="12" 
          viewBox="0 0 50 12" 
          style={{ 
            position: 'absolute', 
            left: 'calc(50% - 25px)', 
            top: 'calc(50% - 12px)',
            zIndex: 0,
            overflow: 'visible'
          }}
        >
          <motion.path
            d="M 25 12 A 25 6 0 0 1 0 6 A 25 6 0 0 1 25 0 A 25 6 0 0 1 50 6 A 25 6 0 0 1 25 12"
            fill="none"
            stroke="#f5a623"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0px 0px 4px #f5a623)' }}
            variants={{
              rest: { pathLength: 0, pathOffset: 0, opacity: 0 },
              hover: { 
                pathLength: [0, 0.25, 0.5, 0],
                pathOffset: [0, 0, 0.25, 1],
                opacity: [0, 1, 1, 0],
                transition: { duration: 0.75, ease: "easeInOut", times: [0, 0.4, 0.6, 1] }
              }
            }}
          />
        </svg>

        {/* Arrow SVG */}
        <motion.svg 
          variants={{
            rest: { filter: 'drop-shadow(0px 0px 0px rgba(245,166,35,0))', color: 'currentColor' },
            hover: { 
              filter: [
                'drop-shadow(0px 0px 0px rgba(245,166,35,0))', 
                'drop-shadow(0px 0px 8px rgba(245,166,35,0.8))', 
                'drop-shadow(0px 0px 8px rgba(245,166,35,0.8))', 
                'drop-shadow(0px 0px 0px rgba(245,166,35,0))'
              ],
              color: ['var(--color-primary)', '#f5a623', '#f5a623', 'var(--color-primary)'],
              transition: { duration: 0.75, times: [0, 0.4, 0.6, 1] }
            }
          }}
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </motion.svg>
      </motion.div>
    </motion.div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        style={{ ...buttonStyle, textDecoration: 'none' }}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {iconContent}
        {label && <span>{label}</span>}
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
      {iconContent}
      {label && <span>{label}</span>}
    </button>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const HardwareConnector = ({ position }) => (
  <div style={{
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    [position === 'top' ? 'top' : 'bottom']: '-4px',
    width: '20px',
    height: '6px',
    background: 'linear-gradient(to bottom, #2a2d35, #1a1c23)',
    borderRadius: '3px',
    border: '1px solid rgba(255,255,255,0.15)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
    zIndex: 2
  }}>
    <div style={{ position: 'absolute', left: '4px', top: '2px', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
    <div style={{ position: 'absolute', right: '4px', top: '2px', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
  </div>
);

export default function RansomwareReality() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="section" id="problem-statement" style={{ position: 'relative', overflow: 'hidden', zIndex: 5, paddingTop: 'var(--space-8)' }}>
      <style>{`
        .info-cards-col { margin-top: 140px; }
        @media (max-width: 768px) {
          .info-cards-col { margin-top: var(--space-8); }
        }
      `}</style>
      {/* 2-column Grid Layout */}
      <div className="container grid grid-2" style={{ gap: 'var(--space-16)', alignItems: 'flex-start' }}>
        
        {/* Left Column: Suspended Placard Assembly */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Anchor: The Nosky Logo at the top */}
          <div style={{ position: 'relative', width: 80, height: 40 }}>
            <Image src="/noskywhite.webp" alt="Nosky Anchor" fill style={{ objectFit: 'contain' }} />
          </div>

          {/* The Rope/Cable */}
          <div style={{
            width: '2px',
            height: '100px',
            background: 'linear-gradient(to bottom, var(--color-accent), rgba(245, 166, 35, 0.2))',
            boxShadow: '0 0 10px var(--color-accent)',
            zIndex: 1,
            transform: 'translateX(-3px)'
          }}></div>

          {/* The Floating Placard */}
          <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--color-accent-light)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-10)',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
            maxWidth: '100%',
            animation: 'float 6s ease-in-out infinite',
            zIndex: 2,
            position: 'relative'
          }}>
            {/* Pulsing Alert Dot & Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
              <div style={{ position: 'relative', width: '10px', height: '10px' }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--color-danger)', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--color-danger)' }}></span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-danger)', fontWeight: 700 }}>
                The Reality
              </span>
            </div>

            <h2 style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-3xl)' }}>
              Every <span className="text-gradient">11 seconds</span>, a business is hit by ransomware.
            </h2>
            
            <p style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
              Ransomware attacks on SMBs rose 300% between 2022 and 2025. 60% of small businesses close within six months of a major data-loss event. And 85% of breaches involve a human element. 
              <br/><br/>
              <strong style={{ color: 'var(--color-text-primary)' }}>NoSky was built for this reality</strong> — automated, encrypted, immutable backups that restore your business in minutes, not days.
            </p>

            {/* Interactive Read More Link */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <a href="https://www.verizon.com/business/resources/reports/dbir/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)' }}></span>
                Verizon DBIR
              </a>
              <a href="https://staysafeonline.org/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)' }}></span>
                NCSA Report
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Info Cards (Hanging Chain Animation) */}
        <div className="info-cards-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          
          {/* Card 1 */}
          <motion.div
            layout
            onHoverStart={() => setHoveredCard(0)}
            onHoverEnd={() => setHoveredCard(null)}
            style={{ zIndex: 1, position: 'relative', width: '100%', cursor: 'pointer' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <HardwareConnector position="bottom" />
            <GlassCard className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', padding: 'var(--space-6)' }}>
              <div className="card-icon" style={{ marginBottom: 0, flexShrink: 0, width: 48, height: 48 }}>🔐</div>
              <div>
                <h3 className="card-title" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>Immutable by default</h3>
                <p className="card-desc" style={{ fontSize: 'var(--text-sm)', marginBottom: 0 }}>
                  Every backup is write-locked so ransomware cannot encrypt or delete your recovery point. Not even a compromised admin can alter your data.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Link Thread 1 */}
          <motion.div 
            layout
            initial={false}
            animate={{ height: hoveredCard === 0 || hoveredCard === 1 ? 48 : 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ width: '2px', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)', zIndex: 0 }} 
          />

          {/* Card 2 */}
          <motion.div
            layout
            onHoverStart={() => setHoveredCard(1)}
            onHoverEnd={() => setHoveredCard(null)}
            style={{ zIndex: 1, position: 'relative', width: '100%', cursor: 'pointer' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <HardwareConnector position="top" />
            <HardwareConnector position="bottom" />
            <GlassCard className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', padding: 'var(--space-6)' }}>
              <div className="card-icon" style={{ marginBottom: 0, flexShrink: 0, width: 48, height: 48 }}>⚡</div>
              <div>
                <h3 className="card-title" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>15-minute recovery</h3>
                <p className="card-desc" style={{ fontSize: 'var(--text-sm)', marginBottom: 0 }}>
                  Restore any file, folder, or entire server in under 15 minutes with one-click restore. Get your business back online before anyone notices.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Link Thread 2 */}
          <motion.div 
            layout
            initial={false}
            animate={{ height: hoveredCard === 1 || hoveredCard === 2 ? 48 : 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ width: '2px', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)', zIndex: 0 }} 
          />

          {/* Card 3 */}
          <motion.div
            layout
            onHoverStart={() => setHoveredCard(2)}
            onHoverEnd={() => setHoveredCard(null)}
            style={{ zIndex: 1, position: 'relative', width: '100%', cursor: 'pointer' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <HardwareConnector position="top" />
            <GlassCard className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', padding: 'var(--space-6)' }}>
              <div className="card-icon" style={{ marginBottom: 0, flexShrink: 0, width: 48, height: 48 }}>🔄</div>
              <div>
                <h3 className="card-title" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>Set it and forget it</h3>
                <p className="card-desc" style={{ fontSize: 'var(--text-sm)', marginBottom: 0 }}>
                  Continuous, incremental backups run silently in the background. Zero user action required after initial setup. Your data is always protected.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import Link from 'next/link';
import GlassCard from './GlassCard';

export default function NoskyGlassSection() {
  return (
    <section className="section platform-section" id="features">
      <div className="container platform-section-inner">
        <div className="pill-wrap">
          <span className="pill">
            <span className="pill-dot"></span>
            PLATFORM
          </span>
        </div>
        <h2 className="platform-title" style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
          One platform. <span className="platform-title-accent text-accent">Every workload.</span>
        </h2>
        <p className="platform-subtitle" style={{ textAlign: 'center', marginBottom: 'var(--space-12)', color: 'var(--color-text-secondary)' }}>
          Protect servers, endpoints, SaaS apps, and VMs from a single dashboard.
        </p>

        {/* Featured Suite Card */}
        <GlassCard className="hero-card" isHero={true} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 'var(--space-6)', padding: 'var(--space-6) var(--space-8)', alignItems: 'center', margin: '0 auto var(--space-8)', maxWidth: '900px', position: 'relative' }}>
          <div className="hero-glow" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}></div>
          <div className="hero-icon-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <div className="hero-icon" style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent), #E09515)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 40, height: 40 }}>
                <path d="M4 12a8 8 0 0116 0"/>
                <path d="M12 3v1"/>
                <path d="M12 12v9"/>
                <path d="M3 12h1"/>
                <path d="M20 12h1"/>
              </svg>
            </div>
          </div>
          <div className="hero-text" style={{ zIndex: 1 }}>
            <div className="hero-tag" style={{ color: 'var(--color-accent)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.15em', marginBottom: 'var(--space-2)' }}>FLAGSHIP</div>
            <h3 className="hero-card-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-2)', fontWeight: 800 }}>Nosky Suite</h3>
            <p className="hero-desc" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: '1.5', maxWidth: '400px' }}>The unified ecosystem connecting all your business protection and management solutions in one place.</p>
          </div>
          <div className="hero-metrics" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderLeft: '1px solid var(--color-border)', paddingLeft: 'var(--space-6)', zIndex: 1 }}>
            <div className="metric" style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
              <div className="metric-num" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-accent)' }}>4</div>
              <div className="metric-label" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Products</div>
            </div>
            <div className="metric" style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
              <div className="metric-num" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>1</div>
              <div className="metric-label" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</div>
            </div>
            <div className="metric" style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
              <div className="metric-num" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>∞</div>
              <div className="metric-label" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workloads</div>
            </div>
          </div>
        </GlassCard>

        {/* Product Grid */}
        <div className="platform-grid grid grid-4">
          {/* Card 1 */}
          <Link href="/product/nosky-backup" style={{ textDecoration: 'none' }}>
            <GlassCard className="platform-card" style={{ padding: 'var(--space-8)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="card-icon" style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36 }}>
                  <path d="M17.5 19a4.5 4.5 0 100-9 6 6 0 00-11.6 1.5A4 4 0 006 19h11.5z"/>
                </svg>
              </div>
              <div className="card-body" style={{ flexGrow: 1 }}>
                <div className="card-eyebrow" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>Backup</div>
                <h3 className="platform-card-title" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>Nosky Backup Pro</h3>
                <p className="platform-card-desc" style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>Backup services for any type of industry.</p>
              </div>
            </GlassCard>
          </Link>

          {/* Card 2 */}
          <Link href="/product/nosky-crm" style={{ textDecoration: 'none' }}>
            <GlassCard className="platform-card" style={{ padding: 'var(--space-8)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="card-icon" style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36 }}>
                  <circle cx="9" cy="8" r="3"/>
                  <circle cx="17" cy="10" r="2.4"/>
                  <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                  <path d="M15 19c0-2.2 1.6-4 4-4s2 1.4 2 3"/>
                </svg>
              </div>
              <div className="card-body" style={{ flexGrow: 1 }}>
                <div className="card-eyebrow" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>CRM</div>
                <h3 className="platform-card-title" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>Nosky CRM</h3>
                <p className="platform-card-desc" style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>Customer relationship management.</p>
              </div>
            </GlassCard>
          </Link>

          {/* Card 3 */}
          <Link href="/product/nosky-manage" style={{ textDecoration: 'none' }}>
            <GlassCard className="platform-card" style={{ padding: 'var(--space-8)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="card-icon" style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36 }}>
                  <rect x="3" y="7" width="18" height="13" rx="2"/>
                  <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <path d="M3 13h18"/>
                </svg>
              </div>
              <div className="card-body" style={{ flexGrow: 1 }}>
                <div className="card-eyebrow" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>HR</div>
                <h3 className="platform-card-title" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>Nosky Manage 2.0</h3>
                <p className="platform-card-desc" style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>HR management software.</p>
              </div>
            </GlassCard>
          </Link>

          {/* Card 4 */}
          <Link href="/product/nosky-finvault" style={{ textDecoration: 'none' }}>
            <GlassCard className="platform-card" style={{ padding: 'var(--space-8)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="card-icon" style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36 }}>
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                  <path d="M12 8v6"/>
                  <path d="M9 11h6"/>
                  <path d="M8 18h8"/>
                </svg>
              </div>
              <div className="card-body" style={{ flexGrow: 1 }}>
                <div className="card-eyebrow" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>Finance</div>
                <h3 className="platform-card-title" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>Nosky Finvault</h3>
                <p className="platform-card-desc" style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>Backup services specifically in the finance sector.</p>
              </div>
            </GlassCard>
          </Link>
        </div>
      </div>
    </section>
  );
}

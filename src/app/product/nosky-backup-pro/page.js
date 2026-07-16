import Link from 'next/link';
import CTASection from '@/components/ui/CTASection';

export const metadata = {
  title: 'Nosky Backup Pro — Cloud Backup & Recovery',
  description:
    'Cloud backup and recovery that\'s fast, secure & effortless. AES-256 encryption, ransomware protection, 15-minute recovery. Available for Windows, macOS, and Linux. Powered by AWS.',
  openGraph: {
    title: 'Nosky Backup Pro — Cloud Backup & Recovery',
    description:
      'Designed for businesses, remote teams, and individuals who can\'t afford to lose their digital assets.',
  },
};

const securityCards = [
  {
    icon: '🔒',
    title: 'Military-Grade Encryption',
    desc: 'All files are encrypted in transit and at rest using AES-256 encryption, ensuring top-tier security and compliance.',
    tags: [],
  },
  {
    icon: '📋',
    title: 'Limitless Scalability, Total Compliance',
    desc: 'Unlimited scalability with full compliance. Meet the strictest data protection standards across every industry.',
    tags: ['HIPAA', 'ISO 27001', 'GDPR', 'SOC 2'],
  },
  {
    icon: '☁️',
    title: 'Secure, Scalable, Always-On',
    desc: 'Choose AWS to store your data in a secure, compliant environment you control. Enjoy real-time updates, unmatched reliability, and global scalability — all without third-party risks.',
    tags: [],
  },
];

const platforms = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5.5L11 4v8H3V5.5Z" fill="currentColor" />
        <path d="M12 3.88L21 2.5V12h-9V3.88Z" fill="currentColor" />
        <path d="M3 13h8v7L3 18.5V13Z" fill="currentColor" />
        <path d="M12 13h9v6.5L12 21V13Z" fill="currentColor" />
      </svg>
    ),
    label: 'Windows',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C9.5 2 7.5 3 6.2 4.7c-1.6-.2-3 .4-4 1.6-1 1.3-1 3 0 4.4-.6 1.2-.6 2.6 0 3.8 1 1.3 2.4 1.8 4 1.6C7.5 17.9 9.5 19 12 19c2.5 0 4.5-1.1 5.8-2.9 1.6.2 3-.4 4-1.6 1-1.3 1-3 0-4.4.6-1.2.6-2.6 0-3.8-1-1.3-2.4-1.8-4-1.6C16.5 3 14.5 2 12 2Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2Zm0 9c-2.7 0-4-1.3-4-2 0-2.7 4-3 4-3s4 .3 4 3c0 .7-1.3 2-4 2Z" fill="white" opacity="0.6" />
      </svg>
    ),
    label: 'macOS',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2a1 1 0 0 1 .894.553l3 6A1 1 0 0 1 15 10H9a1 1 0 0 1-.894-1.447l3-6A1 1 0 0 1 12 2Zm-7 13a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
          fill="currentColor"
        />
      </svg>
    ),
    label: 'Linux',
  },
];

const features = [
  {
    icon: '🛡️',
    title: 'Ransomware-Ready',
    desc: 'Your data is protected against the latest ransomware threats, ensuring business continuity even in the event of an attack.',
  },
  {
    icon: '📅',
    title: 'Backup Scheduling',
    desc: 'Automate your backups with customizable scheduling to ensure data is always up to date.',
  },
  {
    icon: '📦',
    title: 'Compression',
    desc: 'Reduce data size with advanced compression, saving bandwidth and storage costs significantly.',
  },
  {
    icon: '🔄',
    title: 'Disaster Recovery',
    desc: 'Ensure your business stays operational with fast & reliable recovery time, getting you back on track in minutes.',
  },
  {
    icon: '🕐',
    title: '24/7 Technical Support',
    desc: 'Our team of experts is available around the clock to assist you with any issues you encounter.',
  },
  {
    icon: '🔐',
    title: 'Data Security',
    desc: 'Nosky Backup Solution offers a highly secured and verified data deletion process for complete peace of mind.',
  },
  {
    icon: '🚀',
    title: 'Easy Software Deployment',
    desc: 'Simple and fast installation with minimal setup time across various platforms — up and running in minutes.',
  },
  {
    icon: '⚡',
    title: 'Incremental Backup',
    desc: 'Save time and storage with incremental backups that backup only the changed data since the last snapshot.',
  },
  {
    icon: '🖥️',
    title: 'Customer Portal',
    desc: 'Get a personalized portal where you can view backup progress, manage restore points, and monitor storage — all in one place.',
  },
  {
    icon: '🔑',
    title: '2FA Data Protection',
    desc: 'Nosky Backup Solution ensures the safety & security of the data with two-factor authentication for Data Protection.',
  },
  {
    icon: '📊',
    title: 'Reporting & Monitoring',
    desc: 'Stay in control with detailed reports and real-time monitoring of backup status across all your endpoints.',
  },
  {
    icon: '☁️',
    title: 'Industry-Leading Cloud Backup',
    desc: 'Harness the power of AWS for fast, secure, and scalable cloud backups with AES 256-Bit Encryption at rest & in transit.',
  },
];

export default function NoskyBackupProPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="product-hero" id="hero">
        <div className="product-hero-inner">
          <div className="product-badge-pill">
            <span className="product-badge-dot" />
            We back you up
          </div>

          <h1>
            Cloud backup &amp; recovery that&apos;s{' '}
            <span className="text-gradient-blue">fast, secure &amp;</span>
            <br />
            <span className="text-gradient-blue">effortless</span>
          </h1>

          <p className="hero-sub">
            Designed for businesses, remote teams, and individuals who can&apos;t afford to lose
            their digital assets. Available for Windows, macOS, and Linux.
          </p>

          <div className="product-hero-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Download for free <span className="btn-icon">→</span>
            </Link>
            <Link href="#features" className="btn btn-secondary btn-lg">
              See how it works
            </Link>
          </div>

          <p className="product-trust-line">
            Windows &bull; macOS &bull; Linux &mdash; no credit card required.
          </p>
        </div>
      </section>

      {/* ── SECURITY & COMPLIANCE ── */}
      <section className="section section-border" id="security">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-success">Security &amp; Compliance</span>
            <h2>Enterprise-grade protection you can verify</h2>
            <p>
              Your data deserves the same protection as Fortune 500 companies.
              Nosky delivers military-grade security with full compliance built in.
            </p>
          </div>

          <div className="security-grid">
            {securityCards.map((card) => (
              <div key={card.title} className="security-card">
                <div className="security-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                {card.tags.length > 0 && (
                  <div className="compliance-tags">
                    {card.tags.map((tag) => (
                      <span key={tag} className="compliance-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM SUPPORT ── */}
      <section className="section section-sm">
        <div className="container">
          <div className="platform-banner">
            <h2>
              One Solution,{' '}
              <span className="text-gradient">All Platforms</span>
            </h2>
            <div className="platform-badges-row">
              {platforms.map((p) => (
                <div key={p.label} className="platform-badge">
                  {p.icon}
                  {p.label}
                </div>
              ))}

              {/* AWS Badge */}
              <div
                className="platform-badge"
                style={{ borderColor: 'rgba(255,153,0,0.3)', background: 'rgba(255,153,0,0.06)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 13.5c-.6.3-1.2.7-1.6 1.2-.4.5-.6 1.1-.4 1.7.2.7.9 1.1 1.6 1.3 1.3.3 2.7.1 3.8-.5M17 13.5c.6.3 1.2.7 1.6 1.2.4.5.6 1.1.4 1.7-.2.7-.9 1.1-1.6 1.3-1.3.3-2.7.1-3.8-.5"
                    stroke="#FF9900"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6Z"
                    fill="#FF9900"
                    opacity="0.15"
                  />
                  <text x="6.5" y="13" fontSize="6" fontWeight="bold" fill="#FF9900">aws</text>
                </svg>
                Powered by AWS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section className="section section-border" id="features">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Key Features</span>
            <h2>
              The better{' '}
              <span className="text-gradient">backup choice</span>
            </h2>
            <p>
              Nosky Backup Pro offers cloud-based backup and recovery that&apos;s fast, secure, and
              effortless — designed for businesses, remote teams, and individuals who can&apos;t
              afford to lose their digital assets.
            </p>
          </div>

          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card-icon">{f.icon}</div>
                <div className="feature-card-body">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-16)' }}>
            <p
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Save It. Shut It.{' '}
              <span className="text-gradient">Forget It.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── AWS PARTNERSHIP ── */}
      <section className="section">
        <div className="container">
          <div className="aws-banner">
            <div className="aws-banner-logo">
              <div className="aws-logo-mark">
                <svg width="48" height="30" viewBox="0 0 120 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M33.7 30.3c0 1.7.2 3.1.5 4.1.4 1 .9 2.1 1.6 3.3.3.4.4.9.4 1.3 0 .6-.4 1.2-1.1 1.8l-3.7 2.5c-.5.3-1 .5-1.5.5-.6 0-1.2-.3-1.7-.8-1-1.1-1.8-2.2-2.5-3.3a22.5 22.5 0 0 1-2.1-4.5c-2.6 3.1-5.9 4.7-9.9 4.7-2.8 0-5.1-.8-6.7-2.4-1.6-1.6-2.4-3.8-2.4-6.4 0-2.8 1-5.1 3-6.9 2-1.8 4.7-2.7 8-2.7 1.1 0 2.3.1 3.5.3 1.2.2 2.5.5 3.8.9v-2.4c0-2.5-.5-4.2-1.6-5.2-1-1-2.8-1.5-5.4-1.5-1.2 0-2.4.1-3.6.4-1.3.3-2.5.7-3.7 1.2-.5.2-1 .4-1.2.4-.7 0-1-.5-1-1.6v-2.5c0-.8.1-1.4.4-1.8.3-.4.8-.8 1.6-1.1 1.2-.6 2.6-1.1 4.4-1.5 1.7-.4 3.5-.6 5.5-.6 4.2 0 7.3 1 9.2 2.9 1.9 1.9 2.9 4.8 2.9 8.7v11.4Zm-13.7 5.1c1.1 0 2.2-.2 3.4-.6 1.2-.4 2.2-1.1 3.1-2.1.5-.6.9-1.3 1.1-2.1.2-.8.3-1.8.3-3v-1.4a27 27 0 0 0-3-.5c-1-.1-2-.2-3-.2-2.1 0-3.7.4-4.7 1.3-1 .9-1.5 2.1-1.5 3.7 0 1.5.4 2.6 1.2 3.4.7.9 1.8 1.5 3.1 1.5Zm25.4 3.4c-.9 0-1.5-.2-1.8-.5-.4-.3-.7-.9-1-1.8l-11-36.2c-.3-.9-.4-1.5-.4-1.8 0-.7.4-1.1 1.1-1.1H37c.9 0 1.5.2 1.9.5.4.3.6.9.9 1.8l7.9 31 7.3-31c.2-.9.5-1.5.9-1.8.4-.3 1-.5 2-.5h4.4c.9 0 1.5.2 1.9.5.4.3.7.9.9 1.8l7.4 31.4L80 5c.2-.9.6-1.5.9-1.8.4-.3 1-.5 1.9-.5h4.4c.7 0 1.1.4 1.1 1.1 0 .2 0 .4-.1.7l-.3 1.1L77.4 37.5c-.3.9-.6 1.5-1 1.8-.4.3-1 .5-1.8.5H70c-.9 0-1.5-.2-1.9-.5-.4-.3-.7-1-.9-1.8l-7.3-30.3-7.2 30.2c-.2.9-.5 1.5-.9 1.8-.4.3-1 .5-1.9.5h-4.5Zm49.5 1c-2.7 0-5.3-.3-7.8-.9-2.5-.6-4.4-1.3-5.8-2-.8-.5-1.4-.9-1.6-1.4a3.7 3.7 0 0 1-.3-1.5V31c0-1.1.4-1.7 1.1-1.7.3 0 .5 0 .8.1.3.1.7.3 1.1.5 1.5.7 3.1 1.2 4.9 1.6 1.8.4 3.5.6 5.3.6 2.8 0 5-.5 6.5-1.5 1.5-1 2.3-2.4 2.3-4.2 0-1.2-.4-2.3-1.2-3.1-.8-.8-2.3-1.6-4.5-2.3l-6.5-2c-3.3-1-5.7-2.5-7.2-4.5a10.4 10.4 0 0 1-2.2-6.4c0-1.9.4-3.5 1.2-4.9.8-1.4 1.9-2.7 3.2-3.7 1.3-1 2.8-1.8 4.6-2.4 1.8-.5 3.6-.8 5.6-.8 1 0 2 .1 3 .2 1 .1 1.9.3 2.8.5.8.2 1.7.4 2.4.7.8.2 1.4.5 1.8.8.6.4 1 .7 1.3 1.1.3.4.4.9.4 1.6v2.3c0 1.1-.4 1.7-1.1 1.7-.4 0-1-.2-1.8-.6a21.8 21.8 0 0 0-9.1-1.9c-2.6 0-4.6.4-6 1.3-1.4.9-2.1 2.2-2.1 4 0 1.2.4 2.3 1.3 3.1.9.8 2.5 1.6 4.9 2.4l6.3 2c3.2 1 5.6 2.4 7 4.2 1.4 1.8 2.1 3.9 2.1 6.2 0 1.9-.4 3.6-1.1 5.1-.8 1.5-1.9 2.8-3.2 3.9a14 14 0 0 1-5 2.5c-1.9.7-4 1-6.2 1Z" fill="#FF9900"/>
                </svg>
              </div>
              <span className="aws-powered-text">Powered by</span>
            </div>

            <div className="aws-banner-content">
              <h3>Your Growth, Our Cloud</h3>
              <p>
                By leveraging Amazon Web Services (AWS), we tap into the same scalable, reliable,
                and secure global infrastructure that powers Amazon.com&apos;s multi-billion dollar
                empire — refined over more than a decade to deliver unmatched performance,
                resilience, and trust.
              </p>
              <span className="aws-tagline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Infrastructure you can trust, at any scale
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        title="Ready to protect your business?"
        subtitle="Start your free 14-day trial. No credit card required. Setup in under 10 minutes."
        primaryText="Get Started Free"
        primaryHref="/contact"
        secondaryText="Book a Demo"
        secondaryHref="/contact"
      />
    </>
  );
}

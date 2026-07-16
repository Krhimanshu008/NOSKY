import Link from 'next/link';
import Image from 'next/image';
import CTASection from '@/components/ui/CTASection';

export const metadata = {
  title: 'Products — The NoSky Suite',
  description:
    'Explore the full NoSky product suite: Backup Pro, CRM, Manage 2.0, and Finvault — enterprise-grade software built for modern businesses.',
  openGraph: {
    title: 'Products — The NoSky Suite',
    description:
      'Cloud backup, CRM, management, and financial vault tools — all under one roof.',
  },
};

const products = [
  {
    slug: 'nosky-backup-pro',
    logo: '/logos/Layer-1.png',
    name: 'Nosky Backup Pro',
    tagline: 'Cloud backup & recovery that\'s fast, secure & effortless',
    features: [
      'AES-256 Military-Grade Encryption',
      'Ransomware-Ready Protection',
      '15-Minute Disaster Recovery',
      'Windows, macOS & Linux Support',
      'Powered by AWS Infrastructure',
    ],
    badge: 'Backup & Recovery',
    badgeClass: 'badge-accent',
  },
  {
    slug: 'nosky-crm',
    logo: '/logos/CRM - White.png',
    name: 'Nosky CRM',
    tagline: 'Streamline your customer relationships and grow faster',
    features: [
      'Unified Customer Dashboard',
      'Sales Pipeline Management',
      'Automated Follow-ups & Reminders',
      'Team Collaboration Tools',
      'Analytics & Reporting',
    ],
    badge: 'CRM',
    badgeClass: 'badge-blue',
  },
  {
    slug: 'nosky-manage',
    logo: '/logos/Manage  - White.png',
    name: 'Nosky Manage 2.0',
    tagline: 'End-to-end business management for modern teams',
    features: [
      'Project & Task Management',
      'Resource Allocation',
      'Automated Workflows',
      'Role-Based Access Control',
      'Real-Time Dashboards',
    ],
    badge: 'Management',
    badgeClass: 'badge-success',
  },
  {
    slug: 'nosky-finvault',
    logo: '/logos/finvault-white.png',
    name: 'Nosky Finvault',
    tagline: 'Secure financial data storage and compliance made simple',
    features: [
      'Bank-Grade Data Encryption',
      'Audit Trails & Compliance',
      'Multi-Currency Support',
      'GDPR & DPDP Act Ready',
      'Automated Financial Reports',
    ],
    badge: 'Finance',
    badgeClass: 'badge-accent',
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="product-hero"
        id="products-hero"
        style={{ minHeight: '60vh' }}
      >
        <div className="product-hero-inner">
          <div className="product-badge-pill">
            <span className="product-badge-dot" />
            The NoSky Suite
          </div>

          <h1>
            One company.{' '}
            <span className="text-gradient">Four powerful</span>
            <br />
            products.
          </h1>

          <p className="hero-sub">
            Built for businesses that demand reliability, security, and performance.
            Every NoSky product is crafted to work seamlessly together — or independently.
          </p>

          <div className="product-hero-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Contact Sales <span className="btn-icon">→</span>
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section className="section section-border" id="products-grid">
        <div className="container">
          <div className="products-hub-grid">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="product-hub-card"
              >
                {/* Header */}
                <div className="product-hub-header">
                  <div className="product-hub-logo">
                    <Image
                      src={product.logo}
                      alt={product.name}
                      width={40}
                      height={40}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: 'var(--space-2)' }}>
                      <span className={`badge ${product.badgeClass}`}>{product.badge}</span>
                    </div>
                    <div className="product-hub-name">{product.name}</div>
                    <div className="product-hub-tagline">{product.tagline}</div>
                  </div>
                </div>

                {/* Features */}
                <div className="product-hub-features">
                  {product.features.map((f) => (
                    <div key={f} className="product-hub-feature">
                      <span className="product-hub-feature-dot" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="product-hub-cta">
                  Explore {product.name}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="section section-sm section-alt">
        <div className="container">
          <div className="stat-strip">
            <div>
              <div className="stat-value">500+</div>
              <div className="stat-label">Businesses Protected</div>
            </div>
            <div>
              <div className="stat-value">15 min</div>
              <div className="stat-label">Average Recovery Time</div>
            </div>
            <div>
              <div className="stat-value">99.9%</div>
              <div className="stat-label">Uptime SLA</div>
            </div>
            <div>
              <div className="stat-value">AES-256</div>
              <div className="stat-label">Encryption Standard</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUITE BANNER ── */}
      <section className="section">
        <div className="container">
          <div className="suite-banner">
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <Image
                src="/logos/SUITE.png"
                alt="NoSky Suite"
                width={160}
                height={80}
                style={{ objectFit: 'contain', margin: '0 auto' }}
              />
            </div>
            <h2>
              Better together with the{' '}
              <span className="text-gradient">NoSky Suite</span>
            </h2>
            <p>
              Each NoSky product is powerful on its own — but when combined, they form a unified
              ecosystem that covers every critical aspect of your business operations: data protection,
              customer relationships, team management, and financial security.
            </p>
            <div className="cta-buttons">
              <Link href="/contact" className="btn btn-primary btn-lg">
                Get the Full Suite <span className="btn-icon">→</span>
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        title="Ready to transform your business?"
        subtitle="Start a free 14-day trial on any NoSky product. No credit card required."
        primaryText="Get Started Free"
        primaryHref="/contact"
        secondaryText="Book a Demo"
        secondaryHref="/contact"
      />
    </>
  );
}

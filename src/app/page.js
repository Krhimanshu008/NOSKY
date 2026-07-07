import Link from 'next/link';
import FAQ from '@/components/ui/FAQ';
import CTASection from '@/components/ui/CTASection';
import NoskyGlassSection from '@/components/ui/NoskyGlassSection';
import GlassCard from '@/components/ui/GlassCard';
import HomeClient from './HomeClient';

export const metadata = {
  title: 'NoSky — Cloud Backup & Ransomware Recovery for Small Businesses',
  description: 'NoSky protects SMB data with automated cloud backup, immutable storage, and 15-minute ransomware recovery. Start a free 14-day trial. No credit card required.',
};

const comparisonData = [
  { feature: 'Immutable storage', nosky: true, acronis: true, backblaze: false, idrive: true },
  { feature: '15-min recovery', nosky: true, acronis: true, backblaze: false, idrive: false },
  { feature: 'MSP multi-tenant', nosky: true, acronis: true, backblaze: false, idrive: true },
  { feature: 'India data residency', nosky: true, acronis: false, backblaze: false, idrive: false },
  { feature: 'Zero-knowledge encryption', nosky: true, acronis: false, backblaze: false, idrive: false },
  { feature: 'DPDP Act compliant', nosky: true, acronis: false, backblaze: false, idrive: false },
];

const testimonials = [
  {
    quote: "NoSky restored our POS system in 12 minutes after a ransomware hit. We would have lost ₹40 lakhs in revenue.",
    name: "Priya Menon",
    role: "CFO",
    company: "Kochi Retail Co."
  },
  {
    quote: "We switched from Acronis to NoSky and cut our backup costs by 60% while getting faster recovery times.",
    name: "Rajesh Sharma",
    role: "IT Director",
    company: "Sharma Financial Services"
  },
  {
    quote: "Setup took 8 minutes. Our entire server fleet was protected by lunch. The immutable storage gives us total peace of mind.",
    name: "Aisha Khan",
    role: "CTO",
    company: "MedTech Solutions Dubai"
  }
];

const faqItems = [
  { question: 'What is NoSky?', answer: 'NoSky is a cloud backup and ransomware recovery platform built for small and mid-sized businesses. It provides automated, immutable backups with sub-15-minute recovery, ensuring your business data is always protected and recoverable.' },
  { question: 'How long does setup take?', answer: 'NoSky can be set up in under 10 minutes. Download the lightweight agent, choose what to back up, and NoSky handles the rest automatically. No IT expertise required.' },
  { question: 'Is NoSky HIPAA and GDPR compliant?', answer: 'Yes. NoSky is compliant with HIPAA, GDPR, India\'s DPDP Act, PCI-DSS, and holds ISO 27001 and SOC 2 Type II certifications. We provide BAA agreements for healthcare customers and DPA/SCCs for GDPR.' },
  { question: 'Where is my data stored?', answer: 'Your data is stored in your choice of four global data center regions: Mumbai (India), Singapore, Frankfurt (Germany), or Virginia (USA). All data is encrypted at rest with AES-256 and in transit with TLS 1.3.' },
  { question: 'What is immutable backup?', answer: 'Immutable backup means your backup data is write-locked using object-lock technology (WORM). Once written, no one — not even a compromised administrator — can modify, encrypt, or delete your recovery points.' },
  { question: 'How does NoSky protect against ransomware?', answer: 'NoSky uses immutable storage, air-gapped architecture, and anomaly detection to ensure ransomware cannot encrypt or delete your backups. If you are hit, you can restore any file or entire server from a clean recovery point in under 15 minutes.' },
  { question: 'How does pricing work?', answer: 'NoSky offers flexible plans for businesses of all sizes. Contact our sales team for a customized quote based on your storage needs, number of endpoints, and feature requirements. We offer a free 14-day trial with full features.' },
  { question: 'Is there a free trial?', answer: 'Yes. Every plan includes a free 14-day trial with full features and no credit card required. You can protect your entire infrastructure during the trial to see NoSky in action.' },
];

export default function HomePage() {
  return (
    <>
      {/* BLOCK 1 — Hero */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>
                Backup that <span className="text-gradient">recovers.</span>{' '}
                <br />Not just stores.
              </h1>
              <p className="hero-sub">
                Automated cloud backup and 15-minute ransomware recovery 
                for small and mid-sized businesses.
              </p>
              <div className="hero-ctas">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Get Started Free <span className="btn-icon">→</span>
                </Link>
                <Link href="/contact" className="btn btn-secondary btn-lg">
                  Book a Demo
                </Link>
              </div>
              <div className="hero-trust">
                <span className="pill">
                  <span className="pill-dot"></span> No credit card
                </span>
                <span className="pill">
                  <span className="pill-dot"></span> Setup in 10 min
                </span>
                <span className="pill">
                  <span className="pill-dot"></span> 256-bit encryption
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <HomeClient />
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 2 — Trust Bar */}
      <section className="section-sm section-border" id="trust-bar">
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
            Trusted by 500+ businesses across India, MENA, and Southeast Asia
          </p>
          <div className="trust-bar">
            <div className="cert-badge glass" style={{ flexDirection: 'row', padding: 'var(--space-3) var(--space-5)' }}>
              <span className="cert-badge-icon" style={{ width: 32, height: 32, fontSize: 'var(--text-sm)' }}>🔒</span>
              <span className="cert-badge-label">ISO 27001</span>
            </div>
            <div className="cert-badge glass" style={{ flexDirection: 'row', padding: 'var(--space-3) var(--space-5)' }}>
              <span className="cert-badge-icon" style={{ width: 32, height: 32, fontSize: 'var(--text-sm)' }}>🛡️</span>
              <span className="cert-badge-label">SOC 2 Type II</span>
            </div>
            <div className="cert-badge glass" style={{ flexDirection: 'row', padding: 'var(--space-3) var(--space-5)' }}>
              <span className="cert-badge-icon" style={{ width: 32, height: 32, fontSize: 'var(--text-sm)' }}>🇪🇺</span>
              <span className="cert-badge-label">GDPR</span>
            </div>
            <div className="cert-badge glass" style={{ flexDirection: 'row', padding: 'var(--space-3) var(--space-5)' }}>
              <span className="cert-badge-icon" style={{ width: 32, height: 32, fontSize: 'var(--text-sm)' }}>🏥</span>
              <span className="cert-badge-label">HIPAA</span>
            </div>
            <div className="cert-badge glass" style={{ flexDirection: 'row', padding: 'var(--space-3) var(--space-5)' }}>
              <span className="cert-badge-icon" style={{ width: 32, height: 32, fontSize: 'var(--text-sm)' }}>🇮🇳</span>
              <span className="cert-badge-label">DPDP Act</span>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 3 — Problem Statement */}
      <section className="section section-alt" id="problem-statement">
        <div className="container container-narrow" style={{ textAlign: 'center' }}>
          <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>The Reality</span>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>
            Every <span className="text-gradient">11 seconds</span>, a business is hit by ransomware.
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)', maxWidth: 700, margin: '0 auto' }}>
            Ransomware attacks on SMBs rose 300% between 2022 and 2025 
            (<a href="https://www.verizon.com/business/resources/reports/dbir/" target="_blank" rel="noopener noreferrer">Verizon DBIR 2025</a>). 
            60% of small businesses close within six months of a major data-loss event 
            (<a href="https://staysafeonline.org/" target="_blank" rel="noopener noreferrer">National Cyber Security Alliance</a>). 
            And 85% of breaches involve a human element 
            (<a href="https://www.verizon.com/business/resources/reports/dbir/" target="_blank" rel="noopener noreferrer">Verizon</a>). 
            NoSky was built for this reality — automated, encrypted, immutable backups 
            that restore your business in minutes, not days.
          </p>
        </div>
      </section>

      {/* BLOCK 4 — Value Props */}
      <section className="section" id="value-props">
        <div className="container">
          <div className="grid grid-3">
            <GlassCard className="card">
              <div className="card-icon">🔐</div>
              <h3 className="card-title">Immutable by default</h3>
              <p className="card-desc">
                Every backup is write-locked so ransomware cannot encrypt or delete 
                your recovery point. Not even a compromised admin can alter your data.
              </p>
            </GlassCard>
            <GlassCard className="card">
              <div className="card-icon">⚡</div>
              <h3 className="card-title">15-minute recovery</h3>
              <p className="card-desc">
                Restore any file, folder, or entire server in under 15 minutes 
                with one-click restore. Get your business back online before 
                anyone notices it was down.
              </p>
            </GlassCard>
            <GlassCard className="card">
              <div className="card-icon">🔄</div>
              <h3 className="card-title">Set it and forget it</h3>
              <p className="card-desc">
                Continuous, incremental backups run silently in the background. 
                Zero user action required after initial setup. Your data is always protected.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* BLOCK 5 — How it Works */}
      <section className="section section-alt" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-blue">Simple Setup</span>
            <h2>How NoSky works</h2>
            <p>Three steps. Ten minutes. Complete protection.</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Install in 10 minutes</h3>
              <p>Deploy the lightweight agent on any server or endpoint. Windows, macOS, or Linux.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Backups run automatically</h3>
              <p>Files, folders, databases, and VMs are backed up continuously to encrypted immutable storage.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Recover in one click</h3>
              <p>Restore a single file or spin up a full VM in under 15 minutes from any point in time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 6 — Feature Grid */}
      <NoskyGlassSection />

      {/* BLOCK 7 — Comparison */}
      <section className="section section-alt" id="comparison">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Compare</span>
            <h2>How NoSky compares</h2>
            <p>See how NoSky stacks up against alternatives.</p>
          </div>
          <div className="table-wrapper glass">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="table-highlight-col" style={{ color: 'var(--color-accent)' }}>NoSky</th>
                  <th>Acronis</th>
                  <th>Backblaze</th>
                  <th>IDrive</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.feature}</td>
                    <td className="table-highlight-col">
                      {row.nosky ? <span className="table-check">✓</span> : <span className="table-cross">–</span>}
                    </td>
                    <td>{row.acronis ? <span className="table-check">✓</span> : <span className="table-cross">–</span>}</td>
                    <td>{row.backblaze ? <span className="table-check">✓</span> : <span className="table-cross">–</span>}</td>
                    <td>{row.idrive ? <span className="table-check">✓</span> : <span className="table-cross">–</span>}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Pricing</td>
                  <td className="table-highlight-col" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Contact us</td>
                  <td>₹2,400/mo</td>
                  <td>₹580/mo</td>
                  <td>₹850/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link href="/compare/nosky-vs-acronis" className="btn btn-ghost">
              See full comparison <span className="btn-icon">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* BLOCK 8 — Customer Stories */}
      <section className="section" id="customers">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-success">Customer Stories</span>
            <h2>Trusted by businesses like yours</h2>
          </div>
          <div className="grid grid-3">
            {testimonials.map((t, i) => (
              <GlassCard key={i} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 'var(--text-base)', fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {t.role}, {t.company}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 9 — Security Strip */}
      <section className="section-sm section-alt section-border" id="security-strip">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
            <div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Enterprise-grade security</h3>
              <p style={{ fontSize: 'var(--text-sm)' }}>
                AES-256 encryption · ISO 27001 · SOC 2 Type II · GDPR · HIPAA · DPDP Act
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                Data centers in Mumbai, Singapore, Frankfurt, and Virginia
              </p>
            </div>
            <Link href="/security" className="btn btn-secondary">
              View security details <span className="btn-icon">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* BLOCK 10 — Pricing Preview */}
      <section className="section" id="pricing-preview">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Plans</span>
            <h2>Protection for every business size</h2>
            <p>Flexible plans that scale with you. Contact us for a customized quote.</p>
          </div>
          <div className="grid grid-3">
            <GlassCard className="card">
              <span className="badge badge-blue" style={{ marginBottom: 'var(--space-4)' }}>Starter</span>
              <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>For small teams</h3>
              <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                Essential cloud backup for businesses just getting started with data protection.
              </p>
              <ul style={{ marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {['Cloud backup', 'Immutable storage', '30-day retention', 'Email support'].map(f => (
                  <li key={f} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-success)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-secondary" style={{ width: '100%' }}>
                Contact Sales
              </Link>
            </GlassCard>

            <GlassCard className="card card-highlight" isHero={true}>
              <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)' }}>Business · Most Popular</span>
              <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>For growing teams</h3>
              <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                Complete backup and disaster recovery for businesses that can&apos;t afford downtime.
              </p>
              <ul style={{ marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {['Everything in Starter', 'Ransomware detection', 'M365 backup', '90-day retention', 'Priority support'].map(f => (
                  <li key={f} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-success)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-primary" style={{ width: '100%' }}>
                Contact Sales <span className="btn-icon">→</span>
              </Link>
            </GlassCard>

            <GlassCard className="card">
              <span className="badge badge-blue" style={{ marginBottom: 'var(--space-4)' }}>Enterprise</span>
              <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>For large orgs</h3>
              <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                Unlimited protection with dedicated support, custom SLAs, and compliance guarantees.
              </p>
              <ul style={{ marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {['Everything in Business', 'Unlimited storage', '10-year retention', 'CMEK / Zero-knowledge', 'Dedicated success manager', '99.99% SLA'].map(f => (
                  <li key={f} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-success)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-secondary" style={{ width: '100%' }}>
                Talk to Sales
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* BLOCK 11 — FAQ */}
      <FAQ
        sectionTitle="Frequently asked questions"
        sectionSub="Everything you need to know about NoSky."
        items={faqItems}
      />

      {/* BLOCK 12 — Final CTA */}
      <CTASection
        title="Try NoSky free for 14 days."
        subtitle="No credit card. Full features. Setup in 10 minutes."
        primaryText="Get Started Free"
        primaryHref="/contact"
        secondaryText="Book a Demo"
        secondaryHref="/contact"
      />
    </>
  );
}

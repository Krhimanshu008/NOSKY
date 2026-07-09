import Link from 'next/link';
import FAQ from '@/components/ui/FAQ';
import CTASection from '@/components/ui/CTASection';
import NoskyGlassSection from '@/components/ui/NoskyGlassSection';
import GlassCard from '@/components/ui/GlassCard';
import HowItWorksTimeline from '@/components/ui/HowItWorksTimeline';
import HomeClient from './HomeClient';
import RansomwareReality from '@/components/ui/RansomwareReality';
import { getDb } from '@/lib/db';
import InsightsCarousel from '@/components/ui/InsightsCarousel';

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

export default async function Home() {
  const collection = await getDb();
  
  // Fetch latest 5 articles
  const latestArticles = await collection.find({ published: 1, category: 'article' }).project({ _id: 0 }).sort({ createdAt: -1 }).limit(5).toArray();
  // Fetch latest 5 achievements
  const latestAchievements = await collection.find({ published: 1, category: 'achievement' }).project({ _id: 0 }).sort({ createdAt: -1 }).limit(5).toArray();

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
              
              {/* Integrated Trust Bar at bottom of Hero Content */}
              <div style={{ textAlign: 'left', marginTop: 'var(--space-10)' }}>
                <p style={{ 
                  fontSize: '11px', 
                  color: 'var(--color-text-muted)', 
                  marginBottom: 'var(--space-3)', 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Trusted by 500+ businesses across India, MENA, and Southeast Asia
                </p>
                <div className="trust-bar" style={{ justifyContent: 'flex-start', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <div className="cert-badge glass" style={{ flexDirection: 'row', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <span className="cert-badge-icon" style={{ width: 16, height: 16, fontSize: '12px' }}>🛡️</span>
                    <span className="cert-badge-label" style={{ fontSize: '11px' }}>AES-256-GCM</span>
                  </div>
                  <div className="cert-badge glass" style={{ flexDirection: 'row', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <span className="cert-badge-icon" style={{ width: 16, height: 16, fontSize: '12px' }}>🔒</span>
                    <span className="cert-badge-label" style={{ fontSize: '11px' }}>ISO 27001</span>
                  </div>
                  <div className="cert-badge glass" style={{ flexDirection: 'row', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <span className="cert-badge-icon" style={{ width: 16, height: 16, fontSize: '12px' }}>🛡️</span>
                    <span className="cert-badge-label" style={{ fontSize: '11px' }}>SOC 2</span>
                  </div>
                  <div className="cert-badge glass" style={{ flexDirection: 'row', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <span className="cert-badge-icon" style={{ width: 16, height: 16, fontSize: '12px' }}>🇪🇺</span>
                    <span className="cert-badge-label" style={{ fontSize: '11px' }}>GDPR</span>
                  </div>
                  <div className="cert-badge glass" style={{ flexDirection: 'row', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <span className="cert-badge-icon" style={{ width: 16, height: 16, fontSize: '12px' }}>🏥</span>
                    <span className="cert-badge-label" style={{ fontSize: '11px' }}>HIPAA</span>
                  </div>
                  <div className="cert-badge glass" style={{ flexDirection: 'row', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <span className="cert-badge-icon" style={{ width: 16, height: 16, fontSize: '12px' }}>🇮🇳</span>
                    <span className="cert-badge-label" style={{ fontSize: '11px' }}>DPDP Act</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <HomeClient />
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 9 — Military-Grade Encryption */}
      <section className="section" id="security-strip" style={{ position: 'relative', overflow: 'hidden', paddingBottom: 'var(--space-4)' }}>
        {/* Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(circle at center, rgba(245, 166, 35, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <GlassCard style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flex: '1 1 500px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(245, 166, 35, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(245, 166, 35, 0.2)',
                  boxShadow: '0 0 20px rgba(245, 166, 35, 0.2)'
                }}>
                  {/* Premium Shield Icon */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M12 8v4"/>
                    <path d="M12 16h.01"/>
                  </svg>
                </div>
                
                <div>
                  <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)', background: 'linear-gradient(to right, #fff, #f5a623)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Military-Grade Encryption
                  </h3>
                  
                  {/* Pills for certifications */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {['AES-256', 'ISO 27001', 'SOC 2 Type II', 'GDPR', 'HIPAA', 'DPDP Act'].map(cert => (
                      <span key={cert} style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                        letterSpacing: '0.05em'
                      }}>
                        {cert}
                      </span>
                    ))}
                  </div>
                  
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Data centers in Mumbai, Singapore, Frankfurt, and Virginia
                  </p>
                </div>
              </div>

              <div style={{ flexShrink: 0 }}>
                <Link href="/security" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '1rem' }}>
                  View Security Protocol
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                </Link>
              </div>

            </div>
          </GlassCard>
        </div>
      </section>

      {/* BLOCK 3 — Problem Statement */}
      <RansomwareReality />


      {/* BLOCK 5 — How it Works */}
      <HowItWorksTimeline />

      {/* BLOCK 6 — Feature Grid */}
      <NoskyGlassSection />

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

      {/* BLOCK 7 — Insights & Achievements */}
      <section className="section" id="insights" style={{ 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #07090e 0%, #0c1017 100%)',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.03)'
      }}>
        {/* High-Tech Dot Grid Pattern */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          zIndex: 0
        }} />

        {/* Ambient background glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1200px',
          height: '600px',
          background: 'radial-gradient(circle at center, rgba(245, 166, 35, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header">
            <span className="badge badge-accent">Discover</span>
            <h2>Insights & Milestones</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>Explore our latest articles on data security and discover the milestones that define our journey.</p>
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--space-8)' }}>
            
            {/* Card 1: Articles Carousel */}
            <InsightsCarousel items={latestArticles} type="article" />

            {/* Card 2: Achievements Carousel */}
            <InsightsCarousel items={latestAchievements} type="achievement" />

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

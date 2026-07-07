import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FAQ from '@/components/ui/FAQ';
import CTASection from '@/components/ui/CTASection';

export const metadata = {
  title: 'Security at NoSky — Encryption, Compliance & Data Protection',
  description: 'How NoSky protects your data: AES-256 encryption, ISO 27001, SOC 2, GDPR, HIPAA, and DPDP Act compliance. Full security architecture explained.',
};

const certifications = [
  { icon: '🔒', label: 'ISO 27001:2022', desc: 'Information security management' },
  { icon: '🛡️', label: 'SOC 2 Type II', desc: 'Security & availability controls' },
  { icon: '🇪🇺', label: 'GDPR', desc: 'EU data protection regulation' },
  { icon: '🏥', label: 'HIPAA', desc: 'Healthcare data compliance' },
  { icon: '🇮🇳', label: 'DPDP Act', desc: 'India data protection' },
  { icon: '💳', label: 'PCI-DSS L1', desc: 'Payment card industry standard' },
  { icon: '☁️', label: 'CSA STAR', desc: 'Cloud security alliance' },
];

const dataResidency = [
  { region: 'India (Mumbai)', flag: '🇮🇳', framework: 'DPDP Act', status: 'Active' },
  { region: 'Singapore', flag: '🇸🇬', framework: 'PDPA', status: 'Active' },
  { region: 'Germany (Frankfurt)', flag: '🇩🇪', framework: 'GDPR / BDSG', status: 'Active' },
  { region: 'USA (Virginia)', flag: '🇺🇸', framework: 'HIPAA / FedRAMP-ready', status: 'Active' },
  { region: 'UAE (Dubai)', flag: '🇦🇪', framework: 'PDPL', status: 'Coming Q4 2026' },
];

const complianceDocs = [
  { framework: 'SOC 2 Type II', status: 'Attested', doc: 'SOC 2 Report', available: true },
  { framework: 'ISO 27001:2022', status: 'Certified', doc: 'ISO Certificate', available: true },
  { framework: 'GDPR', status: 'Compliant', doc: 'DPA + SCCs', available: true },
  { framework: 'HIPAA', status: 'Compliant', doc: 'BAA', available: true },
  { framework: 'DPDP Act', status: 'Compliant', doc: 'Compliance Statement', available: true },
  { framework: 'PCI-DSS', status: 'Level 1', doc: 'AOC', available: true },
];

const subprocessors = [
  { provider: 'AWS', purpose: 'Cloud infrastructure & storage', region: 'Mumbai, Singapore, Frankfurt, Virginia', data: 'Customer backup data' },
  { provider: 'Cloudflare', purpose: 'CDN & DDoS protection', region: 'Global edge', data: 'HTTP metadata only' },
  { provider: 'Stripe', purpose: 'Payment processing', region: 'USA', data: 'Billing information' },
  { provider: 'SendGrid', purpose: 'Transactional email', region: 'USA', data: 'Email addresses' },
  { provider: 'Datadog', purpose: 'Infrastructure monitoring', region: 'USA', data: 'Operational metrics' },
];

const securityFaq = [
  { question: 'Can NoSky read my data?', answer: 'On Standard and Business plans, NoSky staff have theoretical access to encrypted data for support purposes, but all access is logged, audited, and requires multi-party approval. On Enterprise plans with customer-managed keys (CMEK), NoSky implements zero-knowledge architecture where our staff cannot decrypt your data even under subpoena.' },
  { question: 'How do you handle law-enforcement requests?', answer: 'NoSky publishes a transparency report annually. We evaluate every request for legal validity, narrow scope, and jurisdictional authority. We notify customers of requests unless legally prohibited. We have never provided bulk surveillance access and we commit to challenging overbroad requests.' },
  { question: 'Do you comply with India\'s DPDP Act?', answer: 'Yes. NoSky is fully compliant with India\'s Digital Personal Data Protection Act (2023). We offer data residency in Mumbai, have appointed a Data Protection Officer, provide data portability and erasure mechanisms, and publish our compliance statement publicly.' },
  { question: 'Where are your data centers located?', answer: 'NoSky operates from four AWS regions: Mumbai (India), Singapore, Frankfurt (Germany), and Virginia (USA). A fifth region in Dubai (UAE) is planned for Q4 2026. Customers choose their data residency region at signup.' },
  { question: 'What happens if NoSky is breached?', answer: 'We maintain a comprehensive incident response plan tested twice yearly. In the event of a confirmed security incident, we notify affected customers within 24 hours per our commitment (exceeding the 72-hour GDPR requirement). Our 24×7 SOC monitors for threats continuously.' },
  { question: 'How are encryption keys managed?', answer: 'Standard encryption keys are managed by NoSky using HSM-backed key management (FIPS 140-2 validated). Enterprise customers can bring their own keys (BYOK/CMEK) for full control. Key rotation is automatic and configurable.' },
  { question: 'Do you perform penetration testing?', answer: 'Yes. We conduct quarterly external penetration tests by CREST-certified firms. Additionally, we run a public bug bounty program on HackerOne. Internal security assessments are performed continuously by our security team.' },
  { question: 'What employee access controls exist?', answer: 'All NoSky employees undergo background checks and annual security training. We enforce least-privilege access, mandatory MFA, and SSO/SAML. Access to customer data requires multi-party approval with full audit logging. Quarterly access reviews are conducted by our CISO.' },
];

export default function SecurityPage() {
  return (
    <>
      {/* BLOCK 1 — Hero */}
      <section className="hero hero-sub-page" id="security-hero">
        <div className="container">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Security' },
          ]} />
          <div style={{ maxWidth: 800 }}>
            <h1 style={{ marginBottom: 'var(--space-6)' }}>
              Your data. <span className="text-gradient">Locked down.</span> End to end.
            </h1>
            <p className="hero-sub">
              NoSky is built on the same security principles used by banks and defense contractors — 
              because backup is only as good as its worst day.
            </p>
            <div className="hero-ctas">
              <Link href="/contact" className="btn btn-primary btn-lg">
                Download Security Whitepaper <span className="btn-icon">→</span>
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                View SOC 2 Report
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 2 — Certifications Grid */}
      <section className="section section-alt" id="certifications">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-success">Verified</span>
            <h2>Certifications & compliance</h2>
            <p>Independently audited and verified by leading certification bodies.</p>
          </div>
          <div className="cert-grid">
            {certifications.map((cert, i) => (
              <div key={i} className="cert-badge">
                <div className="cert-badge-icon">{cert.icon}</div>
                <div className="cert-badge-label">{cert.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{cert.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 3 — Encryption Architecture */}
      <section className="section" id="encryption">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Architecture</span>
            <h2>Encryption architecture</h2>
            <p>Multiple layers of encryption protect your data at every stage.</p>
          </div>

          <div className="grid grid-2" style={{ marginBottom: 'var(--space-12)' }}>
            <div className="card">
              <div className="card-icon">🔐</div>
              <h3 className="card-title">In transit</h3>
              <p className="card-desc">
                TLS 1.3 with perfect forward secrecy. Every byte between your systems and NoSky is encrypted 
                with the latest transport layer security protocol.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">💾</div>
              <h3 className="card-title">At rest</h3>
              <p className="card-desc">
                AES-256-GCM with FIPS 140-2 validated modules. Your backup data is encrypted before 
                it is written to disk and remains encrypted throughout its lifecycle.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">🔑</div>
              <h3 className="card-title">Key management</h3>
              <p className="card-desc">
                HSM-backed key management. Customer-managed keys (BYOK) available on Enterprise plans. 
                Automatic key rotation with configurable policies.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">👁️‍🗨️</div>
              <h3 className="card-title">Zero-knowledge</h3>
              <p className="card-desc">
                On Enterprise plans with CMEK, NoSky staff cannot decrypt customer data even under 
                subpoena. Your keys, your data, your control.
              </p>
            </div>
          </div>

          {/* Data flow diagram */}
          <div className="card" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
            <h3 style={{ marginBottom: 'var(--space-8)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>
              Data Flow Architecture
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
              fontSize: 'var(--text-sm)',
            }}>
              {[
                { icon: '💻', label: 'Your Data' },
                { icon: '→', label: '' },
                { icon: '🔧', label: 'NoSky Agent' },
                { icon: '→', label: '' },
                { icon: '🔒', label: 'TLS 1.3' },
                { icon: '→', label: '' },
                { icon: '☁️', label: 'Cloud' },
                { icon: '→', label: '' },
                { icon: '🔑', label: 'HSM' },
                { icon: '→', label: '' },
                { icon: '💾', label: 'Immutable S3' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}>
                  <span style={{ fontSize: item.icon === '→' ? 'var(--text-xl)' : 'var(--text-2xl)', color: item.icon === '→' ? 'var(--color-accent)' : 'inherit' }}>
                    {item.icon}
                  </span>
                  {item.label && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 4 — Data Residency */}
      <section className="section section-alt" id="data-residency">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-blue">Regions</span>
            <h2>Data residency</h2>
            <p>Choose where your data lives. Stay compliant with local regulations.</p>
          </div>
          <div className="table-wrapper" style={{ maxWidth: 800, margin: '0 auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Regulatory Framework</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dataResidency.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      <span style={{ marginRight: 'var(--space-2)' }}>{row.flag}</span>
                      {row.region}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{row.framework}</td>
                    <td>
                      <span className={`badge ${row.status === 'Active' ? 'badge-success' : 'badge-accent'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* BLOCK 5 — Operational Security */}
      <section className="section" id="operational-security">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Operations</span>
            <h2>Operational security</h2>
            <p>Security isn&apos;t just technology — it&apos;s process, people, and culture.</p>
          </div>
          <div className="grid grid-2">
            {[
              { icon: '🔍', title: 'Penetration testing', desc: 'External, quarterly, performed by CREST-certified security firms. Results remediated within 30 days.' },
              { icon: '🐛', title: 'Bug bounty program', desc: 'Public HackerOne program with bounties up to $10,000. Responsible disclosure policy published.' },
              { icon: '🔐', title: 'Access controls', desc: 'SSO/SAML, mandatory MFA, least-privilege access, quarterly access reviews by CISO.' },
              { icon: '👤', title: 'Employee security', desc: 'Background checks for all employees. Annual security training and phishing simulations.' },
              { icon: '📡', title: '24×7 Security Operations Center', desc: 'Continuous threat monitoring. Customer notification within 24 hours of confirmed incident.' },
              { icon: '🏢', title: 'Business continuity', desc: 'BCP tested twice yearly. RTO of 4 hours for the NoSky control plane. Geo-redundant infrastructure.' },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="card-icon">{item.icon}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 6 — Compliance & Legal */}
      <section className="section section-alt" id="compliance">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-success">Documents</span>
            <h2>Compliance & legal</h2>
            <p>Download our compliance documentation.</p>
          </div>
          <div className="table-wrapper" style={{ maxWidth: 800, margin: '0 auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Framework</th>
                  <th>Status</th>
                  <th>Document</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {complianceDocs.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.framework}</td>
                    <td>
                      <span className="badge badge-success">{row.status}</span>
                    </td>
                    <td>{row.doc}</td>
                    <td>
                      <Link href="/contact" className="btn btn-ghost btn-sm">
                        Request →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* BLOCK 7 — Subprocessors */}
      <section className="section" id="subprocessors">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-blue">Transparency</span>
            <h2>Subprocessors</h2>
            <p>Full transparency on every third party that processes data on our behalf.</p>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Purpose</th>
                  <th>Region</th>
                  <th>Data Category</th>
                </tr>
              </thead>
              <tbody>
                {subprocessors.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.provider}</td>
                    <td>{row.purpose}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{row.region}</td>
                    <td>{row.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              We provide 30-day advance notice of any subprocessor changes. 
              <Link href="/contact" style={{ marginLeft: 'var(--space-2)' }}>Subscribe to updates →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* BLOCK 8 — Trust Center Strip */}
      <section className="section-sm section-alt section-border" id="trust-center">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-6)',
            textAlign: 'center',
          }}>
            {[
              { icon: '📊', label: 'Status Page', href: '/status' },
              { icon: '📄', label: 'Security Whitepaper', href: '/contact' },
              { icon: '🐛', label: 'Bug Bounty', href: '/contact' },
              { icon: '📋', label: 'SLA', href: '/legal/sla' },
            ].map((item, i) => (
              <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  <div style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>{item.icon}</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 9 — Security FAQ */}
      <FAQ
        sectionTitle="Security FAQ"
        sectionSub="Common questions about NoSky's security practices."
        items={securityFaq}
      />

      {/* Final CTA */}
      <CTASection
        title="Your data deserves enterprise-grade protection."
        subtitle="AES-256 encryption. Immutable storage. ISO 27001 certified."
        primaryText="Contact Sales"
        primaryHref="/contact"
        secondaryText="Download Whitepaper"
        secondaryHref="/contact"
      />
    </>
  );
}

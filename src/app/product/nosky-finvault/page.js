import Link from 'next/link';
import { 
  ShieldCheck, Server, Cloud, HardDrive, Lock, FileText, Share2, 
  RefreshCcw, AlertTriangle, Zap, Activity, Clock, FileWarning, HelpCircle, 
  CheckCircle, Database, GitBranch, Terminal, Shield, ArrowDown, Building2, Briefcase, Landmark, FileDigit, FileBarChart
} from 'lucide-react';
import CTASection from '@/components/ui/CTASection';

export const metadata = {
  title: 'NoSky FinVault - Enterprise Financial Data Protection Platform',
  description: 'Purpose-built backup and disaster recovery for Chartered Accountants, Tax Professionals, Audit Firms, and Enterprise Finance Teams.',
};

const accountingSystems = [
  "TallyPrime",
  "Busy",
  "Marg ERP",
  "SAP Business One",
  "Microsoft Dynamics",
  "Zoho Books",
  "Other ERP & Accounting Platforms"
];

const financialDocuments = [
  "Books of Accounts",
  "Financial Statements",
  "GST Returns",
  "Income Tax Records",
  "Audit Working Papers",
  "Compliance Documents",
  "Payroll Records",
  "Bank Reconciliation Files",
  "Excel Financial Models",
  "PDF Reports",
  "Client Documentation"
];

const pipelineSteps = [
  "Accounting Systems",
  "Continuous File Monitoring",
  "Change Detection Engine",
  "Block-Level Deduplication",
  "Compression Engine",
  "AES-256 Encryption",
  "Secure TLS Data Transfer",
  "AWS Cloud Repository",
  "Backup Verification",
  "Recovery Point Creation",
  "Monitoring & Audit Logs"
];

const lifecycleSteps = [
  {
    title: "Step 1 — Intelligent Data Discovery",
    desc: "FinVault continuously monitors configured storage locations and financial repositories to identify new or modified business records. Supported sources include local storage, network drives, accounting applications, ERP systems, databases, and document repositories."
  },
  {
    title: "Step 2 — Continuous Change Detection",
    desc: "Rather than copying every file repeatedly, FinVault identifies only the data that has changed since the previous backup. This intelligent approach significantly reduces storage consumption, minimizes network bandwidth, and accelerates backup completion."
  },
  {
    title: "Step 3 — Block-Level Deduplication",
    desc: "Duplicate information is stored only once, even when it exists across multiple users, departments, or backup versions. This reduces storage requirements while preserving every recovery point for fast restoration."
  },
  {
    title: "Step 4 — Intelligent Compression",
    desc: "Before transmission, backup data is compressed to minimize storage requirements and reduce upload time. Compression ratios vary depending on the data type, ensuring efficient utilization of cloud storage resources."
  },
  {
    title: "Step 5 — Enterprise Encryption",
    desc: "Every backup is encrypted before leaving your infrastructure using industry-standard technologies, including AES-256. Sensitive financial information remains protected throughout the backup lifecycle via Data-at-Rest and Data-in-Transit protection."
  },
  {
    title: "Step 6 — Secure Cloud Transfer",
    desc: "Encrypted backup data is securely transmitted through encrypted communication channels to NoSky's cloud infrastructure hosted on Amazon Web Services (AWS). Data integrity is maintained throughout the transfer process."
  },
  {
    title: "Step 7 — Cloud Storage Repository",
    desc: "Backup data is securely stored in highly available cloud repositories designed for durability, scalability, and business continuity. Multiple recovery points allow organizations to restore previous versions whenever required."
  },
  {
    title: "Step 8 — Backup Verification",
    desc: "Every completed backup undergoes integrity verification to ensure it remains recoverable when needed, checking completion validation, metadata consistency, repository integrity, and restore readiness."
  },
  {
    title: "Step 9 — Monitoring & Reporting",
    desc: "Administrators receive centralized visibility into backup operations through detailed dashboards. Monitor backup success rates, storage consumption, failed jobs, retention status, and security events."
  }
];

const securityFeatures = [
  "AES-256 Encryption",
  "Secure TLS Communication",
  "Multi-Factor Authentication",
  "Role-Based Access Control",
  "Secure Backup Verification",
  "Immutable Recovery Points (where supported)",
  "Detailed Audit Logs",
  "Secure Data Deletion"
];

const whyChooseFeatures = [
  "Purpose-built for Chartered Accountants and Finance Teams",
  "Enterprise Backup Architecture",
  "Automated Daily Protection",
  "Intelligent Incremental Backups",
  "Block-Level Deduplication",
  "Advanced Compression",
  "Military-Grade Encryption",
  "Disaster Recovery Ready",
  "Long-Term Data Retention",
  "Detailed Audit Logs",
  "Centralized Monitoring",
  "AWS Cloud Infrastructure",
  "Scalable Enterprise Platform"
];

const industries = [
  "Chartered Accountant Firms",
  "Tax Consultants",
  "Audit Firms",
  "Accounting Outsourcing Firms",
  "Corporate Finance Departments",
  "CFO Offices",
  "Manufacturing Companies",
  "Trading Businesses",
  "SMEs & Enterprises",
  "Financial Service Providers"
];

export default function NoskyFinvaultPage() {
  return (
    <div className="backup-page">
      {/* ── HERO ── */}
      <section className="section section-lg" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-20))', textAlign: 'center', background: 'var(--gradient-hero)' }}>
        <div className="container container-narrow flex-col flex-center">
          <div className="badge badge-accent" style={{ marginBottom: 'var(--space-6)' }}>
            Enterprise Financial Data Protection Platform
          </div>
          
          <h1 style={{ marginBottom: 'var(--space-6)' }}>
            NoSky <span className="text-gradient-blue">FinVault</span>
          </h1>
          
          <h4 style={{ marginBottom: 'var(--space-8)', color: 'var(--color-text-primary)' }}>
            Purpose-built for Chartered Accountants, Tax Professionals, Audit Firms, CFO Offices, and Enterprise Finance Teams.
          </h4>
          
          <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)', maxWidth: '800px', color: 'var(--color-text-secondary)' }}>
            Financial records are the foundation of every business. Losing accounting data, tax records, GST files, audit documentation, or compliance records can result in operational disruption, regulatory challenges, and loss of client trust. 
            NoSky FinVault is an enterprise-grade financial data protection platform engineered to safeguard your critical financial information.
          </p>
          
          <div className="card card-highlight" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-4) var(--space-8)' }}>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Protect Financial Records. Ensure Compliance. Enable Business Continuity.
            </span>
          </div>

          <div className="flex flex-center flex-gap-4">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Request Demo
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              Talk to Our Experts
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT & WHY FINVAULT ── */}
      <section className="section section-border">
        <div className="container">
          <div className="grid grid-2" style={{ gap: 'var(--space-12)' }}>
            <div>
              <div className="badge" style={{ marginBottom: 'var(--space-4)' }}>Purpose-Built</div>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Engineered for Financial Professionals</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Traditional backup software is designed to protect general-purpose files. NoSky FinVault is engineered specifically for financial ecosystems where data accuracy, integrity, security, retention, and recoverability are business-critical.
              </p>
              <br/>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Whether you manage accounting records, audit documentation, GST filings, payroll data, taxation records, ERP databases, or client financial information, FinVault ensures your most valuable digital assets remain secure, available, and recoverable at all times.
              </p>
            </div>
            
            <div>
              <div className="badge badge-accent" style={{ marginBottom: 'var(--space-4)' }}>Specialized Protection</div>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Why Financial Data is Different</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Unlike ordinary business files, financial records are subject to statutory retention requirements, audit obligations, client confidentiality, and regulatory compliance.
              </p>
              <br/>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                A missing GST return, corrupted accounting database, ransomware attack, or accidental deletion can interrupt business operations and compromise years of financial history. FinVault minimizes these risks by providing automated protection, encrypted cloud storage, verified recovery, and intelligent data lifecycle management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT FINVAULT PROTECTS ── */}
      <section className="section section-alt section-border">
        <div className="container">
          <div className="section-header text-center">
            <h2>Protect Every Critical Financial Asset</h2>
            <p>FinVault safeguards your entire financial data ecosystem.</p>
          </div>
          
          <div className="grid grid-2" style={{ marginTop: 'var(--space-12)' }}>
            <div className="card">
              <div className="card-icon" style={{ marginBottom: 'var(--space-4)' }}><Database size={32} className="text-accent" /></div>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Accounting Systems</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {accountingSystems.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <CheckCircle size={16} className="text-success" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div className="card-icon" style={{ marginBottom: 'var(--space-4)' }}><FileDigit size={32} className="text-blue" /></div>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Financial Documents</h3>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {financialDocuments.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <CheckCircle size={16} className="text-success" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW FINVAULT WORKS (PIPELINE) ── */}
      <section id="architecture" className="section section-border">
        <div className="container">
          <div className="section-header text-center">
            <h2>Enterprise Backup Workflow</h2>
            <p>Every backup follows a structured, secure, and verified lifecycle to ensure complete protection.</p>
          </div>

          <div style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            {pipelineSteps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="badge" style={{ padding: 'var(--space-3) var(--space-8)', fontSize: 'var(--text-sm)', background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-accent)', minWidth: '300px', justifyContent: 'center' }}>
                  {step}
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <ArrowDown className="text-accent" style={{ margin: 'var(--space-2) 0' }} size={20} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BACKUP LIFECYCLE DEEP DIVE ── */}
      <section className="section section-alt section-border">
        <div className="container">
          <div className="section-header text-center">
            <h2>The Backup Pipeline</h2>
            <p>An intelligent, highly-optimized approach to financial data protection.</p>
          </div>

          <div className="grid grid-3" style={{ marginTop: 'var(--space-12)' }}>
            {lifecycleSteps.map((step, idx) => (
              <div key={idx} className="card">
                <h4 style={{ marginBottom: 'var(--space-3)', color: 'var(--color-accent)' }}>{step.title}</h4>
                <p className="card-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISASTER RECOVERY & SECURITY ── */}
      <section className="section section-border">
        <div className="container">
          <div className="grid grid-2" style={{ gap: 'var(--space-12)' }}>
            <div>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Disaster Recovery</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                Unexpected incidents can occur at any time. Whether caused by ransomware, accidental deletion, hardware failure, or software corruption, FinVault enables organizations to restore business-critical information quickly and reliably.
              </p>
              
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {["Individual File Recovery", "Folder Recovery", "Complete Financial Repository Recovery", "Point-in-Time Restore", "Historical Version Recovery", "Disaster Recovery"].map((opt, idx) => (
                  <li key={idx} className="badge badge-blue" style={{ justifyContent: 'flex-start', padding: 'var(--space-3)' }}>
                    <RefreshCcw size={16} /> {opt}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Enterprise-Grade Security</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                Security is integrated into every layer of the FinVault platform to ensure that your client records and audit trails remain pristine and tamper-proof.
              </p>
              
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {securityFeatures.map((feat, idx) => (
                  <li key={idx} className="badge badge-success" style={{ justifyContent: 'flex-start', padding: 'var(--space-3)' }}>
                    <ShieldCheck size={16} /> {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── RETENTION & COMPLIANCE ── */}
      <section className="section section-alt section-border">
        <div className="container">
          <div className="grid grid-2" style={{ gap: 'var(--space-12)' }}>
            <div>
              <div className="card" style={{ height: '100%' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Intelligent Data Retention</h3>
                <p className="card-desc" style={{ marginBottom: 'var(--space-6)' }}>
                  Financial records often require long-term preservation. FinVault allows organizations to configure backup retention policies aligned with operational, contractual, and regulatory requirements.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {["Daily Recovery Points", "Weekly Archives", "Monthly Archives", "Annual Archives", "Long-Term Historical Retention"].map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <Clock size={16} className="text-accent" /> <span style={{ fontWeight: 500 }}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="card card-highlight" style={{ height: '100%' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Built to Support Regulatory Readiness</h3>
                <p className="card-desc" style={{ marginBottom: 'var(--space-6)' }}>
                  Organizations handling financial information often need to maintain records that are secure, recoverable, and available for future reference. FinVault provides technical capabilities that help organizations support their internal governance, audit readiness, and regulatory obligations by enabling secure backup, controlled retention, recovery verification, and audit logging.
                </p>
                <div style={{ padding: 'var(--space-3)', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-md)', fontStyle: 'italic', fontSize: 'var(--text-sm)' }}>
                  Note: Compliance with applicable laws and regulations remains the responsibility of each organization. FinVault provides the technical foundation to support those compliance efforts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE & INDUSTRIES ── */}
      <section className="section section-border">
        <div className="container">
          <div className="section-header text-center">
            <h2>Built for Mission-Critical Financial Operations</h2>
          </div>
          
          <div className="grid grid-2" style={{ gap: 'var(--space-12)', marginTop: 'var(--space-12)' }}>
            <div>
              <h3 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><CheckCircle className="text-success"/> Why Organizations Choose FinVault</h3>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
                {whyChooseFeatures.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-md)' }}>
                    <CheckCircle size={16} className="text-success" style={{ flexShrink: 0 }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Building2 className="text-blue"/> Industries We Serve</h3>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
                {industries.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-md)' }}>
                    <Landmark size={16} className="text-blue" style={{ flexShrink: 0 }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        title="Your Financial Records Deserve More Than a Standard Backup"
        subtitle="Protect years of accounting history, client records, audit documentation, and financial data with an enterprise platform purpose-built for finance professionals."
        primaryText="Schedule a Live Demo"
        primaryHref="/contact"
        secondaryText="Contact Sales"
        secondaryHref="/contact"
      />
    </div>
  );
}

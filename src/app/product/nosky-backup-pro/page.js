import Link from 'next/link';
import BackupPipeline from '@/components/BackupPipeline';
import {
  ShieldCheck, Server, Cloud, HardDrive, Lock, FileText, Share2,
  RefreshCcw, AlertTriangle, Zap, Activity, Clock, FileWarning, HelpCircle,
  CheckCircle, Database, GitBranch, Terminal, Shield, ArrowDown, ArrowRight
} from 'lucide-react';

export const metadata = {
  title: 'NoSky Backup Pro - Enterprise Backup & Disaster Recovery Platform',
  description: 'Protect your business-critical data with enterprise-grade backup technology. Secure, compressed, encrypted, and verified.',
};

const threats = [
  { icon: <HelpCircle />, label: "Human Error" },
  { icon: <HardDrive />, label: "Hardware Failure" },
  { icon: <Shield />, label: "Ransomware" },
  { icon: <FileWarning />, label: "Insider Threats" },
  { icon: <Zap />, label: "Power Failure" },
  { icon: <Database />, label: "Database Corruption" },
  { icon: <Terminal />, label: "OS Crash" },
  { icon: <AlertTriangle />, label: "Malware" },
];

const pipelineSteps = [
  "Client Device",
  "File Scanner",
  "Change Detection Engine",
  "Deduplication Engine",
  "Compression Engine",
  "AES-256 Encryption",
  "Secure TLS Transfer",
  "AWS Storage Repository",
  "Backup Verification",
  "Recovery Point Created",
  "Monitoring & Reporting"
];

const lifecycleSteps = [
  {
    title: "Step 1 — Data Discovery",
    desc: "The backup agent continuously scans selected files, folders, virtual machines, databases, or storage volumes based on the configured backup policy. Supports Windows, Linux, macOS, VMware, Hyper-V, NAS, and SQL Server."
  },
  {
    title: "Step 2 — Change Detection",
    desc: "Instead of transferring every file, the agent identifies only the modified blocks using techniques like File hash comparison and Change Block Tracking (CBT) resulting in faster backups and less network usage."
  },
  {
    title: "Step 3 — Deduplication",
    desc: "Duplicate data blocks are identified and stored only once. If multiple users have the same 500 MB file, it is stored once with references for both, significantly reducing storage consumption."
  },
  {
    title: "Step 4 — Compression",
    desc: "Before transmission, backup data is compressed to reduce storage space and bandwidth, optimizing cloud storage costs while reducing backup windows."
  },
  {
    title: "Step 5 — Encryption",
    desc: "All backup data is encrypted using AES-256 before leaving the client device. It protects data in transit and data at rest in our cloud repositories."
  },
  {
    title: "Step 6 — Secure Data Transfer",
    desc: "Encrypted backup data is transmitted over secure TLS network channels to protect against interception, tampering, and unauthorized access during transmission."
  },
  {
    title: "Step 7 — Storage Repository",
    desc: "Once received, data is securely stored in AWS. Each backup creates restore points, enabling recovery from different points in time based on your retention policies."
  },
  {
    title: "Step 8 — Backup Verification",
    desc: "A backup is valuable only if it can be restored. We validate completion status, metadata, block integrity, and restore point availability to detect issues early."
  },
  {
    title: "Step 9 — Monitoring & Reporting",
    desc: "Administrators receive centralized visibility into successful backups, failed jobs, storage utilization, and device health through detailed reporting."
  }
];

export default function NoskyBackupProPage() {
  return (
    <div className="backup-page">
      {/* ── HERO ── */}
      <section className="section section-lg" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-20))', textAlign: 'center', background: 'var(--gradient-hero)' }}>
        <div className="container container-narrow flex-col flex-center">
          <div className="badge badge-accent" style={{ marginBottom: 'var(--space-6)' }}>
            Enterprise Backup & Disaster Recovery Platform
          </div>

          <h1 style={{ marginBottom: 'var(--space-6)' }}>
            Secure. Compressed.<br />
            <span className="text-gradient-blue">Encrypted. Verified.</span>
          </h1>

          <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)', maxWidth: '700px', color: 'var(--color-text-secondary)' }}>
            Protect your business-critical data with enterprise-grade backup technology designed for physical servers, virtual machines, cloud workloads, databases, NAS devices, endpoints, and hybrid environments.
          </p>

          <div className="card card-highlight" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-4) var(--space-8)' }}>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Your Data. Always Available. Always Protected.
            </span>
          </div>

          <div className="flex flex-center flex-gap-4">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Start Free Trial
            </Link>
            <Link href="#architecture" className="btn btn-secondary btn-lg">
              View Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY BACKUP MATTERS ── */}
      <section className="section section-border">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 'var(--space-12)' }}>
            <h2>Why Backup Matters</h2>
            <p>Every day businesses lose valuable information. Without a verified backup strategy, recovering lost information may be impossible.</p>
          </div>

          <div className="grid grid-4" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            {threats.map((threat, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
                <span className="text-danger">{threat.icon}</span>
                <span style={{ fontWeight: '500' }}>{threat.label}</span>
              </div>
            ))}
          </div>

          <div className="container-narrow text-center">
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
              NoSky Backup Pro helps organizations implement a reliable backup and disaster recovery solution that minimizes downtime and protects business continuity.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW OUR BACKUP WORKS (PIPELINE) ── */}
      <section id="architecture" className="section section-alt section-border">
        <div className="container">
          <div className="section-header text-center">
            <h2>How Our Backup Works</h2>
            <p>Engineered for reliability. Understand exactly how your data is processed.</p>
          </div>

          <div style={{ marginTop: 'var(--space-12)' }}>
            <BackupPipeline />
          </div>
        </div>
      </section>

      {/* ── BACKUP LIFECYCLE DEEP DIVE ── */}
      <section className="section section-border">
        <div className="container">
          <div className="section-header text-center">
            <h2>The Backup Lifecycle</h2>
            <p>A deep dive into every stage of the data protection process.</p>
          </div>

          <div className="grid grid-3" style={{ marginTop: 'var(--space-12)' }}>
            {lifecycleSteps.map((step, idx) => (
              <div key={idx} className="card">
                <h4 style={{ marginBottom: 'var(--space-3)', color: 'var(--color-accent)' }}>{step.title}</h4>
                <p className="card-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Compression Table Highlight */}
          <div className="container-narrow" style={{ marginTop: 'var(--space-12)' }}>
            <div className="card card-highlight">
              <h4 style={{ marginBottom: 'var(--space-4)', textAlign: 'center' }}>Typical Compression Ratios</h4>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Data Type</th>
                      <th style={{ textAlign: 'right' }}>Typical Compression</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Text Files</td><td style={{ textAlign: 'right' }}>High (60–90%)</td></tr>
                    <tr><td>Office Documents</td><td style={{ textAlign: 'right' }}>Moderate</td></tr>
                    <tr><td>Databases</td><td style={{ textAlign: 'right' }}>Moderate</td></tr>
                    <tr><td>JPEG Images</td><td style={{ textAlign: 'right' }}>Low</td></tr>
                    <tr><td>Videos</td><td style={{ textAlign: 'right' }}>Very Low</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY ARCHITECTURE ── */}
      <section className="section section-alt section-border">
        <div className="container">
          <div className="section-header text-center">
            <h2>Security Architecture</h2>
            <p>Comprehensive security at every layer of the backup lifecycle.</p>
          </div>

          <div className="grid grid-2" style={{ marginTop: 'var(--space-12)' }}>
            <div className="card">
              <div className="card-icon"><Lock /></div>
              <h3>Encryption</h3>
              <p className="card-desc">Military-grade AES-256 encryption protects your data both in transit (TLS) and at rest.</p>
            </div>

            <div className="card">
              <div className="card-icon"><ShieldCheck /></div>
              <h3>Authentication & Access</h3>
              <p className="card-desc">Protected by Two-Factor Authentication (2FA) and strict Role-Based Access Control (RBAC).</p>
            </div>

            <div className="card">
              <div className="card-icon"><Database /></div>
              <h3>Data Isolation</h3>
              <p className="card-desc">Logical separation of customer backup repositories ensures cross-tenant data boundaries.</p>
            </div>

            <div className="card">
              <div className="card-icon"><Activity /></div>
              <h3>Audit Logs & Compliance</h3>
              <p className="card-desc">Every backup, restore, login, and configuration change is recorded for strict accountability. Designed to support ISO 27001, SOC 2, GDPR, and HIPAA compliance efforts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TYPES & RECOVERY OPTIONS ── */}
      <section className="section section-border">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <h2 style={{ marginBottom: 'var(--space-6)' }}>Supported Backup Types</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {["Full Backup", "Incremental Backup", "Differential Backup", "Mirror Backup", "Image Backup", "Continuous Backup", "Synthetic Full Backup"].map((type, idx) => (
                  <li key={idx} className="badge badge-blue" style={{ justifyContent: 'flex-start', padding: 'var(--space-3)' }}>
                    <Server size={16} /> {type}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 style={{ marginBottom: 'var(--space-6)' }}>Recovery Capabilities</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {["Individual File & Folder Restore", "Bare Metal Recovery", "Entire System Restore", "Virtual Machine Recovery", "Point-in-Time Recovery", "Disaster Recovery Orchestration"].map((opt, idx) => (
                  <li key={idx} className="badge badge-success" style={{ justifyContent: 'flex-start', padding: 'var(--space-3)' }}>
                    <RefreshCcw size={16} /> {opt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECHNICAL RECOVERY PIPELINE ── */}
      <section className="section section-alt section-border">
        <div className="container text-center">
          <div className="section-header">
            <h2>The Recovery Pipeline</h2>
            <p>A structured, verified process to reconstruct your data safely.</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-10)' }}>
            {["Customer selects restore point", "Integrity Verification", "Encrypted Data Retrieved", "Decrypt Data", "Decompress Data", "Reconstruct Original Files", "Restore to Destination", "Verification Complete"].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div className="badge" style={{ padding: 'var(--space-3) var(--space-5)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  {step}
                </div>
                {idx < 7 && <ArrowRight className="text-muted" size={16} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATIONAL HUB PREVIEW ── */}
      <section className="section section-border">
        <div className="container">
          <div className="section-header text-center">
            <h2>Backup & Security Knowledge Hub</h2>
            <p>Explore our deep-dive technical articles to understand the mechanics of data protection.</p>
          </div>

          <div className="grid grid-3" style={{ marginTop: 'var(--space-12)' }}>
            <Link href="/article/what-is-backup-vs-cloud-storage" className="card" style={{ textDecoration: 'none' }}>
              <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Backup vs Cloud Storage</h4>
              <p className="card-desc">Understand the technical differences between true backup and sync services.</p>
            </Link>
            <Link href="/article/full-vs-incremental-vs-differential-backup" className="card" style={{ textDecoration: 'none' }}>
              <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Incremental vs Differential</h4>
              <p className="card-desc">Learn how different backup strategies impact storage and recovery time.</p>
            </Link>
            <Link href="/article/how-deduplication-works" className="card" style={{ textDecoration: 'none' }}>
              <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>How Deduplication Works</h4>
              <p className="card-desc">A deep dive into block-level tracking and storage optimization.</p>
            </Link>
            <Link href="/article/how-aes-256-encryption-protects-your-data" className="card" style={{ textDecoration: 'none' }}>
              <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>AES-256 Encryption</h4>
              <p className="card-desc">The mathematics and security principles behind military-grade encryption.</p>
            </Link>
            <Link href="/article/understanding-rpo-and-rto" className="card" style={{ textDecoration: 'none' }}>
              <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Understanding RPO & RTO</h4>
              <p className="card-desc">How to design disaster recovery plans based on objective metrics.</p>
            </Link>
            <Link href="/article/ransomware-protection-explained" className="card" style={{ textDecoration: 'none' }}>
              <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Ransomware Protection</h4>
              <p className="card-desc">How modern backup architectures isolate data from malware threats.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section section-border" style={{ textAlign: 'center', background: 'var(--color-bg-tertiary)' }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Secure Your Infrastructure Today</h2>
          <p style={{ marginBottom: 'var(--space-8)' }}>Deploy our enterprise agent and verify your first backup in under 15 minutes.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">
            Request Enterprise Demo
          </Link>
        </div>
      </section>
    </div>
  );
}

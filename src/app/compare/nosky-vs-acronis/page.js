import Link from 'next/link';
import { Check, X, Shield, Clock, HardDrive, Zap, HelpCircle } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FaqSection from '@/components/seo/FaqSection';
import JsonLdScript from '@/components/seo/JsonLdScript';
import { getBreadcrumbSchema, getFaqSchema } from '@/lib/schema';

export const metadata = {
  title: 'NoSky vs Acronis — B2B Cloud Backup & Ransomware Recovery Comparison',
  description: 'Detailed technical and pricing comparison between NoSky Backup Pro and Acronis Cyber Protect. Compare recovery speed, immutability, encryption, and total cost of ownership.',
  keywords: ['NoSky vs Acronis', 'Acronis alternative', 'cloud backup comparison', 'ransomware recovery comparison', 'SMB backup solutions'],
  alternates: {
    canonical: 'https://nosky.io/compare/nosky-vs-acronis',
  },
  openGraph: {
    title: 'NoSky vs Acronis — Cloud Backup Comparison',
    description: 'Compare NoSky Backup Pro and Acronis Cyber Protect for SMB data protection.',
    url: 'https://nosky.io/compare/nosky-vs-acronis',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NoSky vs Acronis Comparison' }],
  },
};

const faqs = [
  {
    question: "Why do SMBs switch from Acronis to NoSky Backup Pro?",
    answer: "Businesses choose NoSky Backup Pro for faster 15-minute RTO, predictable flat-rate storage pricing without complex per-workload licensing, native India data residency, and dedicated 24/7 B2B support."
  },
  {
    question: "Is NoSky Backup Pro as secure as Acronis Cyber Protect?",
    answer: "Yes. NoSky utilizes military-grade AES-256 encryption at rest, TLS 1.3 in transit, SHA-256 block verification, and default immutable storage repositories that prevent ransomware alteration or deletion."
  },
  {
    question: "How does NoSky's pricing model compare to Acronis?",
    answer: "Acronis charges per endpoint, per VM, and per gigabyte with add-on fees for advanced protection features. NoSky provides straightforward, scalable pricing with all security features included."
  }
];

export default function NoskyVsAcronisPage() {
  return (
    <div className="compare-page">
      <JsonLdScript data={getFaqSchema(faqs)} />

      {/* Hero Section */}
      <section className="section section-lg" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-8))', background: 'var(--gradient-hero)' }}>
        <div className="container container-narrow flex-col flex-center text-center">
          <Breadcrumbs items={[{ name: 'Comparisons', url: '/compare' }, { name: 'NoSky vs Acronis', url: '/compare/nosky-vs-acronis' }]} />

          <div className="badge badge-accent my-4">
            B2B Backup Comparison
          </div>

          <h1 className="mb-4">
            NoSky Backup Pro <span className="text-muted">vs</span> Acronis Cyber Protect
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mb-8">
            An objective technical comparison evaluating data recovery speed, ransomware immutability, storage efficiency, compliance, and cost for small and mid-sized enterprises.
          </p>
        </div>
      </section>

      {/* Quick Summary Grid */}
      <section className="section section-border bg-white/[0.01]">
        <div className="container">
          <div className="grid grid-2 gap-8">
            <div className="card p-8 border border-blue-500/30 bg-blue-950/10">
              <span className="badge badge-accent mb-3">NoSky Backup Pro</span>
              <h3 className="text-xl font-bold text-white mb-2">Designed for Rapid SMB Recovery</h3>
              <p className="text-gray-300 mb-4">
                Automated cloud backup with 15-minute recovery point objective, default immutable storage, and transparent flat pricing. Built for businesses needing zero compliance headaches.
              </p>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex items-center gap-2"><Check className="text-emerald-400 w-4 h-4" /> 15-Minute RTO & RPO Guarantee</li>
                <li className="flex items-center gap-2"><Check className="text-emerald-400 w-4 h-4" /> Immutable Storage Included by Default</li>
                <li className="flex items-center gap-2"><Check className="text-emerald-400 w-4 h-4" /> India Data Residency & DPDP Act Compliant</li>
              </ul>
            </div>

            <div className="card p-8 border border-white/10 bg-white/[0.01]">
              <span className="badge mb-3">Acronis Cyber Protect</span>
              <h3 className="text-xl font-bold text-white mb-2">Legacy All-in-One Suite</h3>
              <p className="text-gray-400 mb-4">
                Comprehensive cyber protection suite combining backup with antivirus. Often involves complex feature tiering, add-on licensing costs, and higher management overhead for SMBs.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Check className="text-gray-400 w-4 h-4" /> Comprehensive Antivirus & Endpoint Suite</li>
                <li className="flex items-center gap-2"><X className="text-rose-400 w-4 h-4" /> Complex Multi-Tier Licensing Model</li>
                <li className="flex items-center gap-2"><X className="text-rose-400 w-4 h-4" /> Advanced Features Require Price Upgrades</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Comparison Table */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Feature-by-Feature Matrix</h2>
            <p className="text-gray-400">Detailed technical specs compared side-by-side</p>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-gray-200">
                  <th className="p-4 font-semibold">Technical Feature</th>
                  <th className="p-4 font-semibold text-blue-400">NoSky Backup Pro</th>
                  <th className="p-4 font-semibold text-gray-400">Acronis Cyber Protect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr>
                  <td className="p-4 font-medium text-white">Ransomware Immutability</td>
                  <td className="p-4 text-emerald-400 font-semibold flex items-center gap-2"><Check className="w-4 h-4" /> Default Air-Gapped Immutability</td>
                  <td className="p-4 text-gray-400">Requires Advanced Add-on Tier</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Recovery Speed (RTO)</td>
                  <td className="p-4 text-emerald-400 font-semibold flex items-center gap-2"><Check className="w-4 h-4" /> Under 15 Minutes</td>
                  <td className="p-4 text-gray-400">Variable (Depends on Bandwidth & License)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Encryption Standard</td>
                  <td className="p-4 font-semibold text-white">AES-256 + SHA-256 Verification</td>
                  <td className="p-4 text-gray-400">AES-256</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Compression Engine</td>
                  <td className="p-4 text-emerald-400 font-semibold">High-Ratio LZ4 Compression</td>
                  <td className="p-4 text-gray-400">Standard Zip / Proprietary Compression</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Deduplication Method</td>
                  <td className="p-4 font-semibold text-white">Global Block-Level CBT</td>
                  <td className="p-4 text-gray-400">Source / Target Deduplication</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Data Residency</td>
                  <td className="p-4 text-emerald-400 font-semibold">Tier-IV Datacenters in Mumbai (India)</td>
                  <td className="p-4 text-gray-400">Global Cloud Centers (Regional Varies)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Regulatory Compliance</td>
                  <td className="p-4 text-emerald-400 font-semibold">ISO 27001, SOC 2, DPDP Act, HIPAA</td>
                  <td className="p-4 text-gray-400">ISO 27001, SOC 2, GDPR, HIPAA</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Licensing Structure</td>
                  <td className="p-4 text-emerald-400 font-semibold">Simple Transparent Flat Pricing</td>
                  <td className="p-4 text-gray-400">Per-Agent + Per-TB + Pack Add-ons</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection faqs={faqs} title="NoSky vs Acronis — Frequently Asked Questions" />

      {/* Final CTA */}
      <section className="section section-border text-center bg-white/[0.02]">
        <div className="container">
          <h2 className="text-2xl font-bold text-white mb-4">Switch to Faster, Simpler Cloud Backup</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Get a full trial of NoSky Backup Pro with automated migration support for your existing servers.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">
            Request Demo & Migration Guide
          </Link>
        </div>
      </section>
    </div>
  );
}

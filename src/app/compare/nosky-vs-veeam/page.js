import Link from 'next/link';
import { Check, X, Shield, Clock, HardDrive, Zap, HelpCircle } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FaqSection from '@/components/seo/FaqSection';
import JsonLdScript from '@/components/seo/JsonLdScript';
import { getBreadcrumbSchema, getFaqSchema } from '@/lib/schema';

export const metadata = {
  title: 'NoSky vs Veeam — Enterprise Cloud Backup & Recovery Comparison',
  description: 'Technical comparison between NoSky Backup Pro and Veeam Data Platform. Compare deployment complexity, ransomware immutability, cloud backup performance, and total cost of ownership.',
  keywords: ['NoSky vs Veeam', 'Veeam alternative', 'enterprise cloud backup', 'ransomware recovery comparison', 'SMB backup solutions'],
  alternates: {
    canonical: 'https://nosky.io/compare/nosky-vs-veeam',
  },
  openGraph: {
    title: 'NoSky vs Veeam — Enterprise Cloud Backup Comparison',
    description: 'Compare NoSky Backup Pro and Veeam Data Platform for enterprise backup.',
    url: 'https://nosky.io/compare/nosky-vs-veeam',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NoSky vs Veeam Comparison' }],
  },
};

const faqs = [
  {
    question: "How does NoSky Backup Pro differ from Veeam Data Platform?",
    answer: "Veeam was built primarily for on-premise VMware infrastructure requiring dedicated backup servers and complex SAN setup. NoSky Backup Pro is a cloud-native platform providing immediate setup, zero hardware requirements, and automated 15-minute recovery."
  },
  {
    question: "Is NoSky Backup Pro easier to manage than Veeam?",
    answer: "Yes. Veeam requires specialized certification (VMCE), dedicated backup proxies, repository servers, and complex SQL database management. NoSky provides a unified web portal that deploys in minutes."
  },
  {
    question: "How does cost compare between NoSky and Veeam?",
    answer: "Veeam charges licensing per VUL (Veeam Universal License) socket plus separate cloud storage repository fees. NoSky includes storage and agent management in one simple, transparent subscription."
  }
];

export default function NoskyVsVeeamPage() {
  return (
    <div className="compare-page">
      <JsonLdScript data={getFaqSchema(faqs)} />

      {/* Hero Section */}
      <section className="section section-lg" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-8))', background: 'var(--gradient-hero)' }}>
        <div className="container container-narrow flex-col flex-center text-center">
          <Breadcrumbs items={[{ name: 'Comparisons', url: '/compare' }, { name: 'NoSky vs Veeam', url: '/compare/nosky-vs-veeam' }]} />

          <div className="badge badge-accent my-4">
            B2B Enterprise Comparison
          </div>

          <h1 className="mb-4">
            NoSky Backup Pro <span className="text-muted">vs</span> Veeam Data Platform
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mb-8">
            Compare cloud-native ransomware recovery with legacy backup infrastructure. See why SMBs and IT teams choose NoSky for faster setup and lower total cost.
          </p>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="section">
        <div className="container">
          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-gray-200">
                  <th className="p-4 font-semibold">Capability</th>
                  <th className="p-4 font-semibold text-blue-400">NoSky Backup Pro</th>
                  <th className="p-4 font-semibold text-gray-400">Veeam Data Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr>
                  <td className="p-4 font-medium text-white">Deployment Model</td>
                  <td className="p-4 text-emerald-400 font-semibold flex items-center gap-2"><Check className="w-4 h-4" /> Cloud-Native (Zero Hardware Required)</td>
                  <td className="p-4 text-gray-400">On-Premises Backup Server + Proxies Required</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Time to First Backup</td>
                  <td className="p-4 text-emerald-400 font-semibold">&lt; 15 Minutes</td>
                  <td className="p-4 text-gray-400">Several Hours / Days (Requires SAN & Server Setup)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Immutable Ransomware Vault</td>
                  <td className="p-4 text-emerald-400 font-semibold">Included by Default in Cloud Vault</td>
                  <td className="p-4 text-gray-400">Requires Hardened Linux Repository Configuration</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Encryption Standard</td>
                  <td className="p-4 font-semibold text-white">AES-256 (In-Transit & At-Rest)</td>
                  <td className="p-4 text-gray-400">AES-256</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Management Complexity</td>
                  <td className="p-4 text-emerald-400 font-semibold">Unified Cloud Web Dashboard</td>
                  <td className="p-4 text-gray-400">Heavy Windows Client / Enterprise Manager</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Compliance Standard</td>
                  <td className="p-4 text-emerald-400 font-semibold">DPDP Act, ISO 27001, SOC 2, HIPAA</td>
                  <td className="p-4 text-gray-400">ISO 27001, SOC 2, GDPR, HIPAA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection faqs={faqs} title="NoSky vs Veeam — Frequently Asked Questions" />

      {/* Final CTA */}
      <section className="section section-border text-center bg-white/[0.02]">
        <div className="container">
          <h2 className="text-2xl font-bold text-white mb-4">Simplify Your Backup Infrastructure</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">See how NoSky delivers enterprise reliability without server management overhead.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">
            Schedule Architecture Review
          </Link>
        </div>
      </section>
    </div>
  );
}

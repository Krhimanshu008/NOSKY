import Link from 'next/link';
import { Check, X, Shield, Clock, HardDrive, Zap, HelpCircle } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FaqSection from '@/components/seo/FaqSection';
import JsonLdScript from '@/components/seo/JsonLdScript';
import { getBreadcrumbSchema, getFaqSchema } from '@/lib/schema';

export const metadata = {
  title: 'NoSky CRM vs Zoho CRM — Feature, Pricing & Automation Comparison',
  description: 'Compare NoSky CRM and Zoho CRM for SMB lead management, sales pipeline, quotation generation, and custom workflows. Find out which CRM best fits your sales team.',
  keywords: ['NoSky CRM vs Zoho CRM', 'Zoho CRM alternative', 'B2B CRM comparison', 'lead management software', 'quotation generator CRM'],
  alternates: {
    canonical: 'https://nosky.io/compare/nosky-vs-zoho-crm',
  },
  openGraph: {
    title: 'NoSky CRM vs Zoho CRM — B2B CRM Comparison',
    description: 'Compare NoSky CRM and Zoho CRM for growing B2B sales teams.',
    url: 'https://nosky.io/compare/nosky-vs-zoho-crm',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NoSky CRM vs Zoho CRM' }],
  },
};

const faqs = [
  {
    question: "Why should businesses consider NoSky CRM over Zoho CRM?",
    answer: "NoSky CRM provides a faster, clutter-free user interface focused specifically on B2B lead pipelines, built-in PDF quotation and GST invoice generation, native WhatsApp automation, and personalized support without lock-in modules."
  },
  {
    question: "How does NoSky CRM pricing compare to Zoho CRM?",
    answer: "Zoho CRM splits critical features across multiple add-ons (Zoho Books, Zoho Sign, Zoho SalesIQ), driving up monthly per-user costs. NoSky CRM includes lead management, quotations, and pipeline tracking in one transparent tier."
  },
  {
    question: "Can I migrate existing data from Zoho CRM to NoSky CRM?",
    answer: "Yes! NoSky provides automated CSV/JSON migration tools to import leads, deals, contacts, accounts, and historical logs seamlessly."
  }
];

export default function NoskyVsZohoCrmPage() {
  return (
    <div className="compare-page">
      <JsonLdScript data={getFaqSchema(faqs)} />
      
      {/* Hero Section */}
      <section className="section section-lg" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-8))', background: 'var(--gradient-hero)' }}>
        <div className="container container-narrow flex-col flex-center text-center">
          <Breadcrumbs items={[{ name: 'Comparisons', url: '/compare' }, { name: 'NoSky CRM vs Zoho CRM', url: '/compare/nosky-vs-zoho-crm' }]} />
          
          <div className="badge badge-accent my-4">
            B2B CRM Comparison
          </div>

          <h1 className="mb-4">
            NoSky CRM <span className="text-muted">vs</span> Zoho CRM
          </h1>
          
          <p className="text-lg text-gray-300 max-w-2xl mb-8">
            Compare sales automation, lead conversion speed, quotation management, and overall value for growing B2B sales teams.
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
                  <th className="p-4 font-semibold text-blue-400">NoSky CRM</th>
                  <th className="p-4 font-semibold text-gray-400">Zoho CRM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr>
                  <td className="p-4 font-medium text-white">Interface & Speed</td>
                  <td className="p-4 text-emerald-400 font-semibold flex items-center gap-2"><Check className="w-4 h-4" /> Fast, Modern Kanban Layout</td>
                  <td className="p-4 text-gray-400">Feature-Dense, Steep Learning Curve</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Quotation & Invoice Generation</td>
                  <td className="p-4 text-emerald-400 font-semibold">Built-in 1-Click PDF Generator</td>
                  <td className="p-4 text-gray-400">Requires Zoho Books Add-on Integration</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">WhatsApp & SMS Follow-ups</td>
                  <td className="p-4 text-emerald-400 font-semibold">Native Direct Integration</td>
                  <td className="p-4 text-gray-400">Requires Extension / Third-party Marketplace</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Cloud Backup Integration</td>
                  <td className="p-4 text-emerald-400 font-semibold">Direct Native Sync with NoSky Vault</td>
                  <td className="p-4 text-gray-400">Manual Data Exports Required</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Data Sovereignty</td>
                  <td className="p-4 text-emerald-400 font-semibold">India Tier-IV Datacenters (DPDP Act)</td>
                  <td className="p-4 text-gray-400">Multi-region DC Network</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection faqs={faqs} title="NoSky CRM vs Zoho CRM — Frequently Asked Questions" />

      {/* Final CTA */}
      <section className="section section-border text-center bg-white/[0.02]">
        <div className="container">
          <h2 className="text-2xl font-bold text-white mb-4">Empower Your Sales Team Today</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Experience a clean, fast CRM designed to convert more deals with less friction.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">
            Request Demo & Live Preview
          </Link>
        </div>
      </section>
    </div>
  );
}

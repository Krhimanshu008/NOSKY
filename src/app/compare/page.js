import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FaqSection from '@/components/seo/FaqSection';

export const metadata = {
  title: 'B2B Software Comparisons — NoSky vs Alternatives',
  description: 'Compare NoSky Backup Pro and NoSky CRM against top industry alternatives like Acronis, Veeam, and Zoho CRM.',
  alternates: {
    canonical: 'https://nosky.io/compare',
  },
};

const compareFaqs = [
  {
    question: "How does NoSky evaluate competitor products in comparisons?",
    answer: "Our comparison guides are built on verified technical specifications, published licensing models, data residency parameters, and real-world recovery performance metrics."
  },
  {
    question: "Can NoSky assist in migrating from competitor products?",
    answer: "Yes. NoSky provides automated migration utilities and dedicated technical support to help businesses seamlessly transition from Acronis, Veeam, or Zoho CRM."
  }
];

export default function CompareIndexPage() {
  return (
    <div className="compare-index-page">
      <section className="section section-lg" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-8))', background: 'var(--gradient-hero)' }}>
        <div className="container container-narrow flex-col flex-center text-center">
          <Breadcrumbs items={[{ name: 'Comparisons', url: '/compare' }]} />

          <h1 className="my-4">B2B Product Comparisons</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            See how NoSky cloud backup and CRM solutions stack up against legacy competitors in performance, security, and total cost of ownership.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3 gap-8">
            <div className="card p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="badge badge-accent mb-3">Backup & Recovery</span>
                <h3 className="text-xl font-bold text-white mb-2">NoSky vs Acronis</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Compare recovery speed, immutable ransomware vaults, compression efficiency, and pricing between NoSky Backup Pro and Acronis Cyber Protect.
                </p>
              </div>
              <Link href="/compare/nosky-vs-acronis" className="btn btn-secondary btn-sm flex items-center justify-between">
                <span>View Full Comparison</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="card p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="badge badge-accent mb-3">Enterprise Backup</span>
                <h3 className="text-xl font-bold text-white mb-2">NoSky vs Veeam</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Analyze cloud-native ransomware recovery vs legacy Veeam SAN/VM backup infrastructure.
                </p>
              </div>
              <Link href="/compare/nosky-vs-veeam" className="btn btn-secondary btn-sm flex items-center justify-between">
                <span>View Full Comparison</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="card p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="badge badge-accent mb-3">Sales & CRM</span>
                <h3 className="text-xl font-bold text-white mb-2">NoSky CRM vs Zoho CRM</h3>
                <p className="text-gray-400 text-sm mb-6">
                  See how NoSky CRM delivers 1-click quotations, WhatsApp automation, and visual pipelines without add-on complexity.
                </p>
              </div>
              <Link href="/compare/nosky-vs-zoho-crm" className="btn btn-secondary btn-sm flex items-center justify-between">
                <span>View Full Comparison</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FaqSection faqs={compareFaqs} title="Product Comparison FAQs" subtitle="Common questions about evaluating NoSky against legacy software." />
    </div>
  );
}

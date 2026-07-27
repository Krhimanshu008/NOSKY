import Link from 'next/link';
import { Building2, ShieldCheck, MapPin, Calendar, FileText, CheckCircle2, Award, Users, Server } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLdScript from '@/components/seo/JsonLdScript';
import { getOrganizationSchema } from '@/lib/schema';

export const metadata = {
  title: 'About Us — Elcom Digital Solutions & NoSky Platform',
  description: 'Learn about Elcom Digital Solutions Private Limited, the company behind NoSky enterprise cloud backup and ransomware recovery platform. Corporate registration, leadership, and office locations.',
  keywords: ['Elcom Digital Solutions Private Limited', 'NoSky About Us', 'cloud backup company India', 'corporate identity', 'Sagar Narang', 'Somesh Narang', 'Somya Narang'],
  alternates: {
    canonical: 'https://nosky.io/about',
  },
  openGraph: {
    title: 'About Elcom Digital Solutions Private Limited | NoSky',
    description: 'Learn about Elcom Digital Solutions Private Limited, the creators of NoSky cloud backup and ransomware recovery.',
    url: 'https://nosky.io/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About Elcom Digital Solutions' }],
  },
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <JsonLdScript data={getOrganizationSchema()} />

      {/* Hero Section */}
      <section className="section section-lg" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-8))', background: 'var(--gradient-hero)' }}>
        <div className="container container-narrow flex-col flex-center text-center">
          <Breadcrumbs items={[{ name: 'About Us', url: '/about' }]} />

          <div className="badge badge-accent my-4">
            Corporate Profile & Mission
          </div>

          <h1 className="mb-4">
            Building Bulletproof Infrastructure <br />
            <span className="text-gradient">for Modern Businesses</span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mb-6">
            NoSky is an enterprise cloud backup, ransomware recovery, and business SaaS platform engineered by <strong>Elcom Digital Solutions Private Limited</strong>.
          </p>
        </div>
      </section>

      {/* Corporate Registration Details */}
      <section className="section section-border bg-white/[0.01]">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Corporate Identity & Verification</h2>
            <p className="text-gray-400">Official registration details with the Ministry of Corporate Affairs (MCA), Government of India</p>
          </div>

          <div className="grid grid-3 gap-6">
            <div className="card p-6 border border-white/10">
              <Building2 className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Legal Corporate Entity</h3>
              <p className="text-sm text-gray-300 font-semibold mb-2">ELCOM DIGITAL SOLUTIONS PRIVATE LIMITED</p>
              <p className="text-xs text-gray-400">Incorporated under the Companies Act, 2013 as a Private Limited Company limited by shares.</p>
            </div>

            <div className="card p-6 border border-white/10">
              <Calendar className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Incorporation Date</h3>
              <p className="text-sm text-gray-300 font-semibold mb-2">July 9, 2021</p>
              <p className="text-xs text-gray-400">Delivering reliable IT infrastructure and cloud security solutions across India and globally.</p>
            </div>

            <div className="card p-6 border border-white/10">
              <FileText className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Corporate Registration</h3>
              <div className="space-y-1 text-xs text-gray-300">
                <p><strong>CIN:</strong> U72900UP2021PTC226771</p>
                <p><strong>PAN:</strong> AAGCE5488H</p>
                <p><strong>TAN:</strong> DELE15957E</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Directors */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Executive Leadership</h2>
            <p className="text-gray-400">Members of the Board of Directors driving technology and growth</p>
          </div>

          <div className="grid grid-3 gap-6 max-w-4xl mx-auto">
            <div className="card p-6 border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                SN
              </div>
              <h3 className="text-lg font-bold text-white">Sagar Narang</h3>
              <p className="text-xs text-blue-400 font-medium mb-2">Director</p>
              <p className="text-xs text-gray-400">Leading product architecture and technology strategy.</p>
            </div>

            <div className="card p-6 border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                SN
              </div>
              <h3 className="text-lg font-bold text-white">Somesh Narang</h3>
              <p className="text-xs text-blue-400 font-medium mb-2">Director</p>
              <p className="text-xs text-gray-400">Guiding corporate operations and strategic growth.</p>
            </div>

            <div className="card p-6 border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                SN
              </div>
              <h3 className="text-lg font-bold text-white">Somya Narang</h3>
              <p className="text-xs text-blue-400 font-medium mb-2">Director</p>
              <p className="text-xs text-gray-400">Overseeing operational compliance and partner relations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations & GST Registrations */}
      <section className="section section-border bg-white/[0.01]">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Corporate Office Network</h2>
            <p className="text-gray-400">Principal places of business and GST tax registrations</p>
          </div>

          <div className="grid grid-3 gap-6">
            <div className="card p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Noida Corporate Office</h3>
              </div>
              <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                4th Floor, Industrial Plot No. B-12, Udyog Marg, Sector 1, Noida, Gautam Buddha Nagar, Uttar Pradesh — 201301
              </p>
              <div className="badge badge-accent text-xs">
                GSTIN: 09AAGCE5488H1Z6
              </div>
            </div>

            <div className="card p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Delhi Registered Office</h3>
              </div>
              <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                G/F, G D Narang B-51, New Ashoka Niketan, East Delhi, Delhi — 110092
              </p>
              <div className="badge text-xs">
                GSTIN: 07AAGCE5488H1ZA
              </div>
            </div>

            <div className="card p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Kolkata Regional Office</h3>
              </div>
              <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                5th Floor, Room 552, Poddar Court Gate No. 2, 18 Rabindra Sarani, Kolkata, West Bengal — 700006
              </p>
              <div className="badge text-xs">
                GSTIN: 19AAGCE5488H1Z5
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Data Centers */}
      <section className="section text-center">
        <div className="container container-narrow">
          <div className="badge badge-accent mb-4 inline-flex items-center gap-1.5">
            <Server className="w-4 h-4" />
            <span>Infrastructure Integrity</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise Compliance & Global Data Nodes</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            NoSky guarantees native data sovereignty for Indian businesses with Tier-IV data centers in Mumbai, alongside international nodes in Singapore, Frankfurt, and Virginia. Compliant with ISO 27001, SOC 2 Type II, Indian DPDP Act, HIPAA, and GDPR.
          </p>
          <Link href="/contact" className="btn btn-primary btn-lg">
            Connect With Our Team
          </Link>
        </div>
      </section>
    </div>
  );
}

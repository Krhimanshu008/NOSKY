import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlobalAurora from '@/components/ui/GlobalAurora';
import FloatingConnect from '@/components/ui/FloatingConnect';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import JsonLdScript from '@/components/seo/JsonLdScript';
import { getOrganizationSchema, getWebSiteSchema, getSoftwareApplicationSchema } from '@/lib/schema';

// Self-hosted Google Fonts via next/font — no render-blocking CSS import
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'NoSky — Enterprise Cloud Backup & Ransomware Recovery',
    template: '%s | NoSky',
  },
  description: 'NoSky protects SMB data with automated cloud backup, immutable storage, and 15-minute ransomware recovery. AES-256 encryption & DPDP Act compliance.',
  keywords: ['cloud backup', 'ransomware recovery', 'immutable backup', 'SMB backup', 'disaster recovery', 'NoSky', 'data protection', 'CRM software', 'FinVault', 'NoSky Manage'],
  authors: [{ name: 'NoSky by Elcom Digital Solutions' }],
  creator: 'Elcom Digital Solutions',
  publisher: 'NoSky',
  metadataBase: new URL('https://nosky.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nosky.io',
    siteName: 'NoSky',
    title: 'NoSky — Cloud Backup & Ransomware Recovery for Businesses',
    description: 'Automated cloud backup and 15-minute ransomware recovery for small and mid-sized businesses.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NoSky — Enterprise Cloud Backup & Recovery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoSky — Enterprise Cloud Backup & Ransomware Recovery',
    description: 'Automated cloud backup and 15-minute ransomware recovery for SMBs.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const orgSchema = getOrganizationSchema();
const siteSchema = getWebSiteSchema();
const appSchema = getSoftwareApplicationSchema();

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <JsonLdScript data={orgSchema} />
        <JsonLdScript data={siteSchema} />
        <JsonLdScript data={appSchema} />
      </head>
      <body>
        <AnalyticsTracker />
        <GlobalAurora />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingConnect />
      </body>
    </html>
  );
}

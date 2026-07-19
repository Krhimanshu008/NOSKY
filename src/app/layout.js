import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlobalAurora from '@/components/ui/GlobalAurora';
import FloatingConnect from '@/components/ui/FloatingConnect';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import { sanitizeJsonLd } from '@/lib/sanitize';

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
    default: 'NoSky',
    template: '%s | NoSky',
  },
  description: 'NoSky protects SMB data with automated cloud backup, immutable storage, and 15-minute ransomware recovery. Contact us for a free demo.',
  keywords: ['cloud backup', 'ransomware recovery', 'immutable backup', 'SMB backup', 'disaster recovery', 'NoSky', 'data protection'],
  authors: [{ name: 'NoSky by Elcom Digital Solutions' }],
  creator: 'Elcom Digital Solutions',
  publisher: 'NoSky',
  metadataBase: new URL('https://nosky.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nosky.io',
    siteName: 'NoSky',
    title: 'NoSky — Cloud Backup & Ransomware Recovery for Small Businesses',
    description: 'Automated cloud backup and 15-minute ransomware recovery for small and mid-sized businesses.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NoSky — Cloud Backup & Recovery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoSky — Cloud Backup & Ransomware Recovery',
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

// Global JSON-LD schemas
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NoSky',
  url: 'https://nosky.io',
  logo: 'https://nosky.io/noskywhite.webp',
  description: 'Automated cloud backup and ransomware recovery for small and mid-sized businesses.',
  foundingDate: '2023',
  founder: {
    '@type': 'Person',
    name: 'Himanshu Kumar',
    jobTitle: 'Founder & CEO',
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'Elcom Digital Solutions',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ghaziabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'sales@nosky.io',
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'help@nosky.io',
    },
  ],
  sameAs: [
    'https://www.facebook.com/elcomdigital',
    'https://www.instagram.com/elcom.digital/',
    'https://x.com/ElcomDigital22',
    'https://www.linkedin.com/company/elcom-digital/',
    'https://www.youtube.com/@ElcomDigital',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NoSky',
  url: 'https://nosky.io',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://nosky.io/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'NoSky',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Cloud, Web, Windows, macOS, Linux',
  description: 'Cloud backup software with immutable storage, ransomware protection, and 15-minute recovery for small businesses.',
  featureList: [
    'Immutable cloud backup',
    'Ransomware protection',
    '15-minute recovery',
    'Microsoft 365 backup',
    'Endpoint backup',
    'Disaster recovery',
    'AES-256 encryption',
    'Multi-tenant MSP support',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    description: 'Contact us for pricing. Free trial available.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(softwareSchema) }}
        />
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

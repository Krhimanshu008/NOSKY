import { sanitizeJsonLd } from './sanitize';

const BASE_URL = 'https://nosky.io';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Elcom Digital Solutions Private Limited',
    alternateName: 'NoSky',
    url: BASE_URL,
    logo: `${BASE_URL}/noskywhite.webp`,
    description: 'Automated cloud backup, immutable storage, and 15-minute ransomware recovery for small and mid-sized businesses.',
    foundingDate: '2021-07-09',
    taxID: '09AAGCE5488H1Z6',
    vatID: 'AAGCE5488H',
    legalName: 'ELCOM DIGITAL SOLUTIONS PRIVATE LIMITED',
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CIN',
      value: 'U72900UP2021PTC226771',
    },
    founders: [
      { '@type': 'Person', name: 'Somesh Narang' },
      { '@type': 'Person', name: 'Somya Narang' },
      { '@type': 'Person', name: 'Sagar Narang' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4th Floor, Industrial Plot No. B-12, Udyog Marg, Sector 1',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201301',
      addressCountry: 'IN',
    },
    location: [
      {
        '@type': 'Place',
        name: 'Noida Corporate Office',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'B-12, 4th Floor, Sector 1',
          addressLocality: 'Noida',
          addressRegion: 'Uttar Pradesh',
          postalCode: '201301',
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'Place',
        name: 'Delhi Registered Office',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'G/F, G D Narang B-51, New Ashoka Niketan',
          addressLocality: 'East Delhi',
          addressRegion: 'Delhi',
          postalCode: '110092',
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'Place',
        name: 'Kolkata Office',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '5th Floor, Room 552, Poddar Court Gate 2, 18 Rabindra Sarani',
          addressLocality: 'Kolkata',
          addressRegion: 'West Bengal',
          postalCode: '700006',
          addressCountry: 'IN',
        },
      },
    ],
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
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NoSky',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/article?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getSoftwareApplicationSchema(data = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.name || 'NoSky Backup Pro',
    applicationCategory: data.category || 'BusinessApplication',
    operatingSystem: data.os || 'Cloud, Web, Windows, macOS, Linux',
    description: data.description || 'Cloud backup software with immutable storage, ransomware protection, and 15-minute recovery.',
    featureList: data.features || [
      'Immutable cloud backup',
      '15-minute ransomware recovery',
      'AES-256 encryption',
      'SHA-256 verification',
      'Microsoft 365 backup',
      'Endpoint & server protection',
    ],
    offers: {
      '@type': 'Offer',
      price: data.price || '0',
      priceCurrency: data.priceCurrency || 'INR',
      description: data.offerDescription || 'Contact us for enterprise pricing. Free demo available.',
    },
  };
}

export function getBreadcrumbSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export function getFaqSchema(faqs = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getArticleSchema(article = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: article.coverImage ? [article.coverImage] : [`${BASE_URL}/og-image.png`],
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Person',
      name: article.author || 'Himanshu Kumar',
    },
    publisher: getOrganizationSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/article/${article.slug}`,
    },
  };
}

export { sanitizeJsonLd };

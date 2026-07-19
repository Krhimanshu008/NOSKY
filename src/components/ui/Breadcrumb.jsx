import Link from 'next/link';
import { sanitizeJsonLd } from '@/lib/sanitize';

export default function Breadcrumb({ items }) {
  // items: [{ label: 'Home', href: '/' }, { label: 'Product', href: '/product' }, { label: 'Cloud Backup' }]
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://nosky.io${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(breadcrumbSchema) }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <span key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {index > 0 && <span className="breadcrumb-sep">/</span>}
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

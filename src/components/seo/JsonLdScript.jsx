import { sanitizeJsonLd } from '@/lib/sanitize';

export default function JsonLdScript({ data }) {
  if (!data) return null;
  const jsonString = typeof data === 'string' ? data : sanitizeJsonLd(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

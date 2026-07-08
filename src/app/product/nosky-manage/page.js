import Image from 'next/image';

export default function NoskyManagePage() {
  return (
    <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Image src="/logos/Manage  - White.png" alt="Nosky Manage 2.0" width={180} height={180} style={{ objectFit: 'contain', marginBottom: 'var(--space-6)' }} />
      <h1>Nosky Manage 2.0</h1>
      <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)' }}>
        HR management software.
      </p>
    </div>
  );
}

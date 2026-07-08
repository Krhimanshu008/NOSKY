import Image from 'next/image';

export default function NoskyBackupProPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Image src="/logos/Layer-1.png" alt="Nosky Backup Pro" width={180} height={180} style={{ objectFit: 'contain', marginBottom: 'var(--space-6)' }} />
      <h1>Nosky Backup Pro</h1>
      <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)' }}>
        Backup services for any type of industry.
      </p>
    </div>
  );
}

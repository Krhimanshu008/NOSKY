import Image from 'next/image';

export default function NoskyFinvaultPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Image src="/logos/finvault-white.png" alt="Nosky Finvault" width={180} height={180} style={{ objectFit: 'contain', marginBottom: 'var(--space-6)' }} />
      <h1>Nosky Finvault</h1>
      <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', maxWidth: '800px', margin: 'var(--space-4) auto 0' }}>
        Backup services specifically in the finance sector. A MOU has been signed with ICAI regarding this as there are multiple changes in Tax and other laws regarding backup of financial data.
      </p>
    </div>
  );
}

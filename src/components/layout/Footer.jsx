import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Nosky Backup Pro', href: '/product/nosky-backup-pro' },
        { label: 'Nosky CRM', href: '/product/nosky-crm' },
        { label: 'Nosky Manage 2.0', href: '/product/nosky-manage' },
        { label: 'Nosky Finvault', href: '/product/nosky-finvault' },
      ]
    },
    {
      title: 'Discover',
      links: [
        { label: 'Achievements', href: '/achievements' },
        { label: 'Article', href: '/article' },
        { label: 'Careers', href: '/careers' },
        { label: 'Testimonials', href: '/testimonials' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Security', href: '/security' },
      ]
    }
  ];

  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/noskywhite.webp" alt="NoSky" width={100} height={28} />
            <p>
              Automated cloud backup and ransomware recovery for small and mid-sized businesses. 
              Immutable by default. Recovery in minutes.
            </p>
            <div className="footer-social" style={{ marginTop: 'var(--space-6)' }}>
              <a href="https://linkedin.com/company/nosky" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="https://twitter.com/nosky_io" target="_blank" rel="noopener noreferrer" aria-label="Twitter">𝕏</a>
              <a href="https://youtube.com/@nosky" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶</a>
              <a href="https://github.com/nosky" target="_blank" rel="noopener noreferrer" aria-label="GitHub">⌂</a>
            </div>
          </div>

          {columns.map(col => (
            <div key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <div className="footer-links">
                {col.links.map(link => (
                  <Link key={link.href} href={link.href}>{link.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>© {currentYear} NoSky by Elcom Digital Solutions. All rights reserved.</span>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/cookies">Cookies</Link>
            <Link href="/legal/dpdp">DPDP</Link>
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Data centers in Mumbai · Singapore · Frankfurt · Virginia
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/article') || 
    pathname?.startsWith('/achievement')
  ) {
    return null;
  }

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
            <Image src="/noskywhite.webp" alt="NoSky" width={150} height={40} style={{ objectFit: 'contain' }} />
            <p>
              Automated cloud backup and ransomware recovery for small and mid-sized businesses. 
              Immutable by default. Recovery in minutes.
            </p>
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

          <div className="footer-centers" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', opacity: 0.7 }}>
            Data centers in Mumbai · Singapore · Frankfurt · Virginia
          </div>

          <div className="footer-social">
            <a href="https://www.facebook.com/elcomdigital" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://www.instagram.com/elcom.digital/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://x.com/ElcomDigital22" target="_blank" rel="noopener noreferrer" aria-label="X">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/elcom-digital/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://www.youtube.com/@ElcomDigital" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

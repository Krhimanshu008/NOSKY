'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Lottie from 'lottie-react';
import menuAnimation from '../../../public/Micro Animations/menuV2.json';
import { useRef } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const lottieRef = useRef(null);

  // Check auth state client-side (lightweight, doesn't block SSR/ISR)
  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => setIsAuthenticated(data.authenticated))
      .catch(() => setIsAuthenticated(false));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY;

      // Update scrolled (background + border)
      setScrolled(currentY > 20);

      // Hide on scroll-down (past 80px), reveal on scroll-up
      if (!mobileOpen) {
        if (diff > 6 && currentY > 80) {
          setNavHidden(true);
        } else if (diff < -4) {
          setNavHidden(false);
        }
      }

      lastScrollY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const productLinks = [
    { label: 'Nosky Backup Pro', href: '/product/nosky-backup-pro', logo: '/logos/Layer-1.png' },
    { label: 'Nosky CRM', href: '/product/nosky-crm', logo: '/logos/CRM - White.png' },
    { label: 'Nosky Manage 2.0', href: '/product/nosky-manage', logo: '/logos/Manage  - White.png' },
    { label: 'Nosky Finvault', href: '/product/nosky-finvault', logo: '/logos/finvault-white.png' },
  ];

  // Hide the global public Header on admin routes and reading pages
  if (
    pathname?.startsWith('/admin') ||
    (pathname?.startsWith('/article/') && pathname !== '/article') ||
    (pathname?.startsWith('/achievement/') && pathname !== '/achievements')
  ) {
    return null;
  }

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${navHidden ? 'nav-hidden' : ''}`} id="site-header">
      <div className="header-inner">
        <Link href="/" className="header-logo" aria-label="NoSky Home">
          <Image src="/noskywhite.webp" alt="NoSky" width={160} height={44} style={{ objectFit: 'contain' }} priority />
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          <Link href="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </Link>
          <div className="nav-dropdown-wrapper" style={{ position: 'relative' }}>
            <span className="nav-link nav-link-dropdown">
              Product <span className="nav-dropdown-icon">▾</span>
            </span>
            <div className="nav-dropdown">
              {productLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {link.logo ? (
                    <Image src={link.logo} alt="" width={24} height={24} style={{ objectFit: 'contain', flexShrink: 0 }} />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
                      <circle cx="9" cy="8" r="3"/>
                      <circle cx="17" cy="10" r="2.4"/>
                      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                    </svg>
                  )}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/about" className="nav-link">About</Link>
          <Link href="/achievements" className="nav-link">Achievements</Link>
          <Link href="/article" className="nav-link">Article</Link>
          <Link href="/careers" className="nav-link">Careers</Link>
          <Link href="/testimonials" className="nav-link">Testimonials</Link>
          <Link href="/security" className="nav-link">Security</Link>
        </nav>

        <div className="header-actions" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link href="/admin/dashboard" className="nav-link" style={{ fontSize: '13px' }}>Dashboard</Link>
              <button onClick={handleLogout} className="header-signin" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--color-danger)' }}>Logout</button>
            </>
          ) : (
            pathname !== '/admin' && (
              <Link href="/admin" className="header-signin">Sign in</Link>
            )
          )}
        </div>

        <button
          className="mobile-toggle"
          onClick={() => {
            if (!mobileOpen) {
              lottieRef.current?.setDirection(1);
              lottieRef.current?.play();
            } else {
              lottieRef.current?.setDirection(-1);
              lottieRef.current?.play();
            }
            setMobileOpen(!mobileOpen);
          }}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          style={{ background: 'none', border: 'none', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Lottie 
            lottieRef={lottieRef} 
            animationData={menuAnimation} 
            loop={false} 
            autoplay={false}
            style={{ width: 32, height: 32, filter: 'invert(1)' }} // Inverting if it's black to make it white for dark header.
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link href="/" className="nav-link" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </Link>
        <Link href="/product/nosky-backup-pro" className="nav-link" onClick={() => setMobileOpen(false)}>Nosky Backup Pro</Link>
        <Link href="/product/nosky-crm" className="nav-link" onClick={() => setMobileOpen(false)}>Nosky CRM</Link>
        <Link href="/product/nosky-manage" className="nav-link" onClick={() => setMobileOpen(false)}>Nosky Manage 2.0</Link>
        <Link href="/product/nosky-finvault" className="nav-link" onClick={() => setMobileOpen(false)}>Nosky Finvault</Link>
        <Link href="/achievements" className="nav-link" onClick={() => setMobileOpen(false)}>Achievements</Link>
        <Link href="/article" className="nav-link" onClick={() => setMobileOpen(false)}>Article</Link>
        <Link href="/careers" className="nav-link" onClick={() => setMobileOpen(false)}>Careers</Link>
        <Link href="/testimonials" className="nav-link" onClick={() => setMobileOpen(false)}>Testimonials</Link>
        <Link href="/security" className="nav-link" onClick={() => setMobileOpen(false)}>Security</Link>
        <Link href="/about" className="nav-link" onClick={() => setMobileOpen(false)}>About</Link>
        <Link href="/contact" className="nav-link" onClick={() => setMobileOpen(false)}>Contact</Link>
        <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Link href="/contact" className="btn btn-primary btn-lg" onClick={() => setMobileOpen(false)}>
            Contact Sales →
          </Link>
        </div>
      </div>
    </header>
  );
}

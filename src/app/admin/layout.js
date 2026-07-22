'use client';

import './admin.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { LayoutDashboard, FileText, BarChart2, Settings, ChevronLeft, ChevronRight, Home } from 'lucide-react';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-body' });

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('nosky_admin_sidebar_collapsed');
      if (savedState === 'true') {
        setIsCollapsed(true);
      }
    }
  }, []);

  // If on login page (/admin), render clean children without sidebar wrapper
  if (pathname === '/admin') {
    return children;
  }

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nosky_admin_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  const navItems = [
    { label: 'OVERVIEW', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'CONTENT', path: '/admin/content', icon: FileText },
    { label: 'ANALYTICS', path: '/admin/analytics', icon: BarChart2 },
    { label: 'SETTINGS', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={`admin-neo-layout blueprint-bg ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      {/* LEFT SIDEBAR */}
      <aside className={`admin-sidebar relative ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Decorative Grid Accent inside Sidebar */}
        <div className="absolute inset-0 blueprint-bg opacity-30 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Sidebar Brand Header */}
          <div className="admin-sidebar-header">
            {isCollapsed ? (
              // COLLAPSED: centered clickable >_ logo box
              <button
                onClick={toggleSidebar}
                className="admin-collapsed-logo-btn"
                title="Expand Sidebar"
              >
                <div className="admin-sidebar-icon font-heading font-bold">
                  &gt;_
                </div>
              </button>
            ) : (
              // EXPANDED: logo icon + NOSKY ADMIN title + collapse button
              <>
                <div className="admin-sidebar-logo">
                  <div className="admin-sidebar-icon font-heading font-bold">
                    &gt;_
                  </div>
                  <div className="admin-sidebar-title">
                    NOSKY ADMIN
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="admin-collapse-btn"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft size={16} />
                </button>
              </>
            )}
          </div>

          {/* Navigation links */}
          <nav className="admin-sidebar-nav">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`admin-nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed-item' : ''}`}
                  title={item.label}
                >
                  <Icon size={18} strokeWidth={2} className="admin-nav-icon" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
          
          {/* Bottom footer - Elevated above Next.js overlay */}
          <div className="admin-sidebar-footer relative z-10">
            <Link 
              href="/" 
              className={`admin-return-link ${isCollapsed ? 'collapsed-return' : ''}`}
              title="Return to Site"
            >
              <div className="admin-return-icon">
                <Home size={16} />
              </div>
              {!isCollapsed && <span className="admin-return-text">Return to Site</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN CANVAS AREA */}
      <main className="admin-main-content">
        <div className="admin-content-scrollable relative">
          {/* Architectural Crosshairs Decorative Overlays */}
          <span className="neo-header-plus" style={{top: '1rem', left: '1rem', bottom: 'auto'}}>+</span>
          <span className="neo-header-plus" style={{top: '1rem', right: '1rem', left: 'auto', bottom: 'auto'}}>+</span>
          <span className="neo-header-plus" style={{bottom: '1rem', left: '1rem'}}>+</span>
          <span className="neo-header-plus" style={{bottom: '1rem', right: '1rem', left: 'auto'}}>+</span>

          {children}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Users, Activity, Target, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, visitorsRes, historyRes] = await Promise.all([
          fetch('/api/analytics/dashboard'),
          fetch('/api/analytics/visitors'),
          fetch('/api/admin/login-history')
        ]);
        const statsData = await statsRes.json();
        const visitorsData = await visitorsRes.json();
        
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setLoginHistory(historyData.logs || []);
        }
        
        setStats(statsData);
        // Sort and get top 5 hot leads
        setVisitors(visitorsData.sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0)).slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getLeadBadge = (score = 0) => {
    if (score >= 50) return <span style={{ padding: '2px 6px', background: 'rgba(255, 59, 48, 0.2)', color: '#ff3b30', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>🔥 Hot</span>;
    if (score >= 20) return <span style={{ padding: '2px 6px', background: 'rgba(255, 149, 0, 0.2)', color: '#ff9500', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>☀️ Warm</span>;
    return <span style={{ padding: '2px 6px', background: 'rgba(52, 199, 89, 0.2)', color: '#34c759', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>❄️ Cold</span>;
  };

  const formatDuration = (seconds = 0) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', background: '#05070a' }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* ━━━ SIDEBAR ━━━ */}
      <aside className="admin-sidebar">
        <div style={{ padding: 'var(--space-2) var(--space-4)', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-accent)' }}>
            NoSky<span style={{ color: 'var(--color-text-primary)' }}>Admin</span>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Link href="/admin/dashboard" className="admin-nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </Link>
          <Link href="/admin/content" className="admin-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Content
          </Link>
          <Link href="/admin/editor" className="admin-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Create Post
          </Link>
          
          <div style={{ margin: 'var(--space-6) 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}></div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 var(--space-4) var(--space-2)' }}>Platform Tools</div>
          
          <Link href="/admin/media" className="admin-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Media Library
          </Link>
          <Link href="/admin/analytics" className="admin-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Analytics
          </Link>
          <Link href="/admin/settings" className="admin-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Settings
          </Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <Link href="/" className="admin-nav-item" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* ━━━ MAIN CONTENT ━━━ */}
      <main className="admin-main">
        <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>Dashboard Overview</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>High-level insights into your business performance today.</p>
          </div>
          <Link href="/admin/analytics" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
            Full Analytics Report <ArrowRight size={16} />
          </Link>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-3" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="admin-glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}><Users size={24} /></div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Visitors</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.todayVisitors || 0}</div>
            </div>
          </div>
          
          <div className="admin-glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}><Activity size={24} /></div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Page Views</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalViews || 0}</div>
            </div>
          </div>
          
          <div className="admin-glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '12px', background: 'rgba(245, 166, 35, 0.1)', borderRadius: '12px', color: '#f5a623' }}><Target size={24} /></div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Unique Visitors</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalVisitors || 0}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
          {/* HOTTEST LEADS */}
          <div className="admin-glass-panel" style={{ padding: 0 }}>
            <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontWeight: 600 }}>Top Prospects</h3>
              <Link href="/admin/analytics" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>View All</Link>
            </div>
            <table className="admin-table">
              <thead><tr><th>Visitor IP</th><th>Score</th><th>Last Seen</th></tr></thead>
              <tbody>
                {visitors.length > 0 ? visitors.map((v, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'monospace' }}>{v.ip}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600 }}>{v.leadScore || 0}</span>
                        {getLeadBadge(v.leadScore)}
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{new Date(v.lastVisit).toLocaleTimeString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '2rem' }}>No visitors tracked yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TOP CONTENT */}
          <div className="admin-glass-panel" style={{ padding: 0 }}>
            <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontWeight: 600 }}>Most Read Content</h3>
              <Link href="/admin/content" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Manage Posts</Link>
            </div>
            <table className="admin-table">
              <thead><tr><th>Content Path</th><th style={{ textAlign: 'right' }}>Avg. Read Time</th></tr></thead>
              <tbody>
                {stats?.topContentByRetention?.length > 0 ? stats.topContentByRetention.map((page, idx) => (
                  <tr key={idx}>
                    <td>{page._id}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                      {formatDuration(page.avgRetentionSeconds)}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="2" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '2rem' }}>No reading data recorded yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT ADMIN LOGINS */}
        <div className="admin-glass-panel" style={{ padding: 0, marginTop: 'var(--space-6)' }}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ margin: 0, fontWeight: 600 }}>Recent Admin Logins</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Time</th><th>IP Address</th><th>User Agent</th><th>Status</th></tr></thead>
              <tbody>
                {loginHistory.length > 0 ? loginHistory.slice(0, 10).map((log, idx) => (
                  <tr key={idx}>
                    <td style={{ color: 'var(--color-text-muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ fontFamily: 'monospace' }}>{log.ip}</td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={log.userAgent}>{log.userAgent}</td>
                    <td>
                      {log.success ? (
                        <span style={{ padding: '2px 6px', background: 'rgba(52, 199, 89, 0.2)', color: '#34c759', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Success</span>
                      ) : (
                        <span style={{ padding: '2px 6px', background: 'rgba(255, 59, 48, 0.2)', color: '#ff3b30', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Failed</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '2rem' }}>No admin logins recorded yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

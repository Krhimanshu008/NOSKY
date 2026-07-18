'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Activity, Users, FileText, MousePointer, Clock, MapPin, Monitor } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

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
          <Link href="/admin/dashboard" className="admin-nav-item">
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
          <Link href="/admin/analytics" className="admin-nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Analytics
          </Link>
          <Link href="/admin/settings" className="admin-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
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
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>Enterprise Command Center</h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Advanced tracking, behavioral analytics, and engagement metrics.</p>
        </div>

        {/* ━━━ TABS ━━━ */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: activeTab === 'overview' ? 'var(--color-accent)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'overview' ? '2px solid var(--color-accent)' : '2px solid transparent', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('journeys')}
            style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: activeTab === 'journeys' ? 'var(--color-accent)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'journeys' ? '2px solid var(--color-accent)' : '2px solid transparent', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
          >
            Customer Journeys
          </button>
          <button 
            onClick={() => setActiveTab('engagement')}
            style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: activeTab === 'engagement' ? 'var(--color-accent)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'engagement' ? '2px solid var(--color-accent)' : '2px solid transparent', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
          >
            Engagement & Events
          </button>
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'journeys' && <JourneysTab />}
        {activeTab === 'engagement' && <EngagementTab />}

      </main>
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetch('/api/analytics/dashboard').then(res => res.json()).then(setStats);
  }, []);

  if (!stats) return <div style={{display:'flex',justifyContent:'center'}}><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <>
      <div className="grid grid-4" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="admin-glass-panel">
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Total Unique Visitors</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.totalVisitors || 0}</div>
        </div>
        <div className="admin-glass-panel">
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Visitors Today</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-success)' }}>{stats.todayVisitors || 0}</div>
        </div>
        <div className="admin-glass-panel">
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Total Page Views</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-blue)' }}>{stats.totalViews || 0}</div>
        </div>
        <div className="admin-glass-panel">
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Bot Traffic (Blocked)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-warning)' }}>{stats.botTraffic || 0}</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
        <div className="admin-glass-panel">
          <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', fontWeight: '600' }}>Top Pages</h3>
          <div className="admin-table-container" style={{ padding: 0 }}>
            <table className="admin-table">
              <thead><tr><th>Page Path</th><th style={{ textAlign: 'right' }}>Views</th></tr></thead>
              <tbody>
                {stats.topPages?.map((page, idx) => (
                  <tr key={idx}><td>{page._id === '/' ? 'Home Page' : page._id}</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>{page.views}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-glass-panel">
          <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', fontWeight: '600' }}>Top Countries</h3>
          <div className="admin-table-container" style={{ padding: 0 }}>
            <table className="admin-table">
              <thead><tr><th>Country</th><th style={{ textAlign: 'right' }}>Visitors</th></tr></thead>
              <tbody>
                {stats.topCountries?.map((country, idx) => (
                  <tr key={idx}><td>{country._id}</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>{country.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function JourneysTab() {
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/visitors').then(res => res.json()).then(data => {
      // Sort by lead score by default (highest first)
      const sorted = data.sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0));
      setVisitors(sorted);
      setLoading(false);
    });
  }, []);

  const getLeadBadge = (score = 0) => {
    if (score >= 50) return <span style={{ padding: '2px 6px', background: 'rgba(255, 59, 48, 0.2)', color: '#ff3b30', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>🔥 Hot</span>;
    if (score >= 20) return <span style={{ padding: '2px 6px', background: 'rgba(255, 149, 0, 0.2)', color: '#ff9500', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>☀️ Warm</span>;
    return <span style={{ padding: '2px 6px', background: 'rgba(52, 199, 89, 0.2)', color: '#34c759', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>❄️ Cold</span>;
  };

  const selectVisitor = async (v) => {
    setSelectedVisitor(v);
    setJourney(null);
    const res = await fetch(`/api/analytics/visitors/${v.visitorId}/journey`);
    const data = await res.json();
    setJourney(data.journey);
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center'}}><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
      {/* LEFT: Visitors List */}
      <div className="admin-glass-panel" style={{ maxHeight: '600px', overflowY: 'auto', padding: 0 }}>
        <h3 style={{ padding: 'var(--space-4)', borderBottom: '1px solid rgba(255,255,255,0.05)', margin: 0 }}>Recent Visitors</h3>
        <table className="admin-table">
          <thead><tr><th>Visitor IP</th><th>Score</th><th>Last Seen</th></tr></thead>
          <tbody>
            {visitors.map((v, i) => (
              <tr key={i} onClick={() => selectVisitor(v)} style={{ cursor: 'pointer', background: selectedVisitor?.visitorId === v.visitorId ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                <td style={{ fontFamily: 'monospace' }}>{v.ip}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{v.leadScore || 0}</span>
                    {getLeadBadge(v.leadScore)}
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{new Date(v.lastVisit).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT: Timeline */}
      <div className="admin-glass-panel" style={{ minHeight: '600px' }}>
        {selectedVisitor ? (
          <>
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0 }}>Visitor Profile</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Lead Score:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedVisitor.leadScore || 0}</span>
                  {getLeadBadge(selectedVisitor.leadScore)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {selectedVisitor.city}, {selectedVisitor.country}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Monitor size={14}/> {selectedVisitor.userAgent?.includes('Mobile') ? 'Mobile' : 'Desktop'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14}/> {selectedVisitor.visits} Total Visits</span>
              </div>
              {selectedVisitor.latestAttribution && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(255, 171, 0, 0.1)', color: 'var(--color-warning)', borderRadius: '4px', fontSize: '0.875rem' }}>
                  <strong>Attribution:</strong> {selectedVisitor.latestAttribution.utm_source} / {selectedVisitor.latestAttribution.utm_campaign}
                </div>
              )}
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Activity Timeline</h3>
            {!journey ? <Loader2 className="animate-spin" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {journey.map((event, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: event.eventType === 'page_view' ? 'var(--color-blue)' : (event.eventType === 'time_on_page' ? 'var(--color-success)' : 'var(--color-accent)'), marginTop: '4px' }}></div>
                      {i !== journey.length - 1 && <div style={{ flex: 1, width: '2px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {event.eventType === 'page_view' && `Viewed ${event.path === '/' ? 'Home Page' : event.path}`}
                        {event.eventType === 'time_on_page' && `Spent ${event.metadata.durationSeconds}s on ${event.path === '/' ? 'Home Page' : event.path}`}
                        {event.eventType === 'scroll_depth' && `Scrolled to ${event.metadata.depth}% of ${event.path === '/' ? 'Home Page' : event.path}`}
                        {event.eventType === 'click' && `Clicked "${event.metadata.text}"`}
                        {event.eventType === 'outbound_link' && `Left site to ${event.metadata.href}`}
                        {event.eventType === 'pdf_download' && `Downloaded PDF`}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            Select a visitor from the list to view their journey.
          </div>
        )}
      </div>
    </div>
  );
}

function EngagementTab() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetch('/api/analytics/engagement').then(res => res.json()).then(setStats);
  }, []);

  if (!stats) return <div style={{display:'flex',justifyContent:'center'}}><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Summary Cards */}
      <div className="grid grid-3" style={{ gap: 'var(--space-4)' }}>
        <div className="admin-glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock size={40} style={{ color: 'var(--color-accent)' }} />
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Retention Time</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.avgRetentionSeconds} <span style={{fontSize:'1rem', color:'var(--color-text-muted)'}}>seconds</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '2rem' }}>
        {/* Scroll Depth Chart (simulated with bars) */}
        <div className="admin-glass-panel">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20}/> Scroll Depth Analytics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[25, 50, 75, 100].map(depth => {
              const stat = stats.scrollMilestones?.find(s => s._id === depth) || { count: 0 };
              const maxCount = Math.max(...(stats.scrollMilestones?.map(s => s.count) || [1]));
              const width = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
              return (
                <div key={depth}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                    <span>Scrolled {depth}%</span>
                    <span style={{ fontWeight: 600 }}>{stat.count} hits</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${width}%`, height: '100%', background: 'var(--color-blue)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Events Log */}
        <div className="admin-glass-panel" style={{ maxHeight: '400px', overflowY: 'auto', padding: 0 }}>
          <h3 style={{ padding: 'var(--space-4)', borderBottom: '1px solid rgba(255,255,255,0.05)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MousePointer size={20}/> Recent Events</h3>
          <table className="admin-table">
            <thead><tr><th>Event Type</th><th>Details</th><th>Time</th></tr></thead>
            <tbody>
              {stats.recentEvents?.map((event, i) => (
                <tr key={i}>
                  <td>
                    <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      {event.eventType.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{event.metadata.text || event.metadata.href || (event.path === '/' ? 'Home Page' : event.path)}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{new Date(event.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
              {(!stats.recentEvents || stats.recentEvents.length === 0) && (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No event data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Loader2, Activity, Users, FileText, MousePointer, Clock, MapPin, Monitor, ChevronDown, ChevronRight, Eye, ArrowDownToLine, MoveDown, Globe2, Maximize } from 'lucide-react';
import dynamic from 'next/dynamic';
import AdminSettingsIcon from '@/components/ui/AdminSettingsIcon';

const UnifiedMapViewer = dynamic(() => import('../../../components/analytics/UnifiedMapViewer'), { 
  ssr: false,
  loading: () => <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={32} /></div>

});

function addOrUpdateEvent(events, event) {
  if (event.eventType !== 'scroll_depth') {
    events.push(event);
    return;
  }

  const existingIdx = events.findIndex(e => e.eventType === 'scroll_depth');
  if (existingIdx === -1) {
    events.push({ ...event });
    return;
  }

  if (event.metadata.depth > events[existingIdx].metadata.depth) {
    events[existingIdx] = { ...event };
  }
}

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section className="neo-container neo-section-spacing">
        <div className="neo-header">
          <span className="absolute -bottom-2 -left-2 text-ink opacity-40 font-heading text-lg">+</span>
          <h1 className="neo-title">Enterprise Command Center</h1>
          <p className="neo-subtitle">Advanced tracking, behavioral analytics, and engagement metrics.</p>
        </div>
        {/* ━━━ TABS ━━━ */}
        <div className="neo-flex-gap-4 border-b-2 border-ink pb-4 mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`neo-tab ${activeTab === 'overview' ? 'active' : ''}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('journeys')}
            className={`neo-tab ${activeTab === 'journeys' ? 'active' : ''}`}
          >
            Customer Journeys
          </button>
          <button 
            onClick={() => setActiveTab('engagement')}
            className={`neo-tab ${activeTab === 'engagement' ? 'active' : ''}`}
          >
            Engagement & Events
          </button>
          <button 
            onClick={() => setActiveTab('live_map')}
            className={`neo-tab ${activeTab === 'live_map' ? 'active' : ''}`}
          >
            Live Map
          </button>
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'journeys' && <JourneysTab />}
        {activeTab === 'engagement' && <EngagementTab />}
        {activeTab === 'live_map' && <LiveMapTab />}

      </section>
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
      <div className="neo-grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Unique Visitors</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.totalVisitors || 0}</div>
        </div>
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Visitors Today</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#000000' }}>{stats.todayVisitors || 0}</div>
        </div>
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Page Views</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#000000' }}>{stats.totalViews || 0}</div>
        </div>
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Bot Traffic (Blocked)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#000000' }}>{stats.botTraffic || 0}</div>
        </div>
      </div>

      <div className="neo-grid-2" style={{ gap: '1.5rem' }}>
        <div className="neo-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', fontWeight: '600' }}>Top Pages</h3>
          <div className="neo-table-wrapper" style={{ padding: 0 }}>
            <table className="neo-table">
              <thead><tr className="table-head-row"><th className="">Page Path</th><th className="">Views</th></tr></thead>
              <tbody>
                {stats.topPages?.map((page, idx) => (
                  <tr key={idx}><td>{page._id === '/' ? 'Home Page' : page._id}</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>{page.views}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="neo-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', fontWeight: '600' }}>Top Countries</h3>
          <div className="neo-table-wrapper" style={{ padding: 0 }}>
            <table className="neo-table">
              <thead><tr className="table-head-row"><th className="">Country</th><th className="">Visitors</th></tr></thead>
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
  const [expandedGroups, setExpandedGroups] = useState({});
  const [viewMode, setViewMode] = useState('chronological');

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
    setExpandedGroups({}); // Collapse all when selecting a new visitor
    const res = await fetch(`/api/analytics/visitors/${v.visitorId}/journey`);
    const data = await res.json();
    setJourney(data.journey);
  };

  const groupedJourney = useMemo(() => {
    if (!journey) return [];
    const groups = [];
    let currentGroup = null;

    journey.forEach(event => {
      const eventTime = new Date(event.timestamp).getTime();
      // Group by path and session (30 mins inactivity)
      if (!currentGroup || currentGroup.path !== event.path || (eventTime - currentGroup.lastTime > 30 * 60 * 1000)) {
        currentGroup = {
          id: groups.length,
          path: event.path,
          startTime: event.timestamp,
          lastTime: eventTime,
          events: []
        };
        groups.push(currentGroup);
      }
      
      currentGroup.lastTime = eventTime;
      
      addOrUpdateEvent(currentGroup.events, event);
    });
    return groups;
  }, [journey]);

  const pageTree = useMemo(() => {
    if (!journey) return [];
    const tree = {};
    journey.forEach(event => {
      if (!tree[event.path]) {
        tree[event.path] = {
          id: `tree-${event.path}`,
          path: event.path,
          events: [],
          views: 0,
          totalTime: 0,
        };
      }
      addOrUpdateEvent(tree[event.path].events, event);
      
      if (event.eventType === 'page_view') tree[event.path].views++;
      if (event.eventType === 'time_on_page') tree[event.path].totalTime += (event.metadata.durationSeconds || 0);
    });
    // Option A: Sort by most interacted pages (descending)
    return Object.values(tree).sort((a, b) => b.events.length - a.events.length);
  }, [journey]);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center'}}><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="neo-grid-2" style={{ gap: '1.5rem' }}>
      {/* LEFT: Visitors List */}
      <div className="neo-card no-scrollbar" style={{ maxHeight: '600px', overflowY: 'auto', padding: 0 }}>
        <h3 style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', margin: 0 }}>Recent Visitors</h3>
        <table className="neo-table">
          <thead><tr><th>Visitor IP</th><th>Score</th><th>Last Seen</th></tr></thead>
          <tbody>
            {visitors.map((v, i) => (
              <tr key={i} onClick={() => selectVisitor(v)} style={{ cursor: 'pointer', background: selectedVisitor?.visitorId === v.visitorId ? 'rgba(0,0,0,0.1)' : 'transparent' }}>
                <td style={{ fontFamily: 'monospace' }}>{v.ip}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{v.leadScore || 0}</span>
                    {getLeadBadge(v.leadScore)}
                  </div>
                </td>
                <td style={{ color: '#71717A', fontSize: '0.875rem' }}>{new Date(v.lastVisit).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT: Timeline */}
      <div className="neo-card" style={{ minHeight: '600px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        {selectedVisitor ? (
          <>
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0 }}>Visitor Profile</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.1)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#71717A' }}>Lead Score:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedVisitor.leadScore || 0}</span>
                  {getLeadBadge(selectedVisitor.leadScore)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', color: '#71717A', fontSize: '0.875rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {selectedVisitor.city}, {selectedVisitor.country}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Monitor size={14}/> {selectedVisitor.userAgent?.includes('Mobile') ? 'Mobile' : 'Desktop'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14}/> {selectedVisitor.visits} Total Visits</span>
              </div>
              {selectedVisitor.latestAttribution && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(255, 171, 0, 0.1)', color: '#000000', borderRadius: '4px', fontSize: '0.875rem' }}>
                  <strong>Attribution:</strong> {selectedVisitor.latestAttribution.utm_source} / {selectedVisitor.latestAttribution.utm_campaign}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Activity Timeline</h3>
              <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.1)', padding: '4px', borderRadius: '8px' }}>
                <button 
                  onClick={() => setViewMode('chronological')}
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderRadius: '4px', border: 'none', background: viewMode === 'chronological' ? 'var(--color-ink)' : 'transparent', color: viewMode === 'chronological' ? '#FFFFFF' : 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  Chronological
                </button>
                <button 
                  onClick={() => setViewMode('tree')}
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderRadius: '4px', border: 'none', background: viewMode === 'tree' ? 'var(--color-ink)' : 'transparent', color: viewMode === 'tree' ? '#FFFFFF' : 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  Page Tree
                </button>
              </div>
            </div>
            {!journey ? <Loader2 className="animate-spin" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {(viewMode === 'chronological' ? groupedJourney : pageTree).map((group, i) => (
                  <div key={group.id} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: viewMode === 'tree' ? 'var(--color-success)' : 'var(--color-blue)', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {viewMode === 'tree' ? <FileText size={10} color="#000" /> : <Activity size={10} color="#000" />}
                      </div>
                      {i !== (viewMode === 'chronological' ? groupedJourney : pageTree).length - 1 && <div style={{ flex: 1, width: '2px', background: 'rgba(0,0,0,0.1)', margin: '4px 0' }}></div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      {/* Group Header */}
                      <div 
                        onClick={() => toggleGroup(group.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                      >
                        {expandedGroups[group.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <div style={{ fontWeight: 600, flex: 1 }}>
                          {viewMode === 'chronological' ? 'Visit to ' : ''}<span style={{ color: viewMode === 'tree' ? 'var(--color-success)' : 'var(--color-accent)' }}>{group.path === '/' ? 'Home Page' : group.path}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#71717A' }}>
                          {viewMode === 'chronological' ? new Date(group.startTime).toLocaleTimeString() : `${group.views} views, ${group.totalTime}s`} ({group.events.length} events)
                        </div>
                      </div>
                      
                      {/* Group Events */}
                      {expandedGroups[group.id] && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', marginLeft: '1rem', borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '1rem' }}>
                          {group.events.map((event, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                              <div style={{ marginTop: '2px', color: '#71717A' }}>
                                {event.eventType === 'page_view' && <Eye size={14} color="var(--color-blue)" />}
                                {event.eventType === 'time_on_page' && <Clock size={14} color="var(--color-success)" />}
                                {event.eventType === 'scroll_depth' && <MoveDown size={14} color="var(--color-text-muted)" />}
                                {event.eventType === 'click' && <MousePointer size={14} color="var(--color-accent)" />}
                                {event.eventType === 'outbound_link' && <Activity size={14} color="var(--color-warning)" />}
                                {event.eventType === 'pdf_download' && <ArrowDownToLine size={14} color="var(--color-blue)" />}
                              </div>
                              <div>
                                <div style={{ fontSize: '0.875rem', color: '#71717A' }}>
                                  {event.eventType === 'page_view' && `Viewed page`}
                                  {event.eventType === 'time_on_page' && `Spent ${event.metadata.durationSeconds}s on page`}
                                  {event.eventType === 'scroll_depth' && `Scrolled to ${event.metadata.depth}%`}
                                  {event.eventType === 'click' && <span>Clicked <strong>&quot;{event.metadata.text}&quot;</strong></span>}
                                  {event.eventType === 'outbound_link' && `Left site to ${event.metadata.href}`}
                                  {event.eventType === 'pdf_download' && `Downloaded PDF`}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#71717A', marginTop: '2px' }}>
                                  {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#71717A' }}>
            Select a visitor from the list to view their journey.
          </div>
        )}
      </div>
    </div>
  );
}

function EngagementTab() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('30'); // '7', '30', '90', 'all', 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch custom if dates are provided
    if (period === 'custom' && (!startDate || !endDate)) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    let url = `/api/analytics/engagement?period=${period}`;
    if (period === 'custom') {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, [period, startDate, endDate]);

  // If initial load and no stats yet
  if (!stats && loading) return <div style={{display:'flex',justifyContent:'center'}}><Loader2 className="animate-spin" size={32} /></div>;
  if (!stats) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header and Period Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Engagement Metrics</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {period === 'custom' && (
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.1)', padding: '4px 8px', borderRadius: '8px' }}>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#000000', fontSize: '0.875rem' }} />
              <span style={{ color: '#71717A' }}>to</span>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#000000', fontSize: '0.875rem' }} />
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.1)', padding: '4px', borderRadius: '8px' }}>
            {['7', '30', '90', 'all', 'custom'].map(p => (
              <button 
                key={p}
                onClick={() => setPeriod(p)}
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderRadius: '4px', border: 'none', background: period === p ? 'var(--color-ink)' : 'transparent', color: period === p ? '#FFFFFF' : 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
              >
                {p === 'all' ? 'All Time' : p === 'custom' ? 'Custom' : `${p} Days`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="neo-grid-3" style={{ gap: '1.5rem', opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock size={40} style={{ color: '#000000' }} />
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Retention</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.avgRetentionSeconds} <span style={{fontSize:'1rem', color:'var(--color-text-muted)'}}>sec</span></div>
          </div>
        </div>
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <MousePointer size={40} style={{ color: '#000000' }} />
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Clicks</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalClicks}</div>
          </div>
        </div>
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ArrowDownToLine size={40} style={{ color: '#000000' }} />
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conversions (Downloads)</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalDownloads}</div>
          </div>
        </div>
      </div>

      <div className="neo-grid-2" style={{ gap: '1.5rem', opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {/* CTA Performance */}
        <div className="neo-card no-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto', padding: 0 }}>
          <h3 style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20}/> CTA Performance</h3>
          <table className="neo-table">
            <thead><tr><th>Element Clicked</th><th>Page</th><th>Clicks</th></tr></thead>
            <tbody>
              {stats.ctaPerformance?.map((cta, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: '#000000' }}>&quot;{cta.text}&quot;</td>
                  <td style={{ fontSize: '0.875rem' }}>{cta.path === '/' ? 'Home Page' : cta.path}</td>
                  <td style={{ fontWeight: 600 }}>{cta.count}</td>
                </tr>
              ))}
              {(!stats.ctaPerformance || stats.ctaPerformance.length === 0) && (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: 'rgba(0,0,0,0.1)' }}>No click data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Retention by Page */}
        <div className="neo-card no-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto', padding: 0 }}>
          <h3 style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20}/> Retention by Page</h3>
          <table className="neo-table">
            <thead><tr><th>Page</th><th>Avg Time</th><th>Views</th></tr></thead>
            <tbody>
              {stats.retentionByPage?.map((page, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{page._id === '/' ? 'Home Page' : page._id}</td>
                  <td style={{ color: '#000000' }}>{Math.round(page.avgTime)}s</td>
                  <td style={{ fontSize: '0.875rem' }}>{page.views}</td>
                </tr>
              ))}
              {(!stats.retentionByPage || stats.retentionByPage.length === 0) && (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: 'rgba(0,0,0,0.1)' }}>No retention data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="neo-grid-2" style={{ gap: '1.5rem', opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {/* Scroll Depth Chart (simulated with bars) */}
        <div className="neo-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MoveDown size={20}/> Scroll Depth Analytics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(() => {
              const milestones = stats.scrollMilestones || [];
              const milestoneMap = new Map();
              let maxCount = 1;

              for (const m of milestones) {
                milestoneMap.set(m._id, m);
                if (m.count > maxCount) maxCount = m.count;

              }

              return [25, 50, 75, 100].map(depth => {
                const stat = milestoneMap.get(depth) || { count: 0 };
                const width = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
                return (
                  <div key={depth}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                      <span>Scrolled {depth}%</span>
                      <span style={{ fontWeight: 600 }}>{stat.count} hits</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${width}%`, height: '100%', background: 'var(--color-blue)', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Recent Events Log */}
        <div className="admin-glass-panel no-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto', padding: 0 }}>
          <h3 style={{ padding: 'var(--space-4)', borderBottom: '1px solid rgba(0,0,0,0.1)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MousePointer size={20}/> Recent Events</h3>
          <table className="neo-table">
            <thead><tr><th>Event Type</th><th>Details</th><th>Time</th></tr></thead>
            <tbody>
              {stats.recentEvents?.map((event, i) => (
                <tr key={i}>
                  <td>
                    <span style={{ padding: '2px 8px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      {event.eventType.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{event.metadata.text || event.metadata.href || (event.path === '/' ? 'Home Page' : event.path)}</td>
                  <td style={{ color: '#71717A', fontSize: '0.75rem' }}>{new Date(event.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
              {(!stats.recentEvents || stats.recentEvents.length === 0) && (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: 'rgba(0,0,0,0.1)' }}>No event data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function LiveMapTab() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const fullscreenRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    fetch('/api/analytics/globe')
      .then(res => res.json())
      .then(data => {
        setVisitors(data);
        setLoading(false);
      });
  }, []);

  const uniqueCountries = new Set(visitors.map(v => v.country));
  
  // Get top 5 countries for sidebar
  const countryCounts = {};
  visitors.forEach(v => {
    countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
  });
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) return <div style={{display:'flex',justifyContent:'center'}}><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 250px)', minHeight: '500px' }}>
      
      {/* LEFT: Visualization Container (70%) */}
      <div 
        ref={fullscreenRef}
        className="neo-card-inner" 
        style={{ flex: '7', padding: 0, overflow: 'hidden', position: 'relative', background: '#000' }}
      >
        <button 
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 1000,
            background: 'rgba(0,0,0,0.1)',
            backdropFilter: 'blur(4px)',
            color: '#000000',
            border: '1px solid rgba(0,0,0,0.1)',
            padding: '0.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
          title="Toggle Fullscreen"
        >
          <Maximize size={18} />
        </button>

        <UnifiedMapViewer 
          selectedCountry={selectedCountry} 
          onCountrySelect={setSelectedCountry} 
        />
      </div>

      {/* RIGHT: Analytics Sidebar (30%) */}
      <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }} className="no-scrollbar">
        
        <div className="neo-card-inner" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <Activity size={32} style={{ color: '#000000' }} />
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Visitors</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{visitors.length}</div>
          </div>
        </div>

        <div className="neo-card-inner" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <Globe2 size={32} style={{ color: '#000000' }} />
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Countries Reached</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{uniqueCountries.size}</div>
          </div>
        </div>

        <div className="neo-card-inner" style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', margin: '0 0 1rem 0' }}>
            <MapPin size={18} /> Top Active Countries
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topCountries.map(([country, count], i) => (
              <div 
                key={country} 
                onClick={() => setSelectedCountry(country)}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.1)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#71717A', fontSize: '0.875rem' }}>#{i + 1}</span>
                  <span style={{ fontWeight: 600 }}>{country}</span>
                </div>
                <div style={{ background: 'var(--color-accent-light)', color: '#000000', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
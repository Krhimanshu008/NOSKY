'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const { data: stats, error: statsError, isLoading: statsLoading } = useSWR('/api/analytics/dashboard', fetcher);
  const { data: rawVisitors, error: visitorsError, isLoading: visitorsLoading } = useSWR('/api/analytics/visitors', fetcher);
  const { data: historyData, error: historyError, isLoading: historyLoading } = useSWR('/api/admin/login-history', fetcher);

  const visitors = Array.isArray(rawVisitors)
    ? [...rawVisitors].sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0)).slice(0, 5)
    : [];

  const loginHistory = historyData?.logs || [];

  const loading = statsLoading || visitorsLoading || historyLoading;

  const getLeadBadge = (score = 0) => {
    if (score >= 50) return <span className="neo-badge hot">Hot</span>;
    if (score >= 20) return <span className="neo-badge warm">Warm</span>;
    return <span className="neo-badge cold">Cold</span>;
  };

  const formatDuration = (seconds = 0) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (loading) {
    return (
      <div className="neo-flex-center w-full h-full">
        <Loader2 className="animate-spin text-ink" size={32} />
      </div>
    );
  }

  return (
    <section className="neo-container neo-section-spacing">
      
      {/* Screen Header */}
      <div className="neo-header">
        <span className="neo-header-plus">+</span>
        <h1 className="neo-title">Dashboard Overview</h1>
        <p className="neo-subtitle">High-level insights into your business performance today.</p>
      </div>

      <div className="neo-section-spacing">
        
        {/* Three 3D Extruded Metric Cards */}
        <div className="neo-grid-3">
          
          {/* Card 1: Visitors */}
          <div className="neo-card">
            <div className="neo-card-inner">
              <div className="neo-flex-gap-4">
                <div className="neo-icon-box">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <div className="neo-stat-label">Today&apos;s Visitors</div>
                  <div className="neo-stat-value">{stats?.todayVisitors || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Page Views */}
          <div className="neo-card">
            <div className="neo-card-inner">
              <div className="neo-flex-gap-4">
                <div className="neo-icon-box">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div>
                  <div className="neo-stat-label">Total Page Views</div>
                  <div className="neo-stat-value">{stats?.totalViews || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Unique Visitors */}
          <div className="neo-card">
            <div className="neo-card-inner">
              <div className="neo-flex-gap-4">
                <div className="neo-icon-box">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                </div>
                <div>
                  <div className="neo-stat-label">Total Unique Visitors</div>
                  <div className="neo-stat-value">{stats?.totalVisitors || 0}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 2-Column Split Module */}
        <div className="neo-grid-2">
          
          {/* Top Prospects */}
          <div className="neo-table-card">
            <div className="neo-table-header">
              <h2 className="neo-table-title">Top Prospects</h2>
              <Link href="/admin/analytics" className="neo-link">View All</Link>
            </div>
            
            <div className="neo-table-wrapper">
              <table className="neo-table">
                <thead>
                  <tr className="table-head-row">
                    <th>Visitor IP</th>
                    <th>Score</th>
                    <th>Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.length === 0 ? (
                    <tr className="table-body-row">
                      <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No recent prospects</td>
                    </tr>
                  ) : (
                    visitors.map((visitor) => (
                      <tr key={visitor._id} className="table-body-row">
                        <td>{visitor.ip}</td>
                        <td>
                          <div className="neo-flex-gap-4">
                            <span>{visitor.leadScore || 0}</span>
                            {getLeadBadge(visitor.leadScore)}
                          </div>
                        </td>
                        <td>{new Date(visitor.lastVisit).toLocaleTimeString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Most Read Content */}
          <div className="neo-table-card">
            <div className="neo-table-header">
              <h2 className="neo-table-title">Most Read Content</h2>
              <Link href="/admin/content" className="neo-link">Manage Posts</Link>
            </div>
            
            <div className="neo-table-wrapper">
              <table className="neo-table">
                <thead>
                  <tr className="table-head-row">
                    <th>Content Path</th>
                    <th>Avg. Read Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.topContentByRetention?.length === 0 ? (
                    <tr className="table-body-row">
                      <td colSpan="2" style={{ textAlign: 'center', padding: '2rem' }}>No content data</td>
                    </tr>
                  ) : (
                    (stats?.topContentByRetention || []).map((page, index) => (
                      <tr key={index} className="table-body-row">
                        <td>{page._id}</td>
                        <td>{formatDuration(page.avgRetentionSeconds || 0)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Full-Width Table Module: Recent Admin Logins */}
        <div className="neo-table-card">
          <div className="neo-table-header">
            <h2 className="neo-table-title">Recent Admin Logins</h2>
          </div>
          
          <div className="neo-table-wrapper">
            <table className="neo-table">
              <thead>
                <tr className="table-head-row">
                  <th>Time</th>
                  <th>IP Address</th>
                  <th>User Agent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.length === 0 ? (
                  <tr className="table-body-row">
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No recent logins</td>
                  </tr>
                ) : (
                  loginHistory.map((log) => (
                    <tr key={log._id} className="table-body-row">
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td>{log.ipAddress}</td>
                      <td>{log.userAgent}</td>
                      <td>
                        <span className={`neo-badge ${log.status === 'success' ? 'success' : 'cold'}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}

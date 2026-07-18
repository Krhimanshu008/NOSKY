'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visitorId, setVisitorId] = useState(null);
  
  // Refs for tracking active session state
  const sessionStartTime = useRef(Date.now());
  const maxScroll = useRef(0);

  // Initialize or retrieve visitorId on mount
  useEffect(() => {
    let storedId = localStorage.getItem('nosky_visitor_id');
    if (!storedId) {
      storedId = 'v_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('nosky_visitor_id', storedId);
    }
    setVisitorId(storedId);
  }, []);

  // Track page view, UTMs, and reset retention/scroll state
  useEffect(() => {
    if (!visitorId || !pathname) return;
    if (pathname.startsWith('/admin')) return; 

    // Reset session variables for this specific page view
    sessionStartTime.current = Date.now();
    maxScroll.current = 0;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Extract UTM parameters
    const utm_source = searchParams?.get('utm_source') || null;
    const utm_medium = searchParams?.get('utm_medium') || null;
    const utm_campaign = searchParams?.get('utm_campaign') || null;

    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            eventType: 'page_view',
            path: url,
            referrer: document.referrer,
            metadata: {
              utm_source,
              utm_medium,
              utm_campaign
            }
          })
        });
      } catch (err) {
        console.error('Analytics tracking failed', err);
      }
    };

    trackPageView();
  }, [pathname, searchParams, visitorId]);

  // Global Event Listeners (Clicks, Retention, Scroll)
  useEffect(() => {
    if (!visitorId || !pathname) return;
    if (pathname.startsWith('/admin')) return;

    // 1. Event Tracking (Clicks)
    const handleGlobalClick = (e) => {
      const target = e.target.closest('a') || e.target.closest('button');
      if (!target) return;

      let eventType = 'click';
      let eventMeta = { text: target.innerText || target.title || 'unknown' };

      const href = target.getAttribute('href');
      
      if (href) {
        if (href.startsWith('mailto:')) eventType = 'email_click';
        else if (href.startsWith('tel:')) eventType = 'tel_click';
        else if (href.endsWith('.pdf')) eventType = 'pdf_download';
        else if (href.startsWith('http') && !href.includes(window.location.hostname)) eventType = 'outbound_link';
        eventMeta.href = href;
      }

      // Track it fire-and-forget
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          eventType,
          path: pathname,
          metadata: eventMeta
        }),
        keepalive: true // Ensure it fires even during navigation
      }).catch(() => {});
    };

    // 2. Scroll Analytics
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      
      const scrollPercent = (window.scrollY / scrollHeight) * 100;
      
      // Check milestones 25, 50, 75, 100
      [25, 50, 75, 100].forEach(milestone => {
        if (scrollPercent >= milestone && maxScroll.current < milestone) {
          maxScroll.current = milestone;
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visitorId,
              eventType: 'scroll_depth',
              path: pathname,
              metadata: { depth: milestone }
            }),
            keepalive: true
          }).catch(() => {});
        }
      });
    };

    // 3. Retention Time Tracking (beforeunload)
    const handleBeforeUnload = () => {
      const durationSeconds = Math.round((Date.now() - sessionStartTime.current) / 1000);
      
      const payload = JSON.stringify({
        visitorId,
        eventType: 'time_on_page',
        path: pathname,
        metadata: { durationSeconds }
      });
      
      // Use Blob to force application/json content type in sendBeacon
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    };

    // Attach listeners
    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Also send retention time when component unmounts (Next.js client side routing)
      handleBeforeUnload(); 
    };
  }, [pathname, visitorId]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  );
}

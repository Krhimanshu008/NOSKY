import { NextResponse } from 'next/server';
import { trackEvent } from '../../../../analytics/services/trackService';
import { getGeoInfo } from '../../../../analytics/lib/geoIp';

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Extract geo details from Next.js request headers
    const geo = getGeoInfo(req);
    
    // Construct visitor profile
    const visitorData = {
      visitorId: body.visitorId,
      ip: geo.ip,
      country: geo.country,
      city: geo.city,
      latitude: geo.latitude,
      longitude: geo.longitude,
      userAgent: req.headers.get('user-agent') || 'Unknown',
    };

    // Construct event details
    const eventData = {
      eventType: body.eventType, // 'page_view', 'click', 'time_on_page', etc.
      path: body.path,
      referrer: body.referrer,
      metadata: body.metadata || {}
    };

    const result = await trackEvent(visitorData, eventData);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getAnalyticsVisitorsCollection } from '../../../../analytics/models/analyticsDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const visitorsCollection = await getAnalyticsVisitorsCollection();
    
    // Get visitors that have a latitude and longitude
    const visitors = await visitorsCollection
      .find({ latitude: { $ne: null }, longitude: { $ne: null }, isBot: false })
      .project({ visitorId: 1, country: 1, city: 1, latitude: 1, longitude: 1, lastVisit: 1, visits: 1 })
      .toArray();

    return NextResponse.json(visitors);
  } catch (error) {
    console.error('Failed to get globe data:', error);
    return NextResponse.json({ error: 'Failed to get globe data' }, { status: 500 });
  }
}

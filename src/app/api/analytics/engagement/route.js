import { NextResponse } from 'next/server';
import { getEngagementStats } from '../../../../analytics/services/reportService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 30; // default to 30 days
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const data = await getEngagementStats(period, startDate, endDate);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to get engagement stats:', error);
    return NextResponse.json({ error: 'Failed to get engagement stats' }, { status: 500 });
  }
}

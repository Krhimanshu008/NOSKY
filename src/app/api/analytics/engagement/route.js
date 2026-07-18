import { NextResponse } from 'next/server';
import { getEngagementStats } from '../../../../analytics/services/reportService';

export async function GET() {
  try {
    const data = await getEngagementStats();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to get engagement stats:', error);
    return NextResponse.json({ error: 'Failed to get engagement stats' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getRecentVisitors } from '../../../../analytics/services/reportService';

export async function GET() {
  try {
    const visitors = await getRecentVisitors(50);
    return NextResponse.json(visitors);
  } catch (error) {
    console.error('Failed to get visitors:', error);
    return NextResponse.json({ error: 'Failed to get visitors' }, { status: 500 });
  }
}

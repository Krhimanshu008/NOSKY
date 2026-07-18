import { NextResponse } from 'next/server';
import { getVisitorJourney } from '../../../../../../analytics/services/reportService';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const data = await getVisitorJourney(id);
    if (!data) return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to get visitor journey:', error);
    return NextResponse.json({ error: 'Failed to get visitor journey' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getAdminLoginHistoryCollection } from '../../../../analytics/models/analyticsDb';

export async function GET(request) {
  try {
    const adminHistoryCollection = await getAdminLoginHistoryCollection();
    
    const logs = await adminHistoryCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
      
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching admin login history:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch history' }, { status: 500 });
  }
}

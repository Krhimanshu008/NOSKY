import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAdminLoginHistoryCollection, getAnalyticsVisitorsCollection } from '../../../../analytics/models/analyticsDb';

export async function POST(request) {
  try {
    const { username, password, visitorId } = await request.json();

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      // Create JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      
      const token = await new SignJWT({ username, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      // Record admin login history and flag visitor
      try {
        const getHeader = (key) => typeof request.headers.get === 'function' ? request.headers.get(key) : request.headers[key];
        let ip = getHeader('x-forwarded-for')?.split(',')[0] || getHeader('x-real-ip') || '127.0.0.1';
        if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

        const adminHistory = await getAdminLoginHistoryCollection();
        await adminHistory.insertOne({
          visitorId: visitorId || null,
          ip: ip,
          userAgent: request.headers.get('user-agent') || 'Unknown',
          timestamp: new Date(),
          success: true
        });

        if (visitorId) {
          const visitors = await getAnalyticsVisitorsCollection();
          await visitors.updateOne(
            { visitorId },
            { $set: { isAdminDevice: true } }
          );
        }
      } catch (dbErr) {
        console.error('Failed to record admin login history:', dbErr);
      }

      return NextResponse.json({ success: true, message: 'Logged in successfully' });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

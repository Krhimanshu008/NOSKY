import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAdminLoginHistoryCollection, getAnalyticsVisitorsCollection } from '../../../../analytics/models/analyticsDb';
import { getUsersCollection } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

function secureCompare(a, b) {
  a = String(a || '');
  b = String(b || '');

  // Hash both strings to handle length differences safely and prevent length leaking
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();

  return crypto.timingSafeEqual(hashA, hashB);
}

export async function POST(request) {
  try {
    const { username, password, visitorId } = await request.json();

    const usersCollection = await getUsersCollection();
    let user = await usersCollection.findOne({ username });

    // Auto-seed admin user if the database is empty and credentials match ENV securely
    if (!user) {
      const userCount = await usersCollection.countDocuments();
      const envUsername = process.env.ADMIN_USERNAME;
      const envPassword = process.env.ADMIN_PASSWORD;

      if (
        userCount === 0 &&
        envUsername &&
        envPassword &&
        secureCompare(username, envUsername) &&
        secureCompare(password, envPassword)
      ) {
        const passwordHash = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ username, passwordHash, role: 'admin', createdAt: new Date() });
        user = await usersCollection.findOne({ username });
      }
    }

    if (user && await bcrypt.compare(password, user.passwordHash)) {
      // Ensure JWT secret is securely configured
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not defined');
      }

      // Create JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      
      const token = await new SignJWT({ username: user.username, role: user.role })
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

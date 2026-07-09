import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

/**
 * Lightweight auth check endpoint for client-side Header component.
 * Returns { authenticated: true/false } without redirecting.
 */
export async function GET() {
  const authenticated = await verifyAuth();
  return NextResponse.json({ authenticated });
}

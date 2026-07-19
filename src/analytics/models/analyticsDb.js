import { getDatabase } from '../../lib/db';

/**
 * Accesses the analytics_events collection.
 */
export async function getAnalyticsEventsCollection() {
  const db = await getDatabase();
  return db.collection('analytics_events');
}

/**
 * Accesses the analytics_visitors collection.
 */
export async function getAnalyticsVisitorsCollection() {
  const db = await getDatabase();
  return db.collection('analytics_visitors');
}

/**
 * Accesses the admin_login_history collection.
 */
export async function getAdminLoginHistoryCollection() {
  const db = await getDatabase();
  return db.collection('admin_login_history');
}

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

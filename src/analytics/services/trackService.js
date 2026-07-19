import { getAnalyticsEventsCollection, getAnalyticsVisitorsCollection } from '../models/analyticsDb';
import { isBot } from '../lib/botDetector';

export async function trackEvent(visitorData, eventData) {
  try {
    const eventsCollection = await getAnalyticsEventsCollection();
    const visitorsCollection = await getAnalyticsVisitorsCollection();

    // Check if this visitor is an admin device
    const existingVisitor = await visitorsCollection.findOne({ visitorId: visitorData.visitorId });
    if (existingVisitor?.isAdminDevice) {
      return { success: true, bypassed: true };
    }

    const timestamp = new Date();
    const botStatus = isBot(visitorData.userAgent);

    // Extract UTMs if present in metadata
    const utms = {};
    if (eventData.metadata?.utm_source) utms.utm_source = eventData.metadata.utm_source;
    if (eventData.metadata?.utm_medium) utms.utm_medium = eventData.metadata.utm_medium;
    if (eventData.metadata?.utm_campaign) utms.utm_campaign = eventData.metadata.utm_campaign;

    // Calculate Lead Score Increment
    let scoreIncrement = 0;
    let visitIncrement = 0;
    
    if (eventData.eventType === 'page_view') {
      scoreIncrement += 1;
      visitIncrement += 1;
    } else if (eventData.eventType === 'scroll_depth' && eventData.metadata?.depth === 100) {
      scoreIncrement += 2;
    } else if (eventData.eventType === 'time_on_page' && eventData.metadata?.durationSeconds > 60) {
      scoreIncrement += 5;
    } else if (eventData.eventType === 'pdf_download') {
      scoreIncrement += 20;
    } else if (
      eventData.eventType === 'email_click' || 
      eventData.eventType === 'tel_click' || 
      (eventData.eventType === 'click' && eventData.metadata?.text?.toLowerCase().includes('contact'))
    ) {
      scoreIncrement += 50;
    }

    // 1. Upsert Visitor Profile
    await visitorsCollection.updateOne(
      { visitorId: visitorData.visitorId },
      {
        $setOnInsert: {
          visitorId: visitorData.visitorId,
          firstVisit: timestamp,
          ...utms // Store initial attribution
        },
        $set: {
          lastVisit: timestamp,
          ip: visitorData.ip,
          country: visitorData.country,
          city: visitorData.city,
          latitude: visitorData.latitude,
          longitude: visitorData.longitude,
          userAgent: visitorData.userAgent,
          isBot: botStatus,
          ...(Object.keys(utms).length > 0 ? { latestAttribution: utms } : {}) // Update latest attribution if new UTMs exist
        },
        $inc: { visits: visitIncrement, leadScore: scoreIncrement }
      },
      { upsert: true }
    );

    // 2. Insert the specific event (page_view, click, duration, etc.)
    await eventsCollection.insertOne({
      visitorId: visitorData.visitorId,
      eventType: eventData.eventType,
      path: eventData.path,
      timestamp: timestamp,
      referrer: eventData.referrer || '',
      metadata: eventData.metadata || {}, // For duration, clicked element, etc.
      isBot: botStatus
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking event:', error);
    return { success: false, error: error.message };
  }
}

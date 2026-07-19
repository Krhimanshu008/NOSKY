import { getAnalyticsEventsCollection, getAnalyticsVisitorsCollection } from '../models/analyticsDb';

export async function getDashboardStats() {
  const eventsCollection = await getAnalyticsEventsCollection();
  const visitorsCollection = await getAnalyticsVisitorsCollection();

  // 1. Get total distinct visitors (non-bot)
  const totalVisitors = await visitorsCollection.countDocuments({ isBot: false });

  // 2. Get today's distinct visitors
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayVisitors = await visitorsCollection.countDocuments({ 
    isBot: false, 
    lastVisit: { $gte: startOfDay } 
  });

  // 3. Get total page views
  const totalViews = await eventsCollection.countDocuments({ 
    eventType: 'page_view', 
    isBot: false 
  });

  // 4. Get total bot traffic count
  const botTraffic = await eventsCollection.countDocuments({ 
    isBot: true 
  });

  // 5. Get top pages (aggregation)
  const topPagesPipeline = [
    { $match: { eventType: 'page_view', isBot: false } },
    { $group: { _id: "$path", views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 5 }
  ];
  const topPages = await eventsCollection.aggregate(topPagesPipeline).toArray();

  // 6. Get top countries (aggregation)
  const topCountriesPipeline = [
    { $match: { isBot: false } },
    { $group: { _id: "$country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ];
  const topCountries = await visitorsCollection.aggregate(topCountriesPipeline).toArray();

  // 7. Get top content by average retention time (articles and achievements)
  const topContentByRetentionPipeline = [
    { 
      $match: { 
        eventType: 'time_on_page', 
        isBot: false,
        $or: [
          { path: { $regex: '^/article/' } },
          { path: { $regex: '^/achievement/' } }
        ]
      } 
    },
    { 
      $group: { 
        _id: "$path", 
        avgRetentionSeconds: { $avg: "$metadata.durationSeconds" },
        readSessions: { $sum: 1 }
      } 
    },
    { $sort: { avgRetentionSeconds: -1 } },
    { $limit: 5 }
  ];
  const topContentByRetention = await eventsCollection.aggregate(topContentByRetentionPipeline).toArray();

  return {
    totalVisitors,
    todayVisitors,
    totalViews,
    botTraffic,
    topPages,
    topCountries,
    topContentByRetention
  };
}

export async function getRecentVisitors(limit = 20) {
  const visitorsCollection = await getAnalyticsVisitorsCollection();
  
  return await visitorsCollection
    .find({ isBot: false })
    .sort({ lastVisit: -1 })
    .limit(limit)
    .toArray();
}

export async function getVisitorJourney(visitorId) {
  const eventsCollection = await getAnalyticsEventsCollection();
  const visitorsCollection = await getAnalyticsVisitorsCollection();

  const visitor = await visitorsCollection.findOne({ visitorId });
  if (!visitor) return null;

  const events = await eventsCollection
    .find({ visitorId })
    .sort({ timestamp: 1 }) // Chronological order for timeline
    .toArray();

  return {
    visitor,
    journey: events
  };
}

export async function getEngagementStats(period = 30, customStartDate = null, customEndDate = null) {
  const eventsCollection = await getAnalyticsEventsCollection();

  const matchFilter = { isBot: false };
  if (period === 'custom' && customStartDate && customEndDate) {
    matchFilter.timestamp = { 
      $gte: new Date(customStartDate),
      $lte: new Date(customEndDate)
    };
  } else if (period !== 'all') {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(period, 10));
    matchFilter.timestamp = { $gte: cutoffDate };
  }

  // 1. Average Retention Time (time_on_page)
  const retentionPipeline = [
    { $match: { ...matchFilter, eventType: 'time_on_page' } },
    { $group: { _id: null, avgTime: { $avg: "$metadata.durationSeconds" } } }
  ];
  const retentionResult = await eventsCollection.aggregate(retentionPipeline).toArray();
  const avgRetentionSeconds = retentionResult.length > 0 ? Math.round(retentionResult[0].avgTime) : 0;

  // 2. Event Log (recent clicks, downloads, etc)
  const recentEvents = await eventsCollection
    .find({ 
      ...matchFilter,
      eventType: { $in: ['click', 'email_click', 'tel_click', 'pdf_download', 'outbound_link'] }
    })
    .sort({ timestamp: -1 })
    .limit(10)
    .toArray();

  // 3. Scroll Depth Drop-off (average max depth across all page views)
  const scrollPipeline = [
    { $match: { ...matchFilter, eventType: 'scroll_depth' } },
    { $group: { _id: "$metadata.depth", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ];
  const scrollMilestones = await eventsCollection.aggregate(scrollPipeline).toArray();

  // 4. CTA Performance (Most clicked elements)
  const ctaPipeline = [
    { $match: { ...matchFilter, eventType: 'click', "metadata.text": { $exists: true, $ne: "" } } },
    { $group: { _id: { text: "$metadata.text", path: "$path" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { _id: 0, text: "$_id.text", path: "$_id.path", count: 1 } }
  ];
  const ctaPerformance = await eventsCollection.aggregate(ctaPipeline).toArray();

  // 5. Retention by Page
  const pageRetentionPipeline = [
    { $match: { ...matchFilter, eventType: 'time_on_page' } },
    { $group: { _id: "$path", avgTime: { $avg: "$metadata.durationSeconds" }, views: { $sum: 1 } } },
    { $sort: { avgTime: -1 } },
    { $limit: 10 }
  ];
  const retentionByPage = await eventsCollection.aggregate(pageRetentionPipeline).toArray();

  // 6. Conversions
  const totalClicks = await eventsCollection.countDocuments({ ...matchFilter, eventType: 'click' });
  const totalDownloads = await eventsCollection.countDocuments({ ...matchFilter, eventType: 'pdf_download' });

  return {
    avgRetentionSeconds,
    recentEvents,
    scrollMilestones,
    ctaPerformance,
    retentionByPage,
    totalClicks,
    totalDownloads
  };
}

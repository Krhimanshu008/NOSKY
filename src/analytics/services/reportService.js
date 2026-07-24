import { getAnalyticsEventsCollection, getAnalyticsVisitorsCollection } from '../models/analyticsDb';

export async function getDashboardStats() {
  const eventsCollection = await getAnalyticsEventsCollection();
  const visitorsCollection = await getAnalyticsVisitorsCollection();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const topPagesPipeline = [
    { $match: { eventType: 'page_view', isBot: false } },
    { $group: { _id: "$path", views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 5 }
  ];

  const topCountriesPipeline = [
    { $match: { isBot: false } },
    { $group: { _id: "$country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ];

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

  const [
    totalVisitors,
    todayVisitors,
    totalViews,
    botTraffic,
    topPages,
    topCountries,
    topContentByRetention
  ] = await Promise.all([
    visitorsCollection.countDocuments({ isBot: false }).catch(() => 0),
    visitorsCollection.countDocuments({ isBot: false, lastVisit: { $gte: startOfDay } }).catch(() => 0),
    eventsCollection.countDocuments({ eventType: 'page_view', isBot: false }).catch(() => 0),
    eventsCollection.countDocuments({ isBot: true }).catch(() => 0),
    eventsCollection.aggregate(topPagesPipeline).toArray().catch(() => []),
    visitorsCollection.aggregate(topCountriesPipeline).toArray().catch(() => []),
    eventsCollection.aggregate(topContentByRetentionPipeline).toArray().catch(() => [])
  ]);

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

  const retentionPipeline = [
    { $match: { ...matchFilter, eventType: 'time_on_page' } },
    { $group: { _id: null, avgTime: { $avg: "$metadata.durationSeconds" } } }
  ];

  const scrollPipeline = [
    { $match: { ...matchFilter, eventType: 'scroll_depth' } },
    { $group: { _id: "$metadata.depth", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ];

  const ctaPipeline = [
    { $match: { ...matchFilter, eventType: 'click', "metadata.text": { $exists: true, $ne: "" } } },
    { $group: { _id: { text: "$metadata.text", path: "$path" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { _id: 0, text: "$_id.text", path: "$_id.path", count: 1 } }
  ];

  const pageRetentionPipeline = [
    { $match: { ...matchFilter, eventType: 'time_on_page' } },
    { $group: { _id: "$path", avgTime: { $avg: "$metadata.durationSeconds" }, views: { $sum: 1 } } },
    { $sort: { avgTime: -1 } },
    { $limit: 10 }
  ];

  const [
    retentionResult,
    recentEvents,
    scrollMilestones,
    ctaPerformance,
    retentionByPage,
    totalClicks,
    totalDownloads
  ] = await Promise.all([
    eventsCollection.aggregate(retentionPipeline).toArray().catch(() => []),
    eventsCollection.find({
      ...matchFilter,
      eventType: { $in: ['click', 'email_click', 'tel_click', 'pdf_download', 'outbound_link'] }
    }).sort({ timestamp: -1 }).limit(10).toArray().catch(() => []),
    eventsCollection.aggregate(scrollPipeline).toArray().catch(() => []),
    eventsCollection.aggregate(ctaPipeline).toArray().catch(() => []),
    eventsCollection.aggregate(pageRetentionPipeline).toArray().catch(() => []),
    eventsCollection.countDocuments({ ...matchFilter, eventType: 'click' }).catch(() => 0),
    eventsCollection.countDocuments({ ...matchFilter, eventType: 'pdf_download' }).catch(() => 0)
  ]);

  const avgRetentionSeconds = retentionResult.length > 0 ? Math.round(retentionResult[0].avgTime) : 0;

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

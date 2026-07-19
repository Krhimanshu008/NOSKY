import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DUMMY_COUNT = 5000;

async function runBenchmark() {
  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db('nosky');
    const collection = db.collection('articles');

    console.log(`Inserting ${DUMMY_COUNT} dummy articles...`);
    const dummyArticles = Array.from({ length: DUMMY_COUNT }).map((_, i) => ({
      title: `Benchmark Dummy Article ${i}`,
      slug: `benchmark-dummy-article-${i}-${Math.random().toString(36).substring(2, 6)}`,
      content: 'This is a dummy article for benchmarking purposes.',
      published: 1,
      createdAt: new Date(),
      isBenchmarkDummy: true
    }));

    await collection.insertMany(dummyArticles);
    console.log('Dummy articles inserted successfully.');

    // Benchmark the query without limit
    console.log('Running query benchmark (simulating unbounded query)...');

    // We want to simulate what the code in src/app/api/articles/route.js is actually running right now
    const startUnbounded = process.hrtime.bigint();
    const articlesUnbounded = await collection.find({}).sort({ createdAt: -1 }).toArray();
    const endUnbounded = process.hrtime.bigint();

    const timeUnboundedMs = Number(endUnbounded - startUnbounded) / 1000000;
    console.log(`Unbounded query returned ${articlesUnbounded.length} articles in ${timeUnboundedMs.toFixed(2)} ms`);

    // We can also test what it WOULD take with a limit
    console.log('Running query benchmark (simulating limit(100))...');
    const startLimited = process.hrtime.bigint();
    const articlesLimited = await collection.find({}).sort({ createdAt: -1 }).limit(100).toArray();
    const endLimited = process.hrtime.bigint();

    const timeLimitedMs = Number(endLimited - startLimited) / 1000000;
    console.log(`Limited query returned ${articlesLimited.length} articles in ${timeLimitedMs.toFixed(2)} ms`);
    console.log(`Difference: ${(timeUnboundedMs - timeLimitedMs).toFixed(2)} ms`);
    console.log(`Speedup: ${(timeUnboundedMs / timeLimitedMs).toFixed(2)}x`);
  } catch (error) {
    console.error('Error during benchmark:', error);
  } finally {
    console.log('Cleaning up dummy articles...');
    try {
      const db = client.db('nosky');
      const collection = db.collection('articles');
      const deleteResult = await collection.deleteMany({ isBenchmarkDummy: true });
      console.log(`Cleaned up ${deleteResult.deletedCount} dummy articles.`);
    } catch (e) {
      console.error('Failed to clean up:', e);
    }

    await client.close();
    console.log('MongoDB connection closed.');
  }
}

runBenchmark().catch(console.error);

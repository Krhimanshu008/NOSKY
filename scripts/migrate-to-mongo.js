const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

async function run() {

  console.log("Connecting to SQLite...");
  const db = await open({
    filename: path.join(__dirname, '../dev.db'),
    driver: sqlite3.Database
  });

  const articles = await db.all('SELECT * FROM Article');
  console.log(`Found ${articles.length} articles in SQLite.`);

  if (articles.length === 0) {
    console.log("No data to migrate. Exiting.");
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found in .env");
    return;
  }

  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    const mongoDb = client.db("nosky");
    const collection = mongoDb.collection("articles");

    // Optional: Clear existing data to prevent duplicates during testing
    await collection.deleteMany({});
    console.log("Cleared existing MongoDB articles (if any).");

    const result = await collection.insertMany(articles);
    console.log(`Successfully migrated ${result.insertedCount} articles to MongoDB!`);
  } catch (error) {
    console.error("Error migrating to MongoDB:", error);
  } finally {
    await client.close();
    await db.close();
  }
}

run().catch(console.error);

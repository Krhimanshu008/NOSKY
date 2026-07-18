import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('nosky');
  
  const events = await db.collection('analytics_events').find().toArray();
  const visitors = await db.collection('analytics_visitors').find().toArray();
  
  console.log('Events:', events.length);
  console.log('Visitors:', visitors.length);
  
  await client.close();
}

run().catch(console.dir);

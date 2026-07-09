const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("nosky");
  const collection = db.collection("articles");
  console.log("Is find a function?", typeof collection.find === 'function');
  await client.close();
}
run().catch(console.error);

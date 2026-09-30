import { MongoClient } from 'mongodb';
import dns from 'dns';

// Fix for Node.js DNS ECONNREFUSED on some Windows networks
dns.setServers(['8.8.8.8', '1.1.1.1']);

const uri = "mongodb+srv://utsavadsf_db_user:Secret123@cluster0.oha2tef.mongodb.net/aqi_monitoring_db?retryWrites=true&w=majority";

async function run() {
  console.log("Testing raw MongoDB driver connection...");
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000
  });

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");
    const db = client.db('aqi_monitoring_db');
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
  } catch (err) {
    console.error("❌ Connection failed!");
    console.error(err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

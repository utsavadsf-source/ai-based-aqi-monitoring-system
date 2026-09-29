import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  console.log(`Connecting to: ${process.env.MONGODB_URI?.replace(/:([^:@]{3,})@/, ':***@')}`);
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ SUCCESS! Connected to Atlas cluster: ${conn.connection.host}`);
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`Collections found: ${collections.map(c => c.name).join(', ')}`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ FAILED: ${error.message}`);
    process.exit(1);
  }
}

testConnection();

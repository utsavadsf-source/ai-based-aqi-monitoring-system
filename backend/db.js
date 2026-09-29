import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aqi_monitoring_db';
let mongoServer = null;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.log(`⚠️ Default MongoDB Connection Failed (${error.message}).`);
    console.log(`🚀 Starting in-memory MongoDB server as fallback...`);
    
    try {
      const fs = await import('fs');
      const path = await import('path');
      const dbPath = path.resolve(process.cwd(), '.mongo-data');
      if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

      mongoServer = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          dbPath: dbPath,
          storageEngine: 'wiredTiger'
        }
      });
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Connected successfully: ${uri}`);
      return conn;
    } catch (fallbackError) {
      console.error(`❌ In-Memory MongoDB Connection Error: ${fallbackError.message}`);
      return null;
    }
  }
};


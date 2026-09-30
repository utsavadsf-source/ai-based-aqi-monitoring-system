import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Fix for Node.js DNS ECONNREFUSED on some Windows networks
dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we load the .env from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
let mongoServer = null;

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined.");
    
    // Connect to MongoDB Atlas
    console.log(`🔌 Attempting to connect to MongoDB Atlas...`);
    const conn = await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`⚠️ Atlas Connection Failed:`, error.message);
    console.log(`🚀 Starting local in-memory MongoDB server as fallback so you can test the app...`);
    
    try {
      await mongoose.disconnect(); // Clear failed connection state
      const fs = await import('fs');
      const dbPath = path.resolve(process.cwd(), '.mongo-data');
      if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

      mongoServer = await MongoMemoryServer.create({
        instance: { port: 27017, dbPath: dbPath, storageEngine: 'wiredTiger' }
      });
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ Local Database Running at: ${uri}`);
      return conn;
    } catch (fallbackError) {
      console.error(`❌ Local Database Failed:`, fallbackError.message);
      process.exit(1);
    }
  }
};

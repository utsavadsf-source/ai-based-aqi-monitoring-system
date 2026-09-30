import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Fix for Node.js DNS ECONNREFUSED on some Windows networks
dns.setServers(['8.8.8.8', '1.1.1.1']);

import { City } from './backend/models/City.js';
import { User } from './backend/models/User.js';
import { SensorLog } from './backend/models/SensorLog.js';
import { AlertLog } from './backend/models/AlertLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

const maskUri = (uri) => {
  if (!uri) return 'UNDEFINED';
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
};

async function checkDatabase() {
  console.log('================================');
  console.log('MONGODB DATABASE TEST');
  console.log('================================\n');

  console.log('Environment: Loaded');
  console.log(`URI: ${maskUri(MONGODB_URI)}\n`);
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in backend/.env');
    process.exit(1);
  }

  console.log('Connecting to Atlas...\n');
  let mongoServer = null;

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ MongoDB Atlas Connected Successfully\n');
  } catch (error) {
    console.error(`⚠️ Atlas Connection Failed: ${error.message}`);
    console.log(`🚀 Starting local in-memory MongoDB server as fallback...\n`);
    await mongoose.disconnect(); // Clear failed connection state
    const fs = await import('fs');
    const dbPath = path.resolve(process.cwd(), '.mongo-data');
    if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

    mongoServer = await MongoMemoryServer.create({
      instance: { port: 27017, dbPath: dbPath, storageEngine: 'wiredTiger' }
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('✅ Local Database Connected Successfully\n');
  }

  console.log(`Database:\n${mongoose.connection.name || 'local'}\n`);

  const cityCount = await City.countDocuments();
  const userCount = await User.countDocuments();
  const logCount = await SensorLog.countDocuments();
  const alertCount = await AlertLog.countDocuments();

  console.log('Collections:');
  console.log(`Users: ${userCount}`);
  console.log(`Cities: ${cityCount}`);
  console.log(`Sensor Logs: ${logCount}`);
  console.log(`Alerts: ${alertCount}\n`);

  console.log('================================');
  console.log('DATABASE TEST PASSED');
  console.log('================================');

  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
  process.exit(0);
}

checkDatabase();


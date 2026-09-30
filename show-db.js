import mongoose from 'mongoose';
import { City } from './backend/models/City.js';
import { User } from './backend/models/User.js';

async function showDb() {
  try {
    console.log("🔌 Connecting to Local MongoDB Database...");
    await mongoose.connect('mongodb://127.0.0.1:27017/aqi_monitoring_db', { serverSelectionTimeoutMS: 2000 });
    console.log("✅ Connected Successfully!\n");

    console.log("==========================================");
    console.log("🏢 CITIES DATA (Direct from MongoDB)");
    console.log("==========================================");
    const cities = await City.find({}).select('name aqi status pm25 pm10 temp -_id');
    console.table(cities.map(c => c.toObject()));

    console.log("\n==========================================");
    console.log("👤 USERS DATA (Direct from MongoDB)");
    console.log("==========================================");
    const users = await User.find({}).select('name email role assignedCity -_id');
    console.table(users.map(u => u.toObject()));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Could not connect to local database. Make sure the backend server (npm run server) is running!", err.message);
    process.exit(1);
  }
}

showDb();

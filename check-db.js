import mongoose from 'mongoose';
import { City } from './server/models/City.js';
import { User } from './server/models/User.js';
import { SensorLog } from './server/models/SensorLog.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/aqi_monitoring_db';

async function checkDatabase() {
  console.log(`🔌 Connecting to MongoDB at ${MONGODB_URI}...`);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!');

    const cityCount = await City.countDocuments();
    const userCount = await User.countDocuments();
    const logCount = await SensorLog.countDocuments();

    console.log('\n📊 --- DATABASE STATS ---');
    console.log(`🏙️  Cities/Monitoring Stations: ${cityCount}`);
    console.log(`👤  Registered Users: ${userCount}`);
    console.log(`📈  Sensor Telemetry Logs: ${logCount}`);

    console.log('\n🔍 --- SAMPLE DATA (1 City) ---');
    const sampleCity = await City.findOne({ id: 'rajkot' }).select('name aqi status pm25 temp sensors.dht22.temperature');
    console.log(JSON.stringify(sampleCity, null, 2));
    
    console.log('\n🔍 --- SAMPLE DATA (1 User) ---');
    const sampleUser = await User.findOne({ email: 'admin@gujarat-aqi.gov.in' }).select('name email role assignedCity');
    console.log(JSON.stringify(sampleUser, null, 2));

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    process.exit(1);
  }
}

checkDatabase();

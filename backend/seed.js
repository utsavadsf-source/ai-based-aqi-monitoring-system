import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import { City } from './models/City.js';
import { User } from './models/User.js';
import { SensorLog } from './models/SensorLog.js';
import { AlertLog } from './models/AlertLog.js';

dotenv.config();

const INITIAL_CITIES = [
  {
    id: 'rajkot',
    name: 'Rajkot',
    state: 'Gujarat',
    isGujarat: true,
    aqi: 68,
    status: 'Moderate',
    pm25: 28,
    pm10: 85,
    temp: 33.2,
    humidity: 52.4,
    windSpeed: 9,
    windDir: 'WSW',
    co: 110,
    no2: 24,
    o3: 41,
    lat: 22.3039,
    lng: 70.8022,
    sensors: {
      dht22: { temperature: 33.2, humidity: 52.4, heatIndex: 35.1, status: 'optimal' },
      mq135: { airQualityPpm: 124, co2Ppm: 418, nh3Ppm: 12.4, benzenePpm: 1.2, rawAdc: 320, rZero: 76.8, rsRoRatio: 1.15 },
      mq2: { smokePpm: 42, lpgPpm: 18, propanePpm: 15, methanePpm: 24, rawAdc: 215, status: 'normal' },
      mq7: { coPpm: 3.4, rawAdc: 198, safetyLevel: 'safe' },
    },
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    isGujarat: true,
    aqi: 142,
    status: 'Unhealthy',
    pm25: 68,
    pm10: 110,
    temp: 33.8,
    humidity: 62.1,
    windSpeed: 8,
    windDir: 'NW',
    co: 165,
    no2: 52,
    o3: 65,
    lat: 23.0225,
    lng: 72.5714,
    sensors: {
      dht22: { temperature: 33.8, humidity: 62.1, heatIndex: 38.6, status: 'warning' },
      mq135: { airQualityPpm: 285, co2Ppm: 560, nh3Ppm: 28.5, benzenePpm: 3.8, rawAdc: 580, rZero: 76.8, rsRoRatio: 2.1 },
      mq2: { smokePpm: 115, lpgPpm: 45, propanePpm: 40, methanePpm: 55, rawAdc: 440, status: 'combustible_detected' },
      mq7: { coPpm: 8.9, rawAdc: 380, safetyLevel: 'caution' },
    },
  },
  {
    id: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    isGujarat: true,
    aqi: 115,
    status: 'Unhealthy for Sensitive',
    pm25: 48,
    pm10: 95,
    temp: 31.5,
    humidity: 75.0,
    windSpeed: 12,
    windDir: 'SW',
    co: 140,
    no2: 38,
    o3: 50,
    lat: 21.1702,
    lng: 72.8311,
    sensors: {
      dht22: { temperature: 31.5, humidity: 75.0, heatIndex: 37.2, status: 'optimal' },
      mq135: { airQualityPpm: 195, co2Ppm: 490, nh3Ppm: 18.2, benzenePpm: 2.1, rawAdc: 420, rZero: 76.8, rsRoRatio: 1.6 },
      mq2: { smokePpm: 78, lpgPpm: 30, propanePpm: 25, methanePpm: 38, rawAdc: 310, status: 'normal' },
      mq7: { coPpm: 6.2, rawAdc: 290, safetyLevel: 'caution' },
    },
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    state: 'Gujarat',
    isGujarat: true,
    aqi: 82,
    status: 'Moderate',
    pm25: 32,
    pm10: 72,
    temp: 32.0,
    humidity: 58.0,
    windSpeed: 10,
    windDir: 'W',
    co: 118,
    no2: 28,
    o3: 42,
    lat: 22.3072,
    lng: 73.1812,
    sensors: {
      dht22: { temperature: 32.0, humidity: 58.0, heatIndex: 34.5, status: 'optimal' },
      mq135: { airQualityPpm: 145, co2Ppm: 435, nh3Ppm: 14.1, benzenePpm: 1.5, rawAdc: 350, rZero: 76.8, rsRoRatio: 1.25 },
      mq2: { smokePpm: 52, lpgPpm: 22, propanePpm: 18, methanePpm: 28, rawAdc: 240, status: 'normal' },
      mq7: { coPpm: 4.1, rawAdc: 220, safetyLevel: 'safe' },
    },
  },
  {
    id: 'bhavnagar',
    name: 'Bhavnagar',
    state: 'Gujarat',
    isGujarat: true,
    aqi: 45,
    status: 'Good',
    pm25: 14,
    pm10: 42,
    temp: 30.2,
    humidity: 65.0,
    windSpeed: 14,
    windDir: 'S',
    co: 85,
    no2: 16,
    o3: 30,
    lat: 21.7645,
    lng: 72.1519,
    sensors: {
      dht22: { temperature: 30.2, humidity: 65.0, heatIndex: 32.8, status: 'optimal' },
      mq135: { airQualityPpm: 88, co2Ppm: 395, nh3Ppm: 8.5, benzenePpm: 0.8, rawAdc: 240, rZero: 76.8, rsRoRatio: 0.9 },
      mq2: { smokePpm: 25, lpgPpm: 10, propanePpm: 8, methanePpm: 14, rawAdc: 160, status: 'normal' },
      mq7: { coPpm: 2.1, rawAdc: 145, safetyLevel: 'safe' },
    },
  },
  {
    id: 'jamnagar',
    name: 'Jamnagar',
    state: 'Gujarat',
    isGujarat: true,
    aqi: 78,
    status: 'Moderate',
    pm25: 30,
    pm10: 68,
    temp: 31.8,
    humidity: 60.0,
    windSpeed: 11,
    windDir: 'SW',
    co: 112,
    no2: 25,
    o3: 38,
    lat: 22.4707,
    lng: 70.0577,
    sensors: {
      dht22: { temperature: 31.8, humidity: 60.0, heatIndex: 34.0, status: 'optimal' },
      mq135: { airQualityPpm: 138, co2Ppm: 428, nh3Ppm: 13.2, benzenePpm: 1.4, rawAdc: 335, rZero: 76.8, rsRoRatio: 1.2 },
      mq2: { smokePpm: 48, lpgPpm: 20, propanePpm: 16, methanePpm: 25, rawAdc: 230, status: 'normal' },
      mq7: { coPpm: 3.8, rawAdc: 210, safetyLevel: 'safe' },
    },
  },
  {
    id: 'junagadh',
    name: 'Junagadh',
    state: 'Gujarat',
    isGujarat: true,
    aqi: 38,
    status: 'Good',
    pm25: 11,
    pm10: 35,
    temp: 29.5,
    humidity: 55.0,
    windSpeed: 8,
    windDir: 'SW',
    co: 75,
    no2: 12,
    o3: 25,
    lat: 21.5222,
    lng: 70.4579,
    sensors: {
      dht22: { temperature: 29.5, humidity: 55.0, heatIndex: 30.5, status: 'optimal' },
      mq135: { airQualityPpm: 72, co2Ppm: 385, nh3Ppm: 6.8, benzenePpm: 0.6, rawAdc: 210, rZero: 76.8, rsRoRatio: 0.8 },
      mq2: { smokePpm: 18, lpgPpm: 8, propanePpm: 6, methanePpm: 10, rawAdc: 130, status: 'normal' },
      mq7: { coPpm: 1.8, rawAdc: 125, safetyLevel: 'safe' },
    },
  },
  {
    id: 'gandhinagar',
    name: 'Gandhinagar',
    state: 'Gujarat',
    isGujarat: true,
    aqi: 92,
    status: 'Moderate',
    pm25: 38,
    pm10: 80,
    temp: 32.5,
    humidity: 54.0,
    windSpeed: 9,
    windDir: 'NNE',
    co: 125,
    no2: 32,
    o3: 45,
    lat: 23.2156,
    lng: 72.6369,
    sensors: {
      dht22: { temperature: 32.5, humidity: 54.0, heatIndex: 34.8, status: 'optimal' },
      mq135: { airQualityPpm: 160, co2Ppm: 450, nh3Ppm: 15.8, benzenePpm: 1.8, rawAdc: 370, rZero: 76.8, rsRoRatio: 1.35 },
      mq2: { smokePpm: 58, lpgPpm: 24, propanePpm: 20, methanePpm: 31, rawAdc: 260, status: 'normal' },
      mq7: { coPpm: 4.6, rawAdc: 235, safetyLevel: 'safe' },
    },
  },
];

const INITIAL_USERS = [
  {
    name: 'Rajkot Environmental Admin',
    email: 'admin@gujarat-aqi.gov.in',
    password: 'AdminPassword123!', // In production, hash with bcrypt
    phone: '+919876543210',
    role: 'admin',
    assignedCity: 'rajkot',
  },
  {
    name: 'Ahmedabad Nodal Officer',
    email: 'officer.ahmedabad@gujarat-aqi.gov.in',
    password: 'OfficerPassword123!',
    phone: '+919876543211',
    role: 'officer',
    assignedCity: 'ahmedabad',
  },
  {
    name: 'Gujarat Resident',
    email: 'citizen@gujarat.in',
    password: 'CitizenPassword123!',
    phone: '+919876543212',
    role: 'citizen',
    assignedCity: 'rajkot',
  },
];

export const seedDatabase = async () => {
  console.log('🌱 Starting Database Seeding Process...');
  let conn = mongoose.connection;
  
  if (conn.readyState !== 1) {
    conn = await connectDB();
  }

  if (!conn || conn.readyState !== 1) {
    console.error('❌ Database connection failed. Aborting seeder.');
    process.exit(1);
  }

  try {
    // 1. Clear existing data
    console.log('🧹 Clearing existing collections...');
    await City.deleteMany({});
    await User.deleteMany({});
    await SensorLog.deleteMany({});
    await AlertLog.deleteMany({});

    // 2. Insert Cities
    console.log(`🏙️ Seeding ${INITIAL_CITIES.length} Monitoring Stations / Cities...`);
    const createdCities = await City.insertMany(INITIAL_CITIES);
    console.log(`✅ ${createdCities.length} Cities inserted successfully.`);

    // 3. Insert Users
    console.log(`👤 Seeding ${INITIAL_USERS.length} System Users...`);
    const createdUsers = await User.insertMany(INITIAL_USERS);
    console.log(`✅ ${createdUsers.length} Demo users inserted successfully.`);

    // 4. Insert 24-Hour Telemetry History Logs for each city
    console.log('📈 Generating historical sensor log telemetry (past 24h)...');
    const sensorLogs = [];
    const now = Date.now();

    for (const city of INITIAL_CITIES) {
      for (let i = 24; i >= 0; i--) {
        const timeOffset = i * 3600 * 1000; // 1 hour intervals
        const timestamp = new Date(now - timeOffset);
        
        // Random slight fluctuation
        const randVariation = Math.sin(i / 2) * 5;
        const temp = +(city.temp + (Math.random() * 2 - 1)).toFixed(1);
        const humidity = Math.round(city.humidity + (Math.random() * 4 - 2));
        const mq135_adc = Math.round(city.sensors.mq135.rawAdc + randVariation * 2);
        const mq2_adc = Math.round(city.sensors.mq2.rawAdc + randVariation);
        const mq7_adc = Math.round(city.sensors.mq7.rawAdc + randVariation * 0.5);
        const aqi = Math.max(15, Math.round(city.aqi + randVariation));

        sensorLogs.push({
          city_id: city.id,
          temperature: temp,
          humidity: humidity,
          mq135_adc: mq135_adc,
          co2_ppm: Math.round(400 + mq135_adc * 0.45),
          nh3_ppm: +(10 + mq135_adc * 0.02).toFixed(1),
          benzene_ppm: +(1 + mq135_adc * 0.003).toFixed(1),
          mq2_adc: mq2_adc,
          smoke_ppm: +(mq2_adc * 0.22).toFixed(1),
          lpg_ppm: +(mq2_adc * 0.09).toFixed(1),
          mq7_adc: mq7_adc,
          co_ppm: +(mq7_adc * 0.018).toFixed(1),
          pm25: Math.round(city.pm25 + randVariation * 0.5),
          pm10: Math.round(city.pm10 + randVariation * 0.8),
          aqi: aqi,
          recorded_at: timestamp,
        });
      }
    }

    const insertedLogs = await SensorLog.insertMany(sensorLogs);
    console.log(`✅ ${insertedLogs.length} Sensor Telemetry logs created.`);

    // 5. Seed Alert Logs
    console.log('🚨 Seeding initial alert logs...');
    const alertLogs = [
      {
        city_id: 'ahmedabad',
        aqi_level: 142,
        alert_type: 'severe_spike',
        channel: 'whatsapp',
        message_content: '⚠️ HIGH AQI ALERT: Ahmedabad AQI recorded at 142. Sensitive groups advised to stay indoors.',
        dispatched_to: '+919876543211',
        sent_at: new Date(now - 3600 * 1000 * 3),
      },
      {
        city_id: 'surat',
        aqi_level: 115,
        alert_type: 'moderate_spike',
        channel: 'email',
        message_content: '⚠️ AQI Advisory: Surat AQI elevated to 115. Smoke and particulate matter increase detected.',
        dispatched_to: 'citizen@gujarat.in',
        sent_at: new Date(now - 3600 * 1000 * 6),
      }
    ];

    await AlertLog.insertMany(alertLogs);
    console.log('✅ Initial Alert logs inserted.');

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('--------------------------------------------------');
    return true;
  } catch (error) {
    console.error('❌ Error Seeding Database:', error);
    return false;
  }
};

// If run directly via CLI (npm run seed)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase().then(() => process.exit(0));
}

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { seedDatabase } from './seed.js';
import { City } from './models/City.js';
import { User } from './models/User.js';
import { SensorLog } from './models/SensorLog.js';
import { AlertLog } from './models/AlertLog.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS & Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());


// Connect to MongoDB
let isDbConnected = false;
connectDB().then(async (conn) => {
  if (conn) {
    isDbConnected = true;
    const cityCount = await City.countDocuments();
    if (cityCount === 0) {
      console.log('🔄 Database is empty. Auto-seeding initial data...');
      await seedDatabase();
    }
    
    // Start Server ONLY after DB connects
    app.listen(PORT, () => {
      console.log(`🚀 AQI System API Backend running on http://localhost:${PORT}`);
      console.log(`📡 Endpoints available: /api/cities, /api/sensor-data, /api/logs/sensors, /api/auth/login`);
    });
  }
}).catch(err => {
  console.error('Failed to connect to DB, server not started:', err);
  process.exit(1);
});

// Helper: Calculate AQI breakpoint from PM2.5, PM10 & Gas inputs
function calculateAQI(pm25, pm10, co_ppm) {
  let i_pm25 = 0;
  if (pm25 <= 12.0) {
    i_pm25 = (50 / 12.0) * pm25;
  } else if (pm25 <= 35.4) {
    i_pm25 = 51 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1);
  } else if (pm25 <= 55.4) {
    i_pm25 = 101 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5);
  } else {
    i_pm25 = 151 + ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5);
  }
  const i_co = Math.min(300, co_ppm * 10);
  return Math.max(10, Math.round(Math.max(i_pm25, i_co)));
}

function getAQIStatus(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AI-Based AQI Monitoring API Server',
    dbConnected: isDbConnected,
    timestamp: new Date().toISOString(),
  });
});

// 2. GET All Cities / Monitoring Stations
app.get('/api/cities', async (req, res) => {
  try {
    if (!isDbConnected) {
      return res.status(503).json({ error: 'Database not connected. Please run MongoDB and execute npm run seed.' });
    }
    const cities = await City.find({}).sort({ name: 1 });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET Single City by ID
app.get('/api/cities/:id', async (req, res) => {
  try {
    const city = await City.findOne({ id: req.params.id });
    if (!city) return res.status(404).json({ error: 'City not found' });
    res.json(city);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. POST Telemetry Endpoint (For ESP32 / Arduino / Hardware Nodes & Frontend Simulation)
app.post('/api/sensor-data', async (req, res) => {
  try {
    const { city_id = 'rajkot', temp, humidity, mq135_adc, mq2_adc, mq7_adc } = req.body;

    const temperature = parseFloat(temp || 33.0);
    const hum = parseFloat(humidity || 52.0);
    const mq135 = parseInt(mq135_adc || 320);
    const mq2 = parseInt(mq2_adc || 215);
    const mq7 = parseInt(mq7_adc || 198);

    // Physical Gas Concentration Calculations
    const co2Ppm = Math.round(400 + mq135 * 0.45);
    const nh3Ppm = parseFloat((10 + mq135 * 0.02).toFixed(1));
    const benzenePpm = parseFloat((1 + mq135 * 0.003).toFixed(1));

    const smokePpm = parseFloat((mq2 * 0.22).toFixed(1));
    const lpgPpm = parseFloat((mq2 * 0.09).toFixed(1));
    const methanePpm = parseFloat((mq2 * 0.12).toFixed(1));

    const coPpm = parseFloat((mq7 * 0.018).toFixed(1));
    const pm25 = Math.round(15 + smokePpm * 0.4);
    const pm10 = Math.round(35 + smokePpm * 0.9);

    const calculatedAqi = calculateAQI(pm25, pm10, coPpm);
    const status = getAQIStatus(calculatedAqi);

    // Save Telemetry Log to Database
    const logEntry = new SensorLog({
      city_id,
      temperature,
      humidity: hum,
      mq135_adc: mq135,
      co2_ppm: co2Ppm,
      nh3_ppm: nh3Ppm,
      benzene_ppm: benzenePpm,
      mq2_adc: mq2,
      smoke_ppm: smokePpm,
      lpg_ppm: lpgPpm,
      mq7_adc: mq7,
      co_ppm: coPpm,
      pm25,
      pm10,
      aqi: calculatedAqi,
      recorded_at: new Date(),
    });
    await logEntry.save();

    // Update City Live Status in Database
    const updatedCity = await City.findOneAndUpdate(
      { id: city_id },
      {
        aqi: calculatedAqi,
        status,
        temp: temperature,
        humidity: hum,
        pm25,
        pm10,
        co: Math.round(coPpm * 30),
        'sensors.dht22.temperature': temperature,
        'sensors.dht22.humidity': hum,
        'sensors.mq135.rawAdc': mq135,
        'sensors.mq135.co2Ppm': co2Ppm,
        'sensors.mq2.rawAdc': mq2,
        'sensors.mq2.smokePpm': smokePpm,
        'sensors.mq7.rawAdc': mq7,
        'sensors.mq7.coPpm': coPpm,
        updatedAt: new Date(),
      },
      { new: true, upsert: false }
    );

    // Trigger Spike Alert if AQI is elevated
    let alertTriggered = false;
    if (calculatedAqi >= 100) {
      alertTriggered = true;
      const alertType = calculatedAqi >= 150 ? 'severe_spike' : 'moderate_spike';
      const alertMsg = `⚠️ AQI Spike Alert for ${city_id.toUpperCase()}: AQI recorded at ${calculatedAqi} (${status}). Take respiratory precautions.`;

      await AlertLog.create({
        city_id,
        aqi_level: calculatedAqi,
        alert_type: alertType,
        channel: 'whatsapp',
        message_content: alertMsg,
        dispatched_to: 'Registered Citizens & Environmental Officers',
      });
    }

    res.json({
      success: true,
      city_id,
      calculatedAqi,
      status,
      alertTriggered,
      sensors: {
        dht22: { temperature, humidity: hum },
        mq135: { rawAdc: mq135, co2Ppm },
        mq2: { rawAdc: mq2, smokePpm },
        mq7: { rawAdc: mq7, coPpm },
      },
      updatedCity,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. GET Historical Telemetry Logs
app.get('/api/logs/sensors', async (req, res) => {
  try {
    const { city_id, limit = 50 } = req.query;
    const query = city_id ? { city_id } : {};
    const logs = await SensorLog.find(query)
      .sort({ recorded_at: -1 })
      .limit(parseInt(limit));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. GET Alert Logs
app.get('/api/logs/alerts', async (req, res) => {
  try {
    const alerts = await AlertLog.find({}).sort({ sent_at: -1 }).limit(50);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- NEW AQI ENDPOINTS ---

// GET /api/aqi - Get all AQI logs
app.get('/api/aqi', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await SensorLog.find({}).sort({ recorded_at: -1 }).limit(limit);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/aqi/latest - Get latest AQI for all cities
app.get('/api/aqi/latest', async (req, res) => {
  try {
    const cities = await City.find({}).select('id name aqi status pm25 pm10 temp humidity sensors updatedAt');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/aqi/:city - Get AQI for a specific city
app.get('/api/aqi/:city', async (req, res) => {
  try {
    const cityId = req.params.city.toLowerCase();
    const cityData = await City.findOne({ id: cityId });
    if (!cityData) return res.status(404).json({ error: 'City not found' });
    res.json(cityData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/aqi - Manually Insert AQI (alternative to /api/sensor-data)
app.post('/api/aqi', async (req, res) => {
  try {
    const { city_id, pm25, pm10, co, no2, so2, o3, temperature, humidity, aqi } = req.body;
    if (!city_id || aqi === undefined) {
      return res.status(400).json({ error: 'city_id and aqi are required' });
    }
    
    const status = getAQIStatus(aqi);

    const logEntry = new SensorLog({
      city_id,
      pm25: pm25 || 0,
      pm10: pm10 || 0,
      co_ppm: co || 0,
      temperature: temperature || 0,
      humidity: humidity || 0,
      aqi,
      recorded_at: new Date()
    });
    await logEntry.save();

    const updatedCity = await City.findOneAndUpdate(
      { id: city_id },
      { 
        aqi, 
        status, 
        pm25: pm25 || 0, 
        pm10: pm10 || 0, 
        co: co || 0,
        temp: temperature || 0,
        humidity: humidity || 0,
        updatedAt: new Date() 
      },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, log: logEntry, city: updatedCity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 7. USER AUTH: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, assignedCity } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = new User({
      name,
      email,
      password, // In production, hash with bcrypt
      phone: phone || '',
      role: role || 'citizen',
      assignedCity: assignedCity || 'rajkot',
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        assignedCity: newUser.assignedCity,
        registeredAt: newUser.registeredAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. USER AUTH: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        assignedCity: user.assignedCity,
        registeredAt: user.registeredAt.toISOString(),
        lastLoginAt: user.lastLoginAt.toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server started in connectDB().then()

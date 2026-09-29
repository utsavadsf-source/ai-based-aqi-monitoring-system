import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  dht22: {
    temperature: { type: Number, required: true, default: 30.0 },
    humidity: { type: Number, required: true, default: 50.0 },
    heatIndex: { type: Number, default: 32.0 },
    status: { type: String, enum: ['optimal', 'warning', 'critical'], default: 'optimal' },
  },
  mq135: {
    airQualityPpm: { type: Number, default: 120 },
    co2Ppm: { type: Number, default: 410 },
    nh3Ppm: { type: Number, default: 12.0 },
    benzenePpm: { type: Number, default: 1.2 },
    rawAdc: { type: Number, default: 320 },
    rZero: { type: Number, default: 76.8 },
    rsRoRatio: { type: Number, default: 1.15 },
  },
  mq2: {
    smokePpm: { type: Number, default: 40 },
    lpgPpm: { type: Number, default: 18 },
    propanePpm: { type: Number, default: 15 },
    methanePpm: { type: Number, default: 22 },
    rawAdc: { type: Number, default: 215 },
    status: { type: String, enum: ['normal', 'combustible_detected', 'critical'], default: 'normal' },
  },
  mq7: {
    coPpm: { type: Number, default: 3.2 },
    rawAdc: { type: Number, default: 198 },
    safetyLevel: { type: String, enum: ['safe', 'caution', 'dangerous'], default: 'safe' },
  },
}, { _id: false });

const citySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  state: { type: String, required: true, default: 'Gujarat' },
  isGujarat: { type: Boolean, default: true },
  aqi: { type: Number, required: true, default: 50 },
  status: { 
    type: String, 
    enum: ['Good', 'Moderate', 'Unhealthy for Sensitive', 'Unhealthy', 'Very Unhealthy', 'Hazardous'],
    default: 'Moderate'
  },
  pm25: { type: Number, default: 25 },
  pm10: { type: Number, default: 50 },
  temp: { type: Number, default: 30 },
  humidity: { type: Number, default: 50 },
  windSpeed: { type: Number, default: 10 },
  windDir: { type: String, default: 'SW' },
  co: { type: Number, default: 100 },
  no2: { type: Number, default: 25 },
  o3: { type: Number, default: 35 },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  sensors: { type: sensorDataSchema, required: true },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const City = mongoose.model('City', citySchema);

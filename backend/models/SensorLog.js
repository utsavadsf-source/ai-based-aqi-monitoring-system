import mongoose from 'mongoose';

const sensorLogSchema = new mongoose.Schema({
  city_id: { type: String, required: true, index: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  mq135_adc: { type: Number, required: true },
  co2_ppm: { type: Number },
  nh3_ppm: { type: Number },
  benzene_ppm: { type: Number },
  mq2_adc: { type: Number, required: true },
  smoke_ppm: { type: Number },
  lpg_ppm: { type: Number },
  mq7_adc: { type: Number, required: true },
  co_ppm: { type: Number },
  pm25: { type: Number },
  pm10: { type: Number },
  aqi: { type: Number, required: true },
  recorded_at: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

export const SensorLog = mongoose.model('SensorLog', sensorLogSchema);

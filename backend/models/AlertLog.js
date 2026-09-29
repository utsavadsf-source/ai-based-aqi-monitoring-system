import mongoose from 'mongoose';

const alertLogSchema = new mongoose.Schema({
  city_id: { type: String, required: true },
  aqi_level: { type: Number, required: true },
  alert_type: { 
    type: String, 
    enum: ['normal', 'moderate_spike', 'severe_spike'], 
    default: 'moderate_spike' 
  },
  channel: { 
    type: String, 
    enum: ['sms', 'whatsapp', 'email'], 
    default: 'whatsapp' 
  },
  message_content: { type: String, required: true },
  dispatched_to: { type: String },
  sent_at: { type: Date, default: Date.now }
}, { timestamps: true });

export const AlertLog = mongoose.model('AlertLog', alertLogSchema);

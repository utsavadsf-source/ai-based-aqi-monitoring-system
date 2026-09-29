import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['admin', 'officer', 'citizen'], default: 'citizen' },
  assignedCity: { type: String, default: 'rajkot' },
  registeredAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

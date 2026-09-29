export interface SensorData {
  dht22: {
    temperature: number; // °C
    humidity: number; // %
    heatIndex: number; // °C
    status: 'optimal' | 'warning' | 'critical';
  };
  mq135: {
    airQualityPpm: number; // Total air quality in ppm
    co2Ppm: number; // Carbon Dioxide
    nh3Ppm: number; // Ammonia
    benzenePpm: number;
    rawAdc: number; // 0-1023
    rZero: number; // Calibration resistance
    rsRoRatio: number;
  };
  mq2: {
    smokePpm: number; // Smoke concentration
    lpgPpm: number; // Liquefied Petroleum Gas
    propanePpm: number;
    methanePpm: number;
    rawAdc: number;
    status: 'normal' | 'combustible_detected' | 'critical';
  };
  mq7: {
    coPpm: number; // Carbon Monoxide in ppm
    rawAdc: number;
    safetyLevel: 'safe' | 'caution' | 'dangerous';
  };
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  isGujarat: boolean;
  aqi: number;
  status: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number;
  pm10: number;
  temp: number;
  humidity: number;
  windSpeed: number;
  windDir: string;
  co: number;
  no2: number;
  o3: number;
  lat: number;
  lng: number;
  sensors: SensorData;
}

export interface ForecastDay {
  day: string;
  date: string;
  aqi: number;
  status: string;
  pm25: number;
  temp: number;
}

export interface PollutionSource {
  name: string;
  percentage: number;
  description: string;
  icon: string;
  color: string;
}

export interface ReportConfig {
  cityId: string;
  timeRange: '24h' | '7d' | '30d';
  sensors: {
    dht22: boolean;
    mq135: boolean;
    mq2: boolean;
    mq7: boolean;
    aqi: boolean;
    weather: boolean;
  };
  format: 'csv' | 'pdf' | 'json';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'officer' | 'citizen';
  assignedCity: string;
  registeredAt: string;
  lastLoginAt: string;
}

export interface EmailNotification {
  id: string;
  toEmail: string;
  userName: string;
  type: 'login' | 'register' | 'aqi_spike';
  subject: string;
  timestamp: string;
  dateStr: string;
  timeStr: string;
  ipAddress: string;
  device: string;
  body: string;
  isRead: boolean;
}

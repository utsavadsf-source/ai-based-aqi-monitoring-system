-- ====================================================================
-- AI-Based AQI Monitoring System - SQLite Database Schema & Seed Data
-- ====================================================================

-- 1. Cities Table
CREATE TABLE IF NOT EXISTS cities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Gujarat',
    is_gujarat INTEGER DEFAULT 1,
    aqi INTEGER NOT NULL DEFAULT 50,
    status TEXT DEFAULT 'Moderate',
    pm25 REAL DEFAULT 25.0,
    pm10 REAL DEFAULT 50.0,
    temp REAL DEFAULT 30.0,
    humidity REAL DEFAULT 50.0,
    wind_speed INTEGER DEFAULT 10,
    wind_dir TEXT DEFAULT 'SW',
    co REAL DEFAULT 100.0,
    no2 REAL DEFAULT 25.0,
    o3 REAL DEFAULT 35.0,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'citizen',
    assigned_city_id TEXT DEFAULT 'rajkot',
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_city_id) REFERENCES cities(id)
);

-- 3. Sensor Logs Table
CREATE TABLE IF NOT EXISTS sensor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_id TEXT NOT NULL,
    temperature REAL,
    humidity REAL,
    mq135_adc INTEGER,
    co2_ppm REAL,
    nh3_ppm REAL,
    benzene_ppm REAL,
    mq2_adc INTEGER,
    smoke_ppm REAL,
    lpg_ppm REAL,
    mq7_adc INTEGER,
    co_ppm REAL,
    pm25 REAL,
    pm10 REAL,
    aqi INTEGER NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- 4. Alert Logs Table
CREATE TABLE IF NOT EXISTS alert_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_id TEXT NOT NULL,
    aqi_level INTEGER NOT NULL,
    alert_type TEXT NOT NULL DEFAULT 'moderate_spike',
    channel TEXT DEFAULT 'whatsapp',
    message_content TEXT NOT NULL,
    dispatched_to TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Seed Data
INSERT OR IGNORE INTO cities 
(id, name, state, is_gujarat, aqi, status, pm25, pm10, temp, humidity, wind_speed, wind_dir, co, no2, o3, latitude, longitude)
VALUES
('rajkot', 'Rajkot', 'Gujarat', 1, 68, 'Moderate', 28.0, 85.0, 33.2, 52.4, 9, 'WSW', 110.0, 24.0, 41.0, 22.3039, 70.8022),
('ahmedabad', 'Ahmedabad', 'Gujarat', 1, 142, 'Unhealthy', 68.0, 110.0, 33.8, 62.1, 8, 'NW', 165.0, 52.0, 65.0, 23.0225, 72.5714),
('surat', 'Surat', 'Gujarat', 1, 115, 'Unhealthy for Sensitive', 48.0, 95.0, 31.5, 75.0, 12, 'SW', 140.0, 38.0, 50.0, 21.1702, 72.8311),
('vadodara', 'Vadodara', 'Gujarat', 1, 82, 'Moderate', 32.0, 72.0, 32.0, 58.0, 10, 'W', 118.0, 28.0, 42.0, 22.3072, 73.1812),
('bhavnagar', 'Bhavnagar', 'Gujarat', 1, 45, 'Good', 14.0, 42.0, 30.2, 65.0, 14, 'S', 85.0, 16.0, 30.0, 21.7645, 72.1519),
('jamnagar', 'Jamnagar', 'Gujarat', 1, 78, 'Moderate', 30.0, 68.0, 31.8, 60.0, 11, 'SW', 112.0, 25.0, 38.0, 22.4707, 70.0577),
('junagadh', 'Junagadh', 'Gujarat', 1, 38, 'Good', 11.0, 35.0, 29.5, 55.0, 8, 'SW', 75.0, 12.0, 25.0, 21.5222, 70.4579),
('gandhinagar', 'Gandhinagar', 'Gujarat', 1, 92, 'Moderate', 38.0, 80.0, 32.5, 54.0, 9, 'NNE', 125.0, 32.0, 45.0, 23.2156, 72.6369);

INSERT OR IGNORE INTO users (name, email, password_hash, phone, role, assigned_city_id) VALUES
('Rajkot Environmental Admin', 'admin@gujarat-aqi.gov.in', 'AdminPassword123!', '+919876543210', 'admin', 'rajkot'),
('Ahmedabad Nodal Officer', 'officer.ahmedabad@gujarat-aqi.gov.in', 'OfficerPassword123!', '+919876543211', 'officer', 'ahmedabad'),
('Gujarat Resident Citizen', 'citizen@gujarat.in', 'CitizenPassword123!', '+919876543212', 'citizen', 'rajkot');

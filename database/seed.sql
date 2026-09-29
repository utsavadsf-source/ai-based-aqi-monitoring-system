-- ====================================================================
-- AI-Based AQI Monitoring System - Relational Database Seed Data
-- ====================================================================

USE aqi_monitoring_db;

-- 1. Seed Gujarat Cities / Monitoring Stations
INSERT INTO cities 
(id, name, state, is_gujarat, aqi, status, pm25, pm10, temp, humidity, wind_speed, wind_dir, co, no2, o3, latitude, longitude)
VALUES
('rajkot', 'Rajkot', 'Gujarat', 1, 68, 'Moderate', 28.0, 85.0, 33.2, 52.4, 9, 'WSW', 110.0, 24.0, 41.0, 22.3039, 70.8022),
('ahmedabad', 'Ahmedabad', 'Gujarat', 1, 142, 'Unhealthy', 68.0, 110.0, 33.8, 62.1, 8, 'NW', 165.0, 52.0, 65.0, 23.0225, 72.5714),
('surat', 'Surat', 'Gujarat', 1, 115, 'Unhealthy for Sensitive', 48.0, 95.0, 31.5, 75.0, 12, 'SW', 140.0, 38.0, 50.0, 21.1702, 72.8311),
('vadodara', 'Vadodara', 'Gujarat', 1, 82, 'Moderate', 32.0, 72.0, 32.0, 58.0, 10, 'W', 118.0, 28.0, 42.0, 22.3072, 73.1812),
('bhavnagar', 'Bhavnagar', 'Gujarat', 1, 45, 'Good', 14.0, 42.0, 30.2, 65.0, 14, 'S', 85.0, 16.0, 30.0, 21.7645, 72.1519),
('jamnagar', 'Jamnagar', 'Gujarat', 1, 78, 'Moderate', 30.0, 68.0, 31.8, 60.0, 11, 'SW', 112.0, 25.0, 38.0, 22.4707, 70.0577),
('junagadh', 'Junagadh', 'Gujarat', 1, 38, 'Good', 11.0, 35.0, 29.5, 55.0, 8, 'SW', 75.0, 12.0, 25.0, 21.5222, 70.4579),
('gandhinagar', 'Gandhinagar', 'Gujarat', 1, 92, 'Moderate', 38.0, 80.0, 32.5, 54.0, 9, 'NNE', 125.0, 32.0, 45.0, 23.2156, 72.6369)
ON DUPLICATE KEY UPDATE name=VALUES(name), aqi=VALUES(aqi);

-- 2. Seed Default Administrative & Citizen Users
INSERT INTO users (name, email, password_hash, phone, role, assigned_city_id) VALUES
('Rajkot Environmental Admin', 'admin@gujarat-aqi.gov.in', 'AdminPassword123!', '+919876543210', 'admin', 'rajkot'),
('Ahmedabad Nodal Officer', 'officer.ahmedabad@gujarat-aqi.gov.in', 'OfficerPassword123!', '+919876543211', 'officer', 'ahmedabad'),
('Gujarat Resident Citizen', 'citizen@gujarat.in', 'CitizenPassword123!', '+919876543212', 'citizen', 'rajkot')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Seed Initial Telemetry Logs
INSERT INTO sensor_logs 
(city_id, temperature, humidity, mq135_adc, co2_ppm, nh3_ppm, benzene_ppm, mq2_adc, smoke_ppm, lpg_ppm, mq7_adc, co_ppm, pm25, pm10, aqi, recorded_at)
VALUES
('rajkot', 33.2, 52.4, 320, 418.0, 12.4, 1.2, 215, 42.0, 18.0, 198, 3.4, 28.0, 85.0, 68, NOW() - INTERVAL 1 HOUR),
('ahmedabad', 33.8, 62.1, 580, 560.0, 28.5, 3.8, 440, 115.0, 45.0, 380, 8.9, 68.0, 110.0, 142, NOW() - INTERVAL 2 HOUR),
('surat', 31.5, 75.0, 420, 490.0, 18.2, 2.1, 310, 78.0, 30.0, 290, 6.2, 48.0, 95.0, 115, NOW() - INTERVAL 3 HOUR);

-- 4. Seed Alert Dispatches
INSERT INTO alert_logs (city_id, aqi_level, alert_type, channel, message_content, dispatched_to, sent_at) VALUES
('ahmedabad', 142, 'severe_spike', 'whatsapp', '⚠️ HIGH AQI ALERT: Ahmedabad AQI recorded at 142. Sensitive groups advised to stay indoors.', '+919876543211', NOW() - INTERVAL 2 HOUR),
('surat', 115, 'moderate_spike', 'email', '⚠️ AQI Advisory: Surat AQI elevated to 115. Smoke and particulate matter increase detected.', 'citizen@gujarat.in', NOW() - INTERVAL 3 HOUR);

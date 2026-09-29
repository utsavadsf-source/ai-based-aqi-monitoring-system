-- ====================================================================
-- AI-Based AQI Monitoring System - Relational Database Schema (MySQL / PostgreSQL)
-- Target Database: aqi_monitoring_db
-- Support Hardware: DHT22 (Temp/Hum), MQ-135 (Air Quality/CO2), MQ-2 (Smoke/LPG), MQ-7 (CO)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS aqi_monitoring_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE aqi_monitoring_db;

-- --------------------------------------------------------------------
-- 1. Cities & Monitoring Stations Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'Gujarat',
    is_gujarat BOOLEAN DEFAULT TRUE,
    aqi INT NOT NULL DEFAULT 50,
    status VARCHAR(50) DEFAULT 'Moderate',
    pm25 DECIMAL(5,2) DEFAULT 25.0,
    pm10 DECIMAL(5,2) DEFAULT 50.0,
    temp DECIMAL(4,1) DEFAULT 30.0,
    humidity DECIMAL(4,1) DEFAULT 50.0,
    wind_speed INT DEFAULT 10,
    wind_dir VARCHAR(10) DEFAULT 'SW',
    co DECIMAL(6,2) DEFAULT 100.0,
    no2 DECIMAL(6,2) DEFAULT 25.0,
    o3 DECIMAL(6,2) DEFAULT 35.0,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 2. System Users Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'officer', 'citizen') DEFAULT 'citizen',
    assigned_city_id VARCHAR(50) DEFAULT 'rajkot',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_city_id) REFERENCES cities(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 3. Live Telemetry & Historical Sensor Logs Table (Time-Series)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sensor_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_id VARCHAR(50) NOT NULL,
    temperature DECIMAL(4,1) COMMENT 'DHT22 Temp °C',
    humidity DECIMAL(4,1) COMMENT 'DHT22 Relative Humidity %',
    mq135_adc INT COMMENT 'MQ135 Raw Analog ADC (0-1023)',
    co2_ppm DECIMAL(8,2) COMMENT 'MQ135 Calculated CO2 in ppm',
    nh3_ppm DECIMAL(6,2) COMMENT 'MQ135 Calculated Ammonia in ppm',
    benzene_ppm DECIMAL(6,2) COMMENT 'MQ135 Benzene in ppm',
    mq2_adc INT COMMENT 'MQ2 Raw Analog ADC (0-1023)',
    smoke_ppm DECIMAL(8,2) COMMENT 'MQ2 Smoke Concentration in ppm',
    lpg_ppm DECIMAL(8,2) COMMENT 'MQ2 LPG in ppm',
    mq7_adc INT COMMENT 'MQ7 Raw Analog ADC (0-1023)',
    co_ppm DECIMAL(6,2) COMMENT 'MQ7 Carbon Monoxide in ppm',
    pm25 DECIMAL(6,2),
    pm10 DECIMAL(6,2),
    aqi INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_city_time (city_id, recorded_at),
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 4. Automated Emergency AQI Spike Alerts Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alert_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_id VARCHAR(50) NOT NULL,
    aqi_level INT NOT NULL,
    alert_type ENUM('normal', 'moderate_spike', 'severe_spike') NOT NULL DEFAULT 'moderate_spike',
    channel ENUM('sms', 'whatsapp', 'email') DEFAULT 'whatsapp',
    message_content TEXT NOT NULL,
    dispatched_to VARCHAR(150),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 5. WhatsApp/SMS Alert Subscribers Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alert_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    target_city_id VARCHAR(50) DEFAULT 'rajkot',
    threshold_aqi INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

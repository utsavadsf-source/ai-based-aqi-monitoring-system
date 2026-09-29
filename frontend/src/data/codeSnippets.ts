export const PYTHON_FLASK_CODE = `"""
AI-Based AQI Monitoring System - Python Flask Backend API
Supports DHT22, MQ135, MQ2, MQ7 Sensors and MySQL Database
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import datetime
import math

app = Flask(__name__)
CORS(app)

# MySQL Database Configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'aqi_user',
    'password': 'aqi_secure_password',
    'database': 'aqi_monitoring_db',
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db_connection():
    return pymysql.connect(**DB_CONFIG)

def calculate_aqi(pm25, pm10, co_ppm, no2_ppb):
    """
    Computes EPA AQI breakpoint sub-index from sensor inputs
    """
    # Sub-index for PM2.5
    if pm25 <= 12.0:
        i_pm25 = (50 / 12.0) * pm25
    elif pm25 <= 35.4:
        i_pm25 = 51 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1)
    elif pm25 <= 55.4:
        i_pm25 = 101 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5)
    else:
        i_pm25 = 151 + ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5)

    # Sub-index for CO
    i_co = min(300, co_ppm * 10)
    
    overall_aqi = max(int(i_pm25), int(i_co))
    return overall_aqi

@app.route('/api/sensor/telemetry', methods=['POST'])
def receive_sensor_data():
    """
    Endpoint for ESP32 / Arduino / NodeMCU to post DHT22, MQ135, MQ2, MQ7 readings
    """
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON payload received'}), 400

    city_id = data.get('city_id', 'rajkot')
    temp = float(data.get('temp', 33.0))
    humidity = float(data.get('humidity', 52.0))
    mq135_adc = int(data.get('mq135_adc', 320))
    mq2_adc = int(data.get('mq2_adc', 215))
    mq7_adc = int(data.get('mq7_adc', 198))
    
    # Calculate gas ppm concentrations from ADC voltage ratios
    co2_ppm = round(400 + (mq135_adc * 0.45), 2)
    smoke_ppm = round(mq2_adc * 0.22, 2)
    co_ppm = round(mq7_adc * 0.018, 2)
    pm25 = round(15 + (smoke_ppm * 0.4), 1)
    pm10 = round(35 + (smoke_ppm * 0.9), 1)

    calculated_aqi = calculate_aqi(pm25, pm10, co_ppm, 25)

    # Save to MySQL Database
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO sensor_logs 
                (city_id, temperature, humidity, mq135_adc, co2_ppm, mq2_adc, smoke_ppm, mq7_adc, co_ppm, aqi, recorded_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                city_id, temp, humidity, mq135_adc, co2_ppm, mq2_adc, smoke_ppm, mq7_adc, co_ppm, calculated_aqi, datetime.datetime.utcnow()
            ))
            conn.commit()
    finally:
        conn.close()

    # Check for emergency spike alerts
    alert_triggered = False
    alert_message = None
    if calculated_aqi >= 100:
        alert_triggered = True
        alert_message = f"HIGH AQI SPIKE ALERT: {city_id.upper()} AQI reached {calculated_aqi}! Advise masks."

    return jsonify({
        'status': 'success',
        'city_id': city_id,
        'calculated_aqi': calculated_aqi,
        'alert_triggered': alert_triggered,
        'alert_message': alert_message
    })

@app.route('/api/live/<city_id>', methods=['GET'])
def get_live_city(city_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM sensor_logs WHERE city_id = %s ORDER BY id DESC LIMIT 1", (city_id,))
            record = cursor.fetchone()
            return jsonify(record or {'status': 'no_data'})
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
`;

export const NODEJS_EXPRESS_CODE = `/**
 * AI-Based AQI Monitoring System - Node.js Express Backend API
 * Supports WebSocket live streaming and MySQL connection pool
 */

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'aqi_user',
  password: process.env.DB_PASSWORD || 'aqi_password',
  database: process.env.DB_NAME || 'aqi_monitoring_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Telemetry POST endpoint for DHT22, MQ135, MQ2, MQ7
app.post('/api/telemetry', async (req, res) => {
  try {
    const { city_id, temp, humidity, mq135_adc, mq2_adc, mq7_adc } = req.body;
    
    // Convert ADC to gas concentrations
    const co2_ppm = 400 + (mq135_adc * 0.45);
    const smoke_ppm = mq2_adc * 0.22;
    const co_ppm = mq7_adc * 0.018;
    const aqi = Math.round(50 + (smoke_ppm * 0.7) + (co_ppm * 2.5));

    const [result] = await pool.execute(
      \`INSERT INTO sensor_logs 
       (city_id, temperature, humidity, mq135_adc, co2_ppm, mq2_adc, smoke_ppm, mq7_adc, co_ppm, aqi, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())\`,
      [city_id || 'rajkot', temp, humidity, mq135_adc, co2_ppm, mq2_adc, smoke_ppm, mq7_adc, co_ppm, aqi]
    );

    res.json({
      success: true,
      log_id: result.insertId,
      aqi,
      status: aqi > 100 ? 'Unhealthy' : 'Moderate'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Historical query for report downloads
app.get('/api/reports/history', async (req, res) => {
  const { city_id = 'rajkot', limit = 100 } = req.query;
  const [rows] = await pool.execute(
    'SELECT * FROM sensor_logs WHERE city_id = ? ORDER BY id DESC LIMIT ?',
    [city_id, parseInt(limit)]
  );
  res.json(rows);
});

app.listen(3000, () => console.log('Node.js AQI API server running on port 3000'));
`;

export const MYSQL_SCHEMA_CODE = `-- ==========================================================
-- MySQL Database Schema: aqi_monitoring_db
-- Designed for AI-Based AQI Monitoring System
-- Includes sensors: DHT22, MQ-135, MQ-2, MQ-7
-- ==========================================================

CREATE DATABASE IF NOT EXISTS aqi_monitoring_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE aqi_monitoring_db;

-- 1. Cities and Monitoring Stations Table
CREATE TABLE IF NOT EXISTS monitoring_stations (
    station_id VARCHAR(50) PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    state VARCHAR(50) DEFAULT 'Gujarat',
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    hardware_chip VARCHAR(50) DEFAULT 'ESP32-NodeMCU',
    status ENUM('active', 'offline', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Stations (Rajkot, Ahmedabad, Surat, etc.)
INSERT INTO monitoring_stations (station_id, city_name, state, latitude, longitude) VALUES
('rajkot-main', 'Rajkot', 'Gujarat', 22.3039, 70.8022),
('ahmedabad-center', 'Ahmedabad', 'Gujarat', 23.0225, 72.5714),
('surat-ringroad', 'Surat', 'Gujarat', 21.1702, 72.8311),
('vadodara-alkapuri', 'Vadodara', 'Gujarat', 22.3072, 73.1812),
('bhavnagar-port', 'Bhavnagar', 'Gujarat', 21.7645, 72.1519),
('jamnagar-gandhinagar', 'Jamnagar', 'Gujarat', 22.4707, 70.0577),
('junagadh-girnar', 'Junagadh', 'Gujarat', 21.5222, 70.4579),
('gandhinagar-sec10', 'Gandhinagar', 'Gujarat', 23.2156, 72.6369)
ON DUPLICATE KEY UPDATE city_name=VALUES(city_name);

-- 2. Real-Time Sensor Telemetry Table
CREATE TABLE IF NOT EXISTS sensor_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_id VARCHAR(50) NOT NULL,
    temperature DECIMAL(5, 2) COMMENT 'DHT22 Temp in °C',
    humidity DECIMAL(5, 2) COMMENT 'DHT22 Humidity in %',
    mq135_adc INT COMMENT 'MQ135 Raw Analog ADC (0-1023)',
    co2_ppm DECIMAL(8, 2) COMMENT 'Calculated CO2 / Air Quality in ppm',
    mq2_adc INT COMMENT 'MQ2 Raw Analog ADC (0-1023)',
    smoke_ppm DECIMAL(8, 2) COMMENT 'Calculated Smoke / LPG in ppm',
    mq7_adc INT COMMENT 'MQ7 Raw Analog ADC (0-1023)',
    co_ppm DECIMAL(8, 2) COMMENT 'Carbon Monoxide in ppm',
    pm25 DECIMAL(6, 2),
    pm10 DECIMAL(6, 2),
    aqi INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_city_time (city_id, recorded_at)
);

-- 3. Automated AQI Spike Alerts Table
CREATE TABLE IF NOT EXISTS alert_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_id VARCHAR(50) NOT NULL,
    aqi_level INT NOT NULL,
    alert_type ENUM('normal', 'moderate_spike', 'severe_spike') NOT NULL,
    channel ENUM('sms', 'whatsapp', 'email') DEFAULT 'whatsapp',
    message_content TEXT,
    dispatched_to VARCHAR(100),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. User Subscriptions for WhatsApp/SMS Alerts
CREATE TABLE IF NOT EXISTS alert_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_or_whatsapp VARCHAR(20) NOT NULL UNIQUE,
    target_city VARCHAR(50) DEFAULT 'rajkot',
    threshold_aqi INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

export const ESP32_ARDUINO_CODE = `/**
 * ESP32 / Arduino Source Code
 * AI-Based AQI Monitoring Station (Rajkot Node)
 * Sensors: DHT22 (Temp & Hum), MQ-135 (Air Quality), MQ-2 (Smoke/LPG), MQ-7 (CO)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// WiFi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server API Endpoint (Flask or Node.js)
const char* serverUrl = "http://192.168.1.100:5000/api/sensor/telemetry";

// Pin Definitions
#define DHTPIN 4
#define DHTTYPE DHT22
#define MQ135_PIN 34 // ADC1 channel
#define MQ2_PIN 35   // ADC1 channel
#define MQ7_PIN 32   // ADC1 channel

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  dht.begin();
  pinMode(MQ135_PIN, INPUT);
  pinMode(MQ2_PIN, INPUT);
  pinMode(MQ7_PIN, INPUT);

  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected! IP Address: " + WiFi.localIP().toString());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // 1. Read DHT22
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    // 2. Read Gas Sensors ADC
    int mq135_adc = analogRead(MQ135_PIN);
    int mq2_adc = analogRead(MQ2_PIN);
    int mq7_adc = analogRead(MQ7_PIN);

    // Validate sensor reading
    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Failed to read from DHT22 sensor!");
      temperature = 33.0;
      humidity = 52.0;
    }

    // Build JSON payload
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{";
    jsonPayload += "\\"city_id\\":\\"rajkot\\",";
    jsonPayload += "\\"temp\\":" + String(temperature, 1) + ",";
    jsonPayload += "\\"humidity\\":" + String(humidity, 1) + ",";
    jsonPayload += "\\"mq135_adc\\":" + String(mq135_adc) + ",";
    jsonPayload += "\\"mq2_adc\\":" + String(mq2_adc) + ",";
    jsonPayload += "\\"mq7_adc\\":" + String(mq7_adc);
    jsonPayload += "}";

    Serial.println("Posting Payload: " + jsonPayload);
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Server Response: " + response);
    } else {
      Serial.print("Error in HTTP POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }

  // Sample every 5 seconds
  delay(5000);
}
`;

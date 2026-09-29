# 🗄️ Database Documentation & Setup Guide
## AI-Based AQI Monitoring System

This project supports **MongoDB** (NoSQL - default for Node.js Express server) as well as **MySQL / PostgreSQL / SQLite** (Relational SQL databases) for storing real-time environmental IoT telemetry, municipal monitoring station data, user profiles, and emergency alert logs.

---

## 📐 Database Architecture & Models

### 1. `City` / `monitoring_stations`
Stores municipal sensor node metadata and live air quality metrics.
* **Fields:** `id`, `name`, `state`, `aqi`, `status`, `pm25`, `pm10`, `temp`, `humidity`, `co`, `no2`, `o3`, `lat`, `lng`, `sensors` (nested DHT22, MQ135, MQ2, MQ7 readings).

### 2. `SensorLog` / `sensor_logs` (Time-Series Telemetry)
Stores high-frequency sensor readings sent by ESP32 / Arduino hardware nodes.
* **Fields:** `city_id`, `temperature` (DHT22), `humidity` (DHT22), `mq135_adc`, `co2_ppm`, `nh3_ppm`, `benzene_ppm`, `mq2_adc`, `smoke_ppm`, `lpg_ppm`, `mq7_adc`, `co_ppm`, `pm25`, `pm10`, `aqi`, `recorded_at`.

### 3. `User` / `users`
Manages system authentication and role-based permissions (Admin, Environmental Officer, Citizen).
* **Fields:** `name`, `email`, `password`, `phone`, `role`, `assignedCity`, `registeredAt`, `lastLoginAt`.

### 4. `AlertLog` / `alert_logs`
Tracks automated emergency spike alerts dispatched via WhatsApp, SMS, or Email.
* **Fields:** `city_id`, `aqi_level`, `alert_type` (`normal`, `moderate_spike`, `severe_spike`), `channel`, `message_content`, `dispatched_to`, `sent_at`.

---

## 🚀 Quick Setup Instructions

### Option 1: MongoDB Setup (Recommended for Node.js backend)

1. Start your local MongoDB server (or use MongoDB Atlas connection string):
   ```bash
   mongod
   ```
2. Configure `.env` file with your MongoDB URI (optional, defaults to `mongodb://127.0.0.1:27017/aqi_monitoring_db`):
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/aqi_monitoring_db
   PORT=5000
   ```
3. Populate the database with initial cities, users, and 24h telemetry logs:
   ```bash
   npm run seed
   ```
4. Start the API server:
   ```bash
   npm run server
   ```

---

### Option 2: MySQL / MariaDB Setup

If you prefer a MySQL database:
1. Open your MySQL terminal or Workbench:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```
2. The schema file [`database/schema.sql`](file:///c:/Users/User/Downloads/ai-based-aqi-monitoring-system/database/schema.sql) will create the `aqi_monitoring_db` database and all required tables with proper indexes.

---

### Option 3: SQLite Zero-Config Setup

For a zero-configuration local file database:
```bash
sqlite3 aqi_monitoring.db < database/schema_sqlite.sql
```

---

## 📡 Hardware / IoT Telemetry Intake API

Hardware nodes (ESP32 / Arduino / Raspberry Pi) post JSON payloads to the database via:

* **Endpoint:** `POST http://localhost:5000/api/sensor-data`
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "city_id": "rajkot",
  "temp": 33.2,
  "humidity": 52.4,
  "mq135_adc": 320,
  "mq2_adc": 215,
  "mq7_adc": 198
}
```

---

## 🔑 Default Seeded Demo Accounts

| Role | Email | Password | Assigned City |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gujarat-aqi.gov.in` | `AdminPassword123!` | Rajkot |
| **Officer** | `officer.ahmedabad@gujarat-aqi.gov.in` | `OfficerPassword123!` | Ahmedabad |
| **Citizen** | `citizen@gujarat.in` | `CitizenPassword123!` | Rajkot |

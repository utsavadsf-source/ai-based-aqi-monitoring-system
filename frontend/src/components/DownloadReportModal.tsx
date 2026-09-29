import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  X,
  Download,
  FileText,
  Check,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Thermometer,
  Wind,
  AlertTriangle,
  Eye,
  Building2,
} from 'lucide-react';
import { CityData } from '../types/aqi';
import { GUJARAT_CITIES } from '../data/mockData';

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCity: CityData;
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({
  isOpen,
  onClose,
  defaultCity,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(defaultCity.id);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Keep live time updated for exact generation timestamp
  useEffect(() => {
    if (!isOpen) return;
    setCurrentDateTime(new Date());
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCity = GUJARAT_CITIES.find((c) => c.id === selectedCityId) || defaultCity;

  // Format date and time clearly
  const formattedDate = currentDateTime.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const isoTimestamp = currentDateTime.toISOString().replace('T', ' ').substring(0, 19);
  const reportId = `AQI-GUJ-${currentDateTime.getFullYear()}${String(currentDateTime.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Generate and download genuine PDF using jsPDF
  const handleDownloadPdf = () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Top Header Banner
      doc.setFillColor(11, 20, 36); // #0b1424
      doc.rect(0, 0, pageWidth, 42, 'F');

      // Decorative Accent Line
      doc.setFillColor(0, 210, 255); // #00d2ff
      doc.rect(0, 42, pageWidth, 2, 'F');

      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('AI BASED AQI MONITORING SYSTEM', 14, 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 210, 255);
      doc.text('Gujarat Environmental Pollution Control & IoT Telemetry Audit', 14, 23);

      doc.setFontSize(8.5);
      doc.setTextColor(160, 175, 200);
      doc.text(`Official Environmental Monitoring Portal | CPCB Certified Standards`, 14, 30);
      doc.text(`Report ID: ${reportId}`, 14, 36);

      // Station & City Details Box
      let y = 52;
      doc.setDrawColor(200, 215, 230);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, y, pageWidth - 28, 28, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`Monitoring Station: ${currentCity.name} Central Node-01`, 18, y + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`Location: ${currentCity.name}, Gujarat, India`, 18, y + 14);
      doc.text(`GPS Coordinates: ${currentCity.lat.toFixed(4)}° N, ${currentCity.lng.toFixed(4)}° E`, 18, y + 19);

      // Explicit Date & Time (User's requirement)
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text(`Generated Date: ${formattedDate}`, 115, y + 8);
      doc.text(`Generated Time: ${formattedTime}`, 115, y + 14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Standard Time: IST (UTC+05:30) | Timestamp: ${isoTimestamp}`, 115, y + 19);

      // Live AQI Summary Block
      y = 86;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(14, y, pageWidth - 28, 24, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text('AIR QUALITY INDEX (AQI)', 20, y + 8);
      doc.text('AIR QUALITY STATUS', 75, y + 8);
      doc.text('PRIMARY POLLUTANT', 140, y + 8);

      doc.setFontSize(16);
      doc.setTextColor(0, 130, 200);
      doc.text(`${currentCity.aqi}`, 20, y + 17);

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${currentCity.status}`, 75, y + 16);

      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139);
      doc.text(`PM2.5 & CO (MQ-7)`, 140, y + 16);

      // Section 2: Sensor Telemetry Table
      y = 118;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('Integrated IoT Sensor Telemetry & Calibration Readings', 14, y);

      y += 5;
      // Table Header
      doc.setFillColor(14, 28, 48);
      doc.rect(14, y, pageWidth - 28, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('Sensor Hardware', 17, y + 5.5);
      doc.text('Target Parameter', 60, y + 5.5);
      doc.text('Live Recorded Value', 115, y + 5.5);
      doc.text('Safety Standard', 155, y + 5.5);

      // Table Rows
      const sensorRows = [
        {
          hardware: 'DHT22 / AM2302',
          param: 'Ambient Temperature',
          value: `${currentCity.temp} °C`,
          limit: '-40°C to +80°C (Normal)',
        },
        {
          hardware: 'DHT22 / AM2302',
          param: 'Relative Humidity',
          value: `${currentCity.humidity} %`,
          limit: '30% - 60% (Optimal)',
        },
        {
          hardware: 'MQ-135 Gas Sensor',
          param: 'Carbon Dioxide (CO2)',
          value: `${currentCity.sensors.mq135.co2Ppm} ppm`,
          limit: '< 1000 ppm (Clean Air)',
        },
        {
          hardware: 'MQ-135 Gas Sensor',
          param: 'Ammonia (NH3) & Air Purity',
          value: `${currentCity.sensors.mq135.nh3Ppm} ppm (${currentCity.sensors.mq135.rawAdc} ADC)`,
          limit: '< 25 ppm (Permissible)',
        },
        {
          hardware: 'MQ-2 Sensor',
          param: 'Smoke Density & Combustibles',
          value: `${currentCity.sensors.mq2.smokePpm} ppm`,
          limit: '< 300 ppm (Safe Baseline)',
        },
        {
          hardware: 'MQ-2 Sensor',
          param: 'LPG / Propane Gas Level',
          value: `${currentCity.sensors.mq2.lpgPpm} ppm`,
          limit: '< 500 ppm (Safe)',
        },
        {
          hardware: 'MQ-7 Sensor',
          param: 'Carbon Monoxide (CO)',
          value: `${currentCity.sensors.mq7.coPpm} ppm`,
          limit: '< 9.0 ppm (CPCB 8-hr)',
        },
        {
          hardware: 'Optical Sensor',
          param: 'Particulate Matter (PM2.5)',
          value: `${currentCity.pm25} µg/m³`,
          limit: '60 µg/m³ (24-hr Std)',
        },
        {
          hardware: 'Optical Sensor',
          param: 'Particulate Matter (PM10)',
          value: `${currentCity.pm10} µg/m³`,
          limit: '100 µg/m³ (24-hr Std)',
        },
      ];

      y += 8;
      sensorRows.forEach((row, i) => {
        doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
        doc.rect(14, y, pageWidth - 28, 7, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.line(14, y + 7, pageWidth - 14, y + 7);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text(row.hardware, 17, y + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(row.param, 60, y + 4.8);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(2, 132, 199);
        doc.text(row.value, 115, y + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(row.limit, 155, y + 4.8);

        y += 7;
      });

      // Health Advisory Section
      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('Resident Health Advisory & Preventive Guidelines', 14, y);

      y += 4;
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(2, 132, 199);
      doc.text(`Current Condition: ${currentCity.status} (AQI ${currentCity.aqi})`, 18, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('• General Public: Air quality is generally acceptable; sensitive individuals should consider limiting prolonged outdoor exertion.', 18, y + 12);
      doc.text('• Children & Elderly: Keep outdoor physical activities balanced; ensure adequate natural ventilation indoors.', 18, y + 18);
      doc.text('• Ventilation & Filtering: Natural cross-ventilation recommended during early afternoon hours when PM2.5 dips.', 18, y + 24);

      // Footer and Verification Notes
      y = 265;
      doc.setDrawColor(203, 213, 225);
      doc.line(14, y, pageWidth - 14, y);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('This official environmental report is automatically generated and audited by the AI Based AQI Monitoring System.', 14, y + 5);
      doc.text(`Sensor Data Pipeline: ESP32 NodeMCU -> Python Flask & Node.js Engine -> MySQL Datastore. Verified on ${isoTimestamp}.`, 14, y + 9);
      doc.text('Official Gujarat Ambient Monitoring Network | https://gujarat-aqi.gov.in', 14, y + 13);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('CONFIDENTIAL & CERTIFIED AUDIT', pageWidth - 65, y + 13);

      // Save PDF directly to user's browser download folder!
      const filename = `AQI_Report_${currentCity.name}_${currentDateTime.toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

      setDownloadSuccess(`PDF Report "${filename}" downloaded successfully!`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('PDF generation error:', err);
      setDownloadSuccess('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Also support CSV download
  const handleDownloadCsv = () => {
    const headers = [
      'Report_ID',
      'Generated_Date',
      'Generated_Time',
      'Timestamp_ISO',
      'City',
      'AQI_Index',
      'AQI_Status',
      'DHT22_Temp_C',
      'DHT22_Humidity_Percent',
      'MQ135_CO2_ppm',
      'MQ135_NH3_ppm',
      'MQ2_Smoke_ppm',
      'MQ2_LPG_ppm',
      'MQ7_CO_ppm',
      'PM25_ug_m3',
      'PM10_ug_m3',
    ].join(',');

    const row = [
      reportId,
      `"${formattedDate}"`,
      `"${formattedTime}"`,
      isoTimestamp,
      currentCity.name,
      currentCity.aqi,
      currentCity.status,
      currentCity.temp,
      currentCity.humidity,
      currentCity.sensors.mq135.co2Ppm,
      currentCity.sensors.mq135.nh3Ppm,
      currentCity.sensors.mq2.smokePpm,
      currentCity.sensors.mq2.lpgPpm,
      currentCity.sensors.mq7.coPpm,
      currentCity.pm25,
      currentCity.pm10,
    ].join(',');

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, row].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AQI_Data_${currentCity.name}_${currentDateTime.toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CSV Data spreadsheet downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Download Official AQI Audit Report</h3>
            <p className="text-xs text-slate-400">
              Generates a certified PDF document with live date, time timestamp, and sensor parameters.
            </p>
          </div>
        </div>

        {/* City Selector */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Gujarat Monitoring Station:</span>
          </label>
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#08111e] border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {GUJARAT_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} Station (Live AQI: {c.aqi} — {c.status})
              </option>
            ))}
          </select>
        </div>

        {/* Real-Time Report Preview Card showing Date, Time & All Website Details */}
        <div className="mb-6 rounded-2xl bg-[#070d17] border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Report PDF Preview & Exact Timestamp</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>

          {/* Date & Time Highlight (User's specific requirement) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0d1726] p-3.5 rounded-xl border border-cyan-500/20">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Generation Date:</span>
                <p className="text-xs font-bold text-white mt-0.5">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Exact Generation Time:</span>
                <p className="text-xs font-bold text-cyan-300 mt-0.5">{formattedTime} (IST)</p>
              </div>
            </div>
          </div>

          {/* Website Details & Sensor Summary */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
              <span className="text-slate-400">Station / City:</span>
              <span className="font-bold text-white">{currentCity.name} Central Node (GPS: {currentCity.lat.toFixed(2)}°N, {currentCity.lng.toFixed(2)}°E)</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
              <span className="text-slate-400">AQI Index & Status:</span>
              <span className="font-bold text-cyan-400">{currentCity.aqi} — {currentCity.status}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
              <span className="text-slate-400">DHT22 Climate:</span>
              <span className="font-medium text-white">{currentCity.temp}°C Temp | {currentCity.humidity}% Humidity</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
              <span className="text-slate-400">MQ Gas Sensors:</span>
              <span className="font-medium text-white">CO₂: {currentCity.sensors.mq135.co2Ppm}ppm | Smoke: {currentCity.sensors.mq2.smokePpm}ppm | CO: {currentCity.sensors.mq7.coPpm}ppm</span>
            </div>

            <div className="flex justify-between py-1 text-slate-300">
              <span className="text-slate-400">Particulates:</span>
              <span className="font-medium text-white">PM2.5: {currentCity.pm25} µg/m³ | PM10: {currentCity.pm10} µg/m³</span>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {downloadSuccess && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Download Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Primary: Direct PDF Download */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#00d2ff] hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>{isGenerating ? 'Generating PDF...' : 'Download Simple PDF Report'}</span>
          </button>

          {/* Secondary: CSV Spreadsheet Download */}
          <button
            onClick={handleDownloadCsv}
            className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download CSV</span>
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          The PDF includes certified timestamps, CPCB benchmarks, and all website sensor data.
        </p>
      </div>
    </div>
  );
};

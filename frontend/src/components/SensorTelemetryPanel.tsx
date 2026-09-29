import React, { useState } from 'react';
import { Cpu, Wind, Thermometer, Droplets, Flame, AlertCircle, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { CityData, SensorData } from '../types/aqi';

interface SensorTelemetryPanelProps {
  selectedCity: CityData;
  onUpdateSensors: (updated: SensorData) => void;
  onOpenCodeModal: () => void;
}

export const SensorTelemetryPanel: React.FC<SensorTelemetryPanelProps> = ({
  selectedCity,
  onUpdateSensors,
}) => {
  const [showSimulate, setShowSimulate] = useState(false);
  const sensors = selectedCity.sensors;

  const handleSliderChange = (sensorName: string, param: string, value: number) => {
    const updated: SensorData = JSON.parse(JSON.stringify(sensors));
    if (sensorName === 'dht22') {
      if (param === 'temperature') updated.dht22.temperature = value;
      if (param === 'humidity') updated.dht22.humidity = value;
    } else if (sensorName === 'mq135') {
      if (param === 'rawAdc') {
        updated.mq135.rawAdc = value;
        updated.mq135.co2Ppm = Math.round(400 + value * 0.45);
        updated.mq135.airQualityPpm = Math.round(value * 0.4);
      }
    } else if (sensorName === 'mq2') {
      if (param === 'smokePpm') {
        updated.mq2.smokePpm = value;
        updated.mq2.rawAdc = Math.round(value * 4.5);
      }
    } else if (sensorName === 'mq7') {
      if (param === 'coPpm') {
        updated.mq7.coPpm = value;
        updated.mq7.rawAdc = Math.round(value * 40);
      }
    }
    onUpdateSensors(updated);
  };

  return (
    <section id="sensors" className="py-16 bg-[#080e1a] border-y border-[#142337] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple & Professional Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102035] border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>IoT Sensor Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Calibrated Sensor Telemetry ({selectedCity.name})
            </h2>
            <p className="mt-1 text-slate-400 text-sm max-w-xl">
              Continuous environmental telemetry transmitted by on-field DHT22, MQ-135, MQ-2, and MQ-7 sensor units.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSimulate(!showSimulate)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#121f33] hover:bg-[#182a44] text-slate-300 hover:text-white border border-[#1e3452] transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showSimulate ? 'Hide Test Controls' : 'Test Sensor Inputs'}</span>
            </button>
          </div>
        </div>

        {/* Optional Test Slider Bar (Simple & Clean) */}
        {showSimulate && (
          <div className="mb-8 p-5 rounded-2xl bg-[#0d1726] border border-cyan-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Interactive Sensor Test Controls
              </span>
              <span className="text-[11px] text-slate-400">Move sliders to test live telemetry response</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>DHT22 Temp:</span>
                  <span className="text-cyan-400 font-bold">{sensors.dht22.temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="48"
                  step="0.5"
                  value={sensors.dht22.temperature}
                  onChange={(e) => handleSliderChange('dht22', 'temperature', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>MQ-135 CO₂:</span>
                  <span className="text-cyan-400 font-bold">{sensors.mq135.co2Ppm} ppm</span>
                </div>
                <input
                  type="range"
                  min="380"
                  max="850"
                  value={sensors.mq135.rawAdc}
                  onChange={(e) => handleSliderChange('mq135', 'rawAdc', parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>MQ-2 Smoke:</span>
                  <span className="text-emerald-400 font-bold">{sensors.mq2.smokePpm} ppm</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="250"
                  value={sensors.mq2.smokePpm}
                  onChange={(e) => handleSliderChange('mq2', 'smokePpm', parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>MQ-7 CO:</span>
                  <span className="text-amber-400 font-bold">{sensors.mq7.coPpm} ppm</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.5"
                  value={sensors.mq7.coPpm}
                  onChange={(e) => handleSliderChange('mq7', 'coPpm', parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4 Clean, Professional Sensor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. DHT22 */}
          <div className="bg-[#0b1424] rounded-2xl p-6 border border-[#16273f] hover:border-cyan-500/40 transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">DHT22 Sensor</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Optimal
                </span>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Temperature & Humidity</h3>
                  <p className="text-xs text-slate-400">Climate Monitoring</p>
                </div>
              </div>

              <div className="space-y-3 py-2 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Temperature</span>
                  <span className="text-base font-bold text-white">{sensors.dht22.temperature}°C</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Relative Humidity</span>
                  <span className="text-base font-bold text-cyan-400">{sensors.dht22.humidity}%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Heat Index: {sensors.dht22.heatIndex}°C</span>
              <span className="text-slate-500">±0.5°C Prec.</span>
            </div>
          </div>

          {/* 2. MQ-135 */}
          <div className="bg-[#0b1424] rounded-2xl p-6 border border-[#16273f] hover:border-emerald-500/40 transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">MQ-135 Sensor</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Normal
                </span>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Air Quality & Gases</h3>
                  <p className="text-xs text-slate-400">Hazardous Contaminants</p>
                </div>
              </div>

              <div className="space-y-3 py-2 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Carbon Dioxide (CO₂)</span>
                  <span className="text-base font-bold text-white">{sensors.mq135.co2Ppm} ppm</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Ammonia (NH₃)</span>
                  <span className="text-base font-bold text-emerald-400">{sensors.mq135.nh3Ppm} ppm</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Status: Clean Baseline</span>
              <span className="text-slate-500">Calibrated</span>
            </div>
          </div>

          {/* 3. MQ-2 */}
          <div className="bg-[#0b1424] rounded-2xl p-6 border border-[#16273f] hover:border-amber-500/40 transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">MQ-2 Sensor</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Safe
                </span>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Smoke & Combustibles</h3>
                  <p className="text-xs text-slate-400">LPG & Industrial Smoke</p>
                </div>
              </div>

              <div className="space-y-3 py-2 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Smoke Density</span>
                  <span className="text-base font-bold text-white">{sensors.mq2.smokePpm} ppm</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">LPG / Propane</span>
                  <span className="text-base font-bold text-amber-400">{sensors.mq2.lpgPpm} ppm</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Threshold: Safe</span>
              <span className="text-slate-500">&lt;300 ppm</span>
            </div>
          </div>

          {/* 4. MQ-7 */}
          <div className="bg-[#0b1424] rounded-2xl p-6 border border-[#16273f] hover:border-rose-500/40 transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">MQ-7 Sensor</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Safe
                </span>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Carbon Monoxide</h3>
                  <p className="text-xs text-slate-400">Toxic Gas Detection</p>
                </div>
              </div>

              <div className="space-y-3 py-2 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Carbon Monoxide (CO)</span>
                  <span className="text-base font-bold text-white">{sensors.mq7.coPpm} ppm</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Safety Classification</span>
                  <span className="text-xs font-bold text-emerald-400 uppercase bg-emerald-950/80 px-2 py-0.5 rounded">
                    {sensors.mq7.safetyLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>OSHA Standard: &lt;9 ppm</span>
              <span className="text-slate-500">Dual 5V/1.4V</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

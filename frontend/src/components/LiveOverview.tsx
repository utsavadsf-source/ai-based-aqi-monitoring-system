import React from 'react';
import { CloudFog, Wind, Cloud, Flame, Radio, Zap } from 'lucide-react';
import { CityData } from '../types/aqi';

interface LiveOverviewProps {
  selectedCity: CityData;
  onOpenSensorsClick: () => void;
}

export const LiveOverview: React.FC<LiveOverviewProps> = ({
  selectedCity,
  onOpenSensorsClick,
}) => {
  return (
    <section id="live-aqi" className="py-16 bg-[#060b13] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102035] border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <span>🌍</span>
            <span>Real-Time Air Quality</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Live AQI Overview ({selectedCity.name})
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Monitor real-time pollution levels and environmental conditions powered by Artificial Intelligence
            and live meteorological data streams.
          </p>

          {/* IoT Telemetry status pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d1c2e] border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>DHT22 + MQ135 + MQ2 + MQ7 Sensors Streaming Live</span>
            <button
              onClick={onOpenSensorsClick}
              className="ml-2 underline hover:text-white cursor-pointer font-sans font-bold"
            >
              Inspect Telemetry →
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: AQI Index */}
          <div className="bg-[#0b1424] rounded-2xl p-6 border border-[#16273f] hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg">
            {/* Top Right Decorative Arc Glow */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#132742] opacity-80 pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <CloudFog className="w-6 h-6" />
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AQI Index</div>
            <div className="text-4xl font-black text-white mt-1 tracking-tight">{selectedCity.aqi}</div>
            <div className="text-xs font-semibold text-cyan-400 mt-1">
              {selectedCity.status} ({selectedCity.name})
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#111f32] h-2 rounded-full mt-6 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (selectedCity.aqi / 300) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 2: PM2.5 */}
          <div className="bg-[#0b1424] rounded-2xl p-6 border border-[#16273f] hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#132742] opacity-80 pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Wind className="w-6 h-6" />
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PM2.5</div>
            <div className="text-4xl font-black text-white mt-1 tracking-tight">{selectedCity.pm25}</div>
            <div className="text-xs font-semibold text-emerald-400 mt-1">Fine Particles (µg/m³)</div>

            {/* Progress Bar */}
            <div className="w-full bg-[#111f32] h-2 rounded-full mt-6 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (selectedCity.pm25 / 150) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 3: PM10 */}
          <div className="bg-[#0b1424] rounded-2xl p-6 border border-[#16273f] hover:border-teal-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#132742] opacity-80 pointer-events-none group-hover:bg-teal-500/20 transition-all" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Cloud className="w-6 h-6" />
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PM10</div>
            <div className="text-4xl font-black text-white mt-1 tracking-tight">{selectedCity.pm10}</div>
            <div className="text-xs font-semibold text-teal-400 mt-1">Coarse Dust (µg/m³)</div>

            {/* Progress Bar */}
            <div className="w-full bg-[#111f32] h-2 rounded-full mt-6 overflow-hidden">
              <div
                className="bg-teal-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (selectedCity.pm10 / 250) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 4: Carbon Monoxide (CO) */}
          <div className="bg-[#0b1424] rounded-2xl p-6 border border-[#16273f] hover:border-green-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#132742] opacity-80 pointer-events-none group-hover:bg-green-500/20 transition-all" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Flame className="w-6 h-6" />
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Carbon Monoxide (CO)</div>
            <div className="text-4xl font-black text-white mt-1 tracking-tight">{selectedCity.co}</div>
            <div className="text-xs font-semibold text-cyan-300 mt-1">Combustion Gas (ppm)</div>

            {/* Progress Bar */}
            <div className="w-full bg-[#111f32] h-2 rounded-full mt-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (selectedCity.co / 300) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

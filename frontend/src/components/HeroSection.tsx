import React from 'react';
import { Activity, LayoutGrid, Thermometer, Droplets, Wind, Sparkles } from 'lucide-react';
import { CityData } from '../types/aqi';

interface HeroSectionProps {
  selectedCity: CityData;
  onExploreClick: () => void;
  onLiveClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCity,
  onExploreClick,
  onLiveClick,
}) => {
  // Calculate stroke dash for SVG circle
  const maxAqi = 300;
  const percentage = Math.min(100, Math.round((selectedCity.aqi / maxAqi) * 100));
  const circumference = 2 * Math.PI * 68; // r=68
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  // Status color badge
  const getStatusColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981'; // Green
    if (aqi <= 100) return '#00d2ff'; // Cyan
    if (aqi <= 150) return '#f59e0b'; // Amber
    if (aqi <= 200) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const statusColor = getStatusColor(selectedCity.aqi);

  return (
    <section id="home" className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#060b13] via-[#091220] to-[#060b13]">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#112136] border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
              <span className="text-sm">🌍</span>
              <span>AI Based AQI Monitoring System</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Monitor Air Quality <br />
              <span className="bg-gradient-to-r from-[#00d2ff] via-cyan-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
                with Artificial Intelligence
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Get real-time Air Quality Index (AQI) for <strong className="text-cyan-300 font-semibold">{selectedCity.name}</strong>, weather updates,
              pollution analytics, AI-powered predictions, and personalized health recommendations for your city.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLiveClick}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#00d2ff] hover:bg-cyan-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/35 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>View Live AQI</span>
              </button>

              <button
                onClick={onExploreClick}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-transparent hover:bg-slate-800/80 text-cyan-400 border border-cyan-500/40 font-semibold text-sm transition-all cursor-pointer hover:border-cyan-400"
              >
                <LayoutGrid className="w-4 h-4 text-cyan-400" />
                <span>Explore Dashboard</span>
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/70 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">150+</div>
                <div className="text-xs font-medium text-slate-400 mt-0.5">Gujarat Stations</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#00d2ff]">24/7</div>
                <div className="text-xs font-medium text-slate-400 mt-0.5">IoT Streaming</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">99%</div>
                <div className="text-xs font-medium text-slate-400 mt-0.5">Prediction Precision</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visual Gauge Card */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Ambient behind gauge */}
            <div className="relative w-full max-w-md">
              {/* Floating Weather Pill: Temp (Top Left) */}
              <div className="absolute -top-4 -left-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0f1a2e]/90 backdrop-blur-md border border-cyan-500/30 shadow-xl shadow-black/50 animate-bounce-gentle">
                <Thermometer className="w-4 h-4 text-pink-400" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Temp</div>
                  <div className="text-sm font-bold text-cyan-400">{selectedCity.temp}°C</div>
                </div>
              </div>

              {/* Floating Weather Pill: Humidity (Top Right) */}
              <div className="absolute -top-2 -right-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0f1a2e]/90 backdrop-blur-md border border-cyan-500/30 shadow-xl shadow-black/50">
                <Droplets className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Humidity</div>
                  <div className="text-sm font-bold text-cyan-400">{selectedCity.humidity}%</div>
                </div>
              </div>

              {/* Floating Weather Pill: Wind (Bottom Left) */}
              <div className="absolute -bottom-4 -left-3 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0f1a2e]/90 backdrop-blur-md border border-cyan-500/30 shadow-xl shadow-black/50">
                <Wind className="w-4 h-4 text-teal-400" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Wind</div>
                  <div className="text-sm font-bold text-cyan-400">{selectedCity.windSpeed} km/h</div>
                </div>
              </div>

              {/* Main Glowing AQI Card */}
              <div className="w-full bg-[#0c1626]/90 backdrop-blur-lg border border-[#1b2b42] rounded-3xl p-8 shadow-2xl shadow-cyan-950/40 text-center relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-Time Sensor Telemetry</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-6">
                  Today's AQI ({selectedCity.name})
                </h3>

                {/* Circular Gauge */}
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    {/* Background Track */}
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      className="stroke-[#132338]"
                      strokeWidth="11"
                      fill="transparent"
                    />
                    {/* Glowing Progress Arc */}
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      stroke={statusColor}
                      strokeWidth="11"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(0,210,255,0.7)]"
                    />
                  </svg>

                  {/* Center Content */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white tracking-tight">
                      {selectedCity.aqi}
                    </span>
                    <span
                      className="text-sm font-bold mt-0.5 px-2.5 py-0.5 rounded-full"
                      style={{ color: statusColor, backgroundColor: `${statusColor}20` }}
                    >
                      {selectedCity.status}
                    </span>
                  </div>
                </div>

                {/* Sub-Pollutants Row */}
                <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-slate-800/80">
                  <div className="bg-[#08101c] p-2.5 rounded-xl border border-slate-800/60">
                    <div className="text-[11px] font-semibold text-slate-400">PM2.5</div>
                    <div className="text-sm font-bold text-cyan-400 mt-0.5">{selectedCity.pm25} µg</div>
                  </div>
                  <div className="bg-[#08101c] p-2.5 rounded-xl border border-slate-800/60">
                    <div className="text-[11px] font-semibold text-slate-400">PM10</div>
                    <div className="text-sm font-bold text-cyan-400 mt-0.5">{selectedCity.pm10} µg</div>
                  </div>
                  <div className="bg-[#08101c] p-2.5 rounded-xl border border-slate-800/60">
                    <div className="text-[11px] font-semibold text-slate-400">CO₂ / CO</div>
                    <div className="text-sm font-bold text-cyan-400 mt-0.5">{selectedCity.co} ppm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

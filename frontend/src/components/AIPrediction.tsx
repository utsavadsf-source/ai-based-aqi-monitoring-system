import React from 'react';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { CityData } from '../types/aqi';
import { SEVEN_DAY_FORECAST } from '../data/mockData';

interface AIPredictionProps {
  selectedCity: CityData;
}

export const AIPrediction: React.FC<AIPredictionProps> = ({ selectedCity }) => {
  // Tomorrow prediction dynamic value (slight offset from city current AQI)
  const tomorrowAqi = Math.min(250, Math.max(30, selectedCity.aqi + 7));
  const tomorrowStatus = tomorrowAqi <= 50 ? 'Good' : tomorrowAqi <= 100 ? 'Moderate' : 'Unhealthy';

  const circumference = 2 * Math.PI * 60; // r=60
  const percentage = Math.min(100, Math.round((tomorrowAqi / 250) * 100));
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <section id="prediction" className="py-16 bg-[#060b13] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            AI Pollution Prediction ({selectedCity.name})
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Our Gemini AI model analyzes historical pollution data, atmospheric pressure, wind vectors,
            traffic density, and environmental factors to predict future Air Quality Index (AQI).
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Tomorrow's AI Prediction Gauge */}
          <div className="lg:col-span-5 bg-[#0b1424] rounded-3xl p-8 border border-[#16273f] shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-8">Tomorrow's AI Prediction</h3>

              {/* Glowing circular gauge */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    className="stroke-[#132338]"
                    strokeWidth="9"
                    fill="transparent"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    stroke="#00d2ff"
                    strokeWidth="9"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 drop-shadow-[0_0_10px_rgba(0,210,255,0.7)]"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-white">{tomorrowAqi}</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5">{tomorrowStatus}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>AI Model Confidence: <strong className="text-white">94.8% High</strong></span>
              </div>
            </div>

            <div className="mt-8 p-3.5 rounded-2xl bg-[#070e1c] border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Predicted Wind Trajectory:</span>
                <span className="text-cyan-300 font-medium">11 km/h WSW</span>
              </div>
              <div className="flex justify-between">
                <span>Inversion Risk:</span>
                <span className="text-emerald-400 font-medium">Low (Clear skies)</span>
              </div>
            </div>
          </div>

          {/* Right Column: 7-Day Forecast */}
          <div className="lg:col-span-7 bg-[#0b1424] rounded-3xl p-8 border border-[#16273f] shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  7-Day AQI Forecast ({selectedCity.name})
                </h3>
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini Forecast</span>
                </span>
              </div>

              {/* Day rows */}
              <div className="space-y-4">
                {SEVEN_DAY_FORECAST.map((item) => {
                  const maxBar = 120;
                  const barPercent = Math.min(100, Math.round((item.aqi / maxBar) * 100));

                  return (
                    <div key={item.day} className="flex items-center gap-4 text-xs">
                      <span className="w-10 font-bold text-slate-300">{item.day}</span>
                      
                      {/* Bar Track */}
                      <div className="flex-1 bg-[#101d2f] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-400 to-[#00d2ff] h-full rounded-full transition-all duration-700"
                          style={{ width: `${barPercent}%` }}
                        />
                      </div>

                      <span className="w-8 text-right font-black text-white">{item.aqi}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Forecast baseline generated every 6 hours</span>
              <span className="text-cyan-400 font-medium">Target range: 50-85 AQI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

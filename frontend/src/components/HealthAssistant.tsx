import React from 'react';
import { Heart, CheckCircle2 } from 'lucide-react';
import { CityData } from '../types/aqi';

interface HealthAssistantProps {
  selectedCity: CityData;
}

export const HealthAssistant: React.FC<HealthAssistantProps> = ({ selectedCity }) => {
  return (
    <section id="health" className="py-16 bg-[#070e1a] border-t border-[#142337] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30" />
            <span>AI Health Assistant</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Health Recommendations for Local Residents
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Our AI system analyzes the Air Quality Index (AQI) and provides personalized health recommendations
            to keep you and your family safe in <strong className="text-cyan-300">{selectedCity.name}</strong>.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Good Air Quality (0 - 50) */}
          <div className="bg-[#0b1424] rounded-3xl p-8 border-t-4 border-t-emerald-400 border border-[#16273f] shadow-xl relative overflow-hidden">
            <div className="text-4xl mb-4">😊</div>
            <h3 className="text-xl font-bold text-emerald-400">Good Air Quality</h3>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
              AQI : 0 – 50
            </div>

            <ul className="mt-6 space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span>Outdoor exercise & sports are completely safe.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span>Open windows for fresh natural ventilation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span>Perfect weather for outdoor walking & cycling.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span>No precautions needed for children or seniors.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Moderate Air Quality (51 - 100) */}
          <div className="bg-[#0b1424] rounded-3xl p-8 border-t-4 border-t-[#00d2ff] border border-[#16273f] shadow-xl relative overflow-hidden">
            <div className="text-4xl mb-4">😐</div>
            <h3 className="text-xl font-bold text-[#00d2ff]">Moderate Air Quality</h3>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
              AQI : 51 – 100
            </div>

            <ul className="mt-6 space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] mt-2 shrink-0"></span>
                <span>Sensitive residents should wear masks outdoors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] mt-2 shrink-0"></span>
                <span>Reduce heavy outdoor physical exertion.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] mt-2 shrink-0"></span>
                <span>Drink plenty of water to stay hydrated.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] mt-2 shrink-0"></span>
                <span>Close windows during peak highway traffic hours.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Poor & Unhealthy (101+) */}
          <div className="bg-[#0b1424] rounded-3xl p-8 border-t-4 border-t-rose-500 border border-[#16273f] shadow-xl relative overflow-hidden">
            <div className="text-4xl mb-4">😷</div>
            <h3 className="text-xl font-bold text-rose-400">Poor & Unhealthy</h3>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
              AQI : 101+
            </div>

            <ul className="mt-6 space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <span>Stay indoors as much as possible.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <span>Wear an N95 / KN95 mask outside.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <span>Avoid outdoor morning workouts and jogs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <span>Run indoor air purifiers with HEPA filters.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

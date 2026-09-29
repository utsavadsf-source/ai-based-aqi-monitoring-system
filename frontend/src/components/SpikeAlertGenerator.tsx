import React, { useState } from 'react';
import { Settings, CheckCircle2, MapPin } from 'lucide-react';
import { CityData } from '../types/aqi';

interface SpikeAlertGeneratorProps {
  selectedCity: CityData;
}

export const SpikeAlertGenerator: React.FC<SpikeAlertGeneratorProps> = ({ selectedCity }) => {
  // Threshold slider state (default 100 as in screenshot)
  const [threshold, setThreshold] = useState<number>(100);

  // Simulated AQI state (default 68 as in screenshot, or changes when test buttons are clicked)
  const [simulatedAqi, setSimulatedAqi] = useState<number>(68);
  const [activeLevel, setActiveLevel] = useState<'normal' | 'moderate' | 'severe'>('normal');

  // Subscription input
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);

  // Calculate status label and color
  const getStatusInfo = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', dot: '🟢', color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40' };
    if (aqi <= 100) return { label: 'Moderate', dot: '🟡', color: 'text-amber-400 border-amber-500/50 bg-amber-950/40' };
    if (aqi <= 200) return { label: 'Unhealthy', dot: '🟠', color: 'text-orange-400 border-orange-500/50 bg-orange-950/40' };
    return { label: 'Hazardous', dot: '🔴', color: 'text-rose-400 border-rose-500/50 bg-rose-950/40' };
  };

  const statusInfo = getStatusInfo(simulatedAqi);
  const isSpikeTriggered = simulatedAqi >= threshold;

  const handleLevelClick = (level: 'normal' | 'moderate' | 'severe', aqiValue: number) => {
    setActiveLevel(level);
    setSimulatedAqi(aqiValue);
  };

  const handleActivateAlerts = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setIsActivated(true);
    setTimeout(() => {
      setIsActivated(false);
      setPhoneInput('');
    }, 4000);
  };

  return (
    <section id="aqi-alerts" className="py-16 bg-[#040810] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Header Matching Screenshot */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Automated AQI Spike Alert Message Generator
          </h2>
        </div>

        {/* Outer Alert Card */}
        <div className="bg-[#08121f] rounded-3xl border border-[#14263e] shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Card Top Title Row */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg sm:text-xl">
              <span className="text-slate-300">⚙️</span>
              <span>Alert Trigger Settings</span>
            </div>

            {/* Auto-Trigger ACTIVE Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07241d] border border-emerald-500/60 text-emerald-400 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Auto-Trigger ACTIVE</span>
            </div>
          </div>

          {/* Inner City & AQI Box */}
          <div className="bg-[#050b14] rounded-2xl p-5 sm:p-6 border border-slate-800/80 space-y-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">Target City:</div>
              <div className="flex items-center gap-1.5 text-xl sm:text-2xl font-bold text-[#00d2ff] mt-0.5">
                <span>📍</span>
                <span>{selectedCity.name}, Gujarat</span>
              </div>
            </div>

            <div className="flex items-end justify-between pt-1">
              <div>
                <div className="text-xs text-slate-400 font-medium">Simulated Live AQI:</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#00d2ff]">{simulatedAqi}</span>
                  <span className="text-sm font-bold text-slate-400">AQI</span>
                </div>
              </div>

              {/* Status Pill matching screenshot */}
              <div
                className={`px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold flex items-center gap-1.5 ${statusInfo.color}`}
              >
                <span>{statusInfo.dot}</span>
                <span>{statusInfo.label}</span>
              </div>
            </div>
          </div>

          {/* AQI Alert Threshold Trigger Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">AQI Alert Threshold Trigger:</span>
              <span className="text-sm font-extrabold text-[#00d2ff] font-mono">AQI {threshold}</span>
            </div>

            <input
              type="range"
              min="50"
              max="300"
              step="5"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00d2ff]"
            />

            <div className="text-xs text-slate-400">
              Alert triggers automatically whenever {selectedCity.name} AQI crosses {threshold}.
            </div>
          </div>

          {/* Test Automatic Message Generation (Pollution Levels) */}
          <div className="space-y-3 pt-2">
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>🧪</span>
              <span>Test Automatic Message Generation (Pollution Levels):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Normal Button */}
              <button
                type="button"
                onClick={() => handleLevelClick('normal', 65)}
                className={`py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeLevel === 'normal' && simulatedAqi === 65
                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'bg-[#060d17] border-emerald-500/50 text-emerald-400 hover:bg-emerald-950/30'
                }`}
              >
                <span>🟢</span>
                <span>Normal (65)</span>
              </button>

              {/* Moderate Spike Button */}
              <button
                type="button"
                onClick={() => handleLevelClick('moderate', 145)}
                className={`py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeLevel === 'moderate' && simulatedAqi === 145
                    ? 'bg-amber-950/70 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
                    : 'bg-[#060d17] border-amber-500/50 text-amber-400 hover:bg-amber-950/30'
                }`}
              >
                <span>🟠</span>
                <span>Moderate Spike (145)</span>
              </button>

              {/* Severe Spike Button */}
              <button
                type="button"
                onClick={() => handleLevelClick('severe', 230)}
                className={`py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeLevel === 'severe' && simulatedAqi === 230
                    ? 'bg-rose-950/70 border-rose-400 text-rose-300 shadow-md shadow-rose-500/20'
                    : 'bg-[#060d17] border-rose-500/50 text-rose-400 hover:bg-rose-950/30'
                }`}
              >
                <span>🔴</span>
                <span>Severe Spike (230)</span>
              </button>
            </div>
          </div>

          {/* Generated Alert Banner Preview if triggered */}
          {isSpikeTriggered && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/50 text-amber-200 text-xs sm:text-sm space-y-1 animate-fadeIn">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span>⚠️ [Auto-Generated SMS & WhatsApp Dispatch Message]:</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                "CPCB Alert: {selectedCity.name} recorded an elevated AQI of <strong>{simulatedAqi}</strong> crossing threshold ({threshold}). PM2.5 & CO density are high. Vulnerable residents are advised to wear masks and limit outdoor exposure."
              </p>
            </div>
          )}

          {/* Bottom Box: Subscribe for Automatic SMS / WhatsApp High-AQI Alerts */}
          <div className="bg-[#050b14] rounded-2xl p-4 sm:p-5 border border-cyan-500/30 space-y-3">
            <div className="text-xs sm:text-sm font-bold text-[#00d2ff] flex items-center gap-2">
              <span>📲</span>
              <span>Subscribe for Automatic SMS / WhatsApp High-AQI Alerts:</span>
            </div>

            <form onSubmit={handleActivateAlerts} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Enter Phone or WhatsApp No."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#08111e] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00d2ff]"
                required
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#00d2ff] hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-cyan-500/30 cursor-pointer whitespace-nowrap active:scale-95"
              >
                Activate Alerts
              </button>
            </form>

            {isActivated && (
              <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Alerts activated successfully! You will receive instant notifications for {selectedCity.name}.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

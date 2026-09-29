import React, { useState } from 'react';
import { RefreshCw, Check, Sparkles, TrendingUp, BarChart2, Activity } from 'lucide-react';
import { CityData } from '../types/aqi';

interface DashboardPreviewProps {
  selectedCity: CityData;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ selectedCity }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Dynamic 7-day trend values around the current AQI
  const trendPoints = [
    { day: 'Mon', val: Math.max(30, selectedCity.aqi - 14) },
    { day: 'Tue', val: Math.max(35, selectedCity.aqi - 8) },
    { day: 'Wed', val: Math.max(40, selectedCity.aqi - 16) },
    { day: 'Thu', val: Math.max(38, selectedCity.aqi + 6) },
    { day: 'Fri', val: Math.max(45, selectedCity.aqi - 2) },
    { day: 'Sat', val: Math.max(32, selectedCity.aqi - 18) },
    { day: 'Sun', val: selectedCity.aqi },
  ];

  // SVG coordinates for line chart
  const width = 460;
  const height = 140;
  const padding = 30;
  const minVal = 20;
  const maxVal = 160;

  const pointsSvg = trendPoints
    .map((pt, i) => {
      const x = padding + (i * (width - 2 * padding)) / (trendPoints.length - 1);
      const y = height - padding - ((pt.val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  // Bar chart values
  const weeklyBars = [
    { day: 'Mon', aqi: Math.round(selectedCity.aqi * 0.88) },
    { day: 'Tue', aqi: Math.round(selectedCity.aqi * 1.05) },
    { day: 'Wed', aqi: Math.round(selectedCity.aqi * 0.94) },
    { day: 'Thu', aqi: Math.round(selectedCity.aqi * 0.82) },
    { day: 'Fri', aqi: Math.round(selectedCity.aqi * 0.85) },
    { day: 'Sat', aqi: Math.round(selectedCity.aqi * 0.72) },
    { day: 'Sun', aqi: selectedCity.aqi },
  ];

  // AI insights pool
  const insightsPool = [
    [
      `PM2.5 levels are stable in ${selectedCity.name} during afternoon hours.`,
      `Wind velocity of ${selectedCity.windSpeed} km/h is actively aiding particulate dispersion.`,
      `Traffic emissions contribute ~35% of local AQI during commute peaks.`,
      `Outdoor exercise recommended post 6:00 PM when solar radiation diminishes.`,
    ],
    [
      `DHT22 humidity (${selectedCity.humidity}%) indicates moderate particulate suspension.`,
      `MQ-135 sensor detects normal baseline atmospheric CO2 and ammonia.`,
      `MQ-7 carbon monoxide telemetry (${selectedCity.sensors.mq7.coPpm} ppm) remains within safe threshold.`,
      `AI forecast predicts stable meteorological conditions for the next 24 hours.`,
    ],
    [
      `Industrial buffer zones around ${selectedCity.name} show nominal emissions today.`,
      `Evening breeze from ${selectedCity.windDir} is expected to lower dust concentration by 14%.`,
      `Air quality rating is currently suitable for general public activities.`,
      `All 150+ monitoring nodes reporting normal heartbeats to MySQL storage.`,
    ],
  ];

  const currentInsights = insightsPool[refreshCount % insightsPool.length];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshCount((prev) => prev + 1);
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <section id="dashboard" className="py-16 bg-[#060b13] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Smart AQI Dashboard Preview ({selectedCity.name})
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Visualize air quality trends, pollution sources, AI insights, and environmental analytics
            in one real-time operational view.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-6">
          {/* Row 1: 7-Day Trend Line + Weekly Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 7-Day Line Chart */}
            <div className="lg:col-span-7 bg-[#0b1424] rounded-3xl p-6 sm:p-7 border border-[#16273f] shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">
                    AQI Trend (Last 7 Days – {selectedCity.name})
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/70 px-2.5 py-1 rounded-full border border-cyan-800/60">
                    Live SVG Stream
                  </span>
                </div>

                <div className="w-full h-44 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
                    {/* Grid lines */}
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#132338" strokeDasharray="3 3" />
                    <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#132338" strokeDasharray="3 3" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#132338" />

                    {/* Gradient Fill under line */}
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#00d2ff" />
                        <stop offset="50%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>

                    {/* Polyline */}
                    <polyline
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsSvg}
                      className="drop-shadow-[0_0_8px_rgba(0,210,255,0.7)]"
                    />

                    {/* Data Points */}
                    {trendPoints.map((pt, i) => {
                      const x = padding + (i * (width - 2 * padding)) / (trendPoints.length - 1);
                      const y = height - padding - ((pt.val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
                      const isAlert = i === 3;
                      const isLast = i === trendPoints.length - 1;

                      return (
                        <g key={pt.day}>
                          <circle
                            cx={x}
                            cy={y}
                            r={isLast ? '6' : '4.5'}
                            fill={isAlert ? '#f59e0b' : isLast ? '#10b981' : '#00d2ff'}
                            stroke="#0b1424"
                            strokeWidth="2"
                          />
                          <text
                            x={x}
                            y={height - 10}
                            fill="#64748b"
                            fontSize="10"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {pt.day}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-800">
                <span>Lowest: 52 AQI (Sat)</span>
                <span className="text-cyan-400 font-bold">Current: {selectedCity.aqi} AQI (Sun)</span>
                <span>Peak: 78 AQI (Thu)</span>
              </div>
            </div>

            {/* Weekly Bar Chart */}
            <div className="lg:col-span-5 bg-[#0b1424] rounded-3xl p-6 sm:p-7 border border-[#16273f] shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-6">Weekly AQI Chart</h3>

                <div className="flex items-end justify-between h-40 pt-4 px-2">
                  {weeklyBars.map((item) => {
                    const maxBarHeight = 110;
                    const barHeight = Math.max(18, Math.min(maxBarHeight, Math.round((item.aqi / 130) * maxBarHeight)));

                    return (
                      <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                        <div
                          className="w-5 sm:w-6 bg-gradient-to-t from-emerald-400 to-[#00d2ff] rounded-t-lg transition-all duration-700 hover:brightness-125"
                          style={{ height: `${barHeight}px` }}
                        />
                        <span className="text-[11px] text-slate-400 font-medium">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
                Weekly moving average: <strong className="text-white">{Math.round(selectedCity.aqi * 0.9)} AQI</strong>
              </div>
            </div>
          </div>

          {/* Row 2: Radial Donut + Live AQI Meter + AI Insights Stream */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Donut Gauge: Pollution Index */}
            <div className="md:col-span-4 bg-[#0b1424] rounded-3xl p-6 border border-[#16273f] shadow-xl text-center flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white text-left mb-4">Pollution Index</h3>

                <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="48" stroke="#132236" strokeWidth="12" fill="none" />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      stroke="#00d2ff"
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - 0.68)}
                      strokeLinecap="round"
                      fill="none"
                      className="drop-shadow-[0_0_8px_rgba(0,210,255,0.7)]"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-white">68%</span>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Load</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
                Calculated urban atmospheric saturation
              </div>
            </div>

            {/* Live AQI Meter */}
            <div className="md:col-span-3 bg-[#0b1424] rounded-3xl p-6 border border-[#16273f] shadow-xl text-center flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white text-left mb-4">Live AQI Meter</h3>
                <div className="my-6">
                  <div className="text-5xl font-black text-[#00d2ff] tracking-tight">
                    {selectedCity.aqi}
                  </div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">
                    {selectedCity.status}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                <span>Station:</span>
                <span className="text-cyan-300 font-mono font-medium">{selectedCity.id}-01</span>
              </div>
            </div>

            {/* AI Insights Stream */}
            <div className="md:col-span-5 bg-[#0b1424] rounded-3xl p-6 border border-[#16273f] shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🤖</span>
                  <h3 className="text-base font-bold text-white">AI Insights Stream</h3>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  {currentInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="w-full py-2.5 rounded-xl bg-[#00d2ff] hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/30 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Analyzing Sensors...' : 'Refresh Insights'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

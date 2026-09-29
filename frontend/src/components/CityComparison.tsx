import React, { useState } from 'react';
import { Search, Thermometer, Droplets, MapPin, Check } from 'lucide-react';
import { CityData } from '../types/aqi';
import { GUJARAT_CITIES, METRO_CITIES, ALL_CITIES } from '../data/mockData';

interface CityComparisonProps {
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
}

export const CityComparison: React.FC<CityComparisonProps> = ({
  selectedCity,
  onSelectCity,
}) => {
  const [activeTab, setActiveTab] = useState<'gujarat' | 'metro' | 'all'>('gujarat');
  const [searchQuery, setSearchQuery] = useState('');

  let listToDisplay: CityData[] = [];
  if (activeTab === 'gujarat') listToDisplay = GUJARAT_CITIES;
  else if (activeTab === 'metro') listToDisplay = METRO_CITIES;
  else listToDisplay = ALL_CITIES;

  const filteredCities = listToDisplay.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Good':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">Good</span>;
      case 'Moderate':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-950/70 text-[#00d2ff] border border-cyan-800/60">Moderate</span>;
      case 'Unhealthy for Sensitive':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-950/70 text-amber-400 border border-amber-800/60">Unhealthy for Sensitive</span>;
      case 'Unhealthy':
      case 'Very Unhealthy':
      case 'Hazardous':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-orange-950/70 text-orange-400 border border-orange-800/60">Unhealthy</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-300">Unknown</span>;
    }
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-400';
    if (aqi <= 100) return 'text-[#00d2ff]';
    if (aqi <= 150) return 'text-amber-400';
    return 'text-orange-400';
  };

  return (
    <section className="py-16 bg-[#060b13] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Gujarat & Major Cities Air Quality Comparison
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Compare real-time Air Quality Index, PM2.5, PM10, temperature, and humidity across Gujarat
            districts and major metros. Click any city to view full AI diagnostics.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-full bg-[#0d1624] border border-[#16273f]">
            <button
              onClick={() => setActiveTab('gujarat')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gujarat'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🏢</span>
              <span>Gujarat Cities</span>
            </button>
            <button
              onClick={() => setActiveTab('metro')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'metro'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🌆</span>
              <span>Metro Cities</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🌐</span>
              <span>All Locations</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Gujarat city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0d1624] border border-[#16273f] rounded-full text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#142337] bg-[#09111e] shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#142337] bg-[#070e1a] text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                <th className="py-4 px-5">City</th>
                <th className="py-4 px-5">State</th>
                <th className="py-4 px-5">Live AQI</th>
                <th className="py-4 px-5">AQI Status</th>
                <th className="py-4 px-5">PM2.5</th>
                <th className="py-4 px-5">PM10</th>
                <th className="py-4 px-5">Temp</th>
                <th className="py-4 px-5">Humidity</th>
                <th className="py-4 px-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132034] text-xs">
              {filteredCities.map((city) => {
                const isSelected = selectedCity.id === city.id;
                return (
                  <tr
                    key={city.id}
                    className={`transition-colors hover:bg-[#0e1b2e] ${
                      isSelected ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    {/* City Name */}
                    <td className="py-4 px-5 font-bold text-white flex items-center gap-2">
                      <span className="text-rose-500">📍</span>
                      <span>{city.name}</span>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                          Active
                        </span>
                      )}
                    </td>

                    {/* State */}
                    <td className="py-4 px-5 text-slate-400">{city.state}</td>

                    {/* Live AQI */}
                    <td className={`py-4 px-5 text-lg font-black ${getAqiColor(city.aqi)}`}>
                      {city.aqi}
                    </td>

                    {/* AQI Status */}
                    <td className="py-4 px-5">{getStatusBadge(city.status)}</td>

                    {/* PM2.5 */}
                    <td className="py-4 px-5 text-slate-300 font-medium">{city.pm25} µg/m³</td>

                    {/* PM10 */}
                    <td className="py-4 px-5 text-slate-300 font-medium">{city.pm10} µg/m³</td>

                    {/* Temp */}
                    <td className="py-4 px-5 text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-pink-400" />
                        {city.temp}°C
                      </span>
                    </td>

                    {/* Humidity */}
                    <td className="py-4 px-5 text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                        {city.humidity}%
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-5 text-center">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-cyan-500/20 text-[#00d2ff] font-bold border border-cyan-500/40 text-xs">
                          <Check className="w-3 h-3" />
                          <span>Selected</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectCity(city);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#122238] hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-600/40 transition-all font-semibold text-xs cursor-pointer hover:shadow-md hover:shadow-cyan-500/30"
                        >
                          Analyze
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

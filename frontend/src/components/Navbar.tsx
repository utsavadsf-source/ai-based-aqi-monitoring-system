import React from 'react';
import { Globe, Download, User, Bell, LogOut, ShieldCheck } from 'lucide-react';
import { CityData, UserProfile } from '../types/aqi';
import { GUJARAT_CITIES } from '../data/mockData';

interface NavbarProps {
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
  onOpenReportModal: () => void;
  onOpenBackendModal: () => void;
  onOpenLoginModal: () => void;
  currentUser: UserProfile | null;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onSelectCity,
  onOpenReportModal,
  onOpenLoginModal,
  currentUser,
  unreadNotificationsCount,
  onOpenNotifications,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#070e1a]/95 backdrop-blur-md border-b border-[#152336] shadow-xl">
      {/* Top Nav Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
            <Globe className="w-6 h-6 text-slate-950 animate-pulse-slow" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              AI AQI
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#home" className="text-cyan-400 border-b-2 border-cyan-400 pb-1 transition-colors">
            Home
          </a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">
            Features
          </a>
          <a href="#live-aqi" className="hover:text-cyan-400 transition-colors">
            Live AQI
          </a>
          <a href="#sensors" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            IoT Sensors
          </a>
          <a href="#aqi-alerts" className="hover:text-cyan-400 transition-colors">
            AQI Alerts
          </a>
          <a href="#prediction" className="hover:text-cyan-400 transition-colors">
            Prediction
          </a>
          <a href="#dashboard" className="hover:text-cyan-400 transition-colors">
            Dashboard
          </a>
          <a href="#map" className="hover:text-cyan-400 transition-colors">
            Map
          </a>
          <a href="#faq" className="hover:text-cyan-400 transition-colors">
            FAQ
          </a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">
            Contact
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* CPCB Station Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d1624] border border-[#1b2b42] text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Station:</span>
            <span className="font-semibold text-cyan-400">{selectedCity.name} Node-01</span>
          </div>

          {/* Download Report Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Download Report</span>
            <span className="sm:hidden">Report</span>
          </button>

          {/* Email Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="View Email Notifications"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Auth: Logged in State vs Login/Register Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <div
                onClick={onOpenNotifications}
                className="flex items-center gap-2 bg-[#0c1828] border border-cyan-500/40 rounded-xl px-2.5 py-1.5 cursor-pointer hover:border-cyan-400 transition-all"
                title={`Logged in as ${currentUser.email}`}
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left text-[11px] leading-tight">
                  <div className="font-bold text-white truncate max-w-[120px]">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Logged In</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-bold text-slate-950 bg-[#00d2ff] hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-slate-950" />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Gujarat Cities Pills Toolbar */}
      <div className="bg-[#0b1424] border-t border-[#142337] py-2 px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 tracking-wider uppercase pr-2 border-r border-slate-800">
            <span>🏢</span>
            <span>GUJARAT CITIES:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {GUJARAT_CITIES.map((city) => {
              const isActive = selectedCity.id === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => onSelectCity(city)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#00d2ff] text-slate-950 shadow-md shadow-cyan-500/40 font-bold scale-105'
                      : 'bg-[#121e31] text-slate-300 hover:bg-[#192b45] hover:text-white border border-[#1e334f]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-slate-950' : 'bg-rose-500'}`}></span>
                  <span>{city.name}</span>
                  <span className="opacity-75 font-mono text-[11px]">({city.aqi})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Globe, ArrowUp, Mail, Phone, MapPin, Heart, Shield, Cpu } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onOpenReportModal: () => void;
  onOpenBackendModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToTop,
  onOpenReportModal,
  onOpenBackendModal,
}) => {
  return (
    <footer id="contact" className="bg-[#040810] border-t border-[#132135] pt-16 pb-12 text-slate-400 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Branding */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/25">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">AI AQI</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              AI-Based Air Quality Index (AQI) Real-Time Monitoring & Prediction Network. Powered by
              calibrated DHT22, MQ135, MQ2, and MQ7 sensors, Python Flask backend, Node.js streaming, and MySQL database.
            </p>

            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>150+ IoT Monitoring Nodes Online Across Gujarat</span>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#home" className="hover:text-cyan-400 transition-colors">Home Dashboard</a>
              </li>
              <li>
                <a href="#live-aqi" className="hover:text-cyan-400 transition-colors">Live AQI Stations</a>
              </li>
              <li>
                <a href="#sensors" className="hover:text-cyan-400 transition-colors">DHT22 & MQ Sensors</a>
              </li>
              <li>
                <a href="#aqi-alerts" className="hover:text-cyan-400 transition-colors">Spike Alert Generator</a>
              </li>
              <li>
                <a href="#prediction" className="hover:text-cyan-400 transition-colors">AI 7-Day Prediction</a>
              </li>
              <li>
                <a href="#map" className="hover:text-cyan-400 transition-colors">Rajkot Location Map</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Backend & Reports */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Developer & Reports</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={onOpenReportModal}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-left cursor-pointer"
                >
                  Download CSV / PDF Report
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBackendModal}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-left cursor-pointer"
                >
                  Python Flask API Source
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBackendModal}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-left cursor-pointer"
                >
                  Node.js Express Server
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBackendModal}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-left cursor-pointer"
                >
                  MySQL Schema (DDL)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBackendModal}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-left cursor-pointer"
                >
                  ESP32 Microcontroller Code
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Monitoring Office</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Bhakti Nagar Circle, Rajkot, Gujarat 360002</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+91 281 245 8890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>aqi-monitoring@gujarat.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AI Based AQI Monitoring System. Built with HTML, CSS, JavaScript, Python Flask, Node.js & MySQL.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors">Sensor Calibration Standards</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">CPCB Guidelines</span>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button matching Screenshots */}
      <button
        onClick={onScrollToTop}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#00d2ff] hover:bg-cyan-300 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        title="Back to top"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </footer>
  );
};

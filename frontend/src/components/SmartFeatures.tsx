import React, { useState } from 'react';
import { Zap, ArrowUpRight, CheckCircle, X, Download, Sliders, Activity, Sparkles } from 'lucide-react';
import { SMART_FEATURES } from '../data/mockData';

interface SmartFeaturesProps {
  onOpenReportModal: () => void;
  onSelectFeatureAction: (featureId: string) => void;
}

export const SmartFeatures: React.FC<SmartFeaturesProps> = ({
  onOpenReportModal,
  onSelectFeatureAction,
}) => {
  const [selectedFeature, setSelectedFeature] = useState<typeof SMART_FEATURES[0] | null>(null);

  const handleCardClick = (feature: typeof SMART_FEATURES[0]) => {
    if (feature.id === 'download-reports') {
      onOpenReportModal();
      return;
    }
    // Also open modal showing full feature details
    setSelectedFeature(feature);
  };

  return (
    <section id="features" className="py-16 bg-[#070e1a] border-t border-[#142337] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Smart Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Powerful Features of Our AI AQI System
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Our intelligent air quality monitoring platform provides real-time tracking, predictive
            machine learning, health advisories, and interactive dashboards.
            <span className="block text-cyan-400 font-semibold mt-1">
              (Click any feature card below to interact and explore its parameters)
            </span>
          </p>
        </div>

        {/* 8 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SMART_FEATURES.map((feature) => (
            <div
              key={feature.id}
              onClick={() => handleCardClick(feature)}
              className="bg-[#0b1424] rounded-2xl p-6 border border-[#16273f] hover:border-cyan-400 transition-all duration-300 shadow-xl cursor-pointer group hover:-translate-y-1 hover:shadow-cyan-950/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#122238] text-cyan-400 border border-cyan-800/50">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">{feature.tag}</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:underline">
                  <span>Explore</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Deep Dive Interactive Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0b1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl p-2 rounded-2xl bg-cyan-950/80 border border-cyan-500/40">
                {selectedFeature.icon}
              </span>
              <div>
                <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                  {selectedFeature.badge}
                </span>
                <h3 className="text-xl font-bold text-white">{selectedFeature.title}</h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedFeature.description}
            </p>

            <div className="p-4 rounded-2xl bg-[#060b13] border border-slate-800 space-y-3 mb-6">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                System Implementation Highlight:
              </div>
              <div className="flex items-start gap-2 text-xs text-cyan-300 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{selectedFeature.highlight}</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Integrated with DHT22, MQ135, MQ2 & MQ7 sensor telemetry stream.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Synchronized with Python Flask backend & MySQL sensor log tables.</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedFeature(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const targetId = selectedFeature.id;
                  setSelectedFeature(null);
                  onSelectFeatureAction(targetId);
                }}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/30 cursor-pointer"
              >
                Jump to Live Feature
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

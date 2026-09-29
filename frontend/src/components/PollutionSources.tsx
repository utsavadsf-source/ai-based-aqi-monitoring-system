import React from 'react';
import { POLLUTION_SOURCES } from '../data/mockData';

export const PollutionSources: React.FC = () => {
  return (
    <section className="py-16 bg-[#060b13] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Major Air Pollution Sources
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Artificial Intelligence analyzes pollutant compositions to identify major urban sources
            and estimate their relative contributions to the overall Air Quality Index.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POLLUTION_SOURCES.map((source) => (
            <div
              key={source.name}
              className="bg-[#0b1424] rounded-2xl p-6 border border-[#16273f] hover:border-cyan-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-4">{source.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{source.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{source.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                {/* Progress bar */}
                <div className="w-full bg-[#111f32] h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${source.percentage}%`, backgroundColor: source.color }}
                  />
                </div>
                <div className="text-xs font-bold text-slate-300">
                  Contribution : <span style={{ color: source.color }}>{source.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

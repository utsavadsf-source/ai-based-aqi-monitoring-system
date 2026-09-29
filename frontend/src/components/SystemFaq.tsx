import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Cpu, ShieldCheck, FileText, Zap } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  points?: string[];
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'why-made',
    question: 'Why was this AI-Based AQI Monitoring System created?',
    tag: 'System Objective',
    icon: HelpCircle,
    answer:
      'Rapid industrial expansion and vehicular congestion across Gujarat urban centers (such as Rajkot, Ahmedabad, and Surat) present continuous air quality and public health challenges. This platform was engineered to give residents, students, healthcare workers, and municipal authorities transparent, second-by-second ground-truth telemetry. By delivering immediate insights into ambient pollutant concentrations, the system empowers citizens to take timely precautionary actions and safeguard respiratory well-being.',
  },
  {
    id: 'how-different',
    question: 'How is this platform different from other conventional AQI websites?',
    tag: 'Core Innovation',
    icon: Sparkles,
    answer:
      'Most commercial AQI platforms rely on coarse satellite approximations or 3-to-6 hour delayed regional averages. In contrast, this system connects directly to physical, ground-level IoT sensor clusters (DHT22, MQ-135, MQ-2, MQ-7) for genuine real-time telemetry. Furthermore, the platform integrates an AI-driven 7-day predictive neural network, automated multi-channel spike alerts (WhatsApp, SMS, Email), and one-click certified PDF audit report generation.',
  },
  {
    id: 'sensors-role',
    question: 'What specific parameters do the DHT22, MQ-135, MQ-2, and MQ-7 sensors measure?',
    tag: 'IoT Hardware',
    icon: Cpu,
    answer:
      'Each onboard sensor is calibrated to target distinct atmospheric compounds and micro-climatic indicators:',
    points: [
      'DHT22 / AM2302: Measures ambient temperature (°C) and relative humidity (%) to gauge local heat index and atmospheric dispersion.',
      'MQ-135 Gas Sensor: Quantifies Carbon Dioxide (CO₂), Ammonia (NH₃), and volatile airborne contaminants.',
      'MQ-2 Sensor: Detects combustion smoke density and flammable hydrocarbons, including Liquefied Petroleum Gas (LPG) and Methane (CH₄).',
      'MQ-7 Sensor: Delivers high-precision detection of toxic, odorless Carbon Monoxide (CO ppm) through automated dual-voltage thermal cycles.',
    ],
  },
  {
    id: 'spike-alerts',
    question: 'How does the system notify residents when air pollution spikes dangerously?',
    tag: 'Automated Protection',
    icon: Zap,
    answer:
      'The platform features an intelligent Automated Spike Alert Engine that constantly monitors sensor telemetry against CPCB safety thresholds. When hazardous concentrations of particulate matter (PM2.5/PM10) or combustible gases are detected (e.g., AQI exceeding 100 or 150), the system triggers immediate emergency dispatches across WhatsApp, SMS, and registered user emails with tailored health advisories.',
  },
  {
    id: 'pdf-audit',
    question: 'Can citizens, institutions, or researchers export official audit reports?',
    tag: 'Data Transparency',
    icon: FileText,
    answer:
      'Yes. Anyone can click the "Download Report" button to instantly generate a certified PDF audit report. Each report is embedded with an exact date and second-precision timestamp (IST), station GPS coordinates, complete DHT22 & MQ-series sensor logs, and CPCB regulatory compliance benchmarks. Raw CSV data exports are also available for research and data analytics.',
  },
];

export const SystemFaq: React.FC = () => {
  // First two items open by default
  const [openIds, setOpenIds] = useState<string[]>(['why-made', 'how-different']);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="py-16 bg-[#070e1a] border-t border-[#132236] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102035] border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions & Project Insights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why was this website built, and how does it differ from others?
          </h2>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm">
            Everything you need to know about the AI-Based AQI Monitoring System, IoT sensor telemetry, and safety intelligence.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIds.includes(faq.id);
            const IconComponent = faq.icon;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0b1424] border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-[#08101c] border-[#16273e] hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isOpen
                          ? 'bg-cyan-950/90 text-cyan-400 border border-cyan-500/40'
                          : 'bg-[#101c2e] text-slate-400 border border-slate-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                          {faq.tag}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Q0{index + 1}</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`p-1.5 rounded-lg bg-slate-800/60 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/80 space-y-3 animate-fadeIn">
                    <div className="bg-[#070e18] p-4 rounded-xl border border-slate-800/90 text-slate-200 leading-relaxed font-sans">
                      <p>{faq.answer}</p>

                      {faq.points && (
                        <ul className="mt-3 space-y-2 text-slate-300 text-xs sm:text-sm">
                          {faq.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-[#0a1626] to-teal-950/30 border border-cyan-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">CPCB Standard Regulatory Compliance</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Calibrated in adherence to Central Pollution Control Board (CPCB) and Gujarat ambient monitoring standards.
              </p>
            </div>
          </div>

          <a
            href="#live-aqi"
            className="px-4 py-2 rounded-xl bg-[#00d2ff] hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            Explore Live Telemetry
          </a>
        </div>
      </div>
    </section>
  );
};

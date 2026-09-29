import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Database, Server, Cpu } from 'lucide-react';
import {
  PYTHON_FLASK_CODE,
  NODEJS_EXPRESS_CODE,
  MYSQL_SCHEMA_CODE,
  ESP32_ARDUINO_CODE,
} from '../data/codeSnippets';

interface BackendCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendCodeModal: React.FC<BackendCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'flask' | 'node' | 'mysql' | 'esp32'>('flask');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let activeCode = PYTHON_FLASK_CODE;
  let filename = 'app.py';
  if (activeTab === 'node') {
    activeCode = NODEJS_EXPRESS_CODE;
    filename = 'server.js';
  } else if (activeTab === 'mysql') {
    activeCode = MYSQL_SCHEMA_CODE;
    filename = 'schema.sql';
  } else if (activeTab === 'esp32') {
    activeCode = ESP32_ARDUINO_CODE;
    filename = 'esp32_sensor_node.ino';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Backend Architecture: Python Flask, Node.js & MySQL
            </h3>
            <p className="text-xs text-slate-400">
              Complete source code for DHT22, MQ135, MQ2, MQ7 telemetry receiver and database storage.
            </p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('flask')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'flask'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-[#101d30] text-slate-300 hover:bg-[#16273f]'
              }`}
            >
              <span>🐍</span>
              <span>Python Flask (app.py)</span>
            </button>

            <button
              onClick={() => setActiveTab('node')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'node'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-[#101d30] text-slate-300 hover:bg-[#16273f]'
              }`}
            >
              <span>🟢</span>
              <span>Node.js Express (server.js)</span>
            </button>

            <button
              onClick={() => setActiveTab('mysql')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'mysql'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-[#101d30] text-slate-300 hover:bg-[#16273f]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>MySQL (schema.sql)</span>
            </button>

            <button
              onClick={() => setActiveTab('esp32')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'esp32'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-[#101d30] text-slate-300 hover:bg-[#16273f]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>ESP32 Hardware (.ino)</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : `Copy ${filename}`}</span>
          </button>
        </div>

        {/* Code Content Box */}
        <div className="flex-1 bg-[#050912] rounded-2xl p-4 border border-slate-800 overflow-auto font-mono text-xs text-cyan-300 leading-relaxed shadow-inner">
          <pre className="whitespace-pre">{activeCode}</pre>
        </div>

        {/* Modal Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
          <span>Ready to execute with <code className="text-cyan-400 font-bold">python app.py</code> or <code className="text-cyan-400 font-bold">node server.js</code></span>
          <span className="text-emerald-400 font-semibold">MySQL 8.0+ Compatible</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Send,
} from 'lucide-react';
import { UserProfile, EmailNotification } from '../types/aqi';
import { GUJARAT_CITIES } from '../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile, notification: EmailNotification) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Simple Login form state
  const [loginEmail, setLoginEmail] = useState('user@gujarat-aqi.gov.in');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  // Simple Register form state
  const [regName, setRegName] = useState('Rajesh Patel');
  const [regEmail, setRegEmail] = useState('rajesh.patel@gujarat-aqi.gov.in');
  const [regPhone, setRegPhone] = useState('+91 98765 43210');
  const [regCity, setRegCity] = useState('Rajkot');
  const [regPassword, setRegPassword] = useState('SecurePass@2026');

  const [notificationDispatched, setNotificationDispatched] = useState<EmailNotification | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const isoTimestamp = now.toISOString().replace('T', ' ').substring(0, 19);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const extractedName = loginEmail.split('@')[0].replace(/[\._]/g, ' ');
    const formattedName = extractedName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: formattedName,
      email: loginEmail,
      role: 'citizen',
      assignedCity: 'Rajkot',
      registeredAt: isoTimestamp,
      lastLoginAt: isoTimestamp,
    };

    const notification: EmailNotification = {
      id: `notif-${Date.now()}`,
      toEmail: loginEmail,
      userName: user.name,
      type: 'login',
      subject: `🔐 Security Alert: Successful Login to AI AQI Monitoring System`,
      timestamp: isoTimestamp,
      dateStr,
      timeStr,
      ipAddress: '103.21.144.68 (Gujarat Gateway Node)',
      device: 'Chrome on macOS (Web Session)',
      body: `You have successfully logged in to your AI Based AQI Monitoring account with email "${loginEmail}" at ${timeStr} on ${dateStr}. If this was you, no action is needed.`,
      isRead: false,
    };

    setNotificationDispatched(notification);

    setTimeout(() => {
      onAuthSuccess(user, notification);
      setIsSubmitting(false);
      onClose();
    }, 1400);
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: regName,
      email: regEmail,
      phone: regPhone,
      role: 'citizen',
      assignedCity: regCity,
      registeredAt: isoTimestamp,
      lastLoginAt: isoTimestamp,
    };

    const notification: EmailNotification = {
      id: `notif-${Date.now()}`,
      toEmail: regEmail,
      userName: regName,
      type: 'register',
      subject: `🎉 Registration Confirmed - Welcome to AI AQI Gujarat`,
      timestamp: isoTimestamp,
      dateStr,
      timeStr,
      ipAddress: '103.21.144.68 (Gujarat Gateway Node)',
      device: 'Chrome on macOS (Web Session)',
      body: `Welcome ${regName}! Your account has been successfully created for the AI Based AQI Monitoring System with email "${regEmail}". You can now access live DHT22, MQ135, MQ2, and MQ7 sensor streams, receive real-time AQI spike notifications, and download certified audit reports for ${regCity}.`,
      isRead: false,
    };

    setNotificationDispatched(notification);

    setTimeout(() => {
      onAuthSuccess(user, notification);
      setIsSubmitting(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/25">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {activeTab === 'login' ? 'Sign In to Your Account' : 'Create New Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {activeTab === 'login'
              ? 'Enter your credentials to access live AQI monitoring.'
              : 'Register to monitor live air quality and receive email alerts.'}
          </p>
        </div>

        {/* Tab Switcher: Login vs Registration */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#070e18] border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#00d2ff] text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In / Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#00d2ff] text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Live Dispatched Email Banner if active */}
        {notificationDispatched && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-xs text-emerald-200 space-y-1 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-white">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Email Notification Sent!</span>
            </div>
            <p className="text-[11px] text-emerald-300">
              Notification dispatched to <strong>{notificationDispatched.toEmail}</strong> confirming your {notificationDispatched.type === 'login' ? 'login' : 'registration'}.
            </p>
          </div>
        )}

        {/* TAB 1: SIMPLE LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#08111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <p className="text-[10px] text-cyan-400/90 mt-1 flex items-center gap-1">
                <span>📧 Instant security alert will be sent to this email upon sign-in</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#08111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#00d2ff] hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/30 transition-all cursor-pointer mt-3 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              <span>{isSubmitting ? 'Signing In & Sending Email...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* TAB 2: SIMPLE REGISTRATION FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#08111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#08111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <p className="text-[10px] text-cyan-400/90 mt-1">
                📧 Confirmation notification will be sent to this email address.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2 bg-[#08111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-[#08111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    {GUJARAT_CITIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Choose a password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#08111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#00d2ff] hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/30 transition-all cursor-pointer mt-3 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              <span>{isSubmitting ? 'Registering & Sending Email...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="mt-5 text-center text-[11px] text-slate-500">
          Secure Environmental Monitoring Network • Gujarat
        </div>
      </div>
    </div>
  );
};

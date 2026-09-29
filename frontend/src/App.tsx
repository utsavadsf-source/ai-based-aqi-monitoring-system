import React, { useState, useEffect } from 'react';
import { CityData, SensorData, UserProfile, EmailNotification } from './types/aqi';
// Mock data fallback if backend is offline
import { GUJARAT_CITIES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveOverview } from './components/LiveOverview';
import { SensorTelemetryPanel } from './components/SensorTelemetryPanel';
import { CityComparison } from './components/CityComparison';
import { SpikeAlertGenerator } from './components/SpikeAlertGenerator';
import { AIPrediction } from './components/AIPrediction';
import { HealthAssistant } from './components/HealthAssistant';
import { PollutionSources } from './components/PollutionSources';
import { SmartFeatures } from './components/SmartFeatures';
import { DashboardPreview } from './components/DashboardPreview';
import { LocationMap } from './components/LocationMap';
import { SystemFaq } from './components/SystemFaq';
import { Footer } from './components/Footer';
import { DownloadReportModal } from './components/DownloadReportModal';
import { BackendCodeModal } from './components/BackendCodeModal';
import { LoginModal } from './components/LoginModal';
import { NotificationModal } from './components/NotificationModal';
import { Mail, Check, X, Bell } from 'lucide-react';

export default function App() {
  const [cities, setCities] = useState<CityData[]>(GUJARAT_CITIES);
  const [selectedCity, setSelectedCity] = useState<CityData>(GUJARAT_CITIES[0]);
  
  // Fetch real data from backend
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cities');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setCities(data);
            setSelectedCity(data.find((c: CityData) => c.id === 'rajkot') || data[0]);
          }
        }
      } catch (err) {
        console.error('Backend offline, using mock data fallback', err);
      }
    };
    fetchCities();
  }, []);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // User Profile & Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('aqi_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dispatched Email Notifications state
  const [notifications, setNotifications] = useState<EmailNotification[]>(() => {
    try {
      const saved = localStorage.getItem('aqi_email_notifications');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Initial welcome alert
    return [
      {
        id: 'notif-init-1',
        toEmail: 'citizen-alerts@gujarat-aqi.gov.in',
        userName: 'Gujarat Resident',
        type: 'aqi_spike',
        subject: '⚠️ Environmental Advisory: Rajkot Ambient AQI Baseline Normal',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        dateStr: new Date().toLocaleDateString('en-GB'),
        timeStr: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        ipAddress: '103.21.144.68',
        device: 'Automated Gateway Engine',
        body: 'Automated 24-hr telemetry verified: DHT22, MQ-135, MQ-2, and MQ-7 sensors are streaming nominal data across Rajkot and Gujarat municipal nodes.',
        isRead: false,
      },
    ];
  });

  // Floating Toast Banner for recently dispatched email
  const [toastNotification, setToastNotification] = useState<EmailNotification | null>(null);

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aqi_email_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Subtle live telemetry background micro-fluctuations every 6 seconds to show it's live
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedCity((prev) => {
        const deltaTemp = Math.random() * 0.4 - 0.2;
        const deltaHum = Math.round(Math.random() * 2 - 1);
        const newTemp = +(prev.temp + deltaTemp).toFixed(1);
        const newHum = Math.min(95, Math.max(20, prev.humidity + deltaHum));

        return {
          ...prev,
          temp: newTemp,
          humidity: newHum,
          sensors: {
            ...prev.sensors,
            dht22: {
              ...prev.sensors.dht22,
              temperature: newTemp,
              humidity: newHum,
            },
          },
        };
      });
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // Handle successful login or registration
  const handleAuthSuccess = (user: UserProfile, notification: EmailNotification) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('aqi_current_user', JSON.stringify(user));
    } catch {
      // ignore
    }

    // Prepend notification
    setNotifications((prev) => [notification, ...prev]);

    // Show floating toast
    setToastNotification(notification);
    setTimeout(() => {
      setToastNotification(null);
    }, 7000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('aqi_current_user');
    } catch {
      // ignore
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleUpdateSensors = (updatedSensors: SensorData) => {
    const smokeContrib = updatedSensors.mq2.smokePpm * 0.4;
    const coContrib = updatedSensors.mq7.coPpm * 2.8;
    const computedAqi = Math.round(35 + smokeContrib + coContrib);
    const status =
      computedAqi <= 50
        ? 'Good'
        : computedAqi <= 100
        ? 'Moderate'
        : computedAqi <= 150
        ? 'Unhealthy for Sensitive'
        : 'Unhealthy';

    setSelectedCity((prev) => ({
      ...prev,
      aqi: computedAqi,
      status,
      temp: updatedSensors.dht22.temperature,
      humidity: updatedSensors.dht22.humidity,
      sensors: updatedSensors,
    }));
  };

  const handleSelectFeatureAction = (featureId: string) => {
    switch (featureId) {
      case 'live-aqi':
        document.getElementById('live-aqi')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'ai-prediction':
        document.getElementById('prediction')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'weather-integration':
      case 'pollution-analytics':
        document.getElementById('sensors')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'health-alerts':
        document.getElementById('aqi-alerts')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'download-reports':
        setIsReportModalOpen(true);
        break;
      case 'dashboard-preview':
      case 'historical-trends':
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative">
      {/* Top Navigation Bar */}
      <Navbar
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        currentUser={currentUser}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Floating Email Notification Toast (When User Logs in or Registers) */}
      {toastNotification && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-50 max-w-md w-full bg-[#0b1424] border border-cyan-400/80 rounded-2xl p-4 shadow-2xl shadow-cyan-500/30 animate-bounce-short">
          <div className="flex items-start justify-between gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Email Notification Sent!</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                Delivered to <strong>{toastNotification.toEmail}</strong>: {toastNotification.subject}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsNotificationModalOpen(true);
                    setToastNotification(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-400 text-slate-950 font-bold text-[10px] hover:bg-cyan-300 transition-all cursor-pointer"
                >
                  View Dispatched Email
                </button>
                <span className="text-[10px] text-slate-400">{toastNotification.timeStr}</span>
              </div>
            </div>

            <button
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <HeroSection
          selectedCity={selectedCity}
          onLiveClick={() => document.getElementById('live-aqi')?.scrollIntoView({ behavior: 'smooth' })}
          onExploreClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
        />

        {/* Live Overview */}
        <LiveOverview
          selectedCity={selectedCity}
          onOpenSensorsClick={() => document.getElementById('sensors')?.scrollIntoView({ behavior: 'smooth' })}
        />

        {/* Clean IoT Sensor Telemetry: DHT22, MQ135, MQ2, MQ7 */}
        <SensorTelemetryPanel
          selectedCity={selectedCity}
          onUpdateSensors={handleUpdateSensors}
          onOpenCodeModal={() => setIsBackendModalOpen(true)}
        />

        {/* Gujarat Cities Comparison */}
        <CityComparison
          selectedCity={selectedCity}
          onSelectCity={(city) => setSelectedCity(city)}
        />

        {/* Automated AQI Spike Alert Generator */}
        <SpikeAlertGenerator selectedCity={selectedCity} />

        {/* AI Pollution Prediction */}
        <AIPrediction selectedCity={selectedCity} />

        {/* Health Recommendations */}
        <HealthAssistant selectedCity={selectedCity} />

        {/* Major Air Pollution Sources */}
        <PollutionSources />

        {/* 8 Clickable Smart Features */}
        <SmartFeatures
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onSelectFeatureAction={handleSelectFeatureAction}
        />

        {/* Smart AQI Dashboard Preview */}
        <DashboardPreview selectedCity={selectedCity} />

        {/* Official Google Maps Integration */}
        <LocationMap selectedCity={selectedCity} />

        {/* Project Q&A / FAQs (Purpose, Difference from other sites, Sensors role) */}
        <SystemFaq />
      </main>

      {/* Footer */}
      <Footer
        onScrollToTop={handleScrollToTop}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
      />

      {/* Download PDF / CSV Report Modal */}
      <DownloadReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultCity={selectedCity}
      />

      {/* Backend Code Viewer Modal */}
      <BackendCodeModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />

      {/* Login & Registration Modal with Email Notification Trigger */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Dispatched Email Notifications Center Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onClearAll={handleClearNotifications}
        onMarkAsRead={handleMarkNotificationAsRead}
      />
    </div>
  );
}

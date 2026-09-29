import React, { useState } from 'react';
import { X, Bell, Mail, ShieldAlert, CheckCircle2, Clock, Trash2, ExternalLink } from 'lucide-react';
import { EmailNotification } from '../types/aqi';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: EmailNotification[];
  onClearAll: () => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onMarkAsRead,
}) => {
  const [selectedNotification, setSelectedNotification] = useState<EmailNotification | null>(
    notifications[0] || null
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1424] border border-cyan-500/40 rounded-3xl p-6 max-w-3xl w-full shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 pr-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dispatched Email Notifications</h3>
              <p className="text-xs text-slate-400">
                Official security and login activity alerts delivered to registered email addresses.
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-rose-400 text-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Bell className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-sm">No notifications yet</p>
            <p className="text-xs">Log in or register an account to receive instant security email alerts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 flex-1 overflow-hidden min-h-0">
            {/* List View (2 cols) */}
            <div className="md:col-span-2 overflow-y-auto space-y-2 pr-1 max-h-[60vh]">
              {notifications.map((n) => {
                const isSelected = selectedNotification?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelectedNotification(n);
                      onMarkAsRead(n.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#102035] border-cyan-400 text-white shadow-md'
                        : 'bg-[#070e18] border-slate-800/80 text-slate-300 hover:bg-[#0c1828]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-cyan-400 truncate max-w-[120px]">
                        {n.toEmail}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">{n.timeStr}</span>
                    </div>

                    <h4 className="text-xs font-bold truncate text-slate-100 mb-1">{n.subject}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{n.body}</p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="capitalize px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {n.type === 'login' ? '🔐 Security Login' : n.type === 'register' ? '🎉 Registration' : '⚠️ AQI Alert'}
                      </span>
                      <span>{n.dateStr}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Email Preview Detail Box (3 cols) */}
            <div className="md:col-span-3 bg-[#050a12] border border-slate-800 rounded-2xl p-5 overflow-y-auto max-h-[60vh] flex flex-col justify-between">
              {selectedNotification ? (
                <div className="space-y-4">
                  {/* Email Envelope Header */}
                  <div className="pb-3 border-b border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-white text-sm">
                        {selectedNotification.subject}
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                        Delivered
                      </span>
                    </div>

                    <div className="text-slate-400 text-[11px]">
                      <span className="text-slate-500">From: </span>
                      <span className="text-slate-300">security-alerts@gujarat-aqi.gov.in</span>
                    </div>

                    <div className="text-slate-400 text-[11px]">
                      <span className="text-slate-500">To: </span>
                      <span className="text-cyan-400 font-semibold">{selectedNotification.toEmail}</span>
                    </div>

                    <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{selectedNotification.dateStr} at {selectedNotification.timeStr} (IST)</span>
                    </div>
                  </div>

                  {/* Email Body Template */}
                  <div className="bg-[#0b1424] p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
                    <p className="font-bold text-white text-sm">
                      Dear {selectedNotification.userName},
                    </p>

                    <p>{selectedNotification.body}</p>

                    {/* Metadata Card inside Email */}
                    <div className="bg-[#070e18] p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px] text-slate-400">
                      <div><strong className="text-slate-300">User Identity:</strong> {selectedNotification.userName}</div>
                      <div><strong className="text-slate-300">Target Email:</strong> {selectedNotification.toEmail}</div>
                      <div><strong className="text-slate-300">Access Node:</strong> Gujarat Ambient Gateway ({selectedNotification.ipAddress})</div>
                      <div><strong className="text-slate-300">Client Platform:</strong> {selectedNotification.device}</div>
                      <div><strong className="text-slate-300">Timestamp:</strong> {selectedNotification.timestamp}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300">
                      🛡️ <strong>Security Notice:</strong> If you did not perform this action, please immediately reply to this message or contact Gujarat CPCB Cyber Cell.
                    </div>

                    <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      Best Regards,<br />
                      <strong>Gujarat Air Quality Monitoring Authority</strong><br />
                      AI Based AQI Monitoring System
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Select a notification from the list to view the full email message.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

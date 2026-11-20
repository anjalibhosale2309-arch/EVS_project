import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const AlertNotificationToast = () => {
  const { alerts, dismissAlert } = useSimulation();

  // Show top 3 most recent alerts
  const displayAlerts = alerts.slice(0, 3);

  if (displayAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {displayAlerts.map((alert) => {
        let style = {
          bg: 'bg-white border-slate-200 text-slate-800',
          icon: Info,
          iconColor: 'text-blue-500',
          badge: 'bg-blue-50 text-blue-700',
        };

        if (alert.type === 'danger') {
          style = {
            bg: 'bg-white border-red-300 text-slate-900 shadow-lg shadow-red-500/10',
            icon: ShieldAlert,
            iconColor: 'text-red-600',
            badge: 'bg-red-100 text-red-800',
          };
        } else if (alert.type === 'warning') {
          style = {
            bg: 'bg-white border-amber-300 text-slate-900 shadow-lg shadow-amber-500/10',
            icon: AlertTriangle,
            iconColor: 'text-amber-500',
            badge: 'bg-amber-100 text-amber-800',
          };
        } else if (alert.type === 'success') {
          style = {
            bg: 'bg-white border-emerald-300 text-slate-900 shadow-lg shadow-emerald-500/10',
            icon: CheckCircle2,
            iconColor: 'text-emerald-500',
            badge: 'bg-emerald-100 text-emerald-800',
          };
        }

        const IconComponent = style.icon;

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto rounded-2xl p-3.5 border shadow-xl flex items-start space-x-3 transition-all duration-300 animate-in slide-in-from-bottom-3 ${style.bg}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <IconComponent className={`w-5 h-5 ${style.iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <h5 className="font-bold text-xs tracking-tight truncate">{alert.title}</h5>
                <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">{alert.message}</p>
            </div>

            <button
              type="button"
              onClick={() => dismissAlert(alert.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

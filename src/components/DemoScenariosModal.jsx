import React from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  Droplet, 
  AlertTriangle, 
  Sun, 
  CloudRain, 
  Flame, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import confetti from 'canvas-confetti';

export const DemoScenariosModal = ({ isOpen, onClose }) => {
  const { runDemoScenario, addAlert } = useSimulation();

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'dry_trigger',
      title: 'Scenario 1: Low Soil Moisture Auto-Trigger',
      badge: 'Core Logic Demo',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Forces Zone 1 (Wheat) moisture down to 20% (< 30% threshold). Demonstrates autonomous pump activation, valve opening, and animated water flow.',
      icon: Droplet,
      iconColor: 'text-sky-500 bg-sky-50',
      action: () => {
        runDemoScenario('dry_trigger');
        try {
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
        } catch {}
        onClose();
      },
    },
    {
      id: 'tank_empty',
      title: 'Scenario 2: Low Water Tank Safety Cutoff',
      badge: 'Dry-Run Protection',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      description: 'Drains reservoir tank to 3% (< 5% threshold). Demonstrates safety interlock immediately halting the pump and raising a critical warning alert.',
      icon: AlertTriangle,
      iconColor: 'text-red-500 bg-red-50',
      action: () => {
        runDemoScenario('tank_empty');
        onClose();
      },
    },
    {
      id: 'night_solar',
      title: 'Scenario 3: Night / Insufficient Solar Power',
      badge: 'PV Power Deficit',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Sets sunlight intensity to 0% and depletes virtual battery. Demonstrates solar energy lockout preventing pump operation.',
      icon: Sun,
      iconColor: 'text-amber-500 bg-amber-50',
      action: () => {
        runDemoScenario('night_solar');
        onClose();
      },
    },
    {
      id: 'rain_recharge',
      title: 'Scenario 4: Monsoon Rain Storm Replenishment',
      badge: 'Natural Hydration',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Simulates heavy rainfall: soil moisture increases naturally, water tank refills automatically, and active irrigation cycles stand down.',
      icon: CloudRain,
      iconColor: 'text-blue-500 bg-blue-50',
      action: () => {
        runDemoScenario('rain_recharge');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-extrabold text-white text-base">1-Click College Demo Scenarios</h3>
              <p className="text-[11px] text-amber-100">Instantly test the simulation logic during viva or lab demonstration.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-amber-100 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios List */}
        <div className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {scenarios.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-200 ${s.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm tracking-tight">{s.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.badgeColor}`}>
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                      {s.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={s.action}
                  className="self-end sm:self-center px-4 py-2 rounded-xl bg-slate-900 group-hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Demo</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

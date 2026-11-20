import React from 'react';
import { 
  Gauge, 
  Droplets, 
  Power, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Sliders,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const SensorMonitoring = ({ onOpenAddZoneModal }) => {
  const {
    zones,
    setZoneMoisture,
    toggleZoneValve,
    pumpStatus,
    settings,
    controlMode,
    deleteZone
  } = useSimulation();

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Gauge className="w-5 h-5 text-emerald-600" />
              <span>Virtual Soil Moisture Sensor Telemetry</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              {zones.length} Capacitive Probes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time volumetric water content (VWC%), soil condition states, and calibrated threshold limits.
          </p>
        </div>

        {/* Action Button & Threshold Legend */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenAddZoneModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm shadow-emerald-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Insert Zone</span>
          </button>

          <div className="flex items-center space-x-2.5 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-600 font-medium text-[11px]">Dry (&lt;{settings.autoStartThreshold}%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 font-medium text-[11px]">Optimal ({settings.autoStartThreshold}-{settings.autoStopThreshold}%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span className="text-slate-600 font-medium text-[11px]">Wet (&gt;{settings.autoStopThreshold}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Sensor Cards Grid */}
      <div className={`grid gap-5 ${
        zones.length <= 2 ? 'grid-cols-1 md:grid-cols-2' :
        zones.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        zones.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}>
        {zones.map((zone) => {
          const isActivelyWatering = zone.valveOpen && pumpStatus;
          const isDry = zone.moisture < settings.autoStartThreshold;
          const isWet = zone.moisture >= settings.autoStopThreshold;
          const isModerate = !isDry && !isWet;

          let conditionBadge = {
            label: 'Moderate (Optimal)',
            color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            icon: CheckCircle2,
            recommendation: 'Soil hydrated within standard agronomic threshold.',
          };

          if (isDry) {
            conditionBadge = {
              label: 'Dry (Critical Deficit)',
              color: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
              icon: AlertTriangle,
              recommendation: `Moisture below ${settings.autoStartThreshold}%. Automatic irrigation triggered!`,
            };
          } else if (isWet) {
            conditionBadge = {
              label: 'Wet (Fully Saturated)',
              color: 'bg-sky-100 text-sky-800 border-sky-300',
              icon: Droplets,
              recommendation: `Target ${settings.autoStopThreshold}% reached. Irrigation suspended to conserve water.`,
            };
          }

          const ConditionIcon = conditionBadge.icon;

          return (
            <div
              key={zone.id}
              className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                isActivelyWatering
                  ? 'bg-gradient-to-b from-sky-50/50 to-white border-sky-300 shadow-md ring-2 ring-sky-400/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Sensor #{zone.id}
                  </span>
                  
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                      isActivelyWatering
                        ? 'bg-sky-500 text-white border-sky-600 animate-pulse'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      <Droplets className="w-3 h-3" />
                      <span>{isActivelyWatering ? 'Watering...' : 'Idle'}</span>
                    </span>

                    {zones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteZone(zone.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                        title="Delete zone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-0.5 truncate">
                  {zone.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-3">
                  <span className="truncate">{zone.crop}</span>
                  <span className="text-slate-400 flex-shrink-0">{zone.area}</span>
                </div>

                {/* Big Soil Moisture Reading */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Current Moisture</span>
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-3xl font-black font-mono tracking-tight ${
                        isDry ? 'text-red-600' : (isWet ? 'text-sky-600' : 'text-emerald-600')
                      }`}>
                        {zone.moisture}%
                      </span>
                      <span className="text-xs font-semibold text-slate-400">VWC</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Soil Type</span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[110px] block">{zone.soilType}</span>
                  </div>
                </div>

                {/* Moisture Gauge Progress Bar with Threshold Markers */}
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-mono">
                    <span>0%</span>
                    <span className="text-red-500 font-bold">{settings.autoStartThreshold}%</span>
                    <span className="text-sky-600 font-bold">{settings.autoStopThreshold}%</span>
                    <span>100%</span>
                  </div>

                  <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10 opacity-70"
                      style={{ left: `${settings.autoStartThreshold}%` }}
                    ></div>
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-sky-700 z-10 opacity-70"
                      style={{ left: `${settings.autoStopThreshold}%` }}
                    ></div>

                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isDry
                          ? 'bg-red-500'
                          : isWet
                          ? 'bg-sky-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(3, zone.moisture))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Condition Status Badge */}
                <div className={`p-2 rounded-xl border flex items-start space-x-2 text-xs mb-4 ${conditionBadge.color}`}>
                  <ConditionIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold">{conditionBadge.label}</div>
                    <div className="text-[10px] opacity-90 mt-0.5 leading-tight">{conditionBadge.recommendation}</div>
                  </div>
                </div>

                {/* Interactive Soil Moisture Slider */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      Manual Sensor Override
                    </span>
                    <span className="font-mono text-emerald-700">{zone.moisture}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    step="1"
                    value={zone.moisture}
                    onChange={(e) => setZoneMoisture(zone.id, Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <button 
                      type="button" 
                      onClick={() => setZoneMoisture(zone.id, 20)}
                      className="hover:text-red-600 hover:underline"
                    >
                      Dry (20%)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setZoneMoisture(zone.id, 45)}
                      className="hover:text-emerald-600 hover:underline"
                    >
                      Optimal (45%)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setZoneMoisture(zone.id, 65)}
                      className="hover:text-sky-600 hover:underline"
                    >
                      Wet (65%)
                    </button>
                  </div>
                </div>
              </div>

              {/* Individual Watering Control Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleZoneValve(zone.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
                    zone.valveOpen
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{zone.valveOpen ? 'Valve Open (Flowing)' : 'Valve Closed (Shut)'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

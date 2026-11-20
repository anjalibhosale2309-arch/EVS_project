import React from 'react';
import { 
  Sun, 
  Droplets, 
  Power, 
  Gauge, 
  Layers, 
  Activity, 
  PlusCircle, 
  BatteryCharging,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const SummaryCards = () => {
  const {
    solarWatts,
    sunlightIntensity,
    solarPanelRating,
    batteryLevel,
    isCharging,
    tankLevel,
    tankCapacity,
    refillWaterTank,
    pumpStatus,
    totalWaterUsed,
    zones,
    activeZonesCount,
    averageMoisture,
    settings
  } = useSimulation();

  const currentWaterLiters = Math.round((tankLevel / 100) * tankCapacity);
  const isTankLow = tankLevel <= settings.minTankLevel;
  const isTankWarning = tankLevel <= 20;

  // Soil health status
  let soilStatusLabel = 'Optimal Moisture';
  let soilStatusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (averageMoisture < settings.autoStartThreshold) {
    soilStatusLabel = 'Dry / Irrigation Required';
    soilStatusColor = 'text-red-700 bg-red-50 border-red-200';
  } else if (averageMoisture > 75) {
    soilStatusLabel = 'Saturated / Moist';
    soilStatusColor = 'text-blue-700 bg-blue-50 border-blue-200';
  }

  // Active zone names
  const activeZoneNames = zones.filter(z => z.valveOpen && pumpStatus).map(z => z.name.split('–')[0].trim());

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      
      {/* 1. Solar Energy Generated */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition -mr-8 -mt-8"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Solar Generation</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 group-hover:rotate-45 transition duration-500">
            <Sun className="w-4 h-4 fill-amber-400" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5 mb-1">
          <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">{solarWatts}</span>
          <span className="text-xs font-bold text-slate-500">Watts</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
          <span>Sunlight: <strong className="text-slate-800">{sunlightIntensity}%</strong></span>
          <span className="text-[10px] text-slate-400 font-mono">Max {solarPanelRating}W</span>
        </div>
        {/* Battery Mini Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1 text-slate-500">
            <BatteryCharging className={`w-3.5 h-3.5 ${isCharging ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
            <span>Battery:</span>
          </div>
          <span className="font-bold text-slate-700 font-mono">{Math.round(batteryLevel)}%</span>
        </div>
      </div>

      {/* 2. Water Tank Level */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-400/10 rounded-full blur-2xl group-hover:bg-sky-400/20 transition -mr-8 -mt-8"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Tank Level</span>
          <button
            type="button"
            onClick={() => refillWaterTank(100)}
            className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 hover:bg-sky-100 hover:scale-105 transition"
            title="Refill Water Reservoir to 100%"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-baseline space-x-1.5 mb-1">
          <span className={`text-2xl font-black font-mono tracking-tight ${isTankLow ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
            {tankLevel.toFixed(1)}%
          </span>
          <span className="text-xs font-bold text-slate-500">({currentWaterLiters} L)</span>
        </div>
        {/* Visual Water Level Fill Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isTankLow ? 'bg-red-500' : isTankWarning ? 'bg-amber-400' : 'bg-gradient-to-r from-sky-400 to-blue-600'
            }`}
            style={{ width: `${Math.max(2, tankLevel)}%` }}
          ></div>
        </div>
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Tank Capacity:</span>
          <span className="font-bold text-slate-700 font-mono">{tankCapacity.toLocaleString()} Liters</span>
        </div>
      </div>

      {/* 3. Pump Status */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition group relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl transition -mr-8 -mt-8 ${pumpStatus ? 'bg-sky-500/20' : 'bg-slate-300/10'}`}></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Pump</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
            pumpStatus 
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' 
              : 'bg-slate-100 text-slate-400'
          }`}>
            <Power className={`w-4 h-4 ${pumpStatus ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5 mb-1">
          <span className={`text-2xl font-black font-mono tracking-tight ${pumpStatus ? 'text-sky-600' : 'text-slate-400'}`}>
            {pumpStatus ? 'ACTIVE' : 'STANDBY'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
          <span>Power Draw:</span>
          <span className="font-mono font-bold text-slate-800">{pumpStatus ? '180 W' : '0 W'}</span>
        </div>
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Pump RPM:</span>
          <span className="font-bold text-slate-700 font-mono">{pumpStatus ? '2,850 RPM' : '0 RPM'}</span>
        </div>
      </div>

      {/* 4. Total Water Used */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-400/10 rounded-full blur-2xl group-hover:bg-teal-400/20 transition -mr-8 -mt-8"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Consumed</span>
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600">
            <Droplets className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5 mb-1">
          <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalWaterUsed.toFixed(1)}
          </span>
          <span className="text-xs font-bold text-slate-500">Liters</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-emerald-600 font-medium mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>42% Saved vs Flood</span>
        </div>
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Eco-Score:</span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">A+ Precision</span>
        </div>
      </div>

      {/* 5. Active Irrigation Zones */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition -mr-8 -mt-8"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Zones</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5 mb-1">
          <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {activeZonesCount}
          </span>
          <span className="text-xs font-bold text-slate-500">/ 4 Zones</span>
        </div>
        <div className="text-xs text-slate-500 mb-2 truncate h-4">
          {activeZonesCount > 0 ? (
            <span className="text-emerald-700 font-semibold">{activeZoneNames.join(', ')}</span>
          ) : (
            <span>All zone valves closed</span>
          )}
        </div>
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Solenoid Valves:</span>
          <span className="font-bold text-slate-700 font-mono">4 Connected</span>
        </div>
      </div>

      {/* 6. Average Soil Moisture */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/10 rounded-full blur-2xl group-hover:bg-green-400/20 transition -mr-8 -mt-8"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Soil Moisture</span>
          <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200/80 flex items-center justify-center text-green-600">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5 mb-1">
          <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {averageMoisture}%
          </span>
          <span className="text-xs font-bold text-slate-500">VWC</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-500 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, averageMoisture))}%` }}
          ></div>
        </div>
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border truncate ${soilStatusColor}`}>
            {soilStatusLabel}
          </span>
        </div>
      </div>

    </div>
  );
};

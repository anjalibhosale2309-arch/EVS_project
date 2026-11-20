import React, { useState } from 'react';
import { 
  Sun, 
  Droplet, 
  Power, 
  RotateCw, 
  Zap, 
  Layers, 
  Check, 
  AlertCircle, 
  Info,
  Maximize2,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const FarmSimulationArea = ({ onOpenAddZoneModal }) => {
  const {
    zones,
    pumpStatus,
    tankLevel,
    tankCapacity,
    solarWatts,
    sunlightIntensity,
    weatherPreset,
    controlMode,
    toggleZoneValve,
    setZoneMoisture,
    deleteZone
  } = useSimulation();

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Dynamic Crop Icon & Visual Style Helper
  const getCropMeta = (zone) => {
    const nameLower = (zone.crop + ' ' + (zone.cropType || '')).toLowerCase();
    if (nameLower.includes('wheat')) {
      return { emoji: '🌾', baseBg: '#7c5432', moistBg: '#3d2514', plantColor: '#84cc16' };
    }
    if (nameLower.includes('corn') || nameLower.includes('maize')) {
      return { emoji: '🌽', baseBg: '#754f2f', moistBg: '#382212', plantColor: '#eab308' };
    }
    if (nameLower.includes('tomato')) {
      return { emoji: '🍅', baseBg: '#6e472a', moistBg: '#341f0f', plantColor: '#ef4444' };
    }
    if (nameLower.includes('cotton')) {
      return { emoji: '🌿', baseBg: '#775233', moistBg: '#3c2413', plantColor: '#06b6d4' };
    }
    if (nameLower.includes('sugar')) {
      return { emoji: '🎋', baseBg: '#6b4f2c', moistBg: '#312311', plantColor: '#10b981' };
    }
    if (nameLower.includes('soy')) {
      return { emoji: '🌱', baseBg: '#745634', moistBg: '#392815', plantColor: '#84cc16' };
    }
    if (nameLower.includes('rice') || nameLower.includes('paddy')) {
      return { emoji: '🌾', baseBg: '#654e38', moistBg: '#2c2116', plantColor: '#06b6d4' };
    }
    if (nameLower.includes('onion')) {
      return { emoji: '🧅', baseBg: '#7a5136', moistBg: '#3a2315', plantColor: '#a855f7' };
    }
    if (nameLower.includes('potato')) {
      return { emoji: '🥔', baseBg: '#82593b', moistBg: '#3f2817', plantColor: '#f97316' };
    }
    if (nameLower.includes('grape')) {
      return { emoji: '🍇', baseBg: '#704c35', moistBg: '#352115', plantColor: '#ec4899' };
    }
    if (nameLower.includes('chilli') || nameLower.includes('pepper')) {
      return { emoji: '🌶️', baseBg: '#6d4529', moistBg: '#331d0f', plantColor: '#ef4444' };
    }
    return { emoji: '🌱', baseBg: '#734e30', moistBg: '#382212', plantColor: zone.color || '#10b981' };
  };

  // Compute dynamic branch pipe X positions for arbitrary number of zones
  const numZones = zones.length;
  const branchXPositions = zones.map((_, idx) => Math.round((1000 / numZones) * (idx + 0.5)));
  const firstBranchX = branchXPositions[0] || 500;
  const lastBranchX = branchXPositions[branchXPositions.length - 1] || 500;

  // Background pipe path
  const bgPipePath = `M 500 0 L 500 35 M ${firstBranchX} 35 L ${lastBranchX} 35 ` +
    branchXPositions.map((x) => `M ${x} 35 L ${x} 80`).join(' ');

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm mb-6 relative overflow-hidden">
      
      {/* Farm Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Interactive Virtual Farm Simulation Layout</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {zones.length} Active Zones
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Photovoltaic array, centralized water pump, automated manifold & dynamic precision irrigation zones.
          </p>
        </div>

        {/* Action: Insert Zone & Legend */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenAddZoneModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm shadow-emerald-600/30"
            title="Insert a new crop zone"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Insert Crop Zone</span>
          </button>

          <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="font-medium text-[11px]">Water Flow</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-[11px]">Valve Open</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG & Visual Farm Top-View Canvas */}
      <div className="w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 shadow-inner relative overflow-hidden border border-slate-700">
        
        {/* Subtle grid pattern backdrop */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>

        {/* TOP STATION: Solar Array, Water Reservoir, Pump & Main Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-6 relative z-10">
          
          {/* 1. Solar Photovoltaic Generation Unit */}
          <div className="md:col-span-4 bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow-lg relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 tracking-wider uppercase">
                <Sun className="w-4 h-4 fill-amber-400 text-amber-400 animate-sun-spin" />
                Virtual Solar Array
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                {solarWatts} Watts
              </span>
            </div>

            {/* Stylized Solar Panel Grid */}
            <div className="relative bg-gradient-to-tr from-sky-950 to-blue-900 rounded-xl p-2.5 border border-sky-600/40 shadow-inner overflow-hidden">
              <div className="grid grid-cols-4 gap-1 h-14">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="rounded bg-blue-900/80 border border-sky-400/30 relative overflow-hidden flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 to-transparent"></div>
                    <div className="w-0.5 h-full bg-sky-400/20"></div>
                  </div>
                ))}
              </div>
              <div 
                className="absolute -inset-1 bg-gradient-to-r from-amber-400/10 via-amber-200/25 to-transparent pointer-events-none transition-opacity duration-700"
                style={{ opacity: sunlightIntensity / 100 }}
              ></div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Lux Irradiance: {sunlightIntensity}%</span>
              <span className="text-emerald-400 font-semibold">Inverter 24V DC</span>
            </div>
          </div>

          {/* 2. Water Reservoir Tank */}
          <div className="md:col-span-4 bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow-lg relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 tracking-wider uppercase">
                <Droplet className="w-4 h-4 text-sky-400" />
                Virtual Reservoir Tank
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-400/10 text-sky-300 border border-sky-400/30">
                {tankLevel.toFixed(1)}% ({Math.round((tankLevel/100)*tankCapacity)} L)
              </span>
            </div>

            <div className="h-14 bg-slate-900 rounded-xl border border-sky-500/40 relative overflow-hidden flex flex-col justify-end shadow-inner">
              <div 
                className="w-full bg-gradient-to-t from-blue-700 via-sky-600 to-sky-400 relative transition-all duration-700"
                style={{ height: `${Math.max(4, tankLevel)}%` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-200/50 animate-wave"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-between py-1 px-2 pointer-events-none opacity-40">
                <div className="w-3 border-t border-white text-[8px] text-white">5kL</div>
                <div className="w-2 border-t border-white text-[8px] text-white">2.5kL</div>
                <div className="w-3 border-t border-white text-[8px] text-white">0</div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Status: {tankLevel <= 5 ? <strong className="text-red-400">CRITICAL LOW</strong> : <strong className="text-emerald-400">OPERATIONAL</strong>}</span>
              <span>Gravity Feed</span>
            </div>
          </div>

          {/* 3. Electric Water Pump Unit */}
          <div className="md:col-span-4 bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow-lg relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 tracking-wider uppercase">
                <Zap className="w-4 h-4 text-emerald-400" />
                Centrifugal Pump
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                pumpStatus 
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400 animate-pulse' 
                  : 'bg-slate-700 text-slate-400 border border-slate-600'
              }`}>
                {pumpStatus ? 'RUNNING (180W)' : 'OFF / STANDBY'}
              </span>
            </div>

            <div className={`h-14 rounded-xl border flex items-center justify-center relative transition-all duration-300 ${
              pumpStatus 
                ? 'bg-gradient-to-r from-sky-950 via-blue-900 to-sky-950 border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.35)]' 
                : 'bg-slate-900 border-slate-700'
            }`}>
              <div className="relative">
                <div className={`w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
                  pumpStatus 
                    ? 'border-sky-400 animate-spin text-sky-300' 
                    : 'border-slate-600 text-slate-600'
                }`} style={{ animationDuration: '0.8s' }}>
                  <RotateCw className="w-5 h-5" />
                </div>
              </div>

              <div className="ml-4 text-xs font-mono">
                <div className="text-slate-300 font-bold">1.5 HP DC Motor</div>
                <div className={`text-[10px] ${pumpStatus ? 'text-sky-400' : 'text-slate-500'}`}>
                  {pumpStatus ? 'Flow: ~58 L/min' : 'Flow: 0.0 L/min'}
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Safety Interlock: <strong className="text-emerald-400">ACTIVE</strong></span>
              <span>24V Solenoid Bus</span>
            </div>
          </div>

        </div>

        {/* PIPELINE ARCHITECTURE (DYNAMIC SVG WATER DISTRIBUTION MANIFOLD) */}
        <div className="w-full h-16 sm:h-20 relative z-10 overflow-hidden my-1">
          <svg className="w-full h-full" viewBox="0 0 1000 80" preserveAspectRatio="none">
            {/* Background Main Pipe Trunk */}
            <path
              d={bgPipePath}
              fill="none"
              stroke="#334155"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Inner Pipe Channel */}
            <path
              d={bgPipePath}
              fill="none"
              stroke="#1e293b"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dynamic Water Flow Streams */}
            {pumpStatus && (
              <>
                {/* Main pump trunk to manifold */}
                <path
                  d="M 500 0 L 500 35"
                  fill="none"
                  className="water-pipe-flow-fast"
                  strokeWidth="6"
                />

                {/* Per-zone branch flow */}
                {zones.map((zone, idx) => {
                  if (!zone.valveOpen) return null;
                  const xPos = branchXPositions[idx];
                  return (
                    <path
                      key={zone.id}
                      d={`M 500 35 L ${xPos} 35 L ${xPos} 80`}
                      fill="none"
                      className="water-pipe-flow"
                      strokeWidth="5"
                    />
                  );
                })}
              </>
            )}

            {/* Solenoid Valve Node Markers at entrance of each branch */}
            {branchXPositions.map((xPos, idx) => {
              const zone = zones[idx];
              if (!zone) return null;
              const isValveActive = zone.valveOpen && pumpStatus;
              return (
                <g key={zone.id} transform={`translate(${xPos}, 60)`}>
                  <circle
                    r="8"
                    fill={isValveActive ? '#0284c7' : '#475569'}
                    stroke={isValveActive ? '#38bdf8' : '#94a3b8'}
                    strokeWidth="2"
                    className={isValveActive ? 'animate-pulse' : ''}
                  />
                  <circle
                    r="3"
                    fill={zone.valveOpen ? '#22c55e' : '#ef4444'}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* DYNAMIC AGRICULTURAL CROP FIELDS */}
        <div className={`grid gap-4 relative z-10 ${
          numZones <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
          numZones === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
          numZones === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
          'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {zones.map((zone) => {
            const cropMeta = getCropMeta(zone);
            const isIrrigating = zone.valveOpen && pumpStatus;
            const isDry = zone.moisture < 30;
            const isWet = zone.moisture >= 60;

            const soilBg = isDry ? cropMeta.baseBg : (isWet ? cropMeta.moistBg : '#573a21');

            return (
              <div
                key={zone.id}
                className={`rounded-2xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isIrrigating
                    ? 'border-sky-400 ring-4 ring-sky-500/20 shadow-xl shadow-sky-500/10'
                    : isDry
                    ? 'border-amber-500/80 shadow-md'
                    : 'border-slate-700 hover:border-slate-500'
                }`}
                style={{ backgroundColor: soilBg }}
              >
                {/* Active Irrigation Water Droplets / Mist Animation */}
                {isIrrigating && (
                  <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                    <div className="absolute w-32 h-32 rounded-full border border-sky-300/40 animate-sprinkler"></div>
                    <div className="absolute w-24 h-24 rounded-full border border-sky-400/50 animate-sprinkler" style={{ animationDelay: '0.4s' }}></div>
                    <div className="absolute w-16 h-16 rounded-full bg-sky-400/20 blur-sm animate-pulse"></div>
                    <span className="absolute top-3 right-3 text-xs font-bold text-sky-200 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-400 flex items-center gap-1 shadow-lg animate-bounce">
                      <Droplet className="w-3 h-3 fill-sky-400" />
                      IRRIGATING
                    </span>
                  </div>
                )}

                {/* Field Header / Badge & Delete Button */}
                <div className="p-3 bg-black/40 backdrop-blur-sm border-b border-white/10 flex items-center justify-between z-10">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <span className="text-lg flex-shrink-0">{cropMeta.emoji}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white tracking-tight truncate">{zone.name}</h4>
                      <p className="text-[10px] text-slate-300 font-mono truncate">{zone.crop}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                      zone.valveOpen
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {zone.valveOpen ? 'OPEN' : 'CLOSED'}
                    </span>

                    {/* Delete Zone Button */}
                    {zones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(zone.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition"
                        title="Delete this crop zone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* CROP FIELD ROWS */}
                <div className="p-4 my-2 relative min-h-[130px] flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {[1, 2, 3, 4].map((row) => (
                      <div key={row} className="flex justify-around items-center opacity-85">
                        {[1, 2, 3, 4, 5].map((plant) => (
                          <div 
                            key={plant} 
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-transform ${
                              isIrrigating ? 'scale-110 animate-pulse' : 'scale-95'
                            }`}
                            style={{ 
                              backgroundColor: zone.moisture < 25 ? '#a38753' : (zone.moisture > 60 ? '#15803d' : '#22c55e'),
                              boxShadow: isIrrigating ? '0 0 6px rgba(56,189,248,0.7)' : 'none'
                            }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Central Sprinkler Head graphic */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isIrrigating 
                        ? 'bg-sky-500 border-white text-white shadow-lg animate-spin' 
                        : 'bg-slate-700 border-slate-500 text-slate-400'
                    }`} style={{ animationDuration: '1.5s' }}>
                      <RotateCw className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Virtual Soil Moisture Sensor Probe graphic */}
                  <div className="mt-3 flex items-center justify-between bg-black/50 backdrop-blur-md rounded-xl p-2 border border-white/10 text-white z-10">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-5 rounded-sm bg-gradient-to-b from-amber-400 to-slate-400 border border-white/40"></div>
                      <div className="text-[10px] leading-tight font-mono">
                        <div className="text-slate-400">Probe #0{zone.id}</div>
                        <div className="font-bold text-white truncate max-w-[100px]">{zone.soilType}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-base font-black font-mono leading-none ${
                        isDry ? 'text-amber-400' : (isWet ? 'text-sky-300' : 'text-emerald-400')
                      }`}>
                        {zone.moisture}%
                      </div>
                      <div className="text-[9px] uppercase font-bold tracking-wider">
                        {isDry ? 'DRY' : isWet ? 'WET' : 'OPTIMAL'}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Zone Control Footer Action */}
                <div className="p-2.5 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-2 z-10">
                  <div className="flex-1">
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono mb-0.5">
                      <span>Simulate Moisture</span>
                      <span>{zone.moisture}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={zone.moisture}
                      onChange={(e) => setZoneMoisture(zone.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleZoneValve(zone.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-sm ${
                      zone.valveOpen
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{zone.valveOpen ? 'Open' : 'Closed'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Confirmation Modal for Deleting Zone */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h4 className="text-base font-bold text-slate-900 mb-2">Delete Crop Zone?</h4>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to remove this crop field from the irrigation manifold? The solenoid valve and sensor channel will be disconnected.
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteZone(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
              >
                Delete Zone
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

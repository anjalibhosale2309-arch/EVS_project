import React from 'react';
import { 
  Sliders, 
  Sun, 
  Droplet, 
  Power, 
  Cpu, 
  RotateCcw, 
  Zap, 
  BatteryCharging, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const ControlPanel = () => {
  const {
    controlMode,
    setControlMode,
    pumpStatus,
    toggleManualPump,
    manualPumpOverride,
    tankLevel,
    tankCapacity,
    refillWaterTank,
    sunlightIntensity,
    setSunlightIntensity,
    solarPanelRating,
    solarWatts,
    batteryLevel,
    isCharging,
    zones,
    toggleZoneValve,
    settings,
    totalWaterUsed,
    weatherPreset,
    applyWeatherPreset
  } = useSimulation();

  const currentTankLiters = Math.round((tankLevel / 100) * tankCapacity);
  const totalAvailablePower = solarWatts + (batteryLevel > 15 ? 180 : 0);
  const pumpPowerDraw = pumpStatus ? settings.pumpPowerDrawWatts : 0;
  const netPower = totalAvailablePower - pumpPowerDraw;

  return (
    <div className="space-y-6 mb-6">
      
      {/* MODE SELECTOR BANNER */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30">
                Operating Control Mode
              </span>
              <span className="text-emerald-300 text-xs font-mono">
                Current: <strong>{controlMode}</strong>
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              {controlMode === 'AUTOMATIC' 
                ? 'Autonomous Smart Soil-Moisture Closed Loop' 
                : 'Direct Manual Operator Override Mode'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              {controlMode === 'AUTOMATIC'
                ? `System algorithm monitors each zone: triggers pump & valves automatically when soil moisture < ${settings.autoStartThreshold}%, cuts off at >= ${settings.autoStopThreshold}%. Incorporates safety lockouts for tank level and solar power.`
                : 'Full human control enabled: Directly toggle master pump, actuate individual solenoid valves, and override environmental parameters.'}
            </p>
          </div>

          {/* Mode Switch Toggle Pill */}
          <div className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-start lg:self-center shadow-inner">
            <button
              type="button"
              onClick={() => setControlMode('AUTOMATIC')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                controlMode === 'AUTOMATIC'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/40 ring-1 ring-white/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>AUTOMATIC MODE</span>
            </button>
            <button
              type="button"
              onClick={() => setControlMode('MANUAL')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                controlMode === 'MANUAL'
                  ? 'bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-md shadow-blue-500/40 ring-1 ring-white/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>MANUAL MODE</span>
            </button>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: SOLAR ENERGY SIMULATION & WATER TANK/PUMP SIMULATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ================= SECTION 8: SOLAR ENERGY SIMULATION ================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                  <Sun className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                    Virtual Solar Photovoltaic Module
                  </h3>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono font-semibold border border-amber-200">
                    Simulated Values (Hardware Independent)
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                P-max: {solarPanelRating}W
              </span>
            </div>

            {/* Solar Illustration & Gauge Display */}
            <div className="bg-gradient-to-br from-amber-50/60 via-slate-50 to-orange-50/40 rounded-2xl p-4 border border-amber-200/60 mb-5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Visual Sun & Panel Graphic */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div 
                      className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-white shadow-lg transition-all duration-500"
                      style={{ 
                        boxShadow: `0 0 ${Math.max(10, sunlightIntensity * 0.35)}px rgba(245, 158, 11, 0.5)`,
                        transform: `scale(${0.9 + (sunlightIntensity / 100) * 0.2})`
                      }}
                    >
                      <Sun className="w-9 h-9 fill-white animate-sun-spin" />
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-500 block">Instantaneous Generation</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-amber-600 font-mono tracking-tight">{solarWatts}</span>
                      <span className="text-sm font-bold text-slate-600">Watts</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Available Total: <strong>{totalAvailablePower}W</strong>
                    </span>
                  </div>
                </div>

                {/* Energy Consumption & Battery Breakdown */}
                <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs font-mono space-y-1.5 shadow-sm min-w-[170px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pump Draw:</span>
                    <span className={`font-bold ${pumpStatus ? 'text-sky-600' : 'text-slate-400'}`}>
                      {pumpPowerDraw} W
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Net Surplus:</span>
                    <span className={`font-bold ${netPower >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {netPower > 0 ? `+${netPower}` : netPower} W
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500">LiFePO4 Reserve:</span>
                    <span className="font-bold text-slate-800">{Math.round(batteryLevel)}%</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Sunlight Intensity Slider */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Sunlight Irradiance Intensity
                </span>
                <span className="font-mono text-amber-600 font-extrabold text-sm">{sunlightIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={sunlightIntensity}
                onChange={(e) => setSunlightIntensity(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 shadow-inner"
              />
              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: '0% Night', val: 0, preset: 'NIGHT' },
                  { label: '40% Overcast', val: 40, preset: 'PARTLY_CLOUDY' },
                  { label: '75% Daylight', val: 75, preset: 'SUNNY' },
                  { label: '100% Peak', val: 100, preset: 'HEATWAVE' },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => {
                      setSunlightIntensity(s.val);
                      applyWeatherPreset(s.preset);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition ${
                      sunlightIntensity === s.val
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Energy Warning Notice */}
          <div className={`p-3 rounded-xl border text-xs font-mono flex items-center space-x-2 ${
            totalAvailablePower < settings.minSolarEnergyWatts
              ? 'bg-red-50 text-red-800 border-red-300'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {totalAvailablePower < settings.minSolarEnergyWatts ? (
              <>
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span><strong>LOW SOLAR WARNING:</strong> Available energy below minimum threshold ({settings.minSolarEnergyWatts}W). Pump disabled.</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Virtual Solar Generation is adequate to power pump & actuators.</span>
              </>
            )}
          </div>
        </div>

        {/* ================= SECTION 9: WATER TANK & PUMP SIMULATION ================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                  <Droplet className="w-5 h-5 fill-sky-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                    Virtual Storage Tank & Hydraulic Pump
                  </h3>
                  <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-mono font-semibold border border-sky-200">
                    Simulated Reservoir & Impeller Pump
                  </span>
                </div>
              </div>

              {/* Refill Button */}
              <button
                type="button"
                onClick={() => refillWaterTank(100)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm shadow-sky-600/30 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Refill Tank</span>
              </button>
            </div>

            {/* Tank & Pump Gauge Layout */}
            <div className="bg-gradient-to-br from-sky-50/60 via-slate-50 to-blue-50/40 rounded-2xl p-4 border border-sky-200/60 mb-5 relative overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                
                {/* Tank Level Section */}
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Reservoir Storage</span>
                  <div className="flex items-baseline space-x-1.5 mb-1.5">
                    <span className={`text-3xl font-black font-mono tracking-tight ${
                      tankLevel <= 5 ? 'text-red-600 animate-pulse' : 'text-sky-700'
                    }`}>
                      {tankLevel.toFixed(1)}%
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      ({currentTankLiters.toLocaleString()} / {tankCapacity.toLocaleString()} L)
                    </span>
                  </div>

                  {/* Liquid Progress Meter */}
                  <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        tankLevel <= 5
                          ? 'bg-red-500 animate-pulse'
                          : tankLevel <= 20
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-sky-400 to-blue-600'
                      }`}
                      style={{ width: `${Math.max(3, tankLevel)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Master Pump Switch / Status */}
                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Pump Operation
                    </span>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className={`w-3 h-3 rounded-full ${pumpStatus ? 'bg-sky-500 animate-ping' : 'bg-slate-300'}`}></span>
                      <span className={`text-sm font-extrabold font-mono ${pumpStatus ? 'text-sky-600' : 'text-slate-400'}`}>
                        {pumpStatus ? 'PUMP RUNNING' : 'PUMP STOPPED'}
                      </span>
                    </div>
                  </div>

                  {/* Manual Pump Toggle (Active in Manual Mode) */}
                  <button
                    type="button"
                    onClick={toggleManualPump}
                    disabled={controlMode === 'AUTOMATIC'}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                      controlMode === 'AUTOMATIC'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                        : manualPumpOverride
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30'
                        : 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/30'
                    }`}
                    title={controlMode === 'AUTOMATIC' ? 'Switch to MANUAL MODE to toggle pump directly' : 'Toggle Pump'}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{manualPumpOverride ? 'Stop Pump' : 'Start Pump'}</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Manual Zone Solenoid Selectors */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Individual Zone Solenoid Valves (Manual Override)</span>
                <span className="text-[10px] text-slate-400 font-mono">Open valve to permit flow</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => toggleZoneValve(zone.id)}
                    className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                      zone.valveOpen
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold font-mono">Zone {zone.id}</span>
                      <span className={`w-2 h-2 rounded-full ${zone.valveOpen ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    </div>
                    <span className="text-xs font-extrabold truncate">{zone.crop.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono mt-1 opacity-80">
                      {zone.valveOpen ? 'VALVE: OPEN' : 'VALVE: CLOSED'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Low Water Warning Notice */}
          <div className={`p-3 rounded-xl border text-xs font-mono flex items-center space-x-2 ${
            tankLevel <= settings.minTankLevel
              ? 'bg-red-50 text-red-800 border-red-300 animate-pulse'
              : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            {tankLevel <= settings.minTankLevel ? (
              <>
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span><strong>CRITICAL WATER LEVEL:</strong> Tank level &lt;= 5%. Dry-run protection interlock active. Refill reservoir to proceed.</span>
              </>
            ) : (
              <>
                <Droplet className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>Water tank safe ({currentTankLiters} L). Cumulative consumed: <strong>{totalWaterUsed.toFixed(1)} L</strong>.</span>
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

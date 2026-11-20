import React, { useState } from 'react';
import { 
  Sprout, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sun, 
  CloudRain, 
  CloudSun, 
  Flame, 
  Moon, 
  GraduationCap, 
  Zap, 
  LayoutDashboard, 
  Eye, 
  Sliders, 
  BarChart3, 
  History, 
  Settings as SettingsIcon,
  Sparkles,
  FileText,
  PlusCircle
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const Header = ({ 
  activeTab, 
  setActiveTab, 
  onOpenVivaModal, 
  onOpenDemoModal, 
  onOpenSettingsModal,
  onOpenAddZoneModal,
  onOpenReportModal
}) => {
  const {
    isRunning,
    setIsRunning,
    simulationSpeed,
    setSimulationSpeed,
    audioMuted,
    setAudioMuted,
    resetSimulation,
    weatherPreset,
    applyWeatherPreset,
    controlMode,
    pumpStatus
  } = useSimulation();

  const [weatherMenuOpen, setWeatherMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Live Monitoring', icon: Eye },
    { id: 'control', label: 'Irrigation Control', icon: Sliders },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'history', label: 'History Logs', icon: History },
  ];

  const weatherIcons = {
    SUNNY: Sun,
    PARTLY_CLOUDY: CloudSun,
    HEATWAVE: Flame,
    RAINY: CloudRain,
    NIGHT: Moon,
  };

  const WeatherIconComponent = weatherIcons[weatherPreset] || Sun;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20">
              <Sprout className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 bg-clip-text text-transparent">
                  AquaSolar IoT
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  100% Virtual Simulator
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Solar-Powered Smart Irrigation System – Virtual Simulation
              </p>
            </div>
          </div>

          {/* Quick Simulation Action Toolbar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Status Indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium">
              <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? (pumpStatus ? 'bg-sky-500 animate-ping' : 'bg-emerald-500') : 'bg-amber-400'}`}></span>
              <span className="text-slate-700 font-semibold">
                {isRunning ? (pumpStatus ? 'PUMP ACTIVE' : 'SYSTEM IDLE') : 'SIMULATION PAUSED'}
              </span>
              <span className="text-slate-400">|</span>
              <span className={`px-1.5 py-0.2 rounded font-bold ${controlMode === 'AUTOMATIC' ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50'}`}>
                {controlMode}
              </span>
            </div>

            {/* Weather Preset Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setWeatherMenuOpen(!weatherMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-sm"
                title="Change Virtual Weather & Sunlight"
              >
                <WeatherIconComponent className={`w-4 h-4 ${weatherPreset === 'HEATWAVE' ? 'text-amber-500' : weatherPreset === 'RAINY' ? 'text-sky-500' : 'text-yellow-500'}`} />
                <span className="hidden sm:inline capitalize">{weatherPreset.replace('_', ' ').toLowerCase()}</span>
              </button>

              {weatherMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setWeatherMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Virtual Weather Preset
                  </div>
                  {[
                    { key: 'SUNNY', label: 'Clear Sunny (92%)', icon: Sun, color: 'text-amber-500' },
                    { key: 'PARTLY_CLOUDY', label: 'Partly Cloudy (50%)', icon: CloudSun, color: 'text-sky-500' },
                    { key: 'HEATWAVE', label: 'Heatwave (100%)', icon: Flame, color: 'text-red-500' },
                    { key: 'RAINY', label: 'Rain Shower (Refill)', icon: CloudRain, color: 'text-blue-500' },
                    { key: 'NIGHT', label: 'Night (0% Solar)', icon: Moon, color: 'text-indigo-400' },
                  ].map((w) => {
                    const Icon = w.icon;
                    return (
                      <button
                        key={w.key}
                        type="button"
                        onClick={() => {
                          applyWeatherPreset(w.key);
                          setWeatherMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2.5 hover:bg-slate-50 transition ${weatherPreset === w.key ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600'}`}
                      >
                        <Icon className={`w-4 h-4 ${w.color}`} />
                        <span>{w.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition ${
                isRunning
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
              title={isRunning ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span className="hidden sm:inline">{isRunning ? 'Pause' : 'Start'}</span>
            </button>

            {/* Speed Selector (1x, 2x, 5x) */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setSimulationSpeed(spd)}
                  className={`px-2 py-1 rounded font-medium transition ${
                    simulationSpeed === spd
                      ? 'bg-white text-emerald-700 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`${spd}x Real-time Speed`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setAudioMuted(!audioMuted)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
              title={audioMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            {/* INSERT NEW ZONE BUTTON */}
            <button
              type="button"
              onClick={onOpenAddZoneModal}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition shadow-sm"
              title="Insert a new crop zone"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">+ Zone</span>
            </button>

            {/* DOWNLOAD PERCENTAGE REPORT BUTTON */}
            <button
              type="button"
              onClick={onOpenReportModal}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold hover:from-teal-700 hover:to-emerald-700 shadow-sm shadow-teal-600/20 transition"
              title="Download Agronomic Simulation Report (in %)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Report (%)</span>
            </button>

            {/* Demo / Viva Presentation Scenarios Button */}
            <button
              type="button"
              onClick={onOpenDemoModal}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold hover:from-amber-600 hover:to-orange-600 shadow-sm shadow-orange-500/20 transition"
              title="Run 1-Click College Demo Scenarios"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Demo Scenarios</span>
            </button>

            {/* College Viva Guide Button */}
            <button
              type="button"
              onClick={onOpenVivaModal}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition"
              title="College Project Viva & Architecture Guide"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span className="hidden xl:inline">Viva Guide</span>
            </button>

            {/* Reset Simulation Button */}
            <button
              type="button"
              onClick={resetSimulation}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition"
              title="Reset Simulation to Initial State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Settings Modal Button */}
            <button
              type="button"
              onClick={onOpenSettingsModal}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
              title="System Configuration & Threshold Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 sm:space-x-4 border-t border-slate-100 py-1.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};

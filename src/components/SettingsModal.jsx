import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  RotateCcw, 
  Save, 
  Sliders, 
  Droplet, 
  Sun, 
  Zap, 
  Check 
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, setSettings, addAlert } = useSimulation();

  const [formState, setFormState] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formState);
    setSavedSuccess(true);
    addAlert('success', 'Settings Updated', 'Simulation thresholds and physical engine parameters saved.');
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    const defaultSettings = {
      autoStartThreshold: 30,
      autoStopThreshold: 60,
      minTankLevel: 5,
      minSolarEnergyWatts: 90,
      pumpPowerDrawWatts: 180,
      evaporationRate: 1.0,
      moistureGainRate: 1.4,
      tankCapacityLiters: 5000,
    };
    setFormState(defaultSettings);
    setSettings(defaultSettings);
    addAlert('info', 'Settings Reset', 'Restored default agronomic parameters.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">System Parameters & Thresholds</h3>
              <p className="text-[11px] text-slate-500">Fine-tune the automatic closed-loop irrigation algorithms.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Section: Soil Moisture Triggers */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-sky-500" />
              Soil Moisture Activation Triggers
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Auto-Start Moisture Threshold
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="10"
                    max="50"
                    value={formState.autoStartThreshold}
                    onChange={(e) => handleChange('autoStartThreshold', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-mono text-slate-500 font-bold">% VWC</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Pump starts when moisture falls below this value (Default: 30%).</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Auto-Stop Moisture Threshold
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="40"
                    max="90"
                    value={formState.autoStopThreshold}
                    onChange={(e) => handleChange('autoStopThreshold', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-mono text-slate-500 font-bold">% VWC</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Pump shuts off when soil hits this moisture (Default: 60%).</p>
              </div>
            </div>
          </div>

          {/* Section: Safety Interlocks */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Safety Interlocks & Hardware Cutoffs
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Minimum Water Reservoir Level
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formState.minTankLevel}
                    onChange={(e) => handleChange('minTankLevel', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-mono text-slate-500 font-bold">% Level</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Prevents dry-run pump damage below this level (Default: 5%).</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Minimum Solar Power Margin
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="50"
                    max="200"
                    value={formState.minSolarEnergyWatts}
                    onChange={(e) => handleChange('minSolarEnergyWatts', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-mono text-slate-500 font-bold">Watts</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Required solar/battery power to crank pump (Default: 90W).</p>
              </div>
            </div>
          </div>

          {/* Section: Physical Engine Speeds */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-orange-500" />
              Evaporation & Absorption Dynamics
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Natural Evaporation Multiplier
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.2"
                    min="0.2"
                    max="4.0"
                    value={formState.evaporationRate}
                    onChange={(e) => handleChange('evaporationRate', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-mono text-slate-500 font-bold">x Rate</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Accelerates or slows soil drying due to climate.</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Sprinkler Hydration Gain Rate
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.2"
                    min="0.5"
                    max="3.0"
                    value={formState.moistureGainRate}
                    onChange={(e) => handleChange('moistureGainRate', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-mono text-slate-500 font-bold">%/sec</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Moisture added per second when sprinkler is active.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Factory Defaults</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-emerald-600/30"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

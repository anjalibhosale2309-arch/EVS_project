import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Sprout, 
  Droplet, 
  Layers, 
  MapPin, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const AddZoneModal = ({ isOpen, onClose }) => {
  const { addZone, zones } = useSimulation();

  const nextZoneNumber = zones.length > 0 ? Math.max(...zones.map((z) => z.id)) + 1 : 1;

  const CROP_PRESETS = [
    { name: 'Sugarcane (Cash Crop)', cropType: 'Sugarcane', emoji: '🎋', soil: 'Black Cotton Soil', defaultMoisture: 38, flowRate: 18.0, color: '#10b981' },
    { name: 'Soybean (Pulse Crop)', cropType: 'Soybean', emoji: '🌱', soil: 'Clay Loam', defaultMoisture: 32, flowRate: 14.0, color: '#84cc16' },
    { name: 'Rice / Paddy (Wet Crop)', cropType: 'Rice', emoji: '🌾', soil: 'Alluvial Clay', defaultMoisture: 45, flowRate: 20.0, color: '#06b6d4' },
    { name: 'Onion & Garlic', cropType: 'Onion', emoji: '🧅', soil: 'Sandy Loam', defaultMoisture: 28, flowRate: 12.0, color: '#a855f7' },
    { name: 'Potato & Tubers', cropType: 'Potato', emoji: '🥔', soil: 'Loose Loam', defaultMoisture: 34, flowRate: 13.5, color: '#f97316' },
    { name: 'Grapes / Vineyard', cropType: 'Grapes', emoji: '🍇', soil: 'Gravelly Loam', defaultMoisture: 30, flowRate: 11.0, color: '#ec4899' },
    { name: 'Chilli & Pepper', cropType: 'Chilli', emoji: '🌶️', soil: 'Red Loam', defaultMoisture: 26, flowRate: 12.5, color: '#ef4444' },
  ];

  const [selectedPreset, setSelectedPreset] = useState(CROP_PRESETS[0]);
  const [zoneName, setZoneName] = useState(`Zone ${nextZoneNumber} – Field ${String.fromCharCode(64 + nextZoneNumber)}`);
  const [cropTitle, setCropTitle] = useState(CROP_PRESETS[0].name);
  const [cropType, setCropType] = useState(CROP_PRESETS[0].cropType);
  const [soilType, setSoilType] = useState(CROP_PRESETS[0].soil);
  const [moisture, setMoisture] = useState(CROP_PRESETS[0].defaultMoisture);
  const [area, setArea] = useState('1.2 Acres');
  const [flowRate, setFlowRate] = useState(CROP_PRESETS[0].flowRate);
  const [color, setColor] = useState(CROP_PRESETS[0].color);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setCropTitle(preset.name);
    setCropType(preset.cropType);
    setSoilType(preset.soil);
    setMoisture(preset.defaultMoisture);
    setFlowRate(preset.flowRate);
    setColor(preset.color);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = addZone({
      name: zoneName.trim() || `Zone ${nextZoneNumber} – Crop Field`,
      crop: cropTitle,
      cropType: cropType,
      soilType: soilType,
      moisture: Number(moisture),
      area: area.trim() || '1.0 Acres',
      flowRate: Number(flowRate) || 15.0,
      color: color,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Insert New Crop Zone</h3>
              <p className="text-[11px] text-emerald-100">Configure a new agricultural field and connect it to the irrigation manifold.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-emerald-200 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Preset Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Crop Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CROP_PRESETS.map((p) => (
                <button
                  key={p.cropType}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2 rounded-xl border text-left text-xs transition flex items-center space-x-2 ${
                    selectedPreset.cropType === p.cropType
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-base">{p.emoji}</span>
                  <span className="truncate">{p.cropType}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zone Name & Crop Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Zone Display Name</label>
              <input
                type="text"
                required
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="e.g. Zone 5 – Field E"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Crop Description</label>
              <input
                type="text"
                required
                value={cropTitle}
                onChange={(e) => setCropTitle(e.target.value)}
                placeholder="e.g. Sugarcane (Cash Crop)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Soil Type & Field Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Black Cotton Soil">Black Cotton Soil</option>
                <option value="Loamy Soil">Loamy Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
                <option value="Red Laterite Soil">Red Laterite Soil</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Field Area</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. 1.5 Acres"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Initial Moisture & Flow Rate */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Initial Soil Moisture</span>
                <span className="font-mono text-emerald-700">{moisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="1"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>10% (Dry - will auto-water)</span>
                <span>80% (Moist)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-700 pt-2 border-t border-slate-200">
              <span>Sprinkler Flow Rate</span>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step="0.5"
                  min="8"
                  max="30"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 text-center"
                />
                <span className="text-slate-500 font-mono text-[11px]">L/min</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-emerald-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Zone to Manifold</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

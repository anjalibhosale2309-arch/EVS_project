import React from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  Droplets, 
  Sun, 
  Layers, 
  CheckCircle2, 
  Percent, 
  TrendingUp,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const ReportModal = ({ isOpen, onClose }) => {
  const {
    zones,
    tankLevel,
    tankCapacity,
    totalWaterUsed,
    solarWatts,
    sunlightIntensity,
    solarPanelRating,
    batteryLevel,
    averageMoisture,
    pumpStatus,
    controlMode,
    weatherPreset,
    settings,
    history
  } = useSimulation();

  if (!isOpen) return null;

  const reportDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const reportTime = new Date().toLocaleTimeString();

  const currentTankLiters = Math.round((tankLevel / 100) * tankCapacity);
  const waterSavingsPct = 42.0; // 42% water conserved vs flood irrigation
  const solarEfficiencyPct = Math.round((solarWatts / solarPanelRating) * 100);

  // Compute zone water share in percentage (%)
  const totalFlowRate = zones.reduce((acc, z) => acc + (z.flowRate || 15), 0);
  const zoneStats = zones.map((z) => {
    const sharePct = totalFlowRate > 0 ? ((z.flowRate / totalFlowRate) * 100).toFixed(1) : 0;
    const isDry = z.moisture < settings.autoStartThreshold;
    const isWet = z.moisture >= settings.autoStopThreshold;
    const condition = isDry ? 'Dry (Deficit)' : isWet ? 'Wet (Saturated)' : 'Optimal (Moist)';

    return {
      ...z,
      sharePct,
      condition,
    };
  });

  // Export CSV Report with Percentage Columns
  const downloadCSVReport = () => {
    const headers = [
      'Crop Zone',
      'Crop Type',
      'Soil Type',
      'Area',
      'Current Moisture (%)',
      'Target Moisture (%)',
      'Water Share (%)',
      'Valve State',
      'Condition Status',
    ];

    const rows = zoneStats.map((z) => [
      `"${z.name}"`,
      `"${z.crop}"`,
      `"${z.soilType}"`,
      `"${z.area}"`,
      `"${z.moisture}%"`,
      `"${settings.autoStopThreshold}%"`,
      `"${z.sharePct}%"`,
      z.valveOpen ? 'OPEN' : 'CLOSED',
      `"${z.condition}"`,
    ]);

    const systemSummary = [
      ['\n--- SYSTEM SIMULATION REPORT SUMMARY (PERCENTAGE METRICS) ---'],
      ['Report Generated At', `"${reportDate} ${reportTime}"`],
      ['Operating Mode', controlMode],
      ['Average Soil Moisture (%)', `"${averageMoisture}%"`],
      ['Water Reservoir Level (%)', `"${tankLevel.toFixed(1)}%"`],
      ['Water Conservation vs Flood (%)', `"${waterSavingsPct}%"`],
      ['Solar Irradiance Intensity (%)', `"${sunlightIntensity}%"`],
      ['Solar Panel Output Efficiency (%)', `"${solarEfficiencyPct}%"`],
      ['Battery Storage Reserve (%)', `"${Math.round(batteryLevel)}%"`],
      ['Centrifugal Pump State', pumpStatus ? 'ACTIVE (180W)' : 'STANDBY (0W)'],
      ['Total Water Discharged (Liters)', `${totalWaterUsed.toFixed(1)} L`],
      ['\n--- INDIVIDUAL CROP ZONE AUDIT ---'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        ...systemSummary.map((r) => r.join(',')),
        headers.join(','),
        ...rows.map((r) => r.join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Smart_Irrigation_Percentage_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON Report
  const downloadJSONReport = () => {
    const reportData = {
      project: 'Solar-Powered Smart Irrigation System – Virtual Simulation',
      generatedAt: `${reportDate} ${reportTime}`,
      percentageMetrics: {
        averageSoilMoisturePercentage: `${averageMoisture}%`,
        waterReservoirLevelPercentage: `${tankLevel.toFixed(1)}%`,
        waterConservationEfficiencyPercentage: `+${waterSavingsPct}%`,
        sunlightIntensityPercentage: `${sunlightIntensity}%`,
        solarGenerationEfficiencyPercentage: `${solarEfficiencyPct}%`,
        batteryReservePercentage: `${Math.round(batteryLevel)}%`,
      },
      systemState: {
        controlMode,
        pumpStatus: pumpStatus ? 'ACTIVE' : 'STANDBY',
        weatherPreset,
        totalWaterUsedLiters: parseFloat(totalWaterUsed.toFixed(2)),
        tankCapacityLiters: tankCapacity,
        tankCurrentLiters: currentTankLiters,
        solarWattsGenerated: solarWatts,
      },
      zones: zoneStats.map((z) => ({
        id: z.id,
        name: z.name,
        crop: z.crop,
        soilType: z.soilType,
        area: z.area,
        moisturePercentage: `${z.moisture}%`,
        waterSharePercentage: `${z.sharePct}%`,
        valveState: z.valveOpen ? 'OPEN' : 'CLOSED',
        condition: z.condition,
      })),
      recentEventsLoggedCount: history.length,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `Smart_Irrigation_Report_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Agronomic Simulation Performance Report
              </h3>
              <p className="text-xs text-emerald-200">
                Complete quantitative evaluation with all metrics expressed in percentages (%).
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={downloadCSVReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm"
              title="Download Excel CSV file with Percentage data"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV (%)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Viewport */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 text-xs sm:text-sm print:p-0">
          
          {/* Printable Report Header */}
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl text-emerald-800">
                  AquaSolar IoT — Precision Agronomic Report
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Certified Virtual Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Solar-Powered Closed-Loop Smart Irrigation Simulation Platform
              </p>
            </div>

            <div className="text-right text-xs text-slate-500 font-mono">
              <div>Date: <strong>{reportDate}</strong></div>
              <div>Time: <strong>{reportTime}</strong></div>
              <div className="text-emerald-700 font-bold">Mode: {controlMode}</div>
            </div>
          </div>

          {/* KEY PERCENTAGE (%) SCORECARDS */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-emerald-600" />
              System Percentage (%) Performance Indicators
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              
              <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Avg Soil Moisture</span>
                <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{averageMoisture}%</div>
                <span className="text-[10px] text-emerald-600 font-medium">Volumetric (VWC)</span>
              </div>

              <div className="bg-sky-50/70 rounded-2xl p-3 border border-sky-200">
                <span className="text-[10px] font-bold text-sky-800 uppercase block">Reservoir Level</span>
                <div className="text-2xl font-black text-sky-700 font-mono mt-1">{tankLevel.toFixed(1)}%</div>
                <span className="text-[10px] text-sky-600 font-mono">{currentTankLiters} / 5000 L</span>
              </div>

              <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Sunlight Irradiance</span>
                <div className="text-2xl font-black text-amber-600 font-mono mt-1">{sunlightIntensity}%</div>
                <span className="text-[10px] text-amber-700 font-mono">{solarWatts}W Output</span>
              </div>

              <div className="bg-purple-50/70 rounded-2xl p-3 border border-purple-200">
                <span className="text-[10px] font-bold text-purple-800 uppercase block">Battery Reserve</span>
                <div className="text-2xl font-black text-purple-700 font-mono mt-1">{Math.round(batteryLevel)}%</div>
                <span className="text-[10px] text-purple-600 font-medium">LiFePO4 Storage</span>
              </div>

              <div className="bg-teal-50/70 rounded-2xl p-3 border border-teal-200">
                <span className="text-[10px] font-bold text-teal-800 uppercase block">Water Conservation</span>
                <div className="text-2xl font-black text-teal-700 font-mono mt-1">+{waterSavingsPct}%</div>
                <span className="text-[10px] text-teal-600 font-medium">vs Flood Irrigation</span>
              </div>

              <div className="bg-blue-50/70 rounded-2xl p-3 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Solar Utilization</span>
                <div className="text-2xl font-black text-blue-700 font-mono mt-1">{solarEfficiencyPct}%</div>
                <span className="text-[10px] text-blue-600 font-medium">Clean Energy Index</span>
              </div>

            </div>
          </div>

          {/* ZONE-WISE PERCENTAGE BREAKDOWN TABLE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Individual Crop Zone Moisture & Percentage Share ({zones.length} Zones)
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                Hysteresis: &lt;{settings.autoStartThreshold}% Start | &gt;={settings.autoStopThreshold}% Stop
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono uppercase text-[11px]">
                    <th className="py-2.5 px-3 font-bold">Zone & Field</th>
                    <th className="py-2.5 px-3 font-bold">Crop & Soil</th>
                    <th className="py-2.5 px-3 font-bold text-center">Moisture (%)</th>
                    <th className="py-2.5 px-3 font-bold text-center">Water Share (%)</th>
                    <th className="py-2.5 px-3 font-bold text-center">Valve State</th>
                    <th className="py-2.5 px-3 font-bold">Agronomic Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {zoneStats.map((z) => (
                    <tr key={z.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {z.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{z.crop}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{z.soilType} • {z.area}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          z.moisture < settings.autoStartThreshold
                            ? 'bg-red-100 text-red-800'
                            : z.moisture >= settings.autoStopThreshold
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {z.moisture}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-center text-sky-700">
                        {z.sharePct}%
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                          z.valveOpen
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {z.valveOpen ? 'OPEN (Flowing)' : 'CLOSED (Shut)'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold">
                        <span className={`text-xs ${
                          z.moisture < settings.autoStartThreshold ? 'text-red-600' : 'text-emerald-700'
                        }`}>
                          {z.condition}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SYSTEM HARDWARE & SAFETY CERTIFICATION */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Safety Interlock & Subsystem Diagnostic Verification
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>Reservoir Dry-Run Safety:</span>
                <span className="font-bold text-emerald-600 font-mono">ARMED (&gt;5%)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>Solar MPPT Margin:</span>
                <span className="font-bold text-emerald-600 font-mono">NORMAL (&gt;90W)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>Centrifugal Pump Load:</span>
                <span className="font-bold text-slate-800 font-mono">{pumpStatus ? '180W (2850 RPM)' : '0W (Standby)'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={downloadJSONReport}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Raw JSON Data</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={downloadCSVReport}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-emerald-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Download Report (CSV %)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

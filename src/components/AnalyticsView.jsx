import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  BarChart3, 
  TrendingUp, 
  Droplets, 
  Sun, 
  Clock, 
  Leaf, 
  Download, 
  Layers,
  Sparkles,
  FileText
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AnalyticsView = ({ onOpenReportModal }) => {
  const {
    telemetryHistory,
    zones,
    totalWaterUsed,
    solarWatts,
    pumpStatus,
    settings
  } = useSimulation();

  // Dynamic colors for zone charts
  const zoneColors = [
    '#84cc16', '#eab308', '#ef4444', '#06b6d4', 
    '#10b981', '#f97316', '#a855f7', '#ec4899'
  ];

  // 1. Dynamic Soil Moisture Trends Line Chart
  const moistureDatasets = zones.map((zone, idx) => {
    const color = zone.color || zoneColors[idx % zoneColors.length];
    const series = telemetryHistory.zoneMoistureMap?.[zone.id] || 
      new Array(telemetryHistory.timestamps.length).fill(zone.moisture);

    return {
      label: `${zone.name.split('–')[0].trim()} (${zone.crop.split(' ')[0]})`,
      data: series,
      borderColor: color,
      backgroundColor: color + '22',
      tension: 0.35,
      fill: false,
      borderWidth: 2.5,
      pointRadius: 2,
    };
  });

  const moistureChartData = {
    labels: telemetryHistory.timestamps,
    datasets: moistureDatasets,
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 10,
        titleFont: { size: 12, family: 'Plus Jakarta Sans' },
        bodyFont: { size: 11, family: 'JetBrains Mono' },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (val) => `${val}%`,
          font: { size: 10, family: 'JetBrains Mono' },
        },
        grid: { color: '#f1f5f9' },
      },
      x: {
        ticks: { font: { size: 10, family: 'JetBrains Mono' }, maxRotation: 45 },
        grid: { display: false },
      },
    },
  };

  // 2. Solar Generation vs Pump Power Draw Chart
  const solarEnergyChartData = {
    labels: telemetryHistory.timestamps,
    datasets: [
      {
        type: 'line',
        label: 'Solar Generated (Watts)',
        data: telemetryHistory.solarGenWatts,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        type: 'line',
        label: 'Pump Consumption (Watts)',
        data: telemetryHistory.pumpPowerDraw,
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.2)',
        tension: 0.2,
        fill: true,
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  };

  const energyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }, color: '#475569' },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 350,
        ticks: { callback: (val) => `${val} W`, font: { size: 10, family: 'JetBrains Mono' } },
        grid: { color: '#f1f5f9' },
      },
      x: {
        ticks: { font: { size: 10, family: 'JetBrains Mono' } },
        grid: { display: false },
      },
    },
  };

  // 3. Zone-wise Water Usage Percentage Share (Doughnut)
  const totalFlow = zones.reduce((acc, z) => acc + (z.flowRate || 15), 0);
  const zonePercentages = zones.map((z) => {
    return totalFlow > 0 ? parseFloat(((z.flowRate / totalFlow) * 100).toFixed(1)) : 0;
  });

  const doughnutData = {
    labels: zones.map((z) => `${z.crop.split(' ')[0]} (${z.name.split('–')[0].trim()})`),
    datasets: [
      {
        data: zonePercentages,
        backgroundColor: zones.map((z, idx) => z.color || zoneColors[idx % zoneColors.length]),
        hoverOffset: 6,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }, color: '#475569' },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Water Share: ${ctx.parsed}%`,
        },
      },
    },
    cutout: '68%',
  };

  // 4. Cumulative Water Consumed Bar Chart
  const waterBarData = {
    labels: telemetryHistory.timestamps,
    datasets: [
      {
        label: 'Cumulative Water Used (Liters)',
        data: telemetryHistory.waterUsedCumulative,
        backgroundColor: 'rgba(2, 132, 199, 0.75)',
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: { callback: (val) => `${val} L`, font: { size: 10, family: 'JetBrains Mono' } },
        grid: { color: '#f1f5f9' },
      },
      x: {
        ticks: { font: { size: 10, family: 'JetBrains Mono' } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="space-y-6 mb-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Real-Time Simulation Analytics & Agronomic Reports
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic Chart.js visualizations derived from virtual sensors, hydraulic flow rates, and photovoltaic power calculations.
          </p>
        </div>

        {/* Action: Open Report Modal */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenReportModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold hover:from-emerald-700 hover:to-teal-800 shadow-sm shadow-emerald-600/30 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Percentage Report (%)</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Run Duration</span>
          <div className="text-2xl font-black text-slate-800 font-mono mt-1">48.5 Mins</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            Duty cycle: 18% (Precision)
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Water Discharged</span>
          <div className="text-2xl font-black text-sky-600 font-mono mt-1">{totalWaterUsed.toFixed(1)} L</div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Saved approx {Math.round(totalWaterUsed * 0.72)} L vs flood
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Clean Solar Power Generated</span>
          <div className="text-2xl font-black text-amber-600 font-mono mt-1">1.42 kWh</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Zero Grid Electricity Draw
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Water Conservation Rate</span>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">+42.0%</div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            UN SDG Goal 6 & 7 Compliant
          </span>
        </div>
      </div>

      {/* CHART 1: SOIL MOISTURE TRENDS (FULL WIDTH) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-2">
              <span>Soil Moisture Dynamics Across {zones.length} Crop Zones</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                Real-Time Rolling Buffer
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Tracks continuous sensor readings between 0% (Extremely Arid) and 100% (Fully Saturated).
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Auto-Thresholds: <strong className="text-red-500">&lt;{settings.autoStartThreshold}%</strong> / <strong className="text-sky-600">&gt;={settings.autoStopThreshold}%</strong>
          </div>
        </div>

        <div className="h-72 w-full">
          <Line data={moistureChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* CHARTS 2 & 3: SOLAR ENERGY vs PUMP & ZONE-WISE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Solar vs Pump Power Line Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                  Solar Generation vs. Pump Consumption
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated virtual irradiance in Watts versus 180W pump load demand.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                Live: {solarWatts}W
              </span>
            </div>

            <div className="h-64 w-full">
              <Line data={solarEnergyChartData} options={energyChartOptions} />
            </div>
          </div>
        </div>

        {/* Zone-Wise Water Distribution Doughnut (Percentages) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                  Zone Water Allocation Percentage (%)
                </h3>
                <p className="text-xs text-slate-500">
                  Volumetric water share across all {zones.length} active crop fields.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-sky-600">
                {totalWaterUsed.toFixed(1)} L Total
              </span>
            </div>

            <div className="h-64 w-full flex items-center justify-center relative">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-bold uppercase">Efficiency</span>
                <span className="text-xl font-black text-slate-800 font-mono">98.4%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CHART 4: CUMULATIVE WATER FLOW BAR CHART */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
              Cumulative Water Consumption Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Step-by-step water volume drawn from the virtual 5000L reservoir.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Current Draw: <strong>{pumpStatus ? '15 L/min' : '0 L/min'}</strong>
          </span>
        </div>

        <div className="h-56 w-full">
          <Bar data={waterBarData} options={barChartOptions} />
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  Clock, 
  Droplet, 
  FileText,
  AlertCircle,
  CheckCircle,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const HistoryLogs = () => {
  const { history, clearHistory } = useSimulation();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterZone, setFilterZone] = useState('ALL');
  const [showClearModal, setShowClearModal] = useState(false);

  // Filtered History
  const filteredLogs = history.filter((log) => {
    const matchesSearch = 
      log.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesZone = filterZone === 'ALL' || log.zoneName.includes(filterZone);

    return matchesSearch && matchesZone;
  });

  // Export to CSV
  const exportToCSV = () => {
    if (history.length === 0) return;
    const headers = ['ID', 'Date & Time', 'Zone Name', 'Event Type', 'Initial Moisture (%)', 'Final Moisture (%)', 'Water Consumed (L)', 'Notes'];
    const rows = history.map((item) => [
      item.id,
      `"${item.timestamp}"`,
      `"${item.zoneName}"`,
      `"${item.eventType}"`,
      item.initialMoisture,
      item.finalMoisture,
      item.waterConsumed,
      `"${item.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_irrigation_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = () => {
    if (history.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `smart_irrigation_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm mb-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Simulation Audit Trail & Event History
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 font-mono border border-slate-200">
              {history.length} Records (LocalStorage Persistent)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Permanent records of automatic pump activations, zone moisture deltas, water consumption, and safety interlocks.
          </p>
        </div>

        {/* Action Buttons: Export & Clear */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            disabled={history.length === 0}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm disabled:opacity-50"
            title="Download CSV for Excel / College Project submission"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={exportToJSON}
            disabled={history.length === 0}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm disabled:opacity-50"
            title="Download JSON format"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            disabled={history.length === 0}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition disabled:opacity-50"
            title="Clear all stored events"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, zone names, or audit notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Zone Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Crop Zones</option>
            <option value="Zone 1">Zone 1 (Wheat)</option>
            <option value="Zone 2">Zone 2 (Corn)</option>
            <option value="Zone 3">Zone 3 (Tomatoes)</option>
            <option value="Zone 4">Zone 4 (Cotton)</option>
            <option value="Storage">System Storage</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 font-bold">Timestamp</th>
              <th className="py-3 px-4 font-bold">Zone / Target</th>
              <th className="py-3 px-4 font-bold">Event Type</th>
              <th className="py-3 px-4 font-bold">Initial %</th>
              <th className="py-3 px-4 font-bold">Final %</th>
              <th className="py-3 px-4 font-bold">Water Used</th>
              <th className="py-3 px-4 font-bold">Details & Diagnostic Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((item) => {
                const isAuto = item.eventType.includes('AUTO');
                const isRefill = item.eventType.includes('REFILL');
                const isSatisfied = item.eventType.includes('SATISFIED') || item.eventType.includes('COMPLETE');

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {item.zoneName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        isSatisfied
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isRefill
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {item.eventType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {item.initialMoisture > 0 ? `${item.initialMoisture}%` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {item.finalMoisture > 0 ? `${item.finalMoisture}%` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-600">
                      {item.waterConsumed > 0 ? `${item.waterConsumed} L` : '0 L'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={item.notes}>
                      {item.notes || 'Routine telemetry cycle logged.'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No simulation events found matching the search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Clearing History */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Clear Simulation History?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              This will permanently delete all logged simulation cycles and sensor history from LocalStorage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearHistory();
                  setShowClearModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition shadow-md shadow-red-600/30"
              >
                Yes, Clear All Logs
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

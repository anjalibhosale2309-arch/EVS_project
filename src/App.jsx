import React, { useState } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { FarmSimulationArea } from './components/FarmSimulationArea';
import { SensorMonitoring } from './components/SensorMonitoring';
import { ControlPanel } from './components/ControlPanel';
import { AnalyticsView } from './components/AnalyticsView';
import { HistoryLogs } from './components/HistoryLogs';
import { SettingsModal } from './components/SettingsModal';
import { DemoScenariosModal } from './components/DemoScenariosModal';
import { VivaGuideModal } from './components/VivaGuideModal';
import { AddZoneModal } from './components/AddZoneModal';
import { ReportModal } from './components/ReportModal';
import { AlertNotificationToast } from './components/AlertNotificationToast';
import { useSimulation } from './context/SimulationContext';
import { 
  Sprout, 
  Sun, 
  Droplet, 
  Cpu, 
  ShieldCheck, 
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { controlMode, pumpStatus, activeZonesCount } = useSimulation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVivaModal={() => setIsVivaModalOpen(true)}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenAddZoneModal={() => setIsAddZoneModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        
        {/* Dynamic Summary Metric Cards */}
        <SummaryCards />

        {/* TAB 1: DASHBOARD VIEW (Comprehensive Overview) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Interactive Top-View 2D CAD Farm Layout */}
            <FarmSimulationArea onOpenAddZoneModal={() => setIsAddZoneModalOpen(true)} />

            {/* Quick Virtual Sensor Monitoring Row */}
            <SensorMonitoring onOpenAddZoneModal={() => setIsAddZoneModalOpen(true)} />

            {/* Control Panel Section */}
            <ControlPanel />
          </div>
        )}

        {/* TAB 2: LIVE MONITORING */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <FarmSimulationArea onOpenAddZoneModal={() => setIsAddZoneModalOpen(true)} />
            <SensorMonitoring onOpenAddZoneModal={() => setIsAddZoneModalOpen(true)} />
          </div>
        )}

        {/* TAB 3: IRRIGATION CONTROL */}
        {activeTab === 'control' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ControlPanel />
            <SensorMonitoring onOpenAddZoneModal={() => setIsAddZoneModalOpen(true)} />
          </div>
        )}

        {/* TAB 4: ANALYTICS & REPORTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <AnalyticsView onOpenReportModal={() => setIsReportModalOpen(true)} />
          </div>
        )}

        {/* TAB 5: HISTORY LOGS */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <HistoryLogs />
          </div>
        )}

      </main>

      {/* Modern Agricultural Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-800">AquaSolar IoT</span>
            <span>— Solar-Powered Smart Irrigation System (Virtual Simulation)</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-500">
            <button 
              type="button" 
              onClick={() => setIsReportModalOpen(true)}
              className="hover:text-emerald-700 font-bold text-emerald-800 transition"
            >
              Download Report (%)
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => setIsAddZoneModalOpen(true)}
              className="hover:text-emerald-700 font-semibold transition"
            >
              + Insert Crop Zone
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => setIsVivaModalOpen(true)}
              className="hover:text-indigo-700 font-semibold transition"
            >
              Viva Guide
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => setIsDemoModalOpen(true)}
              className="hover:text-amber-600 font-semibold transition"
            >
              Demo Scenarios
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => setIsSettingsModalOpen(true)}
              className="hover:text-slate-800 font-semibold transition"
            >
              Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Alert Notification Toast */}
      <AlertNotificationToast />

      {/* System Settings & Thresholds Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* 1-Click College Demo Scenarios Modal */}
      <DemoScenariosModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* College Project Viva & Architecture Guide Modal */}
      <VivaGuideModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
      />

      {/* Insert New Crop Zone Modal */}
      <AddZoneModal
        isOpen={isAddZoneModalOpen}
        onClose={() => setIsAddZoneModalOpen(false)}
      />

      {/* Download Agronomic Simulation Report (Percentages) Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

    </div>
  );
}

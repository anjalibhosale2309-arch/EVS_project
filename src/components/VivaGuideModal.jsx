import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  BookOpen, 
  Cpu, 
  HelpCircle, 
  FileCheck, 
  Layers, 
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Sun,
  Droplet
} from 'lucide-react';

export const VivaGuideModal = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('abstract');
  const [expandedFaq, setExpandedFaq] = useState(0);

  if (!isOpen) return null;

  const vivaQuestions = [
    {
      q: 'Q1: What is the primary objective of this Solar-Powered Smart Irrigation System simulation?',
      a: 'The objective is to model an autonomous, closed-loop precision agricultural irrigation system powered by photovoltaic solar energy. It replaces traditional flood irrigation with targeted drip/sprinkler hydration, eliminating manual guesswork, conserving up to 40-50% water, and functioning without dependence on the electrical utility grid.'
    },
    {
      q: 'Q2: Why is a 100% Software Simulation used instead of physical hardware?',
      a: 'A software simulation allows exhaustive testing of extreme edge cases (such as prolonged drought, solar panel dust shading, reservoir depletion, and pump dry-run risks) that could physically damage hardware or take months to observe in a physical field. It provides verifiable, reproducible telemetry and dynamic state visualization with zero hardware cost or component wear.'
    },
    {
      q: 'Q3: How is the physical hardware mapped to software algorithms?',
      a: 'The system maps: 1) Capacitive Soil Moisture Sensors -> State-driven Volumetric Water Content (VWC%) engine with natural evapotranspiration decay; 2) Monocrystalline Solar Panel -> Photovoltaic irradiance model calculating instantaneous Watts (P = P_max * Irradiance% * Efficiency); 3) Submersible Water Pump -> Centrifugal hydraulic flow rate model with dry-run interlock; 4) Microcontroller (Arduino/ESP32) -> React State Loop with hysteresis thresholding (<30% start, >=60% stop).'
    },
    {
      q: 'Q4: What is the hysteresis logic implemented for the automatic irrigation?',
      a: 'To prevent erratic high-frequency pump chatter (rapid switching ON and OFF around a single setpoint), the system uses a dual-threshold hysteresis window: the pump and zone valve only engage when moisture drops below 30% (depletion point), and continue watering until moisture reaches 60% (field capacity). This protects relay contacts, motor windings, and hydraulic pipes.'
    },
    {
      q: 'Q5: What safety interlocks protect the pump and power systems?',
      a: '1) Dry-run safety interlock: If the water reservoir falls to or below 5%, the pump is automatically locked out with a critical alarm to prevent impeller burnout. 2) Solar-power deficit interlock: If generated solar watts plus battery buffer falls below 90W, the system suspends operation until sufficient sunlight returns.'
    },
    {
      q: 'Q6: How does the system handle multi-zone irrigation?',
      a: 'Rather than flooding the entire farm simultaneously, each of the 4 zones (Wheat, Corn, Tomatoes, Cotton) has an independent virtual capacitive moisture sensor and an isolated 24V solenoid valve. The master pump only activates if at least one valve requires water, conserving hydraulic pressure and reservoir volume.'
    },
    {
      q: 'Q7: How is solar power calculated in the mathematical model?',
      a: 'Power generation follows P(t) = P_rated * (G(t) / G_STC) * η, where P_rated is 320W, G(t) is virtual sunlight intensity (0-100%), G_STC is Standard Test Conditions (1000 W/m²), and η represents thermal/dust efficiency (~0.95). Excess power charges the virtual LiFePO4 battery bank.'
    },
    {
      q: 'Q8: How does weather affect the simulation dynamics?',
      a: 'Weather presets dynamically adjust evaporation and absorption rates: Heatwave doubles natural soil drying via enhanced evapotranspiration; Rain Shower suspends pump operation, replenishes the water reservoir via simulated rainwater harvesting, and naturally hydrates the soil.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                College Project Viva & Academic Defense Guide
              </h3>
              <p className="text-xs text-emerald-200">
                Architectural blueprints, mathematical modeling, and top viva examination Q&As.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Sub-nav */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-4 text-xs font-bold text-slate-600 overflow-x-auto">
          {[
            { id: 'abstract', label: '1. Project Abstract & Objectives' },
            { id: 'architecture', label: '2. System Block Diagram & Flow' },
            { id: 'mapping', label: '3. Hardware vs Software Mapping' },
            { id: 'viva_qa', label: '4. Top 8 Viva Questions & Answers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`py-3 border-b-2 transition whitespace-nowrap ${
                activeSection === tab.id
                  ? 'border-emerald-600 text-emerald-800 font-extrabold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* SECTION 1: ABSTRACT */}
          {activeSection === 'abstract' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-emerald-900">
                <h4 className="font-extrabold text-base mb-1">Executive Project Abstract</h4>
                <p className="text-xs leading-relaxed">
                  Water scarcity and rising agricultural energy demands require intelligent, automated farming technologies. 
                  This project presents the <strong>Solar-Powered Smart Irrigation System — Virtual Simulation</strong>, 
                  a pure software implementation of a closed-loop agronomic management platform. 
                  By simulating solar photovoltaic generation, volumetric soil moisture sensors, 
                  and solenoid-controlled water distribution across four distinct crop zones, 
                  the application demonstrates how autonomous threshold-based control achieves 40% water savings, 
                  zero grid electrical dependence, and eliminates equipment burnout via digital safety interlocks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-sky-500" />
                    Water Conservation
                  </h5>
                  <p className="text-xs text-slate-600">
                    Precision micro-irrigation only triggers when soil moisture falls below 30% and halts at 60%, preventing over-saturation and root rot.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    100% Green Solar
                  </h5>
                  <p className="text-xs text-slate-600">
                    Operates on virtual photovoltaic irradiance with integrated battery backup calculations, modeling off-grid farm operations.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Failsafe Interlocks
                  </h5>
                  <p className="text-xs text-slate-600">
                    Built-in protections automatically suppress pump operation during empty reservoir states (&lt;5%) or severe solar power deficits (&lt;90W).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: SYSTEM ARCHITECTURE & FLOW */}
          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 font-mono text-xs">
                <div className="text-emerald-400 font-bold uppercase mb-3 text-center tracking-wider">
                  SYSTEM ARCHITECTURE & CLOSED-LOOP CONTROL FLOW
                </div>
                <div className="space-y-2 border-l-2 border-emerald-500 pl-4 py-1">
                  <div>[1] <strong>Photovoltaic Irradiance Engine</strong>: Reads Sunlight % -&gt; Computes Solar Watts (320W Max) -&gt; Charges Battery Reserve</div>
                  <div>[2] <strong>Capacitive Soil Sensor Probes</strong>: Reads Zones 1-4 (0-100% VWC) with continuous Evapotranspiration decay</div>
                  <div>[3] <strong>Safety Decision Matrix</strong>:
                    <ul className="list-disc list-inside pl-4 text-slate-400 mt-1 space-y-0.5">
                      <li>Condition A: Is Water Reservoir Level &gt; 5%?</li>
                      <li>Condition B: Is Available Solar + Battery &gt;= 90W?</li>
                      <li>Condition C: Is any Zone Soil Moisture &lt; 30%?</li>
                    </ul>
                  </div>
                  <div>[4] <strong>Actuator Execution Stage</strong>:
                    <ul className="list-disc list-inside pl-4 text-slate-400 mt-1 space-y-0.5">
                      <li>If Conditions A, B, C TRUE -&gt; Energize Centrifugal Pump (180W) & Open Selected Zone Solenoid Valve</li>
                      <li>Water Hydration Loop -&gt; Soil Moisture increments by ~1.4%/sec</li>
                      <li>When Moisture reaches 60% -&gt; Close Valve & De-energize Pump</li>
                    </ul>
                  </div>
                  <div>[5] <strong>Telemetry & Audit Trail</strong>: Real-time telemetry streamed to Chart.js and persisted to browser LocalStorage</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: HARDWARE VS SOFTWARE MAPPING */}
          {activeSection === 'mapping' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                This table proves to the college evaluator how physical embedded components correspond directly to our virtual simulation model:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600">
                    <tr>
                      <th className="py-2.5 px-4 font-bold">Physical Hardware Equivalent</th>
                      <th className="py-2.5 px-4 font-bold">Virtual Software Implementation</th>
                      <th className="py-2.5 px-4 font-bold">Simulation Benefit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-900">Arduino Uno / ESP32 MCU</td>
                      <td className="py-2 px-4 font-mono text-emerald-700">React Heartbeat Loop & Hysteresis State Machine</td>
                      <td className="py-2 px-4 text-slate-500">Instant variable inspection without JTAG debugger</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-900">Capacitive Moisture Sensor (v1.2)</td>
                      <td className="py-2 px-4 font-mono text-blue-700">Volumetric Water Content Model (0-100% VWC)</td>
                      <td className="py-2 px-4 text-slate-500">Zero sensor corrosion, manual slider overrides</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-900">320W Monocrystalline PV Panel</td>
                      <td className="py-2 px-4 font-mono text-amber-700">Photovoltaic Irradiance Equation (P = Pmax * I * η)</td>
                      <td className="py-2 px-4 text-slate-500">Test cloudy, night, and heatwave scenarios in seconds</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-900">12V DC Centrifugal Submersible Pump</td>
                      <td className="py-2 px-4 font-mono text-sky-700">Hydraulic Rate Model (15 L/min per active zone)</td>
                      <td className="py-2 px-4 text-slate-500">Calculates precise water volume and reservoir depletion</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-900">12V Electric Solenoid Valves</td>
                      <td className="py-2 px-4 font-mono text-indigo-700">Individual Zone State Array with Animated SVG Flow</td>
                      <td className="py-2 px-4 text-slate-500">Visual confirmation of pipe hydraulic routing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 4: TOP VIVA QUESTIONS & ANSWERS */}
          {activeSection === 'viva_qa' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Frequently Asked Examiner Viva Questions
              </div>
              {vivaQuestions.map((item, idx) => (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-slate-200 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 transition"
                  >
                    <span>{item.q}</span>
                    {expandedFaq === idx ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  </button>
                  {expandedFaq === idx && (
                    <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Smart Agriculture IoT & Simulation Engineering Capstone
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};

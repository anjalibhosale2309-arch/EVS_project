import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../utils/audio';

const SimulationContext = createContext(null);

const STORAGE_KEY_HISTORY = 'solar_irrigation_history_v1';
const STORAGE_KEY_SETTINGS = 'solar_irrigation_settings_v1';
const STORAGE_KEY_ZONES = 'solar_irrigation_zones_v1';

const INITIAL_ZONES = [
  {
    id: 1,
    name: 'Zone 1 – Crop Field A',
    crop: 'Wheat (Winter Grain)',
    cropType: 'Wheat',
    soilType: 'Loamy Soil',
    moisture: 26, // Starting < 30% to immediately demonstrate auto-start
    valveOpen: false,
    color: '#84cc16', // lime
    flowRate: 14.5, // L/min
    area: '1.2 Acres',
  },
  {
    id: 2,
    name: 'Zone 2 – Crop Field B',
    crop: 'Corn (Sweet Maize)',
    cropType: 'Corn',
    soilType: 'Sandy Loam',
    moisture: 48,
    valveOpen: false,
    color: '#eab308', // amber
    flowRate: 16.0,
    area: '1.5 Acres',
  },
  {
    id: 3,
    name: 'Zone 3 – Crop Field C',
    crop: 'Tomatoes & Vegetables',
    cropType: 'Tomatoes',
    soilType: 'Clay Loam',
    moisture: 58,
    valveOpen: false,
    color: '#ef4444', // red/tomato
    flowRate: 12.0,
    area: '0.8 Acres',
  },
  {
    id: 4,
    name: 'Zone 4 – Crop Field D',
    crop: 'Cotton (Cash Crop)',
    cropType: 'Cotton',
    soilType: 'Alluvial Soil',
    moisture: 35,
    valveOpen: false,
    color: '#06b6d4', // cyan
    flowRate: 15.0,
    area: '1.4 Acres',
  },
];

const DEFAULT_SETTINGS = {
  autoStartThreshold: 30, // Start pump when moisture < 30%
  autoStopThreshold: 60,  // Stop pump when moisture >= 60%
  minTankLevel: 5,        // Tank shutoff at 5%
  minSolarEnergyWatts: 90,// Minimum solar/battery power required
  pumpPowerDrawWatts: 180,// Energy consumed by pump
  evaporationRate: 1.0,   // Multiplier for natural drying
  moistureGainRate: 1.4,  // % gain per second per active irrigation
  tankCapacityLiters: 5000,
};

export const SimulationProvider = ({ children }) => {
  // Master Simulation Play/Pause & Speed
  const [isRunning, setIsRunning] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 5x
  const [audioMuted, setAudioMuted] = useState(false);

  // Operation Mode: 'AUTOMATIC' | 'MANUAL'
  const [controlMode, setControlMode] = useState('AUTOMATIC');

  // Zones State with LocalStorage persistence
  const [zones, setZones] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ZONES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ZONES;
  });

  // Water System State
  const [tankCapacity] = useState(5000); // 5000 L
  const [tankLevel, setTankLevel] = useState(82); // in percentage %
  const [totalWaterUsed, setTotalWaterUsed] = useState(145.5); // Total Liters used
  const [pumpStatus, setPumpStatus] = useState(false); // Pump ON/OFF
  const [manualPumpOverride, setManualPumpOverride] = useState(false);

  // Solar Energy System State
  const [sunlightIntensity, setSunlightIntensity] = useState(85); // 0% - 100%
  const [solarPanelRating] = useState(320); // 320 Watts peak rated
  const [batteryLevel, setBatteryLevel] = useState(92); // 0 - 100%
  const [solarWatts, setSolarWatts] = useState(272); // Calculated Watts
  const [isCharging, setIsCharging] = useState(true);

  // Weather Preset: 'SUNNY' | 'PARTLY_CLOUDY' | 'HEATWAVE' | 'RAINY' | 'NIGHT'
  const [weatherPreset, setWeatherPreset] = useState('SUNNY');

  // Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // History & Event Logs
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'evt-1',
        timestamp: new Date(Date.now() - 3600000 * 3).toLocaleString(),
        zoneName: 'Zone 2 – Crop Field B',
        eventType: 'AUTOMATIC_CYCLE_COMPLETE',
        initialMoisture: 28,
        finalMoisture: 61,
        waterConsumed: 48.2,
        notes: 'Optimal threshold reached. Soil moisture stabilized at 61%.',
      },
      {
        id: 'evt-2',
        timestamp: new Date(Date.now() - 3600000 * 6).toLocaleString(),
        zoneName: 'Zone 1 – Crop Field A',
        eventType: 'PUMP_AUTO_TRIGGER',
        initialMoisture: 27,
        finalMoisture: 60,
        waterConsumed: 52.0,
        notes: 'Triggered by low soil moisture condition (< 30%).',
      },
      {
        id: 'evt-3',
        timestamp: new Date(Date.now() - 3600000 * 12).toLocaleString(),
        zoneName: 'System Storage',
        eventType: 'TANK_REFILL',
        initialMoisture: 0,
        finalMoisture: 0,
        waterConsumed: 0,
        notes: 'Water reservoir topped up to 100% from rainwater harvesting.',
      }
    ];
  });

  // Active Alerts/Notifications
  const [alerts, setAlerts] = useState([
    {
      id: 'alert-init',
      type: 'info',
      title: 'Simulation Initialized',
      message: `System active in AUTOMATIC logic mode. Monitoring ${zones.length} agricultural zones.`,
      time: new Date().toLocaleTimeString(),
    }
  ]);

  // Analytics rolling time-series buffer
  const [telemetryHistory, setTelemetryHistory] = useState(() => {
    const times = [];
    const now = Date.now();
    for (let i = 9; i >= 0; i--) {
      times.push(new Date(now - i * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
    const initialZoneMap = {};
    INITIAL_ZONES.forEach((z) => {
      initialZoneMap[z.id] = [z.moisture, z.moisture, z.moisture, z.moisture, z.moisture, z.moisture, z.moisture, z.moisture, z.moisture, z.moisture];
    });
    return {
      timestamps: times,
      zoneMoistureMap: initialZoneMap,
      solarGenWatts: [250, 255, 260, 268, 270, 272, 272, 272, 272, 272],
      pumpPowerDraw: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      waterUsedCumulative: [141, 142, 142, 143, 144, 144, 145, 145, 145.5, 145.5],
    };
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 100)));
    } catch (e) {
      console.warn('Storage quota exceeded', e);
    }
  }, [history]);

  // Save zones to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ZONES, JSON.stringify(zones));
    } catch (e) {
      console.warn('Storage error for zones', e);
    }
  }, [zones]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [settings]);

  // Update audio engine mute status
  useEffect(() => {
    sound.setMuted(audioMuted);
  }, [audioMuted]);

  // Add an Alert
  const addAlert = useCallback((type, title, message) => {
    const newAlert = {
      id: 'alert-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type,
      title,
      message,
      time: new Date().toLocaleTimeString(),
    };
    setAlerts((prev) => [newAlert, ...prev.slice(0, 19)]);
    if (type === 'danger' || type === 'warning') {
      sound.playAlert();
    } else if (type === 'success') {
      sound.playSuccess();
    }
  }, []);

  // Remove alert
  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Add to History
  const logEvent = useCallback((eventType, zoneName, initialMoisture, finalMoisture, waterConsumed, notes = '') => {
    const newEntry = {
      id: 'evt-' + Date.now(),
      timestamp: new Date().toLocaleString(),
      eventType,
      zoneName,
      initialMoisture: Math.round(initialMoisture),
      finalMoisture: Math.round(finalMoisture),
      waterConsumed: parseFloat(waterConsumed.toFixed(2)),
      notes,
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 150)]);
  }, []);

  // Calculate Real-time Solar Power in Watts
  useEffect(() => {
    const efficiency = 0.95;
    const calculatedWatts = Math.round(solarPanelRating * (sunlightIntensity / 100) * efficiency);
    setSolarWatts(calculatedWatts);
  }, [sunlightIntensity, solarPanelRating]);

  // Handle Weather Preset Changes
  const applyWeatherPreset = (preset) => {
    setWeatherPreset(preset);
    if (preset === 'SUNNY') {
      setSunlightIntensity(92);
      addAlert('info', 'Weather: Clear Sunny Day', 'Sunlight intensity at 92%. Solar generation optimal.');
    } else if (preset === 'PARTLY_CLOUDY') {
      setSunlightIntensity(50);
      addAlert('info', 'Weather: Partly Cloudy', 'Sunlight intensity reduced to 50%.');
    } else if (preset === 'HEATWAVE') {
      setSunlightIntensity(100);
      addAlert('warning', 'Weather: Scorching Heatwave', 'Peak sunlight 100%. Evapotranspiration accelerated.');
    } else if (preset === 'RAINY') {
      setSunlightIntensity(20);
      addAlert('success', 'Weather: Natural Rain Shower', 'Rainwater recharging water tank and replenishing soil moisture.');
    } else if (preset === 'NIGHT') {
      setSunlightIntensity(0);
      addAlert('warning', 'Weather: Night-time (Zero Solar)', 'Solar generation 0W. Operating on battery reserve.');
    }
  };

  // Manual refill of water tank
  const refillWaterTank = (amountPct = 100) => {
    setTankLevel((prev) => {
      const newLvl = Math.min(100, prev + amountPct);
      addAlert('success', 'Water Reservoir Refilled', `Water tank replenished to ${newLvl}%. Capacity: ${Math.round((newLvl / 100) * tankCapacity)} Liters.`);
      logEvent('TANK_REFILL', 'Main Storage Reservoir', prev, newLvl, 0, 'Tank manually refilled to capacity.');
      return newLvl;
    });
  };

  // Manual moisture slider update
  const setZoneMoisture = (zoneId, value) => {
    const clampedVal = Math.max(0, Math.min(100, Math.round(value)));
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, moisture: clampedVal } : z))
    );
  };

  // Manual valve toggle
  const toggleZoneValve = (zoneId) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nextState = !z.valveOpen;
          if (nextState) {
            sound.playBeep(520, 0.08);
          }
          return { ...z, valveOpen: nextState };
        }
        return z;
      })
    );
  };

  // --- INSERT / ADD NEW CROP ZONE ---
  const addZone = (newZoneData) => {
    if (zones.length >= 8) {
      addAlert('warning', 'Maximum Limit Reached', 'A maximum of 8 crop zones is supported to maintain hydraulic flow balance.');
      return false;
    }

    const nextId = zones.length > 0 ? Math.max(...zones.map((z) => z.id)) + 1 : 1;
    const colors = ['#84cc16', '#eab308', '#ef4444', '#06b6d4', '#10b981', '#f97316', '#a855f7', '#ec4899'];
    const chosenColor = newZoneData.color || colors[(nextId - 1) % colors.length];

    const newZone = {
      id: nextId,
      name: newZoneData.name || `Zone ${nextId} – Crop Field`,
      crop: newZoneData.crop || 'Sugarcane (Cash Crop)',
      cropType: newZoneData.cropType || 'Sugarcane',
      soilType: newZoneData.soilType || 'Black Loam Soil',
      moisture: Number(newZoneData.moisture) || 35,
      valveOpen: false,
      color: chosenColor,
      flowRate: Number(newZoneData.flowRate) || 15.0,
      area: newZoneData.area || '1.0 Acres',
    };

    setZones((prev) => [...prev, newZone]);
    addAlert('success', 'Crop Zone Added', `${newZone.name} (${newZone.crop}) successfully configured into irrigation grid.`);
    logEvent('ZONE_ADDED', newZone.name, 0, newZone.moisture, 0, `New crop field added to irrigation manifold.`);
    return true;
  };

  // --- DELETE CROP ZONE ---
  const deleteZone = (zoneId) => {
    if (zones.length <= 1) {
      addAlert('warning', 'Minimum Zone Required', 'At least 1 crop zone must be maintained in the simulation.');
      return false;
    }

    const targetZone = zones.find((z) => z.id === zoneId);
    setZones((prev) => prev.filter((z) => z.id !== zoneId));
    addAlert('info', 'Crop Zone Removed', `${targetZone?.name || 'Zone'} removed from irrigation distribution system.`);
    logEvent('ZONE_DELETED', targetZone?.name || `Zone ${zoneId}`, targetZone?.moisture || 0, 0, 0, 'Zone deleted by operator.');
    return true;
  };

  // Manual Pump Switch
  const toggleManualPump = () => {
    if (controlMode === 'AUTOMATIC') {
      addAlert('warning', 'Mode Warning', 'Switch to MANUAL MODE to toggle the pump directly.');
      return;
    }
    if (tankLevel <= settings.minTankLevel) {
      addAlert('danger', 'Low Water Tank Lockout', 'Cannot start pump: Water tank level is below critical 5% safety margin.');
      return;
    }
    const totalPower = solarWatts + (batteryLevel > 15 ? 150 : 0);
    if (totalPower < settings.minSolarEnergyWatts) {
      addAlert('danger', 'Low Energy Lockout', 'Cannot start pump: Insufficient solar/battery energy.');
      return;
    }

    setManualPumpOverride((prev) => {
      const next = !prev;
      if (next) {
        sound.startPumpSound();
        addAlert('info', 'Manual Pump Started', 'Water pump engaged via manual control.');
      } else {
        sound.stopPumpSound();
        addAlert('info', 'Manual Pump Stopped', 'Water pump disengaged.');
      }
      return next;
    });
  };

  // Sound effect tracking for pump
  useEffect(() => {
    if (pumpStatus && !audioMuted) {
      sound.startPumpSound();
    } else {
      sound.stopPumpSound();
    }
    return () => sound.stopPumpSound();
  }, [pumpStatus, audioMuted]);

  // MAIN SIMULATION HEARTBEAT TICK
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const speedRef = useRef(simulationSpeed);
  speedRef.current = simulationSpeed;

  const zonesRef = useRef(zones);
  zonesRef.current = zones;
  const tankLevelRef = useRef(tankLevel);
  tankLevelRef.current = tankLevel;
  const pumpStatusRef = useRef(pumpStatus);
  pumpStatusRef.current = pumpStatus;
  const solarWattsRef = useRef(solarWatts);
  solarWattsRef.current = solarWatts;
  const batteryLevelRef = useRef(batteryLevel);
  batteryLevelRef.current = batteryLevel;
  const controlModeRef = useRef(controlMode);
  controlModeRef.current = controlMode;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const weatherPresetRef = useRef(weatherPreset);
  weatherPresetRef.current = weatherPreset;
  const manualPumpOverrideRef = useRef(manualPumpOverride);
  manualPumpOverrideRef.current = manualPumpOverride;

  useEffect(() => {
    const intervalMs = 1000 / simulationSpeed;

    const timer = setInterval(() => {
      if (!isRunningRef.current) return;

      const currentSettings = settingsRef.current;
      const currentMode = controlModeRef.current;
      const currentTank = tankLevelRef.current;
      const currentSolar = solarWattsRef.current;
      const currentBattery = batteryLevelRef.current;
      const currentWeather = weatherPresetRef.current;
      const currentZones = [...zonesRef.current];

      // Safety checks: Tank availability and Solar/Battery power
      const hasWater = currentTank > currentSettings.minTankLevel;
      const availablePower = currentSolar + (currentBattery > 15 ? 180 : 0);
      const hasEnergy = availablePower >= currentSettings.minSolarEnergyWatts;

      let nextPumpStatus = false;
      let updatedZones = [];
      let cycleWaterUsedThisTick = 0;

      // Handle Natural Rain Weather
      if (currentWeather === 'RAINY') {
        setTankLevel((prev) => Math.min(100, prev + 0.35));
        updatedZones = currentZones.map((zone) => ({
          ...zone,
          valveOpen: false,
          moisture: Math.min(100, zone.moisture + 0.5),
        }));
        nextPumpStatus = false;
        setPumpStatus(false);
        setZones(updatedZones);
        return;
      }

      // --- AUTOMATIC IRRIGATION LOGIC ---
      if (currentMode === 'AUTOMATIC') {
        let anyZoneNeedsWater = false;

        updatedZones = currentZones.map((zone) => {
          let valve = zone.valveOpen;
          let moisture = zone.moisture;

          if (moisture < currentSettings.autoStartThreshold) {
            if (hasWater && hasEnergy) {
              valve = true;
              anyZoneNeedsWater = true;
            } else {
              valve = false;
            }
          } else if (moisture >= currentSettings.autoStopThreshold) {
            if (valve) {
              logEvent(
                'AUTO_ZONE_SATISFIED',
                zone.name,
                zone.moisture - 20,
                zone.moisture,
                zone.flowRate * 0.4,
                `Target moisture (${currentSettings.autoStopThreshold}%) reached. Valve closed.`
              );
            }
            valve = false;
          }

          if (valve && (!hasWater || !hasEnergy)) {
            valve = false;
          }

          if (valve) {
            anyZoneNeedsWater = true;
          }

          return { ...zone, valveOpen: valve };
        });

        nextPumpStatus = anyZoneNeedsWater && hasWater && hasEnergy;

        if (!hasWater && anyZoneNeedsWater) {
          addAlert('danger', 'Low Water Alert', 'Automatic irrigation suspended: Water tank level below 5%. Please refill.');
        } else if (!hasEnergy && anyZoneNeedsWater) {
          addAlert('warning', 'Low Energy Alert', 'Automatic irrigation suspended: Solar & battery power insufficient.');
        }
      }
      // --- MANUAL IRRIGATION LOGIC ---
      else {
        const anyValveOpen = currentZones.some((z) => z.valveOpen);
        if (manualPumpOverrideRef.current && hasWater && hasEnergy && anyValveOpen) {
          nextPumpStatus = true;
          updatedZones = currentZones;
        } else {
          nextPumpStatus = false;
          if (manualPumpOverrideRef.current && (!hasWater || !hasEnergy)) {
            setManualPumpOverride(false);
            if (!hasWater) {
              addAlert('danger', 'Pump Dry-Run Trip', 'Pump automatically shut off: Water tank level too low.');
            } else if (!hasEnergy) {
              addAlert('warning', 'Pump Energy Trip', 'Pump automatically shut off: Solar power insufficient.');
            }
          }
          updatedZones = currentZones;
        }
      }

      // --- HYDRATION & EVAPORATION DYNAMICS ---
      const heatMultiplier = currentWeather === 'HEATWAVE' ? 2.2 : (currentWeather === 'SUNNY' ? 1.0 : 0.6);
      const naturalDrying = 0.08 * currentSettings.evaporationRate * heatMultiplier;

      const finalZones = updatedZones.map((zone) => {
        let currentM = zone.moisture;

        if (nextPumpStatus && zone.valveOpen) {
          const gain = currentSettings.moistureGainRate;
          currentM = Math.min(100, currentM + gain);
          cycleWaterUsedThisTick += (zone.flowRate / 60);
        } else {
          currentM = Math.max(10, currentM - naturalDrying);
        }

        return {
          ...zone,
          moisture: Math.round(currentM * 10) / 10,
        };
      });

      setZones(finalZones);
      setPumpStatus(nextPumpStatus);

      if (cycleWaterUsedThisTick > 0) {
        setTotalWaterUsed((prev) => prev + cycleWaterUsedThisTick);
        const tankPctConsumed = (cycleWaterUsedThisTick / currentSettings.tankCapacityLiters) * 100;
        setTankLevel((prev) => Math.max(0, parseFloat((prev - tankPctConsumed).toFixed(2))));
      }

      // Solar & Battery Dynamics
      const netPower = currentSolar - (nextPumpStatus ? currentSettings.pumpPowerDrawWatts : 0);
      if (netPower > 0) {
        setIsCharging(true);
        setBatteryLevel((prev) => Math.min(100, prev + 0.1));
      } else {
        setIsCharging(false);
        setBatteryLevel((prev) => Math.max(0, prev - 0.2));
      }

      // Append to Rolling Telemetry History every tick
      setTelemetryHistory((prev) => {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const maxLen = 15;

        // Map moistures for all current zones
        const newZoneMoistureMap = { ...prev.zoneMoistureMap };
        finalZones.forEach((z) => {
          const existingSeries = newZoneMoistureMap[z.id] || [];
          newZoneMoistureMap[z.id] = [...existingSeries.slice(-maxLen + 1), z.moisture];
        });

        return {
          timestamps: [...prev.timestamps.slice(-maxLen + 1), timeNow],
          zoneMoistureMap: newZoneMoistureMap,
          solarGenWatts: [...prev.solarGenWatts.slice(-maxLen + 1), currentSolar],
          pumpPowerDraw: [...prev.pumpPowerDraw.slice(-maxLen + 1), nextPumpStatus ? currentSettings.pumpPowerDrawWatts : 0],
          waterUsedCumulative: [...prev.waterUsedCumulative.slice(-maxLen + 1), parseFloat(totalWaterUsed.toFixed(1))],
        };
      });

    }, intervalMs);

    return () => clearInterval(timer);
  }, [simulationSpeed, addAlert, logEvent, totalWaterUsed]);

  // Reset Simulation to default state
  const resetSimulation = () => {
    setIsRunning(false);
    setZones(INITIAL_ZONES);
    setTankLevel(85);
    setTotalWaterUsed(0);
    setPumpStatus(false);
    setManualPumpOverride(false);
    setSunlightIntensity(85);
    setBatteryLevel(95);
    setWeatherPreset('SUNNY');
    setControlMode('AUTOMATIC');
    try {
      localStorage.removeItem(STORAGE_KEY_ZONES);
    } catch {}
    addAlert('info', 'Simulation Reset', 'All parameters, crop zones, and virtual sensors reset to default state.');
    setTimeout(() => setIsRunning(true), 300);
  };

  // Clear History
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {}
    addAlert('info', 'History Cleared', 'Simulation history logs have been cleared.');
  };

  // Run Quick Demo Scenarios
  const runDemoScenario = (scenarioId) => {
    if (scenarioId === 'dry_trigger') {
      setControlMode('AUTOMATIC');
      setZones((prev) => prev.map((z, idx) => (idx === 0 ? { ...z, moisture: 20 } : z)));
      setTankLevel(80);
      setSunlightIntensity(85);
      addAlert('warning', 'Demo Scenario: Low Moisture Trigger', 'Zone 1 moisture dropped to 20%. Watch automatic irrigation kick in!');
    } else if (scenarioId === 'tank_empty') {
      setTankLevel(3);
      addAlert('danger', 'Demo Scenario: Empty Tank Cutoff', 'Water tank dropped to 3%. Pump will automatically cut off to prevent dry-running.');
    } else if (scenarioId === 'night_solar') {
      setSunlightIntensity(0);
      setBatteryLevel(8);
      setWeatherPreset('NIGHT');
      addAlert('warning', 'Demo Scenario: Insufficient Solar Energy', 'Zero sunlight and drained battery: System halts irrigation until solar generation recovers.');
    } else if (scenarioId === 'rain_recharge') {
      applyWeatherPreset('RAINY');
    }
  };

  // Dynamic metrics
  const activeZonesCount = zones.filter((z) => z.valveOpen && pumpStatus).length;
  const averageMoisture = zones.length > 0 
    ? Math.round(zones.reduce((acc, curr) => acc + curr.moisture, 0) / zones.length) 
    : 0;

  return (
    <SimulationContext.Provider
      value={{
        // Simulation Controls
        isRunning,
        setIsRunning,
        simulationSpeed,
        setSimulationSpeed,
        audioMuted,
        setAudioMuted,
        controlMode,
        setControlMode,
        resetSimulation,
        runDemoScenario,

        // Zones & Sensors (with CRUD!)
        zones,
        setZoneMoisture,
        toggleZoneValve,
        addZone,
        deleteZone,

        // Water System
        tankLevel,
        tankCapacity,
        totalWaterUsed,
        pumpStatus,
        refillWaterTank,
        toggleManualPump,
        manualPumpOverride,

        // Solar Energy
        sunlightIntensity,
        setSunlightIntensity,
        solarPanelRating,
        solarWatts,
        batteryLevel,
        isCharging,

        // Weather
        weatherPreset,
        applyWeatherPreset,

        // Metrics
        activeZonesCount,
        averageMoisture,

        // History & Alerts
        history,
        clearHistory,
        alerts,
        dismissAlert,
        addAlert,

        // Telemetry Data for Charts
        telemetryHistory,

        // Settings
        settings,
        setSettings,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

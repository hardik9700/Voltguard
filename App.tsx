import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Map as MapIcon, Layers, BarChart3, AlertTriangle, ArrowRight } from 'lucide-react';
import { INITIAL_VEHICLES } from './constants';
import { Vehicle, Tab } from './types';
import BatteryStory from './components/BatteryStory';
import ReportCard from './components/ReportCard';
import ActionList from './components/ActionList';
import FleetTable from './components/FleetTable';
import { simulateFuture, generateReportCard, findNearbyServices, getMaintenanceActions } from './services/geminiService';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TIMELINE);
  const [vehicle, setVehicle] = useState<Vehicle>(INITIAL_VEHICLES[0]);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [maintenanceActions, setMaintenanceActions] = useState<string[]>([]);
  
  // Nearby services state
  const [services, setServices] = useState<any>(null);

  // Silent precision logic: Buffer updates to prevent flickering
  useEffect(() => {
    const interval = setInterval(() => {
      // Very subtle updates only
      setVehicle(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          // Micro fluctuations for the "Live" feel without noise
          confidenceScore: prev.stats.confidenceScore - (Math.random() * 0.0001), 
          temp: prev.stats.temp + (Math.random() * 0.02 - 0.01)
        }
      }));
    }, 5000); // Slower update cycle for "Calm" UI

    return () => clearInterval(interval);
  }, []);

  // Handle Simulation Toggle
  const toggleSimulation = async () => {
    if (!isSimulationMode) {
      setIsSimulationMode(true);
      const data = await simulateFuture(vehicle.stats, vehicle.model);
      setSimulationData(data);
    } else {
      setIsSimulationMode(false);
      setSimulationData(null);
    }
  };

  // Load Data on tab switch
  useEffect(() => {
    if (activeTab === Tab.REPORT && !reportData) {
      generateReportCard(vehicle.stats).then(setReportData);
    }
    if (activeTab === Tab.CARE && maintenanceActions.length === 0) {
      getMaintenanceActions(vehicle.stats, vehicle.model).then(setMaintenanceActions);
    }
    if (activeTab === Tab.MAPS && !services) {
        findNearbyServices(vehicle.location.lat, vehicle.location.lng).then(setServices);
    }
  }, [activeTab, vehicle.stats, reportData, services, maintenanceActions.length, vehicle.model, vehicle.location.lat, vehicle.location.lng]);

  const displayedConfidence = isSimulationMode && simulationData 
    ? simulationData.futureConfidence 
    : vehicle.stats.confidenceScore;

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 font-sans selection:bg-ink-200">
      
      {/* Premium Minimal Header */}
      <header className="pt-8 pb-2 px-6 md:px-12 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            VoltGuard
            <div className="w-1.5 h-1.5 bg-ink-900 rounded-full animate-pulse"></div>
          </h1>
          <p className="text-xs text-ink-400 mt-1 font-medium tracking-wide">
            We don’t show battery data. We explain battery consequences.
          </p>
        </div>
        <button 
            onClick={() => setActiveTab(activeTab === Tab.FLEET ? Tab.TIMELINE : Tab.FLEET)}
            className="text-xs font-mono text-ink-400 hover:text-ink-900 transition-colors uppercase tracking-widest"
        >
            {activeTab === Tab.FLEET ? 'Back to Vehicle' : 'Switch Vehicle'}
        </button>
      </header>

      {/* Hero Section: The Single Metric */}
      {activeTab !== Tab.FLEET && (
        <section className="px-6 md:px-12 py-12 md:py-16 transition-all duration-700 ease-in-out">
          <div className="max-w-4xl mx-auto text-center relative">
             <div className="text-sm font-mono text-ink-500 mb-4 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
               Battery Life Confidence
               {isSimulationMode && <span className="text-risk font-bold animate-pulse"> (SIMULATED FUTURE)</span>}
             </div>
             
             {/* The Metric */}
             <div className={`text-[12vw] md:text-9xl leading-none font-light tracking-tighter text-ink-900 tabular-nums transition-all duration-1000 ${isSimulationMode ? 'text-risk blur-[1px]' : ''}`}>
               {displayedConfidence.toFixed(3)}<span className="text-4xl text-ink-300 align-top ml-2 opacity-50">%</span>
             </div>

             {/* Simulation Toggle */}
             <div className="mt-12 flex justify-center">
               <button 
                onClick={toggleSimulation}
                className={`group flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${
                  isSimulationMode 
                    ? 'bg-ink-900 text-white border-ink-900 shadow-lg' 
                    : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400'
                }`}
               >
                 <span className="text-sm font-medium">If I continue like this...</span>
                 <ArrowRight size={16} className={`transition-transform duration-300 ${isSimulationMode ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
               </button>
             </div>

             {/* Simulation Context */}
             {isSimulationMode && simulationData && (
               <div className="mt-8 animate-slide-up max-w-lg mx-auto bg-white p-6 rounded-xl border border-risk/20 shadow-[0_4px_20px_rgba(239,68,68,0.05)]">
                 <p className="text-risk font-medium mb-2">Projected Consequence</p>
                 <p className="text-ink-600 mb-4">{simulationData.consequence}</p>
                 <div className="flex justify-between items-center border-t border-ink-50 pt-4">
                   <span className="text-xs text-ink-400 uppercase tracking-widest">Est. Replacement Cost</span>
                   <span className="text-xl font-mono text-ink-900">${simulationData.replacementCost.toLocaleString()}</span>
                 </div>
               </div>
             )}
          </div>
        </section>
      )}

      {/* Content Tabs */}
      <main className="px-6 md:px-12 pb-20 max-w-4xl mx-auto">
        
        {activeTab !== Tab.FLEET && (
            <div className="flex justify-center gap-8 mb-12 border-b border-ink-100">
            {[
                { id: Tab.TIMELINE, label: 'Story Timeline' },
                { id: Tab.CARE, label: 'Care Plan' },
                { id: Tab.REPORT, label: 'Report Card' },
                { id: Tab.MAPS, label: 'Services' },
            ].map(tab => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-medium transition-all duration-300 relative ${
                    activeTab === tab.id ? 'text-ink-900' : 'text-ink-400 hover:text-ink-600'
                }`}
                >
                {tab.label}
                {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink-900 rounded-full" />
                )}
                </button>
            ))}
            </div>
        )}

        <div className="min-h-[400px]">
          {activeTab === Tab.TIMELINE && (
            <BatteryStory events={vehicle.timeline} />
          )}

          {activeTab === Tab.CARE && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
                <div>
                    <h3 className="text-xs font-mono text-ink-400 uppercase tracking-widest mb-6">Recent Context</h3>
                    <BatteryStory events={vehicle.timeline} />
                </div>
                <div>
                     <h3 className="text-xs font-mono text-ink-400 uppercase tracking-widest mb-6">Recommended Actions</h3>
                     <ActionList actions={maintenanceActions} />
                </div>
            </div>
          )}

          {activeTab === Tab.REPORT && (
            reportData ? (
               <ReportCard 
                 grade={reportData.grade} 
                 behaviorScore={reportData.behaviorScore}
                 riskOutlook={reportData.riskOutlook}
               />
            ) : (
              <div className="flex items-center justify-center h-40 text-ink-400 animate-pulse">
                Generating Report...
              </div>
            )
          )}

          {activeTab === Tab.MAPS && (
              <div className="bg-white rounded-2xl border border-ink-100 p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                      <h3 className="font-medium text-ink-900">Nearby Specialists</h3>
                      <div className="text-xs text-ink-400 font-mono flex items-center gap-1">
                          <MapIcon size={12}/> {vehicle.location.lat.toFixed(2)}, {vehicle.location.lng.toFixed(2)}
                      </div>
                  </div>
                  <div className="space-y-4">
                      {services?.chunks?.length > 0 ? services.chunks.map((chunk: any, i: number) => (
                          <div key={i} className="group flex items-start justify-between p-4 rounded-xl bg-ink-50 hover:bg-ink-100 transition-colors">
                              <div>
                                  <div className="font-medium text-ink-900">{chunk.maps?.title}</div>
                                  <a href={chunk.maps?.uri} target="_blank" className="text-xs text-ink-500 underline mt-1 block">View in Maps</a>
                              </div>
                              {chunk.maps?.placeAnswerSources?.reviewSnippets?.[0] && (
                                  <div className="text-xs text-ink-500 italic max-w-xs text-right">
                                      "{chunk.maps.placeAnswerSources.reviewSnippets[0].content.slice(0, 60)}..."
                                  </div>
                              )}
                          </div>
                      )) : (
                        <div className="text-center text-ink-400 py-8">
                            Locating premium service centers...
                        </div>
                      )}
                  </div>
              </div>
          )}

          {activeTab === Tab.FLEET && (
              <div className="space-y-6">
                 <h2 className="text-lg font-medium text-ink-900 mb-4">Fleet Overview</h2>
                 <FleetTable 
                    vehicles={INITIAL_VEHICLES} // Using constant for simplicity in this view
                    onSelect={() => {}} 
                    selectedId={vehicle.id} 
                 />
                 <div className="bg-ink-900 text-ink-50 p-6 rounded-xl mt-8">
                     <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-2">Fleet Insight</p>
                     <p className="text-lg">Fleet Alpha-1 is showing signs of fast-charge stress. Consider rotating to Level 2 charging for the next 3 cycles.</p>
                 </div>
              </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default App;
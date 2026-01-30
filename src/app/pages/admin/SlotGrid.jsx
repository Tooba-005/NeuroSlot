import { useState, useEffect } from 'react';
import { Square, Car, ShieldCheck, Map, Info } from 'lucide-react';
import api from '@/app/services/api';

function SlotGrid() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = () => {
    const data = api.getZones();
    setZones(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F1A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4" data-aos="fade-down">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Spatial Mapping</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Slot <span className="text-indigo-600">Grid</span>
            </h1>
            <p className="text-gray-500 dark:text-slate-400 font-medium">Digital twin representation of physical parking infrastructure.</p>
          </div>
          
          {/* Legend Integrated into Header */}
          <div className="flex bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm shadow-sm shadow-emerald-500/40"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-sm shadow-sm shadow-rose-500/40"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Occupied</span>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {zones.map((zone, zIdx) => {
            const occupiedCount = zone.slots.filter(s => s.status !== 'available').length;
            const utilization = ((occupiedCount / zone.slots.length) * 100).toFixed(0);

            return (
              <div key={zone.id} className="relative" data-aos="fade-up" data-aos-delay={zIdx * 100}>
                {/* Zone Info Bar */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                      <Map className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{zone.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{zone.slots.length} Total Units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Saturation</p>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full transition-all duration-1000 ${utilization > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                          style={{ width: `${utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-black dark:text-white">{utilization}%</span>
                    </div>
                  </div>
                </div>

                {/* Grid Container */}
                <div className="bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/50 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4">
                    {zone.slots.map((slot, sIdx) => {
                      const isOccupied = slot.status !== 'available';
                      return (
                        <div
                          key={slot.id}
                          className={`
                            relative group aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                            ${isOccupied 
                              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                              : 'bg-white dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-700 text-gray-300 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                            }
                          `}
                          data-aos="zoom-in"
                          data-aos-delay={zIdx * 50 + sIdx * 5}
                        >
                          {isOccupied ? (
                            <>
                              <Car className="w-5 h-5 mb-1 animate-in fade-in zoom-in duration-500" />
                              <span className="text-[10px] font-black">{slot.id}</span>
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap font-bold shadow-2xl">
                                Vehicle: {slot.vehicleId || 'N/A'}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="text-[10px] font-black group-hover:text-emerald-500 transition-colors">{slot.id}</span>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Footnote */}
        <div className="mt-12 flex items-center justify-center gap-3 p-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm" data-aos="fade-up">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
            <Info className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            Grid updates automatically every 5 seconds. Data indices are synchronized with local storage <strong>Map</strong> objects.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SlotGrid;
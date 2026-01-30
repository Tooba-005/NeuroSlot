import { useState, useEffect } from 'react';
import { 
  MapPin, PlusCircle, Settings, HardDrive, 
  Activity, ArrowUpRight, Plus, Box 
} from 'lucide-react';
import api from '@/app/services/api';

function ZoneManagement() {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6" data-aos="fade-down">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest">Infrastructure Control</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Zone <span className="text-indigo-600">Provisioning</span>
            </h1>
            <p className="text-gray-500 dark:text-slate-400 font-medium">Configure and monitor physical parking clusters.</p>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 group">
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>INITIALIZE NEW ZONE</span>
          </button>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {zones.map((zone, idx) => {
            const available = zone.slots.filter(s => s.status === 'available').length;
            const occupied = zone.slots.length - available;
            const occupancyRate = ((occupied / zone.slots.length) * 100).toFixed(0);

            return (
              <div 
                key={zone.id} 
                className="group bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none hover:border-indigo-500/50 transition-all relative overflow-hidden"
                data-aos="fade-up" 
                data-aos-delay={idx * 100}
              >
                {/* Background Decor */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <MapPin className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{zone.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zone ID:</span>
                          <code className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            {zone.id}
                          </code>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-gray-300 hover:text-indigo-500 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Resource Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Available</p>
                      <p className="text-2xl font-black text-emerald-500">{available}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Occupied</p>
                      <p className="text-2xl font-black text-rose-500">{occupied}</p>
                    </div>
                  </div>

                  {/* Utilization Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilization Rate</span>
                      <span className="text-xs font-black text-gray-900 dark:text-white">{occupancyRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${occupancyRate > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                    View Allocation History
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New Zone Placeholder */}
          <div 
            className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all cursor-pointer group"
            data-aos="fade-up"
            data-aos-delay={zones.length * 100}
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Plus className="w-8 h-8" />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Initialize New Segment</p>
          </div>
        </div>

        {/* System Documentation Note */}
        <div className="mt-12 p-8 bg-indigo-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <HardDrive className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <h4 className="text-xl font-black mb-2 flex items-center gap-3">
              <Box className="w-6 h-6" />
              Logical Data Structures
            </h4>
            <p className="text-sm text-indigo-100 max-w-2xl font-medium leading-relaxed">
              Zones are stored as an <strong>Array of Objects</strong>, where each zone contains a nested array of slot objects. This allows for constant-time access to zone metadata and linear-time filtering for slot availability audits.
            </p>
          </div>
          <button className="relative z-10 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-50 transition-colors shadow-lg">
            System Integrity Audit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ZoneManagement;
import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Award, PieChart, 
  Activity, Zap, Info, Layers, Database 
} from 'lucide-react';
import api from '@/app/services/api';

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const data = api.getAnalytics();
    setAnalytics(data);
  };

  if (!analytics) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0F1A]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Aggregating Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F1A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10" data-aos="fade-down">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Data <span className="text-indigo-600">Insights</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">
            System performance and spatial utilization metrics.
          </p>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Requests', val: analytics.totalRequests, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Active Occupancy', val: `${analytics.occupiedSlots}/${analytics.totalSlots}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Peak Zone', val: `Zone ${analytics.peakZone.zoneId}`, sub: `${analytics.peakZone.utilization}% load`, icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Void Requests', val: analytics.statusCounts.cancelled, icon: PieChart, color: 'text-rose-500', bg: 'bg-rose-500/10' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm" data-aos="fade-up" data-aos-delay={i * 50}>
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</h3>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.val}</p>
              {stat.sub && <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{stat.sub}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Zone Utilization Bars */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none" data-aos="fade-right">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Zone Utilization</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Optimal</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Critical</span>
              </div>
            </div>
            
            <div className="space-y-8">
              {analytics.zoneUtilization.map((zone, idx) => {
                const isCritical = parseFloat(zone.utilization) > 80;
                const isWarning = parseFloat(zone.utilization) > 50;
                return (
                  <div key={zone.zoneId}>
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <span className="text-sm font-black text-gray-900 dark:text-white">ZONE {zone.zoneId}</span>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{zone.occupiedSlots} of {zone.totalSlots} slots active</p>
                      </div>
                      <span className={`text-sm font-mono font-bold ${isCritical ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {zone.utilization}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-4 p-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${zone.utilization}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Distribution & DSA Info */}
          <div className="space-y-8">
            {/* Status Distribution Grid */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm" data-aos="fade-left">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-500" />
                Requests
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(analytics.statusCounts).map(([status, count], idx) => (
                  <div key={status} className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <p className="text-xl font-black text-gray-900 dark:text-white leading-none">{count}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase mt-2 tracking-tighter">{status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Stack / DSA Info */}
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group" data-aos="fade-up">
              <Database className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-amber-300" />
                  <h3 className="text-lg font-bold">Logic Architecture</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { label: 'FIFO Queue', desc: 'Linear request processing' },
                    { label: 'LIFO Stack', desc: 'State rollback engine' },
                    { label: 'Linked History', desc: 'Sequential event logging' },
                    { label: 'Array Map', desc: 'Constant-time slot lookup' }
                  ].map((dsa, i) => (
                    <li key={i} className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest">{dsa.label}</span>
                      <span className="text-[10px] text-indigo-200 font-medium">{dsa.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Global Performance Note */}
        <div className="mt-8 flex items-center justify-center gap-2 py-4 border-t border-gray-200 dark:border-slate-800">
           <Info className="w-4 h-4 text-gray-400" />
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">All calculations are based on live local storage state and DSA engine latency of &lt;1ms.</p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
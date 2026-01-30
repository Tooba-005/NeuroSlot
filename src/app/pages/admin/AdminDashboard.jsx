import { useState, useEffect } from 'react';
import { 
  BarChart3, MapPin, Clock, AlertCircle, 
  Settings, Layers, Activity, Undo2, ArrowRight, ShieldCheck 
} from 'lucide-react';
import api from '@/app/services/api';

function AdminDashboard({ setCurrentPage }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
    const data = api.getDashboardStats();
    setStats(data);
  };

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0F1A]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Loading Command Center...</p>
      </div>
    </div>
  );

  const cards = [
    { title: 'Total Zones', value: stats.totalZones, icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Capacity', value: stats.totalSlots, icon: Layers, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Occupancy', value: stats.occupiedSlots, icon: Activity, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { title: 'Queue Length', value: stats.pendingRequests, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const quickActions = [
    { id: 'zone-management', label: 'Infrastructure', desc: 'Edit zones & parameters', icon: Settings, color: 'from-blue-600 to-blue-400' },
    { id: 'slot-grid', label: 'Live Grid', desc: 'Real-time slot visualizer', icon: BarChart3, color: 'from-emerald-600 to-emerald-400' },
    { id: 'live-queue', label: 'Process Queue', desc: 'Manual override & logic', icon: Clock, color: 'from-violet-600 to-violet-400' },
    { id: 'rollback', label: 'Rollback', desc: 'Revert system states', icon: Undo2, color: 'from-rose-600 to-rose-400' },
    { id: 'analytics', label: 'Data Insights', desc: 'Trends & usage reports', icon: BarChart3, color: 'from-indigo-600 to-indigo-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F1A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div data-aos="fade-right">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">System Live</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Admin <span className="text-indigo-600">Console</span>
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">
              Enterprise Monitoring & Intelligent Allocation
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Access Level</p>
              <p className="text-sm font-bold dark:text-white mt-1">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.title} 
                className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:border-indigo-500/50 transition-all group"
                data-aos="fade-up" 
                data-aos-delay={idx * 100}
              >
                <div className={`${card.bg} ${card.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-gray-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{card.title}</h3>
                <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                  {card.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Grid */}
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              Executive Control
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => setCurrentPage(action.id)}
                  className="relative group overflow-hidden bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all text-left"
                  data-aos="zoom-in"
                  data-aos-delay={idx * 50}
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${action.color} opacity-[0.03] group-hover:opacity-10 transition-opacity rounded-bl-full`}></div>
                  
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200/50 dark:shadow-none`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {action.label}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                    {action.desc}
                  </p>
                  
                  <div className="flex items-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    Execute <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live System Info Footer */}
        <div className="mt-12 p-6 bg-indigo-600 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <h4 className="text-xl font-bold">Allocation Logic Active</h4>
            <p className="text-indigo-100 text-sm opacity-80">System is processing {stats.pendingRequests} users in FIFO queue.</p>
          </div>
          <button 
            onClick={() => setCurrentPage('analytics')}
            className="relative z-10 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Review Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
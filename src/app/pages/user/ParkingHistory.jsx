import { useContext, useState, useEffect } from 'react';
import { History, Search, ArrowLeft, Filter, Calendar, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import AuthContext from '@/app/context/AuthContext';

function ParkingHistory({ setCurrentPage }) {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const requests = JSON.parse(localStorage.getItem('parkingRequests') || '[]');
    const userRequests = requests
      .filter(req => req.userEmail === user.email)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setHistory(userRequests);
  };

  const filteredHistory = history.filter(item =>
    item.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const configs = {
      REQUESTED: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
      ALLOCATED: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
      OCCUPIED: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
      CANCELLED: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
    };
    return configs[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Stats Calculations
  const total = history.length;
  const active = history.filter(h => h.status === 'ALLOCATED' || h.status === 'OCCUPIED').length;
  const pending = history.filter(h => h.status === 'REQUESTED').length;
  const cancelled = history.filter(h => h.status === 'CANCELLED').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT PANEL: Statistics & Summary */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#0F172A] text-white p-8 flex flex-col relative overflow-hidden shrink-0">
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-violet-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-fuchsia-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10 h-full flex flex-col">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 lg:hidden"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
              Parking <br/>
              <span className="text-violet-400">History Log</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              A comprehensive archive of all your parking sessions and allocation requests.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <FileText className="w-4 h-4" /> <span className="text-xs uppercase font-bold tracking-wider">Total</span>
              </div>
              <span className="text-3xl font-bold text-white">{total}</span>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <CheckCircle className="w-4 h-4" /> <span className="text-xs uppercase font-bold tracking-wider">Active</span>
              </div>
              <span className="text-3xl font-bold text-emerald-100">{active}</span>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Clock className="w-4 h-4" /> <span className="text-xs uppercase font-bold tracking-wider">Pending</span>
              </div>
              <span className="text-3xl font-bold text-amber-100">{pending}</span>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-rose-400 mb-2">
                <XCircle className="w-4 h-4" /> <span className="text-xs uppercase font-bold tracking-wider">Void</span>
              </div>
              <span className="text-3xl font-bold text-rose-100">{cancelled}</span>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/10 hidden lg:block">
            <p className="text-xs text-slate-500">
              * Records are stored locally on your device for privacy. Clearing your cache will remove this history.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Search & Table */}
      <div className="flex-1 p-4 lg:p-12 overflow-y-auto bg-gray-50 dark:bg-[#111] dark:text-gray-200">
        <div className="max-w-5xl mx-auto h-full flex flex-col">
          
          {/* Top Nav */}
          <div className="mb-8 hidden lg:flex justify-between items-center">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:border-violet-500 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Dashboard
            </button>
            <div className="text-xs font-mono text-gray-400">
              SYNCED
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white dark:bg-[#1E293B] p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6 flex items-center gap-2">
            <div className="pl-4">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Vehicle ID or Status..." 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 h-12"
            />
            <div className="hidden sm:flex pr-2">
               <button className="p-2 text-gray-400 hover:text-violet-500 transition-colors">
                 <Filter className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
            {filteredHistory.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <History className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No records found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {searchTerm ? `No results matching "${searchTerm}"` : "You haven't made any parking requests yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0F172A]/50">
                      <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle Details</th>
                      <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                      <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredHistory.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-5">
                          <div className="font-mono font-bold text-gray-900 dark:text-white text-base">
                            {item.vehicleId}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                             ID: #{item.id.toString().slice(-6)}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Zone {item.preferredZone}
                            </span>
                            <span className="text-xs text-gray-500">
                              {item.slotId ? `Slot: ${item.slotId}` : 'Slot pending'}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${getStatusBadge(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(item.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 ml-6">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParkingHistory;
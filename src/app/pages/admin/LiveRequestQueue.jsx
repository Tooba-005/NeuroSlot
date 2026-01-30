import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Clock, Play, RefreshCw, Car, ChevronRight, Info, Inbox } from 'lucide-react';
import api from '@/app/services/api';

function LiveRequestQueue() {
  const [requests, setRequests] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const data = JSON.parse(localStorage.getItem('parkingRequests') || '[]');
    const pending = data
      .filter(r => r.status === 'REQUESTED')
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    setRequests(pending);
  };

  const processQueue = () => {
    setProcessing(true);
    const updated = api.processRequests();
    
    // Simulate system overhead for visual effect
    setTimeout(() => {
      setProcessing(false);
      if (updated) {
        toast.success('Queue synchronized and processed');
        loadRequests();
      } else {
        toast.info('Resource limit reached or queue empty');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F1A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6" data-aos="fade-down">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest">Logic Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Live <span className="text-indigo-600">Queue</span>
            </h1>
            <p className="text-gray-500 dark:text-slate-400 font-medium">FIFO (First-In-First-Out) Processing Pipeline</p>
          </div>

          <button
            onClick={processQueue}
            disabled={processing || requests.length === 0}
            className={`relative overflow-hidden group flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-40 disabled:grayscale transition-all active:scale-95`}
          >
            {processing ? (
              <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <Play className="w-5 h-5 mr-3 fill-current" />
            )}
            <span className="relative z-10">
              {processing ? 'EXECUTING LOGIC...' : 'START ALLOCATION'}
            </span>
          </button>
        </div>

        {/* Queue Display */}
        {requests.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/50 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-700 p-20 text-center" data-aos="fade-up">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-10 h-10 text-gray-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pipeline Clear</h3>
            <p className="text-gray-500 dark:text-slate-400 max-w-xs mx-auto">No pending parking requests are currently waiting for allocation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4 mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pending Operations ({requests.length})</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Priority Order</span>
            </div>
            
            {requests.map((request, idx) => (
              <div
                key={request.id}
                className="group relative bg-white dark:bg-slate-800 p-5 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all flex items-center justify-between"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                {/* Visual Position Indicator */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center border border-gray-100 dark:border-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <span className="text-[10px] font-black leading-none mb-1 opacity-60">POS</span>
                    <span className="text-lg font-black leading-none">{idx + 1}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-indigo-500" />
                      <p className="font-black text-gray-900 dark:text-white tracking-tight">{request.vehicleId}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-400 dark:text-slate-500 mt-1 uppercase">Request by: <span className="text-gray-600 dark:text-slate-300">{request.userName}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Target Zone</p>
                    <div className="inline-flex items-center px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
                      Zone {request.preferredZone}
                    </div>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DSA Protocol Note */}
        <div className="mt-12 bg-indigo-600 p-6 rounded-[2rem] text-white relative overflow-hidden" data-aos="fade-up">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock className="w-24 h-24 rotate-12" />
           </div>
           <div className="relative z-10 flex items-start gap-4">
             <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
               <Info className="w-5 h-5 text-white" />
             </div>
             <div>
               <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Queue Protocol (FIFO)</h4>
               <p className="text-xs text-indigo-100 leading-relaxed opacity-90">
                 This engine executes a First-In-First-Out sequence. The system attempts exact matches for Preferred Zones first. If a zone is saturated, it shifts to cross-zone allocation with an automated distance-penalty calculation.
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default LiveRequestQueue;
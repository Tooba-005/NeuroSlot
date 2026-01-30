import { useState } from 'react';
import { toast } from 'react-toastify';
import { RotateCcw, AlertTriangle, Info, Layers, ShieldAlert, History } from 'lucide-react';
import api from '@/app/services/api';

function RollbackPage() {
  const [k, setK] = useState(1);
  const [processing, setProcessing] = useState(false);

  const handleRollback = () => {
    if (k < 1) {
      toast.error('Value must be at least 1');
      return;
    }

    if (window.confirm(`CRITICAL ACTION: Revert the last ${k} allocation(s)? This will free slots and cancel active assignments.`)) {
      setProcessing(true);
      
      setTimeout(() => {
        const count = api.rollbackAllocations(k);
        setProcessing(false);
        
        if (count > 0) {
          toast.success(`Stack Pop Successful: ${count} allocations reverted.`);
          setK(1);
        } else {
          toast.error('Stack Underflow: No allocations available to rollback.');
        }
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F1A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10" data-aos="fade-down">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest">State Management</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            System <span className="text-rose-600">Rollback</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium">LIFO Stack: Reverting the most recent allocation cycles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Control Card */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none" data-aos="fade-right">
              <div className="mb-8">
                <label className="block text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                  Allocations to Revert (K)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={k}
                    onChange={(e) => setK(parseInt(e.target.value) || 1)}
                    className="block w-full text-3xl font-black px-6 py-5 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-rose-500 rounded-3xl transition-all dark:text-white"
                  />
                  <Layers className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-700 w-8 h-8" />
                </div>
              </div>

              <button
                onClick={handleRollback}
                disabled={processing}
                className="w-full relative overflow-hidden group py-5 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-rose-500/30 hover:bg-rose-700 disabled:opacity-50 transition-all active:scale-95"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <RotateCcw className={`w-5 h-5 ${processing ? 'animate-spin' : 'group-hover:-rotate-180 transition-transform duration-500'}`} />
                  {processing ? 'Processing Stack...' : 'Execute Rollback'}
                </div>
              </button>
            </div>

            {/* How It Works List */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 p-8" data-aos="fade-up">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" />
                Execution Logic
              </h3>
              <div className="space-y-4">
                {[
                  { step: '01', text: 'System targets the top K elements of the allocation stack.' },
                  { step: '02', text: 'Slot status for each record is set to "AVAILABLE".' },
                  { step: '03', text: 'Transaction status is permanently moved to "CANCELLED".' },
                  { step: '04', text: 'Memory indices are cleared for immediate re-allocation.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform">{item.step}</span>
                    <p className="text-xs font-bold text-gray-500 dark:text-slate-400 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Warning Sidebar */}
          <div className="space-y-6">
            <div className="bg-amber-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden" data-aos="fade-left">
              <ShieldAlert className="absolute -right-4 -bottom-4 w-24 h-24 text-black/10 -rotate-12" />
              <div className="relative z-10">
                <AlertTriangle className="w-8 h-8 mb-4 text-amber-900" />
                <h3 className="text-lg font-black leading-tight mb-4">Destructive<br/>Operation</h3>
                <ul className="space-y-3">
                  {['Irreversible state change', 'Clears active assignments', 'LIFO logic applied'].map((txt, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-amber-900/80">
                      <div className="w-1 h-1 bg-amber-900/40 rounded-full"></div> {txt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden" data-aos="fade-up" data-aos-delay="100">
              <Info className="w-6 h-6 mb-4 text-indigo-200" />
              <h3 className="text-sm font-black uppercase tracking-widest mb-2">Stack Protocol</h3>
              <p className="text-xs text-indigo-100 font-medium leading-relaxed opacity-80">
                Using <strong>Last-In-First-Out</strong> ensures system integrity by unwinding the most recent actions first, preventing data fragmentation.
              </p>
            </div>
          </div>

        </div>

        {/* Global Alert Note */}
        <div className="mt-12 text-center">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Authorized Personnel Only • Audit Log Active</p>
        </div>
      </div>
    </div>
  );
}

export default RollbackPage;
import { useContext } from 'react';
import { Car, Clock, MapPin, TrendingUp, ChevronRight, Info, ShieldCheck } from 'lucide-react';
import AuthContext from '@/app/context/AuthContext';

function UserDashboard({ setCurrentPage }) {
  const { user } = useContext(AuthContext);

  const actions = [
    {
      id: 'request-parking',
      title: 'Request Parking',
      subtitle: 'Zone A, B, or C',
      description: 'Submit a new vehicle request to the queue.',
      icon: Car,
      gradient: 'from-blue-500 to-blue-600',
      accent: 'text-blue-500',
    },
    {
      id: 'allocation-status',
      title: 'Allocation Status',
      subtitle: 'Live Updates',
      description: 'Check your current slot assignment.',
      icon: MapPin,
      gradient: 'from-emerald-500 to-emerald-600',
      accent: 'text-emerald-500',
    },
    {
      id: 'parking-history',
      title: 'Parking History',
      subtitle: 'Past Records',
      description: 'Review previous sessions and timestamps.',
      icon: Clock,
      gradient: 'from-violet-500 to-violet-600',
      accent: 'text-violet-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT PANEL: Context & Instructions (Dark/Brand Themed) */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#0F172A] text-white p-8 flex flex-col justify-between relative overflow-hidden shrink-0">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8 opacity-80">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span className="text-sm font-medium tracking-wider uppercase text-indigo-200">Secure Dashboard</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Hello, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              {user?.name || 'User'}
            </span>
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 mt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">DSA Engine Active</h3>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  Allocations are optimized using Priority Queues and Stack-based history tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Timeline Instructions */}
        <div className="relative z-10 mt-12 lg:mt-0">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Info className="w-4 h-4" /> Workflow
          </h4>
          <div className="space-y-6 border-l-2 border-slate-700 pl-6 ml-2 relative">
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-[#0F172A]"></span>
              <p className="text-sm text-slate-300">Submit vehicle & zone preference</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-600 ring-4 ring-[#0F172A]"></span>
              <p className="text-sm text-slate-300">System processes FIFO Queue</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-600 ring-4 ring-[#0F172A]"></span>
              <p className="text-sm text-slate-300">Receive slot allocation</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Action Area (Clean/Light) */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto bg-gray-50 dark:bg-[#111] dark:text-gray-200">
        <div className="max-w-3xl mx-auto h-full flex flex-col justify-center">
          
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Select a module to proceed</p>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
              v2.4.0
            </span>
          </div>

          <div className="space-y-5">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => setCurrentPage(action.id)}
                  className="group w-full text-left relative overflow-hidden bg-white dark:bg-[#1E293B] rounded-2xl p-1 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white dark:from-[#1E293B] dark:to-[#253045] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative flex items-center p-6 sm:p-8">
                    {/* Large Icon Box */}
                    <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="ml-6 grow">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {action.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                          {action.subtitle}
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        {action.description}
                      </p>
                    </div>

                    {/* Action Arrow */}
                    <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-full border-2 border-gray-100 dark:border-gray-700 items-center justify-center text-gray-400 group-hover:border-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note for mobile visual balance */}
          <div className="mt-12 text-center lg:text-left">
            <p className="text-xs text-gray-400">
              Need help? Contact support at parking@admin.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
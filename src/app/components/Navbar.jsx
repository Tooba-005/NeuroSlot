import { 
  Sun, Moon, User, LogOut, Home, Settings, 
  PlusCircle, LayoutGrid, Clock, History, BarChart3, ListOrdered, Undo2, 
  Cpu
} from 'lucide-react';

function Navbar({ currentPage, setCurrentPage, theme, toggleTheme, user, handleLogout }) {
  const isAdmin = user?.role === 'admin';

  const userMenuItems = [
    { id: 'user-dashboard', label: 'Console', icon: Home },
    { id: 'request-parking', label: 'New Request', icon: PlusCircle },
    { id: 'allocation-status', label: 'Live Link', icon: Clock },
    { id: 'parking-history', label: 'Archive', icon: History },
  ];

  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Core', icon: Home },
    { id: 'zone-management', label: 'Infrastructure', icon: Settings },
    { id: 'slot-grid', label: 'Spatial Map', icon: LayoutGrid },
    { id: 'live-queue', label: 'FIFO Queue', icon: ListOrdered },
    { id: 'rollback', label: 'LIFO Stack', icon: Undo2 },
    { id: 'analytics', label: 'Metrics', icon: BarChart3 },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      theme === 'dark' 
        ? 'bg-[#0B0F1A]/80 border-slate-800 backdrop-blur-xl text-white' 
        : 'bg-white/80 border-gray-100 backdrop-blur-xl text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Rebranded Logo: NEUROSLOT */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentPage(isAdmin ? 'admin-dashboard' : 'user-dashboard')}
          >
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <Cpu className="text-white w-6 h-6" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none">
                  NEURO<span className="text-indigo-500">SLOT</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">System OS v2.0</span>
            </div>
          </div>

          {/* Desktop Menu - Refined Pills */}
          <div className="hidden lg:flex items-center bg-gray-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-gray-200/50 dark:border-slate-800/50">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-500/10'
                      : 'text-gray-400 hover:text-gray-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 mr-2 ${isActive ? 'scale-110' : 'opacity-50'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Section Tools */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Profile Section */}
            <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-slate-800">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black tracking-tight">{user?.name}</span>
                <div className="flex items-center gap-1.5 mt-1">
                    <div className={`w-1 h-1 rounded-full animate-pulse ${isAdmin ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      isAdmin ? 'text-purple-500' : 'text-emerald-500'
                    }`}>
                      {isAdmin ? 'System Admin' : 'Active User'}
                    </span>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500 blur opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center border border-indigo-200 dark:border-slate-700 overflow-hidden">
                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="ml-2 p-2.5 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all group border border-rose-500/10"
              title="Terminate Session"
            >
              <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Minimalist Scroll */}
      <div className="lg:hidden overflow-x-auto no-scrollbar border-t border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <div className="flex p-3 gap-2 whitespace-nowrap">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-400 dark:text-slate-500'
                }`}
              >
                <Icon className="w-3 h-3 mr-2" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
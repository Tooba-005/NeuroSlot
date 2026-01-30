import { useState } from 'react';
import { toast } from 'react-toastify';
import { Lock, Mail, LogIn, Cpu, ShieldCheck, Activity } from 'lucide-react';

function Login({ setCurrentPage, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Access ID (Email) is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid protocol format';
    }
    if (!password) {
      newErrors.password = 'Security key is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Authentication Failed: Check credentials');
      return;
    }

    if (email === 'admin@parking.com' && password === 'Admin@123') {
      const adminUser = {
        name: 'Root Admin',
        email: 'admin@parking.com',
        role: 'admin'
      };
      setUser(adminUser);
      toast.success('Neural Link Established. Welcome, Admin.');
      setCurrentPage('admin-dashboard');
      return;
    }

    const mockUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const user = {
        name: foundUser.name,
        email: foundUser.email,
        role: 'user'
      };
      setUser(user);
      toast.success(`Access Granted: Welcome back, ${foundUser.name}`);
      setCurrentPage('user-dashboard');
    } else {
      toast.error('Identity Verification Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 relative z-10">
        
        {/* Left Side – NEUROSLOT Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter">NEURO<span className="text-indigo-200">SLOT</span></h1>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-black leading-tight">
                Precision <br />
                <span className="text-indigo-300 underline decoration-indigo-400/30">Infrastructure</span> Control.
              </h2>
              <p className="text-indigo-100/70 font-medium leading-relaxed">
                Connect to the neural network managing your city's spatial logic. Monitor real-time occupancy, execute FIFO queues, and maintain system integrity through a unified LIFO stack.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex gap-4 mt-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Encrypted
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
              <Activity className="w-3 h-3" /> Live Sync
            </div>
          </div>
        </div>

        {/* Right Side – Authentication Form */}
        <div className="bg-white dark:bg-[#0B0F1A] p-8 sm:p-12 flex flex-col justify-center border-l dark:border-slate-800">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Initialize Link
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
              Enter your credentials to synchronize data.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 mb-2">
                Access ID (Email)
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@neuroslot.io"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 dark:text-white border-2 ${
                    errors.email ? 'border-rose-500' : 'border-transparent focus:border-indigo-500'
                  } outline-none transition-all font-medium`}
                />
              </div>
              {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-wider">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 mb-2">
                Security Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 dark:text-white border-2 ${
                    errors.password ? 'border-rose-500' : 'border-transparent focus:border-indigo-500'
                  } outline-none transition-all font-medium`}
                />
              </div>
              {errors.password && <p className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-wider">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-indigo-500/40 transition-all active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              Establish Connection
            </button>

            <div className="relative flex items-center justify-center my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-slate-800"></div></div>
              <span className="relative px-4 bg-white dark:bg-[#0B0F1A] text-[10px] font-black text-gray-400 uppercase tracking-widest">or</span>
            </div>

            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              New to the network?
              <button
                type="button"
                onClick={() => setCurrentPage('register')}
                className="ml-2 text-indigo-600 hover:text-indigo-400 transition-colors"
              >
                Register Terminal
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
// --------------------------------- <strong>Admin Access:</strong> admin@parking.com / Admin@123 --------------------------------- //
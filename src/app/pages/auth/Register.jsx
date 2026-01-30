import { useState } from 'react';
import { toast } from 'react-toastify';
import { User, Mail, Lock, UserPlus, ArrowLeft, ShieldCheck, Cpu } from 'lucide-react';

function Register({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validateName = (name) => /^[a-zA-Z\s]{3,}$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => ({
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    isLongEnough: password.length >= 8,
  });

  const validateForm = () => {
    const newErrors = {};
    if (!validateName(formData.name)) newErrors.name = 'Identity name too short';
    if (!validateEmail(formData.email)) newErrors.email = 'Invalid communication protocol (email)';
    
    const pCheck = validatePassword(formData.password);
    if (!Object.values(pCheck).every(Boolean)) newErrors.password = 'Security requirements not met';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Keys do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Onboarding Interrupted: Validation Error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === formData.email)) {
      toast.error('Identity already exists in NeuroSlot network');
      return;
    }

    users.push({ ...formData, role: 'user' });
    localStorage.setItem('users', JSON.stringify(users));

    toast.success('Identity Created. Proceed to Login.');
    setCurrentPage('login');
  };

  const pStatus = validatePassword(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden">
      {/* Neural Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-5 gap-0 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 relative z-10 bg-[#0B0F1A]">
        
        {/* Left Side: Requirements Checklist (2/5 columns) */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-indigo-600/5 border-r border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Cpu className="w-5 h-5 text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Security Protocols</span>
            </div>
            <h3 className="text-xl font-black text-white mb-6">Encryption Standards</h3>
            <div className="space-y-4">
              {[
                { label: '8+ Characters', val: pStatus.isLongEnough },
                { label: 'Uppercase Logic', val: pStatus.hasUpperCase },
                { label: 'Numeric String', val: pStatus.hasNumber },
                { label: 'Special Character', val: pStatus.hasSpecialChar }
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 transition-opacity ${item.val ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${item.val ? 'bg-emerald-500 border-emerald-400' : 'border-white/20'}`}>
                    {item.val && <ShieldCheck className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-xs font-bold text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] font-medium text-gray-500 leading-relaxed uppercase tracking-wider">
            NeuroSlot uses AES-256 level simulated encryption for all user terminal keys.
          </p>
        </div>

        {/* Right Side: Form (3/5 columns) */}
        <div className="md:col-span-3 p-8 sm:p-12">
          <button
            onClick={() => setCurrentPage("login")}
            className="group flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-8 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Return to Gateway
          </button>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight">Register Terminal</h2>
            <p className="text-gray-400 mt-2 font-medium">Provision a new identity for the NeuroSlot network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Identity Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-white/5 rounded-2xl text-white focus:border-indigo-500 outline-none transition-all"
                    placeholder="Subject Name"
                  />
                </div>
                {errors.name && <p className="text-[9px] text-rose-500 font-bold mt-1 uppercase">{errors.name}</p>}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Network ID (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-white/5 rounded-2xl text-white focus:border-indigo-500 outline-none transition-all"
                    placeholder="user@neuroslot.io"
                  />
                </div>
                {errors.email && <p className="text-[9px] text-rose-500 font-bold mt-1 uppercase">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Access Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-white/5 rounded-2xl text-white focus:border-indigo-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Confirm Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-white/5 rounded-2xl text-white focus:border-indigo-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              Initialize Identity
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
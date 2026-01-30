import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Car, MapPin, Send, Info, ArrowLeft, Shield, ParkingSquare } from 'lucide-react';
import AuthContext from '@/app/context/AuthContext';

function RequestParking({ setCurrentPage }) {
  const { user } = useContext(AuthContext);
  const [vehicleId, setVehicleId] = useState('');
  const [preferredZone, setPreferredZone] = useState('A');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vehicleId.trim()) {
      toast.error('Please enter a vehicle ID');
      return;
    }

    // Get existing requests
    const requests = JSON.parse(localStorage.getItem('parkingRequests') || '[]');
    
    // Check if user already has a pending/allocated request
    const existingRequest = requests.find(
      req => req.userEmail === user.email && (req.status === 'REQUESTED' || req.status === 'ALLOCATED')
    );

    if (existingRequest) {
      toast.error('You already have an active parking request');
      return;
    }

    const newRequest = {
      id: Date.now(),
      userEmail: user.email,
      userName: user.name,
      vehicleId: vehicleId.trim(),
      preferredZone,
      status: 'REQUESTED',
      zoneId: null,
      slotId: null,
      timestamp: new Date().toISOString(),
      penalty: false,
    };

    requests.push(newRequest);
    localStorage.setItem('parkingRequests', JSON.stringify(requests));

    toast.success('Parking request submitted successfully!');
    setVehicleId('');
    setTimeout(() => {
      setCurrentPage('allocation-status');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT PANEL: Zone Information & Context */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#0F172A] text-white p-8 flex flex-col justify-between relative overflow-hidden shrink-0">
        
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 lg:hidden"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
            Request <br/>
            <span className="text-blue-400">Allocation</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Submit your vehicle details to enter the FIFO allocation queue.
          </p>

          {/* Zone Guide (Moved from bottom of old form to here) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4" /> Zone Guide
            </h3>

            {/* Zone A Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">A</div>
                <div>
                  <h4 className="font-semibold text-sm">Zone A</h4>
                  <p className="text-xs text-slate-400">Main Entrance (Premium)</p>
                </div>
              </div>
            </div>

            {/* Zone B Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">B</div>
                <div>
                  <h4 className="font-semibold text-sm">Zone B</h4>
                  <p className="text-xs text-slate-400">Side Entrance (Standard)</p>
                </div>
              </div>
            </div>

            {/* Zone C Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">C</div>
                <div>
                  <h4 className="font-semibold text-sm">Zone C</h4>
                  <p className="text-xs text-slate-400">Rear Lot (Long Term)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 relative z-10">
          <div className="flex items-start gap-3 text-xs text-slate-400 bg-slate-800/50 p-4 rounded-lg backdrop-blur-sm">
            <Shield className="w-4 h-4 shrink-0 text-blue-400" />
            <p>
              Allocations are automated. If your preferred zone is full, you may be reassigned with a minor penalty score.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Form Area */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto bg-gray-50 dark:bg-[#111] dark:text-gray-200">
        <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
          
          {/* Top Navigation */}
          <div className="mb-8 hidden lg:block">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Dashboard
            </button>
          </div>

          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <ParkingSquare className="w-8 h-8 text-blue-600" />
                New Request
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details below to reserve your spot.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Vehicle ID Input */}
              <div className="space-y-2">
                <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Vehicle Registration ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Car className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="vehicleId"
                    type="text"
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-[#0F172A] border-transparent focus:bg-white dark:focus:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono"
                    placeholder="ABC-1234"
                    required
                  />
                </div>
              </div>

              {/* Zone Selection */}
              <div className="space-y-2">
                <label htmlFor="preferredZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Zone
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <select
                    id="preferredZone"
                    value={preferredZone}
                    onChange={(e) => setPreferredZone(e.target.value)}
                    className="block w-full pl-11 pr-10 py-4 bg-gray-50 dark:bg-[#0F172A] border-transparent focus:bg-white dark:focus:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="A">Zone A - Main Entrance</option>
                    <option value="B">Zone B - Side Entrance</option>
                    <option value="C">Zone C - Rear Lot</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-semibold block mb-1">Queue Processing</span>
                  Your request is processed immediately via FIFO. Please check the status page shortly after submission.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all font-semibold text-lg transform hover:-translate-y-0.5"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestParking;
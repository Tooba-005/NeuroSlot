import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'aos/dist/aos.css';
import AOS from 'aos';

// Layout Components
import Navbar from '@/app/components/Navbar';
import AuthContext from '@/app/context/AuthContext';

// Auth Pages
import Login from '@/app/pages/auth/Login';
import Register from '@/app/pages/auth/Register';

// User Pages
import UserDashboard from '@/app/pages/user/UserDashboard';
import RequestParking from '@/app/pages/user/RequestParking';
import AllocationStatus from '@/app/pages/user/AllocationStatus';
import ParkingHistory from '@/app/pages/user/ParkingHistory';

// Admin Pages
import AdminDashboard from '@/app/pages/admin/AdminDashboard';
import ZoneManagement from '@/app/pages/admin/ZoneManagement';
import SlotGrid from '@/app/pages/admin/SlotGrid';
import LiveRequestQueue from '@/app/pages/admin/LiveRequestQueue';
import RollbackPage from '@/app/pages/admin/RollbackPage';
import AnalyticsPage from '@/app/pages/admin/AnalyticsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    // Auth Pages
    if (currentPage === 'login') {
      return <Login setCurrentPage={setCurrentPage} setUser={setUser} />;
    }
    if (currentPage === 'register') {
      return <Register setCurrentPage={setCurrentPage} />;
    }

    // User Pages
    if (currentPage === 'user-dashboard') {
      return <UserDashboard setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'request-parking') {
      return <RequestParking setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'allocation-status') {
      return <AllocationStatus setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'parking-history') {
      return <ParkingHistory setCurrentPage={setCurrentPage} />;
    }

    // Admin Pages
    if (currentPage === 'admin-dashboard') {
      return <AdminDashboard setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'zone-management') {
      return <ZoneManagement setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'slot-grid') {
      return <SlotGrid setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'live-queue') {
      return <LiveRequestQueue setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'rollback') {
      return <RollbackPage setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'analytics') {
      return <AnalyticsPage setCurrentPage={setCurrentPage} />;
    }

    return <Login setCurrentPage={setCurrentPage} setUser={setUser} />;
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-[#0F172A]' : 'bg-[#F5F7FB]'}`}>
        {user && (
          <Navbar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            theme={theme}
            toggleTheme={toggleTheme}
            user={user}
            handleLogout={handleLogout}
          />
        )}
        <main className={user ? 'pt-20' : ''}>
          {renderPage()}
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;

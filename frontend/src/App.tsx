import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2, LogOut } from 'lucide-react';

// ==========================================
// IMPOR FRONTEND 1 (PUBLIC & BORROWER)
// ==========================================
import Landing from './pages/public/Landing.tsx';
import Login from './pages/public/Login.tsx';
import Register from './pages/public/Register.tsx';
import ProfileSettings from './pages/public/ProfileSettings';
import BrowseCars from './pages/borrower/BrowseCars.tsx'; 
import BorrowerDashboard from './pages/borrower/Dashboard.tsx';
import CarDetail from './pages/borrower/CarDetail.tsx';
import Checkout from './pages/borrower/Checkout.tsx';
import RentalHistory from './pages/borrower/RentalHistory.tsx';

// ==========================================
// IMPOR FRONTEND 2 (LENDER & SIMULATOR)
// ==========================================
import { LenderLayout } from './layouts/LenderLayout.tsx';
import LenderDashboard from './pages/lender/Dashboard.tsx';
import FleetManagement from './pages/lender/FleetManagement.tsx';
import Maintenance from './pages/lender/Maintenance.tsx';
import Finances from './pages/lender/Finances.tsx';
import LiveTracking from './pages/lender/LiveTracking.tsx';
import GpsSimulator from './pages/simulator/GpsSimulator.tsx';

// ==========================================
// LAYOUT KHUSUS FRONTEND 1 (Dinamis & Terintegrasi)
// ==========================================
const PublicBorrowerLayout = () => {
  const { token, logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F0E9E0]">
      <nav className="flex justify-between items-center p-4 bg-white border-b-4 border-[#0F1525] sticky top-0 z-50">
        <Link to="/" className="text-2xl font-black text-[#062954] uppercase tracking-tighter flex items-center gap-2">
          <span className="bg-yellow-400 border-2 border-black px-2.5 py-0.5 shadow-[2px_2px_0px_#000]">Z</span> ZenAuto
        </Link>
        <div className="flex items-center space-x-3 md:space-x-4 font-black">
          <Link to="/cars" className="text-xs text-[#0F1525] hover:underline uppercase tracking-wide">Catalog</Link>
          
          {!token ? (
            <Link to="/login" className="text-xs text-[#0F1525] hover:underline uppercase tracking-wide">Login</Link>
          ) : (
            <button 
              onClick={() => {
                if(window.confirm("Keluar dari website ZenAuto?")) logout();
              }} 
              className="text-xs text-rose-600 hover:underline uppercase tracking-wide cursor-pointer bg-transparent border-none flex items-center gap-1 font-black"
            >
              <LogOut size={12} /> Logout
            </button>
          )}

          <Link to="/borrower/dashboard" className="neo-btn bg-emerald-400 text-black px-3 py-1.5 text-xs uppercase tracking-wider">
            Borrower
          </Link>
          <Link to="/lender" className="neo-btn bg-[#062954] text-white px-3 py-1.5 text-xs uppercase tracking-wider">
            Lender
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, loading } = useAuth(); 
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0E9E0] flex flex-col items-center justify-center p-6">
        <Loader2 className="animate-spin text-[#0F1525] mb-2" size={32} />
        <p className="font-black text-xs uppercase tracking-widest text-[#0F1525]">Verifying Session Tokens...</p>
      </div>
    );
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// ==========================================
// CORE APP ARCHITECTURE
// ==========================================
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* AREA JALUR PUBLIK & BORROWER COMPONENT CONTEXT */}
          <Route element={<PublicBorrowerLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cars" element={<BrowseCars />} /> 
            
            {/* AREA KHUSUS PENYEWA (Terproteksi Autentikasi JWT) */}
            <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/borrower/dashboard" element={<ProtectedRoute><BorrowerDashboard /></ProtectedRoute>} />
            <Route path="/borrower/cars/:car_id" element={<ProtectedRoute><CarDetail /></ProtectedRoute>} />
            <Route path="/borrower/checkout/:transaction_id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/borrower/history" element={<ProtectedRoute><RentalHistory /></ProtectedRoute>} />
          </Route>

          {/* AREA KHUSUS PEMILIK & SIMULATOR TELEMETRI (Terproteksi Autentikasi JWT) */}
          <Route element={<ProtectedRoute><LenderLayout /></ProtectedRoute>}>
            <Route path="/lender" element={<LenderDashboard />} />
            <Route path="/lender/fleets" element={<FleetManagement />} />
            <Route path="/lender/maintenance" element={<Maintenance />} />
            <Route path="/lender/finances" element={<Finances />} />
            <Route path="/lender/tracking" element={<LiveTracking />} />
            <Route path="/simulator/gps" element={<GpsSimulator />} />
          </Route>

          {/* GLOBAL FALLBACK GATEWAY (404 Handling) */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
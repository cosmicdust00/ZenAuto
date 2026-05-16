import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// ==========================================
// IMPOR FRONTEND 1 (PUBLIC & BORROWER)
// ==========================================
import Landing from './pages/public/Landing.tsx';
import Login from './pages/public/Login.tsx';
import Register from './pages/public/Register.tsx';
import BorrowerDashboard from './pages/borrower/Dashboard.tsx';
import BrowseCars from './pages/borrower/BrowseCars.tsx';
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
// LAYOUT KHUSUS FRONTEND 1 (Agar tidak nabrak LenderLayout)
// ==========================================
const PublicBorrowerLayout = () => {
  return (
    <div className="min-h-screen bg-[#F0E9E0]">
      {/* Neo-Brutalism Navbar khusus area Publik & Borrower */}
      <nav className="flex justify-between items-center p-4 bg-white border-b-4 border-[#0F1525] sticky top-0 z-50">
        <Link to="/" className="text-2xl font-black text-[#062954] uppercase tracking-tighter flex items-center gap-2">
          <span className="bg-yellow-400 border-2 border-black px-2.5 py-0.5 shadow-[2px_2px_0px_#000]">Z</span> ZenAuto
        </Link>
        
        <div className="flex items-center space-x-3 md:space-x-4 font-black">
          <Link to="/login" className="text-xs text-[#0F1525] hover:underline uppercase tracking-wide">Login</Link>
          <Link to="/borrower/dashboard" className="neo-btn bg-emerald-400 text-black px-3 py-1.5 text-xs uppercase tracking-wider">
            Borrower Panel
          </Link>
          <Link to="/lender/dashboard" className="neo-btn bg-[#062954] text-white px-3 py-1.5 text-xs uppercase tracking-wider">
            Lender Panel
          </Link>
        </div>
      </nav>
      {/* Outlet adalah tempat di mana Landing, Login, BrowseCars, dll akan di-render */}
      <Outlet />
    </div>
  );
};

// ==========================================
// MAIN APP ROUTING
// ==========================================
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* ==========================================
              RUTE FRONTEND 1 (PUBLIC & BORROWER)
              Menggunakan PublicBorrowerLayout
              ========================================== */}
          <Route element={<PublicBorrowerLayout />}>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Borrower */}
            <Route path="/borrower/dashboard" element={<BorrowerDashboard />} />
            <Route path="/borrower/cars" element={<BrowseCars />} />
            <Route path="/borrower/cars/:car_id" element={<CarDetail />} />
            <Route path="/borrower/checkout/:transaction_id" element={<Checkout />} />
            <Route path="/borrower/history" element={<RentalHistory />} />
          </Route>

          {/* ==========================================
              RUTE FRONTEND 2 (LENDER)
              TETAP MENGGUNAKAN LenderLayout BAWAAN ASLI
              ========================================== */}
          <Route element={<LenderLayout />}>
            <Route path="/lender/dashboard" element={<LenderDashboard />} />
            <Route path="/lender/fleets" element={<FleetManagement />} />
            <Route path="/lender/maintenance" element={<Maintenance />} />
            <Route path="/lender/finances" element={<Finances />} />
            <Route path="/lender/tracking" element={<LiveTracking />} />

            {/* Simulator Routes */}
            <Route path="/simulator/gps" element={<GpsSimulator />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
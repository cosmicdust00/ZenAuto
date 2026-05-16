import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/public/Landing.tsx';
import Login from './pages/public/Login.tsx';

// Layouts
import { LenderLayout } from './layouts/LenderLayout.tsx';

// Lender Pages
import LenderDashboard from './pages/lender/Dashboard.tsx';
import FleetManagement from './pages/lender/FleetManagement.tsx';
import Maintenance from './pages/lender/Maintenance.tsx';
import Finances from './pages/lender/Finances.tsx';
import LiveTracking from './pages/lender/LiveTracking.tsx';

// Simulator
import GpsSimulator from './pages/simulator/GpsSimulator.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes without Layout */}
        <Route path="/" element={
          <div>
            <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
              <Link to="/" className="text-xl font-bold text-blue-600">ZenAuto</Link>
              <div className="space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                <Link to="/borrower/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md">Dashboard</Link>
                <Link to="/lender/dashboard" className="bg-[#1D2B45] text-white px-4 py-2 rounded-md">Lender Panel</Link>
              </div>
            </nav>
            <Landing />
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Halaman Register</div>} />

        {/* Borrower Routes */}
        <Route path="/borrower/dashboard" element={<div>Dashboard Borrower</div>} />
        <Route path="/borrower/browse" element={<div>Katalog Mobil</div>} />

        {/* Lender Routes wrapped in LenderLayout */}
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
  );
}

export default App;
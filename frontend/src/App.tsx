import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/public/Landing.tsx';
import Login from './pages/public/Login.tsx';

function App() {
  return (
    <BrowserRouter>
      <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
        <Link to="/" className="text-xl font-bold text-blue-600">ZenAuto</Link>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
          <Link to="/borrower/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md">Dashboard</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Halaman Register</div>} />

        <Route path="/borrower/dashboard" element={<div>Dashboard Borrower</div>} />
        <Route path="/borrower/browse" element={<div>Katalog Mobil</div>} />

        <Route path="/lender/dashboard" element={<div>Dashboard Lender</div>} />
        <Route path="/lender/tracking" element={<div>Live Tracking</div>} />

        <Route path="/simulator/gps" element={<div>GPS Simulator</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
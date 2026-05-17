import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom'; 
import axios from 'axios'; 
import { useAuth } from '../../context/AuthContext';
import { Mail, ShieldCheck, LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Ekstrak fungsi login dan nilai token dari context
  const { login, token } = useAuth(); 
  const navigate = useNavigate();

  // Jika token JWT sudah ada (user sudah login), cegah render form dan langsung lempar ke dasbor
  if (token) {
    return <Navigate to="/borrower/dashboard" replace />; 
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Menembak endpoint otentikasi backend
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      // Backend diharapkan mengembalikan { token, user }
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid authentication response from server.');
      }

      // Memasukkan token dan profil asli dari database ke dalam Context/localStorage
      login(token, user);

      // Jika user belum mengisi nomor SIM atau rekening, arahkan ke profile settings.
      // Jika sudah, arahkan ke dasbor.
      if (!user.license_card_number && !user.bank_account) {
        navigate('/profile');
      } else {
        navigate('/borrower/dashboard'); // Sesuaikan path ini dengan router App.tsx Anda
      }

    } catch (err: any) {
      console.error("Login Authentication Error:", err);
      // Menangkap pesan error spesifik dari backend dan menampilkannya di UI
      setError(
        err.response?.data?.message || 
        err.message || 
        'System endpoint unreachable. Please check backend runtime.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#F0E9E0] flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md bg-white border-4 border-[#0F1525] p-8 shadow-[8px_8px_0px_0px_#0F1525] relative">
        <div className="absolute -top-4 left-6 bg-yellow-400 border-2 border-black font-black text-xs px-3 py-1 uppercase tracking-wider shadow-[2px_2px_0px_#000]">
          Security Firewall Gateway
        </div>
        
        <div className="text-center space-y-2 mb-8 mt-2">
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#0F1525]">SIGN IN</h2>
          <p className="text-xs font-bold text-[#4A5F68] uppercase tracking-wide">Authorize system transaction tokens</p>
        </div>

        {/* Panel Notifikasi Error Dinamis */}
        {error && (
          <div className="bg-rose-100 border-2 border-rose-600 text-rose-700 p-3 font-black text-[10px] uppercase tracking-wider mb-4 flex items-start gap-2">
            <span className="text-rose-600">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525] block">Identity Mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-11 border-3 border-[#0F1525] bg-white font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
                placeholder="borrower@zenauto.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525] block">Secure Passphrase</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-11 border-3 border-[#0F1525] bg-white font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full neo-btn text-white p-4 font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 rounded-none transition-all
              ${loading ? 'bg-gray-500 cursor-not-allowed border-gray-600 shadow-none' : 'bg-[#062954] hover:bg-[#1D2B45] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none shadow-[4px_4px_0px_#000] border-2 border-black'}
            `}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />} 
            {loading ? 'Validating Token...' : 'Authorize Session ➔'}
          </button>
        </form>

        <div className="text-center font-bold text-xs text-[#324858] mt-6 border-t-2 border-dashed border-[#0F1525] pt-4 uppercase tracking-wide">
          New System Entity? <Link to="/register" className="underline text-[#062954] hover:text-rose-500 transition-colors ml-1">Register Identity Record</Link>
        </div>
      </div>
    </div>
  );
}
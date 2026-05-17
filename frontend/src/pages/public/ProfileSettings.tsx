import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, CreditCard, Landmark, FileText, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProfileSettings() {
  // Mengekstrak token, data pengguna, dan fungsi pembaruan state lokal
  const { user, token, updateProfileState } = useAuth();
  const navigate = useNavigate();
  
  // State form
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mengisi form secara dinamis berdasarkan data JWT / database saat ini
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || 'Guest User');
      setPhoneNumber(user.phone_number || 'Not Registered');
      setLicenseNumber(user.license_card_number || '');
      setBankAccount(user.bank_account || '');
    }
  }, [user]);

  // Proteksi rute
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-[#F0E9E0] flex flex-col items-center justify-center p-6">
        <div className="bg-white border-4 border-black p-10 max-w-lg w-full text-center shadow-[8px_8px_0px_#0F1525] rounded-2xl">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-rose-600 mb-2">ACCESS DENIED</h2>
          <p className="font-bold text-gray-500 mb-6">You must be logged in to view and edit your profile settings.</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full neo-btn bg-yellow-400 text-black px-6 py-4 font-black uppercase tracking-widest border-2 border-black rounded-xl shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    setIsSuccess(false);
    setLoading(true);

    try {
      // Eksekusi HTTP PUT ke backend dengan Header JWT
      const response = await axios.put('http://localhost:5000/api/users/profile', {
        license_card_number: licenseNumber,
        bank_account: bankAccount
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Perbarui state AuthContext agar komponen lain (seperti Checkout) tahu bahwa user ini sudah memiliki nomor SIM tanpa perlu memuat ulang halaman.
      updateProfileState({
        license_card_number: licenseNumber,
        bank_account: bankAccount
      });

      setIsSuccess(true);
      setStatusMessage('PROFILE RECORDS DISPATCHED & INSTANTIATED SUCCESSFULLY!');
    } catch (err: any) {
      console.error("Profile Update Error:", err);
      setIsSuccess(false);
      setStatusMessage(
        err.response?.data?.message || 
        'System endpoint unreachable. Profile update failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 animate-fade-in">
      <div className="w-full bg-white border-4 border-[#0F1525] p-8 shadow-[8px_8px_0px_0px_#DAD0C4] rounded-3xl relative">
        
        <div className="absolute -top-4 left-6 bg-yellow-400 border-2 border-black font-black text-xs px-4 py-1.5 uppercase tracking-wider shadow-[2px_2px_0px_#000] rounded-full">
          Account Schema Setup
        </div>

        <div className="space-y-2 mb-8 mt-2">
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#0F1525]">PROFILE SETTINGS</h2>
          <p className="text-xs font-bold text-[#4A5F68] uppercase tracking-wide">
            Complete your driver verification parameters and payout accounts
          </p>
        </div>

        {/* Panel Notifikasi Dinamis (Sukses / Gagal) */}
        {statusMessage && (
          <div className={`border-2 rounded-xl p-4 font-black text-xs uppercase mb-6 tracking-wide flex items-center gap-2 
            ${isSuccess ? 'bg-emerald-100 border-emerald-600 text-emerald-800' : 'bg-rose-100 border-rose-600 text-rose-700'}`}
          >
            {isSuccess ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400 block">Full Legal Name (Locked)</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                disabled 
                value={fullName}
                className="w-full p-3 pl-12 rounded-xl border-3 border-gray-300 bg-gray-100 font-bold text-gray-400 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400 block">Registered Phone Line (Locked)</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                disabled 
                value={phoneNumber}
                className="w-full p-3 pl-12 rounded-xl border-3 border-gray-300 bg-gray-100 font-bold text-gray-400 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="w-full h-0.5 border-t-2 border-dashed border-gray-300 my-4"></div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525] block tracking-wide">
              Driver's License Number (SIM A) <span className="text-red-600">*Required for Renting</span>
            </label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                required
                placeholder="Ex: 0912-8831-00004"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full p-3 pl-12 rounded-xl border-3 border-[#0F1525] bg-white font-black text-sm text-[#0F1525] focus:outline-none focus:bg-yellow-50 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525] block tracking-wide">
              Bank Account Settlement <span className="text-gray-400">*Required for Lenders</span>
            </label>
            <div className="relative">
              <Landmark className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                required
                placeholder="Ex: BCA - 883120931"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full p-3 pl-12 rounded-xl border-3 border-[#0F1525] bg-white font-black text-sm text-[#0F1525] focus:outline-none focus:bg-yellow-50 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full neo-btn text-white p-4 font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 rounded-xl border-2 border-black transition-all mt-4
              ${loading ? 'bg-gray-500 shadow-none cursor-not-allowed border-gray-600' : 'bg-[#0F1525] shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none'}
            `}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Processing Schema...' : 'Save Profile Context ➔'}
          </button>
        </form>
      </div>
    </div>
  );
}
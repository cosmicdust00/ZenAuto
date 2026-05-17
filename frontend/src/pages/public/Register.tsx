import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, User, Mail, Phone, ShieldAlert, CreditCard, Loader2 } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nameRegex = /^[a-zA-Z\s]{3,100}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const phoneRegex = /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/;
  const idCardRegex = /^\d{16}$/;

  // Fungsi validasi final saat submit
  const validateForm = () => {
    if (!nameRegex.test(fullName)) return "Nama lengkap tidak valid.";
    if (!emailRegex.test(email)) return "Format email tidak valid.";
    if (!passwordRegex.test(password)) return "Kata sandi tidak memenuhi syarat keamanan.";
    const cleanPhone = phone.replace(/[-\s]/g, '');
    if (!phoneRegex.test(cleanPhone)) return "Nomor telepon tidak valid.";
    if (!idCardRegex.test(idCard)) return "Nomor KTP harus tepat 16 digit angka.";
    return null; 
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', {
        full_name: fullName,
        email: email,
        password_hash: password, 
        phone_number: phone.replace(/[-\s]/g, ''), 
        id_card_number: idCard
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Server connection cluster failure.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#F0E9E0] flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-xl bg-white border-4 border-[#0F1525] p-8 shadow-[8px_8px_0px_0px_#0F1525]">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#0F1525]">REGISTER IDENTITY</h2>
          <p className="text-xs font-bold text-[#4A5F68] uppercase tracking-wide">Deploy new profile instances into PostgreSQL schema contexts</p>
        </div>

        {error && (
          <div className="bg-rose-100 border-2 border-rose-600 text-rose-700 p-3 font-black text-[10px] uppercase tracking-wider mb-4 flex items-start gap-2">
            <span className="text-rose-600">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-100 border-2 border-emerald-600 text-emerald-800 p-3 font-black text-[10px] uppercase tracking-wider mb-4 flex items-start gap-2">
            <span className="text-emerald-600">✓</span>
            <span>Identity context deployed successfully! Redirecting to auth center...</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* FULL NAME INPUT */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-black uppercase text-[#0F1525]">Full Legal Name</label>
            <div className="relative">
              <User className={`absolute left-3 top-3.5 w-5 h-5 ${fullName && !nameRegex.test(fullName) ? 'text-rose-500' : 'text-gray-400'}`} />
              <input 
                type="text" 
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className={`w-full p-3 pl-11 font-bold text-sm focus:outline-none transition-colors border-3 
                  ${fullName && !nameRegex.test(fullName) ? 'border-rose-500 bg-rose-50 text-rose-700 focus:bg-rose-100' : 'border-[#0F1525] focus:bg-yellow-50'}`} 
                placeholder="Carlsson Khovis" 
                disabled={loading || success}
              />
            </div>
            {fullName && !nameRegex.test(fullName) && (
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-wide">Minimal 3 karakter huruf & spasi.</p>
            )}
          </div>

          {/* EMAIL INPUT */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525]">Email Context</label>
            <div className="relative">
              <Mail className={`absolute left-3 top-3.5 w-5 h-5 ${email && !emailRegex.test(email) ? 'text-rose-500' : 'text-gray-400'}`} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={`w-full p-3 pl-11 font-bold text-sm focus:outline-none transition-colors border-3 
                  ${email && !emailRegex.test(email) ? 'border-rose-500 bg-rose-50 text-rose-700 focus:bg-rose-100' : 'border-[#0F1525] focus:bg-yellow-50'}`} 
                placeholder="carlsson@mail.com" 
                disabled={loading || success}
              />
            </div>
            {email && !emailRegex.test(email) && (
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-wide">Format email tidak valid.</p>
            )}
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525]">Security Code</label>
            <div className="relative">
              <ShieldAlert className={`absolute left-3 top-3.5 w-5 h-5 ${password && !passwordRegex.test(password) ? 'text-rose-500' : 'text-gray-400'}`} />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={`w-full p-3 pl-11 font-bold text-sm focus:outline-none transition-colors border-3 
                  ${password && !passwordRegex.test(password) ? 'border-rose-500 bg-rose-50 text-rose-700 focus:bg-rose-100' : 'border-[#0F1525] focus:bg-yellow-50'}`} 
                placeholder="••••••••" 
                disabled={loading || success}
              />
            </div>
            {password && !passwordRegex.test(password) && (
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-wide leading-tight mt-1">Min 8 karakter, 1 huruf besar, 1 kecil, 1 angka.</p>
            )}
          </div>

          {/* PHONE INPUT */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525]">Active Phone Line</label>
            <div className="relative">
              <Phone className={`absolute left-3 top-3.5 w-5 h-5 ${phone && !phoneRegex.test(phone.replace(/[-\s]/g, '')) ? 'text-rose-500' : 'text-gray-400'}`} />
              <input 
                type="text" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className={`w-full p-3 pl-11 font-bold text-sm focus:outline-none transition-colors border-3 
                  ${phone && !phoneRegex.test(phone.replace(/[-\s]/g, '')) ? 'border-rose-500 bg-rose-50 text-rose-700 focus:bg-rose-100' : 'border-[#0F1525] focus:bg-yellow-50'}`} 
                placeholder="0812XXXXXXXX" 
                disabled={loading || success}
              />
            </div>
            {phone && !phoneRegex.test(phone.replace(/[-\s]/g, '')) && (
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-wide">Diawali 08/+62, 10-15 angka.</p>
            )}
          </div>

          {/* ID CARD (KTP) INPUT */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525]">National ID Card (KTP)</label>
            <div className="relative">
              <CreditCard className={`absolute left-3 top-3.5 w-5 h-5 ${idCard && !idCardRegex.test(idCard) ? 'text-rose-500' : 'text-gray-400'}`} />
              <input 
                type="text" 
                required 
                maxLength={16} 
                value={idCard} 
                onChange={(e) => setIdCard(e.target.value)} 
                className={`w-full p-3 pl-11 font-bold text-sm focus:outline-none transition-colors border-3 
                  ${idCard && !idCardRegex.test(idCard) ? 'border-rose-500 bg-rose-50 text-rose-700 focus:bg-rose-100' : 'border-[#0F1525] focus:bg-yellow-50'}`} 
                placeholder="3273XXXXXXXXXXXX" 
                disabled={loading || success}
              />
            </div>
            {idCard && !idCardRegex.test(idCard) && (
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-wide">Wajib tepat 16 digit angka.</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || success}
            className={`w-full md:col-span-2 neo-btn p-4 font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 mt-4 rounded-none transition-all
              ${loading || success ? 'bg-gray-400 text-gray-600 cursor-not-allowed border-gray-500 shadow-none' : 'bg-emerald-400 text-black border-2 border-black hover:bg-emerald-300 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none shadow-[4px_4px_0px_#000]'}
            `}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />} 
            {loading ? 'DEPLOYING...' : success ? 'SUCCESS!' : 'Deploy Account Instance ➔'}
          </button>
        </form>

        <div className="text-center font-bold text-xs text-[#324858] mt-6 border-t-2 border-dashed border-[#0F1525] pt-4 uppercase tracking-wide">
          Already verified? <Link to="/login" className="underline text-[#062954] hover:text-rose-500 transition-colors ml-1">Return to Login</Link>
        </div>
      </div>
    </div>
  );
}
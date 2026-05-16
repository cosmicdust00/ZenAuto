import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, ShieldAlert, CreditCard } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password_hash: password,
          phone_number: phone,
          id_card_number: idCard
        }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || 'Failed to deploy structural records.');

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Server connection cluster failure.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#F0E9E0] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white border-4 border-[#0F1525] p-8 shadow-[8px_8px_0px_0px_#0F1525]">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#0F1525]">REGISTER IDENTITY</h2>
          <p className="text-xs font-bold text-[#4A5F68] uppercase tracking-wide">Deploy new profile instances into PostgreSQL schema contexts</p>
        </div>

        {error && (
          <div className="bg-rose-100 border-2 border-rose-600 text-rose-700 p-3 font-bold text-xs uppercase mb-4">
             Error: {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-100 border-2 border-emerald-600 text-emerald-800 p-3 font-bold text-xs uppercase mb-4">
             Identity context deployed successfully! Redirecting to auth center...
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-black uppercase text-[#0F1525]">Full Legal Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 pl-11 border-3 border-[#0F1525] font-bold text-sm" placeholder="Carlsson Khovis" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525]">Email Context</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 pl-11 border-3 border-[#0F1525] font-bold text-sm" placeholder="carlsson@mail.com" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525]">Security Code</label>
            <div className="relative">
              <ShieldAlert className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 pl-11 border-3 border-[#0F1525] font-bold text-sm" placeholder="••••••••" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525]">Active Phone Line</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 pl-11 border-3 border-[#0F1525] font-bold text-sm" placeholder="0812XXXXXXXX" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-[#0F1525]">National ID Card (KTP)</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" required maxLength={16} value={idCard} onChange={(e) => setIdCard(e.target.value)} className="w-full p-3 pl-11 border-3 border-[#0F1525] font-bold text-sm" placeholder="3273XXXXXXXXXXXX" />
            </div>
          </div>

          <button type="submit" className="w-full md:col-span-2 neo-btn bg-emerald-400 text-black p-4 font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 mt-2 rounded-none">
            <UserPlus className="w-5 h-5" /> Deploy Account Instance ➔
          </button>
        </form>
      </div>
    </div>
  );
}
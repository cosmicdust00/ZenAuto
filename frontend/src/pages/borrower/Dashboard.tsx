import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, ClipboardList, Wallet, Radio } from 'lucide-react';

export default function BorrowerDashboard() {
  const { user } = useAuth();
  const [metrics] = useState({ activeRentals: 1, historicalTrips: 14, accruedPenalties: 0 });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* CONTEXT GREETING HEADER */}
      <div className="w-full bg-gradient-to-r from-[#062954] via-[#324858] to-[#4A5F68] border-4 border-[#0F1525] p-8 text-white shadow-[6px_6px_0px_0px_#0F1525] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">OPERATIONAL CONSOLE: {user?.full_name || 'GUEST USER'}</h1>
          <p className="font-bold text-gray-300 text-sm">Welcome to your borrower terminal runtime. Query active fleets and allocate lease parameters efficiently.</p>
        </div>
        <Link to="/borrower/cars" className="neo-btn bg-yellow-400 text-black px-6 py-3.5 text-sm uppercase tracking-wider font-black whitespace-nowrap rounded-none">
          + Initialize New Lease
        </Link>
      </div>

      {/* HARD METRICS ANALYTICS PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="w-full bg-white border-4 border-[#0F1525] p-6 shadow-[6px_6px_0px_0px_#0F1525] flex justify-between items-center">
          <div>
            <span className="text-xs font-black uppercase text-[#4A5F68]">Active Allocations</span>
            <div className="text-4xl font-black text-[#0F1525] mt-1">{metrics.activeRentals} Car Unit</div>
          </div>
          <div className="w-12 h-12 bg-sky-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <Car className="w-6 h-6 text-black" />
          </div>
        </div>

        <div className="w-full bg-white border-4 border-[#0F1525] p-6 shadow-[6px_6px_0px_0px_#0F1525] flex justify-between items-center">
          <div>
            <span className="text-xs font-black uppercase text-[#4A5F68]">Aggregated Trips</span>
            <div className="text-4xl font-black text-[#0F1525] mt-1">{metrics.historicalTrips} Sessions</div>
          </div>
          <div className="w-12 h-12 bg-emerald-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <ClipboardList className="w-6 h-6 text-black" />
          </div>
        </div>

        <div className="w-full bg-white border-4 border-[#0F1525] p-6 shadow-[6px_6px_0px_0px_#0F1525] flex justify-between items-center">
          <div>
            <span className="text-xs font-black uppercase text-[#4A5F68]">Accrued Penalties</span>
            <div className="text-4xl font-black text-rose-600 mt-1">IDR {metrics.accruedPenalties.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 bg-rose-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <Wallet className="w-6 h-6 text-rose-600" />
          </div>
        </div>
      </div>

      {/* TELEMETRY LINK ACTIVE MONITOR WIDGET */}
      <div className="w-full bg-white border-4 border-[#0F1525] p-6 shadow-[6px_6px_0px_0px_#0F1525] space-y-4">
        <div className="flex items-center gap-2 border-b-4 border-[#0F1525] pb-3">
          <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
          <h2 className="text-lg font-black uppercase tracking-tight">Active Realtime IoT Hardware Stream</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-xl font-black text-[#0F1525]">Toyota Avanza Veloz (Standard Line)</h4>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Plate: B 4529 VIP • Status: IN-TRANSIT MAPPED IN MONGODB</p>
          </div>
          <Link to="/lender/tracking" className="neo-btn bg-[#F0E9E0] text-black px-5 py-2.5 text-xs uppercase font-black rounded-none">
            Launch GPS Track View ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
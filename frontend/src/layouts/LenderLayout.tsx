import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Wrench,
  DollarSign,
  Map as MapIcon,
  LogOut,
  Radio
} from 'lucide-react';

export const LenderLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { id: '/lender/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: '/lender/fleets', label: 'Fleet Management', icon: <Car size={20} /> },
    { id: '/lender/maintenance', label: 'Maintenance', icon: <Wrench size={20} /> },
    { id: '/lender/finances', label: 'Finances', icon: <DollarSign size={20} /> },
    { id: '/lender/tracking', label: 'Live Tracking', icon: <MapIcon size={20} /> },
    { id: '/simulator/gps', label: 'Simulator', icon: <Radio size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#EBE6D9] font-sans selection:bg-[#295A8E] selection:text-[#F8F8F6]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1D2B45] text-[#F8F8F6] flex flex-col border-r-4 border-[#1D2B45] shadow-[8px_0px_0px_0px_rgba(29,43,69,0.1)] z-10 shrink-0">

        <div className="p-6 border-b-2 border-[#F8F8F6]/10 mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-[#295A8E] p-2 border-2 border-[#F8F8F6] shadow-[4px_4px_0px_0px_#F8F8F6]">
              <Car size={28} className="text-[#F8F8F6]" />
            </div>
            <Link to="/" className="text-3xl font-black tracking-tighter hover:opacity-80">ZenAuto</Link>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-3">
          {navItems.map(item => {
            const isActive = location.pathname === item.id;
            return (
              <Link
                key={item.id}
                to={item.id}
                className={`
                  w-full flex items-center space-x-4 px-4 py-3 font-bold uppercase tracking-wider transition-all text-left
                  ${isActive
                    ? 'bg-[#F8F8F6] text-[#1D2B45] border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#295A8E] translate-x-2'
                    : 'text-[#EBE6D9] hover:bg-[#F8F8F6]/10 hover:translate-x-1 border-2 border-transparent'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t-2 border-[#F8F8F6]/10 mt-auto">
          <Link to="/" className="flex items-center space-x-3 w-full font-bold uppercase text-[#EBE6D9] hover:text-white hover:translate-x-1 transition-all">
            <LogOut size={20} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 relative">
        {/* Subtle background pattern to mimic fabric weave slightly */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1D2B45 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

        <div className="max-w-6xl mx-auto relative z-10 h-full">
          {/* The specific page content will be injected here by React Router */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

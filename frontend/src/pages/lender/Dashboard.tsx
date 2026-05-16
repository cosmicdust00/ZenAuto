import { Car, Wrench, DollarSign, Activity } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { mockFleets, mockFinances } from '../../data/mockData.ts';

export default function LenderDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b-4 border-[#1D2B45] pb-4">
        <div>
          <h1 className="text-4xl font-black text-[#1D2B45] uppercase tracking-tight">Overview</h1>
          <p className="text-[#5E4E46] font-medium mt-1">Lender Dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <PatchCard variant="navy" className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#F8F8F6] text-[#1D2B45] border-2 border-[#1D2B45] shadow-[2px_2px_0px_0px_#1D2B45]"><Car size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Total Fleet</p>
            <h3 className="text-4xl font-black mt-1">4</h3>
          </div>
        </PatchCard>

        <PatchCard variant="denim" className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#F8F8F6] text-[#295A8E] border-2 border-[#1D2B45] shadow-[2px_2px_0px_0px_#1D2B45]"><Activity size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Active Rentals</p>
            <h3 className="text-4xl font-black mt-1">1</h3>
          </div>
        </PatchCard>

        <PatchCard variant="brown" className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#F8F8F6] text-[#5E4E46] border-2 border-[#1D2B45] shadow-[2px_2px_0px_0px_#1D2B45]"><Wrench size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">In Maintenance</p>
            <h3 className="text-4xl font-black mt-1">1</h3>
          </div>
        </PatchCard>

        <PatchCard variant="olive" className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#F8F8F6] text-[#4F6355] border-2 border-[#1D2B45] shadow-[2px_2px_0px_0px_#1D2B45]"><DollarSign size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Revenue</p>
            <h3 className="text-3xl font-black mt-1">Rp 4.7M</h3>
          </div>
        </PatchCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PatchCard variant="white">
          <div className="flex justify-between items-center mb-6 border-b-2 border-[#1D2B45] pb-2">
            <h2 className="text-xl font-black text-[#1D2B45] uppercase">Recent Finances</h2>
            <button className="text-sm font-bold text-[#295A8E] hover:underline uppercase tracking-wider">View All</button>
          </div>
          <div className="space-y-4">
            {mockFinances.slice(0,3).map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 border-2 border-[#1D2B45] bg-[#EBE6D9] shadow-[2px_2px_0px_0px_#1D2B45]">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-[#1D2B45] text-[#F8F8F6]"><DollarSign size={20} /></div>
                  <div>
                    <p className="font-bold text-[#1D2B45] uppercase">{item.type}</p>
                    <p className="text-xs font-bold text-[#5E4E46]">{item.car} • {item.date}</p>
                  </div>
                </div>
                <span className="font-black text-[#4F6355] text-lg">Rp {item.amount.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </PatchCard>

        <PatchCard variant="cream">
          <div className="flex justify-between items-center mb-6 border-b-2 border-[#1D2B45] pb-2">
            <h2 className="text-xl font-black text-[#1D2B45] uppercase">Fleet Status</h2>
          </div>
          <div className="space-y-3">
            {mockFleets.map(car => (
              <div key={car.id} className="flex justify-between items-center bg-[#F8F8F6] border-2 border-[#1D2B45] p-3 shadow-[2px_2px_0px_0px_#1D2B45]">
                <div>
                  <p className="font-bold text-[#1D2B45] uppercase">{car.model}</p>
                  <p className="text-xs font-bold text-[#295A8E]">{car.plate}</p>
                </div>
                <Badge status={car.status} />
              </div>
            ))}
          </div>
        </PatchCard>
      </div>
    </div>
  );
}

import { MapPin, Radio } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { ActionButton } from '../../components/ui/ActionButton.tsx';

export default function LiveTracking() {
  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b-4 border-[#1D2B45] pb-4 shrink-0">
        <h1 className="text-4xl font-black text-[#1D2B45] uppercase tracking-tight">Live Tracking</h1>
        <Badge status="rented" label="1 Active Tracker" />
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Map Area */}
        <div className="flex-1 bg-[#EBE6D9] border-4 border-[#1D2B45] shadow-[6px_6px_0px_0px_#1D2B45] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(#1D2B45 2px, transparent 2px), linear-gradient(90deg, #1D2B45 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
          {/* Map Pin */}
          <div className="absolute top-1/3 left-1/2 flex flex-col items-center">
            <div className="relative">
              <div className="animate-ping absolute -inset-2 rounded-none border-2 border-[#295A8E] bg-[#295A8E] opacity-50"></div>
              <div className="relative bg-[#295A8E] text-[#F8F8F6] p-3 border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45]">
                <MapPin size={28} />
              </div>
            </div>
            <div className="mt-4 bg-[#F8F8F6] px-4 py-2 border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] text-center">
              <span className="font-black text-[#1D2B45] uppercase block">Toyota Avanza</span>
              <span className="text-sm font-bold text-[#295A8E]">B 1234 XYZ</span>
            </div>
          </div>
        </div>

        {/* Tracking Sidebar */}
        <PatchCard variant="white" className="w-80 flex flex-col h-full overflow-y-auto relative z-10 shrink-0">
          <h2 className="font-black text-[#1D2B45] uppercase tracking-wider mb-6 flex items-center space-x-2 border-b-2 border-[#1D2B45] pb-2">
            <div className="bg-[#4F6355] text-[#F8F8F6] p-1 border-2 border-[#1D2B45]"><Radio size={18} /></div>
            <span>Signals</span>
          </h2>

          <div className="border-2 border-[#1D2B45] p-4 bg-[#EBE6D9] mb-4 shadow-[4px_4px_0px_0px_#1D2B45]">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-black text-[#295A8E] uppercase">Toyota Avanza</h3>
              <span className="flex h-4 w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full bg-[#4F6355] opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 border-2 border-[#1D2B45] bg-[#4F6355]"></span>
              </span>
            </div>
            <p className="text-sm font-bold text-[#5E4E46] mb-1">Plate: B 1234 XYZ</p>
            <p className="text-sm font-bold text-[#5E4E46] mb-3">Update: Just now</p>
            <div className="bg-[#1D2B45] p-3 text-sm font-bold font-mono text-[#F8F8F6] border-2 border-[#1D2B45]">
              LAT: -6.2088<br />LNG: 106.8456
            </div>
            <ActionButton variant="denim" className="mt-4 w-full justify-center">
              History
            </ActionButton>
          </div>

          <div className="border-2 border-[#1D2B45] p-4 bg-[#F8F8F6] opacity-60 grayscale">
            <h3 className="font-black text-[#1D2B45] uppercase mb-1">Honda Brio</h3>
            <p className="text-sm font-bold text-[#5E4E46]">OFFLINE (GARAGE)</p>
          </div>
        </PatchCard>
      </div>
    </div>
  );
}

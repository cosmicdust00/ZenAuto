import { Plus } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { ActionButton } from '../../components/ui/ActionButton.tsx';
import { mockFleets } from '../../data/mockData.ts';

export default function FleetManagement() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b-4 border-[#1D2B45] pb-4">
        <h1 className="text-4xl font-black text-[#1D2B45] uppercase tracking-tight">Fleet Management</h1>
        <ActionButton variant="navy"><Plus size={16}/> <span>Add Vehicle</span></ActionButton>
      </div>

      <PatchCard variant="white" className="p-0 overflow-hidden">
        <div className="p-6 border-b-4 border-[#1D2B45] bg-[#EBE6D9]">
          <h2 className="text-xl font-black text-[#1D2B45] uppercase">Your Armada</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1D2B45] text-[#F8F8F6] text-sm uppercase tracking-wider">
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Model & Plate</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Color</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">GPS ID</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1D2B45] font-medium">
              {mockFleets.map((car, index) => (
                <tr key={car.id} className={`${index % 2 === 0 ? 'bg-[#F8F8F6]' : 'bg-[#EBE6D9]'} hover:bg-[#EBE6D9]/50 transition-colors`}>
                  <td className="p-4 border-r-2 border-[#1D2B45]">
                    <p className="font-black text-[#1D2B45] uppercase">{car.model}</p>
                    <p className="text-xs font-bold text-[#5E4E46]">{car.plate}</p>
                  </td>
                  <td className="p-4 font-bold uppercase border-r-2 border-[#1D2B45]">{car.color}</td>
                  <td className="p-4 font-mono text-sm border-r-2 border-[#1D2B45]">{car.gps_device_id}</td>
                  <td className="p-4 border-r-2 border-[#1D2B45]"><Badge status={car.status} /></td>
                  <td className="p-4 text-right space-x-3 flex justify-end">
                    <ActionButton variant="white">Edit</ActionButton>
                    {car.status === 'available' ? (
                      <ActionButton variant="danger">Withdraw</ActionButton>
                    ) : (
                      <div className="w-[110px]"></div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PatchCard>
    </div>
  );
}

import { Wrench, CheckCircle2 } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { ActionButton } from '../../components/ui/ActionButton.tsx';
import { mockMaintenance } from '../../data/mockData.ts';

export default function Maintenance() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b-4 border-[#1D2B45] pb-4">
        <h1 className="text-4xl font-black text-[#1D2B45] uppercase tracking-tight">Maintenance</h1>
        <ActionButton variant="brown"><Wrench size={16}/> <span>Record Service</span></ActionButton>
      </div>

      <PatchCard variant="white" className="p-0 overflow-hidden">
        <div className="p-6 border-b-4 border-[#1D2B45] bg-[#EBE6D9]">
          <h2 className="text-xl font-black text-[#1D2B45] uppercase">Service Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1D2B45] text-[#F8F8F6] text-sm uppercase tracking-wider">
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Vehicle</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Issue / Desc</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Start Date</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Est. Cost</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1D2B45] font-medium">
              {mockMaintenance.map((log, index) => (
                <tr key={log.id} className={`${index % 2 === 0 ? 'bg-[#F8F8F6]' : 'bg-[#EBE6D9]'}`}>
                  <td className="p-4 border-r-2 border-[#1D2B45]">
                    <p className="font-black text-[#1D2B45] uppercase">{log.car.split('(')[0]}</p>
                    <p className="text-xs font-bold text-[#5E4E46]">({log.car.split('(')[1]}</p>
                  </td>
                  <td className="p-4 font-bold text-[#5E4E46] border-r-2 border-[#1D2B45]">{log.issue}</td>
                  <td className="p-4 font-bold text-[#5E4E46] border-r-2 border-[#1D2B45]">{log.startDate}</td>
                  <td className="p-4 font-black text-[#4F6355] border-r-2 border-[#1D2B45]">Rp {log.cost.toLocaleString('id-ID')}</td>
                  <td className="p-4 border-r-2 border-[#1D2B45]"><Badge status={log.status} /></td>
                  <td className="p-4 text-right flex justify-end">
                    {log.status === 'in_progress' ? (
                      <ActionButton variant="olive"><CheckCircle2 size={16}/> <span>Complete</span></ActionButton>
                    ) : (
                      <span className="text-[#5E4E46] font-bold uppercase text-xs italic">Resolved</span>
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

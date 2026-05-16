import { Plus } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { ActionButton } from '../../components/ui/ActionButton.tsx';
import { mockFinances } from '../../data/mockData.ts';

export default function Finances() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b-4 border-[#1D2B45] pb-4">
        <h1 className="text-4xl font-black text-[#1D2B45] uppercase tracking-tight">Finances</h1>
        <ActionButton variant="olive"><Plus size={16}/> <span>Record Entry</span></ActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PatchCard variant="denim">
          <h3 className="font-bold uppercase tracking-widest opacity-80 mb-2">Total Earnings</h3>
          <p className="text-4xl font-black">Rp 4.700.000</p>
        </PatchCard>
        
        <PatchCard variant="cream">
          <h3 className="font-bold uppercase tracking-widest text-[#5E4E46] mb-2">Pending Withdrawals</h3>
          <p className="text-4xl font-black text-[#1D2B45]">Rp 0</p>
        </PatchCard>
        
        <PatchCard variant="olive">
          <h3 className="font-bold uppercase tracking-widest opacity-80 mb-2">Collected Penalties</h3>
          <p className="text-4xl font-black">Rp 50.000</p>
        </PatchCard>
      </div>

      <PatchCard variant="white" className="p-0 overflow-hidden">
        <div className="p-6 border-b-4 border-[#1D2B45] bg-[#EBE6D9]">
          <h2 className="text-xl font-black text-[#1D2B45] uppercase">Transaction Ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1D2B45] text-[#F8F8F6] text-sm uppercase tracking-wider">
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Date</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Type</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Car Reference</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Amount</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1D2B45] font-medium">
              {mockFinances.map((log, index) => (
                <tr key={log.id} className={`${index % 2 === 0 ? 'bg-[#F8F8F6]' : 'bg-[#EBE6D9]'} hover:bg-[#295A8E] hover:text-[#F8F8F6] transition-colors group`}>
                  <td className="p-4 border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45]">{log.date}</td>
                  <td className="p-4 font-bold uppercase border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45]">{log.type}</td>
                  <td className="p-4 border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45]">{log.car}</td>
                  <td className="p-4 font-black border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45]">Rp {log.amount.toLocaleString('id-ID')}</td>
                  <td className="p-4"><Badge status={log.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PatchCard>
    </div>
  );
}

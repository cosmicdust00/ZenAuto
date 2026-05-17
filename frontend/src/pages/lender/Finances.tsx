import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Loader2 } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { ActionButton } from '../../components/ui/ActionButton.tsx';
import { useAuth } from '../../context/AuthContext';

interface LedgerItem {
  id: string;
  dateStr: string;
  rawDate: Date;
  type: string;
  car: string;
  amount: number;
  status: string;
}

export default function Finances() {
  const { token, user } = useAuth();

  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [collectedPenalties, setCollectedPenalties] = useState(0);
  const [unpaidPenalties, setUnpaidPenalties] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinances = async () => {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get('/api/lender/finances', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { earnings, penalties } = response.data.data;
        
        let earningsSum = 0;
        let collectedPenSum = 0;
        let unpaidPenSum = 0;
        const combinedLedger: LedgerItem[] = [];

        if (earnings && earnings.length > 0) {
          earnings.forEach((e: any) => {
            const amt = parseFloat(e.amount);
            earningsSum += amt;
            
            combinedLedger.push({
              id: e.payment_id,
              dateStr: new Date(e.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              rawDate: new Date(e.payment_date),
              type: 'Rental Income',
              car: `${e.model_name} (${e.license_plate})`,
              amount: amt,
              status: 'rented' 
            });
          });
        }

        if (penalties && penalties.length > 0) {
          penalties.forEach((p: any) => {
            const amt = parseFloat(p.amount);
            
            if (p.is_paid) {
              collectedPenSum += amt;
            } else {
              unpaidPenSum += amt;
            }
            
            combinedLedger.push({
              id: p.penalty_id,
              dateStr: new Date(p.actual_return_date || new Date()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              rawDate: new Date(p.actual_return_date || new Date()),
              type: `Penalty: ${p.penalty_type}`,
              car: `${p.model_name || 'Vehicle'} (${p.license_plate})`,
              amount: amt,
              status: p.is_paid ? 'rented' : 'maintenance' 
            });
          });
        }

        combinedLedger.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

        setLedger(combinedLedger);
        setTotalEarnings(earningsSum);
        setCollectedPenalties(collectedPenSum);
        setUnpaidPenalties(unpaidPenSum);

      } catch (error) {
        console.error("Failed to fetch finance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinances();
  }, [token, user]);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b-4 border-[#1D2B45] pb-4">
        <h1 className="text-4xl font-black text-[#1D2B45] uppercase tracking-tight">Finances</h1>
        <ActionButton variant="olive"><Plus size={16}/> <span>Record Entry</span></ActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PatchCard variant="denim">
          <h3 className="font-bold uppercase tracking-widest opacity-80 mb-2">Total Earnings</h3>
          <p className="text-4xl font-black">
            {isLoading ? <Loader2 className="animate-spin" /> : `Rp ${totalEarnings.toLocaleString('id-ID')}`}
          </p>
        </PatchCard>
        
        <PatchCard variant="cream">
          <h3 className="font-bold uppercase tracking-widest text-[#5E4E46] mb-2">Unpaid Penalties</h3>
          <p className="text-4xl font-black text-[#1D2B45]">
            {isLoading ? <Loader2 className="animate-spin" /> : `Rp ${unpaidPenalties.toLocaleString('id-ID')}`}
          </p>
        </PatchCard>
        
        <PatchCard variant="olive">
          <h3 className="font-bold uppercase tracking-widest opacity-80 mb-2">Collected Penalties</h3>
          <p className="text-4xl font-black">
            {isLoading ? <Loader2 className="animate-spin" /> : `Rp ${collectedPenalties.toLocaleString('id-ID')}`}
          </p>
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
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20 whitespace-nowrap">Date</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Type</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Car Reference</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Amount</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1D2B45] font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#5E4E46] font-bold">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Syncing Ledger Database...
                  </td>
                </tr>
              ) : ledger.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#5E4E46] font-bold">
                    No financial records found.
                  </td>
                </tr>
              ) : (
                ledger.map((log, index) => (
                  <tr key={log.id} className={`${index % 2 === 0 ? 'bg-[#F8F8F6]' : 'bg-[#EBE6D9]'} hover:bg-[#295A8E] hover:text-[#F8F8F6] transition-colors group`}>
                    <td className="p-4 border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45] whitespace-nowrap">{log.dateStr}</td>
                    <td className="p-4 font-bold uppercase border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45]">{log.type}</td>
                    <td className="p-4 border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45]">{log.car}</td>
                    <td className="p-4 font-black border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45]">
                      Rp {log.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <Badge status={log.status as any} label={log.status === 'rented' ? 'CLEARED' : 'PENDING'} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PatchCard>
    </div>
  );
}
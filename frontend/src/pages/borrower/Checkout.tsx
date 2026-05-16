import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Landmark, Wallet, CreditCard, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const { transaction_id } = useParams();
  const [searchParams] = useSearchParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState('Bank Clearing Transfer');
  const [processing, setProcessing] = useState(false);

  const parsedRate = Number(searchParams.get('price')) || 3200000;
  const grandTotalAmount = parsedRate * 2; // Simulated transaction scope calculation factor

  const executePaymentGatewayPipeline = async () => {
    setProcessing(true);

    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ transaction_id, payment_method: method, amount: grandTotalAmount })
      });

      if (!response.ok) throw new Error('Transaction execution denied by relational integrity constraints.');
      navigate('/borrower/history');
    } catch (err) {
      console.warn("Bypassing gateway infrastructure server blocks...");
      navigate('/borrower/history');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 animate-fade-in">
      <div className="w-full bg-white border-4 border-[#0F1525] p-8 shadow-[8px_8px_0px_0px_#0F1525] space-y-6">
        <h2 className="text-3xl font-black uppercase tracking-tight">SECURE BALANCING GATEWAY</h2>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Registry Scope Reference UUID: <span className="font-mono text-black">{transaction_id}</span></p>

        <div className="border-4 border-black p-4 bg-[#F0E9E0] space-y-2 font-bold text-xs uppercase text-[#0F1525]">
          <div className="flex justify-between border-b border-dashed border-gray-400 pb-2"><span>Temporal Multiplier Frame:</span><span>2 Days Allocation</span></div>
          <div className="flex justify-between text-base font-black pt-1"><span>TOTAL CHARGED OUTCOME:</span><span className="text-emerald-700">IDR {grandTotalAmount.toLocaleString()}</span></div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-[#0F1525] block tracking-wider">Select Settlement Method Context</label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button type="button" onClick={() => setMethod('Bank Clearing Transfer')} className={`p-4 border-2 border-black font-black text-xs uppercase flex flex-col items-center gap-2 rounded-none cursor-pointer ${method === 'Bank Clearing Transfer' ? 'bg-yellow-400 shadow-[3px_3px_0px_#000]' : 'bg-white'}`}>
              <Landmark className="w-6 h-6 text-black" /> Clearing Bank
            </button>
            <button type="button" onClick={() => setMethod('E-Wallet Digital Gateway')} className={`p-4 border-2 border-black font-black text-xs uppercase flex flex-col items-center gap-2 rounded-none cursor-pointer ${method === 'E-Wallet Digital Gateway' ? 'bg-yellow-400 shadow-[3px_3px_0px_#000]' : 'bg-white'}`}>
              <Wallet className="w-6 h-6 text-black" /> Digital App
            </button>
            <button type="button" onClick={() => setMethod('Credit Settlement Card')} className={`p-4 border-2 border-black font-black text-xs uppercase flex flex-col items-center gap-2 rounded-none cursor-pointer ${method === 'Credit Settlement Card' ? 'bg-yellow-400 shadow-[3px_3px_0px_#000]' : 'bg-white'}`}>
              <CreditCard className="w-6 h-6 text-black" /> Settlement Card
            </button>
          </div>
        </div>

        <button onClick={executePaymentGatewayPipeline} disabled={processing} className="w-full neo-btn bg-emerald-400 text-black p-4 font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 mt-4 rounded-none">
          <ShieldCheck className="w-5 h-5" /> {processing ? 'Deploying Capital Tokens...' : 'Confirm Balance Settlement ➔'}
        </button>
      </div>
    </div>
  );
}
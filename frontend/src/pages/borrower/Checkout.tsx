import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Landmark, Wallet, CreditCard, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const { transaction_id } = useParams();
  // const { user } = useAuth();

  const user = {
      user_id: "82e093e6-8204-444c-bcd9-b5fb28006fc1", // UUID milik Ciel dari Supabase
      full_name: "Ciel"
  };
  const navigate = useNavigate();

  const [method, setMethod] = useState('Bank Clearing Transfer');
  const [processing, setProcessing] = useState(false);
  
  // State untuk menyimpan data tagihan asli dari backend
  const [transaction, setTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch transaksi dari database
  useEffect(() => {
    const fetchTransactionDetail = async () => {
      // Gunakan user statis bypass jika sedang testing (seperti di App.tsx)
      if (!user?.user_id) {
        setIsLoading(false);
        return;
      }

      try {
        // Ambil seluruh riwayat transaksi milik user ini
        const response = await axios.get(`http://localhost:5000/api/borrower/reservations?user_id=${user.user_id}`);
        
        // Cari transaksi yang ID-nya cocok dengan URL saat ini
        const foundTx = response.data.data.find((tx: any) => tx.transaction_id === transaction_id);

        if (foundTx) {
          setTransaction(foundTx);
        } else {
          alert("Transaction not found or unauthorized access!");
          navigate('/borrower/dashboard');
        }
      } catch (error) {
        console.error("Failed to fetch data transaction:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (transaction_id) fetchTransactionDetail();
  }, [transaction_id, user, navigate]);

  // Eksekusi backend2
  const executePaymentGatewayPipeline = async () => {
    setProcessing(true);

    try {
      // Tembak API Payment yang sudah dibuat di borrower.controller.js
      await axios.post('http://localhost:5000/api/borrower/payments', {
        transaction_id: transaction_id,
        payment_method: method,
        amount: parseFloat(transaction.total_amount) // Kirim jumlah persis seperti di database
      });

      alert("Payment Successful! Vehicle is now actively rented.");
      navigate('/borrower/history');
      
    } catch (err: any) {
      console.error("Payment Error:", err);
      // Tampilkan error asli dari backend
      alert(err.response?.data?.message || "Transaction execution denied by server.");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading || !transaction) {
    return <div className="p-8 text-center font-black uppercase tracking-widest text-xl">Loading Secure Gateway...</div>;
  }

  // Parse total amount dari DB PG
  const grandTotalAmount = parseFloat(transaction.total_amount);

  return (
    <div className="max-w-2xl mx-auto p-8 animate-fade-in">
      <div className="w-full bg-white border-4 border-[#0F1525] p-8 shadow-[8px_8px_0px_0px_#0F1525] space-y-6">
        <h2 className="text-3xl font-black uppercase tracking-tight">SECURE BALANCING GATEWAY</h2>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Registry Scope Reference UUID: <br/><span className="font-mono text-black text-[10px] break-all">{transaction_id}</span></p>

        <div className="border-4 border-black p-4 bg-[#F0E9E0] space-y-2 font-bold text-xs uppercase text-[#0F1525]">
          <div className="flex justify-between border-b border-dashed border-gray-400 pb-2">
            <span>Vehicle Model:</span>
            <span>{transaction.brand} {transaction.model_name}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-gray-400 pb-2 pt-2">
            <span>Booking Date:</span>
            <span>{new Date(transaction.booking_date).toLocaleDateString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-base font-black pt-2">
            <span>TOTAL CHARGED OUTCOME:</span>
            <span className="text-emerald-700">Rp {grandTotalAmount.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-[#0F1525] block tracking-wider">Select Settlement Method Context</label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button type="button" onClick={() => setMethod('Bank Clearing Transfer')} className={`p-4 border-2 border-black font-black text-xs uppercase flex flex-col items-center gap-2 rounded-none cursor-pointer transition-all ${method === 'Bank Clearing Transfer' ? 'bg-yellow-400 shadow-[3px_3px_0px_#000]' : 'bg-white hover:bg-gray-50'}`}>
              <Landmark className="w-6 h-6 text-black" /> Clearing Bank
            </button>
            <button type="button" onClick={() => setMethod('E-Wallet Digital Gateway')} className={`p-4 border-2 border-black font-black text-xs uppercase flex flex-col items-center gap-2 rounded-none cursor-pointer transition-all ${method === 'E-Wallet Digital Gateway' ? 'bg-yellow-400 shadow-[3px_3px_0px_#000]' : 'bg-white hover:bg-gray-50'}`}>
              <Wallet className="w-6 h-6 text-black" /> Digital App
            </button>
            <button type="button" onClick={() => setMethod('Credit Settlement Card')} className={`p-4 border-2 border-black font-black text-xs uppercase flex flex-col items-center gap-2 rounded-none cursor-pointer transition-all ${method === 'Credit Settlement Card' ? 'bg-yellow-400 shadow-[3px_3px_0px_#000]' : 'bg-white hover:bg-gray-50'}`}>
              <CreditCard className="w-6 h-6 text-black" /> Settlement Card
            </button>
          </div>
        </div>

        <button 
          onClick={executePaymentGatewayPipeline} 
          disabled={processing || transaction.transaction_status !== 'pending'} 
          className={`w-full neo-btn text-black p-4 font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 mt-4 rounded-none transition-all
            ${processing || transaction.transaction_status !== 'pending' ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed' : 'bg-emerald-400 border-black shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none'}`}
        >
          <ShieldCheck className="w-5 h-5" /> 
          {processing ? 'Deploying Capital Tokens...' : 
           transaction.transaction_status !== 'pending' ? 'Invoice Already Settled' : 
           'Confirm Balance Settlement ➔'}
        </button>
      </div>
    </div>
  );
}
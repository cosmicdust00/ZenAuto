import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw, AlertTriangle, CheckSquare } from 'lucide-react';

export default function RentalHistory() {
  const { token } = useAuth(); 
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Membuat objek user bypass di bagian atas komponen
  const user = {
    user_id: "82e093e6-8204-444c-bcd9-b5fb28006fc1", // UUID milik Ciel
    full_name: "Ciel"
  };

  const fetchLeaseLedgerContext = async () => {
    try {
      setIsLoading(true);
      // Menggunakan objek user.user_id secara konsisten seperti di dashboard
      const response = await axios.get(`http://localhost:5000/api/borrower/reservations?user_id=${user.user_id}`);
      
      if (Array.isArray(response.data.data)) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("Fail to fetch history transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchLeaseLedgerContext(); 
  }, []);

  // Fungsi return mobil (mengaktifkan mekanisme penalty)
  const dispatchReturnEngineTrigger = async (detailId: string) => {
    if (!window.confirm("Confirm Action: Discharging vehicle unit allocation. Proceed to hit server automated penalty checker?")) return;

    try {
      // Menembak rute returnCar yang dibuat
      const response = await axios.post(`http://localhost:5000/api/borrower/returns/${detailId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` } // Untuk persiapan JWT
      });
      
      const data = response.data.data;

      // Mengecek apakah ada denda berdasarkan respons backend
      if (data.is_late) {
        alert(`RETURN DOCUMENTED (LATE PENALTY APPLIED)!\n\nYou returned the car ${data.late_days} day(s) late.\nPenalty Amount: Rp ${data.penalty_amount.toLocaleString('id-ID')}`);
      } else {
        alert('Return documented successfully. No late penalties accrued.');
      }
      
      // Refresh tabel agar kolom 'Actual Return Log' terisi
      fetchLeaseLedgerContext();

    } catch (error: any) {
      console.error("Fail to return:", error);
      alert(error.response?.data?.message || "Internal Server Error saat mengembalikan mobil.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center font-black uppercase tracking-widest text-xl">Loading Ledger Data...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-black uppercase tracking-tight text-[#0F1525]">RENTAL HISTORY LEDGER</h2>
        <p className="text-xs font-bold text-[#4A5F68] uppercase tracking-wide">Archived structural timeline records of historical vehicular lease contracts</p>
      </div>

      <div className="w-full bg-white border-4 border-[#0F1525] shadow-[6px_6px_0px_0px_#0F1525] overflow-x-auto">
        <table className="w-full text-left font-bold text-sm text-[#0F1525]">
          <thead className="bg-[#DAD0C4] text-[#0F1525] border-b-4 border-black text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 border-r-2 border-black">Allocated Model Name</th>
              <th className="p-4 border-r-2 border-black">Lease Pick-Up</th>
              <th className="p-4 border-r-2 border-black">Expected Handover</th>
              <th className="p-4 border-r-2 border-black">Actual Return Log</th>
              <th className="p-4 border-r-2 border-black">Rate Locked</th>
              <th className="p-4 text-center">System Action Core</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black bg-[#F0E9E0]">
            {history.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">
                  NO HISTORICAL RECORDS FOUND FOR THIS USER.
                </td>
              </tr>
            ) : (
              history.map((row, idx) => (
                <tr key={idx} className="hover:bg-white transition-colors">
                  <td className="p-4 border-r-2 border-black font-black uppercase text-xs">
                    {row.brand} {row.model_name}
                    <div className="text-[9px] text-gray-500 mt-0.5">Plate: {row.license_plate}</div>
                  </td>
                  <td className="p-4 border-r-2 border-black text-xs">{new Date(row.start_date).toLocaleString('id-ID')}</td>
                  <td className="p-4 border-r-2 border-black text-xs">{new Date(row.end_date).toLocaleString('id-ID')}</td>
                  <td className="p-4 border-r-2 border-black text-xs">
                    {row.actual_return_date ? (
                      <span className="text-emerald-800 bg-emerald-100 border border-emerald-600 px-2 py-0.5 font-black uppercase text-[10px]">
                        {new Date(row.actual_return_date).toLocaleString('id-ID')}
                      </span>
                    ) : (
                      <span className="text-amber-800 bg-amber-100 border border-amber-600 px-2 py-0.5 font-black uppercase text-[10px] inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> In Lease Scope
                      </span>
                    )}
                  </td>
                  <td className="p-4 border-r-2 border-black text-xs text-slate-600">IDR {parseFloat(row.total_amount).toLocaleString('id-ID')}</td>
                  <td className="p-4 text-center">
                    {/* Hanya tampilkan tombol Handover jika mobil belum dikembalikan DAN status transaksi 'active' */}
                    {!row.actual_return_date && row.transaction_status === 'active' ? (
                      <button 
                        onClick={() => dispatchReturnEngineTrigger(row.rental_detail_id)}
                        className="neo-btn bg-amber-400 text-black px-4 py-1.5 text-[10px] uppercase tracking-wider font-black flex items-center gap-1 mx-auto rounded-none border-2 border-black hover:bg-amber-300"
                      >
                        <RefreshCw className="w-3 h-3" /> Handover Unit
                      </button>
                    ) : !row.actual_return_date && row.transaction_status === 'pending' ? (
                      <span className="text-[10px] text-rose-500 uppercase tracking-widest font-black inline-flex items-center gap-1">
                        PAYMENT PENDING
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black inline-flex items-center gap-1">
                        <CheckSquare className="w-3 h-3" /> ARCHIVED RECORD
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
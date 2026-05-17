import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, CheckCircle2, Loader2, X } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { ActionButton } from '../../components/ui/ActionButton.tsx';
import { useAuth } from '../../context/AuthContext';

// Tipe data tabel Maintenance
interface MaintenanceLog {
  id: string;
  carName: string;
  licensePlate: string;
  issue: string;
  startDate: string;
  cost: number;
  rawStatus: string;
  badgeStatus: string;
}

// Tipe data untuk dropdown pilihan mobil
interface FleetCar {
  car_id: string;
  license_plate: string;
  model_name: string;
  status: string;
}

export default function Maintenance() {
  const { token, user } = useAuth();

  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk kontrol Modal Form "Record Service"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableCars, setAvailableCars] = useState<FleetCar[]>([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maintenance data
  const fetchMaintenanceLogs = async () => {
    if (!token || !user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get('/api/lender/maintenance', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data.data;
      if (data && data.length > 0) {
        const formattedLogs: MaintenanceLog[] = data.map((log: any) => ({
          id: log.maintenance_id,
          carName: log.model_name,
          licensePlate: log.license_plate,
          issue: log.description,
          startDate: new Date(log.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
          cost: parseFloat(log.cost) || 0,
          rawStatus: log.status,
          badgeStatus: log.status === 'in progress' ? 'maintenance' : 'available' 
        }));
        setLogs(formattedLogs);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Failed to fetch maintenance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceLogs();
  }, [token, user]);

  // End service
  const handleCompleteService = async (maintenanceId: string) => {
    if (!token) return;

    const finalCostStr = window.prompt("How much is the cost?(ex: 450000)");
    if (finalCostStr === null) return; 
    
    const finalCost = parseFloat(finalCostStr);
    if (isNaN(finalCost) || finalCost < 0) {
      alert("Make the valid cost.");
      return;
    }

    try {
      await axios.put(`/api/lender/maintenances/${maintenanceId}/complete`, { cost: finalCost }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Maintenance is complete, car is available.");
      fetchMaintenanceLogs();
    } catch (error: any) {
      console.error("Failed to complete maintenance:", error);
      alert(error.response?.data?.message || "There is problem in system.");
    }
  };

  // Modal
  const handleOpenModal = async () => {
    if (!token) {
      alert("Login first to do this step.");
      return;
    }
    
    setIsModalOpen(true);
    try {
      // Tarik daftar armada milik lender ini (Backend sudah tahu siapa lendernya dari token)
      const response = await axios.get('/api/lender/fleets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter hanya mobil yang sedang 'available'
      const cars = response.data.data;
      const readyToService = cars.filter((car: FleetCar) => car.status === 'available');
      setAvailableCars(readyToService);
    } catch (error) {
      console.error("Fail to list fleet:", error);
    }
  };

  // Submit form
  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId || !description.trim() || !token) {
      alert("Choose a car or fill the description!");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/lender/maintenances', {
        car_id: selectedCarId,
        description: description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Success, car is submitted!.");
      
      // Tutup modal, reset form, dan refresh tabel
      setIsModalOpen(false);
      setSelectedCarId('');
      setDescription('');
      fetchMaintenanceLogs();
    } catch (error: any) {
      console.error("Failed to submit the car:", error);
      alert(error.response?.data?.message || "Failed to submit car.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-end border-b-4 border-[#1D2B45] pb-4">
        <h1 className="text-4xl font-black text-[#1D2B45] uppercase tracking-tight">Maintenance</h1>
        <ActionButton variant="brown" onClick={handleOpenModal}>
          <Wrench size={16}/> <span>Record Service</span>
        </ActionButton>
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
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20 whitespace-nowrap">Start Date</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Est. Cost</th>
                <th className="p-4 font-bold border-r-2 border-[#F8F8F6]/20">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1D2B45] font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5E4E46] font-bold">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Syncing Maintenance Bay...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5E4E46] font-bold">
                    No active or past maintenance records found.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={log.id} className={`${index % 2 === 0 ? 'bg-[#F8F8F6]' : 'bg-[#EBE6D9]'} hover:bg-[#295A8E] hover:text-[#F8F8F6] transition-colors group`}>
                    <td className="p-4 border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45]">
                      <p className="font-black text-[#1D2B45] uppercase group-hover:text-[#F8F8F6]">{log.carName}</p>
                      <p className="text-xs font-bold text-[#5E4E46] group-hover:text-[#F8F8F6]/70">{log.licensePlate}</p>
                    </td>
                    <td className="p-4 font-bold text-[#5E4E46] border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45] group-hover:text-[#F8F8F6]">
                      {log.issue}
                    </td>
                    <td className="p-4 font-bold text-[#5E4E46] border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45] group-hover:text-[#F8F8F6] whitespace-nowrap">
                      {log.startDate}
                    </td>
                    <td className="p-4 font-black text-[#4F6355] border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45] group-hover:text-emerald-400 whitespace-nowrap">
                      Rp {log.cost.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 border-r-2 border-[#1D2B45] group-hover:border-[#1D2B45]">
                      <Badge status={log.badgeStatus as any} label={log.rawStatus.replace('_', ' ').toUpperCase()} />
                    </td>
                    <td className="p-4 text-right flex justify-end">
                      {log.rawStatus === 'in progress' ? (
                        <ActionButton variant="olive" onClick={() => handleCompleteService(log.id)}>
                          <CheckCircle2 size={16}/> <span>Complete</span>
                        </ActionButton>
                      ) : (
                        <span className="text-[#5E4E46] font-bold uppercase text-xs italic group-hover:text-[#F8F8F6]/70">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PatchCard>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#EBE6D9] border-4 border-[#1D2B45] shadow-[8px_8px_0px_0px_#1D2B45] w-full max-w-md relative flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-[#1D2B45] p-4 text-[#F8F8F6]">
              <h2 className="font-black uppercase tracking-widest flex items-center gap-2">
                <Wrench size={18} /> New Service Log
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-rose-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitService} className="p-6 space-y-5">
              
              {/* Dropdown Pemilihan Mobil */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-[#1D2B45]">Select Available Vehicle</label>
                <select 
                  className="w-full border-2 border-[#1D2B45] p-3 text-sm font-bold bg-[#F8F8F6] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#1D2B45] cursor-pointer appearance-none"
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- CHOOSE UNIT TO DISPATCH --</option>
                  {availableCars.length === 0 ? (
                    <option value="" disabled>No available vehicles found.</option>
                  ) : (
                    availableCars.map(car => (
                      <option key={car.car_id} value={car.car_id}>
                        {car.license_plate} - {car.model_name}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                  *Only vehicles with 'AVAILABLE' status can be dispatched for maintenance.
                </p>
              </div>

              {/* Input Deskripsi Kerusakan */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-[#1D2B45]">Issue Description / Service Type</label>
                <textarea 
                  className="w-full border-2 border-[#1D2B45] p-3 text-sm font-bold bg-[#F8F8F6] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#1D2B45] resize-none h-28"
                  placeholder="e.g. Routine oil change, brake pad replacement, AC freon refill..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#1D2B45] text-[#F8F8F6] p-4 font-black uppercase border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] hover:bg-[#295A8E] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#1D2B45] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'DISPATCH TO FACILITY'}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
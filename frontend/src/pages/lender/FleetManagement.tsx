import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Loader2, X, AlertTriangle, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { ActionButton } from '../../components/ui/ActionButton.tsx';

// Tipe data untuk daftar armada
interface FleetCar {
  id: string;
  model: string;
  plate: string;
  color: string;
  gps_device_id: string;
  status: string;
}

interface CarModel {
  model_id: string;
  brand: string;
  model_name: string;
}

export default function FleetManagement() {
  const [fleets, setFleets] = useState<FleetCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    model_id: '',
    license_plate: '',
    color: '',
    gps_device_id: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // TEMPORARY BYPASS
  const bypassUserId = '64ec5509-9b5f-4462-8018-044d92401799';

  // List fleet
  const fetchFleets = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/lender/fleets', {
        params: { user_id: bypassUserId },
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data.data;
      if (data && data.length > 0) {
        const formattedFleets: FleetCar[] = data.map((car: any) => ({
          id: car.car_id,
          model: `${car.brand} ${car.model_name}`,
          plate: car.license_plate,
          color: car.color,
          gps_device_id: car.gps_device_id || 'N/A',
          status: car.status
        }));
        setFleets(formattedFleets);
      } else {
        setFleets([]);
      }
    } catch (error) {
      console.error("Failed to fetch fleet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleets();
    
    // Cleanup function untuk pratinjau URL agar tidak memori leak
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Model Dropdown
  const handleOpenAddModal = async () => {
    setIsModalOpen(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/lender/car-models', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarModels(response.data.data || []);
    } catch (error) {
      console.error("Failed to get car model:", error);
    }
  };

  // File Picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        alert('Use valid image format (JPG, PNG, dll)');
        return;
      }

      setSelectedFile(file);
      // Membuat URL temporer untuk pratinjau gambar di UI
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit new vehicle
  const handleSubmitNewVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.model_id || !formData.license_plate || !formData.color || !selectedFile) {
      alert("Fill all data!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      const uploadData = new FormData();
      uploadData.append('image', selectedFile);

      const uploadResponse = await axios.post('http://localhost:5000/api/uploads/car-image', uploadData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const finalImageUrl = uploadResponse.data.imageUrl;

      await axios.post('http://localhost:5000/api/lender/fleets', {
        model_id: formData.model_id,
        license_plate: formData.license_plate,
        color: formData.color,
        gps_device_id: formData.gps_device_id,
        image_url: finalImageUrl, // Masukkan URL yang baru didapatkan
        user_id: bypassUserId
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Tegaskan kembali bahwa ini JSON
        }
      });

      alert("Car is added to fleet.");
      
      // Reset form total
      setFormData({ model_id: '', license_plate: '', color: '', gps_device_id: '' });
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      
      setIsModalOpen(false);
      fetchFleets();

    } catch (error: any) {
      console.error("Failed to add vehicle:", error);
      alert(error.response?.data?.message || "Failed to save vehicle data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tarik kendaraan
  const handleWithdraw = async (carId: string) => {
    const isConfirm = window.confirm("Do you want to withdraw this vehicle?");
    if (!isConfirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/lender/fleets/${carId}/withdraw`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Successfully withdrawn!");
      fetchFleets();
    } catch (error: any) {
      console.error("Gagal menarik kendaraan:", error);
      alert(error.response?.data?.message || "Vehicle is rented or in maintenance.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-end border-b-4 border-[#1D2B45] pb-4">
        <h1 className="text-4xl font-black text-[#1D2B45] uppercase tracking-tight">Fleet Management</h1>
        <ActionButton variant="navy" onClick={handleOpenAddModal}>
          <Plus size={16}/> <span>Add Vehicle</span>
        </ActionButton>
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#5E4E46] font-bold">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Syncing Fleet Database...
                  </td>
                </tr>
              ) : fleets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#5E4E46] font-bold">
                    No vehicles found in your armada. Add a new vehicle to get started.
                  </td>
                </tr>
              ) : (
                fleets.map((car, index) => (
                  <tr key={car.id} className={`${index % 2 === 0 ? 'bg-[#F8F8F6]' : 'bg-[#EBE6D9]'} hover:bg-[#EBE6D9]/50 transition-colors`}>
                    <td className="p-4 border-r-2 border-[#1D2B45]">
                      <p className="font-black text-[#1D2B45] uppercase">{car.model}</p>
                      <p className="text-xs font-bold text-[#5E4E46]">{car.plate}</p>
                    </td>
                    <td className="p-4 font-bold uppercase border-r-2 border-[#1D2B45]">{car.color}</td>
                    <td className="p-4 font-mono text-sm border-r-2 border-[#1D2B45]">{car.gps_device_id}</td>
                    <td className="p-4 border-r-2 border-[#1D2B45]">
                      <Badge status={car.status as any} />
                    </td>
                    <td className="p-4 text-right space-x-3 flex justify-end">
                      <ActionButton variant="white" onClick={() => alert("Fitur Edit akan dialihkan ke form terpisah.")}>Edit</ActionButton>
                      
                      {car.status === 'available' ? (
                        <ActionButton variant="danger" onClick={() => handleWithdraw(car.id)}>Withdraw</ActionButton>
                      ) : (
                        <div className="w-[110px]"></div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PatchCard>

      {/* ========================================= */}
      {/* MODAL NEO-BRUTALISM: ADD VEHICLE (FORMDATA) */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#EBE6D9] border-4 border-[#1D2B45] shadow-[8px_8px_0px_0px_#1D2B45] w-full max-w-xl relative flex flex-col max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center bg-[#1D2B45] p-4 text-[#F8F8F6] sticky top-0 z-10">
              <h2 className="font-black uppercase tracking-widest flex items-center gap-2">
                <Plus size={18} /> Register New Vehicle
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-rose-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitNewVehicle} className="p-6 space-y-4">
              
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-[#1D2B45]">Vehicle Photo *</label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Pratinjau Gambar */}
                  <div className="md:col-span-1 border-4 border-black bg-white aspect-[4/3] flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative group">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4 text-gray-400">
                        <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-[10px] font-bold uppercase">No Image<br/>Selected</p>
                      </div>
                    )}
                    {previewUrl && (
                        <button 
                            type='button'
                            onClick={() => {setSelectedFile(null); setPreviewUrl(null);}}
                            className='absolute top-1 right-1 bg-rose-500 text-white p-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                            <X size={14}/>
                        </button>
                    )}
                  </div>

                  {/* Area Dropzone/Tombol Upload */}
                  <div className="md:col-span-2 relative group">
                    <input 
                      type="file" 
                      id="car_image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required={!previewUrl}
                    />
                    <div className="border-4 border-black border-dashed bg-[#F8F8F6] hover:bg-white h-full flex flex-col items-center justify-center text-center p-6 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:border-[#1D2B45]">
                      <UploadCloud size={32} className="text-[#1D2B45] mb-2" />
                      <p className="text-sm font-black text-[#1D2B45] uppercase">Click or Drag Image</p>
                      <p className="text-xs font-bold text-[#5E4E46] mt-1">
                        {selectedFile ? `Selected: ${selectedFile.name.substring(0,20)}...` : 'Max size: 5MB (JPG, PNG, WEBP)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-[#1D2B45]">Vehicle Model *</label>
                <select 
                  className="w-full border-2 border-[#1D2B45] p-3 text-sm font-bold bg-[#F8F8F6] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#1D2B45] cursor-pointer appearance-none"
                  value={formData.model_id}
                  onChange={(e) => setFormData({...formData, model_id: e.target.value})}
                  required
                >
                  <option value="" disabled>-- SELECT MASTER MODEL --</option>
                  {carModels.map(model => (
                    <option key={model.model_id} value={model.model_id}>
                      {model.brand} {model.model_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase text-[#1D2B45]">License Plate *</label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-[#1D2B45] p-3 text-sm font-bold bg-[#F8F8F6] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#1D2B45] uppercase"
                    placeholder="B 1234 XYZ"
                    value={formData.license_plate}
                    onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase text-[#1D2B45]">Color *</label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-[#1D2B45] p-3 text-sm font-bold bg-[#F8F8F6] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#1D2B45] capitalize"
                    placeholder="Midnight Black"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-[#1D2B45]">GPS Emitter ID</label>
                <input 
                  type="text" 
                  className="w-full border-2 border-[#1D2B45] p-3 text-sm font-bold font-mono bg-[#F8F8F6] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#1D2B45]"
                  placeholder="e.g. GPS-ZEN-005"
                  value={formData.gps_device_id}
                  onChange={(e) => setFormData({...formData, gps_device_id: e.target.value})}
                />
                <p className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <AlertTriangle size={10} /> Optional. Required only for live tracking features.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#1D2B45] text-[#F8F8F6] p-4 font-black uppercase border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] hover:bg-[#295A8E] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#1D2B45] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'INITIALIZE VEHICLE'}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, MapPin, ShieldCheck, Users, Fuel, 
  Settings, AlertTriangle, ArrowRight, Check 
} from 'lucide-react';

export default function CarDetail() {
  const { car_id } = useParams();
  const navigate = useNavigate();
  
  const { user, token } = useAuth();
  
  // State untuk data
  const [car, setCar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk form pemesanan
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  
  // State untuk Add-ons
  const [useChauffeur, setUseChauffeur] = useState(false);
  const [useExtraInsurance, setUseExtraInsurance] = useState(false);
  const [useChildSeat, setUseChildSeat] = useState(false);

  // State untuk melacak gambar dan tombol aktif
  const [activeIndex, setActiveIndex] = useState(0);

  // Harga Add-ons
  const ADDONS_PRICE = {
    chauffeur: 250000,
    insurance: 150000,
    childSeat: 50000
  };

  // Fetch data mobil
  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        // Mengambil semua mobil available (Rute ini publik, tidak perlu token)
        const response = await axios.get('http://localhost:5000/api/borrower/cars/available');
        const foundCar = response.data.data.find((c: any) => c.id === car_id);
        
        if (foundCar) {
          setCar(foundCar);
        } else {
          alert("Car is not available or already rented");
          navigate('/cars');
        }
      } catch (error) {
        console.error("Failed to fetch car detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (car_id) fetchCarDetail();
  }, [car_id, navigate]);

  // Kalkulator tanggal sewa
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0 && start < end) {
        setTotalDays(diffDays);
      } else {
        setTotalDays(0);
      }
    }
  }, [startDate, endDate]);

  if (isLoading || !car) {
    return <div className="p-12 text-center font-black uppercase text-xl">Loading Vehicle Data...</div>;
  }

  // Galeri (Menggunakan gambar dari DB untuk Front View)
  const galleryItems = [
    { label: "FRONT VIEW", imgSrc: car.img || "https://placehold.co/800x600/0F1525/A3E635?text=NO+IMAGE" },
    { label: "SIDE VIEW", imgSrc: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop" },
    { label: "REAR VIEW", imgSrc: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?q=80&w=800&auto=format&fit=crop" },
    { label: "FRONT INTERIOR", imgSrc: "https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&w=800&auto=format&fit=crop" },
    { label: "REAR INTERIOR", imgSrc: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=800&auto=format&fit=crop" },
    { label: "TOP VIEW", imgSrc: "https://images.unsplash.com/photo-1555626906-fcf10d6851b4?q=80&w=800&auto=format&fit=crop" }
  ];

  // Kalkulasi harga
  const baseTotal = totalDays * car.price;
  const addonsTotal = totalDays * (
    (useChauffeur ? ADDONS_PRICE.chauffeur : 0) + 
    (useExtraInsurance ? ADDONS_PRICE.insurance : 0) + 
    (useChildSeat ? ADDONS_PRICE.childSeat : 0)
  );
  const grandTotal = baseTotal + addonsTotal;

  // BYPASS SEMENTARA UNTUK TESTING (Anggap selalu true agar bisa checkout)
  const hasDriverLicense = true; 

  // Fungsi checkout (Menembak API POST Reservasi)
  const handleCheckout = async () => {
    if (!token || !user) {
      alert("Authentication is required. Login first.");
      return;
    }

    if (!hasDriverLicense) {
      alert("Please complete your Driver's License in your profile first.");
      return;
    }
    if (totalDays <= 0) {
      alert("Please select a valid date range.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
        total_days: totalDays,
        add_ons: {
          use_chauffeur: useChauffeur,
          use_extra_insurance: useExtraInsurance,
          use_child_seat: useChildSeat
        },
        base_price_per_day: car.price,
        grand_total_payment: grandTotal
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Tembak POST API menggunakan kombinasi payload dan config
      const response = await axios.post('http://localhost:5000/api/borrower/reservations', payload, config);
      
      // Ambil transaction_id hasil dari INSERT database
      const transactionId = response.data.data.transaction_id;
      
      // Lempar user ke halaman pembayaran membawa ID transaksi asli
      navigate(`/borrower/checkout/${transactionId}`);

    } catch (error: any) {
      console.error("Failed to create reservation:", error);
      alert(error.response?.data?.message || "Failed to create reservation. The car might be booked.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 animate-fade-in space-y-8">
      
      <button 
        onClick={() => navigate('/cars')}
        className="font-black text-sm uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2 transition-colors"
      >
        ← Return to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* KOLOM KIRI: Informasi & Galeri Mobil */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gambar Besar (Active Image) */}
          <div className="w-full h-[400px] bg-[#DAD0C4] border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#0F1525] transition-all duration-500">
            <img 
              src={galleryItems[activeIndex].imgSrc} 
              alt={car.model} 
              className="w-full h-full object-cover transition-opacity duration-300" 
              key={galleryItems[activeIndex].imgSrc} 
              onError={(e:any) => { e.target.src = "https://placehold.co/800x600/0F1525/A3E635?text=IMAGE+UNAVAILABLE" }}
            />
          </div>

          {/* Navigasi Galeri (Tombol Teks Neo-Brutalism) */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {galleryItems.map((item, index) => (
               <button 
                  key={index} 
                  onClick={() => setActiveIndex(index)}
                  className={`p-2.5 text-[10px] font-black uppercase tracking-wider border-2 rounded-xl transition-all duration-200 flex items-center justify-center
                    ${activeIndex === index 
                      ? 'border-black bg-yellow-400 text-black shadow-[3px_3px_0px_#000] scale-105' 
                      : 'border-black bg-white text-gray-500 hover:bg-gray-50 hover:-translate-y-1 hover:shadow-[3px_3px_0px_#DAD0C4]'
                    }`}
               >
                  {item.label}
               </button>
            ))}
          </div>

          {/* Spesifikasi Mobil */}
          <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_#DAD0C4]">
            <span className="bg-lime-300 text-black px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-black rounded-full inline-block mb-3">
              {car.type} Vehicle
            </span>
            <h1 className="text-4xl font-black uppercase tracking-tight text-[#0F1525] mb-2">{car.model}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-rose-600" />
              <p className="font-bold text-gray-500 uppercase tracking-wider text-sm">{car.location}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t-2 border-dashed border-gray-300 pt-6">
              <div className="space-y-1">
                <Users className="w-6 h-6 text-gray-400" />
                <p className="font-black text-sm uppercase">{car.seats} Seats</p>
                <p className="text-xs text-gray-500 font-bold uppercase">Capacity</p>
              </div>
              <div className="space-y-1">
                <Settings className="w-6 h-6 text-gray-400" />
                <p className="font-black text-sm uppercase">{car.transmission}</p>
                <p className="text-xs text-gray-500 font-bold uppercase">Gearbox</p>
              </div>
              <div className="space-y-1">
                <Fuel className="w-6 h-6 text-gray-400" />
                <p className="font-black text-sm uppercase">{car.type === 'Electric' ? 'Battery' : 'Petrol'}</p>
                <p className="text-xs text-gray-500 font-bold uppercase">Energy</p>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <p className="font-black text-sm uppercase">{car.license_plate}</p>
                <p className="text-xs text-gray-500 font-bold uppercase">Verified Plate</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Modul Pemesanan (Checkout Panel) */}
        <div className="space-y-6">
          
          {!hasDriverLicense && (
            <div className="bg-rose-100 border-4 border-rose-500 rounded-2xl p-5 shadow-[4px_4px_0px_#e11d48]">
              <div className="flex gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                <div>
                  <h3 className="font-black text-rose-800 uppercase text-sm leading-tight">Action Required</h3>
                  <p className="font-bold text-rose-600 text-xs mt-1">A valid Driver's License (SIM) must be registered to create reservations.</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full bg-rose-500 text-white font-black text-xs uppercase py-2 border-2 border-rose-700 rounded-xl hover:bg-rose-600 transition-colors shadow-[2px_2px_0px_#9f1239] active:translate-y-1 active:shadow-none"
              >
                Update Profile Now
              </button>
            </div>
          )}

          <div className="bg-[#F0E9E0] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_#0F1525] space-y-6">
            <h2 className="text-xl font-black uppercase tracking-wide border-b-4 border-black pb-3">Reservation Details</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-gray-500 block mb-1">Pick-up Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 pl-10 border-2 border-black rounded-xl font-bold uppercase text-sm outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-gray-500 block mb-1">Return Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full p-3 pl-10 border-2 border-black rounded-xl font-bold uppercase text-sm outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t-2 border-dashed border-gray-400">
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Premium Add-ons</p>
              
              <label className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-colors ${useChauffeur ? 'border-emerald-500 bg-emerald-50' : 'border-black bg-white hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${useChauffeur ? 'bg-emerald-500 border-emerald-500' : 'border-black'}`}>
                    {useChauffeur && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="font-bold text-xs uppercase">Chauffeur Service</span>
                </div>
                <span className="font-black text-xs text-gray-600">+ Rp 250k/day</span>
                <input type="checkbox" className="hidden" checked={useChauffeur} onChange={() => setUseChauffeur(!useChauffeur)} />
              </label>

              <label className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-colors ${useExtraInsurance ? 'border-emerald-500 bg-emerald-50' : 'border-black bg-white hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${useExtraInsurance ? 'bg-emerald-500 border-emerald-500' : 'border-black'}`}>
                    {useExtraInsurance && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="font-bold text-xs uppercase">Full Protection</span>
                </div>
                <span className="font-black text-xs text-gray-600">+ Rp 150k/day</span>
                <input type="checkbox" className="hidden" checked={useExtraInsurance} onChange={() => setUseExtraInsurance(!useExtraInsurance)} />
              </label>
            </div>

            <div className="bg-white border-2 border-black rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                <span>Rp {car.price.toLocaleString('id-ID')} x {totalDays} Days</span>
                <span>Rp {baseTotal.toLocaleString('id-ID')}</span>
              </div>
              {addonsTotal > 0 && (
                <div className="flex justify-between text-xs font-bold text-emerald-600 uppercase border-b border-dashed pb-2">
                  <span>Add-ons Total</span>
                  <span>+ Rp {addonsTotal.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-2">
                <span className="font-black text-sm uppercase">Total Payment</span>
                <span className="font-black text-xl text-black">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={!hasDriverLicense || totalDays <= 0 || isSubmitting}
              className={`w-full p-4 font-black text-sm uppercase tracking-wider rounded-xl border-4 flex justify-center items-center gap-2 transition-all shadow-[4px_4px_0px_#000]
                ${hasDriverLicense && totalDays > 0 && !isSubmitting
                  ? 'bg-yellow-400 text-black border-black hover:translate-y-1 hover:shadow-none cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed shadow-none'}
              `}
            >
              {isSubmitting ? 'PROCESSING...' : 'Proceed to Checkout'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
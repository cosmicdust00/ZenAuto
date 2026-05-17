import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, SlidersHorizontal, MapPin, Radio, 
  ShieldCheck, Key, Star, Users, Fuel, ArrowRight 
} from 'lucide-react';

export default function BrowseCars() {
  const [fleets, setFleets] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // Fetch langsung dari API PostgreSQL
  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Ganti URL ini dengan VITE_API_URL saat deploy ke Vercel nanti
        const response = await axios.get('http://localhost:5000/api/borrower/cars/available');
        
        // Mapping otomatis karena sudah membuat alias di Backend (m.capacity as seats, dll)
        const realData = response.data.data.map((car: any) => ({
          id: car.id,
          brand: car.brand,
          model: car.model,
          type: car.type || 'Standard', 
          color: car.color,
          location: car.location,
          price: car.price,
          seats: car.seats,
          img: car.img,
          rating: car.rating,
          reviews: car.reviews,
          transmission: car.transmission,
          hasInsurance: car.hasInsurance,
          isKeyless: car.isKeyless
        }));

        setFleets(realData);
        setIsLoaded(true);
      } catch (error) {
        console.error("Fail to fetch car data from backend:", error);
      }
    };

    fetchCars();
  }, []);

  // Logika Pencarian dan Filter (berjalan di sisi klien)
  const filteredFleets = fleets.filter(item => {
    const matchesQuery = item.model.toLowerCase().includes(query.toLowerCase()) || item.brand.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.type === categoryFilter;
    const matchesBrand = brandFilter === 'All' || item.brand === brandFilter;
    const matchesLocation = locationFilter === 'All' || item.location.includes(locationFilter);
    return matchesQuery && matchesCategory && matchesBrand && matchesLocation;
  });

  // Ambil daftar lokasi unik secara dinamis dari data database
  const uniqueCities = Array.from(new Set(fleets.map(car => car.location)));
  // Ambil daftar brand unik secara dinamis dari data database
  const uniqueBrands = Array.from(new Set(fleets.map(car => car.brand)));

  return (
    <div className={`p-8 max-w-7xl mx-auto space-y-12 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-[#0F1525] border-4 border-black rounded-3xl p-8 text-white shadow-[8px_8px_0px_0px_#DAD0C4] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10">
            <span className="bg-yellow-400 text-black px-4 py-1.5 text-xs font-black uppercase tracking-widest border-2 border-black rounded-full inline-block mb-4 shadow-[2px_2px_0px_#DAD0C4]">
              Premium Fleet Access
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-3">
              RESERVE YOUR <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-500">ELITE RIDE</span>
            </h1>
            <p className="font-bold text-gray-400 text-sm max-w-md leading-relaxed">
              Unlock your journey with our top-tier vehicle selection. Drive with confidence knowing 24/7 roadside assistance is always active.
            </p>
          </div>
        </div>

        <div className="lg:w-1/3 bg-lime-300 border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_#0F1525] flex flex-col justify-center">
          <label className="font-black text-black uppercase tracking-wider text-sm mb-3 block">
            Quick Search
          </label>
          <div className="relative w-full">
            <Search className="absolute left-4 top-4 w-6 h-6 text-black" />
            <input 
              type="text" 
              placeholder="Search brand or model..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-4 pl-12 border-4 border-black rounded-2xl bg-white text-black font-black text-base outline-none focus:bg-yellow-100 transition-colors shadow-[4px_4px_0px_#000]"
            />
          </div>
        </div>
      </div>

      {/* FILTER MENU */}
      <div className="flex flex-wrap gap-4 items-center font-black">
        <div className="bg-yellow-400 border-4 border-black rounded-xl p-3 text-xs uppercase tracking-wider flex items-center gap-2 shadow-[4px_4px_0px_#000]">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </div>

        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="neo-btn rounded-xl p-3 bg-white text-xs uppercase tracking-wide outline-none cursor-pointer border-2 border-black">
          <option value="All"> All Locations</option>
          {uniqueCities.map(city => <option key={city as string} value={city as string}>📍 {city as string}</option>)}
        </select>

        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="neo-btn rounded-xl p-3 bg-white text-xs uppercase tracking-wide outline-none cursor-pointer border-2 border-black">
          <option value="All"> All Brands</option>
          {uniqueBrands.map(brand => <option key={brand as string} value={brand as string}>{brand as string}</option>)}
        </select>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="neo-btn rounded-xl p-3 bg-white text-xs uppercase tracking-wide outline-none cursor-pointer border-2 border-black">
          <option value="All"> All Engines</option>
          <option value="Standard">Standard (Fuel)</option>
          <option value="Electric">Electric (EV)</option>
        </select>
      </div>

      {/* CATALOG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredFleets.map((car, idx) => (
          <div key={`${car.id}-${idx}`} className="relative group hover:-translate-y-3 transition-transform duration-300 h-full cursor-pointer">
            
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-lime-400 to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
            <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-400 via-lime-400 to-emerald-500 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative h-full bg-white border-4 border-black rounded-2xl overflow-hidden flex flex-col justify-between z-10 shadow-[8px_8px_0px_0px_#0F1525] group-hover:shadow-none transition-shadow duration-300">
              
              {/* Image Section */}
              <div className="h-56 border-b-4 border-black relative bg-[#DAD0C4] overflow-hidden">
                <img 
                  src={car.img || "https://placehold.co/600x400/0F1525/A3E635?text=CAR+IMAGE"} 
                  alt={car.model}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e:any) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400/0F1525/A3E635?text=IMAGE+UNAVAILABLE&font=montserrat";
                  }}
                />
                
                <span className={`absolute top-3 left-3 border-2 border-black text-[10px] font-black px-3 py-1 text-white uppercase tracking-wider rounded-full shadow-[2px_2px_0px_#000] ${car.type === 'Electric' ? 'bg-[#062954]' : 'bg-emerald-600'}`}>
                  {car.type}
                </span>
                
                <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm border-2 border-black text-white text-[10px] font-black px-3 py-1 flex items-center gap-1.5 rounded-full shadow-[2px_2px_0px_#000]">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> LIVE
                </span>
              </div>

              {/* Info Section */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{car.brand}</span>
                    <div className="flex items-center gap-1 bg-yellow-100 border-2 border-yellow-500 px-2 py-0.5 rounded-full text-[10px] font-black text-yellow-700">
                      <Star className="w-3 h-3 fill-yellow-500" /> {car.rating} ({car.reviews})
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#0F1525] uppercase tracking-tight leading-tight mb-3 line-clamp-1">{car.model}</h3>
                  
                  <div className="flex items-start gap-2 mb-4 bg-gray-100 rounded-xl p-3 border-2 border-transparent group-hover:border-lime-300 transition-colors">
                    <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-[#0F1525] uppercase tracking-wide leading-tight">{car.location}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-black text-gray-700 uppercase tracking-wider mb-4">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-lime-600"/> {car.seats} Seats</span>
                    <span className="flex items-center gap-1.5"><Fuel className="w-4 h-4 text-lime-600"/> {car.transmission}</span>
                  </div>

                  <div className="space-y-2 pt-4 border-t-2 border-dashed border-gray-300">
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${car.hasInsurance ? 'text-emerald-700' : 'text-gray-400'}`}>
                      <ShieldCheck className="w-4 h-4" /> 
                      {car.hasInsurance ? 'All-Risk Insurance' : 'Standard Insurance'}
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${car.isKeyless ? 'text-[#062954]' : 'text-gray-400'}`}>
                      <Key className="w-4 h-4" />
                      {car.isKeyless ? 'Self-Drive Enabled' : 'Chauffeur Only'}
                    </div>
                  </div>
                </div>

                <div className="border-t-4 border-black pt-5 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 block tracking-wider mb-1">Price Per Day</span>
                    <span className="text-xl font-black text-[#0F1525]">Rp {car.price.toLocaleString('id-ID')}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/borrower/cars/${car.id}`)}
                    className="bg-yellow-400 text-black px-5 py-3 text-xs uppercase tracking-wider font-black rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
                  >
                    RENT <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredFleets.length === 0 && isLoaded && (
        <div className="neo-box w-full bg-white p-12 text-center rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000]">
          <h3 className="text-2xl font-black uppercase text-[#0F1525] mb-2">NO VEHICLES FOUND</h3>
          <p className="font-bold text-gray-500">Try adjusting your location or brand filters.</p>
        </div>
      )}
    </div>
  );
}
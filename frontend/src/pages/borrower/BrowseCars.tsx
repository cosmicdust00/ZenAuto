import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, MapPin, Radio, 
  ShieldCheck, Key, Star, Users, Fuel, ArrowRight 
} from 'lucide-react';

// =========================================================================
// IMAGE ASSETS (STABLE POOL)
// =========================================================================
const images_suv = [
  'https://images.unsplash.com/photo-1503370973446-4b21c4aa2622?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555626906-fcf10d6851b4?q=80&w=600&auto=format&fit=crop'
];

const images_sedan = [
  'https://images.unsplash.com/photo-1550355220-40e159c50f82?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600&auto=format&fit=crop'
];

const images_compact = [
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop'
];

const images_van = [
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600&auto=format&fit=crop'
];

const images_ev = [
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop'
];

const locations_indonesia = [
  'SCBD Garage, South Jakarta', 'Soekarno-Hatta Airport, Tangerang', 'Menteng, Central Jakarta', 
  'Pasteur, Bandung', 'Ngurah Rai Airport, Bali', 'Gubeng, Surabaya', 'Medan Polonia, North Sumatra'
];

const colors_catalog = ['Midnight Black', 'Pearl White', 'Metallic Grey', 'Sonic Red', 'Racing Blue'];

// =========================================================================
// DATA GENERATOR
// =========================================================================
const generateMassiveCatalog = () => {
  const brands = [
    { name: 'Toyota', type: 'Standard', models: ['Avanza Veloz', 'Innova Zenix Hybrid', 'Fortuner GR Sport', 'Alphard Premium', 'Raize GR', 'Yaris Cross', 'Camry Sedan'], basePrice: 400000 },
    { name: 'Honda', type: 'Standard', models: ['Civic Turbo RS', 'CR-V Prestige', 'HR-V SE', 'Brio RS', 'City Hatchback', 'BR-V Prestige', 'Accord Sedan'], basePrice: 450000 },
    { name: 'Mitsubishi', type: 'Standard', models: ['Xpander Cross', 'Pajero Sport Dakar', 'Outlander PHEV', 'Triton 4x4', 'Eclipse Cross'], basePrice: 500000 },
    { name: 'Tesla', type: 'Electric', models: ['Model 3 Performance', 'Model Y Long Range', 'Model S Plaid', 'Model X', 'Cybertruck'], basePrice: 1500000 },
    { name: 'BYD', type: 'Electric', models: ['Atto 3', 'Seal AWD', 'Dolphin', 'Tang EV', 'Han SUV'], basePrice: 850000 },
    { name: 'Hyundai', type: 'Electric', models: ['Ioniq 5 Signature', 'Ioniq 6', 'Kona Electric', 'Palisade Signature', 'Creta EV'], basePrice: 900000 },
    { name: 'BMW', type: 'Standard', models: ['330i M Sport', 'X5 xDrive40i', 'M4 Competition', 'iX Electric', '740Li Sedan'], basePrice: 2000000 }
  ];

  const catalog: any[] = []; 
  let idCounter = 1;

  brands.forEach(brand => {
    for (let i = 0; i < 30; i++) {
      const randomModel = brand.models[Math.floor(Math.random() * brand.models.length)];
      const randomLocation = locations_indonesia[Math.floor(Math.random() * locations_indonesia.length)];
      const randomColor = colors_catalog[Math.floor(Math.random() * colors_catalog.length)];
      
      let carImage: string;
      const lowerModel = randomModel.toLowerCase();
      
      if (brand.type === 'Electric' || lowerModel.includes('ioniq') || lowerModel.includes('ev') || lowerModel.includes('seal') || lowerModel.includes('atto')) {
          carImage = images_ev[Math.floor(Math.random() * images_ev.length)];
      } 
      else if (lowerModel.includes('alphard') || lowerModel.includes('van') || lowerModel.includes('innova')) {
          carImage = images_van[Math.floor(Math.random() * images_van.length)];
      }
      else if (lowerModel.includes('fortuner') || lowerModel.includes('pajero') || lowerModel.includes('x5') || lowerModel.includes('cross') || lowerModel.includes('cr-v') || lowerModel.includes('hr-v') || lowerModel.includes('xpander') || lowerModel.includes('avanza') || lowerModel.includes('palisade')) {
          carImage = images_suv[Math.floor(Math.random() * images_suv.length)];
      }
      else if (lowerModel.includes('sedan') || lowerModel.includes('civic') || lowerModel.includes('camry') || lowerModel.includes('accord') || lowerModel.includes('competition') || lowerModel.includes('330i') || lowerModel.includes('740li')) {
          carImage = images_sedan[Math.floor(Math.random() * images_sedan.length)];
      }
      else if (lowerModel.includes('brio') || lowerModel.includes('gr') || lowerModel.includes('compact') || lowerModel.includes('dolphin') || lowerModel.includes('hatchback')) {
          carImage = images_compact[Math.floor(Math.random() * images_compact.length)];
      }
      else {
          carImage = images_suv[Math.floor(Math.random() * images_suv.length)];
      }
      
      const seats = lowerModel.includes('alphard') || lowerModel.includes('innova') || lowerModel.includes('pajero') || lowerModel.includes('fortuner') || lowerModel.includes('xpander') || lowerModel.includes('palisade') ? 7 : 5;
      const priceOffset = Math.floor(Math.random() * 5) * 100000; 
      const rating = (4 + Math.random() * 1).toFixed(1);
      const reviews = Math.floor(Math.random() * 200) + 10;

      catalog.push({
        id: `CAR-${idCounter++}`,
        brand: brand.name,
        model: `${randomModel} (Unit ${i+1})`,
        type: brand.type,
        color: randomColor,
        location: randomLocation,
        price: brand.basePrice + priceOffset,
        seats: seats,
        img: carImage,
        rating: rating,
        reviews: reviews,
        transmission: 'Automatic',
        hasInsurance: Math.random() > 0.2,
        isKeyless: Math.random() > 0.3
      });
    }
  });

  return catalog;
};

const MASSIVE_CATALOG = generateMassiveCatalog();

// =========================================================================
// MAIN COMPONENT
// =========================================================================
export default function BrowseCars() {
  const [fleets, setFleets] = useState<any[]>(MASSIVE_CATALOG);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { setIsLoaded(true); }, []);

  const filteredFleets = fleets.filter(item => {
    const matchesQuery = item.model.toLowerCase().includes(query.toLowerCase()) || item.brand.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.type === categoryFilter;
    const matchesBrand = brandFilter === 'All' || item.brand === brandFilter;
    const matchesLocation = locationFilter === 'All' || item.location.includes(locationFilter);
    return matchesQuery && matchesCategory && matchesBrand && matchesLocation;
  });

  const uniqueCities = ['Jakarta', 'Tangerang', 'Bandung', 'Bali', 'Surabaya', 'Sumatra'];

  return (
    <div className={`p-8 max-w-7xl mx-auto space-y-12 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      
      {/* 1. EDGY NEO-BRUTALISM HEADER */}
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

      {/* 2. FILTER MENU */}
      <div className="flex flex-wrap gap-4 items-center font-black">
        <div className="bg-yellow-400 border-4 border-black rounded-xl p-3 text-xs uppercase tracking-wider flex items-center gap-2 shadow-[4px_4px_0px_#000]">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </div>

        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="neo-btn rounded-xl p-3 bg-white text-xs uppercase tracking-wide outline-none cursor-pointer">
          <option value="All"> All Locations</option>
          {uniqueCities.map(city => <option key={city} value={city}>📍 {city}</option>)}
        </select>

        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="neo-btn rounded-xl p-3 bg-white text-xs uppercase tracking-wide outline-none cursor-pointer">
          <option value="All"> All Brands</option>
          <option value="Toyota">Toyota (30 Units)</option>
          <option value="Honda">Honda (30 Units)</option>
          <option value="Tesla">Tesla (30 Units)</option>
          <option value="BYD">BYD (30 Units)</option>
          <option value="Hyundai">Hyundai (30 Units)</option>
          <option value="Mitsubishi">Mitsubishi (30 Units)</option>
          <option value="BMW">BMW (30 Units)</option>
        </select>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="neo-btn rounded-xl p-3 bg-white text-xs uppercase tracking-wide outline-none cursor-pointer">
          <option value="All"> All Engines</option>
          <option value="Standard">Standard (Fuel)</option>
          <option value="Electric">Electric (EV)</option>
        </select>
      </div>

      {/* 3. CATALOG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredFleets.slice(0, 30).map((car, idx) => (
          
          /* KARTU DENGAN EFEK GRADASI TEBAL DAN MELENGKUNG */
          <div key={`${car.id}-${idx}`} className="relative group hover:-translate-y-3 transition-transform duration-300 h-full cursor-pointer">
            
            {/* Gradasi Belakang (Membesar saat Hover) */}
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-lime-400 to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
            <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-400 via-lime-400 to-emerald-500 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Kartu Utama */}
            <div className="relative h-full bg-white border-4 border-black rounded-2xl overflow-hidden flex flex-col justify-between z-10 shadow-[8px_8px_0px_0px_#0F1525] group-hover:shadow-none transition-shadow duration-300">
              
              {/* Image Section */}
              <div className="h-56 border-b-4 border-black relative bg-[#DAD0C4] overflow-hidden">
                <img 
                  src={car.img} 
                  alt={car.model}
                  loading="lazy" // FIX UTAMA: Mencegah error gambar karena koneksi penuh
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  // FALLBACK CERDAS JIKA GAMBAR ASLI TETAP GAGAL
                  onError={(e:any) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400/0F1525/A3E635?text=IMAGE+UNAVAILABLE&font=montserrat";
                  }}
                />
                
                {/* Badges */}
                <span className={`absolute top-3 left-3 border-2 border-black text-[10px] font-black px-3 py-1 text-white uppercase tracking-wider rounded-full shadow-[2px_2px_0px_#000] ${car.type === 'Electric' ? 'bg-[#062954]' : 'bg-emerald-600'}`}>
                  {car.type}
                </span>
                
                <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm border-2 border-black text-white text-[10px] font-black px-3 py-1 flex items-center gap-1.5 rounded-full shadow-[2px_2px_0px_#000]">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> LIVE TRACKING
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
                      {car.hasInsurance ? 'All-Risk Insurance Included' : 'Standard Insurance'}
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${car.isKeyless ? 'text-[#062954]' : 'text-gray-400'}`}>
                      <Key className="w-4 h-4" />
                      {car.isKeyless ? 'Self-Drive Enabled' : 'Chauffeur Required'}
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="border-t-4 border-black pt-5 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 block tracking-wider mb-1">Price Per Day</span>
                    <span className="text-xl font-black text-[#0F1525]">Rp {car.price.toLocaleString('en-US')}</span>
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
      
      {filteredFleets.length === 0 && (
        <div className="neo-box w-full bg-white p-12 text-center rounded-3xl shadow-[8px_8px_0px_#000]">
          <h3 className="text-2xl font-black uppercase text-[#0F1525] mb-2">NO VEHICLES FOUND</h3>
          <p className="font-bold text-gray-500">Try adjusting your location or brand filters.</p>
        </div>
      )}

      {filteredFleets.length > 30 && (
        <div className="text-center pt-8 pb-4">
          <p className="font-black text-xs uppercase text-gray-500 tracking-widest border-b-2 border-black inline-block pb-1">
            Showing 30 of {filteredFleets.length} Available Vehicles
          </p>
        </div>
      )}
    </div>
  );
}
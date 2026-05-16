import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';

// STRUKTUR DATA ANTI-CRASH (Menghindari Layar Putih)
const MASSIVE_CATALOG = [
  // TOYOTA
  { id: 't1', brand: 'Toyota', model: 'Avanza Veloz', type: 'Standard', price: 400000, seats: 7, img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b9e2?auto=format&fit=crop&w=600&q=80', color: 'White' },
  { id: 't2', brand: 'Toyota', model: 'Innova Zenix Hybrid', type: 'Electric', price: 750000, seats: 7, img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80', color: 'Black' },
  { id: 't3', brand: 'Toyota', model: 'Fortuner GR Sport', type: 'Standard', price: 1200000, seats: 7, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', color: 'Grey' },
  { id: 't4', brand: 'Toyota', model: 'Alphard Premium', type: 'Standard', price: 2500000, seats: 6, img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80', color: 'Black' },
  { id: 't5', brand: 'Toyota', model: 'Raize GR Sport', type: 'Standard', price: 350000, seats: 5, img: 'https://images.unsplash.com/photo-1669041935574-885f62916b14?auto=format&fit=crop&w=600&q=80', color: 'Yellow' },
  
  // HONDA
  { id: 'h1', brand: 'Honda', model: 'Civic Turbo RS', type: 'Standard', price: 900000, seats: 5, img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80', color: 'Red' },
  { id: 'h2', brand: 'Honda', model: 'CR-V Prestige', type: 'Standard', price: 1100000, seats: 7, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', color: 'White' },
  { id: 'h3', brand: 'Honda', model: 'HR-V SE', type: 'Standard', price: 600000, seats: 5, img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b9e2?auto=format&fit=crop&w=600&q=80', color: 'Sand Khaki' },
  { id: 'h4', brand: 'Honda', model: 'Brio RS', type: 'Standard', price: 300000, seats: 5, img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80', color: 'Yellow' },
  
  // TESLA
  { id: 'ts1', brand: 'Tesla', model: 'Model 3 Performance', type: 'Electric', price: 2500000, seats: 5, img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80', color: 'White' },
  { id: 'ts2', brand: 'Tesla', model: 'Model Y Long Range', type: 'Electric', price: 2800000, seats: 5, img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80', color: 'Blue' },
  
  // BYD & HYUNDAI
  { id: 'b1', brand: 'BYD', model: 'Atto 3', type: 'Electric', price: 850000, seats: 5, img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80', color: 'Green' },
  { id: 'b2', brand: 'BYD', model: 'Seal AWD', type: 'Electric', price: 1500000, seats: 5, img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80', color: 'Black' },
  { id: 'hy1', brand: 'Hyundai', model: 'Ioniq 5 Signature', type: 'Electric', price: 1700000, seats: 5, img: 'https://images.unsplash.com/photo-1669041935574-885f62916b14?auto=format&fit=crop&w=600&q=80', color: 'Gravity Gold' },
  { id: 'hy2', brand: 'Hyundai', model: 'Palisade Signature', type: 'Standard', price: 2200000, seats: 7, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', color: 'Black' },
  
  // MITSUBISHI & BMW
  { id: 'm1', brand: 'Mitsubishi', model: 'Xpander Cross', type: 'Standard', price: 450000, seats: 7, img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b9e2?auto=format&fit=crop&w=600&q=80', color: 'Grey' },
  { id: 'm2', brand: 'Mitsubishi', model: 'Pajero Sport Dakar', type: 'Standard', price: 1300000, seats: 7, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', color: 'Black' },
  { id: 'bm1', brand: 'BMW', model: '330i M Sport', type: 'Standard', price: 3000000, seats: 5, img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80', color: 'Portimao Blue' },
];

export default function BrowseCars() {
  const [fleets, setFleets] = useState<any[]>(MASSIVE_CATALOG);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulasi Fetch dengan Fallback Aman
    fetch('http://localhost:5000/api/cars/available')
      .then(res => res.ok ? res.json() : [])
      .then(data => { 
        if (Array.isArray(data) && data.length > 0) {
          // Mapping data backend agar sesuai dengan format UI jika API online
          const mappedData = data.map(d => ({
            id: d.car_id || d.id,
            brand: d.car_models?.brand || 'Unknown',
            model: d.car_models?.model_name || 'Unknown',
            type: d.car_models?.type || 'Standard',
            price: d.car_models?.base_daily_price || 0,
            seats: d.car_models?.capacity || 4,
            img: d.image_url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
            color: d.color || 'Standard'
          }));
          setFleets(mappedData);
        } else {
          setFleets(MASSIVE_CATALOG);
        }
      })
      .catch(() => setFleets(MASSIVE_CATALOG));
  }, []);

  // Filter Logika Aman (Anti Undefined)
  const filteredFleets = fleets.filter(item => {
    const brandStr = item.brand || '';
    const modelStr = item.model || '';
    const typeStr = item.type || '';

    const matchesQuery = modelStr.toLowerCase().includes(query.toLowerCase()) || brandStr.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || typeStr === categoryFilter;
    const matchesBrand = brandFilter === 'All' || brandStr === brandFilter;
    return matchesQuery && matchesCategory && matchesBrand;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* HEADER BANNERS */}
      <div className="w-full bg-[#0F1525] border-4 border-[#0F1525] p-8 text-white shadow-[8px_8px_0px_0px_#DAD0C4] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-wide">CHOOSE YOUR RIDE</h1>
          <p className="font-bold text-gray-300 text-sm">Select from our extensive premium catalog. Instant booking confirmed.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search brand or model..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 pl-10 border-3 border-white bg-white text-black font-black text-sm outline-none focus:bg-yellow-100 transition-colors"
          />
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3 items-center font-black">
        <div className="bg-yellow-400 border-2 border-black p-2.5 text-xs uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_#000]">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </div>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="neo-btn p-2.5 bg-white text-xs uppercase tracking-wide outline-none cursor-pointer">
          <option value="All">All Engine Types</option>
          <option value="Standard">Standard (Gasoline)</option>
          <option value="Electric">Electric Vehicles (EV)</option>
        </select>

        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="neo-btn p-2.5 bg-white text-xs uppercase tracking-wide outline-none cursor-pointer">
          <option value="All">All Brands</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Tesla">Tesla</option>
          <option value="BYD">BYD</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Mitsubishi">Mitsubishi</option>
          <option value="BMW">BMW</option>
        </select>
      </div>

      {/* CATALOG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredFleets.map((car, idx) => (
          <div key={`${car.id}-${idx}`} className="neo-box w-full bg-white flex flex-col justify-between group">
            <div className="h-52 border-b-4 border-black relative overflow-hidden bg-gray-100">
              <img 
                src={car.img} 
                alt={car.model}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className={`absolute top-3 right-3 border-2 border-black text-xs font-black px-3 py-1 text-white uppercase tracking-wider shadow-[2px_2px_0px_#000] ${car.type === 'Electric' ? 'bg-[#062954]' : 'bg-emerald-600'}`}>
                {car.type}
              </span>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest block">{car.brand}</span>
                <h3 className="text-2xl font-black text-[#0F1525] uppercase tracking-tight leading-tight">{car.model}</h3>
                <div className="flex flex-wrap gap-2 pt-2 text-xs font-bold text-gray-600">
                  <span className="bg-[#DAD0C4] border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">👥 {car.seats} Seats</span>
                  <span className="bg-[#DAD0C4] border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">🎨 {car.color}</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-300 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 block">Rate / Day</span>
                  <span className="text-lg font-black text-[#0F1525]">IDR {Number(car.price).toLocaleString()}</span>
                </div>

                <button
                  onClick={() => navigate(`/borrower/cars/${car.id}`)}
                  className="neo-btn bg-yellow-400 text-black px-4 py-2 text-xs uppercase tracking-wider font-black rounded-none"
                >
                  Rent Now ➔
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredFleets.length === 0 && (
        <div className="neo-box bg-white p-12 text-center font-black text-xl uppercase">
          No vehicles matched your search.
        </div>
      )}
    </div>
  );
}
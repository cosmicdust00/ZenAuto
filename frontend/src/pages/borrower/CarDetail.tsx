import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function CarDetail() {
  const { car_id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  
  const [car, setCar] = useState<any>(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Pipeline data mockup mapping
    setCar({
      car_id: car_id,
      license_plate: 'B 1024 EV',
      color: 'Midnight Black',
      image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
      car_models: { brand: 'Tesla', model_name: 'Model 3 Performance', transmission: 'automatic', capacity: 5, base_daily_price: 3200000 }
    });
  }, [car_id]);

  const commitReservationContext = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!user?.license_card_number) {
      setValidationError('RELATIONAL SCHEMA ERROR: A valid Driver License Number (SIM) must be registered in profile properties before creating reservations.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/borrower/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ car_id, start_date: start, end_date: end }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lease configuration rejected by backend database.');

      navigate(`/borrower/checkout/${data.transaction_id}?price=${car?.car_models?.base_daily_price}`);
    } catch (err: any) {
      console.warn("Bypassing server pipeline, shifting to frontend mockup routing frame...");
      navigate(`/borrower/checkout/tx-sandbox-uuid-771?price=${car?.car_models?.base_daily_price}&start=${start}&end=${end}`);
    }
  };

  if (!car) return <div className="p-8 text-center font-black uppercase tracking-widest text-gray-500">Loading Fleet Schema Parameters...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="neo-btn bg-white px-4 py-2 text-xs uppercase flex items-center gap-1 rounded-none">
        <ArrowLeft className="w-4 h-4" /> Return to Catalog Matrix
      </button>

      {validationError && (
        <div className="bg-rose-100 border-4 border-rose-600 text-rose-700 p-4 font-black text-xs uppercase tracking-wide flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" /> {validationError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full bg-white border-4 border-[#0F1525] p-4 shadow-[6px_6px_0px_0px_#0F1525]">
          <img src={car.image_url} alt={car.car_models.model_name} className="w-full h-64 object-cover border-4 border-[#0F1525]" />
          <div className="mt-4 space-y-1 font-bold text-sm text-[#0F1525]">
            <p className="text-2xl font-black uppercase">{car.car_models.brand} {car.car_models.model_name}</p>
            <p className="text-gray-500 text-xs uppercase tracking-wider">Plate Index: {car.license_plate} • Gearbox: {car.car_models.transmission}</p>
          </div>
        </div>

        <div className="w-full bg-[#DAD0C4] border-4 border-[#0F1525] p-6 shadow-[6px_6px_0px_0px_#0F1525] flex flex-col justify-between">
          <h3 className="text-lg font-black uppercase border-b-2 border-black pb-2 mb-4 tracking-tight">Allocate Lease Schedule</h3>
          
          <form onSubmit={commitReservationContext} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase block text-[#0F1525]">Lease Start Date-Time</label>
              <input type="datetime-local" required value={start} onChange={(e) => setStart(e.target.value)} className="w-full p-2.5 border-2 border-black bg-white font-bold text-xs focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase block text-[#0F1525]">Expected Handover Return Date-Time</label>
              <input type="datetime-local" required value={end} onChange={(e) => setEnd(e.target.value)} className="w-full p-2.5 border-2 border-black bg-white font-bold text-xs focus:outline-none" />
            </div>

            <div className="bg-white border-2 border-black p-4 text-xs font-bold space-y-1">
              <div className="flex justify-between text-gray-500 uppercase"><span>Unit Cost Index:</span><span>IDR {car.car_models.base_daily_price.toLocaleString()}/day</span></div>
              <div className="flex justify-between text-[#0F1525] font-black border-t border-gray-300 pt-2 text-sm uppercase"><span>Calculated Subtotal:</span><span className="text-emerald-700">Locked Upon Checkout</span></div>
            </div>

            <button type="submit" className="w-full neo-btn bg-[#062954] text-white p-3.5 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 rounded-none">
              <Calendar className="w-4 h-4" /> Finalize Selection Frame ➔
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
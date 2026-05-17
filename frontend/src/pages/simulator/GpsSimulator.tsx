import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Radio, Play, Square, AlertOctagon } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';

export default function GpsSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<{time: string, lat: string, lng: string, device: string, status: string}[]>([]);
  
  // Titik awal diatur ke sekitar wilayah Bogor
  const [coords, setCoords] = useState({ lat: -6.59503, lng: 106.81663 });
  
  // Menggunakan Input Teks karena ID Mobil di database adalah UUID (bukan sekadar GPS-001)
  const [selectedDevice, setSelectedDevice] = useState('');

  // Trik useRef: Agar setInterval selalu mendapatkan nilai koordinat terbaru tanpa perlu me-reset interval
  const coordsRef = useRef(coords);
  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Hanya berjalan jika simulasi aktif dan UUID mobil sudah diisi
    if (isSimulating && selectedDevice.trim() !== '') {
      interval = setInterval(async () => {
        const currentCoords = coordsRef.current;
        
        // Mensimulasikan pergerakan mobil (bergeser sedikit setiap 3 detik)
        const newLat = (currentCoords.lat + (Math.random() - 0.5) * 0.0005).toFixed(6);
        const newLng = (currentCoords.lng + (Math.random() - 0.5) * 0.0005).toFixed(6);
        
        setCoords({ lat: parseFloat(newLat), lng: parseFloat(newLng) });
        
        const timeNow = new Date().toLocaleTimeString();
        let statusLog = "→ 201 CREATED (Appended to Bucket)";

       try {
          // API MongoDB
          await axios.post('http://localhost:5000/api/telemetry/locations', {
            car_id: selectedDevice.trim(),
            latitude: parseFloat(newLat),
            longitude: parseFloat(newLng)
          });
        } catch (error: any) {
          console.error("Telemetry Broadcast Error:", error);
          statusLog = `→ ERROR: ${error.response?.status || 'Network Failure'}`;
        }

        setLogs(prev => [
          { time: timeNow, lat: newLat, lng: newLng, device: selectedDevice, status: statusLog },
          ...prev.slice(0, 19)
        ]);
      }, 3000); // Mengirim data setiap 3 detik
    }
    
    return () => clearInterval(interval);
  }, [isSimulating, selectedDevice]);

  const handleStartStop = () => {
    if (!selectedDevice.trim()) {
      alert("PLEASE ENTER A VALID CAR UUID BEFORE BROADCASTING.");
      return;
    }
    setIsSimulating(!isSimulating);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-8 border-b-4 border-[#1D2B45] pb-8 pt-4">
        <h1 className="text-4xl font-black text-[#1D2B45] uppercase flex justify-center items-center gap-4">
          <div className="bg-[#1D2B45] text-[#F8F8F6] p-2 border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45]"><Radio size={32} /></div>
          GPS Telemetry Simulator
        </h1>
        <p className="text-[#5E4E46] font-bold mt-4 uppercase tracking-widest">Internal testing tool for MongoDB Bucket Pattern</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <PatchCard variant="white" className="flex flex-col space-y-6">
          <div className="bg-[#EBE6D9] border-2 border-[#1D2B45] p-4 flex items-start space-x-3">
             <AlertOctagon className="text-[#295A8E] flex-shrink-0" />
             <p className="text-sm font-bold text-[#1D2B45]">This tool simulates a physical GPS device sending coordinates to the <span className="uppercase text-[#295A8E]">POST /api/telemetry/locations</span> endpoint.</p>
          </div>

          <div>
            <label className="block font-black text-[#1D2B45] uppercase tracking-wider mb-2">Target Vehicle UUID</label>
            <input 
              type="text"
              placeholder="Paste Car UUID here (e.g., 550e8400-e29b-...)"
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              disabled={isSimulating}
              className="w-full border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] p-3 font-mono font-bold text-[#1D2B45] bg-[#F8F8F6] focus:outline-none focus:bg-[#EBE6D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-black text-[#1D2B45] uppercase tracking-wider mb-2">Current LAT</label>
              <input type="number" value={coords.lat} readOnly className="w-full border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] p-3 font-mono font-bold text-[#5E4E46] bg-[#EBE6D9] outline-none" />
            </div>
            <div>
              <label className="block font-black text-[#1D2B45] uppercase tracking-wider mb-2">Current LNG</label>
              <input type="number" value={coords.lng} readOnly className="w-full border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] p-3 font-mono font-bold text-[#5E4E46] bg-[#EBE6D9] outline-none" />
            </div>
          </div>

          <div className="pt-4 mt-auto">
            {!isSimulating ? (
              <button 
                onClick={handleStartStop}
                className="w-full bg-[#1D2B45] text-[#F8F8F6] font-black uppercase tracking-widest py-4 border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] active:shadow-[0px_0px_0px_0px_#1D2B45] active:translate-y-[4px] active:translate-x-[4px] hover:bg-[#295A8E] transition-all flex justify-center items-center space-x-2"
              >
                <Play fill="currentColor" size={20} /> <span>Start Broadcasting</span>
              </button>
            ) : (
              <button 
                onClick={handleStartStop}
                className="w-full bg-[#ef4444] text-[#F8F8F6] font-black uppercase tracking-widest py-4 border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] active:shadow-[0px_0px_0px_0px_#1D2B45] active:translate-y-[4px] active:translate-x-[4px] hover:bg-[#b91c1c] transition-all flex justify-center items-center space-x-2 animate-pulse"
              >
                <Square fill="currentColor" size={20} /> <span>Stop Broadcasting</span>
              </button>
            )}
          </div>
        </PatchCard>

        {/* Terminal Output */}
        <PatchCard variant="navy" className="font-mono text-sm border-2">
          <div className="flex justify-between items-center mb-4 border-b-2 border-[#5E4E46] pb-2">
            <span className="text-[#F8F8F6] font-black tracking-widest uppercase text-xs">MongoDB Insert Log</span>
            {isSimulating && <span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-none border-2 border-[#F8F8F6] bg-[#F8F8F6] opacity-75"></span><span className="relative inline-flex h-3 w-3 border border-[#1D2B45] bg-[#F8F8F6]"></span></span>}
          </div>
          <div className="space-y-3 h-[300px] overflow-y-auto scrollbar-hide">
            {logs.length === 0 && <span className="text-[#5E4E46] font-bold">Waiting to start...</span>}
            {logs.map((log, i) => (
              <div key={i} className="opacity-90 leading-tight">
                <span className="text-[#EBE6D9] font-bold">[{log.time}]</span> <span className="text-[#4F6355] font-black">POST</span> /api/telemetry 
                <br/><span className="pl-4 text-[#295A8E] font-bold">payload:</span> {'{'} device: '{log.device.substring(0,8)}...', lat: {log.lat}, lng: {log.lng} {'}'}
                <br/><span className={`pl-4 font-black ${log.status.includes('ERROR') ? 'text-rose-500' : 'text-[#F8F8F6]'}`}>{log.status}</span>
              </div>
            ))}
          </div>
        </PatchCard>
      </div>
    </div>
  );
}
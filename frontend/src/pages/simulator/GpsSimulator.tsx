import { useState, useEffect } from 'react';
import { Radio, Play, Square, AlertOctagon } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';

export default function GpsSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<{time: string, lat: string, lng: string, device: string}[]>([]);
  const [coords, setCoords] = useState({ lat: -6.2088, lng: 106.8456 });
  const [selectedDevice, setSelectedDevice] = useState('GPS-001');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isSimulating) {
      interval = setInterval(() => {
        const newLat = (coords.lat + (Math.random() - 0.5) * 0.001).toFixed(5);
        const newLng = (coords.lng + (Math.random() - 0.5) * 0.001).toFixed(5);
        setCoords({ lat: parseFloat(newLat), lng: parseFloat(newLng) });
        
        setLogs(prev => [
          { time: new Date().toLocaleTimeString(), lat: newLat, lng: newLng, device: selectedDevice },
          ...prev.slice(0, 9) // Keep last 10
        ]);
      }, 3000); // Send every 3 seconds for demo
    }
    return () => clearInterval(interval);
  }, [isSimulating, coords, selectedDevice]);

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
            <label className="block font-black text-[#1D2B45] uppercase tracking-wider mb-2">Target Vehicle / Device ID</label>
            <select 
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              disabled={isSimulating}
              className="w-full border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] p-3 font-bold text-[#1D2B45] bg-[#F8F8F6] focus:outline-none focus:bg-[#EBE6D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="GPS-001">Toyota Avanza (GPS-001)</option>
              <option value="GPS-002">Honda Brio (GPS-002)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-black text-[#1D2B45] uppercase tracking-wider mb-2">Start LAT</label>
              <input type="number" value={coords.lat} readOnly className="w-full border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] p-3 font-mono font-bold text-[#5E4E46] bg-[#EBE6D9] outline-none" />
            </div>
            <div>
              <label className="block font-black text-[#1D2B45] uppercase tracking-wider mb-2">Start LNG</label>
              <input type="number" value={coords.lng} readOnly className="w-full border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] p-3 font-mono font-bold text-[#5E4E46] bg-[#EBE6D9] outline-none" />
            </div>
          </div>

          <div className="pt-4 mt-auto">
            {!isSimulating ? (
              <button 
                onClick={() => setIsSimulating(true)}
                className="w-full bg-[#1D2B45] text-[#F8F8F6] font-black uppercase tracking-widest py-4 border-2 border-[#1D2B45] shadow-[4px_4px_0px_0px_#1D2B45] active:shadow-[0px_0px_0px_0px_#1D2B45] active:translate-y-[4px] active:translate-x-[4px] hover:bg-[#295A8E] transition-all flex justify-center items-center space-x-2"
              >
                <Play fill="currentColor" size={20} /> <span>Start Broadcasting</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsSimulating(false)}
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
                <br/><span className="pl-4 text-[#295A8E] font-bold">payload:</span> {'{'} device: '{log.device}', lat: {log.lat}, lng: {log.lng} {'}'}
                <br/><span className="pl-4 text-[#F8F8F6] font-black">→ 201 CREATED (Appended to Bucket)</span>
              </div>
            ))}
          </div>
        </PatchCard>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Radio, AlertOctagon, Search, Calendar, Eye, Activity, History } from 'lucide-react';
import { PatchCard } from '../../components/ui/PatchCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { ActionButton } from '../../components/ui/ActionButton.tsx';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Mapping
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true }); 
    }
  }, [lat, lng, map]);
  return null;
}

export default function LiveTracking() {
  const [inputCarId, setInputCarId] = useState('');
  const [targetCarId, setTargetCarId] = useState(''); 

  // State telemetri live
  const [location, setLocation] = useState<{ latitude: number, longitude: number, timestamp: string } | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [traceHistory, setTraceHistory] = useState<[number, number][]>([]);

  // State history log
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const [historicalTrace, setHistoricalTrace] = useState<[number, number][]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

  // Live Tracker Engine
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchLatestLocation = async () => {
      if (!targetCarId || isHistoryMode) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/telemetry/locations/${targetCarId}`, {
          params: { _t: Date.now() } 
        });
        
        const { latitude, longitude, timestamp } = response.data.data;

        setLocation({ latitude, longitude, timestamp });
        setIsOnline(true);

        setTraceHistory(prev => {
          if (prev.length > 0) {
            const [lastLat, lastLng] = prev[prev.length - 1];
            if (lastLat === latitude && lastLng === longitude) return prev;
          }
          return [...prev, [latitude, longitude]];
        });

      } catch (error) {
        setIsOnline(false);
      }
    };

    if (targetCarId && !isHistoryMode) {
      fetchLatestLocation();
      interval = setInterval(fetchLatestLocation, 3000);
    }

    return () => clearInterval(interval);
  }, [targetCarId, isHistoryMode]);

  // Reset semua state jika target mobil diganti
  useEffect(() => {
    setTraceHistory([]);
    setHistoricalTrace([]);
    setLocation(null);
    setIsOnline(false);
    setIsHistoryMode(false);
  }, [targetCarId]);

  const handleStartTracking = () => {
    if (!inputCarId.trim()) {
      alert("Please enter a valid Car UUID to track.");
      return;
    }
    setTargetCarId(inputCarId.trim());
  };

  // Menarik log history
  const handleFetchTrajectoryLog = async () => {
    if (!startTime || !endTime) {
      alert("PLEASE ALLOCATE BOTH START AND END TIMESTAMPS.");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      alert("START TIMESTAMP MUST PRECEDE THE END TIMESTAMP.");
      return;
    }

    try {
      setIsFetchingHistory(true);
      const response = await axios.get(`http://localhost:5000/api/telemetry/history/${targetCarId}`, {
        params: { 
        start: startTime,
        end: endTime,
        _t: Date.now() }
      });

      const pathPoints = response.data.data;

      if (pathPoints && pathPoints.length > 0) {
        setHistoricalTrace(pathPoints);
        setIsHistoryMode(true); 
      } else {
        alert("No trajectory logs found within this specific temporal range.");
      }

    } catch (error: any) {
      console.error("Failed to compile trajectory grid:", error);
      alert(error.response?.data?.message || "Relational database network integrity failure.");
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const activeCenterLat = isHistoryMode && historicalTrace.length > 0 ? historicalTrace[historicalTrace.length - 1][0] : location?.latitude;
  const activeCenterLng = isHistoryMode && historicalTrace.length > 0 ? historicalTrace[historicalTrace.length - 1][1] : location?.longitude;

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col animate-in fade-in duration-500">
      
      {/* HEADER DAN CONTROL TOGGLE MODE UTAMA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-[#1D2B45] pb-4 shrink-0 gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1D2B45] uppercase tracking-tight flex items-center gap-2">
            Telemetry Console
          </h1>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">
            Current Target Focus: <span className="font-mono text-black">{targetCarId || 'UNALLOCATED'}</span>
          </p>
        </div>
        
        {/* NEO-BRUTALISM SEGMENTED TOGGLE SYSTEM */}
        {targetCarId && (
          <div className="flex bg-white border-4 border-black p-1 shadow-[4px_4px_0px_#1D2B45] rounded-none">
            <button
              onClick={() => setIsHistoryMode(false)}
              className={`px-4 py-2 text-xs font-black uppercase flex items-center gap-2 transition-all rounded-none border-2
                ${!isHistoryMode 
                  ? 'bg-emerald-400 text-black border-black shadow-[2px_2px_0px_#000]' 
                  : 'bg-white text-gray-400 border-transparent hover:text-black'}`}
            >
              <Activity size={14} className={!isHistoryMode ? "animate-pulse" : ""} /> Live Stream
            </button>
            <button
              onClick={() => {
                if (historicalTrace.length === 0) {
                  alert("Please query and compile time-travel parameters via sidebar first.");
                  return;
                }
                setIsHistoryMode(true);
              }}
              className={`px-4 py-2 text-xs font-black uppercase flex items-center gap-2 transition-all rounded-none border-2
                ${isHistoryMode 
                  ? 'bg-rose-500 text-white border-black shadow-[2px_2px_0px_#000]' 
                  : 'bg-white text-gray-400 border-transparent hover:text-black'}`}
            >
              <History size={14} /> Historical View
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex gap-6 min-h-0 flex-col md:flex-row">
        {/* AREA PETA DENGAN BANNER KONDISI OPERASIONAL */}
        <div className="flex-1 bg-[#EBE6D9] border-4 border-[#1D2B45] shadow-[6px_6px_0px_0px_#1D2B45] relative overflow-hidden min-h-[300px]">
          
          {targetCarId && (
            <div className={`absolute top-4 left-14 z-[1000] border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_#000]
              ${isHistoryMode ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-400 text-black'}`}
            >
              {isHistoryMode ? '⚠️ MODE: TIME-TRAVEL LOG RECORD' : '⚡ MODE: LIVE FREQUENCY WIRE'}
            </div>
          )}

          {(isOnline && location) || (isHistoryMode && historicalTrace.length > 0) ? (
            <MapContainer 
              center={[activeCenterLat || -6.595, activeCenterLng || 106.816]} 
              zoom={15} 
              style={{ height: '100%', width: '100%', minHeight: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* JALUR LIVE MODE */}
              {!isHistoryMode && traceHistory.length > 1 && (
                <Polyline positions={traceHistory} pathOptions={{ color: '#1D2B45', weight: 5, dashArray: '8, 8' }} />
              )}

              {/* JALUR HISTORY MODE */}
              {isHistoryMode && historicalTrace.length > 1 && (
                <Polyline positions={historicalTrace} pathOptions={{ color: '#ef4444', weight: 6 }} />
              )}
              
              {/* PIN POSISI MOBIL */}
              {activeCenterLat && activeCenterLng && (
                <Marker position={[activeCenterLat, activeCenterLng]}>
                  <Popup>
                    <div className="font-bold text-xs uppercase text-center">
                      <span className="block font-black text-[#1D2B45]">
                        {isHistoryMode ? "Historical Node Terminus" : "Vehicle Active Unit"}
                      </span>
                      <span className="text-[10px] text-gray-500">{targetCarId.substring(0, 8)}...</span>
                    </div>
                  </Popup>
                </Marker>
              )}

              <RecenterMap lat={activeCenterLat || 0} lng={activeCenterLng || 0} />
            </MapContainer>
          ) : (
             <div className="absolute inset-0 bg-[#EBE6D9] flex items-center justify-center p-6">
               <div className="bg-[#F8F8F6] p-6 border-4 border-[#1D2B45] shadow-[8px_8px_0px_0px_#1D2B45] flex flex-col items-center max-w-sm text-center z-10">
                 <AlertOctagon size={48} className={targetCarId ? "text-[#ef4444] mb-4" : "text-[#5E4E46] mb-4"} />
                 <h2 className="font-black text-[#1D2B45] uppercase text-xl mb-2">No Target Selected</h2>
                 <p className="font-bold text-[#5E4E46] text-sm">Please initialize a vehicle signature frequency string validation filter to deploy operational tracking.</p>
               </div>
             </div>
          )}
        </div>

        {/* SIDEBAR TELEMETRI */}
        <PatchCard variant="white" className="w-full md:w-80 flex flex-col h-full overflow-y-auto relative z-10 shrink-0">
          <h2 className="font-black text-[#1D2B45] uppercase tracking-wider mb-6 flex items-center space-x-2 border-b-2 border-[#1D2B45] pb-2">
            <div className="bg-[#4F6355] text-[#F8F8F6] p-1 border-2 border-[#1D2B45]"><Radio size={18} /></div>
            <span>Console Engine</span>
          </h2>

          {/* SCAN FREKUENSI MOBIL */}
          <div className="mb-4 space-y-2 border-b-2 border-dashed border-gray-300 pb-4">
            <label className="block text-xs font-black uppercase text-[#1D2B45]">Target Vehicle UUID</label>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={inputCarId}
                onChange={(e) => setInputCarId(e.target.value)}
                placeholder="Paste UUID..."
                className="w-full border-2 border-[#1D2B45] p-3 text-xs font-mono font-bold bg-[#F8F8F6] focus:outline-none focus:bg-[#EBE6D9] shadow-[2px_2px_0px_0px_#1D2B45]"
              />
              <button 
                onClick={handleStartTracking}
                className="bg-[#1D2B45] text-[#F8F8F6] px-4 py-2.5 text-xs font-black uppercase border-2 border-[#1D2B45] shadow-[2px_2px_0px_0px_#1D2B45] hover:bg-[#295A8E] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all flex justify-center items-center gap-2"
              >
                <Search size={14} /> Scan Frequency
              </button>
            </div>
          </div>

          {/* INPUT TEMPORAL RANGE FOR TRAJECTORY LOG */}
          <div className="mb-4 space-y-2 border-b-2 border-dashed border-gray-300 pb-4 bg-amber-50 p-3 border-2 border-black shadow-[2px_2px_0px_#000]">
            <label className="font-black text-xs uppercase text-black flex items-center gap-1">
              <Calendar size={14} /> Travel Time Logs
            </label>
            
            <div className="space-y-2 text-[10px] font-bold uppercase text-gray-600">
              <div>
                <span className="block mb-1">Lower Boundary (Start):</span>
                <input 
                  type="datetime-local" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-black p-1.5 bg-white text-xs outline-none focus:bg-yellow-50"
                />
              </div>
              <div>
                <span className="block mb-1">Upper Boundary (End):</span>
                <input 
                  type="datetime-local" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-black p-1.5 bg-white text-xs outline-none focus:bg-yellow-50"
                />
              </div>
            </div>

            <ActionButton 
              variant="denim" 
              onClick={handleFetchTrajectoryLog}
              disabled={!targetCarId || isFetchingHistory} 
              className="w-full justify-center text-xs py-2 mt-2"
            >
              <Eye size={14} /> {isFetchingHistory ? 'Compiling Path...' : 'View Trajectory Log'}
            </ActionButton>
          </div>

          {/* REALTIME STATUS PANEL */}
          <div className={`border-2 border-[#1D2B45] p-4 shadow-[4px_4px_0px_0px_#1D2B45] transition-colors ${isOnline && !isHistoryMode ? 'bg-[#EBE6D9]' : 'bg-gray-100 grayscale'}`}>
            <h3 className="font-black text-[#295A8E] uppercase text-[10px] break-all border-b border-gray-400 pb-1 mb-2">
              ACTIVE REGISTRY: {targetCarId ? targetCarId.substring(0,18) + '...' : 'NONE'}
            </h3>
            <p className="text-xs font-bold text-[#5E4E46] mb-1 uppercase">
              Mode: {isHistoryMode ? <span className="text-rose-600 font-black">History View</span> : <span className="text-emerald-700">Live Wire</span>}
            </p>
            <p className="text-xs font-bold text-[#5E4E46] mb-3">
              Last Ping: {location?.timestamp && !isHistoryMode ? new Date(location.timestamp).toLocaleTimeString('id-ID') : '--:--:--'}
            </p>
            <div className="bg-[#1D2B45] p-3 text-xs font-bold font-mono text-[#F8F8F6] border-2 border-[#1D2B45] leading-tight">
              LAT: {activeCenterLat?.toFixed(6) || 'N/A'}<br />
              LNG: {activeCenterLng?.toFixed(6) || 'N/A'}
            </div>
          </div>
        </PatchCard>
      </div>
    </div>
  );
}
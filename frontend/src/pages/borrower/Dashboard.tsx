import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Car, ClipboardList, Wallet, Radio } from 'lucide-react';

export default function BorrowerDashboard() {
    const { user, token } = useAuth();

    // State untuk menyimpan metrik dinamis
    const [metrics, setMetrics] = useState({
        activeRentals: 0,
        historicalTrips: 0,
        accruedPenalties: 0
    });

    // State khusus untuk menampilkan mobil yang sedang aktif dipinjam
    const [activeCar, setActiveCar] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Cek apakah user dan token sudah siap di memory runtime
            if (!user?.user_id || !token) {
                setIsLoading(false);
                return; 
            }

            try {
                // Buat konfigurasi header standar untuk otorisasi JWT backend
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // Bersihkan alamat URL dari query string "?user_id=", kirim config sebagai parameter kedua
                // Fetch Riwayat Transaksi milik borrower aktif
                const resReservations = await axios.get(`http://localhost:5000/api/borrower/reservations`, config);
                const reservations = resReservations.data.data;

                // Fetch denda baru milik borrower aktif
                const resPenalties = await axios.get(`http://localhost:5000/api/borrower/penalties`, config);
                const totalPenalties = resPenalties.data.data.total_unpaid;

                const totalTrips = reservations.length;
                const activeRentalsList = reservations.filter((res: any) => res.transaction_status === 'active');

                // Masukkan total denda ke state komponen
                setMetrics({
                    activeRentals: activeRentalsList.length,
                    historicalTrips: totalTrips,
                    accruedPenalties: totalPenalties
                });

                if (activeRentalsList.length > 0) {
                    setActiveCar(activeRentalsList[0]);
                } else {
                    setActiveCar(null);
                }

            } catch (error) {
                console.error("Error fetching borrower dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, token]);

    if (isLoading) {
        return <div className="p-8 text-center font-black uppercase tracking-widest text-xl">Loading Terminal Data...</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* CONTEXT GREETING HEADER */}
            <div className="w-full bg-gradient-to-r from-[#062954] via-[#324858] to-[#4A5F68] border-4 border-[#0F1525] p-8 text-white shadow-[6px_6px_0px_0px_#0F1525] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">OPERATIONAL CONSOLE: {user?.full_name || 'GUEST USER'}</h1>
                    <p className="font-bold text-gray-300 text-sm">Welcome to your borrower terminal runtime. Query active fleets and allocate lease parameters efficiently.</p>
                </div>
                <Link to="/cars" className="neo-btn bg-yellow-400 text-black px-6 py-3.5 text-sm uppercase tracking-wider font-black whitespace-nowrap rounded-none hover:bg-yellow-300 transition-colors border-2 border-black">
                    + Initialize New Lease
                </Link>
            </div>

            {/* HARD METRICS ANALYTICS PANEL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Panel 1: Active Allocations (bisa diarahkan ke history juga) */}
                <Link to="/borrower/history" className="w-full bg-white border-4 border-[#0F1525] p-6 shadow-[6px_6px_0px_0px_#0F1525] flex justify-between items-center hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group">
                    <div>
                        <span className="text-xs font-black uppercase text-[#4A5F68] group-hover:text-black transition-colors">Active Allocations</span>
                        <div className="text-4xl font-black text-[#0F1525] mt-1">{metrics.activeRentals} Car Unit</div>
                    </div>
                    <div className="w-12 h-12 bg-sky-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:shadow-none transition-all">
                        <Car className="w-6 h-6 text-black" />
                    </div>
                </Link>

                {/* Panel 2: Aggregated Trips (Diarahkan ke History) */}
                <Link to="/borrower/history" className="w-full bg-white border-4 border-[#0F1525] p-6 shadow-[6px_6px_0px_0px_#0F1525] flex justify-between items-center hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group">
                    <div>
                        <span className="text-xs font-black uppercase text-[#4A5F68] group-hover:text-black transition-colors">Aggregated Trips</span>
                        <div className="text-4xl font-black text-[#0F1525] mt-1">{metrics.historicalTrips} Sessions</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:shadow-none transition-all">
                        <ClipboardList className="w-6 h-6 text-black" />
                    </div>
                </Link>

                {/* Panel 3: Accrued Penalties (Diarahkan ke History) */}
                <Link to="/borrower/history" className="w-full bg-white border-4 border-[#0F1525] p-6 shadow-[6px_6px_0px_0px_#0F1525] flex justify-between items-center hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group">
                    <div>
                        <span className="text-xs font-black uppercase text-[#4A5F68] group-hover:text-black transition-colors">Accrued Penalties</span>
                        <div className="text-4xl font-black text-rose-600 mt-1">IDR {metrics.accruedPenalties.toLocaleString()}</div>
                    </div>
                    <div className="w-12 h-12 bg-rose-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:shadow-none transition-all">
                        <Wallet className="w-6 h-6 text-rose-600" />
                    </div>
                </Link>
            </div>

            {/* TELEMETRY LINK ACTIVE MONITOR WIDGET */}
            {activeCar ? (
                <div className="w-full bg-white border-4 border-[#0F1525] p-6 shadow-[6px_6px_0px_0px_#0F1525] space-y-4">
                    <div className="flex items-center gap-2 border-b-4 border-[#0F1525] pb-3">
                        <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                        <h2 className="text-lg font-black uppercase tracking-tight">Active Realtime IoT Hardware Stream</h2>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                            <h4 className="text-xl font-black text-[#0F1525]">{activeCar.brand} {activeCar.model_name}</h4>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                Plate: {activeCar.license_plate} • Status: IN-TRANSIT MAPPED IN MONGODB
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Tombol Return Unit - Langsung ke History */}
                            <Link to="/borrower/history" className="flex-1 md:flex-none neo-btn bg-amber-400 border-2 border-black text-black px-5 py-2.5 text-xs uppercase font-black rounded-none text-center hover:bg-amber-300">
                                Return Unit
                            </Link>

                            {/* Tombol Start IoT */}
                            <Link to="/simulator/gps" className="flex-1 md:flex-none neo-btn bg-[#F0E9E0] border-2 border-black text-black px-5 py-2.5 text-xs uppercase font-black rounded-none text-center hover:bg-gray-200">
                                Start IoT Emitter ➔
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full bg-gray-100 border-4 border-dashed border-gray-400 p-6 text-center text-gray-500 font-bold uppercase tracking-wider flex flex-col items-center gap-3">
                    NO ACTIVE VEHICLE TELEMETRY FOUND
                    <Link to="/borrower/history" className="text-xs text-blue-600 hover:underline">
                        View Past Rental History
                    </Link>
                </div>
            )}
        </div>
    );
}
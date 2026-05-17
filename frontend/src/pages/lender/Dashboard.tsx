import { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Wrench, DollarSign, Activity, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PatchCard } from '../../components/ui/PatchCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { useAuth } from '../../context/AuthContext';

// Definisi antarmuka struktur data dari backend
interface DashboardStats {
  total_fleet: number;
  active_rentals: number;
  in_maintenance: number;
  total_revenue: number;
}

interface RecentFinance {
  payment_date: string;
  amount: string;
  license_plate: string;
  model_name: string;
}

interface FleetStatusItem {
  car_id: string;
  model_name: string;
  license_plate: string;
  status: string;
}

export default function LenderDashboard() {
  const { token, user } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    total_fleet: 0,
    active_rentals: 0,
    in_maintenance: 0,
    total_revenue: 0
  });
  
  const [recentFinances, setRecentFinances] = useState<RecentFinance[]>([]);
  const [fleetList, setFleetList] = useState<FleetStatusItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        // Fetch Statistics data
        const dashboardResponse = await axios.get('/api/lender/dashboard', config);
        
        if (dashboardResponse.data.data) {
          setStats({
            total_fleet: dashboardResponse.data.data.stats.total_fleet || 0,
            active_rentals: dashboardResponse.data.data.stats.active_rentals || 0,
            in_maintenance: dashboardResponse.data.data.stats.in_maintenance || 0,
            total_revenue: parseFloat(dashboardResponse.data.data.stats.total_revenue) || 0
          });
          setRecentFinances(dashboardResponse.data.data.recent_finances || []);
        }

        // Fetch Data status armada
        const fleetsResponse = await axios.get('/api/lender/fleets', config);

        if (fleetsResponse.data.data) {
          setFleetList(fleetsResponse.data.data);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, user]);

  // Helper untuk memendekkan angka jutaan (Misal 4.700.000 -> 4.7M)
  const formatRevenueCompact = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(0)}K`;
    }
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-[#1D2B45]">
        <Loader2 className="animate-spin mb-4" size={48} />
        <h2 className="text-xl font-black uppercase tracking-widest">Aggregating Data Matrix...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b-4 border-[#1D2B45] pb-4">
        <div>
          <h1 className="text-4xl font-black text-[#1D2B45] uppercase tracking-tight">Overview</h1>
          <p className="text-[#5E4E46] font-medium mt-1">Command Center & Analytics</p>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <PatchCard variant="navy" className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#F8F8F6] text-[#1D2B45] border-2 border-[#1D2B45] shadow-[2px_2px_0px_0px_#1D2B45]"><Car size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Total Fleet</p>
            <h3 className="text-4xl font-black mt-1">{stats.total_fleet}</h3>
          </div>
        </PatchCard>

        <PatchCard variant="denim" className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#F8F8F6] text-[#295A8E] border-2 border-[#1D2B45] shadow-[2px_2px_0px_0px_#1D2B45]"><Activity size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Active Rentals</p>
            <h3 className="text-4xl font-black mt-1">{stats.active_rentals}</h3>
          </div>
        </PatchCard>

        <PatchCard variant="brown" className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#F8F8F6] text-[#5E4E46] border-2 border-[#1D2B45] shadow-[2px_2px_0px_0px_#1D2B45]"><Wrench size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">In Maintenance</p>
            <h3 className="text-4xl font-black mt-1">{stats.in_maintenance}</h3>
          </div>
        </PatchCard>

        <PatchCard variant="olive" className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#F8F8F6] text-[#4F6355] border-2 border-[#1D2B45] shadow-[2px_2px_0px_0px_#1D2B45]"><DollarSign size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Revenue</p>
            <h3 className="text-3xl font-black mt-1">{formatRevenueCompact(stats.total_revenue)}</h3>
          </div>
        </PatchCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Finance */}
        <PatchCard variant="white" className="flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b-2 border-[#1D2B45] pb-2">
            <h2 className="text-xl font-black text-[#1D2B45] uppercase">Recent Finances</h2>
            <Link to="/lender/finances" className="text-sm font-bold text-[#295A8E] hover:underline uppercase tracking-wider">
              View All
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {recentFinances.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#5E4E46] font-bold italic text-sm">
                No recent financial transactions recorded.
              </div>
            ) : (
              recentFinances.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 border-2 border-[#1D2B45] bg-[#EBE6D9] shadow-[2px_2px_0px_0px_#1D2B45]">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[#1D2B45] text-[#F8F8F6]"><DollarSign size={20} /></div>
                    <div>
                      <p className="font-bold text-[#1D2B45] uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] sm:max-w-xs">
                        Rental Income
                      </p>
                      <p className="text-xs font-bold text-[#5E4E46]">
                        {item.model_name} • {new Date(item.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-[#4F6355] text-lg whitespace-nowrap">
                    Rp {parseFloat(item.amount).toLocaleString('id-ID')}
                  </span>
                </div>
              ))
            )}
          </div>
        </PatchCard>

        {/* Fleet Status */}
        <PatchCard variant="cream" className="flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b-2 border-[#1D2B45] pb-2">
            <h2 className="text-xl font-black text-[#1D2B45] uppercase">Fleet Status Matrix</h2>
            <Link to="/lender/fleets" className="text-sm font-bold text-[#295A8E] hover:underline uppercase tracking-wider">
              Manage
            </Link>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
            {fleetList.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#5E4E46] font-bold italic text-sm">
                You haven't deployed any vehicles yet.
              </div>
            ) : (
              fleetList.map(car => (
                <div key={car.car_id} className="flex justify-between items-center bg-[#F8F8F6] border-2 border-[#1D2B45] p-3 shadow-[2px_2px_0px_0px_#1D2B45] hover:bg-white transition-colors">
                  <div>
                    <p className="font-bold text-[#1D2B45] uppercase">{car.model_name}</p>
                    <p className="text-xs font-bold text-[#295A8E]">{car.license_plate}</p>
                  </div>
                  <Badge status={car.status as any} />
                </div>
              ))
            )}
          </div>
        </PatchCard>
        
      </div>
    </div>
  );
}
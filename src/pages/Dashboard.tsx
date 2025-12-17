import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Swords, AlertCircle, Coins, UserX, Radio } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeLiveStreams: 0,
    totalRevenue: 0,
    pendingWithdrawals: 0,
    activeBattles: 0,
    reportedUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/dashboard");

        // Safely handle 'unknown' res.data type
        if (
          res.data &&
          typeof res.data === "object" &&
          "success" in res.data &&
          (res.data as any).success === true &&
          "data" in res.data
        ) {
          setStats((res.data as any).data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Admin Panel</p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={24} />}
          color="blue"
        />

        <StatCard
          title="Active Live Streams"
          value={stats.activeLiveStreams}
          icon={<Radio size={24} />}
          color="green"
        />

        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={<Coins size={24} />}
          color="blue"
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          icon={<AlertCircle size={24} />}
          color="yellow"
        />

        <StatCard
          title="Active Battle"
          value={stats.activeBattles}
          icon={<Swords size={24} />}
          color="green"
        />

        <StatCard
          title="Reported / Blocked Users"
          value={stats.reportedUsers}
          icon={<UserX size={24} />}
          color="red"
        />
      </div>
    </div>
  );
}


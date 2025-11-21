import { Users, Swords, AlertCircle, TrendingUp, Coins, UserX,Radio } from 'lucide-react';
import StatCard from '../components/StatCard';
import Card from '../components/Card';

import { generateRevenueData } from '../utils/mockData';

export default function Dashboard() {
  const revenueData = generateRevenueData(7);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Admin Panel</p>
      </div>

      {/* Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value="45,892"
          icon={<Users size={24} />}
          color="blue"
          
        />
        <StatCard
          title="Active Live Streams"
          value="127"
          icon={<Radio size={24} />}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value="₹1,24,500"
          icon={<Coins size={24} />}
          color="blue"
         
        />
      </div>

      {/* second row - 3 more cards*/}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

        <StatCard
          title='Pending Withdrawals'
          value='23'
          icon={<AlertCircle size={24} />}
          color='yellow'
        />

        <StatCard
          title='Active Battle'
          value='10'
          icon={<Swords size={24} />}
          color='green'
        />

        <StatCard
          title='Reported/Blocked User'
          value='5'
          icon={<UserX size={24} />}
          color='red'
        />
      </div>
    </div>
  );
}

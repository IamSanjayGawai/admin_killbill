import { Users, Radio, DollarSign, AlertCircle, TrendingUp, Coins } from 'lucide-react';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateRevenueData } from '../utils/mockData';

export default function Dashboard() {
  const revenueData = generateRevenueData(7);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Ello Live Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="45,892"
          icon={<Users size={24} />}
          color="blue"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Active Live Streams"
          value="127"
          icon={<Radio size={24} />}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value="$124,500"
          icon={<DollarSign size={24} />}
          color="green"
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Pending Withdrawals"
          value="23"
          icon={<AlertCircle size={24} />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue Trend (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Coin Purchases (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="coinPurchases" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Top Earning Streamers (This Month)">
        <div className="space-y-4">
          {[
            { name: 'Streamer Alpha', earnings: 45000, avatar: '🎤' },
            { name: 'Streamer Beta', earnings: 38000, avatar: '🎮' },
            { name: 'Streamer Gamma', earnings: 32000, avatar: '🎸' },
            { name: 'Streamer Delta', earnings: 28000, avatar: '🎨' },
            { name: 'Streamer Epsilon', earnings: 25000, avatar: '🎭' }
          ].map((streamer, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                  {streamer.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{streamer.name}</p>
                  <p className="text-sm text-gray-600">Rank #{index + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${streamer.earnings.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp size={14} />
                  <span>+15%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

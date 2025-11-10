import Card from '../components/Card';
import Select from '../components/Select';
import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { generateRevenueData, generateEarningsData } from '../utils/mockData';
import { TrendingUp, Users, DollarSign, Gift } from 'lucide-react';

export default function Reports() {
  const [timeRange, setTimeRange] = useState('30');

  const revenueData = generateRevenueData(30);
  const earningsLeaderboard = generateEarningsData();

  const userRetentionData = [
    { day: 'Day 1', users: 100 },
    { day: 'Day 7', users: 75 },
    { day: 'Day 14', users: 60 },
    { day: 'Day 30', users: 45 },
    { day: 'Day 60', users: 35 },
    { day: 'Day 90', users: 30 }
  ];

  const giftDistribution = [
    { name: 'Heart', value: 45 },
    { name: 'Rose', value: 25 },
    { name: 'Diamond', value: 15 },
    { name: 'Crown', value: 10 },
    { name: 'Rocket', value: 5 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed insights and performance metrics</p>
        </div>
        <Select
          options={[
            { value: '7', label: 'Last 7 Days' },
            { value: '30', label: 'Last 30 Days' },
            { value: '90', label: 'Last 90 Days' },
            { value: '365', label: 'Last Year' }
          ]}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$524,890</p>
              <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                <TrendingUp size={14} />
                <span>+18.2%</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Users</p>
              <p className="text-2xl font-bold text-gray-900">12,458</p>
              <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                <TrendingUp size={14} />
                <span>+12.5%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Gifts Sent</p>
              <p className="text-2xl font-bold text-gray-900">45,892</p>
              <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                <TrendingUp size={14} />
                <span>+25.3%</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Gift className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Session Time</p>
              <p className="text-2xl font-bold text-gray-900">28m</p>
              <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                <TrendingUp size={14} />
                <span>+8.1%</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Daily Revenue (Last 30 Days)">
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

        <Card title="Monthly Revenue Comparison">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { month: 'Jan', revenue: 85000 },
                { month: 'Feb', revenue: 92000 },
                { month: 'Mar', revenue: 88000 },
                { month: 'Apr', revenue: 95000 },
                { month: 'May', revenue: 102000 },
                { month: 'Jun', revenue: 110000 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top Earning Streamers (This Month)">
          <div className="space-y-3">
            {earningsLeaderboard.map((streamer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <p className="font-medium text-gray-900">{streamer.name}</p>
                </div>
                <p className="font-bold text-gray-900">${streamer.earnings.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Gift Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={giftDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {giftDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="User Retention Rate">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userRetentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Gift Transaction Logs (Recent)">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {Array.from({ length: 15 }, (_, i) => ({
              id: i + 1,
              from: `User ${Math.floor(Math.random() * 100) + 1}`,
              to: `Streamer ${Math.floor(Math.random() * 30) + 1}`,
              gift: ['Heart', 'Rose', 'Diamond', 'Crown', 'Rocket'][Math.floor(Math.random() * 5)],
              coins: [10, 50, 100, 500, 1000][Math.floor(Math.random() * 5)],
              time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
            })).map((log) => (
              <div key={log.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {log.from} → {log.to}
                    </p>
                    <p className="text-gray-600">
                      Sent {log.gift} ({log.coins} coins)
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, TrendingUp, TrendingDown } from 'lucide-react';
import {
  GiShield,
  GiShieldEchoes,
  GiShieldDisabled,
  GiShieldReflect,
  GiCrownedSkull,
  GiWingedSword,
  GiMusicalNotes,
  GiStarShuriken,
  GiSwordBrandish,
} from 'react-icons/gi';
import api from '../utils/api';
import Card from '../components/Card';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar_url?: string;
  level?: number;
  badge?: string;
  followers_count?: number;
  wallet_balance?: number;
  rank: number;
  totalGifted?: number;
  totalViewers?: number;
  wins?: number;
  xp?: number;
}

const badgeLevels = [
  { title: 'ROOKIE', range: [1, 10], icon: GiShield, colors: ['#0E1A2B', '#1F2C40'] },
  { title: 'RISING STAR', range: [11, 20], icon: GiShieldEchoes, colors: ['#3A310C', '#5A4E1A'] },
  { title: 'GAME CHANGER', range: [21, 30], icon: GiShieldDisabled, colors: ['#1D2E45', '#3A5B78'] },
  { title: 'POWER PLAYER', range: [31, 40], icon: GiShieldReflect, colors: ['#5A2600', '#A84A0D'] },
  { title: 'TRUE CHAMPION', range: [41, 50], icon: GiStarShuriken, colors: ['#1E1E1E', '#4A4A4A'] },
  { title: 'GOLDEN STRIKER', range: [51, 60], icon: GiCrownedSkull, colors: ['#664400', '#C08C00'] },
  { title: 'SKY RIDER', range: [61, 70], icon: GiWingedSword, colors: ['#003B77', '#0A89D2'] },
  { title: 'ROCKSTAR HERO', range: [71, 80], icon: GiMusicalNotes, colors: ['#003F14', '#139E31'] },
  { title: 'SUPREME LEADER', range: [81, 90], icon: GiShieldReflect, colors: ['#4B1561', '#A54BC6'] },
  { title: 'GRAND MASTER', range: [91, 100], icon: GiSwordBrandish, colors: ['#5A2E00', '#D97A0A'] },
];

const getBadgeForLevel = (level: number) =>
  badgeLevels.find((b) => level >= b.range[0] && level <= b.range[1]);

const LeaderBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'top-gifters' | 'top-hosts' | 'top-battles'>('global');
  const [timePeriod, setTimePeriod] = useState<'yesterday' | 'daily' | 'weekly' | 'this-month' | 'last-month'>('daily');
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, timePeriod]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      let endpoint = '';

      if (activeTab === 'global') {
        endpoint = `/api/leaderboard/global?limit=50&sortBy=level`;
      } else if (activeTab === 'top-gifters') {
        endpoint = `/api/leaderboard/top-gifters/${timePeriod}?limit=50`;
      } else if (activeTab === 'top-hosts') {
        endpoint = `/api/leaderboard/top-hosts/${timePeriod}?limit=50`;
      } else if (activeTab === 'top-battles') {
        endpoint = `/api/leaderboard/top-battles/${timePeriod}?limit=50`;
      }

      const response = await api.get(endpoint);

      if (response.data?.success && response.data?.leaderboard) {
        setLeaderboardData(response.data.leaderboard);
      } else {
        setLeaderboardData([]);
      }
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const format = (v: number | undefined) => {
    if (!v) return '0';
    if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000) return (v / 1000).toFixed(1) + 'K';
    return v.toString();
  };

  const getDisplayValue = (user: User) => {
    if (activeTab === 'top-gifters') {
      return format(user.totalGifted || 0);
    } else if (activeTab === 'top-hosts') {
      return format(user.totalViewers || 0);
    } else if (activeTab === 'top-battles') {
      return `${user.wins || 0} wins`;
    }
    return format(user.followers_count || 0);
  };

  const getDisplayLabel = () => {
    if (activeTab === 'top-gifters') {
      return 'Gifted';
    } else if (activeTab === 'top-hosts') {
      return 'Viewers';
    } else if (activeTab === 'top-battles') {
      return 'Wins';
    }
    return 'Followers';
  };

  const topThree = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);

  const timePeriods = [
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'daily', label: 'Today' },
    { key: 'weekly', label: 'Week' },
    { key: 'this-month', label: 'This Month' },
    { key: 'last-month', label: 'Last Month' },
  ];

  const leaderboardTabs = [
    { key: 'global', label: 'Global' },
    { key: 'top-gifters', label: 'Top Gifters' },
    { key: 'top-hosts', label: 'Top Hosts' },
    { key: 'top-battles', label: 'Top Battles' },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600 text-lg font-medium">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600 mt-1 text-base">Track top performers in real-time</p>
      </div>

      {/* Tabs */}
      <Card>
        <div className="space-y-4">
          {/* Leaderboard Type Tabs */}
          <div className="flex gap-2 border-b border-gray-300 pb-2">
            {leaderboardTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2.5 font-semibold text-base transition-colors ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Time Period Filters (only for non-global tabs) */}
          {activeTab !== 'global' && (
            <div className="flex gap-2">
              {timePeriods.map((period) => (
                <button
                  key={period.key}
                  onClick={() => setTimePeriod(period.key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    timePeriod === period.key
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Top 3 Cards */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topThree.map((u, index) => {
            const badge = u.level ? getBadgeForLevel(u.level) : null;
            const BadgeIcon = badge?.icon || GiShield;
            return (
              <Card key={u._id}>
                <div className="relative flex flex-col items-center">
                  {/* Rank Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-base shadow-lg border-2 border-gray-600">
                      #{u.rank}
                    </div>
                  </div>

                  <img
                    src={u.avatar_url || `https://i.pravatar.cc/150?img=${index + 1}`}
                    className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg mt-8"
                    alt={`${u.firstName} ${u.lastName}`}
                  />

                  <h3 className="text-xl mt-4 font-bold text-gray-900">
                    {u.firstName} {u.lastName}
                  </h3>
                  {u.level && <p className="text-gray-600 text-sm font-medium mt-1">Level {u.level}</p>}

                  <div className="mt-3">
                    {badge ? (
                      <span
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full text-white font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${badge.colors[0]}, ${badge.colors[1]})`,
                        }}
                      >
                        <BadgeIcon className="w-6 h-6" />
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </div>

                  <div className="mt-5 w-full flex justify-between text-sm">
                    <span className="px-4 py-2 bg-red-100 rounded-lg flex items-center gap-2 border border-red-300">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="font-bold text-red-700 text-sm">
                        {format(u.wallet_balance || 0)}
                      </span>
                    </span>

                    <span className="px-4 py-2 bg-green-100 rounded-lg flex items-center gap-2 border border-green-300">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-700 text-sm">
                        {getDisplayValue(u)}
                      </span>
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Remaining Users Table */}
      {others.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="grid grid-cols-[60px_80px_60px_auto_100px_100px_100px] gap-4 px-6 py-4 bg-gray-100 font-bold text-gray-900 rounded-t-lg border-b border-gray-300">
                <div className="text-center text-base">Rank</div>
                <div className="text-center text-base">Badge</div>
                <div className="text-center text-base">Lvl</div>
                <div className="text-base">User</div>
                <div className="text-center text-base">Balance</div>
                <div className="text-center text-base">{getDisplayLabel()}</div>
                <div className="text-center text-base">Followers</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-200">
                {others.map((u) => {
                  const badge = u.level ? getBadgeForLevel(u.level) : null;
                  const BadgeIcon = badge?.icon || GiShield;
                  return (
                    <div
                      key={u._id}
                      className="grid grid-cols-[60px_80px_60px_auto_100px_100px_100px] gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors border-b border-gray-200"
                    >
                      <div className="text-center font-bold text-gray-700 text-base">{u.rank}</div>

                      <div className="text-center">
                        {badge ? (
                          <span
                            className="w-8 h-8 inline-flex items-center justify-center rounded-full text-white font-bold shadow-md"
                            style={{
                              background: `linear-gradient(135deg, ${badge.colors[0]}, ${badge.colors[1]})`,
                            }}
                          >
                            <BadgeIcon className="w-5 h-5" />
                          </span>
                        ) : (
                          <span className="text-gray-400 text-lg">—</span>
                        )}
                      </div>

                      <div className="text-center font-bold text-gray-700 text-base">{u.level || 0}</div>

                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar_url || 'https://i.pravatar.cc/150?img=1'}
                          className="w-14 h-14 rounded-full border-2 border-gray-300 shadow-sm"
                          alt={`${u.firstName} ${u.lastName}`}
                        />
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">
                            {u.firstName} {u.lastName}
                          </h3>
                          {u.level && <p className="text-sm text-gray-600 font-medium mt-0.5">Level {u.level}</p>}
                        </div>
                      </div>

                      <div className="text-center text-red-600 font-bold text-base">
                        {format(u.wallet_balance || 0)}
                      </div>
                      <div className="text-center text-green-600 font-bold text-base">
                        {getDisplayValue(u)}
                      </div>
                      <div className="text-center font-bold text-gray-700 text-base">
                        {format(u.followers_count || 0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {leaderboardData.length === 0 && !loading && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg font-medium">No leaderboard data available</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LeaderBoard;

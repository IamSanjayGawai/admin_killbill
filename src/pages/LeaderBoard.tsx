import React, { useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Crown,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  role: string;
  avatar: string;
  badge: "gold" | "silver" | "bronze" | "none";
  level: number;
  spentCoins: number;
  earnedCoins: number;
  rank: number;
}

const LeaderBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"earned" | "spent" | "level">(
    "earned"
  );

  const users: User[] = [
    {
      id: 1,
      name: "Thomas L. Fletcher",
      role: "Product Designer",
      avatar: "https://i.pravatar.cc/150?img=12",
      badge: "gold",
      level: 15,
      spentCoins: 8420,
      earnedCoins: 12450,
      rank: 1,
    },
    {
      id: 2,
      name: "Jane Cooper",
      role: "UI Designer",
      avatar: "https://i.pravatar.cc/150?img=45",
      badge: "silver",
      level: 14,
      spentCoins: 7890,
      earnedCoins: 11230,
      rank: 2,
    },
    {
      id: 3,
      name: "Wade Warren",
      role: "Medical Assistant",
      avatar: "https://i.pravatar.cc/150?img=33",
      badge: "bronze",
      level: 13,
      spentCoins: 6540,
      earnedCoins: 10890,
      rank: 3,
    },
    {
      id: 4,
      name: "Esther Howard",
      role: "President of Sales",
      avatar: "https://i.pravatar.cc/150?img=47",
      badge: "none",
      level: 12,
      spentCoins: 5670,
      earnedCoins: 9450,
      rank: 4,
    },
    {
      id: 5,
      name: "Brooklyn Simmons",
      role: "Marketing Coordinator",
      avatar: "https://i.pravatar.cc/150?img=32",
      badge: "none",
      level: 11,
      spentCoins: 5120,
      earnedCoins: 8890,
      rank: 5,
    },
    {
      id: 6,
      name: "Courtney Henry",
      role: "Medical Assistant",
      avatar: "https://i.pravatar.cc/150?img=65",
      badge: "none",
      level: 10,
      spentCoins: 4780,
      earnedCoins: 7650,
      rank: 6,
    },
    {
      id: 7,
      name: "Darrell Steward",
      role: "Web Designer",
      avatar: "https://i.pravatar.cc/150?img=15",
      badge: "none",
      level: 9,
      spentCoins: 4320,
      earnedCoins: 7120,
      rank: 7,
    },
  ];

  const topThree = users.slice(0, 3);
  const others = users.slice(3);

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "gold":
        return <Crown className="w-7 h-7 text-yellow-400" />;
      case "silver":
        return <Medal className="w-7 h-7 text-gray-300" />;
      case "bronze":
        return <Award className="w-7 h-7 text-amber-600" />;
      default:
        return null;
    }
  };

  const format = (v: number) => (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          <p className="text-indigo-200 mt-1">
            Track top performers in real-time
          </p>
        </div>

        {/* TOP 3 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topThree.map((u) => (
            <div
              key={u.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition relative"
            >
              {/* Rank Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg">
                  #{u.rank}
                </div>
              </div>

              <div className="flex flex-col items-center mt-6">
                <img
                  src={u.avatar}
                  className="w-20 h-20 rounded-full border-4 border-indigo-200 shadow"
                />

                <h3 className="text-lg mt-3 font-semibold">{u.name}</h3>
                <p className="text-gray-500 text-sm">{u.role}</p>

                <div className="mt-3">{getBadgeIcon(u.badge)}</div>

                <div className="mt-4 w-full flex justify-between text-sm">
                  <span className="px-3 py-1 bg-red-50 rounded-lg flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="font-semibold text-red-700">
                      {format(u.spentCoins)}
                    </span>
                  </span>

                  <span className="px-3 py-1 bg-green-50 rounded-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-700">
                      {format(u.earnedCoins)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b border-gray-300 pb-2">
          {["earned", "spent", "level"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "earned" && "Earned Coins"}
              {tab === "spent" && "Spent Coins"}
              {tab === "level" && "Level"}
            </button>
          ))}
        </div>

        {/* REMAINING USERS TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b font-semibold text-gray-600 grid grid-cols-12">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-1 text-center">Badge</div>
            <div className="col-span-1 text-center">Lvl</div>
            <div className="col-span-4">User</div>
            <div className="col-span-2 text-center">Spent</div>
            <div className="col-span-3 text-center">Earned</div>
          </div>

          <div className="divide-y">
            {others.map((u) => (
              <div
                key={u.id}
                className="px-6 py-5 grid grid-cols-12 items-center hover:bg-gray-50 transition"
              >
                <div className="col-span-1 text-center font-semibold text-gray-700">
                  {u.rank}
                </div>

                <div className="col-span-1 text-center">
                  {getBadgeIcon(u.badge) || (
                    <span className="text-gray-400">—</span>
                  )}
                </div>

                <div className="col-span-1 text-center font-bold">
                  {u.level}
                </div>

                <div className="col-span-4 flex items-center gap-3">
                  <img
                    src={u.avatar}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{u.name}</h3>
                    <p className="text-sm text-gray-500">{u.role}</p>
                  </div>
                </div>

                <div className="col-span-2 text-center text-red-600 font-semibold">
                  {format(u.spentCoins)}
                </div>

                <div className="col-span-3 text-center text-green-600 font-semibold">
                  {format(u.earnedCoins)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeaderBoard;

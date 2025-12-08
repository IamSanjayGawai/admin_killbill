import React, { useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Crown,
} from "lucide-react";
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
}from "react-icons/gi";


interface User {
  id: number;
  name: string;
  role: string;
  avatar: string;
  // badge: string;
  level: number;
  spentCoins: number;
  earnedCoins: number;
  followers: number;
  rank: number;
}

const badgeLevels = [
  { title: "ROOKIE", range: [1, 10], icon: GiShield , colors: ["#0E1A2B", "#1F2C40"] },

  { title: "RISING STAR", range: [11, 20], icon: GiShieldEchoes, colors: ["#3A310C", "#5A4E1A"] },

  { title: "GAME CHANGER", range: [21, 30], icon: GiShieldDisabled, colors: ["#1D2E45", "#3A5B78"] },

  { title: "POWER PLAYER", range: [31, 40], icon: GiShieldReflect, colors: ["#5A2600", "#A84A0D"] },

  { title: "TRUE CHAMPION", range: [41, 50], icon: GiStarShuriken, colors: ["#1E1E1E", "#4A4A4A"] },

  { title: "GOLDEN STRIKER", range: [51, 60], icon: GiCrownedSkull, colors: ["#664400", "#C08C00"] },

  { title: "SKY RIDER", range: [61, 70], icon:GiWingedSword, colors: ["#003B77", "#0A89D2"] },

  { title: "ROCKSTAR HERO", range: [71, 80], icon: GiMusicalNotes, colors: ["#003F14", "#139E31"] },

  { title: "SUPREME LEADER", range: [81, 90], icon: GiShieldReflect, colors: ["#4B1561", "#A54BC6"] },

  { title: "GRAND MASTER", range: [91, 100], icon: GiSwordBrandish, colors: ["#5A2E00", "#D97A0A"] },
  
];


const getBadgeForLevel = (level: number) =>
  badgeLevels.find((b)=> level >= b.range[0] && level <= b.range[1]);

const LeaderBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"earned" | "spent" | "level">(
    "earned"
  );

  const users: User[] = [
    { id: 1, name: "Thomas L. Fletcher", role: "Product Designer", avatar: "https://i.pravatar.cc/150?img=12", level: 15, spentCoins: 8420, earnedCoins: 12450, followers: 9500, rank: 1 },
    { id: 2, name: "Jane Cooper", role: "UI Designer", avatar: "https://i.pravatar.cc/150?img=45", level: 14, spentCoins: 7890, earnedCoins: 11230, followers: 8790, rank: 2 },
    { id: 3, name: "Wade Warren", role: "Medical Assistant", avatar: "https://i.pravatar.cc/150?img=33", level: 13, spentCoins: 6540, earnedCoins: 10890, followers: 8020, rank: 3 },
    { id: 4, name: "Esther Howard", role: "President of Sales", avatar: "https://i.pravatar.cc/150?img=47", level: 12, spentCoins: 5670, earnedCoins: 9450, followers: 7200, rank: 4 },
    { id: 5, name: "Brooklyn Simmons", role: "Marketing Coordinator", avatar: "https://i.pravatar.cc/150?img=32", level: 11, spentCoins: 5120, earnedCoins: 8890, followers: 6800, rank: 5 },
    { id: 6, name: "Courtney Henry", role: "Medical Assistant", avatar: "https://i.pravatar.cc/150?img=65", level: 10, spentCoins: 4780, earnedCoins: 7650, followers: 5900, rank: 6 },
    { id: 7, name: "Darrell Steward", role: "Web Designer", avatar: "https://i.pravatar.cc/150?img=15", level: 9, spentCoins: 4320, earnedCoins: 7120, followers: 5400, rank: 7 },
  ];
  

  const topThree = users.slice(0, 3);
  const others = users.slice(3);


  const format = (v: number) => (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-8 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          <p className="text-slate-300 mt-1">Track top performers in real-time</p>
        </div>

        {/* TOP 3 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topThree.map((u) => {
            const badge = getBadgeForLevel(u.level);
            return (
              <div
                key={u.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition relative flex flex-col items-center"
              >
                {/* Rank Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-10 h-10 rounded-full bg-slate-600 text-white flex items-center justify-center font-bold shadow-lg">
                    #{u.rank}
                  </div>
                </div>

                <img
                  src={u.avatar}
                  className="w-20 h-20 rounded-full border-4 border-slate-200 shadow mt-6"
                />

                <h3 className="text-lg mt-3 font-semibold">{u.name}</h3>
                <p className="text-gray-500 text-sm">{u.role}</p>

                <div className="mt-3">
                  {badge ? (
                    <span
                      className="w-8 h-8 inline-flex items-center justify-center rounded-full text-white font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${badge.colors[0]}, ${badge.colors[1]})`,
                      }}
                    >
                       <badge.icon className="w-6 h-6" />
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </div>

                <div className="mt-4 w-full flex justify-between text-sm">
                  <span className="px-3 py-1 bg-red-50 rounded-lg flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="font-semibold text-red-700">{format(u.spentCoins)}</span>
                  </span>

                  <span className="px-3 py-1 bg-green-50 rounded-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-700">{format(u.earnedCoins)}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b border-gray-300 pb-2">
          {(["earned", "spent", "level"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "text-slate-700 border-b-2 border-slate-700"
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
        <div className="overflow-x-auto">
          <div className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
            {/* TABLE HEADER */}
            <div className="grid grid-cols-[60px_80px_60px_auto_100px_100px_100px] gap-4 px-6 py-4 bg-gray-50 font-semibold text-gray-600">
              <div className="text-center">Rank</div>
              <div className="text-center">Badge</div>
              <div className="text-center">Lvl</div>
              <div>User</div>
              <div className="text-center">Spent</div>
              <div className="text-center">Earned</div>
              <div className="text-center">Followers</div>
            </div>

            {/* TABLE ROWS */}
            <div className="divide-y">
              {others.map((u) => {
                const badge = getBadgeForLevel(u.level);
                return (
                  <div
                    key={u.id}
                    className="grid grid-cols-[60px_80px_60px_auto_100px_100px_100px] gap-4 px-6 py-5 items-center hover:bg-gray-50 transition"
                  >
                    <div className="text-center font-semibold text-gray-700">{u.rank}</div>

                    <div className="text-center">
                      {badge ? (
                        <span
                          className="w-7 h-7 inline-flex items-center justify-center rounded-full text-white font-bold"
                          style={{
                            background: `linear-gradient(135deg, ${badge.colors[0]}, ${badge.colors[1]})`,
                          }}
                        >
                           <badge.icon className="w-6 h-6" />
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>

                    <div className="text-center font-bold">{u.level}</div>

                    <div className="flex items-center gap-3">
                      <img src={u.avatar} className="w-12 h-12 rounded-full border" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{u.name}</h3>
                        <p className="text-sm text-gray-500">{u.role}</p>
                      </div>
                    </div>

                    <div className="text-center text-red-600 font-semibold">{format(u.spentCoins)}</div>
                    <div className="text-center text-green-600 font-semibold">{format(u.earnedCoins)}</div>
                    <div className="text-center font-semibold text-slate-600">{format(u.followers)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
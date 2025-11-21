export const generateMockUsers = (count: number) => {
  const statuses = ['active', 'blocked', 'suspended'];
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinedDate: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toLocaleDateString(),
    coins: Math.floor(Math.random() * 10000),
    totalSpent: Math.floor(Math.random() * 50000)
  }));
};

export const generateMockStreamers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `streamer-${i + 1}`,
    name: `Streamer ${i + 1}`,
    email: `streamer${i + 1}@example.com`,
    status: Math.random() > 0.5 ? 'approved' : 'pending',
    rank: Math.floor(Math.random() * 100) + 1,
    level: Math.floor(Math.random() * 50) + 1,
    earnings: Math.floor(Math.random() * 100000),
    followers: Math.floor(Math.random() * 50000),
    totalStreams: Math.floor(Math.random() * 500)
  }));
};

export const generateMockLiveStreams = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `stream-${i + 1}`,
    streamerId: `streamer-${i + 1}`,
    streamerName: `Streamer ${i + 1}`,
    title: `Live Stream ${i + 1}`,
    viewers: Math.floor(Math.random() * 5000),
    duration: Math.floor(Math.random() * 180),
    category: ['Gaming', 'Music', 'Talk Show', 'Entertainment'][Math.floor(Math.random() * 4)],
    thumbnail: `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400`
  }));
};

export const generateMockContent = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `content-${i + 1}`,
    userId: `user-${Math.floor(Math.random() * 100) + 1}`,
    userName: `User ${Math.floor(Math.random() * 100) + 1}`,
    type: Math.random() > 0.5 ? 'video' : 'story',
    status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
    uploadDate: new Date(2024, 10, Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
    views: Math.floor(Math.random() * 50000),
    thumbnail: `https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400`
  }));
};

export const generateMockCoinPackages = () => {
  return [
    { id: 1, coins: 100, price: 0.99, currency: 'USD', popular: false },
    { id: 2, coins: 500, price: 4.99, currency: 'USD', popular: false },
    { id: 3, coins: 1000, price: 9.99, currency: 'USD', popular: true },
    { id: 4, coins: 5000, price: 49.99, currency: 'USD', popular: false },
    { id: 5, coins: 10000, price: 99.99, currency: 'USD', popular: false }
  ];
};

export const generateMockGifts = () => {
  return [
    { id: 1, name: 'Heart', price: 10, animation: 'pulse', icon: '❤️' },
    { id: 2, name: 'Rose', price: 50, animation: 'float', icon: '🌹' },
    { id: 3, name: 'Diamond', price: 100, animation: 'sparkle', icon: '💎' },
    { id: 4, name: 'Crown', price: 500, animation: 'rotate', icon: '👑' },
    { id: 5, name: 'Rocket', price: 1000, animation: 'fly', icon: '🚀' }
  ];
};

export const generateMockWithdrawals = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `withdrawal-${i + 1}`,
    streamerId: `streamer-${i + 1}`,
    streamerName: `Streamer ${i + 1}`,
    amount: Math.floor(Math.random() * 10000) + 1000,
    tds: Math.floor(Math.random() * 1000) + 100,
    finalPayout: Math.floor(Math.random() * 9000) + 900,
    status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
    requestDate: new Date(2024, 10, Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
    bankDetails: {
      accountNumber: `****${Math.floor(Math.random() * 9999)}`,
      ifsc: 'BANK0001234'
    }
  }));
};

export const generateMockReportedUsers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `report-${i + 1}`,
    reportedUserId: `user-${Math.floor(Math.random() * 100) + 1}`,
    reportedUserName: `User ${Math.floor(Math.random() * 100) + 1}`,
    reportedBy: `User ${Math.floor(Math.random() * 100) + 1}`,
    reason: ['Spam', 'Harassment', 'Inappropriate Content', 'Fake Profile'][Math.floor(Math.random() * 4)],
    status: ['pending', 'reviewed', 'action_taken'][Math.floor(Math.random() * 3)],
    reportDate: new Date(2024, 10, Math.floor(Math.random() * 28) + 1).toLocaleDateString()
  }));
};

export const generateRevenueData = (days: number) => {
  return Array.from({ length: days }, (_, i) => ({
    date: `Nov ${i + 1}`,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    coinPurchases: Math.floor(Math.random() * 1000) + 100
  }));
};

export const generateEarningsData = () => {
  return [
    { name: 'Streamer 1', earnings: 45000 },
    { name: 'Streamer 2', earnings: 38000 },
    { name: 'Streamer 3', earnings: 32000 },
    { name: 'Streamer 4', earnings: 28000 },
    { name: 'Streamer 5', earnings: 25000 }
  ];
};

export const mockWithdrawRequests = [
  {
    id: "WR-001",
    user: "User 1",
    method: "Bank Transfer",
    amount: 2500,
    date: "2024-11-10",
    status: "pending",
  },
  {
    id: "WR-002",
    user: "User 2",
    method: "UPI",
    amount: 1500,
    date: "2024-11-12",
    status: "approved",
  },
  {
    id: "WR-003",
    user: "User 3",
    method: "Bank Transfer",
    amount: 4200,
    date: "2024-11-14",
    status: "rejected",
  },
  {
    id: "WR-004",
    user: "User 4",
    method: "UPI",
    amount: 5200,
    date: "2024-11-15",
    status: "pending",
  },
];

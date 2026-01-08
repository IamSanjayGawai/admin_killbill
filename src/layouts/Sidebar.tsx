import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Radio,
  Coins,
  BarChart3,
  Settings,
  X,
  UserCheck,
  Banknote ,
  Trophy,
  Tag,
  Bell,
  Percent
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const menuItems: MenuItem[] = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/users', icon: Users, label: 'User Management' },
  { path: '/streamers', icon: UserCheck, label: 'Streamer Management' },
   { path: '/revenue', icon: Coins, label: 'Coins & Revenue' },
   { path: '/platform-fees', icon: Percent, label: 'Platform Fees' },
   { path: '/withdrawals', icon:  Banknote, label: 'Withdrawal Requests' },
   { path: '/leaderboard',icon:Trophy,label:'LeaderBoard'},
  { path: '/offers', icon: Tag, label: 'Offer Management' },
  { path: '/notifications', icon: Bell, label: 'Notifications & Messages' },
  { path: '/reports', icon: BarChart3, label: 'Reports & Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden transition-opacity backdrop-blur-sm ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Radio className="text-blue-500" size={32} />
            <h1 className="text-xl font-bold text-white">FunZo</h1>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-88px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white font-medium'
                }`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

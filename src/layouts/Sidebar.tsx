import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Radio,
  MonitorPlay,
  FileVideo,
  Coins,
  BarChart3,
  Settings,
  Menu,
  X,
  UserCheck,
  Banknote ,
  Trophy
} from 'lucide-react';
import LeaderBoard from '../pages/LeaderBoard';

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
   { path: '/withdrawals', icon:  Banknote, label: 'Withdrawal Requests' },
   { path: '/leaderboard',icon:Trophy,label:'LeaderBoard'},
  { path: '/reports', icon: BarChart3, label: 'Reports & Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ₹{
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ₹{
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Radio className="text-blue-500" size={32} />
            <h1 className="text-xl font-bold">Stranger's Den</h1>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ₹{
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

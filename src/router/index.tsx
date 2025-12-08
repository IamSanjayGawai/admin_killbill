import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import StreamerManagement from '../pages/StreamerManagement';
import Revenue from '../pages/Revenue';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import AdminLogin from '../pages/AdminLogin';
import WithdrawalRequests from '../pages/WithdrawalRequest';
import ProtectedRoute from './ProtectedRoute';
import LeaderBoard from '../pages/LeaderBoard'
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AdminLogin />
  },
  {
    path: '/',
    element:
    <ProtectedRoute>
     <MainLayout />
     </ProtectedRoute>,
     
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'users',
        element: <UserManagement />
      },
      {
        path: 'streamers',
        element: <StreamerManagement />
      },

      {
        path: 'revenue',
        element: <Revenue />
      },
      {
        path: 'withdrawals',
        element: <WithdrawalRequests />
      },
      {
        path: 'leaderboard',
        element: <LeaderBoard />
      },
      {
        path: 'reports',
        element: <Reports />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
]);
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import StreamerManagement from '../pages/StreamerManagement';
import LiveModeration from '../pages/LiveModeration';
import ContentModeration from '../pages/ContentModeration';
import Revenue from '../pages/Revenue';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
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
        path: 'live-moderation',
        element: <LiveModeration />
      },
      {
        path: 'content',
        element: <ContentModeration />
      },
      {
        path: 'revenue',
        element: <Revenue />
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

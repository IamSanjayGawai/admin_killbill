import { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import Modal from '../components/Modal';
import { CheckCircle, XCircle, Eye, TrendingUp } from 'lucide-react';
import { generateMockStreamers, generateMockLiveStreams } from '../utils/mockData';

export default function StreamerManagement() {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedStreamer, setSelectedStreamer] = useState<typeof mockStreamers[0] | null>(null);

  const mockStreamers = generateMockStreamers(30);
  const mockLiveStreams = generateMockLiveStreams(15);

  const applicationColumns = [
    { key: 'id', label: 'Application ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => {
        const status = value as string;
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
            {status}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSelectedStreamer(row as typeof mockStreamers[0]);
              setIsApplicationModalOpen(true);
            }}
          >
            <Eye size={16} />
          </Button>
          {row.status === 'pending' && (
            <>
              <Button size="sm" variant="success">
                <CheckCircle size={16} />
              </Button>
              <Button size="sm" variant="danger">
                <XCircle size={16} />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const streamerColumns = [
    { key: 'id', label: 'Streamer ID' },
    { key: 'name', label: 'Name' },
    { key: 'rank', label: 'Rank' },
    { key: 'level', label: 'Level' },
    {
      key: 'earnings',
      label: 'Earnings',
      render: (value: unknown) => `$${(value as number).toLocaleString()}`
    },
    {
      key: 'followers',
      label: 'Followers',
      render: (value: unknown) => (value as number).toLocaleString()
    },
    { key: 'totalStreams', label: 'Total Streams' },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <Button size="sm" variant="primary">
          View Profile
        </Button>
      )
    }
  ];

  const liveMonitoringColumns = [
    {
      key: 'thumbnail',
      label: 'Preview',
      render: (value: unknown) => (
        <img src={value as string} alt="Stream" className="w-16 h-12 object-cover rounded" />
      )
    },
    { key: 'streamerName', label: 'Streamer' },
    { key: 'title', label: 'Title' },
    {
      key: 'viewers',
      label: 'Viewers',
      render: (value: unknown) => (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-medium">{(value as number).toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (value: unknown) => `${value} min`
    },
    { key: 'category', label: 'Category' },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <Button size="sm" variant="primary">
          Monitor
        </Button>
      )
    }
  ];

  const applicationsTab = (
    <Card>
      <Table
        columns={applicationColumns}
        data={mockStreamers.filter(s => s.status === 'pending').slice(0, 10)}
      />
    </Card>
  );

  const streamersTab = (
    <Card>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Streamers</p>
          <p className="text-2xl font-bold text-gray-900">{mockStreamers.length}</p>
          <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
            <TrendingUp size={14} />
            <span>+12 this week</span>
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Active Now</p>
          <p className="text-2xl font-bold text-gray-900">{mockLiveStreams.length}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-600">Pending Applications</p>
          <p className="text-2xl font-bold text-gray-900">
            {mockStreamers.filter(s => s.status === 'pending').length}
          </p>
        </div>
      </div>
      <Table columns={streamerColumns} data={mockStreamers.slice(0, 10)} />
    </Card>
  );

  const liveMonitoringTab = (
    <Card>
      <Table columns={liveMonitoringColumns} data={mockLiveStreams} />
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Streamer Management</h1>
        <p className="text-gray-600 mt-1">Manage streamers and monitor live content</p>
      </div>

      <Tabs
        tabs={[
          { key: 'applications', label: 'Applications', content: applicationsTab },
          { key: 'streamers', label: 'All Streamers', content: streamersTab },
          { key: 'live', label: 'Live Monitoring', content: liveMonitoringTab }
        ]}
      />

      <Modal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        title="Streamer Application Details"
        size="lg"
        footer={
          <>
            <Button variant="danger" onClick={() => setIsApplicationModalOpen(false)}>
              <XCircle size={18} className="mr-2" />
              Reject
            </Button>
            <Button variant="success" onClick={() => setIsApplicationModalOpen(false)}>
              <CheckCircle size={18} className="mr-2" />
              Approve
            </Button>
          </>
        }
      >
        {selectedStreamer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{selectedStreamer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedStreamer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Streams</p>
                <p className="font-medium">{selectedStreamer.totalStreams}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Followers</p>
                <p className="font-medium">{selectedStreamer.followers.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Application Notes</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  Experienced content creator with a strong following. Specializes in entertainment and talk shows.
                  Previous experience includes streaming on other platforms with consistent engagement.
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Sample Content</p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400`}
                    alt={`Sample ${i}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

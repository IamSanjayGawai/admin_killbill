import { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Tabs from '../components/Tabs';
import { Search, Edit, Ban, CheckCircle, Eye } from 'lucide-react';
import { generateMockUsers, generateMockReportedUsers } from '../utils/mockData';

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const mockUsers = generateMockUsers(50);
  const mockReportedUsers = generateMockReportedUsers(20);

  const userColumns = [
    { key: 'id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => {
        const status = value as string;
        const colors = {
          active: 'bg-green-100 text-green-800',
          blocked: 'bg-red-100 text-red-800',
          suspended: 'bg-yellow-100 text-yellow-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
            {status}
          </span>
        );
      }
    },
    { key: 'joinedDate', label: 'Joined Date' },
    { key: 'coins', label: 'Coins' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedUser(row as typeof mockUsers[0]);
              setIsViewModalOpen(true);
            }}
          >
            <Eye size={16} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSelectedUser(row as typeof mockUsers[0]);
              setIsEditModalOpen(true);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            size="sm"
            variant={row.status === 'blocked' ? 'success' : 'danger'}
          >
            {row.status === 'blocked' ? <CheckCircle size={16} /> : <Ban size={16} />}
          </Button>
        </div>
      )
    }
  ];

  const reportedColumns = [
    { key: 'id', label: 'Report ID' },
    { key: 'reportedUserName', label: 'Reported User' },
    { key: 'reportedBy', label: 'Reported By' },
    { key: 'reason', label: 'Reason' },
    { key: 'reportDate', label: 'Report Date' },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => {
        const status = value as string;
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          reviewed: 'bg-blue-100 text-blue-800',
          action_taken: 'bg-green-100 text-green-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
            {status.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <Button size="sm" variant="primary">
            Review
          </Button>
          <Button size="sm" variant="danger">
            Take Action
          </Button>
        </div>
      )
    }
  ];

  const usersTab = (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'blocked', label: 'Blocked' },
            { value: 'suspended', label: 'Suspended' }
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Button variant="primary">Export CSV</Button>
      </div>

      <Card>
        <Table
          columns={userColumns}
          data={mockUsers.slice((currentPage - 1) * 10, currentPage * 10)}
          pagination={{
            currentPage,
            totalPages: Math.ceil(mockUsers.length / 10),
            onPageChange: setCurrentPage
          }}
        />
      </Card>
    </div>
  );

  const reportedUsersTab = (
    <Card>
      <Table columns={reportedColumns} data={mockReportedUsers.slice(0, 10)} />
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
      </div>

      <Tabs
        tabs={[
          { key: 'users', label: 'All Users', content: usersTab },
          { key: 'reported', label: 'Reported Users', content: reportedUsersTab }
        ]}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User Profile"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">Save Changes</Button>
          </>
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            <Input label="Name" defaultValue={selectedUser.name} />
            <Input label="Email" defaultValue={selectedUser.email} />
            <Select
              label="Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'blocked', label: 'Blocked' },
                { value: 'suspended', label: 'Suspended' }
              ]}
              defaultValue={selectedUser.status}
            />
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Activity Logs"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-medium">{selectedUser.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Coins</p>
                <p className="font-medium">{selectedUser.coins}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="font-medium">${selectedUser.totalSpent}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recent Activity</h4>
              <div className="space-y-2">
                {['Purchased 500 coins', 'Sent gift to Streamer Alpha', 'Joined live stream'].map((activity, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

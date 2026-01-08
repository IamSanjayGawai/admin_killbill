import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Tabs from '../components/Tabs';
import axios from 'axios';
import { Search, Edit, Eye, Download, Filter, Users as UsersIcon, AlertTriangle, X, Activity } from 'lucide-react';

type UserStatus = 'active' | 'blocked' | 'suspended';

type User = {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  moderation_status: UserStatus;
  created_at: string;
  wallet_balance: number;
  totalSpent?: number;
};

type ReportStatus = 'active' | 'blocked' | 'suspended';

type UserReport = {
  _id: string;
  reporter: { firstName: string; lastName: string };
  reportedUser: { firstName: string; lastName: string; status: ReportStatus };
  reason: string;
  created_at: string;
  status: ReportStatus;
};

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');

  const [users, setUsers] = useState<User[]>([]);
  const [reportedUsers, setReportedUsers] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // EDIT MODAL
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [editfirstName, setfirstName] = useState("");
  const [editlastName, setlastName] = useState("");
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState<UserStatus>('active');

  // REPORT ACTION MODAL
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [reportStatus, setReportStatus] = useState<ReportStatus>('suspended');

  // ACTIVITY LOG
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.firstName.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' ? true : user.moderation_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [normalizedSearch, statusFilter, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / 10));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // EXPORT CSV
  const exportCSV = () => {
    const headers = ['User ID', 'Name', 'Email', 'Status', 'Joined Date', 'Coins'];

    const rows = filteredUsers.map((u) => [
      u._id,
      u.firstName,
      u.email,
      u.moderation_status,
      u.created_at,
      u.wallet_balance
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `${headers.join(',')}\n`;
    rows.forEach((row) => {
      csvContent += `${row.join(',')}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FETCH USERS & REPORTS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        if (
          res &&
          res.data &&
          typeof res.data === "object" &&
          res.data !== null &&
          "data" in res.data &&
          Array.isArray((res.data as any).data)
        ) {
          setUsers((res.data as any).data);
        } else {
          setUsers([]);
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            (err instanceof Error ? err.message : "Failed to load users")
        );
      }
    };

    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/reports", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        if (
          res &&
          res.data &&
          typeof res.data === "object" &&
          res.data !== null &&
          "data" in res.data &&
          Array.isArray((res.data as any).data)
        ) {
          setReportedUsers((res.data as any).data);
        } else {
          setReportedUsers([]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchReports();
  }, []);

  // UPDATE USER (EDIT MODAL)
  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      const res = await axios.put(
        `http://localhost:4000/api/admin/users/${selectedUser._id}`,
        {
          firstName: editfirstName,
          lastName: editlastName,
          email: editEmail,
          moderation_status: editStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (
        res &&
        res.data &&
        typeof res.data === "object" &&
        res.data !== null &&
        "data" in res.data
      ) {
        const updatedUser = (res.data as { data: User }).data;

        setUsers((prev) =>
          prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
        );
      }

      setIsEditModalOpen(false);
      alert("User updated successfully!");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update user");
    }
  };

  // FETCH USER ACTIVITY
  const fetchUserActivity = async (id: string) => {
    try {
      setActivityLoading(true);

      const res = await axios.get(
        `http://localhost:4000/api/admin/users/${id}/activity`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (
        res &&
        res.data &&
        typeof res.data === "object" &&
        res.data !== null &&
        "data" in res.data
      ) {
        const safeData = res.data as { data: { recentActivity?: any[] } };
        setRecentActivity(safeData.data.recentActivity || []);
      } else {
        setRecentActivity([]);
      }
    } catch (err) {
      setRecentActivity([]);
    } finally {
      setActivityLoading(false);
    }
  };

  // UPDATE REPORT STATUS (TAKE ACTION)
  const updateReportStatus = async (reportId: string, action: ReportStatus) => {
    const res = await axios.put(
      `http://localhost:4000/api/admin/reports/${reportId}/action`,
      { action },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );

    if (
      res &&
      res.data &&
      typeof res.data === "object" &&
      res.data !== null &&
      "data" in res.data
    ) {
      const safeData = res.data as { data: any };
      return safeData.data;
    } else {
      return null;
    }
  };

  // TABLE COLUMNS
  const userColumns = [
    { key: '_id', label: 'User ID' },
    { 
      key: 'firstName', 
      label: 'Name',
      render: (value: unknown, row: Record<string, unknown>) => {
        const user = row as User;
        return (
          <span className="font-medium text-gray-900">{user.firstName} {user.lastName || ''}</span>
        );
      }
    },
    {
      key: 'moderation_status',
      label: 'Status',
      render: (value: unknown) => {
        const colors: Record<UserStatus, string> = {
          active: 'bg-green-100 text-green-700 border-green-200',
          blocked: 'bg-red-100 text-red-700 border-red-200',
          suspended: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
        const typedValue = (value as UserStatus) ?? 'active';
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[typedValue]}`}>
            {typedValue.charAt(0).toUpperCase() + typedValue.slice(1)}
          </span>
        );
      },
    },
    { 
      key: 'created_at', 
      label: 'Joined Date',
      render: (value: unknown) => {
        if (typeof value === 'string') {
          return new Date(value).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        }
        return value;
      }
    },
    { 
      key: 'wallet_balance', 
      label: 'Coins',
      render: (value: unknown) => (
        <span className="font-semibold text-gray-900">{Number(value).toLocaleString()}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: unknown, row: Record<string, unknown>) => {
        const typedRow = row as User;
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-blue-50 hover:text-blue-600"
              onClick={() => {
                setSelectedUser(typedRow);
                fetchUserActivity(typedRow._id);
                setIsViewModalOpen(true);
              }}
            >
              <Eye size={16} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="hover:bg-gray-100"
              onClick={() => {
                setSelectedUser(typedRow);
                setfirstName(typedRow.firstName);
                setlastName(typedRow.lastName || '');
                setEditEmail(typedRow.email);
                setEditStatus(typedRow.moderation_status);
                setIsEditModalOpen(true);
              }}
            >
              <Edit size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  const reportedColumns = [
    { key: '_id', label: 'Report ID' },
    { 
      key: 'reportedUser', 
      label: 'Reported User', 
      render: (value: any) => (
        <span className="font-medium text-gray-900">{value?.firstName} {value?.lastName || ''}</span>
      )
    },
    { 
      key: 'reporter', 
      label: 'Reported By', 
      render: (value: any) => (
        <span className="text-gray-700">{value?.firstName} {value?.lastName || ''}</span>
      )
    },
    { 
      key: 'reason', 
      label: 'Reason',
      render: (value: unknown) => (
        <span className="text-gray-700 max-w-xs truncate block">{String(value)}</span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Report Date',
      render: (value: unknown) => {
        if (typeof value === 'string') {
          return new Date(value).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        }
        return value;
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => {
        const colors: Record<ReportStatus, string> = {
          active: 'bg-green-100 text-green-700 border-green-200',
          blocked: 'bg-red-100 text-red-700 border-red-200',
          suspended: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
        const typedValue = (value as ReportStatus) ?? 'active';
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[typedValue]}`}>
            {typedValue.charAt(0).toUpperCase() + typedValue.slice(1)}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: unknown, row: Record<string, unknown>) => {
        const typedRow = row as UserReport;
        return (
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setSelectedReport(typedRow);
              setReportStatus(typedRow.status);
              setIsActionModalOpen(true);
            }}
          >
            Take Action
          </Button>
        );
      }
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-2">Manage users, view reports, and monitor platform activity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
            <div className="p-1.5 bg-blue-500 rounded-lg">
              <UsersIcon size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Users</p>
              <p className="text-sm font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
          {reportedUsers.length > 0 && (
            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-sm">
              <div className="p-1.5 bg-red-500 rounded-lg">
                <AlertTriangle size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Reports</p>
                <p className="text-sm font-bold text-red-700">{reportedUsers.length}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-4 flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-red-500 rounded-lg">
            <AlertTriangle className="text-white flex-shrink-0" size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => setError('')}
            className="p-1.5 hover:bg-red-200 rounded-lg text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <Tabs
        tabs={[
          {
            key: 'users',
            label: `All Users (${users.length})`,
            content: (
              <div className="space-y-6">
                {/* Search and Filter Bar */}
                <Card className="p-0 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Search Input */}
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          placeholder="Search by name..."
                          className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      {/* Status Filter */}
                      <div className="lg:w-52">
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                          <Select
                            className="pl-10 h-11 border-gray-300 focus:border-blue-500"
                            options={[
                              { value: 'all', label: 'All Status' },
                              { value: 'active', label: 'Active' },
                              { value: 'blocked', label: 'Blocked' },
                              { value: 'suspended', label: 'Suspended' }
                            ]}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | UserStatus)}
                          />
                        </div>
                      </div>

                      {/* Export Button */}
                      <Button 
                        variant="primary" 
                        onClick={exportCSV}
                        className="flex items-center gap-2 h-11 px-5"
                      >
                        <Download size={16} />
                        Export CSV
                      </Button>
                    </div>

                    {/* Results Count */}
                    <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">
                          Showing <span className="font-bold text-gray-900">{paginatedUsers.length}</span> of{' '}
                          <span className="font-bold text-gray-900">{filteredUsers.length}</span> users
                        </p>
                      </div>
                      {(searchQuery || statusFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <X size={14} />
                          Clear filters
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto bg-white">
                    {paginatedUsers.length > 0 ? (
                      <Table
                        columns={userColumns}
                        data={paginatedUsers}
                        pagination={{
                          currentPage,
                          totalPages,
                          onPageChange: setCurrentPage
                        }}
                      />
                    ) : (
                      <div className="p-16 text-center">
                        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                          <UsersIcon className="text-gray-400" size={40} />
                        </div>
                        <p className="text-gray-700 font-semibold text-lg mb-1">No users found</p>
                        <p className="text-sm text-gray-500">
                          {searchQuery || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filters' 
                            : 'No users in the system'}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )
          },
          {
            key: 'reported',
            label: `Reported Users (${reportedUsers.length})`,
            content: (
              <Card className="p-0 overflow-hidden">
                {reportedUsers.length > 0 ? (
                  <div className="overflow-x-auto bg-white">
                    <Table columns={reportedColumns} data={reportedUsers} />
                  </div>
                ) : (
                  <div className="p-16 text-center">
                    <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                      <AlertTriangle className="text-green-500" size={40} />
                    </div>
                    <p className="text-gray-700 font-semibold text-lg mb-1">No reported users</p>
                    <p className="text-sm text-gray-500">All reports have been resolved</p>
                  </div>
                )}
              </Card>
            )
          }
        ]}
      />

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User Profile"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">User ID</p>
              <p className="text-sm font-mono font-bold text-gray-900 break-all">{selectedUser._id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label="First Name" 
                value={editfirstName} 
                onChange={(e) => setfirstName(e.target.value)}
                className="h-11"
              />
              <Input 
                label="Last Name" 
                value={editlastName} 
                onChange={(e) => setlastName(e.target.value)}
                className="h-11"
              />
            </div>

            <Input 
              label="Email Address" 
              type="email"
              value={editEmail} 
              onChange={(e) => setEditEmail(e.target.value)}
              className="h-11"
            />

            <Select
              label="Account Status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as UserStatus)}
              className="h-11"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'blocked', label: 'Blocked' },
                { value: 'suspended', label: 'Suspended' }
              ]}
            />
          </div>
        )}
      </Modal>

      {/* VIEW MODAL */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details & Activity"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-200 shadow-sm">
              <div className="p-4 bg-white rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">User ID</p>
                <p className="text-xs font-mono font-bold text-gray-900 break-all">{selectedUser._id}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Full Name</p>
                <p className="text-sm font-bold text-gray-900">{selectedUser.firstName} {selectedUser.lastName || ''}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Email</p>
                <p className="text-sm text-gray-900">{selectedUser.email}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Status</p>
                <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border ${
                  selectedUser.moderation_status === 'active' ? 'bg-green-100 text-green-700 border-green-300' :
                  selectedUser.moderation_status === 'blocked' ? 'bg-red-100 text-red-700 border-red-300' :
                  'bg-yellow-100 text-yellow-700 border-yellow-300'
                }`}>
                  {selectedUser.moderation_status.charAt(0).toUpperCase() + selectedUser.moderation_status.slice(1)}
                </span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Wallet Balance</p>
                <p className="text-xl font-bold text-gray-900">{selectedUser.wallet_balance.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">coins</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">₹{selectedUser.totalSpent || 0}</p>
                <p className="text-xs text-gray-500 mt-1">lifetime</p>
              </div>
            </div>

            {/* Activity Section */}
            <div>
              <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                Recent Activity
              </h4>

              {activityLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-sm text-gray-500">Loading activity...</p>
                  </div>
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-4 bg-white rounded-xl border border-gray-200 text-sm text-gray-700 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="flex-1">{activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                  <div className="inline-flex p-3 bg-gray-200 rounded-full mb-3">
                    <Activity className="text-gray-400" size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-600">No recent activity available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* TAKE ACTION MODAL */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedReport(null);
        }}
        title="Take Action on Report"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsActionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (!selectedReport) return;

                try {
                  await updateReportStatus(selectedReport._id, reportStatus);
                  setReportedUsers((prev) =>
                    prev.map((report) =>
                      report._id === selectedReport._id ? { ...report, status: reportStatus } : report
                    )
                  );
                  setIsActionModalOpen(false);
                  setSelectedReport(null);
                  alert("Report status updated successfully!");
                } catch (err: any) {
                  alert(err?.response?.data?.message || "Failed to update report");
                }
              }}
            >
              Update Status
            </Button>
          </>
        }
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-200">
              <p className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={16} />
                Report Details
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-100">
                  <span className="text-sm font-medium text-gray-600">Reported User:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedReport.reportedUser.firstName} {selectedReport.reportedUser.lastName || ''}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-100">
                  <span className="text-sm font-medium text-gray-600">Reported By:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedReport.reporter.firstName} {selectedReport.reporter.lastName || ''}
                  </span>
                </div>
                <div className="p-4 bg-white rounded-lg border border-red-100">
                  <span className="text-sm font-medium text-gray-600 block mb-2">Reason:</span>
                  <p className="text-sm text-gray-900 leading-relaxed">{selectedReport.reason}</p>
                </div>
              </div>
            </div>

            <Select
              label="Update Status"
              value={reportStatus}
              onChange={(e) => setReportStatus(e.target.value as ReportStatus)}
              className="h-11"
              options={[
                { value: 'active', label: 'Active - No action needed' },
                { value: 'blocked', label: 'Blocked - Permanently block user' },
                { value: 'suspended', label: 'Suspended - Temporarily suspend user' }
              ]}
            />

            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-yellow-800 leading-relaxed">
                  <strong className="font-semibold">Important:</strong> Changing the status will affect the reported user's account access and permissions.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

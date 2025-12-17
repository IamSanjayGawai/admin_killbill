import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Tabs from '../components/Tabs';
import axios from 'axios';
import { Search, Edit, Eye } from 'lucide-react';

type UserStatus = 'active' | 'blocked' | 'suspended';



type User = {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  moderation_status: UserStatus; // <-- changed from status
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

  // -------------------------------------
  // EXPORT CSV
  // -------------------------------------
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

  // -------------------------------------
  // FETCH USERS & REPORTS
  // -------------------------------------
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

  // -------------------------------------
  // UPDATE USER (EDIT MODAL)
  // -------------------------------------
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

      // Fix: res.data is typed as unknown, so we need to type guard/cast it.
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
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update user");
    }
  };

  // -------------------------------------
  // FETCH USER ACTIVITY
  // -------------------------------------
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

      // Fix: res.data is typed as unknown, so we need a type guard or cast
      if (
        res &&
        res.data &&
        typeof res.data === "object" &&
        res.data !== null &&
        "data" in res.data
      ) {
        // Assume backend returns: { data: { recentActivity: any[] } }
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

  // -------------------------------------
  // UPDATE REPORT STATUS (TAKE ACTION)
  // -------------------------------------
  const updateReportStatus = async (reportId: string, action: ReportStatus) => {
    const res = await axios.put(
      `http://localhost:4000/api/admin/reports/${reportId}/action`,
      { action }, // MUST match backend
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );

    // Fix: res.data is typed as unknown, so we need a type guard or cast
    if (
      res &&
      res.data &&
      typeof res.data === "object" &&
      res.data !== null &&
      "data" in res.data
    ) {
      // You may want to specify a proper type here, e.g. { data: any }
      const safeData = res.data as { data: any };
      return safeData.data;
    } else {
      return null;
    }
  };

 
 // TABLE COLUMN
const userColumns = [
  { key: '_id', label: 'User ID' },
  { key: 'firstName', label: 'Name' },
  { key: 'email', label: 'Email' },
  {
    key: 'moderation_status', // <--- use moderation_status
    label: 'Status',
    render: (value: unknown) => {
      const colors: Record<UserStatus, string> = {
        active: 'bg-green-100 text-green-800',
        blocked: 'bg-red-100 text-red-800',
        suspended: 'bg-yellow-100 text-yellow-800',
      };
      const typedValue = (value as UserStatus) ?? 'active';
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[typedValue]}`}>
          {typedValue}
        </span>
      );
    },
  },
  { key: 'created_at', label: 'Joined Date' },
  { key: 'wallet_balance', label: 'Coins' },

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
            onClick={() => {
              setSelectedUser(typedRow);
              setfirstName(typedRow.firstName);
              setlastName(typedRow.lastName || '');
              setEditEmail(typedRow.email);
              setEditStatus(typedRow.moderation_status); // <--- edit modal uses moderation_status
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
    { key: 'reportedUser', label: 'Reported User', render: (value: any) => value?.firstName },
    { key: 'reporter', label: 'Reported By', render: (value: any) => value?.firstName },
    { key: 'reason', label: 'Reason' },
    { key: 'created_at', label: 'Report Date' },

    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => {
        const colors: Record<ReportStatus, string> = {
          active: 'bg-green-100 text-green-800',
          blocked: 'bg-red-100 text-red-800',
          suspended: 'bg-yellow-100 text-yellow-800'
        };
        const typedValue = (value as ReportStatus) ?? 'active';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[typedValue]}`}>
            {typedValue}
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
    return <div className="p-6">Loading users...</div>;
  }

  // -------------------------------------
  // MAIN RETURN
  // -------------------------------------
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Tabs
        tabs={[
          {
            key: 'users',
            label: `All Users (${users.length})`,
            content: (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className='w-full md:w-1/2'>
                    <Select
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

                  <Button variant="primary" onClick={exportCSV}>Export CSV</Button>
                </div>

                <Card>
                  <Table
                    columns={userColumns}
                    data={paginatedUsers}
                    pagination={{
                      currentPage,
                      totalPages,
                      onPageChange: setCurrentPage
                    }}
                  />
                </Card>
              </div>
            )
          },

          {
            key: 'reported',
            label: `Reported Users (${reportedUsers.length})`,
            content: (
              <Card>
                {reportedUsers.length > 0 ? (
                  <Table columns={reportedColumns} data={reportedUsers} />
                ) : (
                  <div className="p-4 text-center text-gray-500">No reported users</div>
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
          <div className="space-y-4">
            <Input label="First Name" value={editfirstName} onChange={(e) => setfirstName(e.target.value)} />
            <Input label="Last Name" value={editlastName} onChange={(e) => setlastName(e.target.value)} />
            <Input label="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />

            <Select
              label="Status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as UserStatus)}
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
        title="User Activity Logs"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-medium">{selectedUser._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{selectedUser.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Wallet Coins</p>
                <p className="font-medium">{selectedUser.wallet_balance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="font-medium">₹{selectedUser.totalSpent}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recent Activity</h4>

              {activityLoading ? (
                <p className="text-sm text-gray-500">Loading activity...</p>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                      {activity}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent activity available</p>
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
        title="Update Report Status"
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
                  // SEND TO BACKEND
                  const updated = await updateReportStatus(
                    selectedReport._id,
                    reportStatus
                  );

                  // UPDATE UI
                  setReportedUsers((prev) =>
                    prev.map((report) =>
                      report._id === selectedReport._id ? { ...report, status: reportStatus } : report
                    )
                  );

                  setIsActionModalOpen(false);
                  setSelectedReport(null);
                } catch (err: any) {
                  alert(err?.response?.data?.message || "Failed to update report");
                }
              }}
            >
              Save
            </Button>
          </>
        }
      >
        {selectedReport && (
          <div className="space-y-4">
            <Select
              label="Update Status"
              value={reportStatus}
              onChange={(e) => setReportStatus(e.target.value as ReportStatus)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'blocked', label: 'Blocked' },
                { value: 'suspended', label: 'Suspended' }
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

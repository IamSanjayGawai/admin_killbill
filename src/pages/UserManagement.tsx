import { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Tabs from '../components/Tabs';
import { Search, Edit, Eye } from 'lucide-react';
import { generateMockUsers, generateMockReportedUsers } from '../utils/mockData';

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  

  const [users, setUsers] = useState(()=> generateMockUsers(50));
  const [mockReportedUsers,setMockReportedUsers] = useState(()=>generateMockReportedUsers(20)
) 

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // TEMP DATA FOR EDIT MODAL INPUTS  
  const [editfirstName, setfirstName] = useState("");
  const [editlastName, setlastName] = useState("");
  const [editStatus, setEditStatus] = useState("active");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedReport,setSelectedReport] = useState(null);
  const[reportStatus,setReportStatus] = useState("");
  // Export CSV Function

  const exportCSV = () =>{
    const headers = ['User ID' , 'Name' , 'Email', 'Status', 'Joined Date','Coins'];

    const rows = users.map((u)=> [u.id, u.name,u.email,u.status,u.joinedDate,u.coins])

    let csvContent = 'data:text/csv;charset=utf-8';
    csvContent += headers.join(",") + "\n";
    rows.forEach((row)=>{
      csvContent += row.join(",") + '\n';
    });

    const encodeUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute("href",encodeUri);
    link.setAttribute('download','users_list.csv');
    document.body.appendChild(link);
    link.click();
  };

  // ---------------------------------
  // TABLE COLUMNS
  // ---------------------------------
  const userColumns = [
    { key: 'id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          active: 'bg-green-100 text-green-800',
          blocked: 'bg-red-100 text-red-800',
          suspended: 'bg-yellow-100 text-yellow-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value]}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'joinedDate', label: 'Joined Date' },
    { key: 'coins', label: 'Coins' },

    // ACTIONS (Removed Block/Unblock button as you requested)
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedUser(row);
              setIsViewModalOpen(true);
            }}
          >
            <Eye size={16} />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSelectedUser(row);
              setEditingUserId(row.id);
              setfirstName(row.firstName ?? row.name ?? "");
              setlastName(row.lastName ?? "");
              setEditStatus(row.status);
              setIsEditModalOpen(true);
            }}
          >
            <Edit size={16} />
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
      render: (value) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          reviewed: 'bg-blue-100 text-blue-800',
          action_taken: 'bg-green-100 text-green-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value]}`}>
            {value.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          {/* <Button size="sm" variant="primary">Review</Button> */}

          <Button size="sm" variant="danger" onClick={()=>{setSelectedReport(row);
            setReportStatus(row.status);
            setIsActionModalOpen(true);

          }}

          >Take Action</Button>
        </div>
      ),
    },
  ];

  // ---------------------------------
  // HANDLE SAVE FROM EDIT MODAL
  // ---------------------------------
  // const handleSave = () => {
  //   if (!selectedUser) return;
  
  //   const updated = users.map((u) =>
  //     u.id === selectedUser.id
  //       ? {
  //           ...u,
  //           name: `${editfirstName} ${editlastName}`,
  //           status: editStatus
  //         }
  //       : u
  //   );
  
  //   setUsers(updated);
  //   setIsEditModalOpen(false);
  // };

  // And handleSave:
const handleSave = () => {
  if (!editingUserId) return;
  const updated = users.map(u => 
    u.id === editingUserId
      ? { ...u, firstName: editfirstName, lastName: editlastName, status: editStatus }
      : u
  );
  setUsers(updated);
  setIsEditModalOpen(false);
};
  

  // ---------------------------------
  // USERS TAB
  // ---------------------------------
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

        <Button variant="primary" onClick={exportCSV}>Export CSV</Button>
      </div>

      <Card>
        <Table
          columns={userColumns}
          data={users.slice((currentPage - 1) * 10, currentPage * 10)}
          pagination={{
            currentPage,
            totalPages: Math.ceil(users.length / 10),
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

  // ---------------------------------
  // RETURN JSX
  // ---------------------------------
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
      </div>

      <Tabs
        tabs={[
          {
            key:'users',
            label:`All Users (${users.length})`,
            content:usersTab
          },
          {
            key:'reported',
            label:`Reported Users (${mockReportedUsers.length})`,
            content:reportedUsersTab
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
            <Input label="FirstName" value={editfirstName} onChange={(e) => setfirstName(e.target.value)} />
            <Input label="LastName" value={editlastName} onChange={(e) => setlastName(e.target.value)} />
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
                <p className="font-medium">₹{selectedUser.totalSpent}</p>
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
      <Modal
  isOpen={isActionModalOpen}
  onClose={() => setIsActionModalOpen(false)}
  title="Update Report Status"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsActionModalOpen(false)}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          // UPDATE STATUS LOGIC (extend if needed)
          setMockReportedUsers(prev=>
            prev.map(r=>
              r.id === selectedReport.id ? {...r, status: reportStatus}
              : r
            )
          );
          setIsActionModalOpen(false);
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
        onChange={(e) => setReportStatus(e.target.value)}
        options={[
          { value: "active", label: "Active" },
          { value: "blocked", label: "Blocked" },
          { value: "suspended", label: "Suspended" }
        ]}
      />
    </div>
  )}
</Modal>

    </div>
  );
}

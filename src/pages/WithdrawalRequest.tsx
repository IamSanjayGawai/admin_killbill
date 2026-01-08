

import { useState } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";

import { mockWithdrawRequests } from "../utils/mockData";

// Icons
import { 
  CheckCircle,
  Edit
} from "lucide-react";
import { Wallet, Clock, CheckCircle2, XCircle } from "lucide-react";


export default function WithdrawalRequests() {
  const [withdrawRequests, setWithdrawRequests] = useState(mockWithdrawRequests);
  const [selectedWithdraw, setSelectedWithdraw] = useState<any>(null);
  
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editStatus, setEditStatus] = useState("");

  // Summary Calculations
  const totalAmount = withdrawRequests.reduce((sum, req) => sum + req.amount, 0);
  const pending = withdrawRequests.filter((r) => r.status === "pending").length;
  const approved = withdrawRequests.filter((r) => r.status === "approved").length;
  const rejected = withdrawRequests.filter((r) => r.status === "rejected").length;

  const handleOpenEdit = (row: any) => {
    setSelectedWithdraw(row);
    setEditStatus(row.status);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setWithdrawRequests((prev) =>
      prev.map((req) =>
        req.id === selectedWithdraw.id
          ? { ...req, status: editStatus }
          : req
      )
    );
    setIsEditModalOpen(false);
  };

  const withdrawColumns = [
    { key: "id", label: "Request ID" },
    { key: "user", label: "User" },
    { key: "method", label: "Method" },
    {
      key: "amount",
      label: "Amount",
      render: (v: unknown) => `₹${v}`,
    },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => {
        const status = value as string;
        const colors: Record<string, string> = {
          pending: "bg-yellow-100 text-yellow-800",
          approved: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: unknown, row: any) => (
        <div className="flex gap-2">
          {/* <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSelectedWithdraw(row);
              setIsWithdrawModalOpen(true);
            }}
          >
            View
          </Button> */}

          <Button
            size="sm"
            variant="primary"
            onClick={() => handleOpenEdit(row)}
          >
            <Edit size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Withdrawal Requests</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card className="relative p-4">
          <p className="text-sm text-gray-500">Total Withdrawal Amount</p>
          <p className="text-xl font-bold">₹{totalAmount}</p>
          <div className="absolute top-4 right-4 p-2 bg-blue-100 rounded-full">
            <Wallet className="text-blue-600" size={23} />
          </div>
        </Card>

        <Card className="relative p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-bold">{pending}</p>
          <div className="absolute top-4 right-4 p-2 bg-yellow-100 rounded-full">
            <Clock className="text-yellow-600" size={24} />
          </div>
        </Card>

        <Card className="relative p-4">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-xl font-bold">{approved}</p>
          <div className="absolute top-4 right-4 p-2 bg-green-100 rounded-full">
            <CheckCircle2 className="text-green-600" size={24} />
          </div>
        </Card>

        <Card className="relative p-4">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-xl font-bold">{rejected}</p>
          <div className="absolute top-4 right-4 p-2 bg-red-100 rounded-full">
            <XCircle className="text-red-600" size={24} />
          </div>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <Table columns={withdrawColumns} data={withdrawRequests} />
      </Card>

      {/* VIEW MODAL */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdrawal Request Details"
        size="lg"
      >
        {selectedWithdraw && (
          <div className="space-y-2">
            <p><strong>User:</strong> {selectedWithdraw.user}</p>
            <p><strong>Method:</strong> {selectedWithdraw.method}</p>
            <p><strong>Amount:</strong> ₹{selectedWithdraw.amount}</p>
            <p><strong>Date:</strong> {selectedWithdraw.date}</p>
            <p><strong>Status:</strong> {selectedWithdraw.status}</p>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Withdrawal Status"
      >
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Status</span>
            <select
              className="mt-1 block w-full border rounded-lg p-2"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              className="px-4 py-2 bg-gray-300 rounded-lg"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={handleSaveEdit}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

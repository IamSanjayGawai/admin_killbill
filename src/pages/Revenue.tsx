import { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Tabs from '../components/Tabs';
import { Plus, Edit, Trash2, CheckCircle, XCircle, DollarSign, Coins as CoinsIcon } from 'lucide-react';
import { generateMockCoinPackages, generateMockGifts, generateMockWithdrawals } from '../utils/mockData';

export default function Revenue() {
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<ReturnType<typeof generateMockWithdrawals>[0] | null>(null);
  const [platformFee, setPlatformFee] = useState('30');
  const [hostFee, setHostFee] = useState('70');

  const mockCoinPackages = generateMockCoinPackages();
  const mockGifts = generateMockGifts();
  const mockWithdrawals = generateMockWithdrawals(25);

  const withdrawalColumns = [
    { key: 'id', label: 'Request ID' },
    { key: 'streamerName', label: 'Streamer Name' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: unknown) => `$${(value as number).toLocaleString()}`
    },
    {
      key: 'tds',
      label: 'TDS',
      render: (value: unknown) => `$${(value as number).toLocaleString()}`
    },
    {
      key: 'finalPayout',
      label: 'Final Payout',
      render: (value: unknown) => (
        <span className="font-semibold text-green-600">
          ${(value as number).toLocaleString()}
        </span>
      )
    },
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
    { key: 'requestDate', label: 'Request Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={() => {
                  setSelectedWithdrawal(row as ReturnType<typeof generateMockWithdrawals>[0]);
                  setIsWithdrawalModalOpen(true);
                }}
              >
                <CheckCircle size={14} />
              </Button>
              <Button size="sm" variant="danger">
                <XCircle size={14} />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const coinsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage coin packages and pricing</p>
        <Button variant="primary" onClick={() => setIsCoinModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mockCoinPackages.map((pkg) => (
          <Card key={pkg.id} className={pkg.popular ? 'ring-2 ring-blue-500' : ''}>
            <div className="text-center">
              {pkg.popular && (
                <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full mb-2">
                  Popular
                </span>
              )}
              <div className="text-4xl mb-2">
                <CoinsIcon className="mx-auto text-yellow-500" size={48} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{pkg.coins}</p>
              <p className="text-sm text-gray-600 mb-4">Coins</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${pkg.price}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1">
                  <Edit size={14} />
                </Button>
                <Button size="sm" variant="danger">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const giftsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage gift items and animations</p>
        <Button variant="primary" onClick={() => setIsGiftModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Gift
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mockGifts.map((gift) => (
          <Card key={gift.id}>
            <div className="text-center">
              <div className="text-5xl mb-3">{gift.icon}</div>
              <p className="font-semibold text-gray-900 mb-1">{gift.name}</p>
              <p className="text-sm text-gray-600 mb-2">Animation: {gift.animation}</p>
              <p className="text-lg font-bold text-blue-600 mb-4">
                {gift.price} coins
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1">
                  <Edit size={14} />
                </Button>
                <Button size="sm" variant="danger">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const feesTab = (
    <div className="space-y-6">
      <Card title="Platform & Host Fee Settings">
        <div className="space-y-6">
          <div>
            <p className="text-gray-700 mb-4">
              Configure the revenue split between the platform and streamers. Total must equal 100%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Fee (%)
              </label>
              <Input
                type="number"
                value={platformFee}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setPlatformFee(val.toString());
                  setHostFee((100 - val).toString());
                }}
                min="0"
                max="100"
              />
              <p className="text-sm text-gray-600 mt-2">
                The percentage that goes to the platform
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Host Fee (%)
              </label>
              <Input
                type="number"
                value={hostFee}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setHostFee(val.toString());
                  setPlatformFee((100 - val).toString());
                }}
                min="0"
                max="100"
              />
              <p className="text-sm text-gray-600 mt-2">
                The percentage that goes to the streamer
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Example:</strong> If a user sends a gift worth 100 coins:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li>Platform receives: {platformFee} coins</li>
              <li>Streamer receives: {hostFee} coins</li>
            </ul>
          </div>

          <Button variant="primary">Save Fee Settings</Button>
        </div>
      </Card>
    </div>
  );

  const withdrawalsTab = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">
                {mockWithdrawals.filter(w => w.status === 'pending').length}
              </p>
            </div>
            <DollarSign className="text-yellow-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">$142,000</p>
            </div>
            <CoinsIcon className="text-blue-600" size={32} />
          </div>
        </Card>
      </div>

      <Card>
        <Table columns={withdrawalColumns} data={mockWithdrawals.slice(0, 10)} />
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Coins & Revenue Management</h1>
        <p className="text-gray-600 mt-1">Manage coin packages, gifts, and withdrawal requests</p>
      </div>

      <Tabs
        tabs={[
          { key: 'coins', label: 'Coin Packages', content: coinsTab },
          { key: 'gifts', label: 'Gifts', content: giftsTab },
          { key: 'fees', label: 'Platform Fees', content: feesTab },
          { key: 'withdrawals', label: 'Withdrawal Requests', content: withdrawalsTab }
        ]}
      />

      <Modal
        isOpen={isCoinModalOpen}
        onClose={() => setIsCoinModalOpen(false)}
        title="Add Coin Package"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCoinModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">Create Package</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Number of Coins" type="number" placeholder="1000" />
          <Input label="Price (USD)" type="number" placeholder="9.99" step="0.01" />
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Mark as Popular</span>
          </label>
        </div>
      </Modal>

      <Modal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        title="Add Gift"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsGiftModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">Create Gift</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Gift Name" placeholder="Diamond Ring" />
          <Input label="Price (Coins)" type="number" placeholder="100" />
          <Input label="Icon/Emoji" placeholder="💍" />
          <Input label="Animation Type" placeholder="sparkle" />
        </div>
      </Modal>

      <Modal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        title="Approve Withdrawal Request"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsWithdrawalModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="success">Approve & Process</Button>
          </>
        }
      >
        {selectedWithdrawal && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-4">
                Please review the withdrawal details before approving:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Streamer:</span>
                  <span className="font-medium">{selectedWithdrawal.streamerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Amount:</span>
                  <span className="font-medium">${selectedWithdrawal.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TDS Deducted:</span>
                  <span className="font-medium text-red-600">-${selectedWithdrawal.tds.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="font-semibold">Final Payout:</span>
                  <span className="font-bold text-green-600 text-lg">
                    ${selectedWithdrawal.finalPayout.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Bank Details:</p>
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-mono">{selectedWithdrawal.bankDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IFSC Code:</span>
                  <span className="font-mono">{selectedWithdrawal.bankDetails.ifsc}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Once approved, the payment will be processed within 2-3 business days.
                Make sure all details are verified before proceeding.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

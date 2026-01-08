import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import axios from 'axios';
import { ArrowLeft, History, Coins, Gift, Sparkles } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

type Transaction = {
  _id: string;
  transactionType: string;
  type?: "credit" | "debit"; // Wallet model has this field
  amount: number;
  balance_after?: number; // Wallet model uses snake_case
  balanceAfter?: number; // Mapped for UI
  reason?: string;
  created_at: string;
  metadata?: {
    giftName?: string;
    effectName?: string;
    [key: string]: any;
  };
  user?: {
    firstName: string;
    lastName?: string;
    email: string;
  };
};

export default function UserTransactionHistory() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'purchase_coins' | 'gift_sent' | 'entry_effect_purchase'>('All');
  const [userInfo, setUserInfo] = useState<{ firstName: string; lastName?: string; email: string } | null>(null);

  useEffect(() => {
    if (userId) {
      fetchTransactions();
      fetchUserInfo();
    }
  }, [userId, selectedFilter]);

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (res.data?.success && res.data.data) {
        setUserInfo({
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          email: res.data.data.email,
        });
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  const fetchTransactions = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      // Build params exactly like the app does
      const params: any = { limit: 100 }; // Get more transactions (same as app)
      if (selectedFilter !== 'All') {
        params.transactionType = selectedFilter;
      }

      console.log('Fetching transactions for userId:', userId);
      console.log('API URL:', `${API_BASE_URL}/api/wallet/transactions/${userId}`);
      console.log('Params:', params);

      // Try with userId in path first, fallback to query param
      let res;
      try {
        res = await axios.get(
          `${API_BASE_URL}/api/wallet/transactions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
            params,
          }
        );
      } catch (pathError: any) {
        // If path param doesn't work, try query param
        console.log('Path param failed, trying query param...');
        res = await axios.get(
          `${API_BASE_URL}/api/wallet/transactions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
            params: {
              ...params,
              userId: userId,
            },
          }
        );
      }

      console.log('Transaction API Response:', res.data);
      console.log('Response status:', res.status);

      if (res.data?.success) {
        const transactionsData = res.data.data?.transactions || res.data.data || [];
        console.log('Raw transactions data:', transactionsData);
        console.log('Transactions found:', transactionsData.length);
        
        if (transactionsData.length > 0) {
          console.log('Sample transaction (raw):', JSON.stringify(transactionsData[0], null, 2));
        }
        
        // Map balance_after (from wallet model) to balanceAfter for UI consistency
        // Also ensure type field is set correctly
        const mappedTransactions = transactionsData.map((tx: any) => {
          const mapped = {
            ...tx,
            balanceAfter: tx.balance_after !== undefined ? tx.balance_after : tx.balanceAfter,
            type: tx.type || (tx.transactionType === 'purchase_coins' || tx.transactionType === 'coin_purchase' ? 'credit' : 'debit'),
          };
          return mapped;
        });
        
        console.log('Mapped transactions count:', mappedTransactions.length);
        if (mappedTransactions.length > 0) {
          console.log('Sample mapped transaction:', JSON.stringify(mappedTransactions[0], null, 2));
        }
        setTransactions(mappedTransactions);
      } else {
        console.warn('API response not successful:', res.data);
        console.warn('Full response:', JSON.stringify(res.data, null, 2));
        setTransactions([]);
      }
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      console.error('Error response:', err?.response?.data);
      console.error('Error status:', err?.response?.status);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // Match app format
    });
  };

  const getTransactionIcon = (transactionType: string) => {
    switch (transactionType) {
      case 'purchase_coins':
      case 'coin_purchase': // Support both for backward compatibility
        return <Coins className="text-green-500" size={20} />;
      case 'gift_sent':
        return <Gift className="text-pink-500" size={20} />;
      case 'gift_received':
        return <Gift className="text-green-500" size={20} />;
      case 'entry_effect_purchase':
        return <Sparkles className="text-purple-500" size={20} />;
      default:
        return <Coins className="text-gray-500" size={20} />;
    }
  };

  const getTransactionTitle = (transaction: Transaction) => {
    const { transactionType, reason, metadata } = transaction;
    
    switch (transactionType) {
      case 'purchase_coins':
      case 'coin_purchase': // Support both for backward compatibility
        return 'Coin Purchase';
      case 'gift_sent':
        return metadata?.giftName ? `Sent ${metadata.giftName}` : 'Gift Sent';
      case 'gift_received':
        return metadata?.giftName ? `Received ${metadata.giftName}` : 'Gift Received';
      case 'entry_effect_purchase':
        return metadata?.effectName ? `Entry Effect: ${metadata.effectName}` : 'Entry Effect Purchase';
      default:
        return reason || 'Transaction';
    }
  };

  const getTransactionColor = (type: string) => {
    // Use type field (credit/debit) for color, matching the app
    if (type === 'credit') return 'text-green-600';
    if (type === 'debit') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTransactionSign = (tx: Transaction) => {
    // Use the type field (credit/debit) from wallet model, not transactionType
    if (tx.type === 'credit') return '+';
    return '-';
  };

  // Group transactions by date (exactly like the app)
  const groupedTransactions = () => {
    const grouped: Record<string, Transaction[]> = {};
    
    // Sort transactions by date first (most recent first)
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    });

    sortedTransactions.forEach((tx) => {
      const dateKey = formatDate(tx.created_at);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(tx);
    });
    
    return grouped;
  };
  
  // Get sorted date keys (Today first, then Yesterday, then by date)
  const getSortedDateKeys = (grouped: Record<string, Transaction[]>) => {
    return Object.keys(grouped).sort((a, b) => {
      if (a === 'Today') return -1;
      if (b === 'Today') return 1;
      if (a === 'Yesterday') return -1;
      if (b === 'Yesterday') return 1;
      
      // For other dates, compare by actual date
      const transA = grouped[a][0];
      const transB = grouped[b][0];
      const dateA = new Date(transA?.created_at || 0);
      const dateB = new Date(transB?.created_at || 0);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/users')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            {userInfo && (
              <p className="text-sm text-gray-600 mt-1">
                {userInfo.firstName} {userInfo.lastName || ''} • {userInfo.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="flex gap-2">
            {(['All', 'purchase_coins', 'gift_sent', 'entry_effect_purchase'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === filter
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'All' ? 'All' : 
                 filter === 'purchase_coins' ? 'Purchases' :
                 filter === 'gift_sent' ? 'Gifts' : 'Effects'}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-500">Loading transactions...</p>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
              <div className="inline-flex p-3 bg-gray-200 rounded-full mb-3">
                <History className="text-gray-400" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-600">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {(() => {
                const grouped = groupedTransactions();
                const dateKeys = getSortedDateKeys(grouped);
                return dateKeys.map((date) => (
                  <div key={date} className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-700 px-2 sticky top-0 bg-white py-2 z-10">
                      {date}
                    </h4>
                    {grouped[date].map((tx) => (
                    <div
                      key={tx._id}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
                          {getTransactionIcon(tx.transactionType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-gray-900 text-sm">
                                {getTransactionTitle(tx)}
                              </h5>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatTime(tx.created_at)}
                              </p>
                              {tx.reason && tx.reason !== getTransactionTitle(tx) && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {tx.reason}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className={`font-bold text-sm ${getTransactionColor(tx.type || 'debit')}`}>
                                {getTransactionSign(tx)}🪙 {tx.amount.toLocaleString()}
                              </p>
                              {(tx.balanceAfter !== undefined || tx.balance_after !== undefined) && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Balance: 🪙 {(tx.balanceAfter || tx.balance_after || 0).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}


import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import api from '../utils/api';
import { Plus, Edit, Pause, Play, Trash2, Search, Tag, Filter, X, TrendingUp, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

type DiscountType = 'PERCENT' | 'FLAT' | 'BONUS';
type ProductType = 'COIN' | 'GIFT' | 'ENTRY_EFFECT';
type OfferStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'SCHEDULED';

type Offer = {
  _id: string;
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  appliesTo: ProductType[];
  startAt?: string;
  endAt?: string;
  isActive: boolean;
  maxUsagePerUser?: number;
  maxTotalUsage?: number;
  totalUsed: number;
  createdAt: string;
  updatedAt: string;
  status?: OfferStatus;
};

export default function OfferManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'paused'>('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'PERCENT' as DiscountType,
    discountValue: 0,
    appliesTo: [] as ProductType[],
    startAt: '',
    endAt: '',
    isActive: true,
    maxUsagePerUser: '',
    maxTotalUsage: '',
  });

  useEffect(() => {
    fetchOffers();
  }, [statusFilter]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const res = await api.get('/api/admin/offers', { params });
      if (res.data.success) {
        setOffers(res.data.data.offers);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch offers');
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...formData,
        maxUsagePerUser: formData.maxUsagePerUser ? Number(formData.maxUsagePerUser) : undefined,
        maxTotalUsage: formData.maxTotalUsage ? Number(formData.maxTotalUsage) : undefined,
        startAt: formData.startAt || undefined,
        endAt: formData.endAt || undefined,
      };
      const res = await api.post('/api/admin/offers', payload);
      if (res.data.success) {
        setIsCreateModalOpen(false);
        resetForm();
        fetchOffers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create offer');
    }
  };

  const handleUpdate = async () => {
    if (!selectedOffer) return;
    try {
      const payload = {
        ...formData,
        maxUsagePerUser: formData.maxUsagePerUser ? Number(formData.maxUsagePerUser) : undefined,
        maxTotalUsage: formData.maxTotalUsage ? Number(formData.maxTotalUsage) : undefined,
        startAt: formData.startAt || undefined,
        endAt: formData.endAt || undefined,
      };
      const res = await api.put(`/api/admin/offers/${selectedOffer._id}`, payload);
      if (res.data.success) {
        setIsEditModalOpen(false);
        setSelectedOffer(null);
        resetForm();
        fetchOffers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update offer');
    }
  };

  const handleToggleStatus = async (offerId: string, currentStatus: boolean) => {
    try {
      const res = await api.patch(`/api/admin/offers/${offerId}/toggle`, {
        isActive: !currentStatus,
      });
      if (res.data.success) {
        fetchOffers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle offer status');
    }
  };

  const handleDelete = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer? Use force=true to delete even if it has been used.')) {
      return;
    }
    try {
      const res = await api.delete(`/api/admin/offers/${offerId}?force=true`);
      if (res.data.success) {
        fetchOffers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete offer');
    }
  };

  const openEditModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || '',
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      appliesTo: offer.appliesTo,
      startAt: offer.startAt ? new Date(offer.startAt).toISOString().slice(0, 16) : '',
      endAt: offer.endAt ? new Date(offer.endAt).toISOString().slice(0, 16) : '',
      isActive: offer.isActive,
      maxUsagePerUser: offer.maxUsagePerUser?.toString() || '',
      maxTotalUsage: offer.maxTotalUsage?.toString() || '',
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discountType: 'PERCENT',
      discountValue: 0,
      appliesTo: [],
      startAt: '',
      endAt: '',
      isActive: true,
      maxUsagePerUser: '',
      maxTotalUsage: '',
    });
  };

  const toggleAppliesTo = (type: ProductType) => {
    setFormData((prev) => ({
      ...prev,
      appliesTo: prev.appliesTo.includes(type)
        ? prev.appliesTo.filter((t) => t !== type)
        : [...prev.appliesTo, type],
    }));
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = !searchQuery || offer.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status?: OfferStatus) => {
    const statusConfig: Record<OfferStatus, { bg: string; text: string; border: string }> = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      PAUSED: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
      EXPIRED: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
      SCHEDULED: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    };
    const config = statusConfig[status || 'PAUSED'];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        {status || 'PAUSED'}
      </span>
    );
  };

  // Calculate stats
  const activeOffers = offers.filter(o => o.status === 'ACTIVE').length;
  const totalUsage = offers.reduce((sum, o) => sum + o.totalUsed, 0);

  const tableColumns = [
    { 
      key: 'title', 
      label: 'Offer Title',
      render: (value: unknown) => (
        <p className="font-semibold text-gray-900">{value as string}</p>
      )
    },
    { 
      key: 'discount', 
      label: 'Discount',
      render: (value: unknown, row: Record<string, unknown>) => {
        const offer = row as unknown as Offer;
        return (
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              offer.discountType === 'PERCENT' ? 'bg-blue-100' :
              offer.discountType === 'FLAT' ? 'bg-green-100' : 'bg-purple-100'
            }`}>
              <Tag className={`w-3 h-3 ${
                offer.discountType === 'PERCENT' ? 'text-blue-600' :
                offer.discountType === 'FLAT' ? 'text-green-600' : 'text-purple-600'
              }`} />
            </div>
            <span className="font-bold text-gray-900">{value as string}</span>
          </div>
        );
      }
    },
    { 
      key: 'appliesTo', 
      label: 'Applies To',
      render: (_value: unknown, row: Record<string, unknown>) => {
        const offer = row as unknown as Offer;
        const types = Array.isArray(offer.appliesTo) ? offer.appliesTo : [];
        if (types.length === 0) return <span className="text-gray-400 text-sm">None</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {types.map((type, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-200">
                {type.replace('_', ' ')}
              </span>
            ))}
          </div>
        );
      }
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (_value: unknown, row: Record<string, unknown>) => getStatusBadge(row.status as OfferStatus)
    },
    { 
      key: 'usage', 
      label: 'Usage',
      render: (value: unknown, row: Record<string, unknown>) => {
        const offer = row as unknown as Offer;
        const usage = value as string;
        const percentage = offer.maxTotalUsage 
          ? Math.round((offer.totalUsed / offer.maxTotalUsage) * 100)
          : 0;
        return (
          <div>
            <p className="font-semibold text-gray-900">{usage}</p>
            {offer.maxTotalUsage && (
              <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden w-20">
                <div 
                  className={`h-full rounded-full transition-all ${
                    percentage >= 90 ? 'bg-red-500' :
                    percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        );
      }
    },
    { 
      key: 'dates', 
      label: 'Valid Dates',
      render: (_value: unknown, row: Record<string, unknown>) => {
        const offer = row as unknown as Offer;
        if (!offer.startAt && !offer.endAt) {
          return <span className="text-gray-400 text-sm">No dates</span>;
        }
        return (
          <div className="text-sm space-y-1">
            {offer.startAt && (
              <p className="text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(offer.startAt).toLocaleDateString()}
              </p>
            )}
            {offer.endAt && (
              <p className="text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(offer.endAt).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      }
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (_value: unknown, row: Record<string, unknown>) => {
        const offer = row as unknown as Offer;
        return (
          <div key={offer._id} className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="hover:bg-blue-50 hover:text-blue-600"
              onClick={() => openEditModal(offer)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className={offer.isActive ? "hover:bg-yellow-50 hover:text-yellow-600" : "hover:bg-green-50 hover:text-green-600"}
              onClick={() => handleToggleStatus(offer._id, offer.isActive)}
            >
              {offer.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(offer._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    },
  ];

  const tableData = filteredOffers.map((offer) => ({
    title: offer.title,
    discount: `${offer.discountValue}${offer.discountType === 'PERCENT' ? '%' : offer.discountType === 'FLAT' ? ' ₹' : ''}`,
    appliesTo: offer.appliesTo.join(', '),
    status: offer.status,
    usage: `${offer.totalUsed}${offer.maxTotalUsage ? ` / ${offer.maxTotalUsage}` : ''}`,
    dates: offer.startAt || offer.endAt
      ? `${offer.startAt ? new Date(offer.startAt).toLocaleDateString() : 'N/A'} - ${offer.endAt ? new Date(offer.endAt).toLocaleDateString() : 'N/A'}`
      : 'No dates',
    actions: offer._id, // Just pass the ID, render function will handle the UI
    ...offer, // Spread the full offer object for access in render functions
  }));

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage promotional offers, discounts, and special deals</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Create Offer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Offers</p>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Tag className="text-white" size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-700">{offers.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Active Offers</p>
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle2 className="text-white" size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-700">{activeOffers}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Usage</p>
            <div className="p-2 bg-purple-500 rounded-lg">
              <TrendingUp className="text-white" size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-700">{totalUsage.toLocaleString()}</p>
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

      {/* Search and Filter Bar */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search offers by title..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'paused', label: 'Paused' },
                    { value: 'expired', label: 'Expired' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredOffers.length}</span> of{' '}
                <span className="font-bold text-gray-900">{offers.length}</span> offers
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
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-500">Loading offers...</p>
              </div>
            </div>
          ) : filteredOffers.length > 0 ? (
            <Table 
              columns={tableColumns} 
              data={tableData}
            />
          ) : (
            <div className="p-16 text-center">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <Tag className="text-gray-400" size={40} />
              </div>
              <p className="text-gray-700 font-semibold text-lg mb-1">No offers found</p>
              <p className="text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first offer to get started'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New Offer"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create Offer
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Offer Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="h-11"
              placeholder="e.g., Summer Sale 2024"
            />
            <Select
              label="Discount Type"
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
              options={[
                { value: 'PERCENT', label: 'Percentage (%)' },
                { value: 'FLAT', label: 'Flat Amount (₹)' },
                { value: 'BONUS', label: 'Bonus' },
              ]}
              className="h-11"
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            placeholder="Enter offer description..."
            className="h-20"
          />

          <Input
            label="Discount Value"
            type="number"
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
            required
            className="h-11"
            placeholder={formData.discountType === 'PERCENT' ? 'e.g., 20' : 'e.g., 100'}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Applies To
            </label>
            <div className="flex flex-wrap gap-3">
              {(['COIN', 'GIFT', 'ENTRY_EFFECT'] as ProductType[]).map((type) => (
                <label 
                  key={type} 
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.appliesTo.includes(type)
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.appliesTo.includes(type)}
                    onChange={() => toggleAppliesTo(type)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-medium">{type.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Start Date (optional)"
              type="datetime-local"
              value={formData.startAt}
              onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
              className="h-11"
            />
            <Input
              label="End Date (optional)"
              type="datetime-local"
              value={formData.endAt}
              onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Max Usage Per User (optional)"
              type="number"
              value={formData.maxUsagePerUser}
              onChange={(e) => setFormData({ ...formData, maxUsagePerUser: e.target.value })}
              className="h-11"
              placeholder="e.g., 5"
            />
            <Input
              label="Max Total Usage (optional)"
              type="number"
              value={formData.maxTotalUsage}
              onChange={(e) => setFormData({ ...formData, maxTotalUsage: e.target.value })}
              className="h-11"
              placeholder="e.g., 1000"
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOffer(null);
          resetForm();
        }}
        title="Edit Offer"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Update Offer
            </Button>
          </>
        }
      >
        {selectedOffer && (
          <div className="space-y-5">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Offer ID</p>
              <p className="text-sm font-mono font-bold text-gray-900 break-all">{selectedOffer._id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Offer Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="h-11"
              />
              <Select
                label="Discount Type"
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
                options={[
                  { value: 'PERCENT', label: 'Percentage (%)' },
                  { value: 'FLAT', label: 'Flat Amount (₹)' },
                  { value: 'BONUS', label: 'Bonus' },
                ]}
                className="h-11"
              />
            </div>

            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              className="h-20"
            />

            <Input
              label="Discount Value"
              type="number"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              required
              className="h-11"
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Applies To
              </label>
              <div className="flex flex-wrap gap-3">
                {(['COIN', 'GIFT', 'ENTRY_EFFECT'] as ProductType[]).map((type) => (
                  <label 
                    key={type} 
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.appliesTo.includes(type)
                        ? 'bg-blue-50 border-blue-400 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.appliesTo.includes(type)}
                      onChange={() => toggleAppliesTo(type)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="font-medium">{type.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Start Date (optional)"
                type="datetime-local"
                value={formData.startAt}
                onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                className="h-11"
              />
              <Input
                label="End Date (optional)"
                type="datetime-local"
                value={formData.endAt}
                onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Max Usage Per User (optional)"
                type="number"
                value={formData.maxUsagePerUser}
                onChange={(e) => setFormData({ ...formData, maxUsagePerUser: e.target.value })}
                className="h-11"
              />
              <Input
                label="Max Total Usage (optional)"
                type="number"
                value={formData.maxTotalUsage}
                onChange={(e) => setFormData({ ...formData, maxTotalUsage: e.target.value })}
                className="h-11"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


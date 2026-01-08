import { useState, useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import { Coins as CoinsIcon } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PlatformFees() {
  // ---------------- Fee Inputs ----------------
  const [initialFeeData, setInitialFeeData] = useState<any>(null);
  const [feeFormData, setFeeFormData] = useState({
    coinToInrRate: "",
    platformFee: "",
    hostFee: "",
    minWithdrawalAmount: "",
  });
  const [feeLoading, setFeeLoading] = useState<boolean>(false);
  const [feeError, setFeeError] = useState<string>("");

  // Fetch fee settings on component mount
  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_BASE_URL}/api/admin/fees-management`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const data = response.data.data;
        setInitialFeeData(data);
        setFeeFormData({
          coinToInrRate: data.coinToInrRate || "",
          platformFee: data.platformFee || 30,
          hostFee: data.hostFee || 70,
          minWithdrawalAmount: data.minWithdrawalAmount || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching fees:", error);
      // Set defaults if fetch fails
      const settings = error.response?.data?.data;
      if (settings) {
        setFeeFormData({
          coinToInrRate: settings.coinToInrRate?.toString() || "",
          platformFee: settings.platformFee?.toString() || "30",
          hostFee: settings.hostFee?.toString() || "70",
          minWithdrawalAmount: settings.minWithdrawalAmount?.toString() || "",
        });
      }
    }
  };

  const handleSaveFees = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeeError("");

    try {
      const coinToInrRateNum = parseFloat(feeFormData.coinToInrRate);
      const platformFeeNum = parseFloat(feeFormData.platformFee);
      const hostFeeNum = parseFloat(feeFormData.hostFee);
      const minWithdrawalAmountNum = parseFloat(feeFormData.minWithdrawalAmount);

      if (platformFeeNum + hostFeeNum !== 100) {
        setFeeError("Platform fee + Host fee must equal 100%");
        return;
      }

      setFeeLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/fees-management`,
        {
          coinToInrRate: coinToInrRateNum,
          platformFee: platformFeeNum,
          hostFee: hostFeeNum,
          minWithdrawalAmount: minWithdrawalAmountNum,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setInitialFeeData({
          ...initialFeeData,
          coinToInrRate: response.data.data.coinToInrRate,
          platformFee: response.data.data.platformFee,
          hostFee: response.data.data.hostFee,
          minWithdrawalAmount: response.data.data.minWithdrawalAmount,
          updatedAt: new Date().toISOString(),
        });
        alert("Fee settings saved successfully!");
      }
    } catch (error: any) {
      console.error("Error saving fees:", error);
      setFeeError(error.response?.data?.message || "Failed to save fee settings");
    } finally {
      setFeeLoading(false);
    }
  };

  const handleResetFees = () => {
    if (initialFeeData) {
      setFeeFormData({
        coinToInrRate: initialFeeData.coinToInrRate?.toString() || "",
        platformFee: initialFeeData.platformFee?.toString() || "30",
        hostFee: initialFeeData.hostFee?.toString() || "70",
        minWithdrawalAmount: initialFeeData.minWithdrawalAmount?.toString() || "",
      });
      setFeeError("");
    }
  };

  // Calculate totals
  const totalCommission = parseFloat(feeFormData.platformFee || "0") + parseFloat(feeFormData.hostFee || "0");
  const isCommissionValid = totalCommission === 100;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Fees & Revenue Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure commission rates, currency conversion, and withdrawal limits</p>
        </div>
        {initialFeeData?.updatedAt && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-xs text-gray-500">Last Updated</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(initialFeeData.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Platform Commission</p>
            <div className="p-2 bg-blue-500 rounded-lg">
              <CoinsIcon className="text-white" size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-700">{feeFormData.platformFee || 0}%</p>
          <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${parseFloat(feeFormData.platformFee || "0")}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Host Commission</p>
            <div className="p-2 bg-green-500 rounded-lg">
              <CoinsIcon className="text-white" size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-700">{feeFormData.hostFee || 0}%</p>
          <div className="mt-3 h-2 bg-green-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${parseFloat(feeFormData.hostFee || "0")}%` }}
            ></div>
          </div>
        </div>

        <div className={`rounded-xl p-5 border shadow-sm transition-all duration-300 ${
          isCommissionValid 
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200' 
            : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Commission</p>
            <div className={`p-2 rounded-lg ${isCommissionValid ? 'bg-emerald-500' : 'bg-amber-500'}`}>
              {isCommissionValid ? (
                <span className="text-white text-xs">✓</span>
              ) : (
                <span className="text-white text-xs">⚠</span>
              )}
            </div>
          </div>
          <p className={`text-3xl font-bold ${isCommissionValid ? 'text-emerald-700' : 'text-amber-700'}`}>
            {totalCommission.toFixed(2)}%
          </p>
          <p className={`text-xs mt-2 font-medium ${isCommissionValid ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isCommissionValid ? '✓ Balanced' : '⚠ Must equal 100%'}
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <Card className="overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Configuration Settings</h3>
          <p className="text-sm text-gray-500 mt-1">Update platform revenue settings below</p>
        </div>

        <form onSubmit={handleSaveFees} className="p-6 space-y-6">
          {feeError && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 flex items-start gap-3">
              <div className="p-2 bg-red-500 rounded-lg flex-shrink-0">
                <span className="text-white text-sm">⚠</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-600 mt-1">{feeError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coin Rate */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-base font-bold text-gray-800 mb-1">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <CoinsIcon className="text-blue-600" size={16} />
                </div>
                <span>Coin → INR Conversion Rate</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={feeFormData.coinToInrRate}
                onChange={(e) =>
                  setFeeFormData({ ...feeFormData, coinToInrRate: e.target.value })
                }
                required
                min="0"
                placeholder="1.00"
                className="h-12"
              />
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">1 Coin = ₹{feeFormData.coinToInrRate || 0}</span>
              </div>
            </div>

            {/* Min Withdrawal */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-base font-bold text-gray-800 mb-1">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <CoinsIcon className="text-green-600" size={16} />
                </div>
                <span>Minimum Withdrawal Amount</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={feeFormData.minWithdrawalAmount}
                onChange={(e) =>
                  setFeeFormData({ ...feeFormData, minWithdrawalAmount: e.target.value })
                }
                required
                min="0"
                placeholder="100.00"
                className="h-12"
              />
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">Minimum ₹{feeFormData.minWithdrawalAmount || 0} for withdrawal</span>
              </div>
            </div>

            {/* Platform Fee */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-base font-bold text-gray-800 mb-1">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <CoinsIcon className="text-indigo-600" size={16} />
                </div>
                <span>Platform Commission (%)</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={feeFormData.platformFee}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setFeeFormData({
                    ...feeFormData,
                    platformFee: e.target.value,
                    hostFee: (100 - val).toString(),
                  });
                }}
                required
                min="0"
                max="100"
                placeholder="30.00"
                className="h-12"
              />
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-sm font-medium text-indigo-700">Platform receives {feeFormData.platformFee || 0}% of revenue</span>
              </div>
            </div>

            {/* Host Fee */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-base font-bold text-gray-800 mb-1">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <CoinsIcon className="text-emerald-600" size={16} />
                </div>
                <span>Host Commission (%)</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={feeFormData.hostFee}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setFeeFormData({
                    ...feeFormData,
                    hostFee: e.target.value,
                    platformFee: (100 - val).toString(),
                  });
                }}
                required
                min="0"
                max="100"
                placeholder="70.00"
                className="h-12"
              />
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-emerald-700">Host receives {feeFormData.hostFee || 0}% of revenue</span>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 rounded-lg flex-shrink-0">
                <span className="text-white text-sm">ℹ</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">Important Notice</p>
                <p className="text-sm text-amber-700 mt-1">
                  Changes will apply only to <span className="font-bold">NEW</span> transactions. Existing transactions will continue with previous settings.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleResetFees}
              disabled={feeLoading}
              className="px-6"
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={feeLoading || !isCommissionValid}
              className="px-6"
            >
              {feeLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}


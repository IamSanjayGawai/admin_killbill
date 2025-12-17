import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Tabs from '../components/Tabs';
import { Bell, Moon, Sun, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const {
    mode,
    accentColor,
    setMode,
    setAccentColor,
    saveTheme,
    refresh,
    loading,
    saving,
    error,
    lastSyncedAt,
    dirty
  } = useTheme();
  const [notificationMessage, setNotificationMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!dirty) {
      setStatusMessage(null);
    }
  }, [dirty]);

  const handleSaveTheme = async () => {
    try {
      setStatusMessage(null);
      await saveTheme();
      setStatusMessage('Theme saved successfully');
    } catch (e: any) {
      setStatusMessage(e?.message || 'Failed to save theme');
    }
  };

  const appConfigTab = (
    <div className="space-y-6">
      <Card title="General Settings">
        <div className="space-y-4">
          <Input label="App Name" defaultValue="Ello Live" />
          <Input label="Support Email" type="email" defaultValue="support@ellolive.com" />
          <Input label="Contact Number" type="tel" defaultValue="+1 234 567 8900" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Mode
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Enable maintenance mode</span>
            </label>
          </div>
          <Button variant="primary">Save Changes</Button>
        </div>
      </Card>

      <Card title="Stream Settings">
        <div className="space-y-4">
          <Input
            label="Maximum Stream Duration (minutes)"
            type="number"
            defaultValue="180"
          />
          <Input
            label="Minimum Age Requirement"
            type="number"
            defaultValue="18"
          />
          <Select
            label="Default Stream Quality"
            options={[
              { value: '720p', label: '720p HD' },
              { value: '1080p', label: '1080p Full HD' },
              { value: 'auto', label: 'Auto' }
            ]}
            defaultValue="auto"
          />
          <Button variant="primary">Save Settings</Button>
        </div>
      </Card>
    </div>
  );

  const notificationsTab = (
    <Card title="Broadcast Notification">
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
          <Bell className="text-blue-600 mt-1" size={20} />
          <div>
            <p className="text-sm font-medium text-blue-900">Send Push Notification to All Users</p>
            <p className="text-xs text-blue-700 mt-1">
              This will send an immediate notification to all active users
            </p>
          </div>
        </div>

        <Input
          label="Notification Title"
          placeholder="Enter notification title..."
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter your message..."
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
          />
        </div>

        <Select
          label="Target Audience"
          options={[
            { value: 'all', label: 'All Users' },
            { value: 'streamers', label: 'Streamers Only' },
            { value: 'viewers', label: 'Viewers Only' },
            { value: 'active', label: 'Active Users (Last 7 Days)' }
          ]}
          defaultValue="all"
        />

        <div className="flex gap-3">
          <Button variant="primary">
            <Bell size={18} className="mr-2" />
            Send Notification
          </Button>
          <Button variant="secondary">Preview</Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Recent Notifications</h4>
          <div className="space-y-2">
            {[
              { title: 'New Feature Launch', date: 'Nov 9, 2025', recipients: 45892 },
              { title: 'Maintenance Update', date: 'Nov 8, 2025', recipients: 45892 },
              { title: 'Weekly Highlights', date: 'Nov 5, 2025', recipients: 45892 }
            ].map((notif, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{notif.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Sent to {notif.recipients.toLocaleString()} users
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{notif.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  const themeTab = (
    <Card title="Appearance Settings">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-primary font-medium">Theme Preferences</p>
            <p className="text-sm muted">
              Personalize the admin console and sync your preference across sessions.
            </p>
          </div>
          <div className="text-right text-sm muted">
            {dirty ? (
              <span className="text-[var(--accent-color)] font-medium">Unsaved changes</span>
            ) : (
              lastSyncedAt && <span>Updated {new Date(lastSyncedAt).toLocaleString()}</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Theme Preference
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setMode('light')}
              className={`p-4 border-2 rounded-lg transition-all ${
                mode === 'light' ? 'border-[var(--accent-color)] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Sun className="mx-auto mb-2 text-yellow-500" size={32} />
              <p className="font-medium text-gray-900">Light</p>
              <p className="text-xs text-gray-600 mt-1">Bright and clean</p>
            </button>

            <button
              onClick={() => setMode('dark')}
              className={`p-4 border-2 rounded-lg transition-all ${
                mode === 'dark' ? 'border-[var(--accent-color)] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Moon className="mx-auto mb-2 text-gray-700" size={32} />
              <p className="font-medium text-gray-900">Dark</p>
              <p className="text-xs text-gray-600 mt-1">Easy on the eyes</p>
            </button>

            <button
              onClick={() => setMode('auto')}
              className={`p-4 border-2 rounded-lg transition-all ${
                mode === 'auto' ? 'border-[var(--accent-color)] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="mx-auto mb-2 flex justify-center">
                <Sun className="text-yellow-500" size={24} />
                <Moon className="text-gray-700" size={24} />
              </div>
              <p className="font-medium text-gray-900">Auto</p>
              <p className="text-xs text-gray-600 mt-1">System default</p>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accent Color
          </label>
          <div className="flex gap-3">
            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
              <button
                key={color}
                className={`w-12 h-12 rounded-lg border-2 transition-transform ${
                  accentColor === color
                    ? 'border-[var(--accent-color)] scale-105'
                    : 'border-gray-300 hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setAccentColor(color)}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {statusMessage && <p className="text-green-600 text-sm">{statusMessage}</p>}

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={handleSaveTheme} disabled={saving || loading}>
            {saving ? 'Saving…' : 'Save & Apply'}
          </Button>
          <Button variant="secondary" onClick={() => refresh()} disabled={saving}>
            Reload from server
          </Button>
        </div>
      </div>
    </Card>
  );

  const paymentTab = (
    <div className="space-y-6">
      <Card title="Payment Gateway Configuration">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
            <CreditCard className="text-blue-600 mt-1" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">Configure Payment Methods</p>
              <p className="text-xs text-blue-700 mt-1">
                Set up payment gateways for coin purchases and withdrawals
              </p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm font-medium">Enable Stripe</span>
            </label>
            <Input label="Stripe Publishable Key" placeholder="pk_live_..." />
            <Input label="Stripe Secret Key" type="password" placeholder="sk_live_..." className="mt-2" />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm font-medium">Enable PayPal</span>
            </label>
            <Input label="PayPal Client ID" placeholder="client_id..." />
            <Input label="PayPal Secret" type="password" placeholder="secret..." className="mt-2" />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" className="rounded" />
              <span className="text-sm font-medium">Enable Razorpay</span>
            </label>
            <Input label="Razorpay Key ID" placeholder="rzp_live_..." />
            <Input label="Razorpay Key Secret" type="password" placeholder="secret..." className="mt-2" />
          </div>

          <Button variant="primary">Save Payment Settings</Button>
        </div>
      </Card>

      <Card title="UPI Settings (India)">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm font-medium">Enable UPI Payments</span>
            </label>
          </div>

          <Input label="UPI ID" placeholder="merchant@upi" />
          <Input label="Merchant Name" placeholder="Ello Live" />
          <Input label="Merchant Code" placeholder="1234" />

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>QR Code:</strong> Upload a UPI QR code for direct payments
            </p>
            <Button variant="secondary" size="sm" className="mt-2">
              Upload QR Code
            </Button>
          </div>

          <Button variant="primary">Save UPI Settings</Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure application settings and preferences</p>
      </div>

      <Tabs
        tabs={[
          { key: 'config', label: 'App Configuration', content: appConfigTab },
          { key: 'notifications', label: 'Notifications', content: notificationsTab },
          { key: 'theme', label: 'Theme', content: themeTab },
          { key: 'payment', label: 'Payment Gateway', content: paymentTab }
        ]}
      />
    </div>
  );
}

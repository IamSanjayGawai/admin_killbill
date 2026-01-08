import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, User, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { connectSocket, getSocket } from '../utils/socketService';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Toast from '../components/Toast';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Notification {
  _id: string;
  user: string | User;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

const NotificationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notification' | 'message'>('notification');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');
  const [sendToAll, setSendToAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
    
    // Connect socket
    const token = localStorage.getItem('adminToken');
    if (token) {
      connectSocket(token);
    }

    return () => {
      // Socket cleanup handled by service
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data?.success) {
        setUsers(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      showToast('Failed to fetch users', 'error');
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/admin/notifications?limit=50');
      if (response.data?.success) {
        setNotifications(response.data.data.notifications || []);
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      showToast('Title and body are required', 'error');
      return;
    }

    if (!sendToAll && selectedUsers.length === 0) {
      showToast('Please select users or enable "Send to All"', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/admin/notifications/send', {
        title: title.trim(),
        body: body.trim(),
        sendToAll,
        userIds: sendToAll ? undefined : selectedUsers,
        type: 'system',
      });

      if (response.data?.success) {
        showToast(
          `Notification sent to ${response.data.data.sentCount} user(s)`,
          'success'
        );
        setTitle('');
        setBody('');
        setSelectedUsers([]);
        setSendToAll(false);
        fetchNotifications();
      } else {
        showToast(response.data?.message || 'Failed to send notification', 'error');
      }
    } catch (error: any) {
      console.error('Error sending notification:', error);
      showToast(
        error.response?.data?.message || 'Failed to send notification',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      showToast('Message is required', 'error');
      return;
    }

    if (!sendToAll && selectedUsers.length === 0) {
      showToast('Please select users or enable "Send to All"', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/admin/messages/send', {
        message: message.trim(),
        sendToAll,
        userIds: sendToAll ? undefined : selectedUsers,
      });

      if (response.data?.success) {
        showToast(
          `Message sent to ${response.data.data.sentCount} user(s)`,
          'success'
        );
        setMessage('');
        setSelectedUsers([]);
        setSendToAll(false);
      } else {
        showToast(response.data?.message || 'Failed to send message', 'error');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      showToast(
        error.response?.data?.message || 'Failed to send message',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notification & Messages</h1>
          <p className="text-gray-400 mt-1">Send notifications and messages to users</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('notification')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'notification'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bell className="inline mr-2" size={18} />
          Send Notification
        </button>
        <button
          onClick={() => setActiveTab('message')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'message'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="inline mr-2" size={18} />
          Send Message
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Form */}
        <div className="lg:col-span-2">
          <Card>
            {activeTab === 'notification' ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Send Notification
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Notification title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Notification message"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendToAllNotification"
                    checked={sendToAll}
                    onChange={(e) => {
                      setSendToAll(e.target.checked);
                      if (e.target.checked) {
                        setSelectedUsers([]);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="sendToAllNotification"
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    Send to all users
                  </label>
                </div>

                <Button
                  onClick={handleSendNotification}
                  disabled={loading || !title.trim() || !body.trim()}
                  className="w-full"
                >
                  {loading ? 'Sending...' : 'Send Notification'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Send Message
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={6}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendToAllMessage"
                    checked={sendToAll}
                    onChange={(e) => {
                      setSendToAll(e.target.checked);
                      if (e.target.checked) {
                        setSelectedUsers([]);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="sendToAllMessage"
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    Send to all users
                  </label>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !message.trim()}
                  className="w-full"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* User Selection */}
        {!sendToAll && (
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                Select Users ({selectedUsers.length} selected)
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => toggleUserSelection(user._id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUsers.includes(user._id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <div className="flex-1">
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs opacity-75">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Recent Notifications */}
        <div className="lg:col-span-3">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Notifications
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No notifications yet</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-white">{notif.title}</p>
                        <p className="text-sm text-gray-400 mt-1">{notif.body}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            {typeof notif.user === 'object'
                              ? `${notif.user.firstName} ${notif.user.lastName}`
                              : 'User'}
                          </span>
                          <span>
                            {new Date(notif.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          notif.read
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {notif.read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default NotificationManagement;


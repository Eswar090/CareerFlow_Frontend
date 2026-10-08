import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import { Bell, Check, Trash2 } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data || res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, readStatus: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, readStatus: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {notifications.some(n => !n.readStatus) && (
          <button onClick={handleMarkAllAsRead} className="text-sm font-medium text-blue-600 hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-lg border">No notifications yet.</div>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => (
            <div key={n.id} className={`p-4 rounded-lg border flex gap-4 ${n.readStatus ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="mt-1">
                <Bell className={`w-5 h-5 ${n.readStatus ? 'text-gray-400' : 'text-blue-500'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${n.readStatus ? 'text-gray-900' : 'text-blue-900'}`}>{n.title}</h3>
                <p className={`text-sm mt-1 ${n.readStatus ? 'text-gray-600' : 'text-blue-800'}`}>{n.message}</p>
                <div className="text-xs text-gray-500 mt-2">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2">
                {!n.readStatus && (
                  <button onClick={() => handleMarkAsRead(n.id)} className="p-2 hover:bg-blue-100 rounded text-blue-600 tooltip" title="Mark as read">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(n.id)} className="p-2 hover:bg-gray-100 rounded text-red-500 tooltip" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;

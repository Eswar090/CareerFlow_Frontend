import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import { Bell, Check, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Activity Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Real-time updates on your job applications, placement drives, and interview invites.
          </p>
        </div>

        {notifications.some(n => !n.readStatus) && (
          <button 
            onClick={handleMarkAllAsRead} 
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <Check className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Checking your notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/40">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No notifications yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            You're completely up to date! System updates and application status changes will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div 
              key={n.id} 
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                n.readStatus 
                  ? 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 shadow-2xs' 
                  : 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/50 shadow-xs'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                n.readStatus ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              }`}>
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold text-sm ${n.readStatus ? 'text-slate-800 dark:text-slate-200' : 'text-slate-900 dark:text-white'}`}>
                    {n.title}
                  </h3>
                  {!n.readStatus && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!n.readStatus && (
                  <button 
                    onClick={() => handleMarkAsRead(n.id)} 
                    className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400 transition" 
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(n.id)} 
                  className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition" 
                  title="Delete notification"
                >
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

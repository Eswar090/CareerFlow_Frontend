import api from './api';

const notificationService = {
  getNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread'),
  markAsRead: (id) => api.patch(/notifications//read),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  deleteNotification: (id) => api.delete(/notifications/),
};
export default notificationService;

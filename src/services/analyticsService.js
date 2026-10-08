import api from './api';

const analyticsService = {
  getStudentAnalytics: async () => {
    const response = await api.get('/analytics/students/me');
    return response.data;
  },
  
  getRecruiterAnalytics: async () => {
    const response = await api.get('/analytics/recruiters/me');
    return response.data;
  },
  
  getAdminAnalytics: async () => {
    const response = await api.get('/analytics/admin');
    return response.data;
  }
};

export default analyticsService;


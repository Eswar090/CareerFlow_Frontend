import api from './api';

const careerPathService = {
  // Reference Guides & Directory (Public/Student)
  getCompanies: async (params = {}) => {
    const response = await api.get('/careerpath/companies', { params });
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await api.get(`/careerpath/companies/${id}`);
    return response.data;
  },

  getCategoryStats: async () => {
    const response = await api.get('/careerpath/categories');
    return response.data;
  },

  getRoles: async (params = {}) => {
    const response = await api.get('/careerpath/roles', { params });
    return response.data;
  },

  getRoleById: async (id) => {
    const response = await api.get(`/careerpath/roles/${id}`);
    return response.data;
  },

  compareCompanies: async (companyIds) => {
    const response = await api.post('/careerpath/compare', companyIds);
    return response.data;
  },

  // Student Personalized CareerPath
  getDashboard: async () => {
    const response = await api.get('/careerpath/me/dashboard');
    return response.data;
  },

  getSavedCompanies: async () => {
    const response = await api.get('/careerpath/me/saved-companies');
    return response.data;
  },

  saveCompany: async (companyId, targetRole = '', notes = '') => {
    const response = await api.post(`/careerpath/me/saved-companies/${companyId}`, null, {
      params: { targetRole, notes },
    });
    return response.data;
  },

  removeSavedCompany: async (companyId) => {
    const response = await api.delete(`/careerpath/me/saved-companies/${companyId}`);
    return response.data;
  },

  getRoadmaps: async () => {
    const response = await api.get('/careerpath/me/roadmaps');
    return response.data;
  },

  getRoadmapById: async (roadmapId) => {
    const response = await api.get(`/careerpath/me/roadmaps/${roadmapId}`);
    return response.data;
  },

  createRoadmap: async (data) => {
    const response = await api.post('/careerpath/me/roadmaps', data);
    return response.data;
  },

  updateTaskCompletion: async (roadmapId, taskId, completed) => {
    const response = await api.patch(`/careerpath/me/roadmaps/${roadmapId}/tasks/${taskId}`, {
      completed,
    });
    return response.data;
  },

  getReadiness: async () => {
    const response = await api.get('/careerpath/me/readiness');
    return response.data;
  },

  updateReadiness: async (data) => {
    const response = await api.put('/careerpath/me/readiness', data);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/careerpath/me/recommendations');
    return response.data;
  },
};

export default careerPathService;


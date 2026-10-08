import api from './api';

const jobService = {
  // Recruiter Endpoints
  getRecruiterJobs: async (params) => {
    const response = await api.get('/recruiters/me/jobs', { params });
    return response.data;
  },

  getRecruiterJobById: async (id) => {
    const response = await api.get(`/recruiters/me/jobs/${id}`);
    return response.data;
  },

  createJob: async (data) => {
    const response = await api.post('/recruiters/me/jobs', data);
    return response.data;
  },

  updateJob: async (id, data) => {
    const response = await api.put(`/recruiters/me/jobs/${id}`, data);
    return response.data;
  },

  updateJobStatus: async (id, status) => {
    const response = await api.patch(`/recruiters/me/jobs/${id}/status?status=${status}`);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/recruiters/me/jobs/${id}`);
    return response.data;
  },

  addJobSkill: async (id, data) => {
    const response = await api.post(`/recruiters/me/jobs/${id}/skills`, data);
    return response.data;
  },

  removeJobSkill: async (id, skillId) => {
    const response = await api.delete(`/recruiters/me/jobs/${id}/skills/${skillId}`);
    return response.data;
  },

  // Public/Student Endpoints
  searchJobs: async (params) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  getPublicJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
};

export default jobService;


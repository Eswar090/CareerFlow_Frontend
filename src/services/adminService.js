import api from './api';

const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  getUsers: (page = 0, size = 10, search = '', role = '', active = '') => {
    let url = `/admin/users?page=${page}&size=${size}`;
    if (search) url += `&search=${search}`;
    if (role) url += `&role=${role}`;
    if (active !== '') url += `&active=${active}`;
    return api.get(url);
  },
  
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, active) => api.patch(`/admin/users/${id}/status`, { active }),

  getCompanies: (page = 0, size = 10, search = '') => {
    let url = `/admin/companies?page=${page}&size=${size}`;
    if (search) url += `&search=${search}`;
    return api.get(url);
  },
  
  getCompanyDetails: (id) => api.get(`/admin/companies/${id}`),

  getJobs: (page = 0, size = 10, search = '', status = '', employmentType = '') => {
    let url = `/admin/jobs?page=${page}&size=${size}`;
    if (search) url += `&search=${search}`;
    if (status) url += `&status=${status}`;
    if (employmentType) url += `&employmentType=${employmentType}`;
    return api.get(url);
  },

  getJobDetails: (id) => api.get(`/admin/jobs/${id}`),
  updateJobStatus: (id, status) => api.patch(`/admin/jobs/${id}/status`, { status }),

  getApplications: (page = 0, size = 10, status = '') => {
    let url = `/admin/applications?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    return api.get(url);
  },

  getApplicationDetails: (id) => api.get(`/admin/applications/${id}`),

  getInterviews: (page = 0, size = 10, status = '') => {
    let url = `/admin/interviews?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    return api.get(url);
  }
};

export default adminService;


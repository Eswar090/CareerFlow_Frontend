import api from './api';

const applicationService = {
  // Student endpoints
  applyForJob: (jobId, data) => api.post(`/students/me/jobs/${jobId}/apply`, data),
  getStudentApplications: () => api.get('/students/me/applications'),
  getStudentApplicationDetails: (id) => api.get(`/students/me/applications/${id}`),
  withdrawApplication: (id) => api.patch(`/students/me/applications/${id}/withdraw`),
  
  // Recruiter endpoints
  getJobApplications: (jobId) => api.get(`/recruiters/me/jobs/${jobId}/applications`),
  updateApplicationStatus: (id, status) => api.patch(`/recruiters/me/applications/${id}/status`, { status })
};

export default applicationService;


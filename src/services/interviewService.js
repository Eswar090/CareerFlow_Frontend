import api from './api';

const interviewService = {
  createInterview: (applicationId, data) => api.post(`/recruiters/me/applications/${applicationId}/interviews`, data),
  getRecruiterInterviews: (page = 0, size = 10) => api.get(`/recruiters/me/interviews?page=${page}&size=${size}`),
  getStudentInterviews: (page = 0, size = 10) => api.get(`/students/me/interviews?page=${page}&size=${size}`),
  getRecruiterInterview: (id) => api.get(`/recruiters/me/interviews/${id}`),
  getStudentInterview: (id) => api.get(`/students/me/interviews/${id}`),
  updateInterview: (id, data) => api.put(`/recruiters/me/interviews/${id}`, data),
  updateInterviewStatus: (id, data) => api.patch(`/recruiters/me/interviews/${id}/status`, data),
  deleteInterview: (id) => api.delete(`/recruiters/me/interviews/${id}`),
};
export default interviewService;

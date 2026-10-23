import api from './api';

const applicationService = {
  // Student endpoints
  applyForJob: (jobIdOrData, maybeData) => {
    if (typeof jobIdOrData === 'object' && jobIdOrData !== null) {
      const { jobId, ...rest } = jobIdOrData;
      return api.post(`/students/me/jobs/${jobId}/apply`, rest);
    }
    return api.post(`/students/me/jobs/${jobIdOrData}/apply`, maybeData);
  },
  getStudentApplications: () => api.get('/students/me/applications'),
  getStudentApplicationDetails: (id) => api.get(`/students/me/applications/${id}`),
  withdrawApplication: (id) => api.patch(`/students/me/applications/${id}/withdraw`),
  
  // Recruiter endpoints
  getJobApplications: (jobId) => api.get(jobId ? `/recruiters/me/jobs/${jobId}/applications` : '/recruiters/me/applications'),
  getRecruiterApplications: (jobId) => api.get(jobId ? `/recruiters/me/applications?jobId=${jobId}` : '/recruiters/me/applications'),
  downloadApplicantResume: (applicationId) => api.get(`/recruiters/me/applications/${applicationId}/resume`, { responseType: 'blob' }),
  updateApplicationStatus: (id, status) => api.patch(`/recruiters/me/applications/${id}/status`, { status })
};

export default applicationService;

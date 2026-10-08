import api from './api';

const matchingService = {
  /** GET /api/jobs/{jobId}/match – student's skill match for a job */
  getMatch: (jobId) => api.get(`/jobs/${jobId}/match`),

  /** GET /api/jobs/{jobId}/skill-gap – student's skill gap for a job */
  getSkillGap: (jobId) => api.get(`/jobs/${jobId}/skill-gap`),

  /** GET /api/recruiters/me/applications/{id}/match – recruiter view of applicant match */
  getApplicationMatch: (applicationId) =>
    api.get(`/recruiters/me/applications/${applicationId}/match`),
};

export default matchingService;


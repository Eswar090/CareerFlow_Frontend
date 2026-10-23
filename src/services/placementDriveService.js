import api from './api';

const placementDriveService = {
  // --- Public / Student ---
  getPublishedDrives: (params) => api.get('/placement-drives', { params }),
  getDriveDetails: (id) => api.get(`/placement-drives/${id}`),

  // --- Student Me ---
  checkEligibility: (driveId) => api.get(`/students/me/placement-drives/${driveId}/eligibility`),
  registerForDrive: (driveId) => api.post(`/students/me/placement-drives/${driveId}/register`),
  withdrawRegistration: (driveId) => api.patch(`/students/me/placement-drives/${driveId}/withdraw`),
  getMyRegistrations: () => api.get('/students/me/placement-drives'),

  // --- Admin ---
  getAdminDrives: (params) => api.get('/admin/placement-drives', { params }),
  getAdminDriveDetails: (id) => api.get(`/admin/placement-drives/${id}`),
  createDrive: (data) => api.post('/admin/placement-drives', data),
  updateDrive: (id, data) => api.put(`/admin/placement-drives/${id}`, data),
  updateDriveStatus: (id, status) => api.patch(`/admin/placement-drives/${id}/status`, { status }),
  getAdminDriveRegistrations: (id, params) => api.get(`/admin/placement-drives/${id}/registrations`, { params }),
  updateRegistrationStatusByAdmin: (regId, data) => api.patch(`/admin/placement-drives/registrations/${regId}/status`, data),

  // --- Recruiter ---
  getRecruiterDriveStats: () => api.get('/recruiter/placement-drives/stats'),
  createRecruiterDrive: (data) => api.post('/recruiter/placement-drives', data),
  getRecruiterDrives: (params) => api.get('/recruiter/placement-drives', { params }),
  getRecruiterDriveDetails: (id) => api.get(`/recruiter/placement-drives/${id}`),
  updateRecruiterDrive: (id, data) => api.put(`/recruiter/placement-drives/${id}`, data),
  updateRecruiterDriveStatus: (id, status) => api.patch(`/recruiter/placement-drives/${id}/status`, { status }),
  getRecruiterDriveCandidates: (id, params) => api.get(`/recruiter/placement-drives/${id}/candidates`, { params }),
  updateCandidateStatusByRecruiter: (regId, data) => api.patch(`/recruiter/placement-drives/registrations/${regId}/status`, data),
};

export default placementDriveService;


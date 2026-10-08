import api from './api';

// Student Profile
export const getStudentProfile = () => api.get('/students/me');
export const updateStudentProfile = (data) => api.put('/students/me', data);

// Skills
export const getSkillLibrary = () => api.get('/skills');
export const getMySkills = () => api.get('/students/me/skills');
export const addSkill = (data) => api.post('/students/me/skills', data);
export const removeSkill = (studentSkillId) => api.delete(`/students/me/skills/${studentSkillId}`);

// Projects
export const getMyProjects = () => api.get('/students/me/projects');
export const createProject = (data) => api.post('/students/me/projects', data);
export const updateProject = (id, data) => api.put(`/students/me/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/students/me/projects/${id}`);

// Certifications
export const getMyCertifications = () => api.get('/students/me/certifications');
export const createCertification = (data) => api.post('/students/me/certifications', data);
export const updateCertification = (id, data) => api.put(`/students/me/certifications/${id}`, data);
export const deleteCertification = (id) => api.delete(`/students/me/certifications/${id}`);

// Resumes
export const getMyResumes = () => api.get('/students/me/resumes');
export const uploadResume = (formData) => api.post('/students/me/resumes', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteResume = (id) => api.delete(`/students/me/resumes/${id}`);
export const getResumeDownloadUrl = (id) => `/api/students/me/resumes/${id}/download`;


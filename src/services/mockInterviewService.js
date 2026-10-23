import api from './api';

const mockInterviewService = {
  getQuestions: (roleTrack = '') => {
    const params = roleTrack && roleTrack !== 'ALL' ? { roleTrack } : {};
    return api.get('/students/me/mock-interviews', { params });
  },
  savePractice: (questionId, data) => api.put(`/students/me/mock-interviews/${questionId}/practice`, data)
};

export default mockInterviewService;


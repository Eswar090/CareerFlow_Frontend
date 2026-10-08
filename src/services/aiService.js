import api from './api';

const aiService = {
  /** POST /api/ai/resume/analyze – analyze the student's active resume */
  analyzeResume: () => api.post('/ai/resume/analyze'),

  /** POST /api/ai/jobs/{jobId}/analyze – AI explanation of a job role */
  analyzeJob: (jobId) => api.post(`/ai/jobs/${jobId}/analyze`),

  /** GET /api/ai/jobs/{jobId}/skill-gap-analysis – AI skill-gap explanation */
  getSkillGapAnalysis: (jobId) => api.get(`/ai/jobs/${jobId}/skill-gap-analysis`),

  /** GET /api/ai/jobs/{jobId}/learning-roadmap – personalized roadmap */
  getLearningRoadmap: (jobId) => api.get(`/ai/jobs/${jobId}/learning-roadmap`),

  /** GET /api/ai/career/recommendations – personalized career recommendations */
  getCareerRecommendations: () => api.get('/ai/career/recommendations'),
};

export default aiService;

